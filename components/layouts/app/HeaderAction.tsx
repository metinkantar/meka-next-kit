import { ModeToggle } from "@/components/layouts/themes/ModeToggle";
import LanguageSelector from "@/components/layouts/LanguageSelector";
import { ThemeSelector } from "@/components/layouts/themes/ThemeSelector";
import SignInButton from "./SigninButton";

export default function HeaderActions() {

    return (
        <div className="flex items-center space-x-1">
            {/* <ThemeSelector />
            <SignInButton /> */}
            <ModeToggle />
            <LanguageSelector />
        </div>
    )
}