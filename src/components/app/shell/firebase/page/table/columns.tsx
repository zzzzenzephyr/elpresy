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
  Calendar,
  Clock,
  MoreHorizontal,
  Archive,
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
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      // Show short ID for readability
      return <div className="tabular-nums font-medium text-body">{id.substring(0, 8)}...</div>;
    }
  },
  {
    accessorKey: "current",
    header: "Current (A)",
    cell: ({ row }) => <div className="font-medium text-brand">{row.getValue("current")}</div>,
  },
  {
    accessorKey: "voltage",
    header: "Voltage (V)",
    cell: ({ row }) => <div className="font-medium text-warning">{row.getValue("voltage")}</div>,
  },
  {
    accessorKey: "power_watt",
    header: "Power (W)",
    cell: ({ row }) => <div className="font-medium text-success">{row.getValue("power_watt")}</div>,
  },
  {
    accessorKey: "last_updated",
    header: "Last Updated",
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
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      // Parse the createdAt string: "2026-06-24 06:37:28.787197"
      const createdAtStr = row.getValue("date") as string;
      const datePart = createdAtStr.split(" ")[0]; // "2026-06-24"
      const date = new Date(datePart);
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <Calendar className="h-4 w-4 text-body-subtle" />
          {formatted !== "Invalid Date" ? formatted : datePart}
        </div>
      );
    },
  },
  {
    id: "time",
    header: "Time",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      const createdAtStr = row.getValue("time") as string;
      const timePart = createdAtStr.split(" ")[1]; // "06:37:28.787197"
      const formattedTime = timePart ? timePart.split(".")[0] : ""; // "06:37:28"
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
    cell: ({ row }) => {
      return (
        <DropdownMenu>
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
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm text-body hover:bg-neutral-tertiary-medium hover:text-heading cursor-pointer rounded-[12px]">
              <Archive className="h-4 w-4" />
              Archive item
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm text-body hover:bg-neutral-tertiary-medium hover:text-heading cursor-pointer rounded-[12px]">
              <Edit2 className="h-4 w-4" />
              Edit item
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm text-danger hover:bg-danger-soft hover:text-danger-strong cursor-pointer rounded-[12px]">
              <Trash2 className="h-4 w-4" />
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
