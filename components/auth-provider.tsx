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
      // Check if user has existing session
      const savedUser = localStorage.getItem("chaptr_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error checking session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)
      console.log("[v0] Starting login process...")

      if (!isWorldApp) {
        console.log("[v0] Using mock authentication for development")
        const mockUser: User = {
          id: "mock_user_123",
          username: "demo_user",
          walletAddress: "0x1234567890123456789012345678901234567890",
          isVerified: false,
        }
        setUser(mockUser)
        localStorage.setItem("chaptr_user", JSON.stringify(mockUser))
        console.log("[v0] Mock login successful")
        return
      }

      console.log("[v0] World App detected but MiniKit not available in this environment")
      console.log("[v0] Using fallback authentication")

      const fallbackUser: User = {
        id: "worldapp_user_123",
        username: "worldapp_user",
        walletAddress: "0x1111111111111111111111111111111111111111",
        isVerified: false,
      }
      setUser(fallbackUser)
      localStorage.setItem("chaptr_user", JSON.stringify(fallbackUser))
      console.log("[v0] Fallback login successful")
    } catch (error) {
      console.error("Login failed:", error)
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
      console.log("[v0] Starting verification for action:", action)

      if (!isWorldApp) {
        console.log("[v0] Using mock verification for development")
        if (user) {
          const updatedUser = { ...user, isVerified: true }
          setUser(updatedUser)
          localStorage.setItem("chaptr_user", JSON.stringify(updatedUser))
        }
        return "mock_nullifier_hash_123"
      }

      console.log("[v0] World App verification not available, using fallback")
      if (user) {
        const updatedUser = { ...user, isVerified: true }
        setUser(updatedUser)
        localStorage.setItem("chaptr_user", JSON.stringify(updatedUser))
      }
      return "worldapp_nullifier_hash_123"
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
        console.log("[v0] Mock payment:", params)
        return { status: "success", transaction_id: "mock_tx_123" }
      }

      console.log("[v0] World App payment:", params)
      return { status: "success", transaction_id: "worldapp_tx_123" }
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
