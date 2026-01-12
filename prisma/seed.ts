import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')
    // Add some sample users or articles if needed.
    // For now, just a placeholder user to ensure it works.
    const user = await prisma.user.upsert({
        where: { email: 'demo@revnews.ai' },
        update: {},
        create: {
            email: 'demo@revnews.ai',
            name: 'Demo User',
        },
    })
    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
