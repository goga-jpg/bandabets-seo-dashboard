// src/api/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bandabets-hotgames.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CEANsTc885URtiGQydRIfQ_rsULeDde';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
