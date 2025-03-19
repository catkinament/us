import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zoarxylkfesomfklajdu.supabase.co"; // 你的 Supabase 项目 URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvYXJ4eWxrZmVzb21ma2xhamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNTI3MzksImV4cCI6MjA1NzkyODczOX0.J7mAQ05H7BXKQEG8-mjK_Ym5wz9PW3za3qezRFoJ9Y4"; // 你的 Supabase API Key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
