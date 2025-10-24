import { TokenDetails } from "@/components/tokens/token/token-details";
import SwapContainer from "@/components/tokens/swap/swap-container";
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
      {/* <BackButton /> */}
      <>
        <div className="absolute top-0 -left-4 w-4 h-full pointer-events-none border-l bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)] border-b" />
        <div className="absolute top-0 -right-4 w-4 h-full pointer-events-none border-l bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)] border-b" />
      </>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:divide-x lg:items-start">
        <div className="lg:col-span-2 flex flex-col border">
          <TokenDetails tokenId={poolKey} />
          <div className="w-full h-4 pointer-events-none border-0 bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
          <TokenChart tokenId={poolKey} />
          <HoldersTradesTable tokenId={poolKey} />
        </div>
        <div className="lg:col-span-1 sticky top-20 self-start border">
          <div className="absolute top-0 -left-4 w-4 h-full pointer-events-none bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)] border-b" />
          <SwapContainer poolKey={poolKey} />
          <div className="w-full h-4 pointer-events-none bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
          <TokenInfoCard tokenId={poolKey} />
        </div>
      </div>
    </div>
  );
}
