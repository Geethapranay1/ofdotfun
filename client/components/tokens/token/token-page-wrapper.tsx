"use client";

import React from "react";
import { addRecentToken } from "./recently-opened";

interface TokenPageWrapperProps {
  tokenId: string;
  children: React.ReactNode;
}

const getTokenData = (id: string) => {
  const tokens = {
    "1": {
      id: "1",
      name: "Solana Cat",
      symbol: "SOLCAT",
      image: "https://i.pinimg.com/736x/78/63/e7/7863e7b608fd2bdff73e52b8ff5ca8d1.jpg",
      price: "$0.0025",
    },
    "2": {
      id: "2",
      name: "Doge Killer",
      symbol: "DOGEK",
      image: "https://i.pinimg.com/736x/85/75/5f/85755fa2666278cc3765c2308891b410.jpg",
      price: "$0.0018",
    },
    "3": {
      id: "3",
      name: "Pepe Coin",
      symbol: "PEPE",
      image: "https://i.pinimg.com/736x/86/a5/8b/86a58b9342e9fc3414e5ce8db6fa5d87.jpg",
      price: "$0.0032",
    },
    "4": {
      id: "4",
      name: "Safe Moon",
      symbol: "SAFEM",
      image: "https://i.pinimg.com/736x/8b/ce/29/8bce29d76ea2f9d6f1366a38a626a618.jpg",
      price: "$0.00095",
    },
    "5": {
      id: "5",
      name: "Diamond Hands",
      symbol: "DIAMOND",
      image: "https://i.pinimg.com/1200x/47/58/e1/4758e16f6ee5601e1393f66fb7247755.jpg",
      price: "$0.0014",
    },
    "6": {
      id: "6",
      name: "Rocket Fuel",
      symbol: "ROCKET",
      image: "https://i.pinimg.com/1200x/89/a1/c3/89a1c3821cb35f271d18a97031f1dad1.jpg",
      price: "$0.0021",
    },
    "7": {
      id: "7",
      name: "Moon Doge",
      symbol: "MOONDOGE",
      image: "https://i.pinimg.com/736x/66/19/b7/6619b7de537178946949a0930a76408e.jpg",
      price: "$0.0042",
    },
    "8": {
      id: "8",
      name: "Crypto King",
      symbol: "KING",
      image: "https://i.pinimg.com/736x/79/34/d0/7934d03ebd8be3380a8a654c91b42f24.jpg",
      price: "$0.0017",
    },
    "9": {
      id: "9",
      name: "Space Cat",
      symbol: "SPACECAT",
      image: "https://i.pinimg.com/1200x/05/21/ec/0521ec5ff74825698ad5273d37e45c18.jpg",
      price: "$0.0028",
    },
    "10": {
      id: "10",
      name: "Diamond Moon",
      symbol: "DIAMOON",
      image: "https://i.pinimg.com/1200x/81/41/fc/8141fcbdda3a1663e368e33e6a9ffca9.jpg",
      price: "$0.0035",
    },
  };

  return tokens[id as keyof typeof tokens] || {
    id,
    name: "Unknown Token",
    symbol: "???",
    image: "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg",
    price: "$0.00",
  };
};

export function TokenPageWrapper({ tokenId, children }: TokenPageWrapperProps) {
  React.useEffect(() => {
    const tokenData = getTokenData(tokenId);
    addRecentToken({
      id: tokenData.id,
      name: tokenData.name,
      symbol: tokenData.symbol,
      image: tokenData.image,
      price: tokenData.price,
    });
  }, [tokenId]);

  return <>{children}</>;
}
