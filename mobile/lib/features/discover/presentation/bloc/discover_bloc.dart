import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/nearby_user_entity.dart';

part 'discover_event.dart';
part 'discover_state.dart';

@injectable
class DiscoverBloc extends Bloc<DiscoverEvent, DiscoverState> {
  DiscoverBloc() : super(const DiscoverInitial()) {
    on<DiscoverLoadNearbyUsers>(_onLoadNearbyUsers);
    on<DiscoverUserLocationUpdated>(_onLocationUpdated);
    on<DiscoverSocketUserUpdate>(_onSocketUpdate);
    on<DiscoverDestinationSelected>(_onDestinationSelected);
  }

  Future<void> _onLoadNearbyUsers(DiscoverLoadNearbyUsers event, Emitter<DiscoverState> emit) async {
    emit(const DiscoverLoading());
    try {
      // Call DiscoverRepository.getNearbyUsers(...)
      // Placeholder: emit empty loaded state
      emit(const DiscoverLoaded(nearbyUsers: [], hasLocationPermission: true));
    } catch (e) {
      emit(DiscoverError(message: e.toString()));
    }
  }

  Future<void> _onLocationUpdated(DiscoverUserLocationUpdated event, Emitter<DiscoverState> emit) async {
    // Update user location via API + socket
  }

  void _onSocketUpdate(DiscoverSocketUserUpdate event, Emitter<DiscoverState> emit) {
    final current = state;
    if (current is DiscoverLoaded) {
      final updated = List<NearbyUserEntity>.from(current.nearbyUsers);
      final idx = updated.indexWhere((u) => u.id == event.user.id);
      if (idx >= 0) {
        updated[idx] = event.user;
      } else {
        updated.add(event.user);
      }
      emit(current.copyWith(nearbyUsers: updated));
    }
  }

  void _onDestinationSelected(DiscoverDestinationSelected event, Emitter<DiscoverState> emit) {
    if (state is DiscoverLoaded) {
      emit((state as DiscoverLoaded).copyWith(selectedDestinationId: event.destinationId));
    }
  }
}
