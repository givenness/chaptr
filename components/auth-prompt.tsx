"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Wallet, Shield, BookOpen, AlertCircle, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthPrompt() {
  const { login, isLoading, isWorldApp } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-sans">Welcome to Chaptr</CardTitle>
          <CardDescription className="text-pretty">
            Stories by verified humans, for curious minds.{" "}
            {isWorldApp ? "Sign in to get started." : "Experience the full app in World App."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isWorldApp && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Development Mode:</strong> For the full experience with World ID verification and payments, open
                this app in World App.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Wallet className="h-4 w-4 text-primary" />
              <span>{isWorldApp ? "Sign in with World ID" : "Demo sign in"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>{isWorldApp ? "Verify your humanity" : "Mock verification available"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Read and publish stories</span>
            </div>
            {!isWorldApp && (
              <div className="flex items-center gap-3 text-sm">
                <Smartphone className="h-4 w-4 text-primary" />
                <span>Open in World App for full features</span>
              </div>
            )}
          </div>

          <Button onClick={login} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? "Signing in..." : isWorldApp ? "Sign In" : "Try Demo"}
          </Button>

          {!isWorldApp && (
            <p className="text-xs text-muted-foreground text-center">
              This is a demo version. Download World App to experience real World ID verification and payments.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
