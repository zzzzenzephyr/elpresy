"use client";

import * as React from "react";
import { ColumnDef, Column, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Clock, MoreHorizontal, MousePointerClick } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export type PreprocessDataRow = {
  id: string;
  created_at: string | Date;
  data: {
    avgCurrent: number;
    avgVoltage: number;
    avgPower: number;
    totalData: number;
  };
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

const ActionCell = ({ row }: { row: Row<PreprocessDataRow> }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const table = row.getAllCells()[0].getContext().table;

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);

    const isCurrentlySelected = row.getIsSelected();

    if (!isCurrentlySelected) {
      table.toggleAllRowsSelected(false);
    }

    row.toggleSelected(!isCurrentlySelected);
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger render={
        <Button
          variant="outline"
          className="h-8 w-8 p-0 flex items-center justify-center hover:bg-neutral-secondary rounded-md data-[state=open]:bg-neutral-tertiary-medium outline-none border-border-default"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-body" />
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-[160px] p-2 rounded-[12px] bg-neutral-primary border-border-default shadow-lg">
        <DropdownMenuItem 
          onClick={handleSelectClick}
          className="flex items-center gap-2 px-2 py-2 text-sm text-body hover:bg-neutral-tertiary-medium hover:text-heading cursor-pointer rounded-[12px]"
        >
          <MousePointerClick className="h-4 w-4" />
          Select data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<PreprocessDataRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        disabled
        aria-label="Select all"
        className="translate-y-[2px] opacity-50 cursor-not-allowed"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled
        aria-label="Select row"
        className="translate-y-[2px] disabled:opacity-100 disabled:cursor-not-allowed"
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
    id: "voltage",
    accessorFn: (row) => row.data?.avgVoltage,
    header: ({ column }) => <SortableHeader column={column} title="Avg. Voltage (V)" />,
    cell: ({ row }) => <div className="font-medium text-warning tabular-nums">{row.getValue("voltage")}</div>,
  },
  {
    id: "current",
    accessorFn: (row) => row.data?.avgCurrent,
    header: ({ column }) => <SortableHeader column={column} title="Avg. Current (A)" />,
    cell: ({ row }) => <div className="font-medium text-brand tabular-nums">{row.getValue("current")}</div>,
  },
  {
    id: "power_watt",
    accessorFn: (row) => row.data?.avgPower,
    header: ({ column }) => <SortableHeader column={column} title="Avg. Power (W)" />,
    cell: ({ row }) => <div className="font-medium text-success tabular-nums">{row.getValue("power_watt")}</div>,
  },
  {
    id: "total_data",
    accessorFn: (row) => row.data?.totalData,
    header: ({ column }) => <SortableHeader column={column} title="Total Data" />,
    cell: ({ row }) => <div className="font-medium text-body tabular-nums">{row.getValue("total_data")}</div>,
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

      const formatted = `${mm}-${dd}-${yyyy} @ ${h}:${m}${ampm}`;
      
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <Clock className="h-4 w-4 text-body-subtle" />
          {formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
