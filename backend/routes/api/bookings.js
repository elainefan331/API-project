const express = require('express');
const { Booking, SpotImage, Spot } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const bookings = await Booking.findAll({
        where: {
            userId: currentUser.id
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            }
        ]
    });

    const updatedBookings = [];

    for(let booking of bookings) {
        let previewImage = await SpotImage.findOne({
            where: {
                spotId: booking.spotId,
                preview: true
            },
            attributes: ['url']
        });

        const newBooking = booking.toJSON();
        if(previewImage) {
            newBooking.Spot.previewImage = previewImage.url
        } else {
            newBooking.Spot.previewImage = "none"
        }

        updatedBookings.push(newBooking)
    }

    res.json({
        Booking: updatedBookings
    });
});






module.exports = router;