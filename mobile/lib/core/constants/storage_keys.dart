class StorageKeys {
  StorageKeys._();

  // Hive box names
  static const String userBox = 'user_box';
  static const String preferencesBox = 'preferences_box';
  static const String cacheBox = 'cache_box';

  // Secure storage keys
  static const String authToken = 'auth_token';
  static const String refreshToken = 'refresh_token';

  // Hive keys
  static const String currentUser = 'current_user';
  static const String preferredLanguage = 'preferred_language';
  static const String hasSeenOnboarding = 'has_seen_onboarding';
  static const String lastKnownLat = 'last_known_lat';
  static const String lastKnownLng = 'last_known_lng';
  static const String fcmToken = 'fcm_token';
}
