import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { FusionController, FusionPost, FusionGet } from 'wexts/nest';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@FusionController('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @FusionPost()
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @FusionPost()
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @FusionGet()
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req) {
        return this.authService.getMe(req.user.userId);
    }
}
