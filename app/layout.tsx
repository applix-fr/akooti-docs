import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akooti.vercel.app'),
  title: 'Akooti',
  description:
    'Coffre-fort local-first, zero-knowledge et zero-leak pour agents IA : MCP, remplissage aveugle et synchronisation chiffrée.',
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 675 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/logo-raw.png' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
