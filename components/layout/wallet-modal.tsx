"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchSolBalance } from "@/lib/actions";

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
  const { connection } = useConnection();

  const { data: solBalance, isLoading: balanceLoading } = useQuery({
    enabled: !!publicKey,
    queryKey: ["sol-balance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return 0;
      return await fetchSolBalance(connection, publicKey);
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

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
            <div className="flex items-center gap-3 p-3 bg-muted rounded-full">
              {wallet.adapter.icon && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="size-14 rounded-full"
                />
              )}
              <span className="font-medium">{wallet.adapter.name}</span>
            </div>
          )}

          {publicKey && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                <span className="flex-1 truncate">{publicKey.toString()}</span>
              </div>
            </div>
          )}

          {publicKey && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Balance</p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
                {balanceLoading ? (
                  <span className="text-muted-foreground">Loading...</span>
                ) : (
                  <span className="font-medium">{solBalance?.toFixed(4)} SOL</span>
                )}
              </div>
            </div>
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
