import type { Metadata } from "next";
import { PasswordUpdateForm } from "@/components/password-update-form";

export const metadata: Metadata = { title: "Actualizar contraseña", robots: { index: false, follow: false } };

export default function UpdatePasswordPage() {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Nueva credencial</span>
        <h1>Actualizar contraseña</h1>
        <p className="muted">El enlace debe haber sido abierto desde el correo de recuperación.</p>
        <PasswordUpdateForm />
      </div>
    </section>
  );
}
