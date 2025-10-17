export interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  marketCap: string;
  volume: string;
  progress: number;
  price?: string;
  holders?: string;
  totalSupply?: string;
  contractAddress?: string;
  creator?: string;
  socialLinks?: SocialLinks;
}

export interface SocialLinks {
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  description: string;
  image: string;
  socialLinks: SocialLinks;
}
