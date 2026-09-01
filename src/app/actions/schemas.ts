import * as z from "zod";

/** Empty string and whitespace-only both mean "no example" for a card. */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable();

export const SetFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required." })
    .max(200, { error: "Title must be 200 characters or fewer." }),
  description: optionalText,
});

export const CardFormSchema = z.object({
  term: z
    .string()
    .trim()
    .min(1, { error: "Term is required." })
    .max(200, { error: "Term must be 200 characters or fewer." }),
  definition: z
    .string()
    .trim()
    .min(1, { error: "Definition is required." })
    .max(1000, { error: "Definition must be 1000 characters or fewer." }),
  example: optionalText,
});

export const EmailSchema = z.email({ error: "Enter a valid email address." });
