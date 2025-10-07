import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TokenCardProps {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  marketCap: string;
  volume: string;
  progress: number;
  graduated?: boolean;
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
  graduated = false,
}: TokenCardProps) {
  return (
    <Link href={`/tokens/${id}`}>
      <div className="group relative overflow-hidden rounded-4xl p-6 shadow-2xl transition-all duration-300 hover:shadow-cyan-500/20 cursor-pointer h-full border border-neutral-900">
        <div
          className={`absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl transition-all duration-700 ${
            graduated
              ? "bg-amber-500/10 group-hover:bg-amber-500/15"
              : "bg-cyan-500/10 group-hover:bg-cyan-500/15"
          }`}
        />

        <div className="relative flex flex-col gap-2">
          <div className="flex items-start justify-between border-neutral-800 pb-5">
            <div className="flex items-center gap-3">
              <div
                className={`fle w-full size-25 items-center justify-center rounded-lg overflow-hidden ${
                  graduated ? "bg-amber-400/10" : "bg-cyan-400/10"
                }`}
              >
                <Image
                  src={image}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full transition-transform group-hover:scale-110"
                />
              </div>
              <div className="w-full">
                <p
                  className={`font-semibold ${
                    graduated ? "text-amber-400" : "text-cyan-400"
                  }`}
                >
                  {symbol}
                </p>
                <p className="text-xs text-neutral-500 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
            {graduated && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-400 text-white border-0 shadow-lg">
                Graduated
              </Badge>
            )}
          </div>

          <div>
            <h3
              className={`text-2xl font-semibold ${
                graduated ? "text-amber-400" : "text-neutral-100"
              }`}
            >
              {name}
            </h3>
          </div>

          <div className="flex divide-x divide-neutral-800">
            <div className="flex-1 pr-4">
              <p className="text-xs font-medium text-neutral-500">Market Cap</p>
              <p
                className={`text-xl font-semibold ${
                  graduated ? "text-amber-400" : "text-neutral-100"
                }`}
              >
                {marketCap}
              </p>
            </div>
            <div className="flex-1 pl-4">
              <p className="text-xs font-medium text-neutral-500">Volume</p>
              <p
                className={`text-xl font-semibold ${
                  graduated ? "text-amber-400" : "text-neutral-100"
                }`}
              >
                {volume}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-neutral-500">
                Bonding Progress
              </p>
              <p
                className={`text-sm font-semibold ${
                  graduated ? "text-amber-400" : "text-cyan-400"
                }`}
              >
                {progress}%
              </p>
            </div>
            <div className="relative h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  graduated
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-300"
                }`}
                style={{ width: `${progress}%` }}
              >
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full shadow-lg ${
                    graduated
                      ? "bg-amber-400 shadow-amber-400/50"
                      : "bg-cyan-400 shadow-cyan-400/50"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
