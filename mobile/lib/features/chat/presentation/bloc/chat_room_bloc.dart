import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';
import '../../domain/entities/message_entity.dart';
import '../../data/datasources/chat_socket_datasource.dart';

part 'chat_room_event.dart';
part 'chat_room_state.dart';

@injectable
class ChatRoomBloc extends Bloc<ChatRoomEvent, ChatRoomState> {
  final ChatSocketDatasource _socketDatasource;
  StreamSubscription? _messageSub;
  StreamSubscription? _typingSub;
  String? _conversationId;

  ChatRoomBloc(this._socketDatasource) : super(const ChatRoomInitial()) {
    on<ChatRoomEntered>(_onEntered);
    on<ChatRoomLeft>(_onLeft);
    on<ChatRoomMessageSent>(_onMessageSent);
    on<ChatRoomSocketMessageReceived>(_onSocketMessage);
    on<ChatRoomTypingStarted>(_onTypingStarted);
    on<ChatRoomTypingStopped>(_onTypingStopped);
  }

  Future<void> _onEntered(ChatRoomEntered event, Emitter<ChatRoomState> emit) async {
    _conversationId = event.conversationId;
    _socketDatasource.joinRoom(event.conversationId);

    _messageSub = _socketDatasource.messages.listen((data) {
      if (data['conversation_id'] == event.conversationId) {
        add(ChatRoomSocketMessageReceived(data: data));
      }
    });

    _typingSub = _socketDatasource.typing.listen((data) {
      if (data['conversation_id'] == event.conversationId) {
        if (data['stopped'] == true) {
          add(const ChatRoomTypingStopped());
        } else {
          add(ChatRoomTypingStarted(userName: data['user_name'] ?? ''));
        }
      }
    });

    // Load initial message history from REST API
    emit(const ChatRoomLoaded(messages: [], isTyping: false, typingUserName: null));
  }

  Future<void> _onLeft(ChatRoomLeft event, Emitter<ChatRoomState> emit) async {
    if (_conversationId != null) {
      _socketDatasource.leaveRoom(_conversationId!);
    }
    await _messageSub?.cancel();
    await _typingSub?.cancel();
  }

  Future<void> _onMessageSent(ChatRoomMessageSent event, Emitter<ChatRoomState> emit) async {
    if (_conversationId == null) return;
    _socketDatasource.sendMessage(_conversationId!, event.content);
    _socketDatasource.emitTypingStop(_conversationId!);
  }

  void _onSocketMessage(ChatRoomSocketMessageReceived event, Emitter<ChatRoomState> emit) {
    final current = state;
    if (current is ChatRoomLoaded) {
      final message = MessageEntity(
        id: event.data['id'] ?? '',
        conversationId: event.data['conversation_id'] ?? '',
        senderId: event.data['sender_id'] ?? '',
        senderName: event.data['sender_name'] ?? '',
        senderAvatar: event.data['sender_avatar'],
        content: event.data['content'] ?? '',
        createdAt: DateTime.tryParse(event.data['created_at'] ?? '') ?? DateTime.now(),
        isMine: false, // resolved by comparing senderId with current user
      );
      emit(current.copyWith(
        messages: [...current.messages, message],
        isTyping: false,
      ));
      if (_conversationId != null) _socketDatasource.markRead(_conversationId!);
    }
  }

  void _onTypingStarted(ChatRoomTypingStarted event, Emitter<ChatRoomState> emit) {
    if (state is ChatRoomLoaded) {
      emit((state as ChatRoomLoaded).copyWith(isTyping: true, typingUserName: event.userName));
    }
  }

  void _onTypingStopped(ChatRoomTypingStopped event, Emitter<ChatRoomState> emit) {
    if (state is ChatRoomLoaded) {
      emit((state as ChatRoomLoaded).copyWith(isTyping: false, typingUserName: null));
    }
  }

  @override
  Future<void> close() {
    _messageSub?.cancel();
    _typingSub?.cancel();
    return super.close();
  }
}
