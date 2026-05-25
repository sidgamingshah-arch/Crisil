import 'package:equatable/equatable.dart';

class NearbyUserEntity extends Equatable {
  final String id;
  final String name;
  final String? avatarUrl;
  final double rating;
  final int totalReviews;
  final List<String> languages;
  final String? nationality;
  final String? destinationId;
  final String? destinationName;
  final String? destinationCity;
  final double distanceMeters;
  final double? latitude;
  final double? longitude;

  const NearbyUserEntity({
    required this.id,
    required this.name,
    this.avatarUrl,
    this.rating = 0.0,
    this.totalReviews = 0,
    this.languages = const [],
    this.nationality,
    this.destinationId,
    this.destinationName,
    this.destinationCity,
    required this.distanceMeters,
    this.latitude,
    this.longitude,
  });

  String get formattedDistance {
    if (distanceMeters < 1000) return '${distanceMeters.round()}m away';
    return '${(distanceMeters / 1000).toStringAsFixed(1)}km away';
  }

  @override
  List<Object?> get props => [id, distanceMeters];
}
