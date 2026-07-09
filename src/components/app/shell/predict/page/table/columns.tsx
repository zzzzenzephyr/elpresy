"use client";

import * as React from "react";
import { ColumnDef, Column, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

// Define the generic Row type we expect across process tables
export type ProcessDataRow = {
  id: string;
  current: number | string;
  voltage: number | string;
  power_watt: number | string;
  last_updated: string;
  [key: string]: any;
};

export const SortableHeader = ({ column, title }: { column: Column<any, unknown>, title: string }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
  >
    {title}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

import { useTranslations } from "next-intl";

const EditForm = ({ row }: { row: Row<ProcessDataRow> }) => {
  const t = useTranslations("PredictPage.Process");
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">{t('voltage')}</label>
          <Input defaultValue={row.getValue("voltage")} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">{t('current')}</label>
          <Input defaultValue={row.getValue("current")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">{t('power')}</label>
          <Input defaultValue={row.getValue("power_watt")} />
        </div>
      </div>
      <Button className="mt-2 bg-brand text-white hover:bg-brand-strong w-full sm:w-auto self-end">
        {t('saveChanges')}
      </Button>
    </div>
  );
};

export const ActionCell = ({ row }: { row: Row<ProcessDataRow> }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const t = useTranslations("PredictPage.Process");

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    setEditOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger 
          render={
            <Button
              variant="outline"
              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-neutral-secondary rounded-md data-[state=open]:bg-neutral-tertiary-medium outline-none border-border-default"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-body" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-[160px] p-2 rounded-[12px] bg-neutral-primary border-border-default shadow-lg">
          <DropdownMenuItem 
            onClick={handleEditClick}
            className="flex items-center gap-2 px-2 py-2 text-sm text-body hover:bg-neutral-tertiary-medium hover:text-heading cursor-pointer rounded-[12px]"
          >
            <Edit2 className="h-4 w-4" />
            {t('editItem')}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm text-danger hover:bg-danger-soft hover:text-danger-strong cursor-pointer rounded-[12px]">
            <Trash2 className="h-4 w-4" />
            {t('deleteItem')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isMobile ? (
        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className="px-4 pb-8">
            <DrawerHeader className="pt-8">
              <DrawerTitle>{t('editItemTitle')}</DrawerTitle>
              <DrawerDescription>
                {t('editItemDesc', { id: row.getValue("id") as string })}
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <EditForm row={row} />
            </div>
            <DrawerFooter className="pt-4 px-0">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                {t('cancel')}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('editItemTitle')}</DialogTitle>
              <DialogDescription>
                {t('editItemDesc', { id: row.getValue("id") as string })}
              </DialogDescription>
            </DialogHeader>
            <EditForm row={row} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
