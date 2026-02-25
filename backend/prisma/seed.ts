import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');


    const salt = await bcrypt.genSalt(10);
    const hashedUser1Password = await bcrypt.hash('Password123!', salt);
    const hashedUser2Password = await bcrypt.hash('Password123!', salt);

    const user1 = await prisma.user.create({
        data: {
            email: 'alice@example.com',
            name: 'Alice Johnson',
            passwordHash: hashedUser1Password,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'bob@example.com',
            name: 'Bob Smith',
            passwordHash: hashedUser2Password,
        },
    });

    console.log({ user1, user2 });

    // Create Blogs
    const blog1 = await prisma.blog.upsert({
        where: { slug: 'getting-started-with-prisma' },
        update: {},
        create: {
            title: 'Getting Started with Prisma',
            slug: 'getting-started-with-prisma',
            content: 'Prisma is a modern database toolkit for TypeScript and Node.js...',
            summary: 'An introductory guide to Prisma.',
            published: true,
            authorId: user1.id,
        },
    });

    const blog2 = await prisma.blog.upsert({
        where: { slug: 'nextjs-13-features' },
        update: {},
        create: {
            title: 'Next.js 13 Features',
            slug: 'nextjs-13-features',
            content: 'Next.js 13 introduced many exciting features like App Router...',
            summary: 'Explore the new features of Next.js 13.',
            published: true,
            authorId: user2.id,
        },
    });

    console.log({ blog1, blog2 });

    await prisma.like.upsert({
        where: {
            userId_blogId: {
                userId: user2.id,
                blogId: blog1.id,
            },
        },
        update: {},
        create: {
            userId: user2.id,
            blogId: blog1.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: 'Great article!',
            userId: user2.id,
            blogId: blog1.id,
        },
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
