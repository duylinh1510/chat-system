import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

const ReceivedRequests = () => {
  const { acceptRequest, declineRequest, loading, receivedList } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
        Bạn chưa có lời mời kết bạn nào
      </p>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success("Đồng ý kết bạn thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info("Đã từ chối kết bạn!");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="space-y-3">
      {receivedList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          actions={
            <div className="flex items-center gap-2">
              <Button
                size={"sm"}
                variant="default"
                className="w-24 shadow-xs"
                onClick={() => handleAccept(req._id)}
                disabled={loading}
              >
                <Check className="size-4" />
                Chấp nhận
              </Button>
              <Button
                size={"sm"}
                variant="outline"
                className="w-20 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
                onClick={() => handleDecline(req._id)}
                disabled={loading}
              >
                <X className="size-4" />
                Từ chối
              </Button>
            </div>
          }
          type={"received"}
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
