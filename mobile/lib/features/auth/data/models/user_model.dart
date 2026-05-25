import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user_entity.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.firebaseUid,
    required super.name,
    required super.email,
    super.avatarUrl,
    super.bio,
    super.languages,
    super.nationality,
    super.rating,
    super.totalReviews,
    super.isVerified,
    super.preferredLanguage,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  factory UserModel.fromEntity(UserEntity e) => UserModel(
    id: e.id, firebaseUid: e.firebaseUid, name: e.name, email: e.email,
    avatarUrl: e.avatarUrl, bio: e.bio, languages: e.languages,
    nationality: e.nationality, rating: e.rating, totalReviews: e.totalReviews,
    isVerified: e.isVerified, preferredLanguage: e.preferredLanguage,
  );
}
