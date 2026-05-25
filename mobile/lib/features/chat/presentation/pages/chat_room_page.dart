import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../bloc/chat_room_bloc.dart';
import '../widgets/message_bubble.dart';
import '../widgets/typing_indicator.dart';
import '../widgets/message_input_bar.dart';

class ChatRoomPage extends StatefulWidget {
  final String conversationId;
  final String? title;

  const ChatRoomPage({super.key, required this.conversationId, this.title});

  @override
  State<ChatRoomPage> createState() => _ChatRoomPageState();
}

class _ChatRoomPageState extends State<ChatRoomPage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<ChatRoomBloc>().add(ChatRoomEntered(conversationId: widget.conversationId));
  }

  @override
  void dispose() {
    context.read<ChatRoomBloc>().add(const ChatRoomLeft());
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title ?? 'Chat'),
        actions: [
          IconButton(icon: const Icon(Icons.people_outline), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: BlocConsumer<ChatRoomBloc, ChatRoomState>(
              listener: (context, state) {
                if (state is ChatRoomLoaded) _scrollToBottom();
              },
              builder: (context, state) {
                if (state is ChatRoomLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (state is ChatRoomLoaded) {
                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.sm,
                    ),
                    itemCount: state.messages.length + (state.isTyping ? 1 : 0),
                    itemBuilder: (_, i) {
                      if (state.isTyping && i == state.messages.length) {
                        return TypingIndicator(userName: state.typingUserName ?? '');
                      }
                      return MessageBubble(message: state.messages[i]);
                    },
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ),
          MessageInputBar(
            conversationId: widget.conversationId,
            onSend: (content) {
              context.read<ChatRoomBloc>().add(ChatRoomMessageSent(content: content));
            },
          ),
        ],
      ),
    );
  }
}
