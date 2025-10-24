import Pattern from "@/components/landing/pattern";
import { TokenGrid } from "@/components/tokens/token-grid";

export default function TokensPage() {
  return (
    <div className="relative max-w-7xl border-x border-b mx-auto md:px-0 px-4">
      <Pattern/>
      <TokenGrid />
    </div>
  );
}
