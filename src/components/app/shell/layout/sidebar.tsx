import { Home, LayoutDashboard, Settings, ChevronRight, FileText, HelpCircle, Layers } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border-default bg-neutral-primary flex-col hidden md:flex z-40">
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {/* Navigation items */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors">
          <Home className="w-4 h-4" />
          Overview
        </Link>
        <div className="flex flex-col">
          <button className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium bg-brand-soft text-brand w-full text-left transition-colors">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              Maintenance
            </div>
            <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
          <div className="flex flex-col pl-10 pr-3 py-1">
            <Link href="/" className="py-1.5 text-sm font-medium text-brand">Status</Link>
            <Link href="/" className="py-1.5 text-sm font-medium text-body hover:text-heading transition-colors">Logs</Link>
          </div>
        </div>
        <Link href="/" className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-body hover:bg-neutral-primary-soft hover:text-heading transition-colors">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4" />
            Projects
          </div>
          <span className="bg-neutral-primary-soft text-heading text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-border-default">12</span>
        </Link>
      </div>
      <div className="p-4 border-t border-border-default flex flex-col gap-1">
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
      </div>
    </aside>
  );
}
