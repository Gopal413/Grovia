const express = require("express");
const router = express.Router();

const { createReview, getAllReviews ,getFiveStarReviews, getReviewsByProductId} = require("../../Controllers/review/review");

router.post("/addreview/:id", createReview);
router.get("/getreviews",  getAllReviews);
router.get("/product/:productId", getReviewsByProductId);
router.get("/getFivestar",getFiveStarReviews)

module.exports = router;