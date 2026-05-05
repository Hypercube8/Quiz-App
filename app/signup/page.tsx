"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpInfo } from "@/lib/schema";
import { Spinner } from "@/components/ui/spinner";

import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function page() {
    const router = useRouter();
    const form = useForm<SignUpInfo>({
        resolver: zodResolver(signUpSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            name: "",
            password: ""
        }
    })

    async function onSubmit(data: SignUpInfo) {
        const res = await signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
        });

        if (res.error) {
            form.setError("form", { message: res.error.message || "Something went wrong." } );
        } else {
            router.push("/join");
        }
    }

    return (
        <div className="w-full h-full min-h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        {form.formState.errors.form && (<FieldError>{form.formState.errors.form.message}</FieldError>)}
                    </CardDescription>
                </CardHeader>
                <form onChange={() => form.clearErrors("form")} onSubmit={form.handleSubmit(onSubmit)}>
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
                                <Controller name="name" control={form.control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Username</FieldLabel>
                                        <Input {...field} aria-invalid={fieldState.invalid} type="text" autoComplete="off" name="name" id="name" placeholder="Enter a username" />
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
                        <Button type="submit" className="w-full">
                            {form.formState.isLoading && (<Spinner />)}
                            Sign Up
                        </Button>
                </form>
            </Card>
        </div>
    )
}