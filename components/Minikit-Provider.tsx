"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID);
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
