import { TokenDetails } from "@/components/tokens/token-details";
import { SwapSection } from "@/components/tokens/swap-section";
import GraduatedSwap from "@/components/tokens/graduated-swap";

export default async function TokenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="max-w-7xl px-6 mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GraduatedSwap />
          <TokenDetails tokenId={id} />
        </div>
        <div className="lg:col-span-1">
          <SwapSection tokenId={id} />
        </div>
      </div>
    </div>
  );
}
