import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Iniciar sesión", robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const supabase = await createClient();
const { data } = await supabase.auth.getUser();

if (data.user) {
  redirect("/dashboard");
}

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Acceso seguro</span>
        <h1>Iniciar sesión</h1>
        <p className="muted">Tus credenciales se procesan mediante una Server Action.</p>
        {message && <p className="message success">{message}</p>}
        <AuthForm action={signInAction} submitLabel="Entrar" pendingLabel="Verificando..." />
        <div className="auth-links">
          <Link href="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <span>¿No tienes cuenta? <Link href="/signup">Regístrate</Link></span>
        </div>
      </div>
    </section>
  );
}
