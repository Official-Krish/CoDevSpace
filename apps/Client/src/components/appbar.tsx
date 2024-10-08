import Cookies from "js-cookie";
import { Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"; 

export const AppBar = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <header className="h-16 border-b border-gray-800 bg-gray-900 px-8">
                <div className="flex justify-between items-center h-full">
                    <div className="flex items-center">
                        <Code2 className="h-6 w-6 mr-2 text-emerald-400" />
                        <button className="font-bold text-emerald-400" onClick={() => navigate("/")}>
                            CoDevSpace
                        </button>
                    </div>
                    <nav className="flex gap-6 items-center">
                        <button className="text-sm font-medium hover:text-emerald-400 transition-colors text-white" onClick={() => navigate("/problems")}>
                            Problems
                        </button>
                        <button className="text-sm font-medium hover:text-emerald-400 transition-colors text-white" onClick={() => navigate("/create")}>
                            Create
                        </button>
                        <button className="text-sm font-medium hover:text-emerald-400 transition-colors text-white" onClick={() => navigate("/join")}>
                            Join
                        </button>
                        {Cookies.get("token") ? (
                            <div className="flex items-center">
                                <UserDropdown />
                            </div>
                        ) : (
                            <div className="flex gap-4 text-white"> 
                                <button className="text-sm font-medium hover:text-emerald-400 transition-colors" onClick={() => navigate("/signin")}>
                                    Sign In
                                </button>
                                <button className="text-sm font-medium hover:text-emerald-400 transition-colors" onClick={() => navigate("/signup")}>
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>
        </div>
    );
};

const UserDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] bg-gray-800 border-gray-600">
                <DropdownMenuItem className="text-white">
                    <button className="flex items-center gap-2">
                        <span>Profile</span>
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white">
                    <button className="flex items-center gap-2 ">
                        <span>Settings</span>
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem  className="text-white" onClick={() => {
                    Cookies.remove("token");
                    localStorage.removeItem("name");
                    window.location.reload();
                }}>
                    <button className="flex items-center gap-2 ">
                        <span>Sign Out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Avatar = () => {
    return (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600">
            <span className="font-medium text-white">{localStorage.getItem("name")?.slice(0, 1).toUpperCase() || "U"}</span>
        </div>
    );
};
