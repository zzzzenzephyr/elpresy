"use client";

import * as React from "react";
import { LogOut, Home, Flame, Settings, LineChart, Layers, Brain } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { signOut } from '@/lib/auth/client';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from '@/lib/utils';
export function Sidebar() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const navItems = [
    { href: '/overview', label: 'Overview', icon: Home },
    { href: '/firebase', label: 'Firebase', icon: Flame },
    { href: '/preprocessing', label: 'Preprocessing', icon: Layers },
    { href: '/predict', label: 'Predict', icon: Brain },
    { href: '/evaluation', label: 'Evaluation', icon: LineChart },
  ];

  return (
    <ShadcnSidebar 
      collapsible="icon" 
      className="top-16 h-[calc(100svh-4rem)] border-r border-border-default !bg-neutral-primary z-40 group/sidebar"
    >
      <SidebarContent className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 !bg-transparent">
        {/* Mobile Logo & Breadcrumb (hidden on desktop) */}
        <div className="md:hidden flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 bg-brand rounded-sm flex items-center justify-center text-white font-bold text-xs">E</div>
            <span className="text-heading font-semibold text-lg">ELPRESY</span>
          </div>
          
          <Breadcrumb className="px-2">
            <BreadcrumbList className="flex-wrap">
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
          
          {/* Separator line */}
          <div className="h-px bg-border-default w-full mt-2" />
        </div>

        {/* Navigation items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href as any} 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors overflow-hidden",
                isActive 
                  ? "bg-brand-soft text-brand dark:bg-neutral-primary-soft dark:text-white" 
                  : "text-body hover:bg-neutral-primary-soft hover:text-heading"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border-default flex flex-col gap-1 !bg-transparent">
        <button 
          onClick={async () => {
            await signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = '/';
                }
              }
            });
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-danger-soft text-fg-danger hover:text-fg-danger-strong transition-colors overflow-hidden"
        >
          <LogOut className="w-4 h-4 shrink-0" /> 
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Sign out</span>
        </button>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
