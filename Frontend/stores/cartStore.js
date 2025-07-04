import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            // Increase quantity if already in cart
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          // Add new item with quantity 1
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => get().cart.reduce((sum, item) => sum + item.price, 0),
      getCartCount: () => {
        const cart = get().cart;
        // Count unique product IDs
        const uniqueIds = new Set(cart.map(item => item.id));
        return uniqueIds.size;
      },
      increaseQuantity: (itemId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decreaseQuantity: (itemId) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
