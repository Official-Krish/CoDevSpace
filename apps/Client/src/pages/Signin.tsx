import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Code2 } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { BACKEND_URL } from "../../config"

export default function SignInPage() {

    const navigate = useNavigate();
    const [email , setEmail] = useState<string>("");
    const [password , setPassword] = useState<string>("");

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
            navigate("/create")
        }
        else{
            console.log("User creation failed");
        }
    }


    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-900 text-gray-100 border-gray-800">
                <CardHeader className="space-y-1 flex flex-col items-center">
                <div className="flex items-center justify-center mb-4">
                    <Code2 className="h-8 w-8 mr-2 text-emerald-400" />
                    <span className="font-bold text-2xl text-emerald-400">CollabCode</span>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="me@example.com" required type="email" className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" required type="password" className="bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
                        signin({
                            email,
                            password
                        });
                    }}>Sign In</Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-gray-400 text-center">
                        Don't have an account? {" "}
                        <button className="text-emerald-400 hover:underline" onClick={() => navigate("/signup")}>
                            Sign up
                        </button>
                    </div>
                    <button className="text-sm text-emerald-400 hover:underline text-center">
                        Forgot your password?
                    </button>
                </CardFooter>
            </Card>
        </div>
    )
}
