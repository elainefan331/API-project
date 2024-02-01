const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.use(restoreUser);

//Delete a Spot Image
router.delete('/:imageId', requireAuth, async(req, res, _next) => {
    const imageId = req.params.imageId;
    const currentUser = req.user;

    const targetSpotImage = await SpotImage.findByPk(imageId);
    
    if(!targetSpotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }

    const spotId = targetSpotImage.spotId;
    const targetSpot = await Spot.findByPk(spotId);


    if(currentUser.id !== targetSpot.ownerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const deletedImage = await targetSpotImage.destroy();

    res.json({
        message: "Successfully deleted"
    });

});



module.exports = router;