import ChatSidebar from "@/components/chat-sidebar";

export default function ChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ChatSidebar>
            <main className="w-full">
                {children} 
            </main>
        </ChatSidebar>
    )
}