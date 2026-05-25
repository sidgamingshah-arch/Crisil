import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/activity_entity.dart';

part 'activities_event.dart';
part 'activities_state.dart';

@injectable
class ActivitiesBloc extends Bloc<ActivitiesEvent, ActivitiesState> {
  ActivitiesBloc() : super(const ActivitiesInitial()) {
    on<ActivitiesLoad>(_onLoad);
    on<ActivitiesJoinBooking>(_onJoin);
    on<ActivitiesSocketDiscountUpdate>(_onSocketUpdate);
  }

  Future<void> _onLoad(ActivitiesLoad event, Emitter<ActivitiesState> emit) async {
    emit(const ActivitiesLoading());
    try {
      // Call ActivitiesRepository.getActivities(event.destinationId, ...)
      emit(const ActivitiesLoaded(activities: [], hasMore: false));
    } catch (e) {
      emit(ActivitiesError(message: e.toString()));
    }
  }

  Future<void> _onJoin(ActivitiesJoinBooking event, Emitter<ActivitiesState> emit) async {}

  void _onSocketUpdate(ActivitiesSocketDiscountUpdate event, Emitter<ActivitiesState> emit) {
    // Real-time discount update: update matching booking's preview in the state
  }
}
