import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Code2, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { BACKEND_URL } from "../../config"

export default function SignInPage() {

    const navigate = useNavigate();
    const [email , setEmail] = useState<string>("");
    const [password , setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false)

    const signin = async({
        email,
        password,
    } : {
        email: string,
        password: string,
    }) => {
    
        const handleSubmit = await axios.post(`${BACKEND_URL}/api/v1/user/login`, {
            email,
            password,
        }, {
            withCredentials: true,
        });
    
        if(handleSubmit.status === 200){
            console.log("User logged in successfully");
            localStorage.setItem("name", handleSubmit.data.name);
            localStorage.setItem("userId", handleSubmit.data.userId)
            navigate("/")
        }
        else{
            console.log("User creation failed");
        }
    }


    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 text-gray-100">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <Code2 className="h-8 w-8 text-blue-400 mr-2" />
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                            CoDevSpace
                        </span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                        Enter your email below to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-700 border-gray-600 text-white pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600" onClick={() => signin({email, password})}>
                            Sign In
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button variant="link" className="text-blue-400 hover:text-blue-300">
                        Forgot your password?
                    </Button>
                    <div className="text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signup"  className="text-blue-400 hover:text-blue-300">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
