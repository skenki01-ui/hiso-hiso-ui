import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kvtteaeodxjkualffemx.supabase.co";

const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dHRlYWVvZHhqa3VhbGZmZW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MjY1NDYsImV4cCI6MjA4NTQwMjU0Nn0.D8IYkaYcDVWvkybEiWrP0qUqMpmLclBhzjc4b5ylV9g";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);