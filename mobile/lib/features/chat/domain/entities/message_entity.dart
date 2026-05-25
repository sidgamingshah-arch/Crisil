import 'package:equatable/equatable.dart';

enum MessageType { text, image, location, system }

class MessageEntity extends Equatable {
  final String id;
  final String conversationId;
  final String senderId;
  final String senderName;
  final String? senderAvatar;
  final String content;
  final MessageType type;
  final DateTime createdAt;
  final bool isMine;

  const MessageEntity({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderName,
    this.senderAvatar,
    required this.content,
    this.type = MessageType.text,
    required this.createdAt,
    required this.isMine,
  });

  @override
  List<Object?> get props => [id];
}

class ConversationEntity extends Equatable {
  final String id;
  final String type;
  final String? title;
  final MessageEntity? lastMessage;
  final int unreadCount;
  final DateTime? lastMessageAt;

  const ConversationEntity({
    required this.id,
    required this.type,
    this.title,
    this.lastMessage,
    this.unreadCount = 0,
    this.lastMessageAt,
  });

  @override
  List<Object?> get props => [id];
}
