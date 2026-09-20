"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
  fields?: { email?: string };
};

const emailSchema = z.string().trim().email("Ingresa un correo válido.").max(254);
const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(72, "La contraseña es demasiado larga.")
  .regex(/[a-z]/, "Incluye al menos una letra minúscula.")
  .regex(/[A-Z]/, "Incluye al menos una letra mayúscula.")
  .regex(/[0-9]/, "Incluye al menos un número.");

const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

async function assertSameOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!origin || !host) return;

  try {
    if (new URL(origin).host !== host) {
      throw new Error("Invalid origin");
    }
  } catch {
    throw new Error("Solicitud rechazada por seguridad.");
  }
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function signInAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  await assertSameOrigin();

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      fields: { email: String(formData.get("email") ?? "") },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      error: "Correo o contraseña incorrectos, o la cuenta aún no está confirmada.",
      fields: { email: parsed.data.email },
    };
  }

  redirect("/dashboard");
}

export async function signUpAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  await assertSameOrigin();

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      fields: { email: String(formData.get("email") ?? "") },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: getSiteUrl(),
    },
  });

  if (error) {
    return {
      error: "No fue posible crear la cuenta. Revisa los datos e inténtalo de nuevo.",
      fields: { email: parsed.data.email },
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success: "Cuenta creada. Revisa tu correo para confirmar el registro.",
    fields: { email: parsed.data.email },
  };
}

export async function signOutAction() {
  await assertSameOrigin();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?message=Sesión cerrada correctamente.");
}

export async function forgotPasswordAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  await assertSameOrigin();

  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Correo inválido." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
  redirectTo: `${getSiteUrl()}/auth/confirm?next=/update-password`,
});

  // Avoid account enumeration: same response whether or not the email exists.
  return {
    success: "Si existe una cuenta con ese correo, recibirás instrucciones para recuperar el acceso.",
    fields: { email: parsed.data },
  };
}

export async function updatePasswordAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  await assertSameOrigin();

  const password = formData.get("password");
  const confirmation = formData.get("confirmation");
  const parsed = passwordSchema.safeParse(password);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Contraseña inválida." };
  }

  if (password !== confirmation) {
    return { error: "Las contraseñas no coinciden." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { error: "El enlace de recuperación no es válido o ya expiró." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) {
    return { error: "No fue posible actualizar la contraseña. Solicita un nuevo enlace." };
  }

  redirect("/dashboard?message=Contraseña actualizada correctamente.");
}
