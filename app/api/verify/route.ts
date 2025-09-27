import { NextRequest, NextResponse } from "next/server";
import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;

    console.log('Verification request received:', { action, signal, payload });

    const app_id = process.env.APP_ID as `app_${string}`;

    if (!app_id) {
      console.error('APP_ID environment variable not set');
      return NextResponse.json({
        error: 'APP_ID not configured',
        status: 500
      });
    }

    console.log('Using app_id:', app_id);

    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    )) as IVerifyResponse;

    console.log('Cloud proof verification result:', verifyRes);

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      console.log('Verification successful!');
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      console.log('Verification failed:', verifyRes);
      return NextResponse.json({ verifyRes, status: 400 });
    }
  } catch (error) {
    console.error('Error in verify endpoint:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    });
  }
}
