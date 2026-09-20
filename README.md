# 🔐 SecureWeb — Next.js 16 + Supabase Auth + SEO

Proyecto académico que implementa autenticación segura en servidor con **Next.js 16 (App Router)**, **TypeScript**, **Supabase Auth**, **Server Actions**, cookies de sesión **httpOnly**, protección de rutas y fundamentos de **SEO técnico**.

## Funcionalidades

- Registro con validación en cliente y servidor.
- Inicio y cierre de sesión mediante Server Actions.
- Verificación de correo mediante endpoint SSR `/auth/confirm`.
- Recuperación y cambio de contraseña.
- Dashboard privado con información del usuario autenticado y lectura segura de la tabla `profiles`.
- Redirección de usuarios no autenticados y de usuarios autenticados en rutas de login/registro.
- Refresco de sesión mediante la capa `proxy.ts` de Next.js 16.
- Cookies de sesión reforzadas con `httpOnly`, `secure` en producción, `sameSite=lax` y `path=/`.
- Protección CSRF adicional verificando `Origin`/`Host` en Server Actions.
- Protección XSS mediante escape automático de React, ausencia de HTML de usuario sin sanitizar y headers de seguridad/CSP.
- Tokens de autenticación fuera de `localStorage` y fuera del alcance de JavaScript.
- Metadata SEO, canonical, Open Graph, Twitter metadata, JSON-LD, `robots.txt` y `sitemap.xml`.

> **Nota de Next.js 16:** el archivo antes llamado `middleware.ts` fue renombrado oficialmente a `proxy.ts`. En este proyecto `proxy.ts` cumple la función solicitada de middleware: refresca sesiones y protege rutas.

## Arquitectura

```text
src/
├── app/
│   ├── actions/auth.ts
│   ├── auth/confirm/route.ts
│   ├── dashboard/page.tsx
│   ├── forgot-password/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── update-password/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
└── lib/supabase/
    ├── client.ts
    ├── cookie-options.ts
    ├── proxy.ts
    └── server.ts
proxy.ts
```

## 1. Instalar dependencias

```bash
npm install
```

## 2. Crear el proyecto en Supabase

1. Crea un proyecto en Supabase.
2. Ve a **Connect** o **Project Settings → API**.
3. Copia:
   - Project URL
   - Publishable key

No uses `service_role` en este proyecto ni la expongas al navegador.

## 3. Crear la tabla de base de datos

Abre **Supabase → SQL Editor**, pega el contenido de `supabase/schema.sql` y ejecútalo una sola vez.

Ese script:

- crea `public.profiles`;
- vincula cada perfil con `auth.users`;
- activa Row Level Security (RLS);
- permite que cada usuario autenticado lea únicamente su propio perfil;
- crea automáticamente un perfil cuando se registra un usuario.

## 4. Variables de entorno

Copia `.env.example` como `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REEMPLAZAR
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

En producción, `NEXT_PUBLIC_SITE_URL` debe ser la URL real de Vercel, por ejemplo:

```env
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

## 5. Configurar URLs en Supabase

En **Authentication → URL Configuration**:

- Site URL local: `http://localhost:3000`
- Agrega en Redirect URLs:
  - `http://localhost:3000/**`
  - `https://tu-proyecto.vercel.app/**`

Al desplegar, cambia la **Site URL** a la URL de producción.

## 6. Configurar plantillas de correo para SSR

Para que verificación y recuperación establezcan la sesión mediante el endpoint del servidor, cambia los enlaces en **Authentication → Email Templates**.

### Confirm signup

Usa un enlace con este formato:

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard">
  Confirmar correo
</a>
```

### Reset password

Usa:

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/update-password">
  Restablecer contraseña
</a>
```

## 7. Ejecutar localmente

```bash
npm run dev
```

Abre `http://localhost:3000`.

## 8. Verificación de seguridad

Después de iniciar sesión, abre DevTools → Application → Cookies y verifica que las cookies de Supabase tengan:

- `HttpOnly`: activado
- `Secure`: activado en producción HTTPS
- `SameSite`: `Lax`

En desarrollo local, `Secure` se desactiva automáticamente porque `http://localhost` no utiliza HTTPS. En Vercel se activa automáticamente por `NODE_ENV=production`.

También puedes comprobar que no existen tokens de Supabase en Local Storage.

## 9. Desplegar en Vercel

1. Sube el proyecto a un repositorio público de GitHub.
2. Importa el repositorio en Vercel.
3. Agrega las tres variables de entorno del archivo `.env.example` con valores reales.
4. Despliega.
5. Copia la URL final de Vercel.
6. Regresa a Supabase y actualiza **Site URL** y **Redirect URLs**.
7. Verifica registro, confirmación de correo, login, dashboard, logout y recuperación de contraseña en producción.

## Seguridad aplicada

### XSS

React escapa contenido dinámico por defecto. No se renderiza HTML proveniente del usuario. El JSON-LD es constante y escapa `<` antes de insertarse. Se agregan headers de seguridad, incluido CSP.

### CSRF

Las acciones de autenticación son Server Actions y, adicionalmente, validan que `Origin` coincida con `Host`. Las cookies usan `SameSite=Lax`.

### Sesión y cookies

La autenticación se ejecuta exclusivamente en servidor. Las cookies de sesión son `httpOnly`, por lo que JavaScript del navegador no puede leer los tokens. El browser client de Supabase existe para cumplir la separación arquitectónica y queda destinado a operaciones públicas/anónimas; no administra la sesión de Auth.

## SEO técnico

- `metadataBase`, títulos y descripciones.
- URL canonical.
- Open Graph y Twitter cards.
- JSON-LD con `WebApplication`.
- `robots.txt` generado desde `robots.ts`.
- `sitemap.xml` generado desde `sitemap.ts`.
- Rutas privadas/no útiles para buscadores marcadas como `noindex`.
- HTML semántico y estructura clara de encabezados.

## Comandos de calidad

```bash
npm run lint
npm run build
```

Ambos deben finalizar sin errores antes de entregar.

## Stack

- Next.js 16.3.5
- React 19.2
- TypeScript
- Supabase Auth
- `@supabase/ssr`
- Zod
