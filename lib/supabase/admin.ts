import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service-role client: bypasses RLS entirely. Server-only — the
// `server-only` import throws a build error if this is ever pulled into a
// client bundle. Use for the leads-insert path (public forms with no
// authenticated session) and for any admin write action.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
