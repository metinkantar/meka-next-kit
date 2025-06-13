import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirect } from "@/i18n/navigation";
import { prisma } from "db";


interface ResetPasswordPageProps {
    params: {
        locale: string;
    };
    searchParams: {
        token?: string; // URL'den gelen token
    };
}

export default async function ResetPasswordPage({ searchParams, params }: ResetPasswordPageProps) {
    const { token } = await searchParams;
    const { locale } = await params;

    if (!token) {
        // Hata: Yönlendirmeden sonra mutlaka return edin
        return redirect({ href: "/?error=no_token_provided", locale: locale });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken) {
        return redirect({ href: "/?error=invalid_token", locale: locale });
    }

    if (verificationToken.expires < new Date()) {
        return redirect({ href: "/?error=token_expired", locale: locale });
    }


    return (
        <div className={cn("flex min-h-screen items-center justify-center")}>
            <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg">
                <CardContent className="p-0">
                    <ResetPasswordForm token={token} />
                </CardContent>
            </Card>
        </div>
    );
}