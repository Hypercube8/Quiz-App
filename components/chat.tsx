"use client";

import React, { 
    ComponentType,
    Dispatch, 
    ReactNode, 
    SetStateAction, 
    useCallback, 
    useEffect, 
    useState 
} from "react";

import { 
    PromptInput, 
    PromptInputActionAddAttachments, 
    PromptInputActionAddScreenshot, 
    PromptInputActionMenu, 
    PromptInputActionMenuContent, 
    PromptInputActionMenuTrigger, 
    PromptInputFooter, 
    PromptInputHeader, 
    PromptInputMessage, 
    PromptInputSubmit, 
    PromptInputTextarea, 
    PromptInputTools, 
    usePromptInputAttachments 
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
    ContextTrigger 
} from "@/components/ai-elements/context";

import { 
    Conversation, 
    ConversationContent, 
    ConversationEmptyState, 
    ConversationScrollButton 
} from "@/components/ai-elements/conversation";

import { 
    Message, 
    MessageContent, 
    MessageResponse 
} from "@/components/ai-elements/message";

import { 
    Attachment, 
    AttachmentPreview, 
    AttachmentRemove, 
    Attachments 
} from "@/components/ai-elements/attachments";

import { Shimmer } from "@/components/ai-elements/shimmer";

import { 
    UIMessage, 
    useChat 
} from "@ai-sdk/react";
import { Confirmation, ConfirmationAccepted, ConfirmationAction, ConfirmationActions, ConfirmationRejected, ConfirmationRequest, ConfirmationTitle } from "./ai-elements/confirmation";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./ai-elements/tool";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses, ToolUIPart } from "ai";
import { ModelSelector, ModelSelectorTrigger } from "./ai-elements/model-selector";
import { Button } from "./ui/button";
import ModelChoice from "./model-choice";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "./ai-elements/reasoning";

export default function Chat({ id }: { id?: string }) {
    const [ input, setInput ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [model, setModel] = useState("openai/gpt-4o");

    const { 
        messages, 
        sendMessage, 
        setMessages, 
        status, 
        stop, 
        addToolApprovalResponse
    } = useChat({ 
        id, 
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    });

    const handleChoose = useCallback((modelId: string) => {
        setModel(modelId);
    }, []);

    const handleSubmit = useCallback((message: PromptInputMessage) => {
        if (status === "ready") {
            if (message.text.trim()) {
                sendMessage({ text: message.text, files: message.files }, {
                    body: {
                        model
                    }
                });
                setInput("");
            }
        } else {
            stop();
        }
    }, [model])

    const handleToolApproval = useCallback((tool: ToolUIPart, approved: boolean) => {
        addToolApprovalResponse({
            id: tool.approval!.id,
            approved,
            options: {
                body: {
                    model,
                    toolParams: "abc123"
                }
            }
        });
    }, [model])

    useEffect(() => {
        if (!id) { return; }

        setLoading(true);

        fetch("/api/messages", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatSessionId: id }) 
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                }
                setLoading(false);
            })
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 relative border h-screen">
            <div className="flex flex-col h-full">
                <TokenUsage />
                {
                    loading ? (
                        <div className="text-center h-full flex justify-center items-center">
                            <Shimmer className="text-3xl" duration={1}>Loading...</Shimmer>
                        </div>  
                    ) : (
                        <ChatBody 
                            messages={messages} 
                            onToolAccept={(tool) => handleToolApproval(tool, true)} 
                            onToolReject={(tool) => handleToolApproval(tool, false)} 
                        />
                    )
                }
                <ChatInput 
                    input={input} 
                    setInput={setInput} 
                    handleSubmit={handleSubmit} 
                    selectedModel={model}
                    onChoose={handleChoose}
                    status={status} 
                />
            </div>
        </div>
    )
}

function PromptInputAttachmentsDisplay() {
    const attachments = usePromptInputAttachments();

    if (attachments.files.length === 0) {
        return null;
    }

    return (
        <Attachments variant="inline">
            {
                attachments.files.map((attachment) => (
                    <Attachment
                        data={attachment}
                        key={attachment.id}
                        onRemove={() => attachments.remove(attachment.id)}
                    >
                        <AttachmentPreview />
                        <AttachmentRemove />
                    </Attachment>
                ))
            }
        </Attachments>
    );
}

