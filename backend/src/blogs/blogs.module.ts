import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';

@Module({
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService],
})
export class BlogsModule { }
