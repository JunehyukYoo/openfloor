// components/dashboard/nav-main.tsx
// See https://ui.shadcn.com/docs for more
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../../../api/axios";
import type { TopicDataMini } from "../../types";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [gotTopics, setGotTopics] = useState<boolean>(false);
  const [allTopics, setAllTopics] = useState<TopicDataMini[] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicDataMini | null>(
    null
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!selectedTopic) {
      toast.error("Please select a topic.");
      return;
    }
    try {
      await api.post("/debates/create", {
        topicId: selectedTopic.id,
        isPrivate,
      });
      toast.success("Debate created!", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsDialogOpen(false);
      // TODO: Navigate user to the newly created debate page
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
  };

  useEffect(() => {
    const getTopics = async () => {
      try {
        const { data } = await api.get("/topics/all");
        setAllTopics(data.allTopics);
      } catch (error) {
        if (axios.isAxiosError(error)) {
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
    };
    getTopics();
  }, [gotTopics]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* Create debate dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <div className="w-full">
                <DialogTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    onClick={() => {
                      if (!gotTopics) setGotTopics(true);
                    }}
                  >
                    <IconCirclePlusFilled />
                    <span>Quick Create</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="dark sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create a debate</DialogTitle>
                    <DialogDescription>
                      Choose a topic and create a debate!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 overflow-y-scroll">
                    <div className="flex self-end gap-2">
                      <Label htmlFor="is-private">Private</Label>
                      <Switch
                        id="is-private"
                        checked={isPrivate}
                        onCheckedChange={() => {
                          setIsPrivate(!isPrivate);
                        }}
                      />
                    </div>

                    {allTopics && (
                      <Autocomplete
                        disablePortal
                        options={allTopics || []}
                        getOptionLabel={(option) => option.title}
                        onChange={(_, newValue) => setSelectedTopic(newValue)}
                        sx={{
                          width: "100%",
                          fontFamily: "Poppins",
                          "& .MuiInputBase-root": {
                            color: "white",
                            backgroundColor: "transparent",
                            border: "1px solid oklch(27.4% 0.006 286.033)",
                            borderRadius: "0.5rem",
                            paddingRight: "8px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
                          },
                          "& .MuiInputLabel-root": {
                            color: "white",
                          },
                          "&:hover .MuiOutlinedInput-root": {
                            borderColor: "oklch(55.2% 0.016 285.938)",
                          },
                          "&:focus .MuiOutlinedInput-root": {
                            borderColor: "white",
                          },
                        }}
                        slotProps={{
                          paper: {
                            sx: {
                              fontFamily: "Poppins",
                              backgroundColor: "oklch(16.376% 0.00002 271.152)",
                              color: "oklch(0.705 0.015 286.067)",
                              borderRadius: "0.5rem",
                              border: "5px",
                              borderColor: "oklch(44.2% 0.017 285.786)",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                              "& .MuiAutocomplete-option": {
                                paddingY: "0.5rem",
                                paddingX: "1rem",
                                "&:hover": {
                                  backgroundColor:
                                    "oklch(100% 0.00011 271.152/0.1)",
                                },
                                '&[aria-selected="true"]': {
                                  backgroundColor: "#88888",
                                },
                              },
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Topic"
                            label=""
                            sx={{
                              "& .MuiInputLabel-root": {
                                color: "white !important",
                                transform: "none", // Prevent animation
                                position: "static", // Keep it in place
                                fontSize: "1rem", // Same as input text
                                fontFamily: "Poppins",
                              },
                              "& .MuiInputBase-input": {
                                color: "oklch(0.705 0.015 286.067)",
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleCreate}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </div>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={location.pathname === item.url}
                onClick={() => {
                  navigate(item.url);
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
