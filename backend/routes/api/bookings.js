const express = require('express');
const { Booking, SpotImage, Spot } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

router.use(restoreUser);

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
        Bookings: updatedBookings
    });
});

//Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async(req, res, _next) => {
    const currentUser = req.user;
    const { startDate, endDate} = req.body;
    const bookingId = req.params.bookingId;

    const targetBooking = await Booking.findByPk(bookingId);

    if(!targetBooking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    if(currentUser.id !== targetBooking.userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    if(startDate) targetBooking.startDate = startDate;
    if(endDate) targetBooking.endDate = endDate;

    await targetBooking.save();

    res.json(targetBooking);

});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res, _next) => {
    const currentUser = req.user;
    const bookingId = req.params.bookingId;

    const targetBooking = await Booking.findByPk(bookingId);

    if(!targetBooking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    if(currentUser.id !== targetBooking.userId && currentUser.id !== targetBooking.spotId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const existStartDate = new Date(targetBooking.startDate);
    const today = new Date();
    if(today >= existStartDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    const deletedBooking = await targetBooking.destroy();

    res.json({
        message: 'Successfully deleted'
    })
});







module.exports = router;