part of 'discover_bloc.dart';

abstract class DiscoverState extends Equatable {
  const DiscoverState();
  @override
  List<Object?> get props => [];
}

class DiscoverInitial extends DiscoverState {
  const DiscoverInitial();
}

class DiscoverLoading extends DiscoverState {
  const DiscoverLoading();
}

class DiscoverLoaded extends DiscoverState {
  final List<NearbyUserEntity> nearbyUsers;
  final bool hasLocationPermission;
  final String? selectedDestinationId;

  const DiscoverLoaded({
    required this.nearbyUsers,
    required this.hasLocationPermission,
    this.selectedDestinationId,
  });

  DiscoverLoaded copyWith({
    List<NearbyUserEntity>? nearbyUsers,
    bool? hasLocationPermission,
    String? selectedDestinationId,
  }) =>
      DiscoverLoaded(
        nearbyUsers: nearbyUsers ?? this.nearbyUsers,
        hasLocationPermission: hasLocationPermission ?? this.hasLocationPermission,
        selectedDestinationId: selectedDestinationId ?? this.selectedDestinationId,
      );

  @override
  List<Object?> get props => [nearbyUsers, hasLocationPermission, selectedDestinationId];
}

class DiscoverError extends DiscoverState {
  final String message;
  const DiscoverError({required this.message});
  @override
  List<Object?> get props => [message];
}
