/**
 * Run with: node scripts/create-admin.mjs
 * Creates an admin user for the first-time setup.
 *
 * Default credentials: admin@harvzz.com / admin123456
 * Change these before running in production!
 */

import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

// Dynamic import for generated Prisma client
const { PrismaClient } = await import('../src/generated/prisma/client.js').catch(() => {
  console.error('Prisma client not generated yet. Run: npx prisma generate')
  process.exit(1)
})

const libsql = createClient({ url: 'file:./dev.db' })
const adapter = new PrismaLibSql(libsql)
const db = new PrismaClient({ adapter })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@harvzz.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456'
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin'

async function main() {
  const existing = await db.user.findUnique({ where: { email: ADMIN_EMAIL } })

  if (existing) {
    // Update existing user to be admin
    await db.user.update({
      where: { email: ADMIN_EMAIL },
      data: { role: 'ADMIN' },
    })
    console.log(`Updated existing user ${ADMIN_EMAIL} to ADMIN role.`)
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await db.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashed,
        role: 'ADMIN',
      },
    })
    console.log(`Admin user created: ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
  }

  await db.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
