const express = require('express');
const { Booking, Sequelize } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const router = express.Router();

// Edit booking by ID
router.get('/:bookingId', async (req, res) => {
})

// Delete booking by ID
router.delete('/:bookingId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { bookingId } = req.params;
    const { booking } = await Booking.findbyPk(bookingId);
    const spot = await Spot.findbyPk(booking.spotId);

    if (booking.userId !== req.user.id && spot.ownerId !== req.user) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct
    if (!booking) {
        return res.status(404).json({
           "message": "Booking couldn't be found"
        })
    }

    if (booking.startDate >= Sequelize.literal('CURRENT TIMESTAMP')) {
        return res.status(403).json({ "message": "Bookings that have been started can't be deleted"})
    }

    await Booking.destroy({
        where: { id: bookingId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})

module.exports = router;