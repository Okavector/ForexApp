import React from 'react';
import { Text, View } from 'react-native';

export default function SignalCard({ signal }: { signal: any }) {
  return (
    <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' }}>
      <Text style={{ fontWeight: '600' }}>{signal.pair}</Text>
      <Text style={{ color: '#6b7280' }}>{signal.date}</Text>
      <Text>{signal.note}</Text>
    </View>
  );
}
