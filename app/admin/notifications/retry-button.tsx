"use client";
import { useActionState } from "react";
import { retryNotification, type RetryState } from "./actions";

export function RetryButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState<RetryState, FormData>(retryNotification, {});
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        disabled={pending}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      >
        {pending ? "Wird gesendet…" : "Erneut senden"}
      </button>
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="mt-2 text-sm text-slate-600">
          Versand geprüft. Siehe Status.
        </p>
      )}
    </form>
  );
}
