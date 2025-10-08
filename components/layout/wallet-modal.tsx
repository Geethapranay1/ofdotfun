"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  disconnect: () => void;
}

export default function WalletModal({
  open,
  onClose,
  disconnect,
}: WalletModalProps) {
  const { publicKey, wallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !open) return;

      setIsLoadingBalance(true);
      try {
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
          "confirmed"
        );
        const balanceInLamports = await connection.getBalance(publicKey);
        setBalance(balanceInLamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(null);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [publicKey, open]);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast.success("Address copied to clipboard");
    }
  };

  const handleViewExplorer = () => {
    if (publicKey) {
      window.open(
        `https://solscan.io/account/${publicKey.toString()}`,
        "_blank"
      );
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wallet Connected</DialogTitle>
          <DialogDescription>
            Your wallet is successfully connected
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {wallet && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {wallet.adapter.icon && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-8 h-8"
                />
              )}
              <span className="font-medium">{wallet.adapter.name}</span>
            </div>
          )}

          {publicKey && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Balance</p>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-lg">
                    {isLoadingBalance
                      ? "Loading..."
                      : balance !== null
                      ? `${balance.toFixed(4)} SOL`
                      : "Unable to load"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                  <span className="flex-1 truncate">
                    {publicKey.toString()}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCopyAddress}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleViewExplorer}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleDisconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
