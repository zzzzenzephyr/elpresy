"use client";

import { Home, Flame, Settings, FileText, HelpCircle, LineChart } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/overview', label: 'Overview', icon: Home },
    { href: '/firebase', label: 'Firebase', icon: Flame },
    { href: '/predict', label: 'Predict', icon: LineChart },
  ];

  return (
    <ShadcnSidebar 
      collapsible="icon" 
      className="top-16 h-[calc(100svh-4rem)] border-r border-border-default !bg-neutral-primary z-40 group/sidebar"
    >
      <SidebarContent className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 !bg-transparent">
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
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors overflow-hidden">
          <FileText className="w-4 h-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Docs</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors overflow-hidden">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Help</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors overflow-hidden">
          <Settings className="w-4 h-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Settings</span>
        </a>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
