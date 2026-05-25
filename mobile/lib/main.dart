import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'app.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/discover/presentation/bloc/discover_bloc.dart';
import 'features/transport/presentation/bloc/transport_bloc.dart';
import 'features/activities/presentation/bloc/activities_bloc.dart';
import 'features/chat/presentation/bloc/chat_room_bloc.dart';
import 'features/chat/data/datasources/chat_socket_datasource.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Handle background FCM messages
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Firebase
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Local storage
  await Hive.initFlutter();

  runApp(const TourMateApp());
}
