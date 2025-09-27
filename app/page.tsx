"use client";

import { HomeFeed } from "@/components/home-feed";
import { useAuth } from "@/components/auth-wrapper";

export default function HomePage() {
  return (
    <div>
      <HomeFeed />
    </div>
  );
}