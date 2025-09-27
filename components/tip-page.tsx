"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { ArrowLeft, DollarSign, Heart, Coins, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/currency"

interface TipPageProps {
  storyId: string
}

const mockStory = {
  id: "1",
  title: "The Last Library",
  author: "maya_writes",
  authorId: "author_1",
  coverImage: "/book-cover-dystopian-library.jpg",
  totalTips: 12.5,
}

const PRESET_AMOUNTS = [0.5, 1, 2, 5, 10]
const MIN_TIP_AMOUNT = 0.1

// Mock geo-restriction check (in real app, this would come from server)
const isPaymentsEnabled = () => {
  // Simulate geo-restriction for Indonesia and Philippines
  const restrictedCountries = ["ID", "PH"]
  // In real app, you'd get this from user's location or server
  const userCountry = "US" // Mock country
  return !restrictedCountries.includes(userCountry)
}

export function TipPage({ storyId }: TipPageProps) {
  const { user, pay } = useAuth()
  const router = useRouter()
  const [selectedToken, setSelectedToken] = useState<"WLD" | "USDC">("WLD")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const paymentsEnabled = isPaymentsEnabled()

  if (!user) {
    return <AuthPrompt />
  }

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString())
    setCustomAmount("")
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    setAmount(value)
  }

  const getCurrentAmount = () => {
    return Number.parseFloat(customAmount || amount || "0")
  }

  const isValidAmount = () => {
    const currentAmount = getCurrentAmount()
    return currentAmount >= MIN_TIP_AMOUNT && currentAmount <= 100
  }

  const handleTip = async () => {
    if (!isValidAmount() || !paymentsEnabled) return

    setIsProcessing(true)
    try {
      const tipAmount = getCurrentAmount()

      const result = await pay({
        to: mockStory.authorId, // In real app, this would be the author's wallet address
        tokens: [
          {
            symbol: selectedToken,
            token_amount: tipAmount.toString(),
          },
        ],
        description: `Tip for "${mockStory.title}" by ${mockStory.author}`,
        reference: `tip_${storyId}_${Date.now()}`,
      })

      if (result.status === "success") {
        // In real app, you'd verify the transaction on your backend
        console.log("Tip successful:", result)
        alert(`Successfully tipped ${formatCurrency(tipAmount, selectedToken)} to ${mockStory.author}!`)
        router.push(`/story/${storyId}`)
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Tip failed:", error)
      alert("Failed to process tip. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!paymentsEnabled) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex items-center justify-between p-4">
            <Link
              href={`/story/${storyId}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Story</span>
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Tipping Not Available</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                    Tipping is currently not available in your region due to local regulations. You can still show your
                    support by upvoting and commenting on stories.
                  </p>
                  <Link href={`/story/${storyId}`}>
                    <Button
                      variant="outline"
                      className="border-amber-300 text-amber-800 hover:bg-amber-100 bg-transparent"
                    >
                      Back to Story
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Link
            href={`/story/${storyId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Story</span>
          </Link>
          <h1 className="font-serif font-semibold text-lg">Tip Author</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Story Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <img
                src={
                  mockStory.coverImage || "/placeholder.svg?height=88&width=64&query=minimal elegant book cover design"
                }
                alt={mockStory.title}
                className="w-16 h-22 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-serif font-semibold text-lg text-balance mb-1">{mockStory.title}</h2>
                <p className="text-muted-foreground mb-2">by {mockStory.author}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{mockStory.totalTips} WLD total tips received</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-serif">Choose Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedToken("WLD")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedToken === "WLD" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">WLD</p>
                    <p className="text-sm text-muted-foreground">Worldcoin</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedToken("USDC")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedToken === "USDC" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">USDC</p>
                    <p className="text-sm text-muted-foreground">USD Coin</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Amount Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-serif">Tip Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preset Amounts */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Select</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetAmount(preset)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      amount === preset.toString() && !customAmount
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="custom-amount" className="text-sm font-medium mb-2 block">
                Custom Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="pl-10"
                  min={MIN_TIP_AMOUNT}
                  max={100}
                  step={0.1}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Minimum tip: ${MIN_TIP_AMOUNT} • Maximum: $100</p>
            </div>

            {/* Current Selection */}
            {getCurrentAmount() > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">You're tipping:</span>
                  <span className="font-semibold">{formatCurrency(getCurrentAmount(), selectedToken)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optional Message */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-serif">Message (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Leave a message for the author..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-input rounded-md resize-none bg-background text-sm"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">{message.length}/200 characters</p>
          </CardContent>
        </Card>

        {/* Tip Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleTip} disabled={!isValidAmount() || isProcessing} className="w-full" size="lg">
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Tip {formatCurrency(getCurrentAmount(), selectedToken)}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Tips are processed securely through World App. Gas fees are sponsored.
            </p>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white font-bold">i</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">About Tipping</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Tips go directly to authors to support their creative work. All transactions are verified on-chain and
                  gas fees are sponsored by the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
