import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/app/page/header';
import { Hero } from '@/components/app/page/hero';
import { RegisterForm } from '@/components/app/page/register';
import { Footer } from '@/components/app/page/footer';


export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-primary-soft text-body font-sans">
      <Header locale={locale} />

      <main className="flex-1 w-full">
        <Hero>
          <RegisterForm />
        </Hero>
      </main>

      <Footer />
    </div>
  );
}
