'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { signIn } from '@/lib/auth/client';
import { Link } from '@/i18n/routing';

export function LoginForm() {
  const t = useTranslations('HomePage');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await signIn.email({
      email,
      password,
      fetchOptions: {
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
        onSuccess: () => {
          window.location.href = '/en/overview';
        },
      },
    });
  };

  return (
    <div className="bg-neutral-primary border border-border-default rounded-base shadow-lg p-8 w-full flex flex-col">
      <h2 className="text-heading text-h4 font-semibold mb-1">
        {t('loginTitle')}
      </h2>
      <p className="text-body-sm text-body mb-6">
        {t('noAccount')}{" "}
        <Link
          href="/register"
          className="text-brand hover:underline font-medium"
        >
          {t('signUp')}
        </Link>
      </p>

      <div className="relative mb-6">
        <div
          className="absolute inset-0 flex items-center"
          aria-hidden="true"
        >
          <div className="w-full border-t border-border-default"></div>
        </div>
        <div className="relative flex justify-center text-body-sm">
          <span className="bg-neutral-primary px-2 text-body-subtle">
            Electrical Prediction System
          </span>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        {error && (
          <div className="text-red-500 text-sm font-medium px-1">{error}</div>
        )}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-body-sm font-medium text-heading"
            htmlFor="email"
          >
            {t('emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-base border border-border-default bg-neutral-primary-soft px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-subtle focus:border-brand"
            placeholder="name@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-2">
          <label
            className="text-body-sm font-medium text-heading"
            htmlFor="password"
          >
            {t('passwordLabel')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-base border border-border-default bg-neutral-primary-soft px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-subtle focus:border-brand"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-brand text-white font-medium rounded-base transition-colors hover:bg-brand-strong disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow:
              "var(--shadow-xs), inset var(--color-1-400) 0 6px 0px -5px, var(--color-1-700) 0 4px 10px -5px",
          }}
        >
          {loading ? 'Signing in...' : t('signIn')}
        </button>
      </form>

      <p className="text-body-sm text-body text-center mt-6">
        {t('termsAgree')}{" "}
        <a href="/" className="text-brand hover:underline">
          {t('termsOfService')}
        </a>{" "}
        {t('and')}{" "}
        <a href="/" className="text-brand hover:underline">
          {t('privacyPolicy')}
        </a>
        .
      </p>
    </div>
  );
}
