import { Code2 } from "lucide-react"

export const AppBar = () => {
    return <div>
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center justify-center">
                    <Code2 className="h-6 w-6 mr-2 text-emerald-400" />
                    <span className="font-bold text-emerald-400">CollabCode</span>
                </div>
                <nav className="flex gap-4 sm:gap-6">
                    <div className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        Features
                    </div>
                    <div className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        Pricing
                    </div>
                    <div className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        About
                    </div>
                    <div className="text-sm font-medium hover:text-emerald-400 transition-colors">
                        Sign In
                    </div>
                </nav>
            </div>
      </header>
    </div>
}