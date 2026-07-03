import * as React from "react";
import {
  Search,
  Filter,
  Plus,
  Settings,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TableHeader() {
  return (
    <>
      {/* Top metadata row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-heading tabular-nums">
            Total items: 43,436
          </span>
          <div className="h-4 w-4 rounded-full bg-neutral-secondary flex items-center justify-center text-[10px] text-body-subtle cursor-help" title="Total tickets in the system">
            i
          </div>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body-subtle" />
          <Input
            placeholder="Search items..."
            className="pl-9 h-9 w-full sm:w-[250px] rounded-full border-border-default bg-neutral-primary-soft text-body focus-visible:ring-brand focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-4 border-b border-border-default bg-neutral-primary-soft">
        <div className="flex items-center gap-2 w-full xl:w-auto grid grid-cols-2 xl:flex">
          <Button variant="outline" className="h-9 px-3 border-border-default text-body font-medium hover:bg-neutral-secondary">
            Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-9 px-3 border-border-default text-body font-medium hover:bg-neutral-secondary">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full xl:w-auto grid grid-cols-2 xl:flex">
          <Button className="h-9 px-3 bg-brand hover:bg-brand-strong text-white font-medium col-span-2 xl:col-span-1 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add item
          </Button>
          <Button variant="outline" className="h-9 px-3 border-border-default text-body font-medium hover:bg-neutral-secondary">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Table settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>
          <Button variant="outline" className="h-9 px-3 border-border-default text-body font-medium hover:bg-neutral-secondary">
            <EyeOff className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Hide fields</span>
            <span className="sm:hidden">Hide</span>
          </Button>
        </div>
      </div>
    </>
  );
}
