import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/activity_entity.dart';

class DiscountMeterWidget extends StatelessWidget {
  final DiscountPreview preview;
  final bool showNextTier;

  const DiscountMeterWidget({
    super.key,
    required this.preview,
    this.showNextTier = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.grey50,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        border: Border.all(color: AppColors.grey200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Animated price with TweenAnimationBuilder
              TweenAnimationBuilder<double>(
                tween: Tween(end: preview.finalPrice),
                duration: const Duration(milliseconds: 600),
                curve: Curves.easeOut,
                builder: (ctx, price, _) => Text(
                  '${preview.currencyCode} ${price.toStringAsFixed(2)}',
                  style: AppTypography.priceDisplay.copyWith(
                    color: preview.discountPercent > 0 ? AppColors.discountGreen : AppColors.grey900,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              if (preview.discountPercent > 0) ...[
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${preview.currencyCode} ${preview.originalPrice.toStringAsFixed(2)}',
                      style: AppTypography.priceStrikethrough,
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.discountGreen,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '-${preview.discountPercent.toInt()}%',
                        style: AppTypography.discountBadge,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // Group size progress
          Row(
            children: [
              const Icon(Icons.people, size: 16, color: AppColors.grey400),
              const SizedBox(width: AppSpacing.xs),
              Text(
                '${preview.currentParticipants} joined',
                style: AppTypography.bodySmall,
              ),
              if (showNextTier && preview.nextTier != null) ...[
                const Spacer(),
                Text(
                  '${preview.spotsToNextDiscount} more for ${preview.nextTier!.discountPercent.toInt()}% off',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.discountAmber,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ],
          ),

          if (showNextTier && preview.nextTier != null) ...[
            const SizedBox(height: AppSpacing.sm),
            _DiscountProgressBar(
              current: preview.currentParticipants,
              target: preview.nextTier!.minParticipants,
            ),
          ],
        ],
      ),
    );
  }
}

class _DiscountProgressBar extends StatelessWidget {
  final int current;
  final int target;

  const _DiscountProgressBar({required this.current, required this.target});

  @override
  Widget build(BuildContext context) {
    final progress = (current / target).clamp(0.0, 1.0);
    return ClipRRect(
      borderRadius: BorderRadius.circular(4),
      child: LinearProgressIndicator(
        value: progress,
        minHeight: 6,
        backgroundColor: AppColors.grey200,
        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.discountGreen),
      ),
    );
  }
}
