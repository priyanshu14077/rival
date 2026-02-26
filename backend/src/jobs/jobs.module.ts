import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { SummaryProcessor } from './processors/summary.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'summary',
        }),
        PrismaModule,
    ],
    providers: [QueueService, SummaryProcessor],
    exports: [QueueService],
})
export class JobsModule { }
