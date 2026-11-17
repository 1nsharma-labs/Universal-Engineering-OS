import 'package:flutter/material.dart';

void main() {
  runApp(const UniversalHubApp());
}

class UniversalHubApp extends StatelessWidget {
  const UniversalHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Universal Dev Hub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(useMaterial3: true).copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: const HubDashboardPage(),
    );
  }
}

class HubDashboardPage extends StatefulWidget {
  const HubDashboardPage({super.key});

  @override
  State<HubDashboardPage> createState() => _HubDashboardPageState();
}

class _HubDashboardPageState extends State<HubDashboardPage> {
  int _pings = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Universal Dev Hub Mobile')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.hub, size: 64, color: Color(0xFF38BDF8)),
            const SizedBox(height: 16),
            const Text(
              'Flutter Cross-Platform Starter',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Gateway Pings: $_pings'),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => setState(() => _pings++),
              icon: const Icon(Icons.bolt),
              label: const Text('Ping Local Cluster'),
            ),
          ],
        ),
      ),
    );
  }
}
