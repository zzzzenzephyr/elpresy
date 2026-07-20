import { Laptop } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-6 py-12 bg-neutral-primary-soft w-full">
      <div className="relative mb-10 text-brand flex items-center justify-center">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-brand-soft rounded-full opacity-50 blur-3xl w-64 h-64 -z-10 m-auto"></div>
        
        {/* Main illustrative icon */}
        <Laptop className="w-32 h-32 text-brand drop-shadow-md relative z-10" strokeWidth={1} />
        
        {/* Decorative UI boxes floating in background */}
        <div className="absolute -top-6 -right-12 w-24 h-16 bg-neutral-primary border border-border-default rounded-md shadow-sm opacity-80 hidden sm:block rotate-6"></div>
        <div className="absolute top-16 -left-16 w-20 h-24 bg-neutral-primary border border-border-default rounded-md shadow-sm opacity-80 hidden sm:block -rotate-12"></div>
        <div className="absolute -bottom-4 right-8 w-16 h-12 bg-neutral-primary border border-border-default rounded-md shadow-sm opacity-90 hidden sm:block -rotate-3"></div>
      </div>
      
      <h1 className="text-4xl font-bold text-heading mb-4 tracking-tight">Down for Maintenance</h1>
      <p className="text-body text-lg max-w-xl mx-auto leading-relaxed">
        We are temporarily offline for planned maintenance and will return shortly. 
        Please check our <Link href="/status" className="font-semibold text-brand hover:underline transition-all">status page</Link> for updates.
      </p>
    </div>
  );
}
