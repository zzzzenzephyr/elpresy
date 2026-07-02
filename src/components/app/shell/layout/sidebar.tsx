import { Home, Flame, Settings, FileText, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';

export function Sidebar() {
  return (
    <ShadcnSidebar 
      collapsible="none" 
      className="fixed left-0 top-16 bottom-0 !w-64 border-r border-border-default !bg-neutral-primary !flex-col hidden md:!flex z-40"
    >
      <SidebarContent className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 !bg-transparent">
        {/* Navigation items */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-brand-soft text-brand transition-colors">
          <Home className="w-4 h-4" />
          Overview
        </Link>
        <Link href="/firebase" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors">
          <Flame className="w-4 h-4" />
          Firebase
        </Link>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border-default flex flex-col gap-1 !bg-transparent">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors">
          <FileText className="w-4 h-4" />
          Docs
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors">
          <HelpCircle className="w-4 h-4" />
          Help
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
