import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { saveChat } from "@/lib/save-chat";

import { z } from "zod";

const QuizOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text is required"),
});

const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question is required"),

  options: z.array(QuizOptionSchema).min(2, "At least 2 options required"),

  correctOptionId: z.string(),

  explanation: z.string().optional(),
}).refine(
  (data) => data.options.some((opt) => opt.id === data.correctOptionId),
  {
    message: "correctOptionId must match one of the options",
    path: ["correctOptionId"],
  }
);

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),

  questions: z.array(QuizQuestionSchema).min(1),
});

export const maxDuration = 300;

export async function POST(req: Request) {
    const { messages, id }: { messages: UIMessage[]; id: string } = await req.json();

    const result = streamText({
        model: "openai/gpt-4o",
        messages: await convertToModelMessages(messages),
        tools: {
            makeQuiz: tool({
                description: "Create an interactive quiz",
                inputSchema: QuizSchema,
                execute: async (quiz: z.infer<typeof QuizSchema>) => {
                    console.log(quiz);
                }
            })
        }
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: async ({ messages }) => {
            await saveChat(messages, id);
        }
    });
}