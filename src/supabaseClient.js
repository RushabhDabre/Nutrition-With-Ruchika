import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to the "media" bucket and returns its public URL.
 *
 * One-time setup needed in Supabase Dashboard:
 *   Storage -> New bucket -> name it "media" -> toggle "Public bucket" ON
 *
 * Also set these two env vars (same project as your database, different
 * values - find them under Project Settings -> API):
 *   REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
 *   REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
 */
export async function uploadMediaFile(file, folder = 'misc') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error } = await supabase.storage.from('media').upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  return data.publicUrl;
}
