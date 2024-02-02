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

        newBooking.Spot.lat = parseFloat(newBooking.Spot.lat);//for number
        newBooking.Spot.lng = parseFloat(newBooking.Spot.lng);//for number
        newBooking.Spot.price = parseFloat(newBooking.Spot.price);//for number datatype on render

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
    try{
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

        const existStartDate = new Date(targetBooking.startDate);
        const existEndDate = new Date(targetBooking.endDate);
        const today = new Date();

        if(today >= existEndDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
        }

        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);

        let spotId;
        if(targetBooking) {
            spotId = targetBooking.spotId;
        }

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

        if(startDate) targetBooking.startDate = startDate;
        if(endDate) targetBooking.endDate = endDate;

        await targetBooking.save();
    
        res.json(targetBooking);
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message, // Send the error message back in the response
            stack: error.stack // Optional: include the stack trace for more detailed debugging
        });
    }


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

    let spotId;
    let targetSpot;
    if(targetBooking) {
        spotId = targetBooking.spotId;
        targetSpot = await Spot.findByPk(spotId);
    }

    if(currentUser.id !== targetBooking.userId && currentUser.id !== targetSpot.ownerId) {
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