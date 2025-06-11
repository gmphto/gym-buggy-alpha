"use client"

import { Button } from "@/components/ui/button"
import { GoogleButton } from "@/components/ui/google-button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoginSchema, RegisterSchema } from "../../api/schemas"
import { useAuth } from "./AuthProvider"

export function Authentication() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp, signInWithGoogle, loading } = useAuth()

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  })

  const handleLogin = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setError(null)
      await signIn(data.email, data.password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  const handleRegister = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      setError(null)
      await signUp(data.email, data.password, data.name)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed')
    }
  }

  if (isLoginMode) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Gym Buddy</h1>
          <p className="text-slate-600 dark:text-slate-400">Sign in to find your workout partner</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <GoogleButton onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? "Signing in..." : "Continue with Google"}
        </GoogleButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...loginForm.register("password")}
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-500">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className="text-sm text-slate-900 hover:underline dark:text-slate-50"
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Join Gym Buddy</h1>
        <p className="text-slate-600 dark:text-slate-400">Create your account to get started</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      {/* Google Sign In */}
      <GoogleButton onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? "Creating account..." : "Continue with Google"}
      </GoogleButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            {...registerForm.register("name")}
          />
          {registerForm.formState.errors.name && (
            <p className="text-sm text-red-500">
              {registerForm.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...registerForm.register("email")}
          />
          {registerForm.formState.errors.email && (
            <p className="text-sm text-red-500">
              {registerForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...registerForm.register("password")}
          />
          {registerForm.formState.errors.password && (
            <p className="text-sm text-red-500">
              {registerForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...registerForm.register("confirmPassword")}
          />
          {registerForm.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {registerForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLoginMode(true)}
          className="text-sm text-slate-900 hover:underline dark:text-slate-50"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  )
} 