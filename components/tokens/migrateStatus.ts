import { TOKEN_GRADUATION_ADDRESS, TOKEN_POOL_ADDRESS } from "@/app/constant";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";
import { Connection } from "@solana/web3.js";
import { toast } from "sonner";
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!, {
  commitment: "confirmed",
});

export const getMigrateStatus = async () => {
  const client = new DynamicBondingCurveClient(connection, "confirmed");
  const cpAmm = new CpAmm(connection);

  const gPoolState = await cpAmm.fetchPoolState(TOKEN_GRADUATION_ADDRESS);
  console.log("Pool State:", gPoolState);

  if (!gPoolState) {
    toast.error("Pool state not found");
    throw new Error("Pool state not found");
  }

  const nonGPoolState = await client.state.getPool(TOKEN_POOL_ADDRESS);
  if (!nonGPoolState) {
    console.error("Pool doesn't exist yet!");
  }
  return {
    cpAmm,
    client,
    nonGPoolState,
    gPoolState,
    migrationStatus: nonGPoolState ? nonGPoolState.isMigrated : null,
  };
};
