"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations, useLocale } from "next-intl";
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const VerifyEmailPage = () => {
    const t = useTranslations("auth");

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = React.useState('E-posta doğrulanıyor...');
    const [theme, setTheme] = React.useState('light');
    const [language, setLanguage] = React.useState('Türkçe');

    React.useEffect(() => {
        if (token) {
            const verifyEmail = async () => {
                try {
                    const response = await fetch('/api/auth/verify-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setMessage('E-posta başarıyla doğrulandı!');
                        toast.success('E-posta başarıyla doğrulandı!');
                        setTimeout(() => router.push('/login'), 2000);
                    } else {
                        setMessage(data.error || 'E-posta doğrulama başarısız oldu.');
                        toast.error(data.error || 'E-posta doğrulama başarısız oldu.');
                    }
                } catch (error) {
                    setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
                    toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
            };

            verifyEmail();
        }
    }, [token, router]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-md w-full space-y-8">
                <div className="flex justify-end mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Globe className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { }}>French</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>Nederlands</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>English</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>German</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>Kurdish</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>Turkish</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        onClick={toggleTheme}
                        className={`ml-2 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-yellow-600'}`}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        {t("global.email_verification")}
                    </h2>
                </div>
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
                    <div className="text-center">
                        {message === 'E-posta başarıyla doğrulandı!' ? (
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <h3 className="mt-2 text-sm font-medium">{message}</h3>
                        {message === 'E-posta başarıyla doğrulandı!' && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {language === 'Türkçe' ? 'Giriş sayfasına yönlendiriliyorsunuz...' : language === 'English' ? 'Redirecting to login page...' : 'Redirigiendo a la página de inicio de sesión...'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
