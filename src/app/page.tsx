export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-primary-soft text-body font-sans">
      {/* Navigation */}
      <header className="w-full border-b border-border-default bg-neutral-primary-soft">
        <div className="max-w-[1152px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-heading font-semibold text-lg">ELPRESY</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative w-full py-24 bg-neutral-primary-soft overflow-hidden">
          {/* Subtle geometric dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--border-default) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-[1152px] mx-auto px-6 flex flex-col xl:grid xl:grid-cols-12 gap-12 xl:gap-8 items-center">
            {/* Left Column (7 columns) */}
            <div className="flex flex-col w-full xl:col-span-7 xl:pr-8 xl:self-center items-start text-left">
              <h1 className="text-heading text-h1 font-extrabold tracking-tight max-w-xl mb-4 leading-[1.1] shimmer">
                Predict with confidence
              </h1>
              <p className="text-body text-body-lg max-w-lg mb-8">
                The complete toolkit for modern energy predictions. Build, ship,
                and scale with our comprehensive machine learning system.
              </p>

              <a
                href="/"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-brand text-white font-medium rounded-base transition-colors hover:bg-brand-strong w-auto mb-16"
                style={{
                  boxShadow:
                    "var(--shadow-xs), inset var(--color-1-400) 0 6px 0px -5px, var(--color-1-700) 0 4px 10px -5px",
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <title>Play</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Watch Demo
              </a>

              {/* Stat Row */}
              <div className="hidden xl:flex w-full pt-8 border-t border-border-default gap-8">
                <div className="flex items-center gap-3">
                  <div className="text-[30px] font-extrabold tracking-tight text-heading leading-none">
                    99%
                  </div>
                  <div className="text-body-sm leading-tight text-body-subtle">
                    Prediction
                    <br />
                    Accuracy
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[30px] font-extrabold tracking-tight text-heading leading-none">
                    10k+
                  </div>
                  <div className="text-body-sm leading-tight text-body-subtle">
                    Active
                    <br />
                    Models
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[30px] font-extrabold tracking-tight text-heading leading-none">
                    24/7
                  </div>
                  <div className="text-body-sm leading-tight text-body-subtle">
                    System
                    <br />
                    Uptime
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 columns) */}
            <div className="w-full max-w-md mx-auto xl:col-span-5 xl:ml-auto">
              <div className="bg-neutral-primary border border-border-default rounded-base shadow-lg p-8 w-full flex flex-col">
                <h2 className="text-heading text-h4 font-semibold mb-1">
                  Log in to your account
                </h2>
                <p className="text-body-sm text-body mb-6">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-brand hover:underline font-medium"
                  >
                    Sign up
                  </a>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-neutral-primary text-heading font-medium rounded-base border border-border-default hover:bg-neutral-secondary-soft transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <title>Google</title>
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-neutral-primary text-heading font-medium rounded-base border border-border-default hover:bg-neutral-secondary-soft transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <title>GitHub</title>
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </button>
                </div>

                <div className="relative mb-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-border-default"></div>
                  </div>
                  <div className="relative flex justify-center text-body-sm">
                    <span className="bg-neutral-primary px-2 text-body-subtle">
                      Or continue with
                    </span>
                  </div>
                </div>

                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-body-sm font-medium text-heading"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded-base border border-border-default bg-neutral-primary-soft px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-subtle focus:border-brand"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 mb-2">
                    <label
                      className="text-body-sm font-medium text-heading"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="w-full rounded-base border border-border-default bg-neutral-primary-soft px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-subtle focus:border-brand"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-sm border-border-default bg-neutral-primary-soft text-brand focus:ring-brand-subtle"
                      />
                      <span className="text-body-sm text-body">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="/"
                      className="text-body-sm text-brand hover:underline font-medium"
                    >
                      Lost password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-brand text-white font-medium rounded-base transition-colors hover:bg-brand-strong"
                    style={{
                      boxShadow:
                        "var(--shadow-xs), inset var(--color-1-400) 0 6px 0px -5px, var(--color-1-700) 0 4px 10px -5px",
                    }}
                  >
                    Sign In
                  </button>
                </form>

                <p className="text-body-sm text-body text-center mt-6">
                  By continuing, you agree to our{" "}
                  <a href="/" className="text-brand hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/" className="text-brand hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-neutral-secondary-soft">
          <div className="max-w-[1152px] mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-heading text-h2 font-semibold">
                Everything you need
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-neutral-primary-soft border border-border-default rounded-base p-6 shadow-xs hover:bg-neutral-secondary-medium transition-colors cursor-pointer">
                <h3 className="text-heading text-h5 font-medium mb-2">
                  Beautiful Design
                </h3>
                <p className="text-body text-body-sm">
                  Carefully crafted components following strict design
                  guidelines.
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-neutral-primary-soft border border-border-default rounded-base p-6 shadow-xs hover:bg-neutral-secondary-medium transition-colors cursor-pointer">
                <h3 className="text-heading text-h5 font-medium mb-2">
                  Fully Responsive
                </h3>
                <p className="text-body text-body-sm">
                  Looks great on any device, from mobile to desktop screens.
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-neutral-primary-soft border border-border-default rounded-base p-6 shadow-xs hover:bg-neutral-secondary-medium transition-colors cursor-pointer">
                <h3 className="text-heading text-h5 font-medium mb-2">
                  Accessible
                </h3>
                <p className="text-body text-body-sm">
                  Built with accessibility in mind to reach all your users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-default py-8 bg-neutral-primary-soft">
        <div className="max-w-[1152px] mx-auto px-6 text-center text-body-sm">
          &copy; {new Date().getFullYear()} Elpresy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
