import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JwtPayload {
  sub: string; // userId
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.getOrThrow<string>('JWT_SECRET');

    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    super(opts);
  }

  validate(payload: unknown) {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'sub' in payload &&
      'email' in payload &&
      typeof (payload as any).sub === 'string' &&
      typeof (payload as any).email === 'string'
    ) {
      const { sub, email } = payload as JwtPayload;
      return { userId: sub, email };
    }

    throw new UnauthorizedException('Invalid JWT payload');
  }
}
