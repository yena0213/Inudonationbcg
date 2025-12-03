/**
 * Supabase Client Singleton
 * 여러 곳에서 import해도 하나의 인스턴스만 사용
 */

import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 가져오기 (fallback으로 하드코딩된 값 사용)
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'dnhuzjztsujeuiykvlya';
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaHV6anp0c3VqZXVpeWt2bHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MzUwNDUsImV4cCI6MjA3OTUxMTA0NX0.DznlqoKNLU_SwKArAJjhvfyu9nkugnFCLPh-22fKsd0';

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
