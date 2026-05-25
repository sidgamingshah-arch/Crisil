part of 'chat_room_bloc.dart';

abstract class ChatRoomEvent extends Equatable {
  const ChatRoomEvent();
  @override
  List<Object?> get props => [];
}

class ChatRoomEntered extends ChatRoomEvent {
  final String conversationId;
  const ChatRoomEntered({required this.conversationId});
  @override
  List<Object?> get props => [conversationId];
}

class ChatRoomLeft extends ChatRoomEvent {
  const ChatRoomLeft();
}

class ChatRoomMessageSent extends ChatRoomEvent {
  final String content;
  const ChatRoomMessageSent({required this.content});
  @override
  List<Object?> get props => [content];
}

class ChatRoomSocketMessageReceived extends ChatRoomEvent {
  final Map<String, dynamic> data;
  const ChatRoomSocketMessageReceived({required this.data});
  @override
  List<Object?> get props => [data];
}

class ChatRoomTypingStarted extends ChatRoomEvent {
  final String userName;
  const ChatRoomTypingStarted({required this.userName});
  @override
  List<Object?> get props => [userName];
}

class ChatRoomTypingStopped extends ChatRoomEvent {
  const ChatRoomTypingStopped();
}
