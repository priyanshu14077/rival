import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
    imports: [JobsModule],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService],
})
export class BlogsModule { }
