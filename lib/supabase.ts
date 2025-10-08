import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  subscription_status: string;
  subscription_expires: string | null;
  created_at: string;
  updated_at: string;
}

export interface TradingSignal {
  id: string;
  pair: string;
  signal_type: string;
  status: string;
  entry_price: string;
  exit_price: string;
  stop_loss: string;
  take_profit: string;
  note: string;
  created_by: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface MarketAnalysis {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
