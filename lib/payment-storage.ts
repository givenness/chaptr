interface PaymentRequest {
  storyId: string
  authorId: string
  amount: string
  token: string
  message?: string
}

// In-memory storage for demo - in production, use a database
const pendingPayments = new Map<string, PaymentRequest & { id: string, timestamp: number }>()

export function storePayment(id: string, payment: PaymentRequest) {
  pendingPayments.set(id, {
    id,
    ...payment,
    timestamp: Date.now()
  })
}

export function getPaymentById(id: string) {
  return pendingPayments.get(id)
}

export function removePayment(id: string) {
  return pendingPayments.delete(id)
}

export function clearExpiredPayments() {
  const now = Date.now()
  const expiration = 30 * 60 * 1000 // 30 minutes

  for (const [id, payment] of pendingPayments) {
    if (now - payment.timestamp > expiration) {
      pendingPayments.delete(id)
    }
  }
}