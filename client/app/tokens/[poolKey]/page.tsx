import { TokenDetails } from "@/components/tokens/token/token-details";
import SwapContainer from "@/components/tokens/swap/swap-container";
import BackButton from "@/components/BackButton";
import { TokenChart } from "@/components/tokens/token/token-chart";
import { HoldersTradesTable } from "@/components/tokens/token/holders-trades-table";
import { TokenInfoCard } from "@/components/tokens/token/token-info-card";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ poolKey: string }>;
}) {
  const { poolKey } = await params;

  return (
    <div className="mx-4 relative uppercase">
      <BackButton />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:divide-x lg:items-start">
        <div className="lg:col-span-2 gap-4 flex flex-col border">
          <TokenDetails tokenId={poolKey} />
          <TokenChart tokenId={poolKey} />
          <HoldersTradesTable tokenId={poolKey} />
        </div>
        <div className="lg:col-span-1 sticky top-20 self-start space-y-4 border">
          <SwapContainer poolKey={poolKey} />
          <TokenInfoCard tokenId={poolKey} />
        </div>
      </div>
    </div>
  );
}
