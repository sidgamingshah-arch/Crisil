part of 'activities_bloc.dart';

abstract class ActivitiesEvent extends Equatable {
  const ActivitiesEvent();
  @override
  List<Object?> get props => [];
}

class ActivitiesLoad extends ActivitiesEvent {
  final String destinationId;
  final String? category;
  const ActivitiesLoad({required this.destinationId, this.category});
  @override
  List<Object?> get props => [destinationId, category];
}

class ActivitiesJoinBooking extends ActivitiesEvent {
  final String bookingId;
  const ActivitiesJoinBooking({required this.bookingId});
  @override
  List<Object?> get props => [bookingId];
}

class ActivitiesSocketDiscountUpdate extends ActivitiesEvent {
  final String bookingId;
  final DiscountPreview preview;
  const ActivitiesSocketDiscountUpdate({required this.bookingId, required this.preview});
  @override
  List<Object?> get props => [bookingId];
}
