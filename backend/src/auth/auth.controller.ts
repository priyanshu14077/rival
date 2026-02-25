import { Controller, Post, Body, Get, UseGuards, Request, Req, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Req() req: any) {
        const metadata = {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };
        return this.authService.login(dto, metadata);
    }

    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto, @Req() req: any) {
        const metadata = {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        };
        return this.authService.refreshTokens(dto.refreshToken, metadata);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req: any) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req: any) {
        // Session ID should be in the request if tracked via guard
        // For now we'll just return success
        return { message: 'Logged out successfully' };
    }
}
