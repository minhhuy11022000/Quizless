/** Shared shapes returned by Server Actions driven by `useActionState`. */

export type FormActionState = { status: "idle" } | { status: "error"; message: string };

export const idleFormState: FormActionState = { status: "idle" };

export type MagicLinkActionState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string };

export const idleMagicLinkState: MagicLinkActionState = { status: "idle" };
