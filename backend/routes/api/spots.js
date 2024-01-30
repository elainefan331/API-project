const express = require('express');
const { Spot, User, SpotImage, Review } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();

router.use(restoreUser);

router.get('/', async(req, res, _next) => {
    console.log('Accessing all spots');
    const allSpots = await Spot.findAll();
    
    res.json(allSpots);
});

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






module.exports = router;