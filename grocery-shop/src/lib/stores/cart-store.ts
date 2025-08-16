import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '../types';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getItemCount: (productId: string, variantId?: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product, variant, quantity = 1) => {
        const existingItemIndex = get().items.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.variant?.id === variant?.id
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...get().items];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedItems[existingItemIndex].totalPrice =
            updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;

          set({
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
          });
        } else {
          const price = variant?.price || product.price;
          const newItem: CartItem = {
            id: `${product.id}_${variant?.id || 'default'}`,
            product,
            variant,
            quantity,
            price,
            totalPrice: price * quantity,
          };

          const updatedItems = [...get().items, newItem];
          set({
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
          });
        }
      },

      removeItem: (itemId) => {
        const updatedItems = get().items.filter((item) => item.id !== itemId);
        set({
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, totalPrice: item.price * quantity }
            : item
        );

        set({
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
        });
      },

      clearCart: () => set({ items: [], total: 0 }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getItemCount: (productId, variantId) => {
        const item = get().items.find(
          (item) =>
            item.product.id === productId &&
            item.variant?.id === variantId
        );
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);