import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { PaginationDto } from './dto/pagination.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) { }

    @Throttle({ default: { limit: 30, ttl: 60000 } })
    @Get('feed')
    findAll(@Query() query: PaginationDto) {
        return this.publicService.findAll(query);
    }

    @Throttle({ default: { limit: 60, ttl: 60000 } })
    @Get('blogs/:slug')
    findOneBySlug(@Param('slug') slug: string) {
        return this.publicService.findOneBySlug(slug);
    }

    @Get('stats')
    getStats() {
        return this.publicService.getStats();
    }
}
