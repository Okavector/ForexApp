import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { signalsService } from '../../services/signalsService';
import { TradingSignal } from '../../lib/supabase';

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSignals, setActiveSignals] = useState<TradingSignal[]>([]);
  const [closedSignals, setClosedSignals] = useState<TradingSignal[]>([]);

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      const [active, closed] = await Promise.all([
        signalsService.getActiveSignals(),
        signalsService.getClosedSignals(),
      ]);
      setActiveSignals(active);
      setClosedSignals(closed);
    } catch (error) {
      console.error('Error loading signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSignals();
    setRefreshing(false);
  };

  const displayedSignals = activeTab === "active" ? activeSignals : closedSignals;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trading Signals</Text>
        <Text style={styles.subtitle}>View all trading signals</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "active" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active ({activeSignals.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "closed" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("closed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "closed" && styles.activeTabText,
            ]}
          >
            Closed ({closedSignals.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
        }
      >
        {displayedSignals.length > 0 ? (
          displayedSignals.map((signal) => (
            <View key={signal.id} style={styles.signalCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={styles.signalPair}>{signal.pair}</Text>
                <View style={[
                  styles.signalTypeBadge,
                  { backgroundColor: signal.signal_type === "BUY" ? "#d1fae5" : "#fee2e2" }
                ]}>
                  <Text style={[
                    styles.signalTypeText,
                    { color: signal.signal_type === "BUY" ? "#059669" : "#dc2626" }
                  ]}>
                    {signal.signal_type}
                  </Text>
                </View>
              </View>

              <Text style={styles.signalDate}>
                {new Date(signal.created_at).toLocaleDateString()}
              </Text>

              {signal.note && (
                <Text style={styles.signalNote}>{signal.note}</Text>
              )}

              <View style={styles.signalDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Entry:</Text>
                  <Text style={styles.detailValue}>{signal.entry_price}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Take Profit:</Text>
                  <Text style={[styles.detailValue, { color: "#059669", fontWeight: "600" }]}>{signal.take_profit}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Stop Loss:</Text>
                  <Text style={[styles.detailValue, { color: "#dc2626", fontWeight: "600" }]}>{signal.stop_loss}</Text>
                </View>
                {signal.closed_at && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Closed:</Text>
                    <Text style={styles.detailValue}>{new Date(signal.closed_at).toLocaleDateString()}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noSignals}>
            <Text style={styles.noSignalsText}>
              No {activeTab} signals
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: { padding: 16, paddingTop: 50, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4, color: "#111827" },
  subtitle: { color: "#6b7280", fontSize: 14 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", backgroundColor: "#fff" },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: "center" },
  activeTabButton: { borderBottomWidth: 3, borderBottomColor: "#2563eb" },
  tabText: { color: "#6b7280", fontSize: 15, fontWeight: "500" },
  activeTabText: { color: "#2563eb", fontWeight: "700" },
  content: { padding: 16, paddingBottom: 100 },
  signalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  signalPair: { fontSize: 17, fontWeight: "700", color: "#111827" },
  signalTypeBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  signalTypeText: { fontWeight: "700", fontSize: 13 },
  signalDate: { color: "#6b7280", fontSize: 13, marginBottom: 8 },
  signalNote: { color: "#374151", fontSize: 14, marginBottom: 12, lineHeight: 20 },
  signalDetails: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 8 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  detailLabel: { color: "#6b7280", fontSize: 14 },
  detailValue: { color: "#111827", fontSize: 14, fontWeight: "600" },
  noSignals: { backgroundColor: "#fff", padding: 24, borderRadius: 10, alignItems: "center" },
  noSignalsText: { color: "#6b7280", fontSize: 15 },
});
