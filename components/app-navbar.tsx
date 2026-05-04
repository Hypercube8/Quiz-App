import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    NavigationMenuIndicator
} from "@/components/ui/navigation-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Gamepad2, Plus, Search } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";
import Link from "next/link";

export default function AppNavbar() {
    return (
        <div className="flex p-2 mb-4 w-full bg-sidebar border-b-2 border-b-sidebar-border justify-between">
            <NavigationMenu>
                <NavigationMenuList className="gap-3">
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-sm" asChild>
                            <Link href="/">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm">About</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuIndicator />
            </NavigationMenu>
            <NavigationMenu>
                <NavigationMenuList className="gap-3">
                    <NavigationMenuItem>
                        <ButtonGroup>
                            <Input size={40} placeholder="Type to search..." className="text-sm"></Input>
                            <Button variant="outline"><Search /></Button>
                        </ButtonGroup>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button variant="outline" size="sm" className="text-sm" asChild>
                            <Link href="/join"><Gamepad2 />Join</Link>
                        </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button size="sm" className="text-sm mr-1" asChild>
                            <Link href="/"><Plus />Create</Link>
                        </Button>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}