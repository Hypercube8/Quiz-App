import * as z from "zod";

export const signUpSchema = z.object({
    email: z
        .string()
        .email("Not a valid email"),
    name: z
        .string()
        .min(3, "Username must be atleast 3 characters")
        .max(20, "Username can be no more than 20 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
})

export type SignUpInfo = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
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

export type SignInInfo = z.infer<typeof signInSchema>;