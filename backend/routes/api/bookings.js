const express = require('express');
const { Booking, Sequelize } = require('../../db/models');
const { Spot } = require('../../db/models');
const router = express.Router();


// Edit booking by ID
router.get('/:bookingId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findbyPk(bookingId);

    if (!booking) {
        return res.status(404).json({
           "message": "Booking couldn't be found"
        })
    }

    if (booking.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Data Validation
    if (booking.startDate < Sequelize.literal('CURRENT TIMESTAMP')) {
        return res.status(400).json( {"message": "startDate cannot be in the past"})}

    if (booking.endDate <= booking.startDate) {
        return res.status(400).json( {"message": "endDate cannot be on or before startDate"})}

    if (Sequelize.literal('CURRENT TIMESTAMP') > booking.endDate) {
        return res.status(403).json( {"message": "Past bookings can't be modified"})}

    // Check spot is already booked for dates
    const start = Date(startDate);
    const end = Date(endDate);

    const startConflict = await Booking.findOne({where: {
        spotId: booking.spotId,
        startDate: { [Op.between]: [start, end]}
    }})

    const endConflict = await Booking.findOne({where: {
        spotId: booking.spotId,
        endDate: {[Op.between]: [start, end]}
    }})

    if (startConflict) {return res.status(403).json(    {
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
        }
      })}

    if (endConflict) {return res.status(403).json(    {
    "message": "Sorry, this spot is already booked for the specified dates",
    "errors": {
        "endDate": "End date conflicts with an existing booking"
    }
    })}

    // Construct
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.updatedAt = Sequelize.literal('CURRENT TIMESTAMP');

    await booking.save();

    return res.status(200).json({
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    })
})

// Delete booking by ID
router.delete('/:bookingId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { bookingId } = req.params;
    const booking = await Booking.findbyPk(bookingId);
    const spot = await Spot.findbyPk(booking.spotId);

    if (!booking) {
        return res.status(404).json({
           "message": "Booking couldn't be found"
        })
    }

    if (booking.userId !== req.user.id && spot.ownerId !== req.user) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct

    if (booking.startDate >= Sequelize.literal('CURRENT TIMESTAMP')) {
        return res.status(403).json({ "message": "Bookings that have been started can't be deleted"})
    }

    await Booking.destroy({
        where: { id: bookingId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})

module.exports = router;