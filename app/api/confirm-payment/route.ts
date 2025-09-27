import { NextRequest, NextResponse } from 'next/server'
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload
}

export async function POST(req: NextRequest) {
  try {
    const { payload } = (await req.json()) as IRequestPayload

    console.log('Payment confirmation received:', payload)

    // Import the helper function from initiate-payment
    const { getPaymentById, removePayment } = await import('../initiate-payment/route')

    // Get the stored payment details using the reference ID
    const storedPayment = getPaymentById(payload.reference)

    if (!storedPayment) {
      console.error('Payment not found for reference:', payload.reference)
      return NextResponse.json({
        success: false,
        error: 'Payment reference not found'
      }, { status: 400 })
    }

    // Verify that the transaction reference matches what we initiated
    if (payload.reference !== storedPayment.id) {
      console.error('Payment reference mismatch:', {
        received: payload.reference,
        expected: storedPayment.id
      })
      return NextResponse.json({
        success: false,
        error: 'Payment reference mismatch'
      }, { status: 400 })
    }

    // Get environment variables
    const appId = process.env.APP_ID
    const devPortalApiKey = process.env.DEV_PORTAL_API_KEY

    if (!appId) {
      console.error('APP_ID environment variable not set')
      return NextResponse.json({
        success: false,
        error: 'Server configuration error'
      }, { status: 500 })
    }

    // For demo purposes, if no DEV_PORTAL_API_KEY is set, we'll optimistically accept
    if (!devPortalApiKey) {
      console.warn('DEV_PORTAL_API_KEY not set, accepting payment optimistically')

      // Remove the payment from pending list
      removePayment(payload.reference)

      // Here you would typically:
      // 1. Update the story's tip total in your database
      // 2. Record the tip transaction
      // 3. Notify the author
      console.log('Payment accepted optimistically:', {
        reference: payload.reference,
        transactionId: payload.transaction_id,
        amount: storedPayment.amount,
        token: storedPayment.token,
        from: 'tipper',
        to: storedPayment.authorId,
        storyId: storedPayment.storyId,
        message: storedPayment.message
      })

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully'
      })
    }

    // Verify the payment through Developer Portal API
    try {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${appId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${devPortalApiKey}`,
          },
        }
      )

      if (!response.ok) {
        console.error('Failed to verify transaction:', response.status, response.statusText)
        return NextResponse.json({
          success: false,
          error: 'Failed to verify transaction'
        }, { status: 500 })
      }

      const transaction = await response.json()
      console.log('Transaction verification result:', transaction)

      // Check if the transaction is valid and not failed
      if (transaction.reference === payload.reference && transaction.status !== 'failed') {
        // Remove the payment from pending list
        removePayment(payload.reference)

        // Here you would typically:
        // 1. Update the story's tip total in your database
        // 2. Record the tip transaction
        // 3. Notify the author
        console.log('Payment verified and processed:', {
          reference: payload.reference,
          transactionId: payload.transaction_id,
          amount: storedPayment.amount,
          token: storedPayment.token,
          from: 'tipper',
          to: storedPayment.authorId,
          storyId: storedPayment.storyId,
          message: storedPayment.message,
          status: transaction.status
        })

        return NextResponse.json({
          success: true,
          message: 'Payment verified and processed successfully'
        })
      } else {
        console.error('Transaction verification failed:', {
          expectedReference: payload.reference,
          actualReference: transaction.reference,
          status: transaction.status
        })

        return NextResponse.json({
          success: false,
          error: 'Transaction verification failed'
        }, { status: 400 })
      }

    } catch (verifyError) {
      console.error('Error verifying transaction:', verifyError)
      return NextResponse.json({
        success: false,
        error: 'Failed to verify transaction'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in confirm-payment endpoint:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}