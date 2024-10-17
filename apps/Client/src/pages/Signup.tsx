import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Code2, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { BACKEND_URL } from "../../config"
import { useUserStore } from "../store"
import { Progress } from "../components/ui/progress"
import { Checkbox } from "../components/ui/checkbox"

export default function SignUpPage() {

    const navigate = useNavigate();
    const [name , setName] = useState<string>(""); 
    const [email , setEmail] = useState<string>("");
    const [password , setPassword] = useState<string>("");
    const { setUsername } = useUserStore();
    const [showPassword, setShowPassword] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const signup = async({
        email,
        password,
        name
    } : {
        email: string,
        password: string,
        name: string
    }) => {

        setUsername(name);
        const handleSubmit = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
            email,
            password,
            name
        }, {
            withCredentials: true,
        });
    
        if(handleSubmit.status === 200){
            console.log("User created successfully");
            localStorage.setItem("name", name);
            localStorage.setItem("userId", handleSubmit.data.userId)
            navigate("/create")
        }
        else{
            console.log("User creation failed");
        }
    }

    const checkPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength += 25
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
        if (password.match(/\d/)) strength += 25
        if (password.match(/[^a-zA-Z\d]/)) strength += 25
        setPasswordStrength(strength)
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
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                        Enter your details below to create your account and start coding
                    </CardDescription>
                    </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                        </div>
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
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        checkPasswordStrength(e.target.value)
                                    }}
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
                            <Progress value={passwordStrength} className="h-2 mt-2" />
                            <p className="text-sm text-gray-400 mt-1">
                                Password strength: {passwordStrength === 100 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={agreedToTerms}
                                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                            />
                            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I agree to the{" "}
                                <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                                    terms of service
                                </Link>
                            </Label>
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600" onClick={() => signup({email, password, name})}>
                            Sign Up
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-gray-400 text-center w-full">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-blue-400 hover:text-blue-300">
                        Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
