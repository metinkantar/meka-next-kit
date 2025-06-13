// app/[locale]/(auth)/reset-password/_components/reset-password-form.tsx
"use client"; // Bu bir client component olacak

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { ResetPasswordSchema } from "@/schemas/auth";
import { useRouter } from "@/i18n/navigation";

interface ResetPasswordFormProps {
    token: string; // Sunucu tarafından doğrulanmış token buraya prop olarak gelir
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const t = useTranslations("auth.reset_password");
    const router = useRouter();

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof ResetPasswordSchema>) {
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password: data.password }),
            });

            if (response.ok) {
                toast.success(t("password_reset_success"));
                router.push("/login");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || t("error_resetting_password"));
                // POST isteği sırasında bir hata olursa (örn: aynı şifre),
                // kullanıcıyı yönlendirmeyip hata mesajını göstermek yeterlidir.
            }
        } catch (error) {
            toast.error(t("unexpected_error"));
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-13 h-13 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 bg-zinc-800 rounded-full"></div>
                    </div>
                    <h1 className="text-2xl font-bold">{t("reset_password_title")}</h1>
                    <p className="text-muted-foreground text-balance">
                        {t("reset_password_description")}
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("new_password")}</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("confirm_password")}</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button variant="default" type="submit" className="w-full cursor-pointer">
                    {t("reset_password")}
                </Button>
            </form>
        </Form>
    );
}