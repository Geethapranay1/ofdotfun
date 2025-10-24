import { NextResponse } from 'next/server';
import { markVanityPairAsUsed } from '@/lib/db';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';

type SendTransactionRequest = {
  signedTransaction: string;
  mint?: string;
  userWallet?: string;
  tokenName?: string;
  tokenTicker?: string;
  vid?: string;
};

export async function POST(req: Request) {
  try {
    const { signedTransaction, mint, userWallet, vid } =
      (await req.json()) as SendTransactionRequest;

    if (!signedTransaction) {
      return NextResponse.json(
        { error: 'Missing signed transaction' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL!,
      'confirmed'
    );
    const transaction = Transaction.from(
      Buffer.from(signedTransaction, 'base64')
    );

    const txSignature = await connection.sendRawTransaction(
      transaction.serialize(),
      { skipPreflight: true, maxRetries: 3 }
    );

    await connection.confirmTransaction(txSignature, 'confirmed');
    console.log('✅ Tx confirmed:', txSignature);
    let poolData: any = null;
    if (mint && userWallet) {
      const dbc = new DynamicBondingCurveClient(connection, 'confirmed');
      const baseMint = new PublicKey(mint);
      const foundPool = await dbc.state.getPoolByBaseMint(baseMint);
      if (foundPool) {
        console.log(
          'Found pool in background:',
          foundPool.publicKey.toString()
        );

        if (foundPool) {
          const poolAddressStr = (foundPool as any).publicKey.toString();
          const poolState = await dbc.state.getPool(
            new PublicKey(poolAddressStr)
          );

          poolData = {
            poolAddress: poolAddressStr,
            tokenMint: mint,
            creator: userWallet,
            signature: txSignature,
          };
        }
      }
    }

    if (vid) {
      await markVanityPairAsUsed(vid);
      console.log('Marked vanity pair as used for vid:', vid);
    }

    return NextResponse.json({
      success: true,
      signature: txSignature,
      poolData,
    });
  } catch (error: any) {
    console.error('Transaction error:', error);

    if (error.message?.includes('already been processed')) {
      return NextResponse.json(
        { error: 'Transaction already sent. Use a new transaction.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
