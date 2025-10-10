import { NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  sendAndConfirmRawTransaction,
  Transaction,
} from "@solana/web3.js";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";

export async function POST(req: Request) {
  try {
    const { signedTransaction, mint, userWallet } = await req.json();

    if (!signedTransaction) {
      return NextResponse.json(
        { error: "Missing signed transaction" },
        { status: 400 }
      );
    }

    const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
    if (!RPC_URL) {
      return NextResponse.json(
        { error: "RPC_URL is not defined in environment variables" },
        { status: 500 }
      );
    }

    const connection = new Connection(RPC_URL, "confirmed");
    const transaction = Transaction.from(
      Buffer.from(signedTransaction, "base64")
    );

    const raw = transaction.serialize();
    const txSignature = await connection.sendRawTransaction(raw, {
      skipPreflight: true,
      maxRetries: 5,
    });
    
    await connection.confirmTransaction(txSignature, "confirmed");
    
    let poolData: any = null;
    if (mint && userWallet) {
      try {
        console.log("🔍 Immediately fetching DBC pool data for mint:", mint);
        const dbc = new DynamicBondingCurveClient(
          new Connection(RPC_URL, "confirmed"),
          "confirmed"
        );

        let poolAddress: string | null = null;
        let poolState: any = null;

        for (let attempt = 0; attempt < 12 && !poolAddress; attempt++) {
          try {
            const allPools = await dbc.state.getPools();
            const foundPool = allPools.find((p: any) => {
              const baseMint = p.account?.baseMint || p.baseMint;
              return baseMint?.toString?.() === mint;
            });

            if (foundPool) {
              const pubkey = (foundPool as any).publicKey;
              if (pubkey?.toString) {
                const poolAddressStr = pubkey.toString();
                poolAddress = poolAddressStr;
                poolState = await dbc.state.getPool(
                  new PublicKey(poolAddressStr)
                );
                console.log("Found pool immediately:", poolAddress);
                break;
              }
            }

            if (!poolAddress && attempt === 0) {
              try {
                const parsedTx = await new Connection(
                  RPC_URL,
                  "confirmed"
                ).getTransaction(txSignature, {
                  maxSupportedTransactionVersion: 0,
                } as any);

                if (parsedTx?.meta) {
                  const accountKeys = parsedTx.transaction.message.accountKeys;
                  for (let i = 0; i < accountKeys.length; i++) {
                    const preBalance = parsedTx.meta.preBalances[i];
                    const postBalance = parsedTx.meta.postBalances[i];
                    if (
                      preBalance === 0 &&
                      postBalance > 1000000 &&
                      postBalance < 10000000
                    ) {
                      const potentialPool =
                        typeof accountKeys[i] === "string"
                          ? accountKeys[i]
                          : (accountKeys[i] as any).pubkey;
                      try {
                        const testState = await dbc.state.getPool(
                          new PublicKey(potentialPool)
                        );
                        if (testState.baseMint.toString() === mint) {
                          poolAddress = potentialPool;
                          poolState = testState;
                          console.log(
                            "Found pool via transaction parsing:",
                            poolAddress
                          );
                          break;
                        }
                      } catch {}
                    }
                  }
                }
              } catch (e) {
                console.log(
                  "Transaction parsing failed, continuing with polling..."
                );
              }
            }

            if (!poolAddress && attempt < 11) {
              await new Promise((r) => setTimeout(r, 1000));
              console.log(`Pool search attempt ${attempt + 1}/12...`);
            }
          } catch (e) {
            console.warn("Pool search attempt failed:", e);
            if (attempt < 11) await new Promise((r) => setTimeout(r, 1000));
          }
        }

        if (poolAddress && poolState) {
          poolData = {
            poolAddress,
            tokenMint: mint,
            creator: userWallet,
            createdAt: new Date().toISOString(),
            configKey: process.env.POOL_CONFIG_KEY,
            signature: txSignature,
            quoteMint: poolState.quoteMint?.toString(),
            totalSupply: poolState.totalSupply?.toString(),
            virtualQuoteReserve: poolState.virtualQuoteReserve?.toString(),
            virtualTokenReserve: poolState.virtualTokenReserve?.toString(),
            activationTime: poolState.activationTime?.toNumber
              ? new Date(
                  poolState.activationTime.toNumber() * 1000
                ).toISOString()
              : null,
            migrationQuoteThreshold:
              poolState.migrationQuoteThreshold?.toString(),
          };

          console.log("Pool data collected:", poolData.poolAddress);
        }
      } catch (e) {
        console.warn("Failed to fetch immediate pool data:", e);
      }
    }

    return NextResponse.json({
      success: true,
      signature: txSignature,
      poolAddress: poolData.poolAddress,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}