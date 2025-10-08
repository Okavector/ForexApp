import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SignalCard from "./SignalCard";


// Minimal Signal type used in this file
type Signal = {
  id: string;
  pair: string;
  date: string;
  type: string;
  status: string;
  note?: string;
  entry?: string;
  exit?: string;
  stopLoss?: string;
  takeProfit?: string;
};

interface SignalsPageProps {
  signals?: Signal[];
}

export default function SignalsPage({ signals }: SignalsPageProps) {
  // fallback sample signals when used as a screen without props
  const sampleSignals: Signal[] = [
    { id: '1', pair: 'BTC/USD', date: '10/6/2025', type: 'BUY', status: 'active', note: 'Sample signal', entry: '$67,500', exit: '$69,000', stopLoss: '$66,800', takeProfit: '$70,000' },
  ];

  signals = signals ?? sampleSignals;
  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");

  const activeSignals = signals.filter((s) => s.status === "active");
  const closedSignals = signals.filter((s) => s.status === "closed");

  const displayedSignals = activeTab === "active" ? activeSignals : closedSignals;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trading Signals</Text>
        <Text style={styles.subtitle}>View all trading signals</Text>
      </View>

      {/* Tabs */}
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

      <ScrollView contentContainerStyle={styles.content}>
        {displayedSignals.length > 0 ? (
          displayedSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
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
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 2 },
  subtitle: { color: "#6b7280" },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: "#2563eb" },
  tabText: { color: "#6b7280" },
  activeTabText: { color: "#2563eb", fontWeight: "bold" },
  content: { padding: 16, paddingBottom: 100 },
  noSignals: { backgroundColor: "#fff", padding: 16, borderRadius: 8, alignItems: "center" },
  noSignalsText: { color: "#6b7280" },
});
