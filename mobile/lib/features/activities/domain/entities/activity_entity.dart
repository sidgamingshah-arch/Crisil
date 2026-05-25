import 'package:equatable/equatable.dart';

class DiscountTier {
  final int minParticipants;
  final double discountPercent;
  final double price;

  const DiscountTier({
    required this.minParticipants,
    required this.discountPercent,
    required this.price,
  });
}

class ActivityEntity extends Equatable {
  final String id;
  final String destinationId;
  final String name;
  final String? description;
  final String category;
  final double basePrice;
  final String currencyCode;
  final int minGroupSize;
  final int maxGroupSize;
  final int? durationMinutes;
  final String? imageUrl;
  final List<DiscountTier> discountTiers;
  final bool isActive;

  const ActivityEntity({
    required this.id,
    required this.destinationId,
    required this.name,
    this.description,
    required this.category,
    required this.basePrice,
    this.currencyCode = 'USD',
    required this.minGroupSize,
    required this.maxGroupSize,
    this.durationMinutes,
    this.imageUrl,
    this.discountTiers = const [],
    this.isActive = true,
  });

  @override
  List<Object?> get props => [id];
}

class DiscountPreview {
  final double originalPrice;
  final double finalPrice;
  final double discountPercent;
  final double savings;
  final String currencyCode;
  final DiscountTier? nextTier;
  final int? spotsToNextDiscount;
  final int currentParticipants;

  const DiscountPreview({
    required this.originalPrice,
    required this.finalPrice,
    required this.discountPercent,
    required this.savings,
    required this.currencyCode,
    this.nextTier,
    this.spotsToNextDiscount,
    required this.currentParticipants,
  });
}
