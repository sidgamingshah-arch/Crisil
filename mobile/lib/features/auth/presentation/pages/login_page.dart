import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/route_constants.dart';
import '../bloc/auth_bloc.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            context.go(RouteConstants.discover);
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.error),
            );
          }
        },
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Spacer(flex: 2),
                // Logo / branding
                Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.explore, color: AppColors.white, size: 36),
                ),
                const SizedBox(height: AppSpacing.lg),
                Text('Welcome to TourMate', style: AppTypography.h2),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Find travel companions, share rides, and unlock group discounts worldwide.',
                  style: AppTypography.bodyLarge,
                ),
                const Spacer(flex: 3),
                _GoogleSignInButton(),
                const SizedBox(height: AppSpacing.md),
                const _AppleSignInButton(),
                const Spacer(flex: 1),
                Center(
                  child: Text(
                    'By continuing, you agree to our Terms of Service and Privacy Policy.',
                    style: AppTypography.caption,
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _GoogleSignInButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        final isLoading = state is AuthLoading;
        return ElevatedButton.icon(
          onPressed: isLoading ? null : () {
            // Trigger Google sign-in flow
            // In full implementation: GoogleSignIn().signIn() → FirebaseAuth → register API
          },
          icon: const Icon(Icons.g_mobiledata, size: 24),
          label: Text(isLoading ? 'Signing in...' : 'Continue with Google'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.white,
            foregroundColor: AppColors.grey800,
            side: const BorderSide(color: AppColors.grey200),
            elevation: 0,
          ),
        );
      },
    );
  }
}

class _AppleSignInButton extends StatelessWidget {
  const _AppleSignInButton();

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: () {},
      icon: const Icon(Icons.apple, size: 24),
      label: const Text('Continue with Apple'),
    );
  }
}
