import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TokenCardProps {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  marketCap: string;
  volume: string;
  progress: number;
}

export function TokenCard({
  id,
  name,
  symbol,
  description,
  image,
  marketCap,
  volume,
  progress,
}: TokenCardProps) {
  return (
    <Link href={`/tokens/${id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={image}
                alt={name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg truncate">{name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {symbol}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="font-semibold">{marketCap}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Volume 24h</p>
              <p className="font-semibold">{volume}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
