"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { signOut } from "@/lib/auth-client";

import { useRouter } from "next/navigation";

import { LogOutIcon } from "lucide-react";

export default function SignOut() {
    const router = useRouter();

    return (
        <DropdownMenuItem onClick={async () => {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/signin");
                    }
                } 
            });
        }}>
            <LogOutIcon />
            Sign Out
        </DropdownMenuItem>
    )
}