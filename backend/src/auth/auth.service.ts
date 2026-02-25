import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private sessionsService: SessionsService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);

        const user = await this.usersService.create(dto.email, passwordHash);
        return this.loginUser(user);
    }

    async login(dto: LoginDto, metadata?: { ipAddress?: string; userAgent?: string }) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.loginUser(user, metadata);
    }

    async refreshTokens(refreshToken: string, metadata?: { ipAddress?: string; userAgent?: string }) {
        const session = await this.sessionsService.findByRefreshToken(refreshToken);
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Optional: Single-use refresh tokens
        // await this.sessionsService.invalidateSession(session.id);

        return this.loginUser(session['user'] as User, metadata);
    }

    async logout(sessionId: string) {
        await this.sessionsService.invalidateSession(sessionId);
    }

    private async loginUser(user: User, metadata?: { ipAddress?: string; userAgent?: string }) {
        const { accessToken, refreshToken, expiresAt } = await this.generateTokens(user.id);

        const session = await this.sessionsService.createSession(
            user.id,
            accessToken,
            refreshToken,
            expiresAt,
            metadata
        );

        return {
            accessToken,
            refreshToken,
            expiresAt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
        };
    }

    private async generateTokens(userId: string) {
        const payload = { sub: userId, type: 'access' };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION'),
        });

        const refreshPayload = { sub: userId, type: 'refresh' };
        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        });

        // Calculate expiration date for the session
        const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRATION');
        const expiresAt = new Date();
        if (refreshExpiresIn.endsWith('d')) {
            expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiresIn));
        } else if (refreshExpiresIn.endsWith('m')) {
            expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(refreshExpiresIn));
        } else {
            expiresAt.setHours(expiresAt.getHours() + 7 * 24); // Default 7 days
        }

        return { accessToken, refreshToken, expiresAt };
    }
}
