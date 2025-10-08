import { Bell, Settings } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import { authService } from '../../services/authService';
import { signalsService } from '../../services/signalsService';
import { analysisService } from '../../services/analysisService';
import { Profile, TradingSignal, MarketAnalysis } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [analyses, setAnalyses] = useState<MarketAnalysis[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const userProfile = await authService.getProfile(user.id);
        setProfile(userProfile);
      }

      const [signalsData, analysesData] = await Promise.all([
        signalsService.getActiveSignals(),
        analysisService.getAllAnalysis(),
      ]);

      setSignals(signalsData.slice(0, 3));
      setAnalyses(analysesData.slice(0, 2));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          paddingTop: 50,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              Welcome back!
            </Text>
            <Text style={{ fontSize: 15, color: "#6b7280", marginTop: 2 }}>
              {profile?.full_name || 'Trader'}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {profile?.is_admin && (
              <TouchableOpacity onPress={() => navigation.navigate('Admin' as never)}>
                <Settings size={26} color="#2563eb" />
              </TouchableOpacity>
            )}
            <TouchableOpacity>
              <Bell size={26} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
        }
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827" }}>
            Subscription Status
          </Text>
          <Text style={{ marginTop: 8, color: "#374151", fontSize: 15 }}>
            {profile?.subscription_status || 'Free Plan'}
          </Text>
          {profile?.subscription_expires && (
            <>
              <Text style={{ marginTop: 6, color: "#10b981", fontWeight: "600", fontSize: 14 }}>
                Active
              </Text>
              <Text style={{ marginTop: 4, color: "#6b7280", fontSize: 14 }}>
                Expires: {new Date(profile.subscription_expires).toLocaleDateString()}
              </Text>
            </>
          )}
          <TouchableOpacity
            style={{
              marginTop: 14,
              backgroundColor: "#2563eb",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
              Upgrade Plan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
            Active Trading Signals
          </Text>
          {signals.length > 0 ? (
            signals.map((s) => (
              <View
                key={s.id}
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.03,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>{s.pair}</Text>
                  <View style={{
                    backgroundColor: s.signal_type === "BUY" ? "#d1fae5" : "#fee2e2",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}>
                    <Text style={{
                      color: s.signal_type === "BUY" ? "#059669" : "#dc2626",
                      fontWeight: "700",
                      fontSize: 13,
                    }}>
                      {s.signal_type}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
                  {new Date(s.created_at).toLocaleDateString()}
                </Text>
                {s.note && <Text style={{ marginBottom: 10, color: "#374151", fontSize: 14 }}>{s.note}</Text>}
                <View style={{ backgroundColor: "#f9fafb", padding: 10, borderRadius: 6 }}>
                  <Text style={{ fontSize: 13, color: "#374151", marginBottom: 3 }}>Entry: <Text style={{ fontWeight: "600" }}>{s.entry_price}</Text></Text>
                  <Text style={{ fontSize: 13, color: "#374151", marginBottom: 3 }}>Take Profit: <Text style={{ fontWeight: "600", color: "#059669" }}>{s.take_profit}</Text></Text>
                  <Text style={{ fontSize: 13, color: "#374151" }}>Stop Loss: <Text style={{ fontWeight: "600", color: "#dc2626" }}>{s.stop_loss}</Text></Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" }}>
              <Text style={{ color: "#6b7280", fontSize: 14 }}>No active signals available</Text>
            </View>
          )}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
            Market Analysis
          </Text>
          {analyses.length > 0 ? (
            analyses.map((a) => (
              <View
                key={a.id}
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.03,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                  <View style={{
                    backgroundColor: "#dbeafe",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginRight: 8,
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#1e40af" }}>
                      {a.category}
                    </Text>
                  </View>
                  <Text style={{ color: "#6b7280", fontSize: 13 }}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "700", marginTop: 4, marginBottom: 8, color: "#111827" }}>
                  {a.title}
                </Text>
                <Text style={{ color: "#374151", fontSize: 14, lineHeight: 20 }} numberOfLines={3}>
                  {a.content}
                </Text>
              </View>
            ))
          ) : (
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" }}>
              <Text style={{ color: "#6b7280", fontSize: 14 }}>No analysis available</Text>
            </View>
          )}
        </View>
      </ScrollView>

     
    </View>
  );
}

