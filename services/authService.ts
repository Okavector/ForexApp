import { supabase } from '../lib/supabase';

const HARDCODED_EMAIL = 'testing@gmail.com';
const HARDCODED_PASSWORD = 'okamgba1';

export const authService = {
  async signIn(email: string, password: string) {
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: HARDCODED_EMAIL,
        password: HARDCODED_PASSWORD,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          const signUpResult = await this.signUp(HARDCODED_EMAIL, HARDCODED_PASSWORD, 'Admin User');
          if (signUpResult.error) {
            throw signUpResult.error;
          }
          return signUpResult;
        }
        throw error;
      }

      return { data, error: null };
    }

    return {
      data: null,
      error: { message: 'Invalid credentials. Use testing@gmail.com / okamgba1' }
    };
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          is_admin: email === HARDCODED_EMAIL,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return { data, error: null };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        callback(event, session);
      })();
    });
    return data.subscription;
  },
};
