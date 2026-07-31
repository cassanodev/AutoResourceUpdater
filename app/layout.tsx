import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/Providers";
import { Header } from "./components/WindowHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Resource Updater",
  description: "Made by Cassano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-screen w-screen overflow-hidden`}
    >
      <body className="m-0 h-screen w-screen overflow-hidden bg-background text-foreground antialiased select-none">
        <Providers>
          <div className="flex h-screen w-screen flex-col overflow-hidden">
            <Header />

            <main className="relative flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}