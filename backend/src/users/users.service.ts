import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(email: string, passwordHash: string): Promise<User> {
        return this.prisma.user.create({
            data: {
                email,
                passwordHash,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async updatePassword(id: string, passwordHash: string): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
    }
}
