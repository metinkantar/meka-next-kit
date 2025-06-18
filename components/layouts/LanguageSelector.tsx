'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react"; // Varsayılan ikon olarak kalabilir
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

// Bayrak SVG'lerini import ediyoruz. Bu yolu kendi projenizin yapısına göre ayarlayın.
// Örneğin: import EnFlag from '@/public/flags/en.svg';
// Eğer flags klasörünüz public altındaysa, direkt /flags/en.svg olarak kullanabiliriz.
// Örnek olarak burada bazı bayrakları temsili olarak tanımlayacağım.
// Gerçek projede bunları uygun şekilde import etmeniz veya bir CDN'den çekmeniz gerekir.

interface LocaleInfo {
    code: string;
    name: string;
    flagPath: string; // Bayrak SVG/PNG yolu
}

const localesInfo: LocaleInfo[] = [
    { code: 'en', name: 'English', flagPath: '/flags/en.svg' },
    { code: 'fr', name: 'French', flagPath: '/flags/fr.svg' },
    { code: 'nl', name: 'Nederlands', flagPath: '/flags/nl.svg' }, // Eğer nl (Dutch) destekliyorsanız
    { code: 'de', name: 'German', flagPath: '/flags/de.svg' },
    { code: 'krd', name: 'Kurdish', flagPath: '/flags/krd.svg' }, // Varsayımsal bayrak
    { code: 'tr', name: 'Turkish', flagPath: '/flags/tr.svg' },
];

const LanguageSelector = () => {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    // Mevcut locale'a ait bilgiyi buluyoruz
    const activeLocaleInfo = localesInfo.find(
        (locale) => locale.code === currentLocale
    );

    const changeLocale = (newLocale: string) => {
        if (newLocale === currentLocale) {
            return;
        }
        router.push(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button className='cursor-pointer' size="icon">
                    {/* Eğer aktif locale'a ait bayrak varsa onu göster, yoksa Globe ikonunu göster */}
                    {activeLocaleInfo ? (
                        <img
                            src={activeLocaleInfo.flagPath}
                            alt={`${activeLocaleInfo.name} Flag`}
                            className="h-5 w-5 rounded-full object-cover" // Yuvarlak kenarlar ve tam doldurma için
                        />
                    ) : (
                        <Globe className="h-5 w-5" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {localesInfo.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => changeLocale(locale.code)}
                        className="flex items-center gap-2" // İkon ve metin arasına boşluk bırakmak için
                    >
                        <img
                            src={locale.flagPath}
                            alt={`${locale.name} Flag`}
                            className="h-4 w-4 rounded-full object-cover" // Dropdown içindeki bayraklar için boyut
                        />
                        <span>{locale.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;

/* 'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from '@/i18n/navigation'; // next-intl navigation hook'larını import ediyoruz
import { useLocale } from 'next-intl'; // Mevcut dili almak için

const LanguageSelector = () => {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale(); // Mevcut aktif dili alıyoruz

    // Dil değiştirme fonksiyonu
    const changeLocale = (newLocale: string) => {
        // Eğer zaten seçili dil ise bir şey yapma
        if (newLocale === currentLocale) {
            return;
        }
        // useRouter'ın push metodu ile path'i koruyarak dil değiştirme
        router.push(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Globe className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLocale('fr')}>French</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale('nl')}>Nederlands</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale('de')}>German</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale('krd')}>Kurdish</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLocale('tr')}>Turkish</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;
 */