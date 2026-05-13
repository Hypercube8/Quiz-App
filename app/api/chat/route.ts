import { saveChat } from "@/lib/save-chat";
import { updateTokenUsage } from "@/lib/token-usage";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { 
  streamText, 
  UIMessage, 
  convertToModelMessages, 
  smoothStream,
  stepCountIs,
} from "ai";

import { renameTool } from "@/lib/tools/rename";
import { languageModelsIds } from "@/lib/models";
import { quizTool } from "@/lib/tools/quiz";

export const maxDuration = 300;

export async function POST(req: Request) {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) 

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // if (session.user.tokensUsed >= session.user.tokensAvailable) {
    //   return NextResponse.json({ error: "Not enough tokens" }, {status: 402});
    // }

    const { messages, id, model, toolParams }: { messages: UIMessage[]; id: string; model: string, toolParams: any } = await req.json();

    if (!languageModelsIds.includes(model)) {
      return NextResponse.json({ error: "Invalid model" }, {status: 400});
    }

    const result = streamText({
        model,
        messages: await convertToModelMessages(messages),
        experimental_context: {
          id,
          toolParams
        },
        // providerOptions: {
        //   openai: {
        //     reasoningEffort: "high",
        //     reasoningSummary: "detailed"
        //   }
        // },
        experimental_transform: smoothStream({
          delayInMs: 20,
          chunking: "word"
        }),
        tools: {
          rename: renameTool,
          quiz: quizTool
        },
        stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        sendReasoning: true,
        onFinish: async ({ messages }) => {
            await saveChat(messages, id, session.user);
        }
    });
}