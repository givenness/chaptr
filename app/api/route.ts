import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET() {
  try {
    // Generate a cryptographically secure random nonce
    const nonce = randomBytes(32).toString("hex")

    return NextResponse.json({ nonce })
  } catch (error) {
    console.error("Error generating nonce:", error)
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 })
  }
}
