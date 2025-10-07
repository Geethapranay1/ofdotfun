import { ActivityTicker } from "@/components/layout/activity-ticker";
import { TokenGrid } from "@/components/tokens/token-grid";

export default function TokensPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">Explore Tokens</h1>
          <p className="text-muted-foreground text-lg">
            Discover and trade the latest meme tokens on TokunLunchpad
          </p>
        </div>
        <TokenGrid />
        <ActivityTicker/>
      </div>
    </div>
  );
}
