import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PublicService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: PaginationDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const [total, items] = await Promise.all([
            this.prisma.blog.count({
                where: { isPublished: true },
            }),
            this.prisma.blog.findMany({
                where: { isPublished: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, email: true },
                    },
                    _count: {
                        select: { likes: true, comments: true },
                    },
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
            },
        };
    }

    async findOneBySlug(slug: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { slug },
            include: {
                user: {
                    select: { id: true, email: true },
                },
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });

        if (!blog || !blog.isPublished) {
            throw new NotFoundException(`Blog details not found for slug: ${slug}`);
        }

        return blog;
    }
}
