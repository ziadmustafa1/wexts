import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: getJwtSecret(configService),
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}

function getJwtSecret(configService: ConfigService): string {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be set to at least 32 characters.');
    }
    return secret;
}
