import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'core/theme/app_theme.dart';
import 'core/constants/route_constants.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/discover/presentation/bloc/discover_bloc.dart';
import 'features/discover/presentation/pages/discover_page.dart';
import 'features/transport/presentation/bloc/transport_bloc.dart';
import 'features/activities/presentation/bloc/activities_bloc.dart';
import 'features/chat/presentation/bloc/chat_room_bloc.dart';
import 'features/chat/presentation/pages/chat_room_page.dart';
import 'features/chat/data/datasources/chat_socket_datasource.dart';

class TourMateApp extends StatelessWidget {
  const TourMateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => AuthBloc()),
        BlocProvider(create: (_) => DiscoverBloc()),
        BlocProvider(create: (_) => TransportBloc()),
        BlocProvider(create: (_) => ActivitiesBloc()),
      ],
      child: Builder(
        builder: (context) {
          final router = _buildRouter(context);
          return MaterialApp.router(
            title: 'TourMate',
            theme: AppTheme.light,
            routerConfig: router,
            debugShowCheckedModeBanner: false,
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en'),
              Locale('fr'),
              Locale('ja'),
              Locale('es'),
              Locale('zh'),
            ],
          );
        },
      ),
    );
  }

  GoRouter _buildRouter(BuildContext context) {
    return GoRouter(
      initialLocation: RouteConstants.splash,
      redirect: (ctx, state) {
        final authState = ctx.read<AuthBloc>().state;
        final isAuth = authState is AuthAuthenticated;
        final isOnAuthRoute = state.uri.path.startsWith('/auth');
        final isSplash = state.uri.path == RouteConstants.splash;

        if (isSplash) return null;
        if (!isAuth && !isOnAuthRoute) return RouteConstants.login;
        if (isAuth && isOnAuthRoute) return RouteConstants.discover;
        return null;
      },
      routes: [
        GoRoute(
          path: RouteConstants.splash,
          builder: (_, __) => const _SplashPage(),
        ),
        GoRoute(
          path: RouteConstants.login,
          builder: (_, __) => const LoginPage(),
        ),
        ShellRoute(
          builder: (ctx, state, child) => _MainShell(child: child),
          routes: [
            GoRoute(
              path: RouteConstants.discover,
              builder: (_, __) => const DiscoverPage(),
            ),
            GoRoute(
              path: RouteConstants.chat,
              builder: (_, __) => const _PlaceholderPage(title: 'Conversations'),
            ),
            GoRoute(
              path: '/chat/:id',
              builder: (_, state) => BlocProvider(
                create: (ctx) => ChatRoomBloc(ChatSocketDatasource()),
                child: ChatRoomPage(
                  conversationId: state.pathParameters['id']!,
                  title: state.uri.queryParameters['title'],
                ),
              ),
            ),
            GoRoute(
              path: RouteConstants.transport,
              builder: (_, __) => const _PlaceholderPage(title: 'Shared Transport'),
            ),
            GoRoute(
              path: RouteConstants.activities,
              builder: (_, __) => const _PlaceholderPage(title: 'Activities'),
            ),
            GoRoute(
              path: RouteConstants.profile,
              builder: (_, __) => const _PlaceholderPage(title: 'My Profile'),
            ),
            GoRoute(
              path: '/profile/:id',
              builder: (_, state) => _PlaceholderPage(title: 'Profile: ${state.pathParameters['id']}'),
            ),
          ],
        ),
      ],
    );
  }
}

class _SplashPage extends StatefulWidget {
  const _SplashPage();

  @override
  State<_SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<_SplashPage> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) context.go(RouteConstants.login);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0066FF),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(Icons.explore, color: Colors.white, size: 48),
            ),
            const SizedBox(height: 24),
            const Text('TourMate', style: TextStyle(
              color: Colors.white, fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.5,
            )),
            const SizedBox(height: 8),
            Text('Find your travel tribe', style: TextStyle(
              color: Colors.white.withOpacity(0.8), fontSize: 16,
            )),
          ],
        ),
      ),
    );
  }
}

class _MainShell extends StatefulWidget {
  final Widget child;
  const _MainShell({required this.child});

  @override
  State<_MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<_MainShell> {
  int _currentIndex = 0;
  final _routes = [
    RouteConstants.discover,
    RouteConstants.transport,
    RouteConstants.activities,
    RouteConstants.chat,
    RouteConstants.profile,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) {
          setState(() => _currentIndex = i);
          context.go(_routes[i]);
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore), label: 'Discover'),
          BottomNavigationBarItem(icon: Icon(Icons.directions_car_outlined), activeIcon: Icon(Icons.directions_car), label: 'Transport'),
          BottomNavigationBarItem(icon: Icon(Icons.local_activity_outlined), activeIcon: Icon(Icons.local_activity), label: 'Activities'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), activeIcon: Icon(Icons.chat_bubble), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _PlaceholderPage extends StatelessWidget {
  final String title;
  const _PlaceholderPage({required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.construction, size: 64, color: Color(0xFF94A3B8)),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            const Text('Full implementation in progress', style: TextStyle(color: Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }
}
