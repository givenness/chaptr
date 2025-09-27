import { NextRequest, NextResponse } from 'next/server'

interface PaymentRequest {
  storyId: string
  authorId: string
  amount: string
  token: string
  message?: string
}

// In-memory storage for demo - in production, use a database
const pendingPayments = new Map<string, PaymentRequest & { id: string, timestamp: number }>()

export async function POST(req: NextRequest) {
  try {
    const { storyId, authorId, amount, token, message } = (await req.json()) as PaymentRequest

    // Validate input
    if (!storyId || !authorId || !amount || !token) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount < 0.1 || numAmount > 100) {
      return NextResponse.json({
        error: 'Invalid amount. Must be between 0.1 and 100'
      }, { status: 400 })
    }

    // Generate unique payment ID
    const paymentId = crypto.randomUUID().replace(/-/g, '')

    // Store payment details for later verification
    pendingPayments.set(paymentId, {
      id: paymentId,
      storyId,
      authorId,
      amount,
      token,
      message,
      timestamp: Date.now()
    })

    console.log('Payment initiated:', {
      id: paymentId,
      storyId,
      authorId,
      amount,
      token
    })

    return NextResponse.json({
      id: paymentId,
      status: 'initiated'
    })

  } catch (error) {
    console.error('Error initiating payment:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Helper function to get payment details (for confirm-payment endpoint)
export function getPaymentById(id: string) {
  return pendingPayments.get(id)
}

// Helper function to remove payment after confirmation
export function removePayment(id: string) {
  return pendingPayments.delete(id)
}