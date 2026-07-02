import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-neutral-primary-soft flex flex-col font-sans text-body">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-64 relative">
          {/* Main content area expands to full viewport width on mobile, and fills remaining space on desktop. */}
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
