import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/route_constants.dart';
import '../../domain/entities/nearby_user_entity.dart';

class NearbyUserBottomSheet extends StatelessWidget {
  final List<NearbyUserEntity> users;

  const NearbyUserBottomSheet({super.key, required this.users});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 12, offset: Offset(0, -4))],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: AppSpacing.sm),
          Container(width: 40, height: 4, decoration: BoxDecoration(
            color: AppColors.grey200, borderRadius: BorderRadius.circular(2),
          )),
          Padding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.md, AppSpacing.md, AppSpacing.sm),
            child: Row(
              children: [
                Text('${users.length} travelers nearby', style: AppTypography.h4),
                const Spacer(),
                TextButton(
                  onPressed: () => context.push(RouteConstants.transport),
                  child: const Text('Shared rides'),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 110,
            child: users.isEmpty
                ? Center(child: Text('No travelers nearby', style: AppTypography.bodyMedium))
                : ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                    itemCount: users.length,
                    separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.sm),
                    itemBuilder: (_, i) => _UserCard(user: users[i]),
                  ),
          ),
          const SizedBox(height: AppSpacing.md),
        ],
      ),
    );
  }
}

class _UserCard extends StatelessWidget {
  final NearbyUserEntity user;
  const _UserCard({required this.user});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/profile/${user.id}'),
      child: Container(
        width: 90,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: AppSpacing.avatarMd / 2,
              backgroundColor: AppColors.grey100,
              backgroundImage: user.avatarUrl != null ? NetworkImage(user.avatarUrl!) : null,
              child: user.avatarUrl == null ? Text(user.name[0].toUpperCase()) : null,
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(user.name.split(' ').first, style: AppTypography.bodySmall.copyWith(
              fontWeight: FontWeight.w600, color: AppColors.grey800,
            ), maxLines: 1, overflow: TextOverflow.ellipsis),
            Text(user.formattedDistance, style: AppTypography.caption, maxLines: 1),
            if (user.destinationCity != null)
              Text('→ ${user.destinationCity}', style: AppTypography.caption.copyWith(
                color: AppColors.primary,
              ), maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}
