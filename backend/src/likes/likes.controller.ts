import { Controller, Post, Delete, Get, Param, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('blogs')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    async likeBlog(@Param('id') blogId: string, @CurrentUser('id') userId: string) {
        return this.likesService.toggleLike(userId, blogId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/like')
    async unlikeBlog(@Param('id') blogId: string, @CurrentUser('id') userId: string) {
        return this.likesService.removeLike(userId, blogId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/likes')
    async getLikeStatus(@Param('id') blogId: string, @CurrentUser('id') userId: string) {
        return this.likesService.getLikeStatus(userId, blogId);
    }
}
