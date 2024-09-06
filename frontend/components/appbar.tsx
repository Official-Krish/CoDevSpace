"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export const AppBar = () => {
    const session = useSession();
    return <div>
        <div className="flex justify-between items-center p-4 bg-gray-900 text-gray-100">
            <h1 className="text-2xl font-bold">Collab Code Editor</h1>
            <div className="flex items-center space-x-4">
                <div onClick={() => signIn()} className="text-gray-400 hover:text-gray-300">
                    Sign in
                </div>

                {session.data?.user ? 
                    <div onClick={() => signOut()} className="text-gray-400 hover:text-gray-300 cursor-pointer">
                        Logout
                    </div> : 
                    <div onClick={() => signIn()} className="text-gray-400 hover:text-gray-300 cursor-pointer">
                        Sign up
                    </div>
                }
            </div>

        </div>
    </div>
}