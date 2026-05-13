import prisma from "./prisma";

export async function updateTokenUsage(id: string, tokensAdded: number) {
    await prisma.user.update({
        where: { id },
        data: { tokensUsed: { increment: tokensAdded } }
    })
}