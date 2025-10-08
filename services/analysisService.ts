import { supabase, MarketAnalysis } from '../lib/supabase';

export const analysisService = {
  async getAllAnalysis(): Promise<MarketAnalysis[]> {
    const { data, error } = await supabase
      .from('market_analysis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAnalysisByCategory(category: string): Promise<MarketAnalysis[]> {
    const { data, error } = await supabase
      .from('market_analysis')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAnalysis(analysis: Omit<MarketAnalysis, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('market_analysis')
      .insert(analysis)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAnalysis(id: string, updates: Partial<MarketAnalysis>) {
    const { data, error } = await supabase
      .from('market_analysis')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAnalysis(id: string) {
    const { error } = await supabase
      .from('market_analysis')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
