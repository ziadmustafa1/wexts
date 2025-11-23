import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { FusionController as WextsController, FusionPost as WextsPost, FusionGet as WextsGet } from 'wexts/nest';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@WextsController('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @WextsPost()
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @WextsPost()
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @WextsGet()
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req) {
        return this.authService.getMe(req.user.userId);
    }
}
