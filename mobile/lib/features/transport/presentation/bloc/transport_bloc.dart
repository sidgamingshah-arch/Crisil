import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/transport_request_entity.dart';

part 'transport_event.dart';
part 'transport_state.dart';

@injectable
class TransportBloc extends Bloc<TransportEvent, TransportState> {
  TransportBloc() : super(const TransportInitial()) {
    on<TransportLoadNearby>(_onLoadNearby);
    on<TransportJoinRequest>(_onJoin);
    on<TransportLeaveRequest>(_onLeave);
    on<TransportCreateRequest>(_onCreate);
    on<TransportSocketJoined>(_onSocketJoined);
  }

  Future<void> _onLoadNearby(TransportLoadNearby event, Emitter<TransportState> emit) async {
    emit(const TransportLoading());
    try {
      // Call TransportRepository.getNearbyRequests(...)
      emit(const TransportLoaded(requests: [], hasMore: false));
    } catch (e) {
      emit(TransportError(message: e.toString()));
    }
  }

  Future<void> _onJoin(TransportJoinRequest event, Emitter<TransportState> emit) async {
    final current = state;
    if (current is! TransportLoaded) return;
    emit(TransportJoining(requests: current.requests));
    try {
      // Call TransportRepository.joinRequest(event.requestId, seats: event.seats)
      emit(current.copyWith(joiningRequestId: null));
    } catch (e) {
      emit(TransportError(message: e.toString()));
    }
  }

  Future<void> _onLeave(TransportLeaveRequest event, Emitter<TransportState> emit) async {}

  Future<void> _onCreate(TransportCreateRequest event, Emitter<TransportState> emit) async {}

  void _onSocketJoined(TransportSocketJoined event, Emitter<TransportState> emit) {
    final current = state;
    if (current is TransportLoaded) {
      final updated = current.requests.map((r) {
        if (r.id == event.requestId) {
          return TransportRequestEntity(
            id: r.id, userId: r.userId, organizerName: r.organizerName,
            organizerAvatar: r.organizerAvatar, organizerRating: r.organizerRating,
            destinationId: r.destinationId, destinationName: r.destinationName,
            destinationCity: r.destinationCity, destinationCountry: r.destinationCountry,
            departureTime: r.departureTime,
            seatsAvailable: r.seatsAvailable - 1,
            seatsTotal: r.seatsTotal,
          );
        }
        return r;
      }).toList();
      emit(current.copyWith(requests: updated));
    }
  }
}
