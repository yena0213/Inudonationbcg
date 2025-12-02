/**
 * Supabase Client Singleton
 * 여러 곳에서 import해도 하나의 인스턴스만 사용
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseInstance;
}

// 편의를 위한 export
export const supabase = getSupabaseClient();
