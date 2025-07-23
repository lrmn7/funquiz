import { Inter, Orbitron } from "next/font/google";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/providers/AudioProvider";
import AppLoaderWrapper from "@/components/AppLoaderWrapper";
const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ['400', '700'], // Pastikan Anda menyertakan weight yang digunakan di desain Anda
  variable: '--font-orbitron' // Ini mendefinisikan variabel CSS
});

const ClientOnlyProviders = dynamic(() => import("@/app/providers-client"), { ssr: false });

export const metadata: Metadata = {
  title: "FunQuiz",
  description: "Your Quiz, Your Rules. The World Plays.",
  keywords:
    "Somnia, Somnia Network, Testnet, Faucet, ERC20, ERC721, Multi-sender, Blockchain Tools, dApp, Web3, Smart Contract Deployment, Test Tokens, Crypto",
  authors: [{ name: "L RMN", url: "https://lrmn.link" }],
  creator: "L RMN",
  publisher: "L RMN",
  alternates: {
    canonical: "https://FunQuiz.vercel.app/",
  },
  icons: {
    icon: "/funquiz.png",
    shortcut: "/funquiz.png",
    apple: "/funquiz.png",
  },
  openGraph: {
    title: "FunQuiz",
    description: "Your Quiz, Your Rules. The World Plays.",
    url: "https://FunQuiz.vercel.app/",
    siteName: "FunQuiz",
    images: [
      {
        url: "https://FunQuiz.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "FunQuiz",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@romanromannya",
    creator: "@romanromannya",
    title: "FunQuiz: Your Quiz, Your Rules. The World Plays.",
    description: "Your Quiz, Your Rules. The World Plays.",
    images: ["https://FunQuiz.vercel.app/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en" className={`dark ${inter.className} ${orbitron.className}`}> 
      <body>
        <ClientOnlyProviders>
          <AppLoaderWrapper />
          <AudioProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          </AudioProvider>
          <ToastContainer theme="dark" position="bottom-right" />
        </ClientOnlyProviders>
      </body>
    </html>
  );
}