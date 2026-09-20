import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SecureWeb | Autenticación segura con Next.js y Supabase",
    template: "%s | SecureWeb",
  },
  description:
    "Aplicación profesional con autenticación segura, sesiones httpOnly, protección de rutas y buenas prácticas SEO.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: "/",
    siteName: "SecureWeb",
    title: "SecureWeb | Seguridad web profesional",
    description: "Next.js 16, Supabase, Server Actions, cookies seguras y SEO técnico.",
  },
  twitter: {
    card: "summary",
    title: "SecureWeb",
    description: "Autenticación segura y SEO técnico con Next.js 16 y Supabase.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">SecureWeb · Proyecto académico de seguridad y SEO</footer>
      </body>
    </html>
  );
}
