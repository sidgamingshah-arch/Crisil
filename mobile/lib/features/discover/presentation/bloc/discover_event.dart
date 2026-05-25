part of 'discover_bloc.dart';

abstract class DiscoverEvent extends Equatable {
  const DiscoverEvent();
  @override
  List<Object?> get props => [];
}

class DiscoverLoadNearbyUsers extends DiscoverEvent {
  final double latitude;
  final double longitude;
  final double radiusMeters;
  final String? destinationId;
  const DiscoverLoadNearbyUsers({
    required this.latitude, required this.longitude,
    this.radiusMeters = 5000, this.destinationId,
  });
  @override
  List<Object?> get props => [latitude, longitude, radiusMeters, destinationId];
}

class DiscoverUserLocationUpdated extends DiscoverEvent {
  final double latitude;
  final double longitude;
  final String? destinationId;
  const DiscoverUserLocationUpdated({required this.latitude, required this.longitude, this.destinationId});
  @override
  List<Object?> get props => [latitude, longitude];
}

class DiscoverSocketUserUpdate extends DiscoverEvent {
  final NearbyUserEntity user;
  const DiscoverSocketUserUpdate({required this.user});
  @override
  List<Object?> get props => [user.id];
}

class DiscoverDestinationSelected extends DiscoverEvent {
  final String? destinationId;
  const DiscoverDestinationSelected({this.destinationId});
  @override
  List<Object?> get props => [destinationId];
}
