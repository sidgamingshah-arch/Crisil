part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();
  @override
  List<Object?> get props => [];
}

class AuthCheckStatus extends AuthEvent {
  const AuthCheckStatus();
}

class AuthSignInWithGoogle extends AuthEvent {
  final UserEntity user;
  const AuthSignInWithGoogle({required this.user});
  @override
  List<Object?> get props => [user];
}

class AuthSignOut extends AuthEvent {
  const AuthSignOut();
}

class AuthProfileUpdated extends AuthEvent {
  final UserEntity updatedUser;
  const AuthProfileUpdated({required this.updatedUser});
  @override
  List<Object?> get props => [updatedUser];
}
