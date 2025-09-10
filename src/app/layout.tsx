import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collab-Board",
  description: "Lightweight project collaboration board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <header className="border-b bg-white" >
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Collab-Board</div>
            <nav className="text-sm text-gray-600">v0. Phase 1</nav>
          </div>
        </header>
        <main className="mx-auto mx-w-5xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-gray-500">© {new Date().getFullYear()} CollabBoard</footer>
      </body>
    </html>
  );
}
