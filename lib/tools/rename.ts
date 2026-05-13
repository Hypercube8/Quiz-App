import { tool } from "ai";
import renameChat from "../rename-chat";
import z from "zod";

export const renameTool = tool({
    description: "Rename the current conversation to something more fitting",
    inputSchema: z.object({
        name: z.string().max(29, "Conversation name cannot be longer than 29 characters")
    }),
    needsApproval: true,
    execute: async ({ name }, { experimental_context: context }) => {
        const { id } = context as { id: string }
        await renameChat(id, name);
        return name;
    },          
})