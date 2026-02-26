import { Controller, Post, Body, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from '../public/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('blogs')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id/comments')
    async createComment(
        @Param('id') blogId: string,
        @Body() dto: CreateCommentDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.commentsService.create(userId, blogId, dto);
    }

    @Get(':id/comments')
    async findAll(@Param('id') blogId: string, @Query() query: PaginationDto) {
        return this.commentsService.findAllByBlog(blogId, query);
    }
}
