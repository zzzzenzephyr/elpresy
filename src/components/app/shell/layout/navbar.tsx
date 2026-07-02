import { User, Menu } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggleButton } from './theme-toggle';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border-default bg-neutral-primary flex items-center px-4 z-50 justify-between">
      <div className="flex items-center gap-4">
        <button className="p-2 text-body md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand rounded-sm flex items-center justify-center text-white font-bold text-xs">E</div>
          <span className="text-heading font-semibold text-lg">ELPRESY</span>
        </div>
        <Breadcrumb className="hidden md:flex ml-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-body hover:text-heading transition-colors">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-heading font-medium">Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggleButton />
        <div className="w-8 h-8 rounded-full bg-brand-soft border border-border-default flex items-center justify-center overflow-hidden">
          <User className="w-4 h-4 text-brand" />
        </div>
      </div>
    </header>
  );
}
