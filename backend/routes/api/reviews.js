const express = require('express');
const { Review } = require('../../db/models');
const { reviewImage } = require('../../db/models');
const router = express.Router();

// Get review by ID
router.get('/:reviewId', async (req, res) => {
})

// Add image to review by ID
router.post('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { reviewId } = req.params;
    const { review } = await Review.findbyPk(reviewId);

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct
    const { url } = req.body;
    const reviewImage = await reviewImage.create({ reviewId: reviewId, url });

    const returnReview = {
        id: reviewImage.id,
        url: reviewImage.url
    }

    return res.status(201).json({review: returnReview})
})


// Edit review by ID
router.put('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { reviewId } = req.params;
    const { review } = await Review.findbyPk(reviewId);

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct
})


// Delete review by ID
router.delete('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { reviewId } = req.params;
    const { review } = await Review.findbyPk(reviewId);

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct
    if (!review) {
        return res.status(404).json({
           "message": "Review couldn't be found"
        })
    }

    await Review.destroy({
        where: { id: reviewId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})


// Delete image from review by IDs
router.delete('/:reviewId/:imageId', async(req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { reviewId, imageId } = req.params;
    const { review } = await Review.findbyPk(reviewId);
    const { reviewImage } = await reviewImage.findbyPk(reviewId);

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct
    if (!reviewImage) {
        return res.status(404).json({
           "message": "Review Image couldn't be found"
        })
    }

    await reviewImage.destroy({
        where: { id: reviewId, imageId: imageId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})

module.exports = router;