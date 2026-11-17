import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [status, setStatus] = useState<'Idle' | 'Connected'>('Idle');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Universal Dev Hub</Text>
        <Text style={styles.subtitle}>React Native + Expo Starter</Text>
        <Text style={styles.badge}>Status: {status}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStatus(status === 'Idle' ? 'Connected' : 'Idle')}
        >
          <Text style={styles.buttonText}>Toggle Cluster Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  badge: { marginTop: 16, fontSize: 14, color: '#38bdf8', fontWeight: '600' },
  button: { marginTop: 20, backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#ffffff', fontWeight: '700' }
});
