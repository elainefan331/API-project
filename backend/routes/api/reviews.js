const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

const router = express.Router();

router.use(restoreUser);

//Get all Reviews of the Current User
router.get('/current', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const reviews = await Review.findAll({
        where: {
            userId: currentUser.id
        },
        include: [
            {
                model: User,
                attributes:['id', 'firstName', 'lastName']
            }, 
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: {
                    model: SpotImage,
                    as: 'previewImage',
                    attributes: ['url'],
                    where: {
                        preview: true
                    }

                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });


    const updatedReviews = reviews.map(review => {
        const updatedReview = review.toJSON();
        if(updatedReview.Spot.previewImage.length > 0) {
            updatedReview.Spot.previewImage = updatedReview.Spot.previewImage[0].url;
        } else {
            updatedReview.Spot.previewImage = null;
        }

        return updatedReview;
    })

    res.json({
        Reviews: updatedReviews
    });
});

//Get all Reviews by a Spot's id






module.exports = router;