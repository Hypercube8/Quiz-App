"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema, SignInInfo } from "@/lib/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function Page() {
    const router = useRouter();
    const form = useForm<SignInInfo>({
        resolver: zodResolver(signInSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: SignInInfo) {
        const res = await signIn.email({
            email: data.email,
            password: data.password
        });

        if (res.error) {
            form.setError("form", { message: res.error.message });
        } else {
            router.push("/join");
        }
    }

    return (
        <div className="w-full h-full min-h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        {form.formState.errors.form && (<FieldError>{form.formState.errors.form.message}</FieldError>)}
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link href="/signup" prefetch="auto">Create account</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <FieldSet>
                            <FieldGroup>
                                <Controller name="email" control={form.control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input {...field} aria-invalid={fieldState.invalid} type="email" autoComplete="off" name="email" id="email" placeholder="Enter an email" />
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
                        <Button type="button" className="w-full" variant="outline" onClick={() => signIn.social({ provider: "github"})}>Sign in with Github</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}