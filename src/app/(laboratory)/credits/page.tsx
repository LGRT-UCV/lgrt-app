import Credits from "@/components/feedback/credits";
import { credits } from "@/lib/constants";

export default function CreditsPage() {
  return (
    <div className="flex h-full items-center">
      <Credits people={credits} />
    </div>
  );
}
