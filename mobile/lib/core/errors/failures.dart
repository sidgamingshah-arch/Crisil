abstract class Failure {
  final String message;
  final String? code;
  const Failure({required this.message, this.code});
}

class NetworkFailure extends Failure {
  const NetworkFailure({super.message = 'No internet connection', super.code = 'NETWORK_ERROR'});
}

class ServerFailure extends Failure {
  final int? statusCode;
  const ServerFailure({required super.message, super.code, this.statusCode});
}

class AuthFailure extends Failure {
  const AuthFailure({required super.message, super.code = 'AUTH_ERROR'});
}

class NotFoundFailure extends Failure {
  const NotFoundFailure({super.message = 'Not found', super.code = 'NOT_FOUND'});
}

class ConflictFailure extends Failure {
  const ConflictFailure({required super.message, super.code = 'CONFLICT'});
}

class ValidationFailure extends Failure {
  final List<Map<String, String>>? fields;
  const ValidationFailure({required super.message, super.code = 'VALIDATION_ERROR', this.fields});
}

class UnknownFailure extends Failure {
  const UnknownFailure({super.message = 'An unexpected error occurred', super.code = 'UNKNOWN'});
}
