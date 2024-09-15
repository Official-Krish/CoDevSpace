import { Code2 } from "lucide-react"
import { useNavigate } from "react-router-dom";

export const AppBar = () => {
    const navigate = useNavigate();
    return <div>
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center justify-center">
                    <Code2 className="h-6 w-6 mr-2 text-emerald-400" />
                    <button className="font-bold text-emerald-400" onClick={() => navigate("/")}>CollabCode</button>
                </div>
                <nav className="flex gap-4 sm:gap-6">
                    <button className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        Features
                    </button>
                    <button className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        Pricing
                    </button>
                    <button className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        About
                    </button>
                    <button className="text-sm font-medium hover:text-emerald-400 transition-colors" onClick={() => navigate("/signin")}>
                        Sign In
                    </button>
                    <button className="text-sm font-medium hover:text-emerald-400 transition-colors" onClick={() => navigate("/signup")}>
                        Sign Up
                    </button>
                </nav>
            </div>
      </header>
    </div>
}