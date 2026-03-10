import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kvtteaeodxjkualffemx.supabase.co";

const supabaseAnonKey =
  "eyJh...ここにSupabaseのANON KEY全部";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);