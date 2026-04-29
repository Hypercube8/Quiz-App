import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Player from "@/common/player";

interface JoinBoardProps {
    host?: boolean;
    user: Player;
    players: Player[];
}

export default function JoinBoard({host, user, players}: JoinBoardProps) {
    return (
        <div className="flex flex-col min-h-screen items-center gap-6" >
            { host ? (
                    <h1></h1>
                ) : (
                    <div className="max-w-lg flex-col gap-6">
                        <Item>
                            <ItemHeader>
                                <ItemTitle className="text-7xl">{user.name}</ItemTitle>
                            </ItemHeader>
                            <ItemMedia>
                                <Avatar className="h-48 w-48">
                                    <AvatarImage src={user.avatar} alt="@shadcn" />
                                    <AvatarFallback className="text-3xl">{user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                                </Avatar>
                            </ItemMedia>
                        </Item>
                    </div>
                )
            }
            <ItemGroup className="grid grid-cols-3 md:grid-cols-4">
                {players.map((player, id) => ( 
                    <Item key={id} variant="outline">
                        <ItemMedia>
                            <Avatar>
                                <AvatarImage src={player.avatar} alt="@shadcn" />
                                <AvatarFallback>{player.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
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