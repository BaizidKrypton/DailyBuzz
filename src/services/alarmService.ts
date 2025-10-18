import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Alarm = Database['public']['Tables']['alarms']['Row'];
type AlarmInsert = Database['public']['Tables']['alarms']['Insert'];
type AlarmUpdate = Database['public']['Tables']['alarms']['Update'];

export const alarmService = {
  async createAlarm(alarmData: AlarmInsert) {
    const { data, error } = await supabase
      .from('alarms')
      .insert(alarmData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAlarms(userId: string) {
    const { data, error } = await supabase
      .from('alarms')
      .select('*')
      .eq('user_id', userId)
      .order('time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAlarmById(id: string) {
    const { data, error } = await supabase
      .from('alarms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateAlarm(id: string, updates: AlarmUpdate) {
    const { data, error } = await supabase
      .from('alarms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAlarm(id: string) {
    const { error } = await supabase
      .from('alarms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleAlarm(id: string, isActive: boolean) {
    return this.updateAlarm(id, { is_active: isActive });
  }
};
