"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname, Link } from "@/i18n/routing";
import { ThemeToggleButton } from '@/components/app/shell/layout/theme';
import { ProfileMenu } from '@/components/app/shell/layout/profile';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LocaleSwitcher } from '@/components/app/shell/layout/locale-switcher';

export function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border-default bg-neutral-primary flex items-center px-4 z-50 justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-body -ml-1" />
        <div className="hidden md:flex items-center gap-2">
          <div className="w-6 h-6 bg-brand rounded-sm flex items-center justify-center text-white font-bold text-xs">E</div>
          <span className="text-heading font-semibold text-lg">ELPRESY</span>
        </div>
        <Breadcrumb className="hidden md:flex ml-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" className="text-body hover:text-heading transition-colors">Home</Link>
            </BreadcrumbItem>
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const title = segment.charAt(0).toUpperCase() + segment.slice(1);
              const href = `/${segments.slice(0, index + 1).join('/')}`;

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-heading font-medium">{title}</BreadcrumbPage>
                    ) : (
                      <Link href={href as any} className="text-body hover:text-heading transition-colors">
                        {title}
                      </Link>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <ThemeToggleButton />
        {/* <ProfileMenu /> */}
      </div>
    </header>
  );
}
