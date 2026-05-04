"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import signUpAction from "@/lib/actions/sign-up";
import { LoginInfo, loginSchema } from "@/lib/login";
import { Spinner } from "@/components/ui/spinner";

export default function page() {
    const form = useForm<LoginInfo>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: LoginInfo) {
        const result = await signUpAction(data);

        if (result) {
            form.setError("form", {
                message: result.error
            });
        }
    }

    return (
        <div className="w-full h-full min-h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <p>{form.formState.errors.form?.message}</p>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Button type="submit" className="w-full">
                            {form.formState.isLoading && (<Spinner />)}
                            Sign Up
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}