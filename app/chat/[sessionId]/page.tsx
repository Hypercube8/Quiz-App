"use client";

import Chat from "@/components/chat";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ sessionId: string}> }) {
    const { sessionId } = use(params);

    return (
        <Chat id={sessionId} />
    )
}