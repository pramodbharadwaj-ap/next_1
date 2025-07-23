import { create } from "zustand";
import { useEffect } from "react";

type WishlistItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type WishlistState = {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  hydrate: () => void;
};

const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistItems: [],
  addToWishlist: (item) => {
    set((state) => {
      if (state.wishlistItems.some((i) => i.id === item.id)) return state;
      const updated = [...state.wishlistItems, item];
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(updated));
      }
      return { wishlistItems: updated };
    });
  },
  removeFromWishlist: (id) => {
    set((state) => {
      const updated = state.wishlistItems.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(updated));
      }
      return { wishlistItems: updated };
    });
  },
  isInWishlist: (id) => get().wishlistItems.some((item) => item.id === id),
  hydrate: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishlist");
      set({ wishlistItems: stored ? JSON.parse(stored) : [] });
    }
  },
}));

// Custom hook to hydrate wishlist on client
export function useHydrateWishlist() {
  const hydrate = useWishlistStore((state) => state.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
}

export default useWishlistStore;