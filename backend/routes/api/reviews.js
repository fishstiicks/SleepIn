const express = require('express');
const { Review } = require('../../db/models');
const { reviewImage } = require('../../db/models');
const router = express.Router();

// Get review by ID
router.get('/:reviewId', async (req, res) => {
})

// Add image to review by ID
router.post('/:reviewId', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentification required' });
    }

    const { reviewId } = req.params;
    const { url } = req.body;
    const { review } = await Review.findOne({where: {id:reviewId}});

    if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const reviewImage = await reviewImage.create({ reviewId: reviewId, url });

    const returnReview = {
        id: reviewImage.id,
        url: reviewImage.url
    }

    return res.status(201).json({review: returnReview})
})

// Edit review by ID
router.put('/:reviewId', async (req, res) => {
})

// Delete review by ID
router.delete('/:reviewId', async (req, res) => {
})

// Delete image from review by IDs
router.delete('/:reviewId/:imageId', async(req, res) => {
})

module.exports = router;