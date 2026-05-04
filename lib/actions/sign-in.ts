"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signInAction(data: any) {
    const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
    });
}

export async function signInProviderAction(provider?: string) {
    await signIn(provider, {
        redirectTo: "/join"
    });
}