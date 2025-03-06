import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://nwfnsuslmbulcgjummza.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Zm5zdXNsbWJ1bGNnanVtbXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjIzMDcsImV4cCI6MjA1Njc5ODMwN30.Xlk_UuuIhdOm2DbgZ5AfUDtpE3FMDMMfqc5LrypT-IU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
