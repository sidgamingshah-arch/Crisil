import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/datasources/chat_socket_datasource.dart';
import '../bloc/chat_room_bloc.dart';

class MessageInputBar extends StatefulWidget {
  final String conversationId;
  final void Function(String content) onSend;

  const MessageInputBar({super.key, required this.conversationId, required this.onSend});

  @override
  State<MessageInputBar> createState() => _MessageInputBarState();
}

class _MessageInputBarState extends State<MessageInputBar> {
  final TextEditingController _ctrl = TextEditingController();
  Timer? _typingDebounce;
  bool _isTyping = false;

  void _onTextChanged(String value) {
    final socketDs = context.read<ChatSocketDatasource>();
    if (!_isTyping && value.isNotEmpty) {
      _isTyping = true;
      socketDs.emitTypingStart(widget.conversationId);
    }
    _typingDebounce?.cancel();
    _typingDebounce = Timer(const Duration(seconds: 2), () {
      if (_isTyping) {
        _isTyping = false;
        socketDs.emitTypingStop(widget.conversationId);
      }
    });
  }

  void _send() {
    final content = _ctrl.text.trim();
    if (content.isEmpty) return;
    _ctrl.clear();
    _isTyping = false;
    _typingDebounce?.cancel();
    widget.onSend(content);
  }

  @override
  void dispose() {
    _typingDebounce?.cancel();
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.md,
        right: AppSpacing.sm,
        top: AppSpacing.sm,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.sm,
      ),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.grey100)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _ctrl,
              onChanged: _onTextChanged,
              maxLines: null,
              textCapitalization: TextCapitalization.sentences,
              decoration: const InputDecoration(
                hintText: 'Type a message...',
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 8),
              ),
            ),
          ),
          ValueListenableBuilder<TextEditingValue>(
            valueListenable: _ctrl,
            builder: (_, val, __) => IconButton(
              onPressed: val.text.trim().isEmpty ? null : _send,
              icon: const Icon(Icons.send_rounded),
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }
}
