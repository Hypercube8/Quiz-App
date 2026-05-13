"use client";

import { 
    SidebarMenu, 
    SidebarMenuAction, 
    SidebarMenuButton, 
    SidebarMenuItem 
} from "@/components/ui/sidebar";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

import { Ellipsis, Pen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { deleteChatSession, renameChatSession } from "@/lib/actions/chat-session";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";

type ChatSession = {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }

export default function ChatSessions() {
    const [ chatSessions, setChatSessions ] = useState<ChatSession[]>([]);
    const router = useRouter();

    const handleRemove = (removeId: string) => {
        setChatSessions((chatSessions) => chatSessions.filter((session) => session.id !== removeId));
        router.replace("/chat");
    }

    useEffect(() => {
        fetch("/api/chat-sessions/", { method: "POST" })
            .then((res) => res.json())
            .then(data => {
                setChatSessions(data.chatSessions)
            }); 
    }, [])

    return (
        <SidebarMenu>
            {
                chatSessions.map((chatSession) => {
                    return (
                        <ChatSession 
                            key={chatSession.id} 
                            id={chatSession.id} 
                            name={chatSession.name} 
                            handleRemove={handleRemove}
                        />
                    )
                })
            }
        </SidebarMenu>
    );
}

function ChatSession({ id, name, handleRemove }: { id: string, name: string | null, handleRemove: (removeId: string) => void }) {
    const [ renaming, setRenaming ] = useState(false);
    const [ input, setInput ] = useState(name ?? "");

    const handleRename = async () => {
        setRenaming(false);
        await renameChatSession({
            chatSessionId: id,
            name: input
        })
    }

    const handleDelete = async () => {
        await deleteChatSession({
            chatSessionId: id
        })
        handleRemove(id);
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                {
                    renaming ? (
                        <Input value={input} maxLength={29} onChange={(e) => setInput(e.target.value)} onBlur={handleRename} />
                    ): (
                        <Link href={`/chat/${id}`} prefetch="auto">{input}</Link>
                    )
                }
            </SidebarMenuButton>
            {
                !renaming && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuAction><Ellipsis /></SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setRenaming(true)}>
                                    <Pen />Rename
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Popover>
                                    <PopoverTrigger>
                                        <DropdownMenuItem onClick={handleDelete} variant="destructive">
                                            <Trash2 />Delete
                                        </DropdownMenuItem>
                                    </PopoverTrigger>
                                </Popover>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        </SidebarMenuItem>
    )
}