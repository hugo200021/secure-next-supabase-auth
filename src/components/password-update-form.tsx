"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";

const initialState: AuthState = {};

export function PasswordUpdateForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={formAction} className="auth-form">
      <label htmlFor="password">Nueva contraseña</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        required
        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,72}"
        title="Mínimo 8 caracteres, con mayúscula, minúscula y número."
      />

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

      {state.error && <p className="message error" role="alert">{state.error}</p>}
      <SubmitButton pendingText="Actualizando...">Actualizar contraseña</SubmitButton>
    </form>
  );
}
