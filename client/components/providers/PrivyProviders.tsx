"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId="cmh290xmn007ekv0cbcc0f69t"
        clientId="client-WY6SHQBC5WujGNkTGewv6yT99CFvakhtE7YBDZ4LaUuKf"
        // clientId="2qJVoSRuuT3PGsh9n6Lv19wmg2pD4MihN6hCSKj5Q5vxc2dZATJi2h2GVYTSQn1Wz5n3kfaMEw4UcACK9KfGEb9y"
        config={{
          appearance: {
            theme: "dark",
            walletChainType: "solana-only",
            walletList: [
              "detected_solana_wallets",
              "detected_wallets",
              "phantom",
              "metamask",
            ],
          },
          embeddedWallets: {
            solana: {
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
}
