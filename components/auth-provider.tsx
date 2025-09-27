"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  walletAddress: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isWorldApp: boolean
  login: () => Promise<void>
  logout: () => void
  verify: (action: string) => Promise<string | null>
  pay: (params: {
    to: string
    tokens: Array<{ symbol: string; token_amount: string }>
    description: string
    reference: string
  }) => Promise<any>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function isInWorldApp(): boolean {
  if (typeof window === "undefined") return false

  // Check for World App specific user agent or other indicators
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isWorldAppUA = userAgent.includes("worldapp") || userAgent.includes("world app")

  // Check for World App specific window properties
  const hasWorldAppAPI = typeof (window as any).WorldApp !== "undefined"

  // Check if we're in an iframe (World Apps often run in iframes)
  const isInIframe = window !== window.top

  return isWorldAppUA || hasWorldAppAPI || isInIframe
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWorldApp, setIsWorldApp] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      if (typeof window !== "undefined") {
        const inWorldApp = isInWorldApp()
        console.log("[v0] Environment check - inWorldApp:", inWorldApp)

        setIsWorldApp(inWorldApp)

        if (inWorldApp) {
          console.log("[v0] Running in World App environment")
        } else {
          console.log("[v0] Running in development/browser environment - using mock mode")
        }
      } else {
        setIsWorldApp(false)
      }

      // Check for existing session
      await checkExistingSession()
    }

    initializeApp()
  }, [])

  const checkExistingSession = async () => {
    try {
      // Check if user has existing session from localStorage
      const savedUser = localStorage.getItem("chaptr_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      // No automatic user creation - users must explicitly login
    } catch (error) {
      console.error("Error checking session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)

      if (!isWorldApp) {
        throw new Error("Login is only available in World App environment")
      }

      // TODO: Implement actual MiniKit authentication
      // const result = await MiniKit.signIn()
      throw new Error("MiniKit integration required for authentication")

    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("chaptr_user")
  }

  const verify = async (action: string): Promise<string | null> => {
    try {
      if (!isWorldApp) {
        throw new Error("World ID verification is only available in World App environment")
      }

      if (!user) {
        throw new Error("User must be logged in to verify")
      }

      // TODO: Implement actual World ID verification
      // const result = await MiniKit.verifyWorldId({ action })
      throw new Error("MiniKit integration required for World ID verification")

    } catch (error) {
      console.error("Verification failed:", error)
      return null
    }
  }

  const pay = async (params: {
    to: string
    tokens: Array<{ symbol: string; token_amount: string }>
    description: string
    reference: string
  }) => {
    try {
      if (!isWorldApp) {
        throw new Error("Payments are only available in World App environment")
      }

      if (!user) {
        throw new Error("User must be logged in to make payments")
      }

      // TODO: Implement actual MiniKit payment
      // const result = await MiniKit.pay(params)
      throw new Error("MiniKit integration required for payments")

    } catch (error) {
      console.error("Payment failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isWorldApp, login, logout, verify, pay }}>
      {children}
    </AuthContext.Provider>
  )
}
