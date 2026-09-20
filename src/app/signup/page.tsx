import type { Metadata } from "next";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export const metadata: Metadata = {
  title: "Registro",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Nueva cuenta</span>
        <h1>Crear cuenta</h1>
        <p className="muted">
          Usa al menos 8 caracteres, mayúscula, minúscula y número.
        </p>

        <AuthForm
          action={signUpAction}
          submitLabel="Registrarme"
          pendingLabel="Creando cuenta..."
        />

        <div className="auth-links">
          <span>
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
          </span>
        </div>
      </div>
    </section>
  );
}
