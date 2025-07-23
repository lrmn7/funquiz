"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-transparent backdrop-blur-sm sticky top-0 z-50 border-b border-border">
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

            <div className="flex items-center gap-4">
              {/* Tampilan Desktop: Tautan terlihat langsung */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/quizzes"
                  className="text-base text-secondary hover:text-primary transition-colors"
                >
                  Explore
                </Link>
                <Link
                  href="/create-quiz"
                  className="text-base text-secondary hover:text-primary transition-colors"
                >
                  Create
                </Link>
                  <Link
                  href="/fun-card"
                  className="text-base text-secondary hover:text-primary transition-colors"
                >
                  FunCard
                </Link>
                <Link
                  href="https://twitter.com/romanromannya"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-8 h-8 text-secondary hover:text-primary transition-colors" />
                </Link>
              </div>

              {/* Tombol Wallet Kustom */}
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

              {/* Tampilan Mobile: Tombol Hamburger Menu */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-secondary hover:text-primary"
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Panel Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 w-full bg-transparent backdrop-blur-sm border-b border-border z-40"
          >
            <div className="flex flex-col items-center gap-4 px-4 py-6">
              <Link
                href="/quizzes"
                className="text-lg text-primary hover:text-secondary transition-colors font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/create-quiz"
                className="text-lg text-primary hover:text-secondary transition-colors font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Create
              </Link>
                <Link
                href="/fun-card"
                className="text-lg text-primary hover:text-secondary transition-colors font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                FunCard
              </Link>
              <Link
                href="https://twitter.com/romanromannya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaXTwitter className="w-6 h-6 text-primary hover:text-secondary transition-colors font-bold" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
