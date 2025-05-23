import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email."),
  password: z
    .string()
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const registerSchema = z.object({
  username: z.string().min(4).max(20),
  email: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});
