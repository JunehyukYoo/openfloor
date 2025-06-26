// components/dashboard/debates/InfoTabs.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { IconX } from "@tabler/icons-react";
import { Button } from "../../ui/button";
import { hasAdminPermissions } from "../../../utils/debateUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { SiteHeader as PageHeader } from "../site-header";
import { useDebateContext } from "../../../context/debateContext";
import RoleCombobox from "./RoleCombobox";
import InviteLinks from "./InviteLinks";
import { Separator } from "../../ui/separator";
import { Avatar, AvatarImage } from "../../ui/avatar";
import api from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Some things to note:
// 1. The `RoleCombobox` component is a custom component that allows admins
//    (CREATOR/ADMIN roles) to change the role of participants in the debate.
// 2. For public debates, users are defaulted to VIEWER role, but may join as a
//    participant with the role of DEBATER.
const InfoTabs = () => {
  const { debate, userDetails, refreshDebate } = useDebateContext();
  const isViewer = !userDetails;
  const userIsAdmin = !isViewer && hasAdminPermissions(userDetails.role);
  const navigate = useNavigate();

  if (!debate) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debate" breadcrumb="Invalid" />
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Debate not found.</p>
        </div>
      </div>
    );
  }

  // Admin controls for participants tab
  const handleRoleChange = async (participantId: number, newRole: string) => {
    try {
      await api.put(
        `/debates/${debate.id}/participants/${participantId}/role`,
        {
          role: newRole,
        }
      );
      toast.success("Role updated successfully.", {
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating role:", error);
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

  // Remove participant in participants tab
  const handleRemoveParticipant = async (participantId: number) => {
    try {
      await api.delete(`/debates/${debate.id}/participants/${participantId}`);
      toast.success("Participant deleted successfully.", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting participant:", error);
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

  // Joining a public debate as a debater
  const handleJoinDebate = async () => {
    try {
      await api.post(`/debates/${debate.id}/join`);
      toast.success("Successfully joined debate. Reloading the page.", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        refreshDebate();
      }, 500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error joining debate:", error);
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

  // Leaving a debate
  const handleLeaveDebate = async () => {
    try {
      await api.delete(`/debates/${debate.id}/leave`);
      toast.success("Successfully left debate", {
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
      navigate("/dashboard/debates");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error leaving debate:", error);
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

  // Ending a debate as a creator/admin
  const handleEndDebate = async () => {
    try {
      await api.put(`/debates/${debate.id}/end`);
      toast.success("Successfully ended debate", {
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
      navigate("/dashboard/debates");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error ending debate:", error);
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

  // Deleting a debate
  const handleDeleteDebate = async () => {
    try {
      navigate("/dashboard/debates");
      await api.delete(`/debates/${debate.id}`);
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
      refreshDebate();
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
  };

  return (
    <Tabs defaultValue="debate">
      <Card className="bg-neutral-900 h-full overflow-x-scroll">
        <CardHeader>
          <TabsList>
            <TabsTrigger value="debate">Debate</TabsTrigger>
            {userIsAdmin && !debate.closed && (
              <TabsTrigger value="invite">Invites</TabsTrigger>
            )}
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </CardHeader>
        {/* Debate tab */}
        <TabsContent value="debate">
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-left">
              <CardTitle className="text-xl font-semibold">
                Debate Details
              </CardTitle>
              <CardDescription className="text-md">
                <p>
                  <span className="font-medium">Debate ID:</span> {debate.id}
                </p>
                <p>
                  <span className="font-medium">Topic ID:</span>{" "}
                  {debate.topic.id}
                </p>
                <p>
                  <span className="font-medium">Creator:</span>{" "}
                  {debate.creator.username}
                </p>
                <p>
                  <span className="font-medium">Started:</span>{" "}
                  {new Date(debate.started).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {debate.closed ? (
                    <span className="text-red-500">Closed</span>
                  ) : (
                    <span className="text-green-500">Open</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Participants:</span>{" "}
                  {debate.participants.length}
                </p>
              </CardDescription>
            </div>
          </CardContent>
        </TabsContent>
        {/* Invite tab */}
        <TabsContent value="invite">
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-xl text-left font-semibold">
              Invites
            </CardTitle>
            <InviteLinks />
          </CardContent>
        </TabsContent>
        {/* Pariticipants tab */}
        <TabsContent value="participants">
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-xl text-left font-semibold">
              Participants
            </CardTitle>
            {debate.participants.length > 0 ? (
              <Card className="bg-neutral-800/[0.5] max-h-80 p-4 rounded-lg flex flex-col gap-4 overflow-y-scroll">
                {debate.participants.map((participant, idx) => {
                  // The last participant doesn't have a separator at the end
                  if (idx === debate.participants.length - 1) {
                    return (
                      <div key={participant.id}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={participant.user.profilePicture}
                                alt={participant.user.username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </Avatar>
                            <div className="flex flex-col text-left">
                              <span className="font-medium">
                                {participant.user.username}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {participant.user.email}
                              </span>
                            </div>
                          </div>
                          {/* Role controls */}
                          <div className="flex gap-1">
                            <RoleCombobox
                              participant={participant}
                              isAdmin={userIsAdmin}
                              isClosed={debate.closed}
                              onRoleChange={handleRoleChange}
                            />
                            {userIsAdmin && participant.role !== "CREATOR" && (
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveParticipant(participant.id)
                                }
                              >
                                <IconX stroke={3} className="stroke-red-400" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <>
                      <div key={participant.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={participant.user.profilePicture}
                                alt={participant.user.username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </Avatar>
                            <div className="flex flex-col text-left">
                              <span className="font-medium">
                                {participant.user.username}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {participant.user.email}
                              </span>
                            </div>
                          </div>
                          {/* Role controls */}
                          <div className="flex">
                            <RoleCombobox
                              participant={participant}
                              isAdmin={userIsAdmin}
                              isClosed={debate.closed}
                              onRoleChange={handleRoleChange}
                            />
                            {userIsAdmin && participant.role !== "CREATOR" && (
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveParticipant(participant.id)
                                }
                              >
                                <IconX stroke={3} className="stroke-red-400" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  );
                })}
              </Card>
            ) : (
              <div>No participants yet.</div>
            )}
          </CardContent>
        </TabsContent>
        {/* Settings Tab */}
        <TabsContent value="settings">
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-left text-xl font-semibold">
              Settings
            </CardTitle>
            {!debate.closed ? (
              isViewer ? (
                <div className="flex flex-col gap-2">
                  <CardDescription className="flex flex-col text-left text-md">
                    You are currently viewing this debate as a guest.
                  </CardDescription>
                  <Button variant="default" onClick={handleJoinDebate}>
                    Join debate as a Debater
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription className="flex flex-col text-left text-md">
                    <p>
                      <span className="font-medium">Your role:</span>
                      {" " + userDetails!.role.toLowerCase()}
                    </p>
                    <p>
                      <span className="font-medium">Joined:</span>
                      {" " +
                        new Date(userDetails!.joinedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </p>
                  </CardDescription>
                  {userIsAdmin ? (
                    <Button variant="default" onClick={handleEndDebate}>
                      End Debate
                    </Button>
                  ) : (
                    <Button variant="default" onClick={handleLeaveDebate}>
                      Leave Debate
                    </Button>
                  )}
                  {userDetails.role === "CREATOR" && (
                    <Button variant="destructive" onClick={handleDeleteDebate}>
                      Delete Debate
                    </Button>
                  )}
                </>
              )
            ) : (
              <CardDescription className="flex flex-col text-left">
                Debate is closed. You can no longer join or leave.
              </CardDescription>
            )}
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default InfoTabs;
