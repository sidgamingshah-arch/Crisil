part of 'transport_bloc.dart';

abstract class TransportEvent extends Equatable {
  const TransportEvent();
  @override
  List<Object?> get props => [];
}

class TransportLoadNearby extends TransportEvent {
  final double latitude;
  final double longitude;
  final double radiusMeters;
  final String? destinationId;
  const TransportLoadNearby({required this.latitude, required this.longitude,
    this.radiusMeters = 10000, this.destinationId});
  @override
  List<Object?> get props => [latitude, longitude, destinationId];
}

class TransportJoinRequest extends TransportEvent {
  final String requestId;
  final int seats;
  const TransportJoinRequest({required this.requestId, this.seats = 1});
  @override
  List<Object?> get props => [requestId, seats];
}

class TransportLeaveRequest extends TransportEvent {
  final String requestId;
  const TransportLeaveRequest({required this.requestId});
  @override
  List<Object?> get props => [requestId];
}

class TransportCreateRequest extends TransportEvent {
  final Map<String, dynamic> params;
  const TransportCreateRequest({required this.params});
  @override
  List<Object?> get props => [params];
}

class TransportSocketJoined extends TransportEvent {
  final String requestId;
  const TransportSocketJoined({required this.requestId});
  @override
  List<Object?> get props => [requestId];
}
