"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export default async function signUpAction({ email, password } : { email: string, password: string }) {
    const existing = await prisma.user.findUnique({
        where: { email }
    })

    if (!existing) {
        await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10) 
            }
        })
        redirect("/signin");
    }

    return { error: "An account with that email already exists." } 
}