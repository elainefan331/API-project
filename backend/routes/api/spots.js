const express = require('express');
const { Spot, User, SpotImage, Review } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .isFloat({min: -90, max: 90})
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({min: -180, max: 180})
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isFloat({min: 1})
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
]

router.use(restoreUser);

//get all spots
router.get('/', requireAuth, async(req, res, _next) => {
    console.log('Accessing all spots');
    const allSpots = await Spot.findAll();
    
    res.json(allSpots);
});

//get all spots owned by the current user
router.get('/current', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const spots = await Spot.findAll({
        where: {
            ownerId: currentUser.id
        }
    });

    const updatedSpots = [];

    for(let spot of spots) {
        let reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        });

        const spotImage = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
            }
        });

        let numReviews = reviews.length;
        let sumStarRating = reviews.reduce((acc, review) => acc + review.stars, 0);
        let avgRating = sumStarRating / numReviews;
        
        const spotObj = spot.toJSON();
        spotObj.avgRating = avgRating;
        spotObj.previewImage = spotImage[0].url || null;
        updatedSpots.push(spotObj)
    }

    res.json({
        Spots: updatedSpots
    });
});

//get details for a spot from an id
router.get('/:spotId', async(req, res, _next) => {
    const id = req.params.spotId;
    const spot = await Spot.findByPk(id, {
        include: [
            {
                model: SpotImage,
                attributes:['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    if(!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }

    const reviews = await Review.findAll({
        where: {
            spotId: id
        },
        attributes: ['stars']
    });

    let numReviews = reviews.length;
    let sumStarRating = reviews.reduce((acc, review) => acc + review.stars, 0);
    let avgStarRating = sumStarRating / numReviews;

    const spotObj = spot.toJSON();
    spotObj.numReviews = numReviews;
    spotObj.avgStarRating = avgStarRating;

    res.json(spotObj);
});

//create a spot
router.post('/', requireAuth, validateSpot, async(req, res, _next) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    res.status(201).json(newSpot);
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const spotId = req.params.spotId;
    const {url, preview} = req.body;

    const targetSpot = await Spot.findByPk(spotId);
    
    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if(currentUser.id !== targetSpot.ownerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const newImage = await targetSpot.createSpotImage({
        url,
        preview
    });

    const responseObj = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }
    res.json(responseObj);
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async(req, res, _next) => {
    const currentUser = req.user;
    const spotId = req.params.spotId;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const targetSpot = await Spot.findByPk(spotId);

    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if(currentUser.id !== targetSpot.ownerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    if(address) targetSpot.address = address;
    if(city) targetSpot.city = city;
    if(state) targetSpot.state = state;
    if(country) targetSpot.country = country;
    if(lat) targetSpot.lat = lat;
    if(lng) targetSpot.lng = lng;
    if(name) targetSpot.name = name;
    if(description) targetSpot.description = description;
    if(price) targetSpot.price = price;

    await targetSpot.save();

    res.json(targetSpot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const spotId = req.params.spotId;

    const targetSpot = await Spot.findByPk(spotId);

    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if(currentUser.id !== targetSpot.ownerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const deletedSpot = await targetSpot.destroy();

    res.json({
        message: "Successfully deleted"
    })
});









module.exports = router;