import 'package:equatable/equatable.dart';

enum TransportType { taxi, rideshare, minivan, bus, boat, other }
enum TransportStatus { open, full, departed, cancelled }

class TransportRequestEntity extends Equatable {
  final String id;
  final String userId;
  final String organizerName;
  final String? organizerAvatar;
  final double organizerRating;
  final String destinationId;
  final String destinationName;
  final String destinationCity;
  final String destinationCountry;
  final DateTime departureTime;
  final int seatsAvailable;
  final int seatsTotal;
  final TransportType transportType;
  final double? pricePerPerson;
  final String currencyCode;
  final TransportStatus status;
  final String? notes;
  final double? distanceMeters;
  final String? conversationId;

  const TransportRequestEntity({
    required this.id,
    required this.userId,
    required this.organizerName,
    this.organizerAvatar,
    this.organizerRating = 0.0,
    required this.destinationId,
    required this.destinationName,
    required this.destinationCity,
    required this.destinationCountry,
    required this.departureTime,
    required this.seatsAvailable,
    required this.seatsTotal,
    this.transportType = TransportType.rideshare,
    this.pricePerPerson,
    this.currencyCode = 'USD',
    this.status = TransportStatus.open,
    this.notes,
    this.distanceMeters,
    this.conversationId,
  });

  int get seatsTaken => seatsTotal - seatsAvailable;
  bool get isFull => seatsAvailable == 0;

  @override
  List<Object?> get props => [id];
}
