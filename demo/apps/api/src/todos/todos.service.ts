import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodosService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string) {
        return this.prisma.todo.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const todo = await this.prisma.todo.findUnique({ where: { id } });

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        if (todo.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return todo;
    }

    async create(dto: CreateTodoDto, userId: string) {
        return this.prisma.todo.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async update(id: string, dto: UpdateTodoDto, userId: string) {
        await this.findOne(id, userId); // Check ownership

        return this.prisma.todo.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId); // Check ownership

        return this.prisma.todo.delete({ where: { id } });
    }
}
