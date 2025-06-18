'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ModeToggle } from '../themes/ModeToggle'
import { ThemeSelector } from '../themes/ThemeSelector'
import LanguageSelector from '../LanguageSelector'
import SignInButton from './SigninButton'

const menuItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/services', label: 'Hizmetler' },
    { href: '/contact', label: 'İletişim' },
]

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
                aria-label="Toggle mobile menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-white/20 shadow-lg">
                    <div className="container mx-auto px-4 py-6">
                        <nav className="mb-6">
                            <ul className="space-y-4">
                                {menuItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex items-center space-x-3">
                                <ThemeSelector />
                                <ModeToggle />
                                <LanguageSelector />
                            </div>
                            <SignInButton />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}