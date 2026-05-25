const ActivityService = require('../services/ActivityService');
const asyncHandler = require('../utils/asyncHandler');

const listActivities = asyncHandler(async (req, res) => {
  const activities = await ActivityService.getActivities(req.query);
  res.json({ success: true, data: activities });
});

const getDetail = asyncHandler(async (req, res) => {
  const activity = await ActivityService.getActivityDetail(req.params.id);
  res.json({ success: true, data: activity });
});

const createBooking = asyncHandler(async (req, res) => {
  const booking = await ActivityService.createBooking({
    activityId: req.params.id,
    organizerUserId: req.user.id,
    scheduledAt: req.body.scheduled_at,
    notes: req.body.notes,
  });
  res.status(201).json({ success: true, data: booking });
});

const joinBooking = asyncHandler(async (req, res) => {
  const result = await ActivityService.joinBooking({
    bookingId: req.params.bookingId,
    userId: req.user.id,
  });
  res.status(201).json({ success: true, data: result });
});

const getDiscountPreview = asyncHandler(async (req, res) => {
  const preview = await ActivityService.getDiscountPreview(req.params.bookingId);
  res.json({ success: true, data: preview });
});

module.exports = { listActivities, getDetail, createBooking, joinBooking, getDiscountPreview };
