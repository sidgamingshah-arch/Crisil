class ApiConstants {
  ApiConstants._();

  // Override these via flutter --dart-define for each environment
  static const String _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://10.0.2.2:3000/api', // Android emulator → localhost
  );
  static const String _wsUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: 'https://10.0.2.2:3000',
  );

  static const String baseUrl = _baseUrl;
  static const String wsUrl = _wsUrl;

  // Timeouts
  static const int connectTimeoutMs = 15000;
  static const int receiveTimeoutMs = 30000;

  // Endpoints
  static const String register = '/auth/register';
  static const String me = '/auth/me';
  static const String nearbyUsers = '/discover/nearby';
  static const String updateLocation = '/discover/location';
  static const String searchDestinations = '/discover/destinations';
  static const String transportRequests = '/transport';
  static const String nearbyTransport = '/transport/nearby';
  static const String activities = '/activities';
  static const String conversations = '/chat';
  static const String profiles = '/profiles';
  static const String reviews = '/profiles/reviews';
}
