exports.up = (knex) =>
  knex.raw(`
    -- Spatial GIST indexes (required for ST_DWithin performance)
    CREATE INDEX idx_user_locations_location
      ON user_locations USING GIST(location);

    CREATE INDEX idx_transport_requests_location
      ON transport_requests USING GIST(pickup_location);

    CREATE INDEX idx_destinations_location
      ON destinations USING GIST(location);

    -- Transport query indexes
    CREATE INDEX idx_transport_requests_destination
      ON transport_requests(destination_id);
    CREATE INDEX idx_transport_requests_status
      ON transport_requests(status);
    CREATE INDEX idx_transport_requests_departure
      ON transport_requests(departure_time);
    CREATE INDEX idx_transport_matches_request
      ON transport_matches(request_id);

    -- Activity indexes
    CREATE INDEX idx_activities_destination
      ON activities(destination_id);
    CREATE INDEX idx_activity_bookings_activity
      ON activity_bookings(activity_id);
    CREATE INDEX idx_activity_participants_booking
      ON activity_participants(booking_id);

    -- Chat performance indexes
    CREATE INDEX idx_messages_conversation_time
      ON messages(conversation_id, created_at DESC);
    CREATE INDEX idx_conversation_participants_user
      ON conversation_participants(user_id);

    -- Review lookup
    CREATE INDEX idx_reviews_reviewee
      ON reviews(reviewee_id);
    CREATE INDEX idx_reviews_reviewer
      ON reviews(reviewer_id);

    -- User location sharing + freshness
    CREATE INDEX idx_user_locations_sharing_updated
      ON user_locations(is_location_sharing, updated_at);
  `);

exports.down = (knex) =>
  knex.raw(`
    DROP INDEX IF EXISTS idx_user_locations_location;
    DROP INDEX IF EXISTS idx_transport_requests_location;
    DROP INDEX IF EXISTS idx_destinations_location;
    DROP INDEX IF EXISTS idx_transport_requests_destination;
    DROP INDEX IF EXISTS idx_transport_requests_status;
    DROP INDEX IF EXISTS idx_transport_requests_departure;
    DROP INDEX IF EXISTS idx_transport_matches_request;
    DROP INDEX IF EXISTS idx_activities_destination;
    DROP INDEX IF EXISTS idx_activity_bookings_activity;
    DROP INDEX IF EXISTS idx_activity_participants_booking;
    DROP INDEX IF EXISTS idx_messages_conversation_time;
    DROP INDEX IF EXISTS idx_conversation_participants_user;
    DROP INDEX IF EXISTS idx_reviews_reviewee;
    DROP INDEX IF EXISTS idx_reviews_reviewer;
    DROP INDEX IF EXISTS idx_user_locations_sharing_updated;
  `);
