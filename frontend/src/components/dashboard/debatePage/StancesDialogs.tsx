// components/dashboard/debatePage/StancesDialogs.tsx
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "../../ui/dialog";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useDebateContextNonNull } from "../../../context/debateContext";
import api from "../../../../api/axios";
import { toast } from "react-toastify";

export const EditStances = () => {
  const { debate, refreshDebate } = useDebateContextNonNull();
  const [open, setOpen] = useState(false);
  const [stanceUpdates, setStanceUpdates] = useState<{ [key: number]: string }>(
    () =>
      Object.fromEntries(
        debate.stances.map((stance) => [stance.id, stance.label])
      )
  );
  const [stancesToDelete, setStancesToDelete] = useState<number[]>([]);

  const handleLabelChange = (stanceId: number, newLabel: string) => {
    setStanceUpdates((prev) => ({ ...prev, [stanceId]: newLabel }));
  };

  const handleDeleteToggle = (stanceId: number, checked: boolean) => {
    if (checked) {
      setStancesToDelete((prev) => [...prev, stanceId]);
    } else {
      setStancesToDelete((prev) => prev.filter((id) => id !== stanceId));
    }
  };

  // Whenever a new stance is added, update stance updates state
  useEffect(() => {
    setStanceUpdates(
      Object.fromEntries(
        debate.stances.map((stance) => [stance.id, stance.label])
      )
    );
  }, [debate.stances]);

  const handleSubmit = async () => {
    try {
      await api.put(`/debates/${debate.id}/stances`, {
        updatedStances: Object.entries(stanceUpdates).map(([id, label]) => ({
          id: Number(id),
          label,
        })),
        stancesToDelete,
      });

      toast.success("Stances updated successfully.", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      refreshDebate();
      setOpen(false);
    } catch (error) {
      console.error("Error updating stances:", error);
      toast.error("Failed to update stances.", {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <DialogContent className="sm:max-w-[500px] dark">
        <DialogHeader>
          <DialogTitle>Edit Stances</DialogTitle>
          <DialogDescription>
            Make changes to stances here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {debate.stances.length > 0 ? (
          <div className="grid gap-4">
            {debate.stances.map((stance) => (
              <div key={`${stance.id}-edit`} className="grid gap-3">
                <Label>Stance ID: {stance.id}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name={`${stance.id}-edit`}
                    maxLength={100}
                    value={stanceUpdates[stance.id]}
                    onChange={(e) =>
                      handleLabelChange(stance.id, e.target.value)
                    }
                  />
                  <Label className="text-right">Delete?</Label>
                  <Checkbox
                    checked={stancesToDelete.includes(stance.id)}
                    onCheckedChange={(checked) =>
                      handleDeleteToggle(stance.id, checked as boolean)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No stances, add one first.</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AddStances = () => {
  const { debate, refreshDebate } = useDebateContextNonNull();
  const [open, setOpen] = useState(false);
  const [newStances, setNewStances] = useState<string[]>([""]);

  const handleAddInput = () => {
    setNewStances((prev) => [...prev, ""]);
  };

  const handleRemoveInput = (index: number) => {
    setNewStances((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, value: string) => {
    setNewStances((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const stancesToCreate = newStances.filter((label) => label.trim() !== "");

    if (stancesToCreate.length === 0) {
      toast.error("Please enter at least one stance.");
      return;
    }

    try {
      await api.post(`/debates/${debate.id}/stances`, {
        stances: stancesToCreate,
      });

      toast.success("Stances added successfully.", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      refreshDebate();
      setOpen(false);
      setNewStances([""]);
    } catch (error) {
      console.error("Error adding stances:", error);
      toast.error("Failed to add stances.", {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add
      </Button>
      <DialogContent className="sm:max-w-[500px] dark">
        <DialogHeader>
          <DialogTitle>Add Stances</DialogTitle>
          <DialogDescription>
            Add one or more new stances for this debate.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {newStances.map((stance, index) => (
            <div
              key={`stance-${index}-new`}
              className="flex gap-2 items-center"
            >
              <Input
                placeholder={`Stance ${index + 1}`}
                value={stance}
                maxLength={100}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              {newStances.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => handleRemoveInput(index)}
                  className="h-10 px-3"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={handleAddInput} className="mt-4">
          Add Another Stance
        </Button>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
