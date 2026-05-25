import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTypography {
  AppTypography._();

  static const String _fontFamily = 'Inter';

  static const TextStyle h1 = TextStyle(
    fontFamily: _fontFamily, fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.grey900, height: 1.2,
  );
  static const TextStyle h2 = TextStyle(
    fontFamily: _fontFamily, fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.grey900, height: 1.3,
  );
  static const TextStyle h3 = TextStyle(
    fontFamily: _fontFamily, fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.grey900, height: 1.3,
  );
  static const TextStyle h4 = TextStyle(
    fontFamily: _fontFamily, fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.grey900, height: 1.4,
  );
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: _fontFamily, fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.grey700, height: 1.5,
  );
  static const TextStyle bodyMedium = TextStyle(
    fontFamily: _fontFamily, fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.grey700, height: 1.5,
  );
  static const TextStyle bodySmall = TextStyle(
    fontFamily: _fontFamily, fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.grey500, height: 1.4,
  );
  static const TextStyle label = TextStyle(
    fontFamily: _fontFamily, fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.grey700, height: 1.4,
  );
  static const TextStyle caption = TextStyle(
    fontFamily: _fontFamily, fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.grey400, height: 1.3,
  );
  static const TextStyle priceDisplay = TextStyle(
    fontFamily: _fontFamily, fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.grey900, height: 1.1,
  );
  static const TextStyle priceStrikethrough = TextStyle(
    fontFamily: _fontFamily, fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.grey400,
    decoration: TextDecoration.lineThrough, height: 1.4,
  );
  static const TextStyle discountBadge = TextStyle(
    fontFamily: _fontFamily, fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.white, height: 1.2,
  );
  static const TextStyle button = TextStyle(
    fontFamily: _fontFamily, fontSize: 16, fontWeight: FontWeight.w600, height: 1.2,
  );
}
