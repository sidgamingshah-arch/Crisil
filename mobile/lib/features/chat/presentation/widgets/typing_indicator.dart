import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

class TypingIndicator extends StatefulWidget {
  final String userName;
  const TypingIndicator({super.key, required this.userName});

  @override
  State<TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<TypingIndicator> with TickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))
      ..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.grey200),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('${widget.userName} is typing', style: AppTypography.caption),
                const SizedBox(width: AppSpacing.xs),
                ...List.generate(3, (i) => _Dot(controller: _controller, delay: i * 0.15)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  final AnimationController controller;
  final double delay;

  const _Dot({required this.controller, required this.delay});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (_, __) {
        final t = ((controller.value - delay) % 1.0);
        final opacity = t < 0.5 ? (t * 2) : (1 - (t - 0.5) * 2);
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 1),
          child: Opacity(
            opacity: opacity.clamp(0.2, 1.0),
            child: Container(
              width: 6, height: 6,
              decoration: const BoxDecoration(color: AppColors.grey400, shape: BoxShape.circle),
            ),
          ),
        );
      },
    );
  }
}
