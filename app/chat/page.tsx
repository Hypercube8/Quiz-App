"use client";

import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
    Message,
    MessageContent,
    MessageResponse
} from "@/components/ai-elements/message";

import {
    PromptInput,
    type PromptInputMessage,
    PromptInputTextarea,
    PromptInputSubmit
} from "@/components/ai-elements/prompt-input";

import {
    Context,
    ContextCacheUsage,
    ContextContent,
    ContextContentBody,
    ContextContentFooter,
    ContextContentHeader,
    ContextInputUsage,
    ContextOutputUsage,
    ContextReasoningUsage,
    ContextTrigger,
} from "@/components/ai-elements/context";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function Page() {
    const [ input, setInput ] = useState("");
    const { messages, sendMessage, status } = useChat();

    const handleSubmit = (message: PromptInputMessage) => {
        if (message.text.trim()) {
            sendMessage({ text: message.text });
            setInput("");
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-screen">
            <div className="flex flex-col h-full">
                <Context  
                    maxTokens={128_000}
                    modelId="openai:gpt-4o"
                    usage={{
                        cachedInputTokens: 0,
                        inputTokens: 32_000,
                        outputTokens: 8000,
                        reasoningTokens: 0,
                        totalTokens: 40_0000
                    }}
                    usedTokens={40_000}
                >
                    <ContextTrigger />
                    <ContextContent>
                        <ContextContentHeader />
                        <ContextContentBody>
                            <ContextInputUsage />
                            <ContextOutputUsage />
                            <ContextReasoningUsage />
                            <ContextCacheUsage />
                        </ContextContentBody>
                        <ContextContentFooter />
                    </ContextContent>
                </Context>
                <Conversation>
                    <ConversationContent>
                        {messages.length === 0 ? (
                            <ConversationEmptyState title="Start a conversation" description="Type a message below to begin chatting" />
                        ) : (
                            messages.map((message) => (
                                <Message from={message.role} key={message.id}>
                                    <MessageContent>
                                        {message.parts.map((part, i) => {
                                            switch (part.type) {
                                                case "text":
                                                    return (
                                                        <MessageResponse key={`${message.id}-${i}`}>
                                                            {part.text}
                                                        </MessageResponse>
                                                    );
                                                default: 
                                                    return null;
                                            }
                                        })}
                                    </MessageContent>
                                </Message>
                            ))
                        )}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
                 <PromptInput
                    onSubmit={handleSubmit}
                    className="mt-4 w-full max-w-2xl mx-auto relative"
                >
                    <PromptInputTextarea 
                        value={input}
                        placeholder="Say something..."
                        onChange={(e) => setInput(e.currentTarget.value)}
                        className="pr-12"               
                    />
                    <PromptInputSubmit 
                        status={status === "streaming" ? "streaming" : "ready"}
                        disabled={!input.trim()}
                        className="absolute bottom-1 right-1"
                    />
                </PromptInput>
            </div>
        </div>
    )
}