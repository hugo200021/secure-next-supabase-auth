import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { secureCookieOptions } from "./cookie-options";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: secureCookieOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                ...secureCookieOptions,
              });
            });
          } catch {
            // Server Components cannot always write cookies. Session refresh is
            // handled by proxy.ts, while Server Actions/Route Handlers can write.
          }
        },
      },
    },
  );
}
