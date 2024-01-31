const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({min:1, max:5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

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

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    const targetReview = await Review.findByPk(reviewId);
    const allImages = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    });

    if(allImages.length >= 10) {
        return res.status(403).json({
            message: 'Maximum number of images for this resource was reached'
        })
    }

    if(!targetReview) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(currentUser.id !== targetReview.userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const newImage = await targetReview.createReviewImage({
        url
    });

    const responseObj = {
        id: newImage.id,
        url: newImage.url
    }

    res.json(responseObj);
});

//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async(req, res, _next) => {
    const currentUser = req.user;
    const { review, stars } = req.body;
    const reviewId = req.params.reviewId;

    const targetReview = await Review.findByPk(reviewId);

    if(!targetReview) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    if(currentUser.id !== targetReview.userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    if(review) targetReview.review = review;
    if(stars) targetReview.stars = stars;

    await targetReview.save();

    res.json(targetReview);
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const reviewId = req.params.reviewId;
    try {
        const targetReview = await Review.findByPk(reviewId);
    
        if(!targetReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }
    
        if(currentUser.id !== targetReview.userId) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
    
        const deletedReview = await targetReview.destroy();
    
        res.json({
            message: 'Successfully deleted'
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message, // Send the error message back in the response
            stack: error.stack // Optional: include the stack trace for more detailed debugging
        });
    }
});





module.exports = router;