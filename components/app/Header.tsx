"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeSelector } from "../features/themes/ThemeSelector"
import { ModeToggle } from "../features/themes/ModeToggle";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const menuItems = [
        { name: "Home Page", href: "/" },
        { name: "About", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" }
    ];

    return (
        <header className="border-b-[1px]">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="relative h-10 w-10 mr-2">
                                <Image src="/images/global/meka-logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            {/* <span className="font-bold text-xl">Logo</span> */}
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center justify-center flex-1">
                        <ul className="flex space-x-8">
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-base font-medium hover:text-zinc-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Language and Theme Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        <ThemeSelector />
                        <ModeToggle />

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

                        <Button variant="outline" className="cursor-pointer" onClick={() => {
                            router.push("/login")
                        }}>
                            Sign In
                        </Button>
                        <Button variant="outline" className="cursor-pointer" onClick={() => {
                            router.push("/panel")
                        }}>
                            Panel
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
