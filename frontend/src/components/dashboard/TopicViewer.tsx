import { useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import type { TopicData } from "../../types";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";

const TopicViewer = ({ item, title }: { item: TopicData; title: string }) => {
  const isMobile = useIsMobile();
  const [showClosed, setShowClosed] = useState(false);
  return (
    <div className="dark">
      <Drawer direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger asChild>
          <div className="text-left pl-4">
            <Button
              variant="link"
              className="text-foreground w-fit px-0 text-left"
            >
              {title}
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent className="dark">
          <DrawerHeader className="gap-1">
            <DrawerTitle>{item.title}</DrawerTitle>
            <DrawerDescription>
              Topic has a total of {item.totalCount} private/public debates.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <Separator />
            <div className="grid gap-2">
              <div className="flex gap-2 leading-none font-medium">
                Blah blah blah
              </div>
              <div className="text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
                praesentium reiciendis sequi explicabo! Dolorem suscipit odio,
                quas nihil perferendis quis, deserunt, sequi autem consequuntur
                doloremque iure magni ipsam aliquam dolor.
              </div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="flex gap-2 leading-none font-medium">
                Public Debates
              </div>
              <div className="flex items-center space-x-2">
                {item.debates.length !== 0 && (
                  <>
                    <Switch
                      id="show-private"
                      checked={showClosed}
                      onCheckedChange={() => setShowClosed(!showClosed)}
                    />
                    <Label htmlFor="show-private">Show closed debates</Label>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 overflow-scroll">
              <div className="grid p-2 grid-cols-2 gap-3">
                {item.debates.length ? (
                  item.debates.map((d, idx) => {
                    if (d.closed && showClosed) {
                      return (
                        <Card
                          key={d.creatorId + idx}
                          className="gap-4 bg-neutral-800 opacity-40 col-span-1 hover:scale-102 hover:opacity-60 transition:all duration-300"
                        >
                          <CardHeader>
                            <CardAction>
                              <Badge variant="outline">Closed</Badge>
                            </CardAction>
                          </CardHeader>
                          <CardContent>
                            <CardTitle>{d.creatorUsername}'s debate</CardTitle>
                            <CardDescription>
                              {d.participantCount} participants
                            </CardDescription>
                          </CardContent>
                        </Card>
                      );
                    }
                    if (!d.closed) {
                      return (
                        <Card
                          key={d.creatorId + idx}
                          className="gap-4 bg-neutral-800 col-span-1 hover:scale-102 transition:all duration-300"
                        >
                          <CardHeader>
                            <CardAction>
                              <Badge variant="outline">Open</Badge>
                            </CardAction>
                          </CardHeader>
                          <CardContent>
                            <CardTitle>{d.creatorUsername}'s debate</CardTitle>
                            <CardDescription>
                              {d.participantCount} participants
                            </CardDescription>
                          </CardContent>
                        </Card>
                      );
                    }
                  })
                ) : (
                  <div className="col-span-2 translate-x-[-0.5rem]">
                    Nothing here yet. Create your very own debate!
                  </div>
                )}
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="destructive">Report</Button>
            <Separator />
            <Button variant="default">Create Debate</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TopicViewer;
