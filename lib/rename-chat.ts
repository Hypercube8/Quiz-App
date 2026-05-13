import prisma from "./prisma";

export default async function renameChat(sessionId: string, name: string) {
    await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
            name
        }
    })
}