import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String firebaseUid;
  final String name;
  final String email;
  final String? avatarUrl;
  final String? bio;
  final List<String> languages;
  final String? nationality;
  final double rating;
  final int totalReviews;
  final bool isVerified;
  final String preferredLanguage;

  const UserEntity({
    required this.id,
    required this.firebaseUid,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.bio,
    this.languages = const [],
    this.nationality,
    this.rating = 0.0,
    this.totalReviews = 0,
    this.isVerified = false,
    this.preferredLanguage = 'en',
  });

  @override
  List<Object?> get props => [id, firebaseUid, name, email];
}
