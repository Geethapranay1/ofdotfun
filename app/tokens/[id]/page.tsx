import { TokenDetails } from "@/components/tokens/token-details";
import SwapContainer from "@/components/tokens/swap-container";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ poolKey: string }>;
}) {
  const { poolKey } = await params;

  return (
    <div className="max-w-7xl px-6 mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TokenDetails tokenId={poolKey} />
        </div>
        <div className="lg:col-span-1">
          <SwapContainer poolKey={poolKey} />
        </div>
      </div>
    </div>
  );
}
