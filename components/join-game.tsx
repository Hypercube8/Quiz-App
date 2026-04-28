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
import { socket } from "../src/socket";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSocket from "@/hooks/use-socket";
import { useRouter } from "next/navigation";

export default function JoinGame() {
    const { connectWithAuth, connected, error } = useSocket()!;
    const router = useRouter();

    const [otpValue, setOTPValue] = useState("");
    const [invalid, setInvalid] = useState(false);

    function changeOTPValue(value: string) {
        setOTPValue(value.toUpperCase());
        setInvalid(false);
    }

    function join() {
        connectWithAuth({
            roomCode: otpValue,
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
                <Button size="icon-lg" className="rounded-full p-8" onClick={join} asChild>
                    <MoveRight className="size-12" />
                </Button>
            </div>
        </div>
    );
}