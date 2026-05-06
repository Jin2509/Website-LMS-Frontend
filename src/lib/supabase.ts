import { createClient } from '@supabase/supabase-js';

// Đọc URL và API Key từ file .env mà bạn đã tạo ở ngoài cùng
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Khởi tạo cầu nối
export const supabase = createClient(supabaseUrl, supabaseAnonKey);