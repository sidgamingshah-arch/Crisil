part of 'transport_bloc.dart';

abstract class TransportState extends Equatable {
  const TransportState();
  @override
  List<Object?> get props => [];
}

class TransportInitial extends TransportState {
  const TransportInitial();
}

class TransportLoading extends TransportState {
  const TransportLoading();
}

class TransportLoaded extends TransportState {
  final List<TransportRequestEntity> requests;
  final bool hasMore;
  final String? joiningRequestId;

  const TransportLoaded({required this.requests, required this.hasMore, this.joiningRequestId});

  TransportLoaded copyWith({
    List<TransportRequestEntity>? requests,
    bool? hasMore,
    String? joiningRequestId,
  }) =>
      TransportLoaded(
        requests: requests ?? this.requests,
        hasMore: hasMore ?? this.hasMore,
        joiningRequestId: joiningRequestId,
      );

  @override
  List<Object?> get props => [requests, hasMore, joiningRequestId];
}

class TransportJoining extends TransportState {
  final List<TransportRequestEntity> requests;
  const TransportJoining({required this.requests});
  @override
  List<Object?> get props => [requests];
}

class TransportError extends TransportState {
  final String message;
  const TransportError({required this.message});
  @override
  List<Object?> get props => [message];
}
