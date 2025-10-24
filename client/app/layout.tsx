import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaProvider } from "@/components/SolanaProvider";
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
  title: "TokunLunchpad - Web3 Meme Token Launchpad",
  description: "Launch and trade meme tokens on TokunLunchpad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <SolanaProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="mt-20 w-full">{children}</main>
            <Toaster
              position="top-left"
              toastOptions={{
                style: {
                  borderRadius: "0px",
                  border: "0px",
                  top: "-1.5rem",
                  left: "-1.5rem",
                  padding: "1.9rem",
                },
              }}
              richColors
            />
          </ThemeProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
