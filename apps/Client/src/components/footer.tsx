import { Instagram, Linkedin, Youtube } from "lucide-react"
import { Link } from "react-router-dom"

export const Footer = () => {
    return <div className="fixed bottom-0 w-full">
        <footer className="w-full py-6 bg-gray-950 border-t border-gray-800 h-60">
            <div className="px-4 md:px-6 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <p className="text-lg text-gray-400">© 2024 CoDevSpace. All rights reserved.</p>
                    <div className="pt-10 text-white font-bold pb-3"> Follow us</div>
                    <div className="flex gap-4">
                        <Link to=""><Youtube className="h-6 w-6 text-white" /></Link>
                        <Link to=""><Linkedin className="h-6 w-6 text-white" /></Link>
                        <Link to=""><Instagram className="h-6 w-6 text-white" /></Link>
                    </div>
                </div>
                <nav className="gap-4 sm:gap-6">
                    <p className="text-md text-white pb-3 font-bold">CoDevSpace Legal</p>
                    <div className="text-sm hover:underline underline-offset-4 hover:text-emerald-400 transition-colors text-gray-400 cursor-pointer pb-1">
                        Terms of Service
                    </div>
                    <div className="text-sm hover:underline underline-offset-4 hover:text-emerald-400 transition-colors text-gray-400 cursor-pointer pb-1">
                        Privacy & Policy
                    </div>
                    <div className="text-sm hover:underline underline-offset-4 hover:text-emerald-400 transition-colors text-gray-400 cursor-pointer pb-1">
                        Refund & Cancellation
                    </div>
                </nav>
            </div>
      </footer>
    </div>
}