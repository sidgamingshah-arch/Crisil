part of 'chat_room_bloc.dart';

abstract class ChatRoomState extends Equatable {
  const ChatRoomState();
  @override
  List<Object?> get props => [];
}

class ChatRoomInitial extends ChatRoomState {
  const ChatRoomInitial();
}

class ChatRoomLoading extends ChatRoomState {
  const ChatRoomLoading();
}

class ChatRoomLoaded extends ChatRoomState {
  final List<MessageEntity> messages;
  final bool isTyping;
  final String? typingUserName;

  const ChatRoomLoaded({
    required this.messages,
    required this.isTyping,
    this.typingUserName,
  });

  ChatRoomLoaded copyWith({
    List<MessageEntity>? messages,
    bool? isTyping,
    String? typingUserName,
  }) =>
      ChatRoomLoaded(
        messages: messages ?? this.messages,
        isTyping: isTyping ?? this.isTyping,
        typingUserName: typingUserName,
      );

  @override
  List<Object?> get props => [messages, isTyping, typingUserName];
}

class ChatRoomError extends ChatRoomState {
  final String message;
  const ChatRoomError({required this.message});
  @override
  List<Object?> get props => [message];
}
