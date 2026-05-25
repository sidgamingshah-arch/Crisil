part of 'activities_bloc.dart';

abstract class ActivitiesState extends Equatable {
  const ActivitiesState();
  @override
  List<Object?> get props => [];
}

class ActivitiesInitial extends ActivitiesState {
  const ActivitiesInitial();
}

class ActivitiesLoading extends ActivitiesState {
  const ActivitiesLoading();
}

class ActivitiesLoaded extends ActivitiesState {
  final List<ActivityEntity> activities;
  final bool hasMore;

  const ActivitiesLoaded({required this.activities, required this.hasMore});

  @override
  List<Object?> get props => [activities, hasMore];
}

class ActivitiesError extends ActivitiesState {
  final String message;
  const ActivitiesError({required this.message});
  @override
  List<Object?> get props => [message];
}
