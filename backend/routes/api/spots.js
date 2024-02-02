const express = require('express');
const { Op } = require("sequelize");
const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
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
        .isFloat({min: 0})
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({min:1, max:5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

const validateBooking = [
    check('startDate', 'startDate cannot be in the past')
        .custom((value) => {
            let today = new Date();
            today.setHours(0, 0, 0);
            const startDate = new Date(value);
            return startDate >= today;
        }),
    check('endDate', 'endDate cannot be on or before startDate')
        .custom((value, {req}) => {
            const endDate = new Date(value);
            const startDate = new Date(req.body.startDate);
            return endDate > startDate
        }),
    handleValidationErrors
]

const validatePageSize = [
    check('page')
        .optional({checkFalsy: true})
        .isInt({min: 1, max: 10})
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional({checkFalsy: true})
        .isInt({min: 1, max: 20})
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .optional({checkFalsy: true})
        .isFloat({min: -90, max: 90})
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional({checkFalsy: true})
        .isFloat({min: -90, max: 90})
        .withMessage('Minimum latitude is invalid'),
    check('minLng')
        .optional({checkFalsy: true})
        .isFloat({min: -180, max: 180})
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional({checkFalsy: true})
        .isFloat({min: -180, max: 180})
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional({checkFalsy: true})
        .isFloat({min: 0})
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional({checkFalsy: true})
        .isFloat({min: 0})
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
]

router.use(restoreUser);

//get all spots
router.get('/', validatePageSize, async(req, res, _next) => {
    console.log('Accessing all spots');
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    
    let paginationObj = {};
    
    if(!size) size = 20;
    if(!page) page = 1;
    
    paginationObj.limit = size;
    paginationObj.offset = size * (page - 1);

    let where = {};
    if(minLat && maxLat) {
        where.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] }
    } else {
        if(minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
        if(maxLat) where.lat = { [Op.lte]: parseFloat(maxLat) };
    }

    if(minLng && maxLng) {
        where.lng = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] }
    } else {
        if(minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
        if(maxLng) where.lng = { [Op.lte]: parseFloat(maxLng) };
    }
    
    if(minPrice && maxPrice) {
        where.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] }
    } else {
        if(minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
        if(maxPrice) where.price = { [Op.lte]: parseFloat(maxPrice) };
    }
    
    const allSpots = await Spot.findAll({
        where,
        ...paginationObj
    });

    const updatedSpots = await Promise.all(allSpots.map(async(spot) => {
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
        if(spotImage.length >= 1) {
            spotObj.previewImage = spotImage[0].url;
        } else {
            spotObj.previewImage = "none"
        }

        spotObj.lat = parseFloat(spotObj.lat);//for number
        spotObj.lng = parseFloat(spotObj.lng);//for number
        spotObj.price = parseFloat(spotObj.price);//for number datatype on render

        return spotObj;

    }))

    page = parseInt(page);
    size = parseInt(size);
    res.json({
        Spots: updatedSpots,
        page: page,
        size: size
    });
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
        if(spotImage.length >= 1) {
            spotObj.previewImage = spotImage[0].url;
        } else {
            spotObj.previewImage = "none"
        }

        spotObj.lat = parseFloat(spotObj.lat);//for number
        spotObj.lng = parseFloat(spotObj.lng);//for number
        spotObj.price = parseFloat(spotObj.price);//for number datatype on live
        
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

    spotObj.lat = parseFloat(spotObj.lat);//for number
    spotObj.lng = parseFloat(spotObj.lng);//for number
    spotObj.price = parseFloat(spotObj.price);//for number datatype on live

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

    const spotObj = newSpot.toJSON();//for number
    spotObj.lat = parseFloat(spotObj.lat);//for number
    spotObj.lng = parseFloat(spotObj.lng);//for number
    spotObj.price = parseFloat(spotObj.price);//for number datatype on live

    

    res.status(201).json(spotObj);//turn newSpot to spotObj
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
    let {address, city, state, country, lat, lng, name, description, price} = req.body;//turn const to let

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
    if(lat) targetSpot.lat = parseFloat(lat);//for number
    if(lng) targetSpot.lng = parseFloat(lng);//for number
    if(name) targetSpot.name = name;
    if(description) targetSpot.description = description;
    if(price) targetSpot.price = parseFloat(price);//for number datatype on render

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
    });

});
//Reviews
//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req, res, _next) => {
    const spotId = req.params.spotId;
    const targetSpot = await Spot.findByPk(spotId);

    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes:['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    res.json({
        Reviews: reviews 
    })
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res, _next) => {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const targetSpot = await Spot.findByPk(spotId);

    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const targetReview = await Review.findAll({
        where: {
            userId: userId,
            spotId: spotId
        }
    });

    if(targetReview.length > 0) {
        return res.status(500).json({
            message: 'User already has a review for this spot'
        })
    }

    const newReview = await targetSpot.createReview({
        spotId,
        userId,
        review,
        stars
    });

    res.status(201).json(newReview);
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const spotId = req.params.spotId;

    const targetSpot = await Spot.findByPk(spotId);

    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if(currentUser.id == targetSpot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        return res.json({
            Bookings: bookings
        });
    }

    if(currentUser.id !== targetSpot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        });

        return res.json({
            Bookings: bookings
        });
    }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateBooking, async(req, res, _next) => {
    const currentUser = req.user;
    const userId = req.user.id;
    const spotId = req.params.spotId;
    let { startDate, endDate } = req.body;
    
    const targetSpot = await Spot.findByPk(spotId);
    
    if(!targetSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    
    if(currentUser.id == targetSpot.ownerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
   
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    const bookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    });

    for(let booking of bookings) {
        const existStartDate = new Date(booking.startDate);
        const existEndDate = new Date(booking.endDate);
      
        if((newStartDate >= existStartDate && newStartDate <= existEndDate) || (newEndDate >= existStartDate && newEndDate <= existEndDate) || (newStartDate <= existStartDate && newEndDate >= existEndDate)) {
            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                    startDate: 'Start date conflicts with an existing booking',
                    endDate: 'End date conflicts with an existing booking'
                }
            })
        }
    }

    const newBooking = await targetSpot.createBooking({
        spotId,
        userId,
        startDate,
        endDate
    });

    res.json(newBooking);
});







module.exports = router;