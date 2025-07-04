"use client";

import { useEffect } from "react";
import { checkAndAllocateCredits } from "@/actions/credits";

export default function CreditsInitializer({ user }) {
  useEffect(() => {
    // ✅ Only call if truly PATIENT
    if (user && user.role === "PATIENT") {
      checkAndAllocateCredits(user);
    }
  }, [user]);

  return null;
}
