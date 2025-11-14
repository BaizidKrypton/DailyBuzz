import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Transaction = Database['public']['Tables']['finance_transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['finance_transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['finance_transactions']['Update'];

export const financeService = {
  async createTransaction(data: TransactionInsert) {
    const { data: transaction, error } = await supabase
      .from('finance_transactions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return transaction;
  },

  async getTransactions(userId: string, filters?: { type?: 'INCOME' | 'EXPENSE'; category?: string }) {
    let query = supabase
      .from('finance_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getTransactionById(id: string) {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateTransaction(id: string, updates: TransactionUpdate) {
    const { data, error } = await supabase
      .from('finance_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('finance_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getMonthlyStats(userId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('transaction_date', startOfMonth.toISOString());

    if (error) throw error;

    const income = data
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = data
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return { income, expenses, balance: income - expenses, transactions: data };
  }
};
