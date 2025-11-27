import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule], // ✅ Import PrismaModule
    controllers: [TodosController],
    providers: [TodosService],
})
export class TodosModule { }
