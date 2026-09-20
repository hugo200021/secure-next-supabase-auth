import type { Metadata } from "next";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Recuperar contraseña", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Recuperación</span>
        <h1>Recuperar contraseña</h1>
        <p className="muted">Te enviaremos un enlace si el correo pertenece a una cuenta.</p>
        <AuthForm
          action={forgotPasswordAction}
          submitLabel="Enviar enlace"
          pendingLabel="Enviando..."
          password={false}
        />
        <div className="auth-links"><Link href="/login">Volver al inicio de sesión</Link></div>
      </div>
    </section>
  );
}
