import { Search, Plus, Bell, User, Menu, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="hidden md:flex items-center ml-8 relative">
          <Search className="w-4 h-4 text-body absolute left-3" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 text-sm bg-neutral-primary-soft border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-brand w-64 text-heading placeholder:text-body"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" className="hidden sm:flex items-center gap-1.5 px-[12px] py-[6px] h-auto rounded-md">
          <Plus className="w-4 h-4" />
          <span className="font-medium text-[12px]">New Action</span>
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Sun className="w-4 h-4 text-body hover:text-heading" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Bell className="w-4 h-4 text-body hover:text-heading" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-brand-soft border border-border-default flex items-center justify-center overflow-hidden">
          <User className="w-4 h-4 text-brand" />
        </div>
        <a href="#" className="text-sm font-medium text-body hover:text-brand hidden sm:block">Logout</a>
      </div>
    </header>
  );
}
