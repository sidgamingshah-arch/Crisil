const ProfileService = require('../services/ProfileService');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination } = require('../utils/pagination');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await ProfileService.getPublicProfile(req.params.id);
  res.json({ success: true, data: profile });
});

const getReviews = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);
  const reviews = await ProfileService.getReviews(req.params.id, pagination);
  res.json({ success: true, data: reviews });
});

const submitReview = asyncHandler(async (req, res) => {
  const review = await ProfileService.submitReview({
    reviewerId: req.user.id,
    revieweeId: req.body.reviewee_id,
    rating: req.body.rating,
    comment: req.body.comment,
    tripContext: req.body.trip_context,
    transportRequestId: req.body.transport_request_id,
    activityBookingId: req.body.activity_booking_id,
  });
  res.status(201).json({ success: true, data: review });
});

module.exports = { getProfile, getReviews, submitReview };
