import Navigation from "@/components/layouts/app/Navigation";
import Logo from "@/components/layouts/Logo";
import HeaderActions from "@/components/layouts/app/HeaderAction";
import MobileMenu from "@/components/layouts/app/MobileMenu";
import ScrollHandler from "@/components/layouts/app/ScrollHandler";

export default function Header() {
    return (
        <>
            <ScrollHandler />
            <header id="header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Logo />
                        </div>

                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <Navigation />
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <HeaderActions />
                        </div>

                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}