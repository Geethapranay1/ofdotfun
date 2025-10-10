import { TokenDetails } from "@/components/tokens/token-details";
import SwapContainer from "@/components/tokens/swap-container";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ poolKey: string }>;
}) {
  const { poolKey } = await params;

  return (
    <div className="max-w-7xl border-x mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y divide-x">
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
