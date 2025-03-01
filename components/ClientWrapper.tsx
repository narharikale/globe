'use client';

import dynamic from 'next/dynamic';

// Dynamic import inside a client component
const GameClient = dynamic(() => import('./GameClient'), {
  ssr: false
});

export default function ClientWrapper() {
  return <GameClient />;
} 