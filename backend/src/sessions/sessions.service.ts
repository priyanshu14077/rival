import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Session } from '@prisma/client';

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) { }

    async createSession(
        userId: string,
        token: string,
        refreshToken: string,
        expiresAt: Date,
        metadata?: { ipAddress?: string; userAgent?: string },
    ): Promise<Session> {
        return this.prisma.session.create({
            data: {
                userId,
                token,
                refreshToken,
                expiresAt,
                ipAddress: metadata?.ipAddress,
                userAgent: metadata?.userAgent,
            },
        });
    }

    async findByToken(token: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });
    }

    async findByRefreshToken(refreshToken: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
    }

    async updateLastActivity(sessionId: string): Promise<Session> {
        return this.prisma.session.update({
            where: { id: sessionId },
            data: { lastActivityAt: new Date() },
        });
    }

    async invalidateSession(sessionId: string): Promise<void> {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { isActive: false },
        });
    }

    async invalidateAllUserSessions(userId: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
        });
    }

    async getUserActiveSessions(userId: string): Promise<Session[]> {
        return this.prisma.session.findMany({
            where: { userId, isActive: true },
        });
    }

    async cleanupExpiredSessions(): Promise<number> {
        const result = await this.prisma.session.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { isActive: false },
                ],
            },
        });
        return result.count;
    }
}
