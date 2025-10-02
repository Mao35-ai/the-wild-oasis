import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://moecqdorwanjshyebdth.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZWNxZG9yd2FuanNoeWViZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODAyMzUsImV4cCI6MjA3MjU1NjIzNX0.P9WmA_A_eZnH-9M0M5pzr-zqjI9pGfZU7tzIFYGG6KU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
