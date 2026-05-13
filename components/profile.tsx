import { 
    Item, 
    ItemContent, 
    ItemDescription,
    ItemMedia, 
    ItemTitle 
} from "@/components/ui/item";

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import SignOut from "@/components/sign-out";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";

import { BadgeCheckIcon, LogOutIcon } from "lucide-react";

export default async function Profile() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return;
    }

    return (
        <Item>
            <ItemMedia>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="size-10">
                            <AvatarImage src={session.user.image?.toString()} />
                            <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem><BadgeCheckIcon />Account</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <SignOut />
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{session.user.name}</ItemTitle>
                <ItemDescription>{session.user.email}</ItemDescription>
            </ItemContent>
        </Item>
    )
} 