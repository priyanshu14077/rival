import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../../sessions/sessions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private sessionsService: SessionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        });
    }

    async validate(payload: any) {
        if (payload.type !== 'access') {
            throw new UnauthorizedException('Invalid token type');
        }

        // Verify session in DB
        // We can extract the token from the request if needed, but for simplicity
        // we just validate the user from the payload here.
        // In a stricter setup, we would check the session ID.

        return { userId: payload.sub };
    }
}
