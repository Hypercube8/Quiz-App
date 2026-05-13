"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import prisma from "../prisma";

export async function renameChatSession({ chatSessionId, name }: { chatSessionId: string, name: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    }) 
    
    if (!session) {
        throw new Error("unauthorized");
    }

    await prisma.chatSession.update({
        where: { id: chatSessionId, userId: session.user.id },
        data: { name }
    });
}

export async function deleteChatSession({ chatSessionId }: { chatSessionId: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    }) 
    
    if (!session) {
        throw new Error("unauthorized");
    }

    await prisma.chatSession.delete({
        where: { id: chatSessionId, userId: session.user.id }
    })
}