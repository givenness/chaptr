import { NextRequest, NextResponse } from 'next/server'
import { storePayment } from '@/lib/payment-storage'

interface PaymentRequest {
  storyId: string
  authorId: string
  amount: string
  token: string
  message?: string
}

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
    storePayment(paymentId, {
      storyId,
      authorId,
      amount,
      token,
      message
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

