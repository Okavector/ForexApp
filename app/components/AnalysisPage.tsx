import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


// Minimal Analysis type
type Analysis = {
  id: string;
  category: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
};

interface AnalysisPageProps {
  analyses?: Analysis[];
  selectedAnalysis?: Analysis;
  onSelectAnalysis?: (analysis: Analysis) => void;
  onBack?: () => void;
}

export default function AnalysisPage({
  analyses,
  selectedAnalysis,
  onSelectAnalysis,
  onBack,
}: AnalysisPageProps) {
  const sampleAnalyses: Analysis[] = [
    { id: '1', category: 'Crypto', date: '10/6/2025', title: 'Sample Analysis', content: 'Sample content' },
  ];

  analyses = analyses ?? sampleAnalyses;
  onSelectAnalysis = onSelectAnalysis ?? (() => {});
  onBack = onBack ?? (() => {});
  if (selectedAnalysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedAnalysis.title}</Text>
          <View style={styles.meta}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedAnalysis.category}</Text>
            </View>
            <Text style={styles.date}>
              {new Date(selectedAnalysis.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {selectedAnalysis.imageUrl && (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Chart Image</Text>
            </View>
          )}

          <View style={styles.textContainer}>
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

      <ScrollView contentContainerStyle={styles.content}>
        {analyses.map((analysis) => (
          <TouchableOpacity
            key={analysis.id}
            style={styles.card}
            onPress={() => onSelectAnalysis(analysis)}
          >
            <Text style={styles.cardTitle}>{analysis.title}</Text>
            <Text style={styles.cardCategory}>{analysis.category}</Text>
            <Text style={styles.cardDate}>
              {new Date(analysis.date).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  subtitle: { color: "#6b7280" },
  backButton: { marginBottom: 8 },
  backButtonText: { color: "#2563eb", fontSize: 16 },
  meta: { flexDirection: "row", alignItems: "center" },
  badge: { backgroundColor: "#e0e7ff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: "#1e40af", fontSize: 12 },
  date: { color: "#6b7280", marginLeft: 8, fontSize: 12 },
  content: { padding: 16 },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imageText: { color: "#6b7280" },
  textContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  contentText: { fontSize: 14, color: "#111827", lineHeight: 20 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitle: { fontWeight: "bold", marginBottom: 2 },
  cardCategory: { color: "#2563eb", fontSize: 12 },
  cardDate: { color: "#6b7280", fontSize: 12 },
});
