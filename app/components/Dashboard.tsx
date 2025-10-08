import { Bell } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<string>("Home");

  const user = {
    name: "John Trader",
    subscriptionStatus: "Monthly Premium",
    active: true,
    expires: "11/6/2025",
    daysLeft: 30,
  };

  const signals = [
    {
      id: "1",
      pair: "BTC/USD",
      date: "10/6/2025",
      type: "BUY",
      status: "active",
      note: "Strong bullish momentum on 4H chart",
      entry: "$67,500",
      exit: "$69,000",
      stopLoss: "$66,800",
      takeProfit: "$70,000",
    },
    {
      id: "2",
      pair: "EUR/USD",
      date: "10/6/2025",
      type: "SELL",
      status: "active",
      note: "Resistance level confirmed",
      entry: "$1.085",
      exit: "$1.08",
      stopLoss: "$1.088",
      takeProfit: "$1.075",
    },
  ];

  const analyses = [
    {
      id: "1",
      category: "Crypto",
      date: "10/6/2025",
      title: "Bitcoin Breaks Key Resistance",
      content:
        "Bitcoin has successfully broken through the $67,000 resistance level with strong volume. Technical indicators suggest continued bullish momentum in the short term. Key levels to watch: Support at $66,500, Resistance at $70,000.",
    },
    {
      id: "2",
      category: "Forex",
      date: "10/6/2025",
      title: "EUR/USD Weekly Outlook",
      content:
        "The EUR/USD pair is showing bearish signals as the dollar strengthens. ECB policy decisions this week will be crucial. Expecting downside toward 1.075.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>
            Welcome back!
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280" }}>{user.name}</Text>
        </View>
        <TouchableOpacity>
          <Bell size={28} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        {/* Subscription Card */}
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 10,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Subscription Status
          </Text>
          <Text style={{ marginTop: 4, color: "#111827" }}>
            {user.subscriptionStatus}
          </Text>
          <Text style={{ marginTop: 4, color: "green", fontWeight: "600" }}>
            {user.active ? "Active" : "Inactive"}
          </Text>
          <Text style={{ marginTop: 4, color: "#6b7280" }}>
            Expires: {user.expires}
          </Text>
          <Text style={{ marginTop: 4, color: "#6b7280" }}>
            {user.daysLeft} days left
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: "#2563eb",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Upgrade Plan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trading Signals */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Daily Trading Signals
          </Text>
          {signals.map((s) => (
            <View
              key={s.id}
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600" }}>{s.pair}</Text>
              <Text style={{ color: "#6b7280", marginBottom: 6 }}>{s.date}</Text>
              <Text
                style={{
                  color: s.type === "BUY" ? "green" : "red",
                  fontWeight: "700",
                  marginBottom: 4,
                }}
              >
                {s.type} ({s.status})
              </Text>
              <Text style={{ marginBottom: 6 }}>{s.note}</Text>
              <Text>Entry: {s.entry}</Text>
              <Text>Exit: {s.exit}</Text>
              <Text>Stop Loss: {s.stopLoss}</Text>
              <Text>Take Profit: {s.takeProfit}</Text>
            </View>
          ))}
        </View>

        {/* Market Analysis */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Daily Market Analysis
          </Text>
          {analyses.map((a) => (
            <View
              key={a.id}
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#2563eb" }}
              >
                {a.category}
              </Text>
              <Text style={{ color: "#6b7280" }}>{a.date}</Text>
              <Text style={{ fontSize: 15, fontWeight: "600", marginTop: 6 }}>
                {a.title}
              </Text>
              <Text style={{ marginTop: 6, color: "#374151" }}>
                {a.content}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

     
    </View>
  );
}

