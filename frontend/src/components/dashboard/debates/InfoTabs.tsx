// components/dashboard/debates/InfoTabs.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { hasAdminPermissions } from "../../../utils/debateUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import type { DebateDataFull, Participant } from "../../../types";
import RoleCombobox from "./RoleCombobox";
import { Separator } from "../../ui/separator";
import { Avatar, AvatarImage } from "../../ui/avatar";
import api from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";

const InfoTabs = ({
  debate,
  userDetails,
}: {
  debate: DebateDataFull;
  userDetails: Participant;
}) => {
  const userIsAdmin = hasAdminPermissions(userDetails.role);
  const handleRoleChange = async (participantId: number, newRole: string) => {
    try {
      await api.put(`/participants/${participantId}/role`, {
        role: newRole,
      });
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

  return (
    <Tabs>
      <Card className="bg-neutral-900">
        <CardHeader>
          <TabsList defaultValue="debate">
            <TabsTrigger value="debate">Debate</TabsTrigger>
            {userIsAdmin && <TabsTrigger value="invite">Invite</TabsTrigger>}
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
              <CardDescription>
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
                  {debate.closed ? "Closed" : "Open"}
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
              Invite Participants
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Invite participants to join the debate by sharing the debate link
              or by entering their email addresses below. Todo later.
            </CardDescription>
          </CardContent>
        </TabsContent>
        {/* Pariticipants tab */}
        <TabsContent value="participants">
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-xl text-left font-semibold">
              Participants
            </CardTitle>
            {debate.participants.length > 0 ? (
              <Card className="bg-neutral-800/[0.5] max-h-65 p-4 rounded-lg flex flex-col gap-4 overflow-y-scroll">
                {debate.participants.map((participant, idx) => {
                  if (idx === debate.participants.length - 1) {
                    return (
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
                          {/* Add control here */}
                          <RoleCombobox
                            participant={participant}
                            isAdmin={userIsAdmin}
                            onRoleChange={handleRoleChange}
                          />
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
                          {/* Add control here */}
                          <RoleCombobox
                            participant={participant}
                            isAdmin={userIsAdmin}
                            onRoleChange={handleRoleChange}
                          />
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
            <CardDescription className="flex flex-col text-left">
              <p>
                <span className="font-medium">Your role:</span>
                {" " + userDetails!.role.toLowerCase()}
              </p>
              <p>
                <span className="font-medium">Joined:</span>
                {" " +
                  new Date(userDetails!.joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </CardDescription>
            {userDetails!.role === "CREATOR" ? (
              <Button variant="destructive">End Debate</Button>
            ) : (
              <Button variant="destructive">Leave Debate</Button>
            )}
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default InfoTabs;
