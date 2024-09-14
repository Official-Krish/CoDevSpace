export const Footer = () => {
    return <div>
        <footer className="w-full py-6 bg-gray-950 border-t border-gray-800">
            <div className="container px-4 md:px-6 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                <p className="text-xs text-gray-400">© 2023 CollabCode. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                    <div className="text-xs hover:underline underline-offset-4 hover:text-emerald-400 transition-colors">
                        Terms of Service
                    </div>
                    <div className="text-xs hover:underline underline-offset-4 hover:text-emerald-400 transition-colors">
                        Privacy
                    </div>
                </nav>
            </div>
      </footer>
    </div>
}