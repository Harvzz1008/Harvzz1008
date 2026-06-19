'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import {
  CartItem,
  Cart,
  getCart,
  addToCart as addToCartLib,
  removeFromCart as removeFromCartLib,
  updateQuantity as updateQuantityLib,
  clearCart as clearCartLib,
  getCartCount,
  getCartTotal,
} from '@/lib/cart'

type CartContextType = {
  cart: Cart
  count: number
  total: number
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] })

  useEffect(() => {
    setCart(getCart())
  }, [])

  const addToCart = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const updated = addToCartLib(item)
      setCart({ ...updated })
    },
    []
  )

  const removeFromCart = useCallback((id: string) => {
    const updated = removeFromCartLib(id)
    setCart({ ...updated })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const updated = updateQuantityLib(id, quantity)
    setCart({ ...updated })
  }, [])

  const clearCart = useCallback(() => {
    clearCartLib()
    setCart({ items: [] })
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        count: getCartCount(cart),
        total: getCartTotal(cart),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
