import { Button } from "@/components/ui/button";
import React from "react";
import { signInProviderAction } from "@/lib/actions/sign-in";
import { SignOutAction } from "@/lib/actions/sign-out";

export function SignInProvider({ provider, children }: React.PropsWithChildren<{ provider?: string }> ) {
    return (
        <Button variant="outline" className="w-full" onClick={async () => signInProviderAction(provider)}>
            {children}
        </Button>
    )
}

export function SignOut({ children }: React.PropsWithChildren) {
    return (
        <Button type="button" variant="outline" className="w-full"onClick={async () => SignOutAction()}>
            {children}
        </Button>
    );
}