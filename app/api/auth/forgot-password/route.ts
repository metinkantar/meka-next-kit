import { NextResponse } from "next/server";
import { prisma } from "db";
import { sendPasswordResetEmail, } from "@/lib/email";
import { generateVerificationToken } from "@/lib/functions";


export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Parola sıfırlama tokenı oluştur
        const resetToken = generateVerificationToken();
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 saat sonra sona erer

        // Tokenı veritabanına kaydet
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: resetToken,
                expires: resetTokenExpires,
            },
        });

        // Parola sıfırlama URL'si oluştur
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        // Parola sıfırlama e-postası gönder
        await sendPasswordResetEmail(email, resetUrl);

        return NextResponse.json({ message: "Password reset link sent" });
    } catch (error) {
        console.error("Error in forgot password:", error);
        return NextResponse.json(
            { error: "Error sending password reset link" },
            { status: 500 }
        );
    }
}
