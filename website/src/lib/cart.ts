export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type Cart = {
  items: CartItem[]
}

const CART_KEY = 'shopping-cart'

export function getCart(): Cart {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const stored = localStorage.getItem(CART_KEY)
    if (!stored) return { items: [] }
    return JSON.parse(stored) as Cart
  } catch {
    return { items: [] }
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Cart {
  const cart = getCart()
  const existing = cart.items.find((i) => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity ?? 1
  } else {
    cart.items.push({ ...item, quantity: item.quantity ?? 1 })
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(id: string): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((i) => i.id !== id)
  saveCart(cart)
  return cart
}

export function updateQuantity(id: string, quantity: number): Cart {
  const cart = getCart()
  const item = cart.items.find((i) => i.id === id)
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== id)
    } else {
      item.quantity = quantity
    }
  }
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}
