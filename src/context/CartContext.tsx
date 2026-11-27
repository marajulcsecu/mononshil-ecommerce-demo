"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getCartItemCount,
  getCartSubtotal,
  removeCartItem,
  updateCartItemQuantity,
  upsertCartItem,
} from "@/lib/commerce";
import type { CartItem, OrderRecord } from "@/types/commerce";

const CART_STORAGE_KEY = "mononshil_cart_v1";
const ORDER_STORAGE_KEY = "mononshil_last_order_v1";
const STORAGE_CHANGE_EVENT = "mononshil-storage-update";

const EMPTY_CART: CartItem[] = [];

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  lastOrder: OrderRecord | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: CartItem, options?: { openDrawer?: boolean }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  saveOrder: (order: OrderRecord) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function subscribeToStore(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handleStorage = () => onStoreChange();
  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_CHANGE_EVENT, handleStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorage);
  };
}

function getRawStorageSnapshot(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  } catch {
    // Ignore storage quota errors in restricted browsing modes
  }
}

function readCartFromStorage(): CartItem[] {
  const raw = getRawStorageSnapshot(CART_STORAGE_KEY);
  if (!raw) return EMPTY_CART;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

const emptySubscribe = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const rawCart = useSyncExternalStore(
    subscribeToStore,
    () => getRawStorageSnapshot(CART_STORAGE_KEY),
    () => ""
  );

  const rawOrder = useSyncExternalStore(
    subscribeToStore,
    () => getRawStorageSnapshot(ORDER_STORAGE_KEY),
    () => ""
  );

  const items = useMemo<CartItem[]>(() => {
    if (!rawCart) return EMPTY_CART;
    try {
      const parsed: unknown = JSON.parse(rawCart);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART;
    } catch {
      return EMPTY_CART;
    }
  }, [rawCart]);

  const lastOrder = useMemo<OrderRecord | null>(() => {
    if (!rawOrder) return null;
    try {
      const parsed: unknown = JSON.parse(rawOrder);
      if (parsed && typeof parsed === "object" && "orderId" in parsed) {
        return parsed as OrderRecord;
      }
      return null;
    } catch {
      return null;
    }
  }, [rawOrder]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const addItem = useCallback(
    (incoming: CartItem, options?: { openDrawer?: boolean }) => {
      const next = upsertCartItem(readCartFromStorage(), incoming);
      writeStorage(CART_STORAGE_KEY, next);
      if (options?.openDrawer !== false) {
        setIsDrawerOpen(true);
      }
    },
    []
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    const next = updateCartItemQuantity(readCartFromStorage(), key, quantity);
    writeStorage(CART_STORAGE_KEY, next);
  }, []);

  const removeItem = useCallback((key: string) => {
    const next = removeCartItem(readCartFromStorage(), key);
    writeStorage(CART_STORAGE_KEY, next);
  }, []);

  const clearCart = useCallback(() => {
    writeStorage(CART_STORAGE_KEY, []);
  }, []);

  const saveOrder = useCallback((order: OrderRecord) => {
    writeStorage(ORDER_STORAGE_KEY, order);
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const itemCount = useMemo(() => getCartItemCount(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      isHydrated,
      isDrawerOpen,
      lastOrder,
      openDrawer,
      closeDrawer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      saveOrder,
    }),
    [
      items,
      itemCount,
      subtotal,
      isHydrated,
      isDrawerOpen,
      lastOrder,
      openDrawer,
      closeDrawer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      saveOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
