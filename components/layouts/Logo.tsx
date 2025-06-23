import { Link } from "@/i18n/navigation";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <div className="w-24 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center tracking-wide">
                <span className="text-white font-bold text-sm">MeKa</span>
            </div>
            {/* <span className="font-bold text-lg text-gray-900 dark:text-white">MeKa</span> */}
        </Link>
    )
}