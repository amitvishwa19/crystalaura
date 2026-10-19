'use client'
import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader } from 'lucide-react'
import { useSession, signIn, signOut } from "next-auth/react"

function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({ email: '', password: '' })
    const [msg, setMsg] = useState('')
    const searchParams = useSearchParams()
    const rawCallbackUrl = searchParams.get('callbackUrl') || '/account'
    const callbackUrl = rawCallbackUrl.startsWith('/login') ? '/account' : rawCallbackUrl

    const login = async (e) => {
        e?.preventDefault();

        if (!data.email || !data.password) {
            return toast.error("Please enter Email and Password");
        }

        toast.loading("Logging in, please wait...", { id: "login" });
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });


        console.log('res', res)

        setLoading(false);

        // Handle errors
        if (res?.error) {
            if (res.error === "USER_NOT_FOUND") {
                return toast.error("No user found with this email", { id: "login" });
            }
            if (res.error === "NO_PASSWORD") {
                return toast.error("This account was created with Google login,try loggin in with Google", { id: "login" });
            }
            if (res.error === "WRONG_PASSWORD") {
                return toast.error("Invalid Credentials, please try again", { id: "login" });
            }
            return toast.error("Something went wrong", { id: "login" });
        }

        // Success
        toast.success("Login successful! Redirecting...", { id: "login" });
        window.location.href = callbackUrl;
    };

    const handleGoogleLogin = () => {
        const deviceToken = 'wola token'
        document.cookie = `deviceToken=${deviceToken}; path=/`;
        signIn('google', { callbackUrl })
    }

    const handleGithubLogin = () => {
        signIn('github')
    }

    return (
        <>
        <div className="w-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center mb-5">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Sign In
                    </h1>
                    <p className="text-sm text-slate-400">
                        Enter your credentials to access your account
                    </p>
                </div>

                <div className={cn("grid gap-6")}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="text-slate-300" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={loading}
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                className="bg-[#0B0F19]/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#00F0FF] focus-visible:ring-offset-0 focus-visible:border-[#00F0FF]"
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-slate-300" htmlFor="password">
                                    Password
                                </Label>
                                <Link href={'/forgot'} className="text-xs font-semibold text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                disabled={loading}
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="bg-[#0B0F19]/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#00F0FF] focus-visible:ring-offset-0 focus-visible:border-[#00F0FF]"
                            />
                        </div>

                        <Button
                            className='h-10 w-full mt-2 cursor-pointer   font-bold transition-all ease-out'
                            disabled={loading}
                            onClick={login}
                        >
                            {loading && (
                                <Loader className="mr-2 h-5 w-5 animate-spin" />
                            )}
                            Sign In
                        </Button>
                    </div>

                    <div className='flex justify-center text-sm text-slate-400 mt-2'>
                        Don't have an account?
                        <Link replace={true} href={'/register'}>
                            <span className='ml-2 font-bold text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors hover:underline underline-offset-4'>Sign Up</span>
                        </Link>
                    </div>

                    <div className="relative mt-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f172a] px-3 font-medium text-slate-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className='flex justify-evenly w-full mt-2 gap-4'>
                        <Button
                            type="button"
                            disabled={false}
                            onClick={handleGoogleLogin}
                            className='w-full flex items-center justify-center gap-2 py-2 cursor-pointer px-4 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 text-white transition-all h-11 rounded-lg'
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>
                        <Button
                            type="button"
                            disabled={false}
                            onClick={handleGithubLogin}
                            className='w-full flex items-center justify-center gap-2 py-2 cursor-pointer px-4 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 text-white transition-all h-11 rounded-lg'
                        >
                            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                            GitHub
                        </Button>
                    </div>

                </div>

                <div className='flex flex-col items-center justify-center text-[11px] gap-2 mt-8 text-slate-500 text-center px-4'>
                    <span>By creating an account, you agree to our</span>
                    <p>
                        <Link href="/terms" className="text-slate-300 hover:text-[#00F0FF] transition-colors">
                            Terms of Service
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-slate-300 hover:text-[#00F0FF] transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}

export default function Login() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
