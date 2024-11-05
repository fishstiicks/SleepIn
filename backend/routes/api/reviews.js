const express = require('express');
const { Review } = require('../../db/models');
const { reviewImage } = require('../../db/models');
const { UPDATE } = require('sequelize/lib/query-types');
const router = express.Router();


// Add image to review by ID
router.post('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { reviewId } = req.params;
    const review = await Review.findbyPk(reviewId);

    if (!review) {
        return res.status(404).json({
           "message": "Review couldn't be found"
        })
    }

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
    const { review, stars } = req.body;
    const currentReview = await Review.findbyPk(reviewId);

    if (!currentReview) {
        return res.status(404).json({
           "message": "Review couldn't be found"
        })
    }

    if (currentReview.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Data Validation
    if (!review) { return res.status(400).json({
        "message": "Bad Request",
        "errors": {"review": "Review text is required"}})}

    if (stars < 1 || stars > 5) { return res.status(400).json({
        "message": "Bad Request",
        "errors": {"review": "Stars must be an integer from 1 to 5"}})}

    // Construct
    currentReview.review = review;
    currentReview.stars = stars;
    currentReview.updatedAt = Sequelize.literal('CURRENT TIMESTAMP');

    await existingReview.save();

    return res.status(200).json({
        id: currentReview.id,
        userId: currentReview.userId,
        spotId: currentReview.spotId,
        review: currentReview.review,
        stars: currentReview.stars,
        createdAt: currentReview.createdAt,
        updatedAt: currentReview.updatedAt
    })
})


// Delete review by ID
router.delete('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentification required' });
    }

    const { reviewId } = req.params;
    const review  = await Review.findbyPk(reviewId);

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
    const review = await Review.findbyPk(reviewId);
    const reviewImage = await reviewImage.findbyPk(reviewId);

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