// app/index.tsx
import { useNavigation } from '@react-navigation/native';
import { TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = () => {
    console.log(isLogin ? "Logging in..." : "Registering...", {
      email,
      password,
      name,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.iconBox}>
          <TrendingUp size={32} color="white" />
        </View>
        <Text style={styles.title}>TradePro</Text>
        <Text style={styles.subtitle}>
          Professional Trading Signals & Analysis
        </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Main' as never)}>
        <Text style={{ color: "blue", fontSize: 18 }}>Proceed to Dashboard</Text>
      </TouchableOpacity>
      
        {/* Toggle Buttons */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLogin && styles.activeBtn]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={isLogin ? styles.activeText : styles.inactiveText}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLogin && styles.activeBtn]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={!isLogin ? styles.activeText : styles.inactiveText}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {isLogin && (
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {isLogin ? "Login" : "Create Account"}
          </Text>
        </TouchableOpacity>

        {!isLogin && (
          <Text style={styles.terms}>
            By registering, you agree to our Terms & Conditions
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 20 },
  toggleRow: { flexDirection: "row", marginBottom: 20 },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeBtn: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  activeText: { color: "white", fontWeight: "bold" },
  inactiveText: { color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  forgot: { color: "#2563eb", textAlign: "right", marginBottom: 12 },
  submitBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "white", fontSize: 16, fontWeight: "bold" },
  terms: {
    marginTop: 16,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
