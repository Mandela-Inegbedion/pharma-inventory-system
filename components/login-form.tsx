"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(username, password)
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const fillDemoAccount = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
  }

  const copyCredentials = async (demoUsername: string, demoPassword: string, roleLabel: string) => {
    try {
      await navigator.clipboard.writeText(`Username: ${demoUsername}\nPassword: ${demoPassword}`)
      toast({
        title: "Credentials copied",
        description: `${roleLabel} credentials copied to clipboard`,
      })
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not access clipboard. Please copy manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">Enter your details to access the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-medium mb-3">Demo Accounts</p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => fillDemoAccount("admin", "password")}
              >
                Admin (admin / password)
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => copyCredentials("admin", "password", "Admin")}
              >
                Copy
              </Button>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => fillDemoAccount("manager", "password")}
              >
                Inventory Manager (manager / password)
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => copyCredentials("manager", "password", "Inventory Manager")}
              >
                Copy
              </Button>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => fillDemoAccount("clerk", "password")}
              >
                Sales Clerk (clerk / password)
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => copyCredentials("clerk", "password", "Sales Clerk")}
              >
                Copy
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Demo credentials for local testing only.</p>
        </div>
      </CardContent>
    </Card>
  )
}
