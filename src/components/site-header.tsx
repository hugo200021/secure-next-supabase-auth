import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const authenticated = Boolean(data?.claims?.sub);

  return (
    <header className="site-header">
      <Link href="/" className="brand">SecureWeb</Link>
      <nav aria-label="Navegación principal">
        {authenticated ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <form action={signOutAction}>
              <button className="link-button" type="submit">Cerrar sesión</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Iniciar sesión</Link>
            <Link href="/signup" className="nav-cta">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}
