import { createClient } from '@supabase/supabase-js';

// Development:  nilai dari .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
// Production:   nilai dari Environment Variables di Vercel dashboard
// Fallback:     string kosong -> aman untuk build meski env belum diset
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey);
