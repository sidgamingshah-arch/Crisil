const db = require('../config/database');
const TransportRepository = require('../repositories/TransportRepository');
const ConversationRepository = require('../repositories/ConversationRepository');
const AppError = require('../utils/AppError');

class TransportService {
  async createRequest({ userId, destinationId, departureTime, seatsTotal, transportType, pricePerPerson, currencyCode, notes, pickupLat, pickupLng }) {
    const [request] = await db('transport_requests').insert({
      user_id: userId,
      destination_id: destinationId,
      departure_time: new Date(departureTime),
      seats_available: seatsTotal,
      seats_total: seatsTotal,
      transport_type: transportType,
      price_per_person: pricePerPerson,
      currency_code: currencyCode || 'USD',
      notes,
    }).returning('*');

    if (pickupLat && pickupLng) {
      await db.raw(
        'UPDATE transport_requests SET pickup_location = ST_MakePoint(?, ?)::geography WHERE id = ?',
        [pickupLng, pickupLat, request.id]
      );
    }

    // Auto-create group conversation for this trip
    const [conversation] = await db('conversations').insert({
      type: 'transport_group',
      title: `Trip Chat`,
      transport_request_id: request.id,
    }).returning('*');

    await db('conversation_participants').insert({
      conversation_id: conversation.id,
      user_id: userId,
    });

    return { ...request, conversation_id: conversation.id };
  }

  async getNearbyRequests({ lat, lng, radius, destinationId, limit, offset }) {
    return TransportRepository.findNearbyOpen({
      latitude: lat ? parseFloat(lat) : null,
      longitude: lng ? parseFloat(lng) : null,
      radiusMeters: radius ? parseInt(radius) : 10000,
      destinationId,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
    });
  }

  async getRequestDetail(requestId) {
    const request = await TransportRepository.findWithDetails(requestId);
    if (!request) throw AppError.notFound('Transport request');
    const participants = await TransportRepository.getParticipants(requestId);
    return { ...request, participants };
  }

  async joinRequest({ requestId, userId, seatsRequested = 1 }) {
    return db.transaction(async (trx) => {
      const request = await trx('transport_requests').where({ id: requestId }).forUpdate().first();
      if (!request) throw AppError.notFound('Transport request');
      if (request.status !== 'open') throw AppError.conflict('This request is no longer open', 'REQUEST_CLOSED');
      if (request.user_id === userId) throw AppError.badRequest('Cannot join your own request');
      if (request.seats_available < seatsRequested) throw AppError.conflict('Not enough seats available', 'INSUFFICIENT_SEATS');

      const existing = await trx('transport_matches').where({ request_id: requestId, user_id: userId }).first();
      if (existing) throw AppError.conflict('Already joined this request', 'ALREADY_JOINED');

      const [match] = await trx('transport_matches').insert({
        request_id: requestId,
        user_id: userId,
        seats_reserved: seatsRequested,
        status: 'confirmed',
      }).returning('*');

      await trx('transport_requests')
        .where({ id: requestId })
        .decrement('seats_available', seatsRequested)
        .update({ updated_at: new Date() });

      await trx.raw(`
        UPDATE transport_requests SET status = 'full'
        WHERE id = ? AND seats_available = 0
      `, [requestId]);

      // Add to trip group conversation
      const conversation = await trx('conversations')
        .where({ transport_request_id: requestId, type: 'transport_group' })
        .first();
      if (conversation) {
        await trx('conversation_participants')
          .insert({ conversation_id: conversation.id, user_id: userId })
          .onConflict(['conversation_id', 'user_id']).ignore();
      }

      return match;
    });
  }

  async leaveRequest({ requestId, userId }) {
    return db.transaction(async (trx) => {
      const match = await trx('transport_matches')
        .where({ request_id: requestId, user_id: userId, status: 'confirmed' })
        .first();
      if (!match) throw AppError.notFound('Match');

      const request = await trx('transport_requests').where({ id: requestId }).first();
      if (request.user_id === userId) throw AppError.badRequest('Organizer cannot leave. Cancel the request instead.');

      await trx('transport_matches').where({ id: match.id }).update({ status: 'cancelled' });
      await trx('transport_requests')
        .where({ id: requestId })
        .increment('seats_available', match.seats_reserved)
        .update({ status: 'open', updated_at: new Date() });
    });
  }

  async cancelRequest(requestId, userId) {
    const request = await TransportRepository.findById(requestId);
    if (!request) throw AppError.notFound('Transport request');
    if (request.user_id !== userId) throw AppError.forbidden();
    if (['departed', 'cancelled'].includes(request.status)) {
      throw AppError.conflict('Cannot cancel a completed or already cancelled request');
    }
    return TransportRepository.update(requestId, { status: 'cancelled' });
  }
}

module.exports = new TransportService();
