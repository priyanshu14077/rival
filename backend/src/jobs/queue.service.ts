import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
    constructor(@InjectQueue('summary') private summaryQueue: Queue) { }

    async addSummaryJob(blogId: string) {
        await this.summaryQueue.add('generate-summary', { blogId }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            }
        });
    }
}
