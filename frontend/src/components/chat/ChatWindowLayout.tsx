import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";
import { useSocketStore } from "@/stores/useSocketStore";

const ChatWindowLayout = () => {
  const { typingUsers } = useSocketStore();

  const {
    activeConversationId,
    conversations,
    messageLoading: loading,
    markAsSeen,
  } = useChatStore();

  const selectedConvo =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  const currentTypingUsers = selectedConvo
    ? (typingUsers[selectedConvo._id] ?? [])
    : [];

  const typingText =
    currentTypingUsers.length === 1
      ? `${currentTypingUsers[0].displayName} đang nhập...`
      : currentTypingUsers.length > 1
        ? `${currentTypingUsers.length} người đang nhập`
        : "";

  useEffect(() => {
    if (!selectedConvo) {
      return;
    }

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error("Error while marking seen", error);
      }
    };

    markSeen();
  }, [markAsSeen, selectedConvo]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>

      {typingText && (
        <div className="px-4 py-1 text-xs text-muted-foreground bg-background">
          {typingText}
        </div>
      )}

      {/* Footer */}
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
