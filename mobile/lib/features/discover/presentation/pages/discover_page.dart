import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../bloc/discover_bloc.dart';
import '../widgets/nearby_user_bottom_sheet.dart';
import '../widgets/destination_search_bar.dart';

class DiscoverPage extends StatefulWidget {
  const DiscoverPage({super.key});

  @override
  State<DiscoverPage> createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  GoogleMapController? _mapController;
  Position? _currentPosition;
  static const CameraPosition _defaultCamera = CameraPosition(
    target: LatLng(48.8584, 2.2945), // Paris default
    zoom: 14,
  );

  @override
  void initState() {
    super.initState();
    _initLocation();
  }

  Future<void> _initLocation() async {
    final permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
      return;
    }
    final position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
    setState(() => _currentPosition = position);
    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(LatLng(position.latitude, position.longitude), 15),
    );
    context.read<DiscoverBloc>().add(DiscoverLoadNearbyUsers(
      latitude: position.latitude,
      longitude: position.longitude,
    ));
  }

  Set<Marker> _buildMarkers(List nearbyUsers) {
    return nearbyUsers.map((user) {
      return Marker(
        markerId: MarkerId(user.id),
        position: LatLng(user.latitude ?? 0, user.longitude ?? 0),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        infoWindow: InfoWindow(title: user.name, snippet: user.formattedDistance),
      );
    }).toSet();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          BlocBuilder<DiscoverBloc, DiscoverState>(
            builder: (context, state) {
              final markers = state is DiscoverLoaded ? _buildMarkers(state.nearbyUsers) : <Marker>{};
              if (_currentPosition != null) {
                markers.add(Marker(
                  markerId: const MarkerId('self'),
                  position: LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
                  icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
                  infoWindow: const InfoWindow(title: 'You'),
                ));
              }
              return GoogleMap(
                initialCameraPosition: _defaultCamera,
                onMapCreated: (c) => _mapController = c,
                markers: markers,
                myLocationEnabled: true,
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false,
                mapToolbarEnabled: false,
              );
            },
          ),

          // Search bar overlay
          Positioned(
            top: MediaQuery.of(context).padding.top + AppSpacing.sm,
            left: AppSpacing.md,
            right: AppSpacing.md,
            child: const DestinationSearchBar(),
          ),

          // Bottom sheet with nearby users
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: BlocBuilder<DiscoverBloc, DiscoverState>(
              builder: (context, state) {
                if (state is! DiscoverLoaded) return const SizedBox.shrink();
                return NearbyUserBottomSheet(users: state.nearbyUsers);
              },
            ),
          ),

          // Re-center button
          Positioned(
            bottom: 220,
            right: AppSpacing.md,
            child: FloatingActionButton.small(
              heroTag: 'recenter',
              backgroundColor: AppColors.white,
              foregroundColor: AppColors.primary,
              onPressed: () {
                if (_currentPosition != null) {
                  _mapController?.animateCamera(CameraUpdate.newLatLng(
                    LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
                  ));
                }
              },
              child: const Icon(Icons.my_location),
            ),
          ),
        ],
      ),
    );
  }
}
