"use client";

import Credits from "@/components/feedback/credits";
import { credits } from "@/lib/constants";

export default function MainCredits() {
  return <Credits people={credits} />;
}
