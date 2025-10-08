import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { signalsService } from '../../services/signalsService';
import { analysisService } from '../../services/analysisService';
import { authService } from '../../services/authService';

export default function AdminPanel() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'signals' | 'analysis'>('signals');
  const [loading, setLoading] = useState(false);

  const [signalForm, setSignalForm] = useState({
    pair: '',
    signal_type: 'BUY',
    entry_price: '',
    take_profit: '',
    stop_loss: '',
    note: '',
  });

  const [analysisForm, setAnalysisForm] = useState({
    title: '',
    category: 'Forex',
    content: '',
  });

  const handleCreateSignal = async () => {
    if (!signalForm.pair || !signalForm.entry_price || !signalForm.take_profit || !signalForm.stop_loss) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await signalsService.createSignal({
        ...signalForm,
        status: 'active',
        created_by: user.id,
        exit_price: '',
      });

      Alert.alert('Success', 'Signal created successfully');
      setSignalForm({
        pair: '',
        signal_type: 'BUY',
        entry_price: '',
        take_profit: '',
        stop_loss: '',
        note: '',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create signal');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnalysis = async () => {
    if (!analysisForm.title || !analysisForm.content) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await analysisService.createAnalysis({
        ...analysisForm,
        created_by: user.id,
        image_url: '',
      });

      Alert.alert('Success', 'Analysis created successfully');
      setAnalysisForm({
        title: '',
        category: 'Forex',
        content: '',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Manage signals and analysis</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signals' && styles.activeTab]}
          onPress={() => setActiveTab('signals')}
        >
          <Text style={[styles.tabText, activeTab === 'signals' && styles.activeTabText]}>
            Create Signal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analysis' && styles.activeTab]}
          onPress={() => setActiveTab('analysis')}
        >
          <Text style={[styles.tabText, activeTab === 'analysis' && styles.activeTabText]}>
            Create Analysis
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'signals' ? (
          <View>
            <Text style={styles.sectionTitle}>New Trading Signal</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Trading Pair *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. BTC/USD, EUR/USD"
                value={signalForm.pair}
                onChangeText={(text) => setSignalForm({ ...signalForm, pair: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Signal Type *</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    signalForm.signal_type === 'BUY' && styles.buyButton,
                  ]}
                  onPress={() => setSignalForm({ ...signalForm, signal_type: 'BUY' })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      signalForm.signal_type === 'BUY' && styles.buyButtonText,
                    ]}
                  >
                    BUY
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    signalForm.signal_type === 'SELL' && styles.sellButton,
                  ]}
                  onPress={() => setSignalForm({ ...signalForm, signal_type: 'SELL' })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      signalForm.signal_type === 'SELL' && styles.sellButtonText,
                    ]}
                  >
                    SELL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Entry Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. $67,500"
                value={signalForm.entry_price}
                onChangeText={(text) => setSignalForm({ ...signalForm, entry_price: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Take Profit *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. $70,000"
                value={signalForm.take_profit}
                onChangeText={(text) => setSignalForm({ ...signalForm, take_profit: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Stop Loss *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. $66,000"
                value={signalForm.stop_loss}
                onChangeText={(text) => setSignalForm({ ...signalForm, stop_loss: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any additional notes..."
                multiline
                numberOfLines={4}
                value={signalForm.note}
                onChangeText={(text) => setSignalForm({ ...signalForm, note: text })}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateSignal}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Plus size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Create Signal</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>New Market Analysis</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bitcoin Breaks Key Resistance"
                value={analysisForm.title}
                onChangeText={(text) => setAnalysisForm({ ...analysisForm, title: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.categoryButtons}>
                {['Forex', 'Crypto', 'Stocks', 'Commodities'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      analysisForm.category === cat && styles.activeCategoryButton,
                    ]}
                    onPress={() => setAnalysisForm({ ...analysisForm, category: cat })}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        analysisForm.category === cat && styles.activeCategoryButtonText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Content *</Text>
              <TextInput
                style={[styles.input, styles.textArea, { height: 200 }]}
                placeholder="Write your analysis here..."
                multiline
                numberOfLines={10}
                value={analysisForm.content}
                onChangeText={(text) => setAnalysisForm({ ...analysisForm, content: text })}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateAnalysis}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Plus size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Create Analysis</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#2563eb' },
  tabText: { fontSize: 15, fontWeight: '500', color: '#6b7280' },
  activeTabText: { color: '#2563eb', fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  typeButtons: { flexDirection: 'row', gap: 12 },
  typeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  buyButton: { backgroundColor: '#d1fae5', borderColor: '#059669' },
  sellButton: { backgroundColor: '#fee2e2', borderColor: '#dc2626' },
  typeButtonText: { fontSize: 15, fontWeight: '700', color: '#6b7280' },
  buyButtonText: { color: '#059669' },
  sellButtonText: { color: '#dc2626' },
  categoryButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  activeCategoryButton: { backgroundColor: '#dbeafe', borderColor: '#2563eb' },
  categoryButtonText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  activeCategoryButtonText: { color: '#2563eb' },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
