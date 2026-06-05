import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "../chat/UserAvatar";

interface RequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: "sent" | "received";
}

const FriendRequestItem = ({
  requestInfo,
  actions,
  type,
}: RequestItemProps) => {
  if (!requestInfo) return null;
  const info = type === "sent" ? requestInfo.to : requestInfo.from;

  if (!info) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-card p-3 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar
          type="sidebar"
          name={info.displayName}
          avatarUrl={info.avatarUrl}
        />
        <div className="min-w-0">
          <p className="truncate font-medium">{info.displayName}</p>
          <p className="truncate text-sm text-muted-foreground">
            @{info.username}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center">{actions}</div>
    </div>
  );
};

export default FriendRequestItem;
