const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

const router = express.Router();

router.use(restoreUser);

//Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res, _next) => {
    const imageId = req.params.imageId;
    const currentUser = req.user;

    const targetReviewImage = await ReviewImage.findByPk(imageId);

    if(!targetReviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    }

    const reviewId = targetReviewImage.reviewId;
    const targetReview = await Review.findByPk(reviewId);

    if(currentUser.id !== targetReview.userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const deletedImage = await targetReviewImage.destroy();

    res.json({
        message: "Successfully deleted"
    });
});


module.exports = router;