import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/app/page/header';
import { Hero } from '@/components/app/page/hero';
import { LoginForm } from '@/components/app/page/login-form';
import { Process } from '@/components/app/page/process';
import { Footer } from '@/components/app/page/footer';

export default function Home({ params }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(params.locale);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-primary-soft text-body font-sans">
      <Header locale={params.locale} />

      <main className="flex-1 w-full">
        <Hero>
          <LoginForm />
        </Hero>
        <Process />
      </main>

      <Footer />
    </div>
  );
}
