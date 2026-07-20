"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md border border-border-default hover:bg-neutral-secondary transition-colors" />
        }
      >
        <span className={`fi fi-${locale === 'en' ? 'us' : locale} text-lg`} />
        <span className="sr-only">Toggle language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 bg-neutral-primary border-border-default">
        <DropdownMenuItem onClick={() => changeLocale("en")} className="gap-3 cursor-pointer hover:bg-neutral-secondary">
          <span className="fi fi-us text-lg" /> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("id")} className="gap-3 cursor-pointer hover:bg-neutral-secondary">
          <span className="fi fi-id text-lg" /> Indonesia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
