'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export default function SignInButton() {
    const router = useRouter();

    return (
        <Button className="cursor-pointer" onClick={() => {
            router.push("/login")
        }}>
            Sign In
        </Button>
    )
};