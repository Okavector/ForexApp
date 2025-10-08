import { supabase, TradingSignal } from '../lib/supabase';

export const signalsService = {
  async getAllSignals(): Promise<TradingSignal[]> {
    const { data, error } = await supabase
      .from('trading_signals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getActiveSignals(): Promise<TradingSignal[]> {
    const { data, error } = await supabase
      .from('trading_signals')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getClosedSignals(): Promise<TradingSignal[]> {
    const { data, error } = await supabase
      .from('trading_signals')
      .select('*')
      .eq('status', 'closed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSignal(signal: Omit<TradingSignal, 'id' | 'created_at' | 'closed_at'>) {
    const { data, error } = await supabase
      .from('trading_signals')
      .insert(signal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSignal(id: string, updates: Partial<TradingSignal>) {
    const { data, error } = await supabase
      .from('trading_signals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSignal(id: string) {
    const { error } = await supabase
      .from('trading_signals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async closeSignal(id: string) {
    return this.updateSignal(id, {
      status: 'closed',
      closed_at: new Date().toISOString(),
    });
  },
};
