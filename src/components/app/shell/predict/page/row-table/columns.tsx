"use client";

import * as React from "react";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, Clock } from "lucide-react";

export type PredictDataRow = {
  id: string;
  createdAt?: string | Date;
  createdat?: string | Date;
  current: number;
  voltage: number;
  power_watt: number;
  predictedPowerWatt?: number;
};

const SortableHeader = ({ column, title }: { column: Column<PredictDataRow, unknown>, title: string }) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
    >
      {title}
      {isSorted === "asc" ? (
        <ArrowUpAZ className="ml-2 h-4 w-4" />
      ) : isSorted === "desc" ? (
        <ArrowDownAZ className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export const columns: ColumnDef<PredictDataRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column} title="ID" />,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="tabular-nums font-medium text-body">{id ? id.substring(0, 8) + "..." : "-"}</div>;
    },
    enableHiding: true,
  },
  {
    id: "Timestamp",
    accessorFn: (row) => row.createdAt || row.createdat,
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
      const s = String(date.getUTCSeconds()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12; 

      const formatted = `${mm}-${dd}-${yyyy} @ ${h}:${m}:${s} ${ampm}`;
      
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <Clock className="h-4 w-4 text-body-subtle" />
          {formatted}
        </div>
      );
    },
  },
  {
    id: "voltage",
    accessorFn: (row) => row.voltage,
    header: ({ column }) => <SortableHeader column={column} title="Voltage (V)" />,
    cell: ({ row }) => <div className="font-medium text-warning tabular-nums">{row.getValue("voltage")}</div>,
  },
  {
    id: "current",
    accessorFn: (row) => row.current,
    header: ({ column }) => <SortableHeader column={column} title="Current (A)" />,
    cell: ({ row }) => <div className="font-medium text-brand tabular-nums">{row.getValue("current")}</div>,
  },
  {
    id: "power_watt",
    accessorFn: (row) => row.power_watt,
    header: ({ column }) => <SortableHeader column={column} title="Actual Power (W)" />,
    cell: ({ row }) => <div className="font-medium text-success tabular-nums">{row.getValue("power_watt")}</div>,
  },
  {
    id: "predictedPowerWatt",
    accessorFn: (row) => row.predictedPowerWatt,
    header: ({ column }) => <SortableHeader column={column} title="Predicted Power (W)" />,
    cell: ({ row }) => {
      const val = row.getValue("predictedPowerWatt") as number;
      if (val === undefined || val === null) return null;
      return <div className="font-medium text-brand tabular-nums">{Number(val).toFixed(2)}</div>;
    },
  }
];
