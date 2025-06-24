import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import type { Participant } from "../../../types";

const roles = [
  { value: "CREATOR", label: "Creator" },
  { value: "ADMIN", label: "Admin" },
  { value: "DEBATER", label: "Debater" },
  { value: "OBSERVER", label: "Observer" },
];

const RoleCombobox = ({
  participant,
  isAdmin,
  isClosed,
  onRoleChange,
}: {
  participant: Participant;
  isAdmin: boolean;
  isClosed: boolean;
  onRoleChange: (participantId: number, newRole: string) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const isDisabled = participant?.role === "CREATOR";

  // Sync initial value when participant changes
  useEffect(() => {
    if (participant?.role) {
      setValue(participant.role);
    }
  }, [participant]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          disabled={isDisabled || !isAdmin || isClosed}
        >
          {value
            ? roles.find((role) => role.value === value)?.label
            : "Select role..."}
          {!isDisabled && isAdmin && !isClosed && (
            <ChevronsUpDown className="opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="dark w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search role..." className="h-9" />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => {
                if (role.value !== "CREATOR") {
                  return (
                    <CommandItem
                      key={role.value}
                      value={role.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                        onRoleChange(participant.id, currentValue);
                      }}
                    >
                      {role.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === role.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                }
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RoleCombobox;
