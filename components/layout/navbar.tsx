"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletError } from "@solana/wallet-adapter-base";
import { toast } from "sonner";
import WalletModal from "./wallet-modal";
import Image from "next/image";

export function Navbar() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [hasShownInitialModal, setHasShownInitialModal] = useState(false);
  const [isManualConnection, setIsManualConnection] = useState(false);

  const { connected, publicKey, connect, disconnect, connecting, wallet } =
    useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    const fetchWalletAddress = async () => {
      let addressStr: string | undefined;
      if (publicKey) {
        addressStr = publicKey.toString();
      }

      setWalletAddress(addressStr || "");
    };

    fetchWalletAddress();
  }, [publicKey]);

  useEffect(() => {
    console.log(publicKey);
    if (connected && isManualConnection && !hasShownInitialModal) {
      setShowWalletModal(true);
      setHasShownInitialModal(true);
      setIsManualConnection(false);
    }
  }, [connected, isManualConnection, hasShownInitialModal]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowWalletModal(false);
      setHasShownInitialModal(false);
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const handleWalletClick = async () => {
    if (connected) {
      setShowWalletModal(true);
    } else {
      setIsManualConnection(true);
      try {
        setVisible(true);
      } catch (error) {
        console.error("Wallet connection error:", error);
        toast.error("Failed to open wallet selection", {
          description: "Please try again",
          duration: 4000,
        });
        setIsManualConnection(false);
      }
    }
  };

  useEffect(() => {
    if (wallet && wallet.adapter) {
      const handleError = (error: WalletError) => {
        console.error("Wallet error:", error);

        if (error.name === "WalletNotSelectedError") {
          setIsManualConnection(false);
          return;
        }

        if (error.name === "WalletNotConnectedError") {
          toast.error("Wallet connection was rejected", {
            description: "Please try connecting again",
            duration: 4000,
          });
          setIsManualConnection(false);
          return;
        }

        toast.error("Wallet connection failed", {
          description: error.message || "Please try again",
          duration: 4000,
        });
        setIsManualConnection(false);
      };

      wallet.adapter.on("error", handleError);

      return () => {
        wallet.adapter.off("error", handleError);
      };
    }
  }, [wallet]);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getButtonText = () => {
    if (connected && walletAddress) {
      return formatAddress(walletAddress);
    }

    if (connecting) {
      return "Connecting...";
    }

    return "Connect Wallet";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/45 backdrop-blur-md border- border-primary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/tokens" className="flex items-center gap-2 group">
              <Image
                src="/image.png"
                alt="Tokun.Lunchpad"
                width={32}
                height={32}
                className="scale-145 group-hover:scale-150 transition-transform"
              />
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/tokens"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Tokens
              </Link>
              <Link
                href="/create"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Create
              </Link>
              <ThemeToggle />
              <Button
                onClick={connecting ? undefined : handleWalletClick}
                disabled={connecting}
              >
                {getButtonText()}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <WalletModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        disconnect={handleDisconnect}
      />
    </>
  );
}
