"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  MiniKit,
  WalletAuthInput,
  ResponseEvent,
  MiniAppWalletAuthSuccessPayload,
} from "@worldcoin/minikit-js"

interface AuthUser {
  address: string
  username: string
  profilePictureUrl?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isAuthenticating: boolean
  user: AuthUser | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthWrapper')
  }
  return context
}

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authenticationRequired, setAuthenticationRequired] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)


  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      console.log("MiniKit not installed")
      setAuthenticationRequired(false)
      return
    }

    try {
      setIsAuthenticating(true)
      console.log("Starting wallet authentication...")

      const res = await fetch(`/api/nonce`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
      const { nonce } = await res.json()
      console.log("Received nonce:", nonce)

      const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Sign in to Chaptr - Stories by Verified Humans',
      })

      console.log("Wallet auth response:", finalPayload)

      if (finalPayload.status === 'error') {
        console.log('Authentication error or canceled:', finalPayload)
        setIsAuthenticating(false)
        setAuthenticationRequired(true)
        return
      }

      const response = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      const result = await response.json()
      console.log('SIWE verification result:', result)

      if (result.status === 'success' && result.isValid) {
        setIsAuthenticated(true)
        setAuthenticationRequired(false)

        // Get World App user data
        let worldAppUser = null
        try {
          // Try to get user from MiniKit directly first
          if (MiniKit.user && MiniKit.user.username) {
            worldAppUser = {
              username: MiniKit.user.username,
              profilePictureUrl: MiniKit.user.profilePictureUrl
            }
          } else {
            // Fallback: get user by address
            worldAppUser = await MiniKit.getUserByAddress(finalPayload.address)
          }
        } catch (error) {
          console.log('Could not get World App user data:', error)
        }

        setUser({
          address: finalPayload.address,
          username: worldAppUser?.username || finalPayload.address.slice(0, 6) + '...' + finalPayload.address.slice(-4),
          profilePictureUrl: worldAppUser?.profilePictureUrl,
        })
        console.log('Authentication successful!', { worldAppUser })
      } else {
        console.log('Authentication failed:', result)
        setAuthenticationRequired(true)
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setAuthenticationRequired(true)
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.log("MiniKit not installed - allowing access for development")
      setAuthenticationRequired(false)
      return
    }

    console.log("MiniKit installed, setting up wallet auth")
    const timer = setTimeout(() => {
      signInWithWallet()
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Show simple background while authentication is required
  if (authenticationRequired && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}