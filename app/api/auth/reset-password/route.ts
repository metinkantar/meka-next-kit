import { prisma } from "db";
import bcrypt from "bcryptjs";
import { type NextRequest } from 'next/server';
import { DeviceInfo, getClientIp, parseUserAgent } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token');
    console.log(token);

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Token is valid" }, { status: 200 });
}

export async function POST(request: Request) {
    const { token, password } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const deviceInfo: DeviceInfo = parseUserAgent(userAgent);
    // DeviceInfo türündeki veriyi JSON'a dönüştürme
    const deviceInfoJson = {
        os: deviceInfo.os,
        deviceType: deviceInfo.deviceType,
    };

    let userEmail: string | null = "unkown"; // Hata durumunda bile e-postayı loglamak için

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            // Geçersiz token hatası
            await prisma.activityLog.create({
                data: {
                    userId: null, // Kullanıcı ID'si bilinmediği için "unknown" veya null
                    action: "password_reset_attempt",
                    details: {
                        status: "failed",
                        reason: "invalid_token",
                        token: token,
                        ipAddress: getClientIp(request as NextRequest),
                        device: deviceInfoJson,
                        userAgent: userAgent,
                    },
                },
            });
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        userEmail = verificationToken.identifier; // Token geçerliyse e-postayı alabiliriz

        if (verificationToken.expires < new Date()) {
            // Token süresi doldu hatası
            await prisma.activityLog.create({
                data: {
                    userId: (await prisma.user.findUnique({ where: { email: userEmail } }))?.id || null, // Kullanıcı ID'sini bulmaya çalış
                    action: "password_reset_attempt",
                    details: {
                        status: "failed",
                        reason: "token_expired",
                        token: token,
                        email: userEmail,
                        ipAddress: getClientIp(request as NextRequest),
                        device: deviceInfoJson,
                        userAgent: userAgent,
                    },
                },
            });
            return NextResponse.json({ error: "Token expired" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier },
        });

        if (!user) {
            // Kullanıcı bulunamadı hatası (nadiren olmalı, çünkü token e-postaya bağlı)
            await prisma.activityLog.create({
                data: {
                    userId: null, // Kullanıcı bulunamadığı için
                    action: "password_reset_attempt",
                    details: {
                        status: "failed",
                        reason: "user_not_found",
                        token: token,
                        email: userEmail,
                        ipAddress: getClientIp(request as NextRequest),
                        device: deviceInfoJson,
                        userAgent: userAgent,
                    },
                },
            });
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Mevcut şifre ile yeni şifreyi karşılaştır
        const isSameAsCurrentPassword = await bcrypt.compare(password, user.password as string);
        if (isSameAsCurrentPassword) {
            // Mevcut şifreyle aynı hatası
            await prisma.activityLog.create({
                data: {
                    userId: user.id,
                    action: "password_reset_attempt",
                    details: {
                        status: "failed",
                        reason: "password_reused",
                        email: userEmail,
                        ipAddress: getClientIp(request as NextRequest),
                        device: deviceInfoJson,
                        userAgent: userAgent,
                    },
                },
            });
            return NextResponse.json(
                { error: "New password cannot be the same as your current password" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // İşlem başarılı: Şifreyi güncelle ve token'ı sil
        await prisma.$transaction([
            prisma.user.update({
                where: { email: verificationToken.identifier },
                data: { password: hashedPassword },
            }),
            prisma.verificationToken.delete({
                where: { token },
            }),
            prisma.activityLog.create({
                data: {
                    userId: user.id,
                    action: "password_reset_successful",
                    details: {
                        status: "success",
                        email: userEmail,
                        ipAddress: getClientIp(request as NextRequest),
                        device: deviceInfoJson,
                        userAgent: userAgent,
                    },
                },
            }),
        ]);

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetting password:", error);
        // Genel hata durumunda loglama
        await prisma.activityLog.create({
            data: {
                userId: userEmail ? (await prisma.user.findUnique({ where: { email: userEmail } }))?.id || null : null, // Eğer e-posta biliniyorsa kullanıcı ID'sini al
                action: "password_reset_failure",
                details: {
                    status: "failed",
                    reason: "internal_server_error",
                    errorMessage: (error as Error).message,
                    email: userEmail,
                    ipAddress: getClientIp(request as NextRequest),
                    device: deviceInfoJson,
                    userAgent: userAgent,
                },
            },
        });
        return NextResponse.json(
            { error: "Error resetting password" },
            { status: 500 }
        );
    }
}
