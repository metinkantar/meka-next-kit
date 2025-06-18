import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { prisma } from "db";
import bcrypt from "bcryptjs";
import { getClientIp, parseUserAgent, DeviceInfo } from '@/lib/utils';
import { CredentialsSignin } from "next-auth";
import { NextRequest } from "next/server";

export default {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const userAgent = request.headers.get('user-agent') || '';
                const deviceInfo: DeviceInfo = parseUserAgent(userAgent);
                const deviceInfoJson = {
                    os: deviceInfo.os,
                    deviceType: deviceInfo.deviceType,
                };

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                    include: {
                        role: true, // Kullanıcının rolünü doğrudan al
                    },
                });

                if (!user) {
                    throw new UserNotFoundError();
                }

                const isValid = await bcrypt.compare(credentials.password as string, user.password as string);

                if (!isValid) {
                    // Başarısız giriş denemesi sayısını güncelle
                    await prisma.user.update({
                        where: { email: credentials.email as string },
                        data: { loginAttempts: { increment: 1 } },
                    });

                    // Başarısız giriş denemesi logunu kaydet
                    await prisma.activityLog.create({
                        data: {
                            userId: user.id,
                            action: 'failed_login_attempt',
                            details: {
                                ipAddress: getClientIp(request as NextRequest),
                                device: deviceInfoJson,
                                userAgent: userAgent,
                            },
                        },
                    });

                    throw new InvalidPasswordError(); // Geçersiz parola hatası
                }

                if (!user.emailVerified) {
                    throw new EmailNotVerifiedError(); // E-posta doğrulanmamış hatası
                }

                // Başarılı giriş durumunda, giriş denemesi sayısını sıfırla
                await prisma.user.update({
                    where: { email: credentials.email as string },
                    data: {
                        loginAttempts: 0,
                        lastLoginAt: new Date(),
                        loginCount: { increment: 1 },
                    },
                });

                // Başarılı giriş logunu kaydet
                await prisma.activityLog.create({
                    data: {
                        userId: user.id,
                        action: 'successful_login',
                        details: {
                            ipAddress: getClientIp(request as NextRequest),
                            device: deviceInfoJson,
                            userAgent: userAgent,
                        },
                    },
                });

                // Kullanıcı bilgilerini döndürürken, parola hash'ini hariç tutun
                const { password, ...userWithoutPassword } = user;

                return {
                    ...userWithoutPassword,
                    role: user.role?.name || "User", // Kullanıcının rolünü ekleyin
                };
            },
        }),
    ],
    callbacks: {
        /* async jwt({ token, user, account }) {
            if (user) {
                token = {
                    ...token,
                    ...user, // Kullanıcı bilgilerini token'a ekleyin
                };
            }
            return token;
        }, */
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    ...token, // Token'daki kullanıcı bilgilerini session'a aktarın
                };
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

// Kullanıcı bulunamadı hatası
class UserNotFoundError extends CredentialsSignin {
    code = "user_not_found";
}

// Geçersiz parola hatası
class InvalidPasswordError extends CredentialsSignin {
    code = "invalid_password";
}

// E-posta doğrulanmamış hatası
class EmailNotVerifiedError extends CredentialsSignin {
    code = "email_not_verified";
}

// Genel hata sınıfı
class CustomError extends CredentialsSignin {
    code = "custom_error";
}