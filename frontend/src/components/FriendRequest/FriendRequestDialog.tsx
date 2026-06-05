import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStore } from "@/stores/useFriendStore";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState("received");
  const { getAllFriendRequests, receivedList, sentList } = useFriendStore();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        await getAllFriendRequests();
      } catch (error) {
        console.error("Error while load requests", error);
      }
    };

    loadRequest();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Lời mời kết bạn</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid h-10 w-full grid-cols-2">
            <TabsTrigger
              value="received"
              className="group/request-tab gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span>Đã nhận</span>
              <span className="rounded-full bg-background/80 px-1.5 py-0.5 text-xs leading-none text-foreground group-data-[state=active]/request-tab:bg-primary-foreground/20 group-data-[state=active]/request-tab:text-primary-foreground">
                {receivedList.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="group/request-tab gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span>Đã gửi</span>
              <span className="rounded-full bg-background/80 px-1.5 py-0.5 text-xs leading-none text-foreground group-data-[state=active]/request-tab:bg-primary-foreground/20 group-data-[state=active]/request-tab:text-primary-foreground">
                {sentList.length}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="received"
            className="mt-3 rounded-md border border-border/60 bg-background/70 p-3"
          >
            <ReceivedRequests />
          </TabsContent>
          <TabsContent
            value="sent"
            className="mt-3 rounded-md border border-border/60 bg-background/70 p-3"
          >
            <SentRequests />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
