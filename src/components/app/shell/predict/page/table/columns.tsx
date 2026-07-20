"use client";

import * as React from "react";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Clock } from "lucide-react";

export type PreprocessDataRow = {
  id: string;
  current: number;
  voltage: number;
  power_watt: number;
  created_at: string | Date;
};

const SortableHeader = ({ column, title }: { column: Column<PreprocessDataRow, unknown>, title: string }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
  >
    {title}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const columns: ColumnDef<PreprocessDataRow>[] = [
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
    header: ({ column }) => <SortableHeader column={column} title="ID" />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="tabular-nums font-medium text-body">{id ? id.substring(0, 8) + "..." : "-"}</div>;
    }
  },
  {
    accessorKey: "voltage",
    header: ({ column }) => <SortableHeader column={column} title="Average Voltage (V)" />,
    cell: ({ row }) => <div className="font-medium text-warning tabular-nums">{row.getValue("voltage")}</div>,
  },
  {
    accessorKey: "current",
    header: ({ column }) => <SortableHeader column={column} title="Average Current (A)" />,
    cell: ({ row }) => <div className="font-medium text-brand tabular-nums">{row.getValue("current")}</div>,
  },
  {
    accessorKey: "power_watt",
    header: ({ column }) => <SortableHeader column={column} title="Average Power (W)" />,
    cell: ({ row }) => <div className="font-medium text-success tabular-nums">{row.getValue("power_watt")}</div>,
  },
  {
    id: "last_updated",
    accessorFn: (row) => {
      const val = row.created_at;
      if (!val) return 0;
      const date = typeof val === 'string' ? new Date(val) : val;
      return Math.floor(date.getTime() / 1000);
    },
    header: ({ column }) => <SortableHeader column={column} title="Last Updated" />,
    cell: ({ row }) => {
      const unixSecs = row.getValue("last_updated") as number;
      return (
        <Badge variant="outline" className="bg-neutral-secondary text-body border-border-default tabular-nums">
          {unixSecs} s
        </Badge>
      );
    },
  },
  {
    id: "Timestamp",
    accessorFn: (row) => row.created_at,
    header: ({ column }) => <SortableHeader column={column} title="Timestamp" />,
    cell: ({ row }) => {
      const val = row.getValue("Timestamp");
      if (!val) return "N/A";
      const date = typeof val === 'string' ? new Date(val) : val as Date;
      
      const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(date.getUTCDate()).padStart(2, '0');
      const yyyy = date.getUTCFullYear();
      let h = date.getUTCHours();
      const m = String(date.getUTCMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12;
      h = h ? h : 12; 

      const formatted = `${mm}/${dd}/${yyyy} @ ${h}:${m}${ampm}`;
      
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <Clock className="h-4 w-4 text-body-subtle" />
          {formatted}
        </div>
      );
    },
  },
];
