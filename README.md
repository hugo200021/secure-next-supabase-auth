
# 🔐 SecureWeb — Next.js 16 + Supabase Auth + AWS Amplify

**SecureWeb** es una aplicación web académica desarrollada con Next.js 16, React, TypeScript y Supabase. Implementa un flujo de autenticación con sesiones gestionadas desde el servidor, protección de rutas, un panel privado y fundamentos de SEO técnico.

El proyecto se encuentra desplegado públicamente mediante **AWS Amplify Hosting**, conectado a este repositorio de GitHub. Supabase proporciona la autenticación y la base de datos PostgreSQL administrada.

## 🌐 Enlaces del proyecto

| Recurso | Enlace |
| --- | --- |
| **Aplicación en AWS Amplify (entrega principal)** | https://main.d1ob5fawh4w10p.amplifyapp.com |
| Despliegue alternativo en Vercel | https://secure-next-supabase-auth.vercel.app |
| Código fuente | https://github.com/hugo200021/secure-next-supabase-auth |

> **Estado de despliegue:** AWS Amplify registró una compilación y publicación exitosas en la rama `main` el 1 de noviembre de 2026. Se verificó visualmente la carga de la página principal desde la URL pública. La comprobación completa del registro, inicio de sesión, recuperación de contraseña y dashboard requiere pruebas adicionales.

## 🎯 Funcionalidades

- Registro de usuarios con validaciones del lado del cliente y del servidor.
- Inicio y cierre de sesión con **Server Actions**.
- Confirmación de correo mediante la ruta `/auth/confirm`.
- Recuperación y actualización de contraseñas.
- Dashboard privado con información del usuario autenticado y consulta de `profiles`.
- Redirecciones para proteger rutas privadas y evitar accesos inadecuados a login/registro.
- Refresco de sesión mediante `proxy.ts` de Next.js 16.
- Cookies de sesión configuradas con `httpOnly`, `SameSite=Lax` y `Secure` en producción HTTPS.
- Validación adicional de origen en Server Actions y encabezados de seguridad.
- SEO técnico mediante metadatos, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml`.

## 🛠️ Tecnologías

| Componente | Tecnología |
| --- | --- |
| Framework | Next.js 16.3.5 (App Router) |
| Interfaz | React 19.2 |
| Lenguaje | TypeScript |
| Autenticación | Supabase Auth + `@supabase/ssr` |
| Base de datos | PostgreSQL administrado por Supabase |
| Validación | Zod |
| Alojamiento principal | AWS Amplify Hosting |
| Control de versiones y despliegue | GitHub, rama `main` |

## 🧱 Arquitectura general

```text
Usuario (navegador)
    |
    | HTTPS
    v
AWS Amplify Hosting
    |
    v
Next.js 16 (App Router + Server Actions + proxy.ts)
    |
    | API segura / sesiones
    v
Supabase Auth + PostgreSQL (tabla public.profiles)
```

La interfaz y la lógica de servidor de Next.js se alojan en Amplify. Los servicios de autenticación y almacenamiento relacional se mantienen en Supabase; no se implementó una instancia adicional de MySQL o Laravel para esta aplicación.

### Estructura relevante del repositorio

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
supabase/schema.sql
.env.example
```

En Next.js 16, `proxy.ts` sustituye el nombre anteriormente utilizado `middleware.ts` para esta capa de interceptación de solicitudes.

## 💻 Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/hugo200021/secure-next-supabase-auth.git
cd secure-next-supabase-auth
```

### 2. Instalar dependencias

Se requiere Node.js y npm compatibles con Next.js 16.

```bash
npm ci
```

### 3. Preparar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com/).
2. Abrir **SQL Editor** y ejecutar el archivo `supabase/schema.sql`.
3. En **Project Settings → API Keys**, obtener la **Publishable key**; en la pantalla del proyecto, obtener la **Project URL**.
4. En **Authentication → URL Configuration**, autorizar `http://localhost:3000/**` dentro de las URLs de redirección.

El script SQL configura la tabla `public.profiles`, su relación con `auth.users`, las políticas RLS y el mecanismo de creación de perfiles. No se debe desactivar RLS para hacer funcionar el ejemplo.

### 4. Configurar las variables de entorno

Crear `.env.local` a partir de `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REEMPLAZAR
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Utilizar valores reales del propio proyecto Supabase. **No subir `.env.local` al repositorio** ni incluir claves `service_role`, `sb_secret_` u otras credenciales privilegiadas en variables `NEXT_PUBLIC_`.

### 5. Iniciar el servidor local

```bash
npm run dev
```

Abrir http://localhost:3000 en el navegador.

### 6. Verificaciones de calidad

```bash
npm run lint
npm run build
```

Para ejecutar la versión compilada localmente:

```bash
npm run start
```

## ☁️ Despliegue en AWS Amplify

La implementación académica se realizó con **AWS Amplify Hosting**, en la región **US East (Ohio), `us-east-2`**, utilizando la rama `main` de este repositorio.

### Configuración aplicada

| Parámetro | Valor |
| --- | --- |
| Repositorio | `hugo200021/secure-next-supabase-auth` |
| Rama | `main` |
| Framework detectado | Next.js |
| Comando de compilación | `npm run build` |
| Directorio de salida | `.next` |
| Imagen de compilación | Amazon Linux 2023 (predeterminada) |
| Dominio público | `https://main.d1ob5fawh4w10p.amplifyapp.com` |

