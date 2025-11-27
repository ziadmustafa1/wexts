import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
        @Inject(JwtService) private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if user exists
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (exists) {
            throw new UnauthorizedException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        const access_token = this.generateToken(user.id, user.email);

        return { user, access_token };
    }

    async login(dto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const valid = await bcrypt.compare(dto.password, user.password);

        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const access_token = this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            access_token,
        };
    }

    async getMe(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
    }

    private generateToken(userId: string, email: string): string {
        return this.jwtService.sign({ sub: userId, email });
    }
}
