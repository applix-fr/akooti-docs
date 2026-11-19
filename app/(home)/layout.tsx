import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { SiteFooter } from '@/components/site-footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-screen flex-col bg-app text-ink">
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
      <SiteFooter />
    </div>
  );
}
