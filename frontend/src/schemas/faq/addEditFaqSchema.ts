import { z } from "zod";

// Interface for React Hook Form
export interface AddFaqProps {
  question: string;
  answer: string;
}

// Zod schema for validation
export const addFaqSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question cannot exceed 200 characters"),
  answer: z
    .string()
    .min(5, "Answer must be at least 5 characters")
    .max(1000, "Answer cannot exceed 1000 characters"),
});
