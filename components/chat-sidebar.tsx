import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarGroup, 
    SidebarGroupAction, 
    SidebarGroupLabel, 
    SidebarHeader, 
    SidebarProvider, 
    SidebarRail 
} from "@/components/ui/sidebar";

import Profile from "@/components/profile";
import ChatSessions from "@/components/chat-sessions";

import { Link, Plus } from "lucide-react";

export default function ChatSidebar({ children }: React.PropsWithChildren) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <Profile />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Sessions</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus />
                        </SidebarGroupAction>
                        <ChatSessions />
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter></SidebarFooter>
                <SidebarRail></SidebarRail>
            </Sidebar>
            {children}
        </SidebarProvider>
    )
}