import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client required by the architecture. Authentication in this project
 * intentionally stays server-side so httpOnly session cookies are never read
 * by JavaScript. Use this client only for public/anonymous browser operations.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
