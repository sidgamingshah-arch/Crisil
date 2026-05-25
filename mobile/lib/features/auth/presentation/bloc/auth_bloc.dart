import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/user_entity.dart';

part 'auth_event.dart';
part 'auth_state.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(const AuthInitial()) {
    on<AuthCheckStatus>(_onCheckStatus);
    on<AuthSignInWithGoogle>(_onSignInGoogle);
    on<AuthSignOut>(_onSignOut);
    on<AuthProfileUpdated>(_onProfileUpdated);
  }

  Future<void> _onCheckStatus(AuthCheckStatus event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    // Checked by listening to FirebaseAuth.authStateChanges() at startup
    // Emitted from main.dart stream listener
  }

  Future<void> _onSignInGoogle(AuthSignInWithGoogle event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    try {
      // Actual implementation calls GoogleSignIn + FirebaseAuth
      // Simplified here — full implementation in auth_repository_impl.dart
      emit(AuthAuthenticated(user: event.user));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onSignOut(AuthSignOut event, Emitter<AuthState> emit) async {
    emit(const AuthInitial());
  }

  Future<void> _onProfileUpdated(AuthProfileUpdated event, Emitter<AuthState> emit) async {
    if (state is AuthAuthenticated) {
      emit(AuthAuthenticated(user: event.updatedUser));
    }
  }
}
