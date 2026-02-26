import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from '../public/dto/pagination.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, blogId: string, dto: CreateCommentDto) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Blog not found');

        return this.prisma.comment.create({
            data: {
                content: dto.content,
                userId,
                blogId,
            },
            include: {
                user: {
                    select: { id: true, email: true },
                },
            },
        });
    }

    async findAllByBlog(blogId: string, query: PaginationDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const [total, items] = await Promise.all([
            this.prisma.comment.count({ where: { blogId } }),
            this.prisma.comment.findMany({
                where: { blogId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, email: true },
                    },
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
            },
        };
    }
}
