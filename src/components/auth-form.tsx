"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";

type AuthAction = (state: AuthState, formData: FormData) => Promise<AuthState>;

type AuthFormProps = {
  action: AuthAction;
  submitLabel: string;
  pendingLabel: string;
  password?: boolean;
  confirmPassword?: boolean;
};

const initialState: AuthState = {};

export function AuthForm({
  action,
  submitLabel,
  pendingLabel,
  password = true,
  confirmPassword = false,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="auth-form">
      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        defaultValue={state.fields?.email}
      />

      {password && (
        <>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={confirmPassword ? "new-password" : "current-password"}
            minLength={8}
            maxLength={72}
            required
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,72}"
            title="Mínimo 8 caracteres, con mayúscula, minúscula y número."
          />
        </>
      )}

      {confirmPassword && (
        <>
          <label htmlFor="confirmation">Confirmar contraseña</label>
          <input
            id="confirmation"
            name="confirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />
        </>
      )}

      {state.error && <p className="message error" role="alert">{state.error}</p>}
      {state.success && <p className="message success" role="status">{state.success}</p>}

      <SubmitButton pendingText={pendingLabel}>{submitLabel}</SubmitButton>
    </form>
  );
}
