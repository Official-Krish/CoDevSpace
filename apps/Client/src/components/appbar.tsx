import Cookies from "js-cookie";
import { Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"; 
import { Button } from "./ui/button";

export const AppBar = () => {
    const navigate = useNavigate();
    
    return ( 
        <div className="bg-gray-900">
            <header className="relative z-10 px-4 lg:px-8 py-4 text-gray-100">
                <div className="container mx-auto flex justify-between items-center">
                    <Link className="flex items-center space-x-2" to="">
                        <Code2 className="h-8 w-8 text-blue-400" />
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                            CoDevSpace
                        </span>
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        {!Cookies.get("token") && 
                            <Link className="text-sm hover:text-blue-400 transition-colors" to="">
                                Features
                            </Link>
                        }
                        
                        <Link className="text-sm hover:text-blue-400 transition-colors" to="/problems">
                            Problems
                        </Link>

                        {Cookies.get("token") && 
                            <div className="hidden md:flex space-x-8">
                                <Link className="text-sm hover:text-blue-400 transition-colors" to="/create">
                                    Collaborate
                                </Link>
                                <Link className="text-sm hover:text-blue-400 transition-colors" to="/join">
                                    Join Room
                                </Link>
                                <Link className="text-sm hover:text-blue-400 transition-colors" to="/Contests">
                                    Contests
                                </Link>
                            </div>
                        }

                        {!Cookies.get("token") && 
                            <div className="flex space-x-8">
                                <Link className="text-sm hover:text-blue-400 transition-colors" to="">
                                    Pricing
                                </Link>
                            </div>
                        }
                        
                    </nav>
                    {Cookies.get("token") ? (
                        <div className="">
                            <UserDropdown />
                        </div>
                    ) : (
                        <div className="hidden md:flex space-x-8"> 
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/signin")}>Sign In</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/signup")}>Sign Up</Button>
                        </div>
                    )}
                    
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
                <DropdownMenuItem className="text-white cursor-pointer">
                    <Link className="flex items-center gap-2" to={`/profile?id=${localStorage.getItem("userId")}`}>
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white cursor-pointer">
                    <button className="flex items-center gap-2 ">
                        <span>Settings</span>
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem  className="text-white cursor-pointer" onClick={() => {
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
