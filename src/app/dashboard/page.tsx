import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("created_at")
    .eq("id", data.user.id)
    .maybeSingle();

  return (
    <section className="dashboard-shell">
      <div className="dashboard-card">
        <span className="status-dot">Sesión verificada</span>
        <h1>Dashboard privado</h1>
        <p>Esta información solo se renderiza después de validar la sesión en el servidor.</p>
        <dl className="user-data">
          <div><dt>ID de usuario</dt><dd>{data.user.id}</dd></div>
          <div><dt>Correo</dt><dd>{data.user.email ?? "No disponible"}</dd></div>
          <div><dt>Confirmado</dt><dd>{data.user.email_confirmed_at ? "Sí" : "No"}</dd></div>
          <div><dt>Perfil creado</dt><dd>{profile?.created_at ? new Date(profile.created_at).toLocaleString("es-SV") : "Pendiente"}</dd></div>
        </dl>
        <form action={signOutAction}>
          <button className="secondary-button" type="submit">Cerrar sesión</button>
        </form>
      </div>
    </section>
  );
}
