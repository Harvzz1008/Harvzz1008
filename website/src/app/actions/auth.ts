'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { setSessionCookie, clearSessionCookie } from '@/lib/auth'

export async function signup(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'An account with this email already exists' }
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: {
      name: name || undefined,
      email,
      password: hashed,
      role: 'USER',
    },
  })

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || undefined,
  })

  redirect('/')
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'Invalid email or password' }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { error: 'Invalid email or password' }
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || undefined,
  })

  const redirectTo = '/'
  redirect(redirectTo)
}

export async function logout() {
  await clearSessionCookie()
  redirect('/')
}
