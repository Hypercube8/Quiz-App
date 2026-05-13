import  prisma from "@/lib/prisma";

import { auth } from "@/lib/auth";

import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized"}, {status: 401});
    }

    const { chatSessionId } = await req.json();
    console.log(chatSessionId);

    try {
        const chatSession = await prisma.chatSession.findFirstOrThrow({
            where: { userId: session.user.id, id: chatSessionId },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        })

        const uiMessages = chatSession.messages.map((msg) => ({
            id: msg.id,
            role: msg.role.toLowerCase(),
            parts: JSON.parse(msg.content)
        }));

        return NextResponse.json({ messages: uiMessages });
    } catch (error) {
        console.error("Error fetching messages: ", error);
        return NextResponse.json({ messages: [] });
    }
}