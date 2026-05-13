import { tool } from "ai";
import z from "zod";

export const quizTool = tool({
    description: "Create an interactive quiz.",
    inputSchema: z.object({
        name: z.string()
                .max(29, "Quiz name cannot be longer than 29 characters."),
        numQuestions: z.number()
                        .int()
                        .min(1, "There must be atleast one question."),
        difficulty: z.number()
                        .min(1, "Difficulty must be atleast 1")
                        .max(10, "Difficulty cannot be greater than 10")
    }),
    needsApproval: true,
    execute: async ({ name, numQuestions, difficulty }) => {
        console.log(name, numQuestions, difficulty);
        return `Quiz ${name} \n
                Number of Questions ${numQuestions}\n
                Difficulty: ${difficulty}`;
    }
})