'use client';

import { Providers } from '@/providers/Web3Provider';

export default function ClientOnlyProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}