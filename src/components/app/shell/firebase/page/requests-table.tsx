"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Plus,
  Settings,
  EyeOff,
  MoreHorizontal,
  Archive,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

// Mock Data Types
type RequestTicket = {
  id: string;
  requestBy: { name: string; email: string; avatar?: string };
  subject: string;
  priority: "High" | "Medium" | "Low";
  agent: { name: string; email: string; avatar?: string };
  createDate: string;
  status: "Pending" | "Solved";
};

// Generate Mock Data
const data: RequestTicket[] = [
  {
    id: "#10234",
    requestBy: { name: "Alice Smith", email: "alice@example.com" },
    subject: "Login issue on mobile app",
    priority: "High",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-01",
    status: "Pending",
  },
  {
    id: "#10235",
    requestBy: { name: "Bob Jones", email: "bob@example.com" },
    subject: "Billing inquiry",
    priority: "Medium",
    agent: { name: "Sarah Connor", email: "sarah@support.com" },
    createDate: "2023-10-02",
    status: "Solved",
  },
  {
    id: "#10236",
    requestBy: { name: "Charlie Brown", email: "charlie@example.com" },
    subject: "Feature request: Dark mode",
    priority: "Low",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-03",
    status: "Pending",
  },
  {
    id: "#10237",
    requestBy: { name: "Diana Prince", email: "diana@example.com" },
    subject: "Cannot access dashboard",
    priority: "High",
    agent: { name: "Mike Ross", email: "mike@support.com" },
    createDate: "2023-10-04",
    status: "Solved",
  },
  {
    id: "#10238",
    requestBy: { name: "Evan Wright", email: "evan@example.com" },
    subject: "Update payment method",
    priority: "Medium",
    agent: { name: "Sarah Connor", email: "sarah@support.com" },
    createDate: "2023-10-05",
    status: "Pending",
  },
  {
    id: "#10239",
    requestBy: { name: "Fiona Gallagher", email: "fiona@example.com" },
    subject: "API rate limit exceeded",
    priority: "High",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-06",
    status: "Pending",
  },
  {
    id: "#10240",
    requestBy: { name: "George Miller", email: "george@example.com" },
    subject: "Export data to CSV",
    priority: "Low",
    agent: { name: "Mike Ross", email: "mike@support.com" },
    createDate: "2023-10-07",
    status: "Solved",
  },
  {
    id: "#10241",
    requestBy: { name: "Hannah Abbott", email: "hannah@example.com" },
    subject: "Password reset not working",
    priority: "High",
    agent: { name: "Sarah Connor", email: "sarah@support.com" },
    createDate: "2023-10-08",
    status: "Pending",
  },
  {
    id: "#10242",
    requestBy: { name: "Ian Malcolm", email: "ian@example.com" },
    subject: "Integration with Slack",
    priority: "Medium",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-09",
    status: "Solved",
  },
  {
    id: "#10243",
    requestBy: { name: "Julia Child", email: "julia@example.com" },
    subject: "Account deletion request",
    priority: "Low",
    agent: { name: "Mike Ross", email: "mike@support.com" },
    createDate: "2023-10-10",
    status: "Pending",
  },
];

// Columns Definition
export const columns: ColumnDef<RequestTicket>[] = [
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
    cell: ({ row }) => <div className="tabular-nums font-medium text-body">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "requestBy",
    header: "Request by",
    cell: ({ row }) => {
      const user = row.getValue("requestBy") as RequestTicket["requestBy"];
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-brand-soft text-brand font-medium text-xs">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-heading">{user.name}</span>
            <span className="text-xs text-body-subtle hidden sm:block">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="text-body max-w-[150px] sm:max-w-[200px] truncate" title={row.getValue("subject")}>
        {row.getValue("subject")}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge
          variant="outline"
          className={
            priority === "High"
              ? "bg-danger-soft text-danger border-danger-subtle"
              : priority === "Medium"
              ? "bg-warning-soft text-warning border-warning-subtle"
              : "bg-success-soft text-success border-success-subtle"
          }
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => {
      const user = row.getValue("agent") as RequestTicket["agent"];
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-neutral-tertiary text-body font-medium text-xs">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-heading">{user.name}</span>
            <span className="text-xs text-body-subtle hidden sm:block">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 hover:bg-neutral-secondary text-body font-medium -ml-2"
        >
          Create date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createDate"));
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return (
        <div className="flex items-center gap-2 text-body tabular-nums">
          <Calendar className="h-4 w-4 text-body-subtle" />
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={
            status === "Solved"
              ? "bg-success-soft text-success border-success-subtle gap-1"
              : "bg-neutral-secondary text-body border-border-default gap-1"
          }
        >
          {status === "Solved" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {status}
        </Badge>
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

export function RequestsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-neutral-primary rounded-[12px] border border-border-default shadow-sm overflow-hidden flex flex-col">
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

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[900px]">
          <TableHeader className="bg-neutral-secondary-soft">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border-default hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-11 px-4 text-xs font-semibold text-body-subtle whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border-default hover:bg-neutral-secondary-soft transition-colors data-[state=selected]:bg-brand-softer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-body">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border-default bg-neutral-primary-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-sm text-body font-medium">Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-neutral-primary border-border-default">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-body-subtle tabular-nums mt-2 sm:mt-0">
            1–10 of 8967
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto grid grid-cols-2 sm:flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 border-border-default text-body hover:bg-neutral-secondary flex items-center gap-1 justify-center sm:justify-start"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 border-border-default text-body hover:bg-neutral-secondary flex items-center gap-1 justify-center sm:justify-start"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
