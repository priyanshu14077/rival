import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private prisma: PrismaService) { }

    async toggleLike(userId: string, blogId: string) {
        // Check if blog exists
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Blog not found');

        // Idempotent like: Use upsert
        await this.prisma.like.upsert({
            where: {
                userId_blogId: {
                    userId,
                    blogId,
                },
            },
            update: {},
            create: {
                userId,
                blogId,
            },
        });

        return { message: 'Blog liked successfully' };
    }

    async removeLike(userId: string, blogId: string) {
        try {
            await this.prisma.like.delete({
                where: {
                    userId_blogId: {
                        userId,
                        blogId,
                    },
                },
            });
        } catch (e) {
            // Idempotent: If it doesn't exist, prisma throws P2025
            if (e.code !== 'P2025') throw e;
        }
        return { message: 'Blog unliked successfully' };
    }

    async getLikeStatus(userId: string | undefined, blogId: string) {
        const totalLikes = await this.prisma.like.count({
            where: { blogId },
        });

        let isLiked = false;
        if (userId) {
            const userLike = await this.prisma.like.findUnique({
                where: {
                    userId_blogId: {
                        userId,
                        blogId,
                    },
                },
            });
            isLiked = !!userLike;
        }

        return {
            total: totalLikes,
            isLiked,
        };
    }
}
