const DiscoverService = require('../services/DiscoverService');
const asyncHandler = require('../utils/asyncHandler');

const getNearbyUsers = asyncHandler(async (req, res) => {
  const { lat, lng, radius, destination_id } = req.query;
  const users = await DiscoverService.getNearbyUsers({
    lat, lng, radius, destinationId: destination_id,
    currentUserId: req.user.id,
  });
  res.json({ success: true, data: users, count: users.length });
});

const updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, destination_id, is_sharing } = req.body;
  await DiscoverService.updateUserLocation({
    userId: req.user.id,
    latitude,
    longitude,
    destinationId: destination_id,
    isSharing: is_sharing !== false,
  });
  res.json({ success: true });
});

const searchDestinations = asyncHandler(async (req, res) => {
  const destinations = await DiscoverService.searchDestinations(req.query.q);
  res.json({ success: true, data: destinations });
});

module.exports = { getNearbyUsers, updateLocation, searchDestinations };
