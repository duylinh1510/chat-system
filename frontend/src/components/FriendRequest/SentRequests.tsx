import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SentRequests = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {sentList.map((req) => (
        <FriendRequestItem
          key={req._id}
          requestInfo={req}
          type="sent"
          actions={
            <p className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              Đang chờ trả lời...
            </p>
          }
        />
      ))}
    </div>
  );
};

export default SentRequests;
