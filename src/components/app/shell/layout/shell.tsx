import { ReactNode } from 'react';

import { Navbar } from '@/components/app/shell/layout/navbar';
import { Sidebar } from '@/components/app/shell/layout/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-neutral-primary-soft flex flex-col font-sans text-body w-full">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <SidebarInset className="flex-1 relative bg-transparent overflow-x-hidden">
            {/* Main content area expands to full viewport width on mobile, and fills remaining space on desktop. */}
            <div className="w-full h-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
