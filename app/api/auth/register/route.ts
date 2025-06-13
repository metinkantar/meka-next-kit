import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { prisma } from 'db';
import { RegisterSchema } from '@/schemas/auth';
import { getClientIp, parseUserAgent, DeviceInfo, hashPassword } from '@/lib/utils';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken } from '@/lib/functions';



export async function POST(request: NextRequest) {
    try {
        const userAgent = request.headers.get('user-agent') || '';
        const deviceInfo: DeviceInfo = parseUserAgent(userAgent);
        // DeviceInfo türündeki veriyi JSON'a dönüştürme
        const deviceInfoJson = {
            os: deviceInfo.os,
            deviceType: deviceInfo.deviceType,
        };

        const body = await request.json();
        const validatedData = RegisterSchema.parse(body);

        const { name, email, password } = validatedData;

        // Kullanıcının zaten var olup olmadığını kontrol edelim
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Kullanıcı zaten mevcut!' }, { status: 400 });
        }

        // Şifreyi karma haline getirin
        const hashedPassword = await hashPassword(password);

        // Varsayılan Rol
        const defaultRole = await prisma.role.findUnique({
            where: { name: 'User' },
        });

        if (!defaultRole) {
            return NextResponse.json({ error: 'Varsayılan rol bulunamadı!' }, { status: 500 });
        }

        // Yeni kullanıcı oluştur
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: defaultRole.id,
                notificationPreference: {
                    create: {
                        emailEnabled: false,
                        smsEnabled: false,
                        inAppEnabled: false,
                        promotionalEmail: false,
                        securityAlerts: false,
                    },
                },
            },
        });

        // Aktivite Günlüğü Oluştur
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'user_registered',
                details: {
                    ipAddress: getClientIp(request),
                    device: deviceInfoJson,
                    userAgent: userAgent
                },
            },
        });

        // Doğrulama tokenı oluştur
        const verificationToken = generateVerificationToken();

        // Tokenı veritabanına kaydet
        await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token: verificationToken,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat sonra sona erer
            },
        });

        // Doğrulama URL'si oluştur
        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

        // Doğrulama e-postası gönder
        /* await sendVerificationEmail(email, verificationUrl); */
        try {
            await sendVerificationEmail(email, verificationUrl);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return NextResponse.json({ error: "Doğrulama e-postası gönderilemedi." }, { status: 500 });
        }

        // Yanıttan parola karmasını çıkart
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Kayıt sırasında bir hata oluştu:', error);
        return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu!' }, { status: 500 });
    }
}


