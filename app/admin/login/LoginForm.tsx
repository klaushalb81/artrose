"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="form">
      <div className="form-field">
        <label htmlFor="password">Passord</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      {state?.error && <p className="admin-error">{state.error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-filled" disabled={pending}>
          {pending ? "Logger inn …" : "Logg inn"}
        </button>
      </div>
    </form>
  );
}
