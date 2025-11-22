import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FusionController, FusionGet, FusionPost, FusionPut, FusionDelete } from 'wexts/nest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@FusionController('todos')
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
    constructor(private todosService: TodosService) { }

    @FusionGet()
    @Get()
    async findAll(@Request() req) {
        return this.todosService.findAll(req.user.userId);
    }

    @FusionGet()
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.todosService.findOne(id, req.user.userId);
    }

    @FusionPost()
    @Post()
    async create(@Body() dto: CreateTodoDto, @Request() req) {
        return this.todosService.create(dto, req.user.userId);
    }

    @FusionPut()
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateTodoDto,
        @Request() req,
    ) {
        return this.todosService.update(id, dto, req.user.userId);
    }

    @FusionDelete()
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        return this.todosService.remove(id, req.user.userId);
    }
}
