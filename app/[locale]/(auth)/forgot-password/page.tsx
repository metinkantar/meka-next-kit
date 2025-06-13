"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ForgotPasswordSchema } from "@/schemas/auth";


export default function ForgotPasswordPage() {
    const t = useTranslations("auth.forgot_password");
    const router = useRouter();
    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(t("password_reset_link_sent"));
                router.push("/auth/login"); // Kullanıcıyı giriş sayfasına yönlendir
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || t("error_sending_reset_link"));
            }
        } catch (error) {
            toast.error(t("unexpected_error"));
        }
    }

    return (
        <div className={cn("flex min-h-screen items-center justify-center")} >
            <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg">
                <CardContent className="p-0 md:grid-cols-1">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="p-6 md:p-8 space-y-6"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-13 h-13 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-zinc-800 rounded-full"></div>
                                </div>
                                <h1 className="text-2xl font-bold">{t("title")}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {t("description")}
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("email")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="meka@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button variant="default" type="submit" className="w-full cursor-pointer">
                                {t("submit")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
