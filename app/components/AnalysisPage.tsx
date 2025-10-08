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
import { analysisService } from '../../services/analysisService';
import { MarketAnalysis } from '../../lib/supabase';

export default function AnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyses, setAnalyses] = useState<MarketAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MarketAnalysis | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await analysisService.getAllAnalysis();
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyses();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (selectedAnalysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedAnalysis(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedAnalysis.category}</Text>
          </View>

          <Text style={styles.detailTitle}>{selectedAnalysis.title}</Text>

          <Text style={styles.detailDate}>
            {new Date(selectedAnalysis.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>

          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{selectedAnalysis.content}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Analysis</Text>
        <Text style={styles.subtitle}>Daily insights and analysis</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
        }
      >
        {analyses.length > 0 ? (
          analyses.map((analysis) => (
            <TouchableOpacity
              key={analysis.id}
              style={styles.card}
              onPress={() => setSelectedAnalysis(analysis)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{analysis.category}</Text>
                </View>
                <Text style={styles.cardDate}>
                  {new Date(analysis.created_at).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{analysis.title}</Text>

              <Text style={styles.cardPreview} numberOfLines={2}>
                {analysis.content}
              </Text>

              <Text style={styles.readMore}>Read more →</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noAnalysis}>
            <Text style={styles.noAnalysisText}>No analysis available</Text>
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
  backButton: { marginBottom: 8 },
  backButtonText: { color: "#2563eb", fontSize: 16, fontWeight: "600" },
  content: { padding: 16, paddingBottom: 100 },
  card: {
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
  categoryBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryText: { color: "#1e40af", fontSize: 12, fontWeight: "600" },
  cardDate: { color: "#6b7280", fontSize: 13 },
  cardTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8, color: "#111827" },
  cardPreview: { color: "#374151", fontSize: 14, lineHeight: 20, marginBottom: 8 },
  readMore: { color: "#2563eb", fontSize: 14, fontWeight: "600" },
  noAnalysis: { backgroundColor: "#fff", padding: 24, borderRadius: 10, alignItems: "center" },
  noAnalysisText: { color: "#6b7280", fontSize: 15 },
  detailContent: { padding: 16, paddingBottom: 40 },
  badge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: { color: "#1e40af", fontSize: 13, fontWeight: "600" },
  detailTitle: { fontSize: 24, fontWeight: "700", marginBottom: 8, color: "#111827", lineHeight: 32 },
  detailDate: { color: "#6b7280", fontSize: 14, marginBottom: 20 },
  contentContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb" },
  contentText: { fontSize: 15, color: "#111827", lineHeight: 24 },
});
