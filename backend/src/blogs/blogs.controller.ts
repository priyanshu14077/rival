import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@CurrentUser('userId') userId: string, @Body() createBlogDto: CreateBlogDto) {
        return this.blogsService.create(userId, createBlogDto);
    }

    @Get()
    findAll(@CurrentUser('userId') userId: string, @Query() query: QueryBlogDto) {
        return this.blogsService.findAll(userId, query);
    }

    @Get(':id')
    findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
        return this.blogsService.findOne(userId, id);
    }

    @Patch(':id')
    update(
        @CurrentUser('userId') userId: string,
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        return this.blogsService.update(userId, id, updateBlogDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
        return this.blogsService.remove(userId, id);
    }
}
