import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlusIcon, Send } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { toast } from "sonner";
import { useChatStore } from "@/stores/useChatStore";
import { useSocketStore } from "@/stores/useSocketStore";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");
  const { socket } = useSocketStore();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitTypingStart = () => {
    if (!socket || !selectedConvo?._id) return;

    socket.emit("typing:start", {
      conversationId: selectedConvo._id,
    });
  };

  const emitTypingStop = () => {
    if (!socket || !selectedConvo?._id) return;

    socket.emit("typing:stop", {
      conversationId: selectedConvo._id,
    });
  };

  // cleanup useEffect, dùng để dọn dẹp typing timeout
  // và gửi trạng thái ngừng gõ khi đổi conversation hoặc khi component bị unmount.
  useEffect(() => {
    return () => {
      // Nếu user đang gõ ở conversation A, sau đó chuyển nhanh sang conversation B, timer cũ của conversation A vẫn có thể còn tồn tại.
      // Nếu không clear, sau 1.5 giây nó vẫn chạy và có thể emit sai trạng thái.
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current); //hủy timer cũ
        typingTimeoutRef.current = null;
      }

      emitTypingStop();
    };
  }, [selectedConvo._id]);

  if (!user) return;

  const sendMessage = async () => {
    if (!value.trim()) return;
    const currValue = value;
    setValue("");
    emitTypingStop();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];

        await sendDirectMessage(otherUser._id, currValue);
      } else {
        await sendGroupMessage(selectedConvo._id, currValue);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while sending message. Please try again");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setValue(nextValue);

    if (!nextValue.trim()) {
      emitTypingStop();
      return;
    }

    emitTypingStart();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStop();
    }, 1500);
  };

  return (
    <div className="flex items-center gap-2 p-3 min-h-[56px] bg-background">
      <Button
        variant={"ghost"}
        size="icon"
        className="hover:bg-primary/10 transition-smooth"
      ></Button>
      <div className="flex-1 relative">
        <Input
          onKeyPress={handleKeyPress}
          value={value}
          onChange={handleInputChange}
          placeholder="Soạn tin nhắn"
          className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
        ></Input>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size={"icon"}
            className="size-8 hover:bg-primary/10 transition-smooth"
          >
            <div>
              <EmojiPicker
                onChange={(emoji: string) => setValue(`${value}${emoji}`)}
              />
            </div>
          </Button>
        </div>
      </div>
      <Button
        onClick={sendMessage}
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
      >
        <Send className="size-4 text-white" />
      </Button>
      <ImagePlusIcon className="size-4" />
    </div>
  );
};

export default MessageInput;
