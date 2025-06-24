// components/dashboard/debates/DebateTable.tsx
// See https://ui.shadcn.com/docs for more
"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Debate, DebateDataMini } from "../../../types";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router-dom";

const DebateLinkCell = ({ debate }: { debate: Debate }) => {
  const navigate = useNavigate();
  return (
    <div className="text-left">
      <Button
        variant="link"
        className="font-medium m-0 p-0 pl-3"
        onClick={() => navigate(`${debate.id}`)}
      >{`${debate.creator?.username}'s Debate`}</Button>
    </div>
  );
};

// Table column definition
export const columns: ColumnDef<DebateDataMini>[] = [
  {
    accessorKey: "debate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Debate Room
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <DebateLinkCell debate={row.original.debate} />;
    },
  },
  {
    accessorKey: "role",
    header: () => {
      return <div className="text-right">Role</div>;
    },
    cell: ({ row }) => {
      const role = row.getValue("role");
      return (
        <div className="capitalize text-right">
          {String(role).toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "debate.closed",
    header: () => {
      return <div className="text-right">Status</div>;
    },
    cell: ({ row }) => {
      const closed = row.original.debate.closed;
      return (
        <div
          className={
            closed ? "text-red-500 text-right" : "text-green-500 text-right"
          }
        >
          {closed ? "Closed" : "Open"}
        </div>
      );
    },
  },
  {
    accessorKey: "debate.private",
    header: () => {
      return <div className="text-right">Privacy</div>;
    },
    cell: ({ row }) => {
      const isPrivate = row.original.debate.private;
      return (
        <div className="text-right">{isPrivate ? "Private" : "Public"}</div>
      );
    },
  },
  {
    id: "topic",
    accessorFn: (row) => row.debate.topic?.title || "",
    header: () => {
      return <div className="text-center">Topic</div>;
    },
    cell: ({ row }) => {
      const topicTitle = row.original.debate.topic?.title;
      return <div className="text-xs text-center">{topicTitle}</div>;
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Joined At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const joinedAt = new Date(row.getValue("joinedAt")).toLocaleString();
      return <div className="text-xs text-right">{joinedAt}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(row.original.debate.id))
              }
            >
              Copy Debate ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  String(row.original.debate.topicId)
                )
              }
            >
              Copy topic ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400">
              Report Debate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Table here
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DebateTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          id="table-filter"
          placeholder="Filter by Topic..."
          value={(table.getColumn("topic")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("topic")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
