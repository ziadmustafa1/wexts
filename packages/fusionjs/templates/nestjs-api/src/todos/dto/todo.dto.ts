import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateTodoDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}
