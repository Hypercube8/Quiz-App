"use client"

import { 
    InputOTP, 
    InputOTPGroup, 
    InputOTPSeparator, 
    InputOTPSlot 
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSocket from "@/hooks/use-socket";
import { useRouter } from "next/navigation";
import StateMachine from "./state-machine";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/hooks/stores/game-store";

export default function JoinGame() {
    const { connect, connected, error } = useSocket()!;
    const router = useRouter();

    const [otpValue, setOTPValue] = useState("");
    const [nameValue, setNameValue] = useState("");

    const [invalid, setInvalid] = useState(false);

    const setUser = useGameStore((s) => s.setUser);

    function changeOTPValue(value: string) {
        setOTPValue(value.toUpperCase());
        setInvalid(false);
    }

    function join() {
        setUser({
            name: nameValue,
            email: "rando"
        });

        connect({
            roomCode: otpValue,
            username: nameValue
        });
    }

    useEffect(() => {
        if (error) {
            setInvalid(true);
            toast.error("Invalid room code", {
                position: "top-center"
            });   
        } else if (connected) {
            router.replace("/play");
        }
    }, [error, connected])

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <h1 className="text-5xl p-8">Enter a code to join:</h1>
            <div className="flex gap-4">
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otpValue} onChange={(value) => changeOTPValue(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot className="p-8 text-3xl" index={0} aria-invalid={invalid} />
                        <InputOTPSlot className="p-8 text-3xl" index={1} aria-invalid={invalid} />
                        <InputOTPSlot className="p-8 text-3xl" index={2} aria-invalid={invalid} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot className="p-8 text-3xl" index={3} aria-invalid={invalid} />
                        <InputOTPSlot className="p-8 text-3xl" index={4} aria-invalid={invalid} />
                        <InputOTPSlot className="p-8 text-3xl" index={5} aria-invalid={invalid} />
                    </InputOTPGroup>
                </InputOTP>
                <Input placeholder="Enter your username" type="text" value={nameValue} onChange={(event) => setNameValue(event.target.value)} />
                <Button size="icon-lg" className="rounded-full p-8" onClick={join} asChild>
                    <MoveRight className="size-12" />
                </Button>
            </div>
        </div>
    );
}