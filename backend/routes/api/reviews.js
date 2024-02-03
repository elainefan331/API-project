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

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString()
      .replace(/T/, ' ')      // replace T with a space
      .replace(/\..+/, '');   // delete the dot and everything after
}

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
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const updatedReviews = [];
    
    for(let review of reviews) {
        let previewImage = await SpotImage.findOne({
            where: {
                spotId: review.spotId,
                preview: true
            },
            attributes: ['url']
        });

        const newReview = review.toJSON();
        
        if(previewImage) {
            newReview.Spot.previewImage = previewImage.url
        } else {
            newReview.Spot.previewImage = "none"
        }

        //format 
        newReview.createdAt = formatDate(newReview.createdAt);
        newReview.updatedAt = formatDate(newReview.updatedAt);
        

        newReview.Spot.lat = parseFloat(newReview.Spot.lat);//for number
        newReview.Spot.lng = parseFloat(newReview.Spot.lng);//for number
        newReview.Spot.price = parseFloat(newReview.Spot.price);//for number datatype on render

        updatedReviews.push(newReview)
    }

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

    //for formatting the date
    const reviewObj = targetReview.toJSON();
    reviewObj.createdAt = formatDate(reviewObj.createdAt);
    reviewObj.updatedAt = formatDate(reviewObj.updatedAt);

    res.json(reviewObj);//turn targetReview to reviewObj
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