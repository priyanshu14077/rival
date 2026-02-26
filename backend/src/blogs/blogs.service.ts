import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { slugify } from './utils/slug.util';
import { Prisma } from '@prisma/client';
import { QueueService } from '../jobs/queue.service';

@Injectable()
export class BlogsService {
    constructor(
        private prisma: PrismaService,
        private queueService: QueueService,
    ) { }

    async create(userId: string, dto: CreateBlogDto) {
        const { title, content, isPublished } = dto;
        const baseSlug = slugify(title);
        let suffix = 0;
        const maxRetries = 10;

        while (suffix < maxRetries) {
            try {
                const currentSlug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
                const blog = await this.prisma.blog.create({
                    data: {
                        title,
                        content,
                        coverImage: dto.coverImage,
                        isPublished: isPublished ?? false,
                        slug: currentSlug,
                        userId,
                    },
                });

                if (blog.isPublished) {
                    await this.queueService.addSummaryJob(blog.id);
                }

                return blog;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    suffix++;
                } else {
                    throw error;
                }
            }
        }
        throw new ConflictException('Could not generate a unique slug after multiple attempts');
    }

    async findAll(userId: string, query: QueryBlogDto) {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', isPublished, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.BlogWhereInput = {
            userId,
            ...(isPublished !== undefined && { isPublished }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [total, items] = await Promise.all([
            this.prisma.blog.count({ where }),
            this.prisma.blog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(userId: string, id: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
        });

        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        if (blog.userId !== userId) {
            throw new ForbiddenException('You do not have permission to access this blog');
        }

        return blog;
    }

    async update(userId: string, id: string, dto: UpdateBlogDto) {
        const blog = await this.findOne(userId, id);

        const { title, ...rest } = dto;
        const updateData: Prisma.BlogUpdateInput = { ...rest };

        const newlyPublished = dto.isPublished === true && blog.isPublished === false;
        let updatedBlog;

        if (title && title !== blog.title) {
            updateData.title = title;
            updatedBlog = await this.updateWithSlug(id, title, updateData);
        } else {
            updatedBlog = await this.prisma.blog.update({
                where: { id },
                data: updateData,
            });
        }

        if (newlyPublished) {
            await this.queueService.addSummaryJob(id);
        }

        return updatedBlog;
    }

    private async updateWithSlug(id: string, title: string, updateData: Prisma.BlogUpdateInput) {
        const baseSlug = slugify(title);
        let suffix = 0;
        const maxRetries = 10;

        while (suffix < maxRetries) {
            try {
                const currentSlug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
                return await this.prisma.blog.update({
                    where: { id },
                    data: {
                        ...updateData,
                        slug: currentSlug,
                    },
                });
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    suffix++;
                } else {
                    throw error;
                }
            }
        }
        throw new ConflictException('Could not generate a unique slug for the updated title');
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);
        return this.prisma.blog.delete({
            where: { id },
        });
    }
}
