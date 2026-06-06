import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";
import { X } from "lucide-react";

interface SelectedUserListProps {
  invitedUsers: Friend[];
  onRemove: (user: Friend) => void;
}

const SelectedUserList = ({
  invitedUsers,
  onRemove,
}: SelectedUserListProps) => {
  if (invitedUsers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {invitedUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-2 rounded-full bg-muted py-1 pl-1 pr-2 text-sm"
        >
          <UserAvatar
            type="chat"
            name={user.displayName}
            avatarUrl={user.avatarUrl}
          />
          <span className="max-w-28 truncate">{user.displayName}</span>
          <button
            type="button"
            className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(user)}
            aria-label={`Remove ${user.displayName}`}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedUserList;
