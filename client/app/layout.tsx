import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import PrivyProvider from "@/components/providers/PrivyProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OnlyFounders - Launch Your Token, Build Your Community",
    template: "%s | OnlyFounders",
  },
  description:
    "OnlyFounders is the ultimate launchpad for founders to create, launch, and grow their tokens on Solana. Fair launch, bonding curves, and instant liquidity.",
  keywords: [
    "OnlyFounders",
    "Solana",
    "token launch",
    "launchpad",
    "bonding curve",
    "fair launch",
    "meme coins",
    "crypto tokens",
    "DeFi",
    "Web3",
  ],
  authors: [{ name: "OnlyFounders Team" }],
  creator: "OnlyFounders",
  publisher: "OnlyFounders",
  metadataBase: new URL("https://onlyfounders.fun"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onlyfounders.fun",
    siteName: "OnlyFounders",
    title: "OnlyFounders - Launch Your Token, Build Your Community",
    description:
      "OnlyFounders is the ultimate launchpad for founders to create, launch, and grow their tokens on Solana. Fair launch, bonding curves, and instant liquidity.",
    images: [
      {
        url: "/fullLogo.jpg",
        width: 1200,
        height: 630,
        alt: "OnlyFounders - Token Launchpad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlyFounders - Launch Your Token, Build Your Community",
    description:
      "OnlyFounders is the ultimate launchpad for founders to create, launch, and grow their tokens on Solana. Fair launch, bonding curves, and instant liquidity.",
    images: ["/fullLogo.jpg"],
    creator: "@onlyfounders",
    site: "@onlyfounders",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background selection:text-background selection:bg-primary`}
      >
        <PrivyProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="md:mt-14 mt-11 w-full">{children}</main>
            <Toaster
              position="bottom-left"
              toastOptions={{
                style: {
                  borderRadius: "0px",
                  border: "0px",
                  // left: "-1.5rem",
                  // top: "-1.5rem",
                },
              }}
              richColors
            />
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
