import { signIn, signOut } from "@/lib/auth";

export function SignIn({ provider }: { provider?: string}) {
    return (
        <form
            action={async () => {
                "use server";
                await signIn(provider);
            }}
        >
            {" "}
            <button className="bg-neutral-700 text-white p-2 rounded-md">
                {" "}
                // [!code ++] Sign In with {provider}
            </button>{" "}
        </form>
    )
}

export function SignOut({ provider }: { provider?: string} ) {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            {" "}
            <button className="bg-neutral-700 text-white p-2 rounded-md">
                {" "}
                // [!code ++] Sign Out
            </button>{" "}
        </form>
    )
}