function TokenUsage() {
    return (
        <Context  
            maxTokens={128_000}
            modelId="openai:gpt-4o"
            usage={{
                cachedInputTokens: 0,
                inputTokens: 32_000,
                outputTokens: 8000,
                reasoningTokens: 0,
                totalTokens: 40_0000,
                inputTokenDetails: {
                    noCacheTokens: 0,
                    cacheReadTokens: 0,
                    cacheWriteTokens: 0
                },
                outputTokenDetails: {
                    textTokens: 0,
                    reasoningTokens: 0
                }
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
    )
}

function ChatBody({ 
    messages, 
    onToolAccept, 
    onToolReject 
}: { 
    messages: UIMessage[],
    onToolAccept: (tool: ToolUIPart) => void;
    onToolReject: (tool: ToolUIPart) => void;
}) {
    return (
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
                                        case "reasoning": {
                                            return (
                                                <Reasoning isStreaming={part.state === "streaming"}>
                                                    <ReasoningTrigger />
                                                    <ReasoningContent>
                                                        {part.text}
                                                    </ReasoningContent>
                                                </Reasoning>
                                            )
                                        }
                                        case "tool-rename":
                                            return (
                                                <ToolApproval 
                                                    tool={part} 
                                                    onAccept={onToolAccept}
                                                    onReject={onToolReject}  
                                                />
                                            )
                                        case "tool-quiz":
                                            return (
                                                <ToolApproval 
                                                    tool={part}
                                                    onAccept={onToolAccept}
                                                    onReject={onToolReject}
                                                />
                                            )
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
    )
}

function ChatInput(
    { 
        input, 
        setInput, 
        handleSubmit,
        selectedModel,
        onChoose,
        status
    }: { 
        input: string, 
        setInput: Dispatch<SetStateAction<string>>, 
        handleSubmit: (message: PromptInputMessage) => void,
        selectedModel: string,
        onChoose: (modelId: string) => void
        status: string 
    }) {
    return (
        <PromptInput
            onSubmit={handleSubmit}
            className="mt-4 w-full max-w-2xl mx-auto relative"
        >
            <PromptInputHeader>
                <PromptInputAttachmentsDisplay />
            </PromptInputHeader>
            <PromptInputTextarea 
                value={input}
                placeholder="Say something..."
                onChange={(e) => setInput(e.currentTarget.value)}
                className="pr-12"               
            />
            <PromptInputSubmit 
                status={status === "streaming" ? "streaming" : "ready"}
                disabled={!input.trim() && status === "ready"}
                className="absolute bottom-1 right-1"
            />
            <PromptInputFooter>
                <PromptInputTools>
                    <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                            <PromptInputActionAddAttachments />
                            <PromptInputActionAddScreenshot />
                        </PromptInputActionMenuContent>
                    </PromptInputActionMenu>
                    <ModelChoice selected={selectedModel} onChoose={onChoose} />
                </PromptInputTools>
            </PromptInputFooter>
        </PromptInput>
    )
}

function ToolApproval({ 
    tool, 
    onAccept, 
    onReject,
    InputElement,
    OutputElement,
}: { 
    tool: ToolUIPart, 
    onAccept: (tool: ToolUIPart) => void,
    onReject: (tool: ToolUIPart) => void,
    InputElement?: ComponentType<{ input: string }>,
    OutputElement?: ComponentType<{ output: string }>
}) {
    return (
        <Tool defaultOpen>
            <ToolHeader
                type={tool.type}
                state={tool.state}
            />
            <ToolContent>
                <ToolInput input={tool.input ?? ""}/>
                <Confirmation approval={tool.approval} state={tool.state}>
                    <ConfirmationTitle>
                        <ConfirmationRequest>

                        </ConfirmationRequest>
                        <ConfirmationAccepted>

                        </ConfirmationAccepted>
                        <ConfirmationRejected>

                        </ConfirmationRejected>
                        <ConfirmationActions>
                            <ConfirmationAction variant="outline" onClick={() => onReject(tool)}>
                                Reject
                            </ConfirmationAction>
                            <ConfirmationAction onClick={() => onAccept(tool)}>
                                Accept
                            </ConfirmationAction>
                        </ConfirmationActions>
                    </ConfirmationTitle>
                </Confirmation>
                <ToolOutput 
                    output={OutputElement ? (
                        <OutputElement output={tool.output as string} />
                    ) : (
                        <MessageResponse>
                            {tool.output as string}
                        </MessageResponse>
                    )} 
                    errorText={tool.errorText}
                />
            </ToolContent>
        </Tool>
    )
}