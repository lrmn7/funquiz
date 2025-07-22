"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6"; // Icon Twitter

const Navbar = () => {
  return (
    <nav className="bg-transparent backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image
                src="/funquiz.png"
                alt="FunQuiz Logo"
                width={48}
                height={48}
                priority
              />
            </div>
          </Link>

          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              href="/quizzes"
              className="text-sm md:text-base text-secondary hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/create-quiz"
              className="text-sm md:text-base text-secondary hover:text-primary transition-colors"
            >
              Create
            </Link>

            {/* ================================================================= */}
            {/* ICON TWITTER DITAMBAHKAN DI SINI                                */}
            {/* ================================================================= */}
            <a 
              href="https://twitter.com/YOUR_USERNAME" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaXTwitter className="w-5 h-5 text-secondary hover:text-primary transition-colors" />
            </a>

            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openConnectModal,
                openChainModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="bg-primary text-background font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-all text-sm md:text-base"
                          >
                            Connect Wallet
                          </button>
                        );
                      }
                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-all flex items-center gap-2"
                          >
                            Wrong Network
                            <FiChevronDown />
                          </button>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="flex items-center gap-2 bg-surface border border-border p-2 rounded-md text-secondary hover:border-primary transition-colors"
                          >
                            {chain.hasIcon && (
                              <Image
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl ?? ""}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span className="hidden sm:block">
                              {chain.name}
                            </span>
                            <FiChevronDown />
                          </button>
                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="bg-surface border border-border p-2 rounded-md text-secondary hover:border-primary transition-colors"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;