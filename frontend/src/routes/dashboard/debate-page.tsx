// routes/dashboard/debate-page.tsx
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import api from "../../../api/axios";
import type { SingleDebateData } from "../../types";
import { Separator } from "../../components/ui/separator";

function hasAdminPermissions(role: string): boolean {
  return role === "ADMIN" || role === "CREATOR";
}

const DebatePage = () => {
  const { id } = useParams();
  const [debate, setDebate] = useState<SingleDebateData | null>(null);
  const [userRole, setUserRole] = useState<string>("OBSERVER");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getDebate = async () => {
      try {
        const { data } = await api.get(`/dashboard/debates/${id}`);
        setDebate(data.debate);
        setUserRole(data.userRole);
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
      } finally {
        setLoading(false);
      }
    };
    getDebate();
  }, [id]);
  if (loading) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debate" />
        <LoadingScreen />
      </div>
    );
  } else if (!debate) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debate" breadcrumb="Invalid" />
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Debate not found.</p>
        </div>
      </div>
    );
  }
  console.log(userRole);
  return (
    <div>
      <PageHeader
        title="Debates"
        breadcrumb={`${debate?.creator.username}'s Debate`}
      />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="text-left scroll-m-20 text-4xl font-bold text-balance">
          {debate.topic.title}
        </h1>
        <Separator />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stances Section */}
          <Card className="bg-neutral-900">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Stances</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {debate.stances.length > 0 ? (
                debate.stances.map((stance) => {
                  return (
                    <Card
                      key={stance.id}
                      className="p-4 bg-neutral-800/[0.5] rounded-lg hover:bg-neutral-800 transition duration-300"
                    >
                      <h3 className="text-lg text-left font-semibold">
                        {stance.label}
                      </h3>
                    </Card>
                  );
                })
              ) : hasAdminPermissions(userRole) ? (
                <p>Add a new stance!</p>
              ) : (
                <p>No stances yet avaliable.</p>
              )}
            </CardContent>
          </Card>
          {/* Info section (w/ tabs) */}
          <Tabs>
            <Card className="bg-neutral-900">
              <CardHeader>
                <TabsList defaultValue="debate">
                  <TabsTrigger value="debate">Debate</TabsTrigger>
                  {hasAdminPermissions(userRole) && (
                    <TabsTrigger value="invite">Invite</TabsTrigger>
                  )}
                  <TabsTrigger value="participants">
                    Participants ({debate.participants.length})
                  </TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </CardHeader>
              <TabsContent value="debate">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 text-left">
                    <h2 className="text-xl font-semibold">Debate Details</h2>
                    <CardDescription>
                      <p>
                        <span className="font-medium">Debate ID:</span>{" "}
                        {debate.id}
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
              <TabsContent value="invite">
                <CardContent className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold">Invite Participants</h2>
                  <CardDescription className="text-sm text-muted-foreground">
                    Invite participants to join the debate by sharing the debate
                    link or by entering their email addresses below. Todo later.
                  </CardDescription>
                </CardContent>
              </TabsContent>
              <TabsContent value="settings">
                <CardContent className="flex gap-4">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <CardDescription className="flex gap-4">
                    <p>
                      Your role: <span className="font-medium">{userRole}</span>
                    </p>
                    {userRole === "CREATOR" ? (
                      <Button variant="destructive">End Debate</Button>
                    ) : (
                      <Button variant="destructive">Leave Debate</Button>
                    )}
                  </CardDescription>
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DebatePage;