### Variables configuradas en Amplify

Estas variables se gestionan desde **Amplify → Hospedaje → Variables de entorno**, no en archivos con valores reales dentro del repositorio:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REEMPLAZAR
NEXT_PUBLIC_SITE_URL=https://main.d1ob5fawh4w10p.amplifyapp.com
```

La URL de Supabase y la clave publicable deben corresponder al mismo proyecto. Cuando se modifica una variable de compilación, se realiza un nuevo despliegue para que el cambio quede aplicado.

En esta implementación se utilizó una configuración de build que agrega las variables públicas al archivo `.env.production` antes de ejecutar Next.js, de modo que estén disponibles en el entorno del servidor:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - env | grep -e NEXT_PUBLIC_ >> .env.production
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

> Este bloque documenta la configuración del despliegue. No implica que exista necesariamente un archivo `amplify.yml` en la raíz del repositorio: también puede configurarse desde la consola de Amplify.

### Flujo de despliegue

1. Conectar el repositorio público de GitHub con AWS Amplify.
2. Seleccionar la rama `main`.
3. Confirmar el comando `npm run build` y el directorio `.next`.
4. Agregar las tres variables de entorno.
5. Guardar y desplegar.
6. Verificar el estado **Implementación realizada / Deployed**.
7. Abrir la URL pública y comprobar la aplicación.

GitHub y Amplify quedan conectados para permitir nuevos despliegues cuando se actualice la rama configurada.

## 🔑 Configuración de autenticación en Supabase

En **Authentication → URL Configuration** se autorizan las siguientes direcciones de redirección:

```text
http://localhost:3000/**
https://secure-next-supabase-auth.vercel.app/**
https://main.d1ob5fawh4w10p.amplifyapp.com/**
```

La **Site URL** de Supabase puede funcionar como destino predeterminado cuando no se especifica otro. En esta configuración se conserva la URL de Vercel como valor predeterminado, mientras que el despliegue de AWS utiliza su propia variable `NEXT_PUBLIC_SITE_URL` y su URL autorizada en Supabase.

Para que los correos confirmen la sesión desde el servidor, las plantillas de **Authentication → Emails** deben utilizar la URL de redirección y el endpoint `/auth/confirm`.

**Confirmación de cuenta:**

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard">
  Confirmar correo
</a>
```

**Recuperación de contraseña:**

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/update-password">
  Restablecer contraseña
</a>
```

## 🛡️ Consideraciones de seguridad

- **Control de acceso:** las páginas privadas requieren una sesión válida; `proxy.ts` participa en la verificación y renovación de sesión.
- **Sesiones:** las cookies de autenticación se gestionan en el servidor y se configuran con restricciones de acceso desde JavaScript.
- **CSRF:** las Server Actions verifican el origen de las solicitudes como defensa adicional.
- **XSS:** React escapa valores renderizados y el proyecto configura encabezados de seguridad y CSP.
- **Base de datos:** Supabase emplea políticas **Row Level Security (RLS)** para restringir el acceso a los perfiles.
- **Credenciales:** las claves privilegiadas nunca deben almacenarse en el repositorio público ni exponerse al navegador.

Estas medidas forman parte del diseño del proyecto y no sustituyen una auditoría formal de seguridad.

## 🔎 SEO técnico

El proyecto incluye metadatos por página, URL canonical, Open Graph, Twitter cards, JSON-LD de tipo `WebApplication`, `robots.txt`, `sitemap.xml` y políticas `noindex` para rutas que no deben indexarse.

## ✅ Comprobaciones y evidencias de la actividad AWS

**Confirmado durante la práctica (1 de noviembre de 2026):**

- Repositorio público de GitHub conectado a AWS Amplify.
- Compilación y despliegue de la rama `main` exitosos (incluido un segundo despliegue).
- Página principal accesible públicamente por HTTPS en la URL de Amplify.
- Proyecto Supabase reactivado y en estado `Healthy`.
- URL de Amplify incluida entre los destinos de redirección permitidos.

**Pruebas funcionales recomendadas, no marcadas como completadas:** registro, confirmación por correo, inicio de sesión, acceso al dashboard, cierre de sesión y recuperación de contraseña.

**Evidencias solicitadas por la actividad:**

1. Captura del panel de AWS Amplify mostrando la compilación y el despliegue exitosos.
2. Captura de la aplicación funcionando en el navegador desde la URL pública de Amplify.

## 📌 Entrega académica

- **URL de la aplicación:** https://main.d1ob5fawh4w10p.amplifyapp.com
- **Repositorio público:** https://github.com/hugo200021/secure-next-supabase-auth
- **Evidencias:** las dos capturas de despliegue y visualización de la aplicación.

Este repositorio corresponde a una práctica académica de publicación de una aplicación Next.js en la nube. Su despliegue en Amplify no supone por sí solo una arquitectura de alta disponibilidad con RDS, ECS y balanceadores administrados manualmente.
