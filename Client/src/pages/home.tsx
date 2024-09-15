import { Footer } from "../components/footer"
import { AppBar } from "../components/appbar"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import {Users, Zap, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";


export default function Home() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    Cookies.get("token") ? navigate("/create") : navigate("/signin")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-300">
      <AppBar/>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-900">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-emerald-400">
                  Collaborate on Code in Real-Time
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Write, share, and debug code together. Our collaborative editor makes teamwork seamless and efficient.
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleSubmit()}>Get Started</Button>
                <Button variant="outline" className="text-emerald-500 border-emerald-400 hover:bg-emerald-600 hover:text-black">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-emerald-400">Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Users className="h-12 w-12 text-emerald-400" />
                  <h3 className="text-2xl font-bold text-center text-emerald-200">Real-Time Collaboration</h3>
                  <p className="text-gray-400 text-center">
                    Code together with your team in real-time, seeing changes as they happen.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Zap className="h-12 w-12 text-emerald-400" />
                  <h3 className="text-2xl font-bold text-center text-emerald-200">Instant Debugging</h3>
                  <p className="text-gray-400 text-center">
                    Debug issues together with integrated tools and live console output.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Globe className="h-12 w-12 text-emerald-400" />
                  <h3 className="text-2xl font-bold text-center text-emerald-200">Cross-Platform Support</h3>
                  <p className="text-gray-400 text-center">
                    Work from anywhere, on any device, with our cloud-based editor.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-emerald-400">Join Thousands of Developers</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <p className="text-gray-300 mb-4">
                      "CollabCode has revolutionized the way our team works. It's an indispensable tool for our remote development process."
                    </p>
                    <p className="font-semibold text-emerald-400">- Satisfied User {i}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-emerald-400">
                  Ready to Start Collaborating?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Join thousands of developers who are already using CollabCode to streamline their workflow.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input 
                    className="max-w-lg flex-1 bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-400 focus:ring-emerald-400" 
                    placeholder="Enter your email" 
                    type="email" 
                  />
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate("/signup")}>Sign Up</Button>
                </form>
                <p className="text-xs text-gray-400">
                    By signing up, you agree to our{" "}
                  <div className="underline underline-offset-2 hover:text-emerald-400 transition-colors">
                    Terms & Conditions
                  </div>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}


