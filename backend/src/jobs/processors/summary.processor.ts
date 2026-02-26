import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('summary')
export class SummaryProcessor extends WorkerHost {
    private readonly logger = new Logger(SummaryProcessor.name);

    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { blogId } = job.data;
        try {
            this.logger.log(`Generating summary for blog ${blogId}`);
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            if (!blog) return;

            // Fallback pseudo-generation of 200 chars
            const summary = blog.content.length > 200
                ? blog.content.substring(0, 200) + '...'
                : blog.content;

            await this.prisma.blog.update({
                where: { id: blogId },
                data: { summary },
            });
            this.logger.log(`Summary generated successfully for blog ${blogId}`);
        } catch (error) {
            this.logger.error(`Error generating summary for blog ${blogId}`, error.stack);
            throw error; // Let BullMQ handle retries
        }
    }
}
