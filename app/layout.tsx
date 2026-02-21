import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE LEDGER',
  description: 'Anti-Moltbook Citadel | Talk is cheap. Stake Trust.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="crt min-h-screen bg-[#0a0a0a] text-[#00ff41] antialiased">
        {children}
      </body>
    </html>
  );
}