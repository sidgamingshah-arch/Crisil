const AppError = require('./AppError');

const MAX_RADIUS_METERS = 50000; // 50 km
const DEFAULT_RADIUS_METERS = 5000; // 5 km

function validateCoordinates(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw AppError.badRequest('Invalid latitude. Must be between -90 and 90.', 'INVALID_LAT');
  }
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw AppError.badRequest('Invalid longitude. Must be between -180 and 180.', 'INVALID_LNG');
  }
  return { latitude, longitude };
}

function validateRadius(radius) {
  const r = parseInt(radius) || DEFAULT_RADIUS_METERS;
  if (r < 100 || r > MAX_RADIUS_METERS) {
    throw AppError.badRequest(
      `Radius must be between 100 and ${MAX_RADIUS_METERS} meters.`,
      'INVALID_RADIUS'
    );
  }
  return r;
}

// PostGIS geography functions take LONGITUDE first, then latitude
function makePoint(longitude, latitude) {
  return `ST_MakePoint(${longitude}, ${latitude})::geography`;
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

module.exports = { validateCoordinates, validateRadius, makePoint, formatDistance };
