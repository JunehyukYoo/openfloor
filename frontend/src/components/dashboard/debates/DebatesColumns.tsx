import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import api from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import type { DebateDataMini } from "../../../types";
import { Badge } from "../../ui/badge";

export const getDebateColumns = (
  navigate: (path: string) => void,
  refreshDebates: () => void
): ColumnDef<DebateDataMini>[] => [
  {
    accessorKey: "debate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Debate Room
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const debate = row.original.debate;
      return (
        <div className="text-left">
          <Button
            variant="link"
            className="font-medium m-0 p-0 pl-3"
            onClick={() => navigate(`${debate.id}`)}
          >
            {`${debate.creator?.username}'s Debate`}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {String(row.getValue("role")).toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "closed",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const closed = row.original.debate.closed;
      return (
        <Badge
          variant="outline"
          className={
            closed ? "text-red-500 text-right" : "text-green-500 text-right"
          }
        >
          {closed ? "Closed" : "Open"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "private",
    header: () => <div className="text-right">Privacy</div>,
    cell: ({ row }) => {
      const isPrivate = row.original.debate.private;
      return (
        <Badge variant="outline">{isPrivate ? "Private" : "Public"}</Badge>
      );
    },
  },
  {
    id: "topic",
    accessorFn: (row) => row.debate.topic?.title || "",
    header: () => <div className="text-center">Topic</div>,
    cell: ({ row }) => {
      const topicTitle = row.original.debate.topic?.title;
      return <div className="text-s text-center">{topicTitle}</div>;
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const joinedAt = new Date(row.getValue("joinedAt")).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
      return <div className="text-xs">{joinedAt}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
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
              navigator.clipboard.writeText(String(row.original.debate.topicId))
            }
          >
            Copy Topic ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-400">
            Report Debate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-400"
            onClick={async () => {
              try {
                await api.delete(`/debates/${row.original.debate.id}`);
                toast.success("Successfully deleted debate", {
                  position: "top-right",
                  theme: "dark",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                refreshDebates();
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  console.error("Error deleting debate:", error);
                  toast.error(error.message, {
                    position: "top-right",
                    theme: "dark",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              }
            }}
          >
            Delete Debate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
