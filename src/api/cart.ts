import { api } from "./client";

export type CartItem = {
  _id?: string;
  userId?: string;
  productId: number;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

export async function fetchCart() {
  return api<{ items: CartItem[] }>("/cart");
}

export async function addToCart(item: CartItem) {
  return api<{ item: CartItem }>("/cart", {
    method: "POST",
    body: JSON.stringify(item)
  });
}

export async function updateCartItem(id: string, patch: Partial<CartItem>) {
  return api<{ item: CartItem }>(`/cart/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export async function removeCartItem(id: string) {
  return api<{ ok: boolean }>(`/cart/${id}`, { method: "DELETE" });
}

export async function clearCart() {
  return api<{ ok: boolean }>(`/cart`, { method: "DELETE" });
}
