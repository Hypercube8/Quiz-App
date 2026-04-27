"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Progress } from "./ui/progress";

import { Square, Triangle, Circle, X, MoveRight } from "lucide-react"
import { Spinner } from "./ui/spinner";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from "./ui/item";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Input } from "./ui/input";

import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { StringToBoolean } from "class-variance-authority/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const buttonVariants = cva(`
            transition-all duration-100 ease-out
            hover:brightness-90 active:brightness-90
            hover:scale-102 active:scale-95
            active:translate-y-0.5
            shadow-lg active:shadow-sm
            select-none 
            w-full h-full
            break-words
            whitespace-normal
            text-primary-foreground
            relative
            rounded-4xl`, {
                variants: {
                    color: {
                        red: "bg-red-600",
                        blue: "bg-blue-600",
                        green: "bg-green-600",
                        yellow: "bg-yellow-600"
                    }
                }
            });

interface QuizButtonProps {
    icon: "square" | "triangle" | "circle" | "cross";
}

export function QuizButton({ children, color, onClick, disabled, icon, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & QuizButtonProps) {
    const iconClass = "size-15 md:size-30 absolute left-4";
    let buttonIcon: React.ReactNode;
    switch (icon) {
        case "circle": buttonIcon = <Circle className={iconClass} />; break;
        case "triangle": buttonIcon = <Triangle className={iconClass} />; break;
        case "square": buttonIcon = <Square className={iconClass} />; break;
        case "cross": buttonIcon =  <X className={iconClass} />; break;
    }

    return (
        <Button onClick={onClick} disabled={disabled} className={buttonVariants({ color })}>
            {buttonIcon}
            {children}
        </Button>
    );
}

interface Answer {
    text: string;
    correct: boolean;
}

interface Question {
    text: string;
    time?: number;
    imagePath?: string;
    answers: Answer[];
}

interface QuestionProps {
    text: string;
    time?: number;
    imagePath?: string;
    answers: Answer[];
    onAnswer: (id?: number) => void;
};

export function Question({ text, time=10000, imagePath, answers, onAnswer }: QuestionProps) {
    const [timeLeft, setTimeLeft] = React.useState(100);
    const timeStep = 10000 / time;

    React.useEffect(() => {
        const interval = setInterval(() => setTimeLeft((prev) => {
            if (prev <= 0) {
                clearInterval(interval);
                onAnswer();
                return 0;
            }
            return prev - timeStep;
        }), 100);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="w-full h-full min-h-screen bg-radial from-gray-700 to-gray-900">
            <div className="absolute top-0 flex flex-col w-full h-1/2 items-center justify-center">
                <Progress className="bg-red-500" value={timeLeft} />
                <h1 className="text-[clamp(1.0rem,2.5vw,3.5rem)] m-4 text-primary-foreground">{text}</h1>
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                    <img className="max-w-full max-h-full object-contain rounded-4xl" src={imagePath} />
                </div>
            </div>
            <div className="absolute bottom-0 grid grid-cols-1 md:grid-cols-2 w-full h-1/2 overflow-hidden">
                <QuizButton onClick={() => onAnswer(0)} color="red" icon="circle">{answers[0].text}</QuizButton>
                <QuizButton onClick={() => onAnswer(1)} color="blue" icon="square">{answers[1].text}</QuizButton>
                <QuizButton onClick={() => onAnswer(2)} color="green" icon="triangle">{answers[2].text}</QuizButton>
                <QuizButton onClick={() => onAnswer(3)} color="yellow" icon="cross">{answers[3].text}</QuizButton>
            </div>
        </div>
    )
}

interface QuestionTransitionProps {
    state: "Waiting" | "Correct" | "Incorrect"
}

export function QuestionTransition({state}: QuestionTransitionProps) {
    if (state === "Waiting") {
        return (
            <div className="w-full h-full min-h-screen m-h-screen flex items-center justify-center gap-4 bg-radial from-gray-700 to-gray-900">
                <Spinner className="size-20"/><h1 className="text-7xl">Waiting . . . </h1>
            </div>
        );
    } else if (state === "Correct") {
        return (
            <div className="w-full h-full min-h-screen m-h-screen flex items-center justify-center gap-4 bg-radial from-green-700 to-green-900">
                <h1 className="text-7xl">Correct!</h1>
            </div>
        );
    } else {
        return (
            <div className="w-full h-full min-h-screen m-h-screen flex items-center justify-center gap-4 bg-radial from-red-700 to-red-900">
                <h1 className="text-7xl">Incorrect</h1>
            </div>
        );
    }
}

interface QuizProps {
    questions: Question[];
}

export default function Quiz({questions}: QuizProps) {
    const [questionNum, setQuestionNum] = React.useState(0);
    const [quizState, setQuizState] = React.useState("questioning");

    function onAnswer(id?: number) {
        setQuizState("Waiting");
        setTimeout(() => {
            if (id !== undefined && questions[questionNum].answers[id].correct) {
                setQuizState("Correct");
            } else {
                setQuizState("Incorrect");
            }
            setTimeout(() => {
                setQuizState("questioning");
                setQuestionNum((num) => num + 1);
            }, 3000);
        }, 3000);
    }

    if (quizState === "questioning") {
        return (
            <Question text={questions[questionNum].text} answers={questions[questionNum].answers} onAnswer={onAnswer}/>
        );
    } else {
        return (
            <QuestionTransition state={quizState as "Correct" | "Incorrect" | "Waiting"} />
        );
    }
}

interface Leader {
    name: string;
    score: number;
}

interface QuizLeaderboardProps {
    leaders: Leader[];
}
export function QuizLeaderboard({leaders}: QuizLeaderboardProps) {
    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
            {leaders.map((leader) => <Item variant="outline" className="text-2xl w-1/4 bg-background">
                <ItemContent>
                    <ItemHeader>{leader.name}</ItemHeader>
                    <ItemDescription>Score: {leader.score}</ItemDescription>
                </ItemContent>
            </Item>)}
        </div>
    );
}

export function JoinGame() {
    const [otpValue, setOTPValue] = React.useState("");

    function changeOTPValue(value: string) {
        setOTPValue(value.toUpperCase());
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <h1 className="text-5xl p-8">Enter a code to join:</h1>
            <div className="flex gap-4">
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otpValue} onChange={(value) => changeOTPValue(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot className="p-8 text-3xl" index={0} />
                        <InputOTPSlot className="p-8 text-3xl" index={1} />
                        <InputOTPSlot className="p-8 text-3xl" index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot className="p-8 text-3xl" index={3} />
                        <InputOTPSlot className="p-8 text-3xl" index={4} />
                        <InputOTPSlot className="p-8 text-3xl" index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <Button size="icon-lg" className="rounded-full p-8" asChild>
                    <Link href={`/play?game=${otpValue}`}><MoveRight className="size-12" /></Link>
                </Button>
            </div>
        </div>
    ); 
}

interface Player {
    name: string;
    email: string;
    avatar?: string;
}

interface JoinBoardProps {
    host?: boolean;
    players: Player[];
}

export function JoinBoard({host, players}: JoinBoardProps) {
    return (
        <div className="flex flex-col min-h-screen">
            { host ? (
                    <h1></h1>
                ) : (
                    <Item>
                        <ItemMedia>
                            
                        </ItemMedia>
                    </Item>
                )
            }
            <ItemGroup className="grid grid-cols-3 md:grid-cols-4 absolute top-1/2">
                {players.map((player, id) => ( 
                    <Item key={id} variant="outline">
                        <ItemMedia>
                            <Avatar>
                                <AvatarImage src={player.avatar} alt="@shadcn" />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>{player.name}</ItemTitle>
                            <ItemDescription>{player.email}</ItemDescription>
                        </ItemContent>
                        { host ? (
                                <ItemActions>
                                    <Button variant="ghost" size="icon" className="rounded-full"><X /></Button>
                                </ItemActions>
                            ) : (
                                <div></div>
                            )
                        }
                    </Item>
                ))}
            </ItemGroup>
        </div>
    );
}

interface QuizGameState {
    player: Player;
    players: Player[];
}


export function QuizGame() {
    const [gameState, setGameState] = React.useState<Partial<QuizGameState>>({});
    const socket = React.useRef<Socket | null>(null);

    React.useEffect(() => {
        socket.current = io("ws://localhost:3001");

        socket.current.on("game:init", (players: Player[]) => {
            setGameState(state => {
                return {
                    ...state,
                    players
                }
            });
        })  
    }, []);

    return (
        <JoinBoard players={gameState.players ?? []} />
    );
}
