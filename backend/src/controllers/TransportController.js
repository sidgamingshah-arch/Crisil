const TransportService = require('../services/TransportService');
const NotificationService = require('../services/NotificationService');
const asyncHandler = require('../utils/asyncHandler');

const createRequest = asyncHandler(async (req, res) => {
  const request = await TransportService.createRequest({
    userId: req.user.id,
    destinationId: req.body.destination_id,
    departureTime: req.body.departure_time,
    seatsTotal: req.body.seats_total,
    transportType: req.body.transport_type,
    pricePerPerson: req.body.price_per_person,
    currencyCode: req.body.currency_code,
    notes: req.body.notes,
    pickupLat: req.body.pickup_lat,
    pickupLng: req.body.pickup_lng,
  });
  res.status(201).json({ success: true, data: request });
});

const getNearby = asyncHandler(async (req, res) => {
  const requests = await TransportService.getNearbyRequests(req.query);
  res.json({ success: true, data: requests, count: requests.length });
});

const getDetail = asyncHandler(async (req, res) => {
  const request = await TransportService.getRequestDetail(req.params.id);
  res.json({ success: true, data: request });
});

const joinRequest = asyncHandler(async (req, res) => {
  const match = await TransportService.joinRequest({
    requestId: req.params.id,
    userId: req.user.id,
    seatsRequested: req.body.seats || 1,
  });

  // Get the request to find the organizer
  const TransportRepository = require('../repositories/TransportRepository');
  const request = await TransportRepository.findById(req.params.id);
  NotificationService.notifyTransportJoined(request.user_id, req.user.name).catch(() => {});

  res.status(201).json({ success: true, data: match });
});

const leaveRequest = asyncHandler(async (req, res) => {
  await TransportService.leaveRequest({ requestId: req.params.id, userId: req.user.id });
  res.json({ success: true });
});

const cancelRequest = asyncHandler(async (req, res) => {
  await TransportService.cancelRequest(req.params.id, req.user.id);
  res.json({ success: true });
});

module.exports = { createRequest, getNearby, getDetail, joinRequest, leaveRequest, cancelRequest };
