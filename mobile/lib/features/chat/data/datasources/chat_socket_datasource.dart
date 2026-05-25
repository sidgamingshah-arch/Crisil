import 'dart:async';
import 'package:injectable/injectable.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../../../../core/constants/api_constants.dart';

@singleton
class ChatSocketDatasource {
  IO.Socket? _socket;
  final StreamController<Map<String, dynamic>> _messageController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _typingController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _readController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _matchController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _discountController =
      StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get messages => _messageController.stream;
  Stream<Map<String, dynamic>> get typing => _typingController.stream;
  Stream<Map<String, dynamic>> get readReceipts => _readController.stream;
  Stream<Map<String, dynamic>> get transportUpdates => _matchController.stream;
  Stream<Map<String, dynamic>> get discountUpdates => _discountController.stream;

  bool get isConnected => _socket?.connected ?? false;

  void connect(String firebaseToken) {
    if (_socket?.connected == true) return;

    _socket = IO.io(ApiConstants.wsUrl, IO.OptionBuilder()
        .setTransports(['websocket'])
        .setAuth({'token': firebaseToken})
        .disableAutoConnect()
        .build());

    _socket!
      ..on('connect', (_) => print('[Socket] connected'))
      ..on('disconnect', (_) => print('[Socket] disconnected'))
      ..on('connect_error', (e) => print('[Socket] error: $e'))
      ..on('receive_message', (data) => _messageController.add(Map<String, dynamic>.from(data)))
      ..on('typing_start', (data) => _typingController.add(Map<String, dynamic>.from(data)))
      ..on('typing_stop', (data) => _typingController.add({'...': data, 'stopped': true}))
      ..on('messages_read', (data) => _readController.add(Map<String, dynamic>.from(data)))
      ..on('transport_request_joined', (data) => _matchController.add(Map<String, dynamic>.from(data)))
      ..on('activity_booking_updated', (data) => _discountController.add(Map<String, dynamic>.from(data)));

    _socket!.connect();
  }

  void disconnect() => _socket?.disconnect();

  void joinRoom(String conversationId) =>
      _socket?.emit('join_room', {'conversation_id': conversationId});

  void leaveRoom(String conversationId) =>
      _socket?.emit('leave_room', {'conversation_id': conversationId});

  void sendMessage(String conversationId, String content, {String type = 'text'}) =>
      _socket?.emit('send_message', {
        'conversation_id': conversationId,
        'content': content,
        'type': type,
      });

  void markRead(String conversationId) =>
      _socket?.emit('message_read', {'conversation_id': conversationId});

  void emitTypingStart(String conversationId) =>
      _socket?.emit('typing_start', {'conversation_id': conversationId});

  void emitTypingStop(String conversationId) =>
      _socket?.emit('typing_stop', {'conversation_id': conversationId});

  void subscribeToActivityBooking(String bookingId) =>
      _socket?.emit('subscribe_activity_booking', {'booking_id': bookingId});

  void subscribeToTransport(String requestId) =>
      _socket?.emit('subscribe_transport', {'request_id': requestId});

  void updateLocation(double lat, double lng, {String? destinationId, bool isSharing = true}) =>
      _socket?.emit('update_location', {
        'latitude': lat,
        'longitude': lng,
        'destination_id': destinationId,
        'is_sharing': isSharing,
      });

  void dispose() {
    _socket?.disconnect();
    _messageController.close();
    _typingController.close();
    _readController.close();
    _matchController.close();
    _discountController.close();
  }
}
