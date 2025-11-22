import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FusionController, FusionGet } from 'wexts/nest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@FusionController('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @FusionGet()
    @Get('me')
    async getMe(@Request() req) {
        return this.usersService.findById(req.user.userId);
    }
}
