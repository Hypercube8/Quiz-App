"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm, Form } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/lib/actions/sign-in";
import { LoginInfo, loginSchema } from "@/lib/login";
import { SignInProvider } from "@/components/auth-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const form = useForm<LoginInfo>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: LoginInfo) {
        await signInAction(data);
    }

    return (
        <div className="w-full h-full min-h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link href="/signup" prefetch="auto">Create account</Link>
                        </Button>
                    </CardAction>
                </CardHeader><form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <FieldSet>
                            <FieldGroup>
                                <Controller name="email" control={form.control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input {...field} aria-invalid={fieldState.invalid} type="text" autoComplete="off" name="email" id="email" placeholder="Enter an email" />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                                <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input {...field} aria-invalid={fieldState.invalid} type="password" autoComplete="off" name="password" id="password" placeholder="Enter a password" />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />
                            </FieldGroup>
                        </FieldSet>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full">Sign In</Button>
                        <SignInProvider provider="github">Sign in with Github</SignInProvider>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}