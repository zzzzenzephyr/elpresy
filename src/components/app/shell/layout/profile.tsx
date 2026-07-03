"use client";

import { Menu } from "@base-ui/react/menu";
import {
  User,
  Settings,
  LogOut,
} from "lucide-react";

export function ProfileMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="px-[10px] py-1.5 bg-transparent hover:bg-neutral-secondary transition-colors rounded-md flex items-center gap-[6px] outline-none focus-visible:ring-2 focus-visible:ring-ring text-left cursor-pointer border border-transparent">
        <div className="w-8 h-8 shrink-0 rounded-full bg-brand-soft border border-border-default flex items-center justify-center overflow-hidden">
          <User className="w-4 h-4 text-brand" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-medium text-heading truncate leading-tight">
            User Name
          </span>
          <span className="text-xs text-body-subtle truncate leading-tight mt-0.5">
            user@example.com
          </span>
        </div>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8}>
          <Menu.Popup className="w-[288px] bg-neutral-primary border border-border-default rounded-md shadow-lg outline-none origin-top-right z-50">
            
            {/* Menu list */}
            <div className="px-2 pb-2">
              <div className="flex flex-col">
                <Menu.Item className="flex items-center w-full p-2 rounded-sm hover:bg-neutral-secondary text-body hover:text-heading gap-[6px] text-sm font-medium cursor-pointer outline-none select-none transition-colors">
                  <User className="w-4 h-4 shrink-0" /> Account
                </Menu.Item>
                <Menu.Item className="flex items-center w-full p-2 rounded-sm hover:bg-neutral-secondary text-body hover:text-heading gap-[6px] text-sm font-medium cursor-pointer outline-none select-none transition-colors">
                  <Settings className="w-4 h-4 shrink-0" /> Settings
                </Menu.Item>
              </div>

              {/* Bottom section with divider */}
              <div className="pt-[6px] mt-[6px] border-t border-border-default flex flex-col">
                <Menu.Item className="flex items-center w-full p-2 rounded-sm hover:bg-danger-soft text-fg-danger hover:text-fg-danger-strong gap-[6px] text-sm font-medium cursor-pointer outline-none select-none transition-colors">
                  <LogOut className="w-4 h-4 shrink-0" /> Sign out
                </Menu.Item>
              </div>
            </div>

          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
