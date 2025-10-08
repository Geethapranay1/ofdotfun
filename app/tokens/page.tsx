import { TokenGrid } from "@/components/tokens/token-grid";

export default function TokensPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">
            Discover and trade the latest meme tokens
          </p>
        </div>
        <TokenGrid />
      </div>
    </div>
  );
}
