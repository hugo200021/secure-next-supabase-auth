import Link from "next/link";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SecureWeb",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    description: "Demostración de autenticación segura con Next.js y Supabase.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="hero">
        <span className="eyebrow">Next.js 16 + Supabase</span>
        <h1>Autenticación segura preparada para aplicaciones web profesionales</h1>
        <p>
          Sesiones gestionadas en servidor, cookies httpOnly, validación robusta,
          rutas privadas y fundamentos de SEO técnico en una arquitectura clara.
        </p>
        <div className="hero-actions">
          <Link href="/signup" className="primary-button">Crear cuenta</Link>
          <Link href="/login" className="secondary-button">Iniciar sesión</Link>
        </div>
      </section>

      <section className="features" aria-labelledby="features-title">
        <div className="section-heading">
          <span className="eyebrow">Capas implementadas</span>
          <h2 id="features-title">Seguridad desde el servidor</h2>
        </div>
        <div className="feature-grid">
          <article><h3>Cookies seguras</h3><p>Sesión protegida con httpOnly, secure en producción y SameSite.</p></article>
          <article><h3>Server Actions</h3><p>Registro, login, logout y recuperación procesados y validados en servidor.</p></article>
          <article><h3>Protección de rutas</h3><p>La capa Proxy de Next.js 16 refresca la sesión y controla el acceso.</p></article>
          <article><h3>SEO técnico</h3><p>Metadata, canonical, robots, sitemap, Open Graph y datos estructurados.</p></article>
        </div>
      </section>
    </>
  );
}
