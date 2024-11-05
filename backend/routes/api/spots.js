const express = require('express');
const { Spot } = require('../../db/models');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const validateCreateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Address is required'),
    check('city')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Latitude is required'),
    check('lng')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Longitude is required'),
    check('name')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Name is required'),
    check('description')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Price is required'),
    handleValidationErrors
  ];

// // Create new spot
router.post('/', validateCreateSpot, async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification required' });
        }

        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const currentUserId = req.user.id;
        const spot = await Spot.create({ ownerId: currentUserId, address, city, state, country, lat, lng, name, description, price });

        const returnSpot = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
        }


        return res.status(201).json({spot: returnSpot})
    }
)

// Get all spots
router.get('/', async (req,res) => {
    const spot = await Spot.findAll();

    const returnAllSpots = spot.map(spot => {
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.avgStarRating,
            previewImage: spot.previewImage,
        }
    })
    
    return res.status(200).json(await Spot.findAll())
})


// Get spots filtered
router.get('/filtered', async (req,res) => {

})

// Get spot details based on spot ID
router.get('/:spotId', async (req,res) => {
    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}})

    if (!spot) {
        return res.status(400).json({
           "message": "Spot couldn't be found"
        })
    }

    const returnSpot = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: spot.numReviews,
        avgStarRating: spot.avgStarRating,
        // add SpotImages
    }

    return res.status(200).json(returnSpot)

})

// Delete spot
router.delete('/:spotId', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentification required' });
    }
    
    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}})

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    if (!spot) {
        return res.status(400).json({
           "message": "Spot couldn't be found"
        })
    }

    await Spot.destroy({
        where: { id: spotId }
    });

    return res.json({ message: 'Successfully deleted' });
    }
  );

// Edits spot
router.put('/:spotId', async (req, res) => {
})


// Adds image to spot
router.post('/:spotId', async (req, res) => {
})

// Delete image from spot
router.post('/:spotId/:imageId', async (req, res) => {
})


// Get reviews for spot
router.put('/:spotId/reviews', async (req, res) => {
})

//danish chill dont do these rn 
// Creates review for spot
router.post('/:spotId/reviews', async (req, res) => {
})


// Get bookings for spot
router.get('/:spotId/bookings', async (req, res) => {
})

// Create booking for spot
router.post('/:spotId/bookings', async (req, res) => {
})

module.exports = router;

// module.exports = {
//     validateCreateSpot
//   };