import { TokenDetails } from "@/components/tokens/token/token-details";
import SwapContainer from "@/components/tokens/swap/swap-container";
import { TokenChart } from "@/components/tokens/token/token-chart";
import { HoldersTradesTable } from "@/components/tokens/token/holders-trades-table";
import { TokenInfoCard } from "@/components/tokens/token/token-info-card";
import { MobileSwapModal } from "@/components/tokens/swap/mobile-swap-modal";
import { RecentlyOpened } from "@/components/tokens/token/recently-opened";
import { TokenPageWrapper } from "@/components/tokens/token/token-page-wrapper";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ poolKey: string }>;
}) {
  const { poolKey } = await params;

  return (
    <TokenPageWrapper tokenId={poolKey}>
        <RecentlyOpened currentTokenId={poolKey} />
      <div className="relative uppercase">

        <div className="lg:hidden pb-24">
          <div className="border-b">
            <TokenDetails tokenId={poolKey} />
          </div>
          <div className="border-b">
            <TokenChart tokenId={poolKey} />
          </div>
          <div className="border-b">
            <HoldersTradesTable tokenId={poolKey} />
          </div>
          <div className="border-b">
            <TokenInfoCard tokenId={poolKey} />
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 lg:divide-x h-[calc(100vh-7.5rem)] overflow-hidden">
          <div className="flex col-span-1 flex-col border-l border-t overflow-auto hide-scrollbar">
            <TokenDetails tokenId={poolKey} />
            <TokenInfoCard tokenId={poolKey} />
          </div>
          <div className="col-span-2 flex flex-col overflow-hidden">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65} minSize={30}>
                <div className="h-full overflow-auto hide-scrollbar">
                  <TokenChart tokenId={poolKey} />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={35} minSize={30}>
                <div className="h-full overflow-auto hide-scrollbar">
                  <HoldersTradesTable tokenId={poolKey} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
          <div className="col-span-1 border overflow-auto">
            <SwapContainer poolKey={poolKey} />
          </div>
        </div>

        <MobileSwapModal tokenName={"tokenName"} tokenId={poolKey} />
      </div>
    </TokenPageWrapper>
  );
}
