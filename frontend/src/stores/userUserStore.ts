import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });

        //gọi lại hàm fectConversations để update avatar hiển thị ở sidebard của các conversations
        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Error while updateAvatarUrl", error);
      toast.error("Upload avatar không thành công");
    }
  },
}));
