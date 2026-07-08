"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
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
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  Edit2,
  Trash2,
  Zap
} from "lucide-react";

export type FirebaseDataRow = {
  id: string;
  current: number;
  voltage: number;
  power_watt: number;
  last_updated: string;
  createdAt: string;
};

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
import { Row } from "@tanstack/react-table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ActionCell = ({ row }: { row: Row<FirebaseDataRow> }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  
  const initialTimestamp = Number(row.getValue("last_updated"));
  const initialDate = !isNaN(initialTimestamp) && initialTimestamp > 0 
    ? new Date(initialTimestamp * 1000) 
    : new Date();

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string>(
    initialDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );

  const combinedDateStr = React.useMemo(() => {
    if (!date) return "";
    const d = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(":");
      d.setHours(parseInt(hours, 10));
      d.setMinutes(parseInt(minutes, 10));
    }
    return format(d, "MMM d, yyyy HH:mm:ss");
  }, [date, time]);

  const isMobile = useIsMobile();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default to stop bubbling if needed
    setDropdownOpen(false); // Close dropdown
    setEditOpen(true); // Open edit modal
  };

  const editFormContent = (
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">Voltage (V)</label>
          <Input defaultValue={row.getValue("voltage")} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">Current (A)</label>
          <Input defaultValue={row.getValue("current")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">Power (W)</label>
          <Input defaultValue={row.getValue("power_watt")} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">Last Update</label>
          <Input value={combinedDateStr} disabled className="bg-neutral-secondary text-body" />
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm font-medium text-heading">Update Date & Time manually</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger 
              render={
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-border-default hover:bg-neutral-secondary",
                    !date && "text-body-subtle"
                  )}
                />
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-border-default shadow-lg" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="bg-neutral-primary"
              />
            </PopoverContent>
          </Popover>
          <Input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full"
            step="0.001"
          />
        </div>
      </div>

      <Button className="mt-2 bg-brand text-white hover:bg-brand-strong w-full sm:w-auto self-end">
        Save Changes
      </Button>
    </div>
  );

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="h-9 w-9 p-0 flex items-center justify-center hover:bg-neutral-secondary rounded-md data-[state=open]:bg-neutral-tertiary-medium outline-none border-border-default"
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
            Edit item
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm text-danger hover:bg-danger-soft hover:text-danger-strong cursor-pointer rounded-[12px]">
            <Trash2 className="h-4 w-4" />
            Delete item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isMobile ? (
        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className="px-4 pb-8">
            <DrawerHeader className="pt-8">
              <DrawerTitle>Edit Item</DrawerTitle>
              <DrawerDescription>
                Make changes to item ID: {row.getValue("id") as string}
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              {editFormContent}
            </div>
            <DrawerFooter className="pt-4 px-0">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Make changes to item ID: {row.getValue("id") as string}
              </DialogDescription>
            </DialogHeader>
            {editFormContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export const columns: ColumnDef<FirebaseDataRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      // Show short ID for readability
      return <div className="tabular-nums font-medium text-body">{id.substring(0, 8)}...</div>;
    }
  },
  {
    accessorKey: "voltage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Voltage (V)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium text-warning">{row.getValue("voltage")}</div>,
  },
  {
    accessorKey: "current",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Current (A)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium text-brand">{row.getValue("current")}</div>,
  },
  {
    accessorKey: "power_watt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Power (W)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium text-success">{row.getValue("power_watt")}</div>,
  },
  {
    accessorKey: "last_updated",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-neutral-secondary text-body border-border-default">
        {row.getValue("last_updated")} ms
      </Badge>
    ),
  },
  {
    id: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.last_updated,
    cell: ({ row }) => {
      const createdAtStr = row.getValue("date") as number;
      const date = new Date(createdAtStr * 1000);
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <CalendarIcon className="h-4 w-4 text-body-subtle" />
          {formatted !== "Invalid Date" ? formatted : `${date}`}
        </div>
      );
    },
  },
  {
    id: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.last_updated,
    cell: ({ row }) => {
      const createdAtStr = row.getValue("last_updated") as number;
      const formattedTime = new Date(createdAtStr * 1000).toLocaleTimeString();
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <Clock className="h-4 w-4 text-body-subtle" />
          {formattedTime || "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
