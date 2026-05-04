import * as z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Not a valid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
})

export type LoginInfo = z.infer<typeof loginSchema>;