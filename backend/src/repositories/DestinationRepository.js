const BaseRepository = require('./BaseRepository');
const db = require('../config/database');

class DestinationRepository extends BaseRepository {
  constructor() {
    super('destinations');
  }

  search(query, limit = 10) {
    return db('destinations')
      .whereRaw('name ILIKE ? OR city ILIKE ? OR country ILIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`])
      .limit(limit)
      .select('id', 'name', 'city', 'country', 'country_code', 'image_url');
  }

  findNearby(longitude, latitude, radiusMeters = 50000, limit = 10) {
    return db.raw(`
      SELECT id, name, city, country, country_code, image_url,
             ST_Distance(location, ST_MakePoint(?, ?)::geography) AS distance_meters
      FROM destinations
      WHERE ST_DWithin(location, ST_MakePoint(?, ?)::geography, ?)
      ORDER BY distance_meters ASC
      LIMIT ?
    `, [longitude, latitude, longitude, latitude, radiusMeters, limit])
      .then((r) => r.rows);
  }
}

module.exports = new DestinationRepository();
