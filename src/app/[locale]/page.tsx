import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/app/page/header';
import { Hero } from '@/components/app/page/hero';
import { LoginForm } from '@/components/app/page/login';
import { Process } from '@/components/app/page/process';
import { Footer } from '@/components/app/page/footer';
import { Features } from '@/components/app/page/features';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-primary-soft text-body font-sans">
      <Header locale={locale} />

      <main className="flex-1 w-full">
        <Hero>
          <LoginForm />
        </Hero>
        <Process />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
