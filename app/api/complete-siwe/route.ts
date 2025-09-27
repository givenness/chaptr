import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MiniAppWalletAuthSuccessPayload,
  verifySiweMessage,
} from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const { payload, nonce } = (await req.json()) as IRequestPayload;

    console.log('SIWE verification request received:', { nonce, payload });

    // Verify the nonce matches the one we created earlier
    const storedNonce = cookies().get("siwe")?.value;
    console.log('Stored nonce:', storedNonce, 'Received nonce:', nonce);

    if (nonce != storedNonce) {
      console.log('Nonce mismatch');
      return NextResponse.json({
        status: "error",
        isValid: false,
        message: "Invalid nonce",
      });
    }

    try {
      const validMessage = await verifySiweMessage(payload, nonce);
      console.log('SIWE message verification result:', validMessage);

      if (validMessage.isValid) {
        // Clear the nonce after successful verification
        cookies().delete("siwe");

        // Here you could save the user session to a database
        console.log('User authenticated successfully:', payload.address);
      }

      return NextResponse.json({
        status: "success",
        isValid: validMessage.isValid,
      });
    } catch (error: any) {
      console.error('Error verifying SIWE message:', error);
      return NextResponse.json({
        status: "error",
        isValid: false,
        message: error.message,
      });
    }
  } catch (error: any) {
    console.error('Error in complete-siwe endpoint:', error);
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: "Internal server error",
    });
  }
};