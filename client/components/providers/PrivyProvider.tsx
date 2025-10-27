// "use client";

// import { PrivyProvider } from "@privy-io/react-auth";
// import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";


// export default function Providers({ children }: { children: React.ReactNode }) {
//   const queryClient = new QueryClient();
//   return (
//     <QueryClientProvider client={queryClient}>
//       <PrivyProvider
//         appId="cmh290xmn007ekv0cbcc0f69t"
//         clientId="client-WY6SHQBC5WujGNkTGewv6yT99CFvakhtE7YBDZ4LaUuKf"
//         config={{
//             externalWallets: {
//           solana: {
//             connectors: toSolanaWalletConnectors(),
//           },
//         },
//           appearance: {
//             walletChainType: "solana-only",
//             walletList: ["detected_solana_wallets", "detected_wallets"],
//           },
//           embeddedWallets: {
//             solana: {
//               createOnLogin: "users-without-wallets",
//             },
//           },
//           solana: {
//             rpcs: {
//               "solana:mainnet": {
//                 rpc: createSolanaRpc(
//                   process.env.NEXT_PUBLIC_RPC_URL!
//                 ),
//                 rpcSubscriptions: createSolanaRpcSubscriptions(
//                   process.env.NEXT_PUBLIC_RPC_URL?.replace("http", "ws")!
//                 ),
//               },
//               "solana:devnet": {
//                 rpc: createSolanaRpc(
//                   "https://devnet.helius-rpc.com/?api-key=a9af5820-b142-4aaa-9296-ba25637a13f0"
//                 ),
//                 rpcSubscriptions: createSolanaRpcSubscriptions(
//                   "wss://api.devnet.solana.com"
//                 ),
//               },
//             },
//           },
//         }}
//       >
//         {children}
//       </PrivyProvider>
//     </QueryClientProvider>
//   );
// }
