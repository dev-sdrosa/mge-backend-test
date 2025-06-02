import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IAccessPayload,
  IAccessToken,
} from 'src/common/interfaces/token/access-token.interface';
import {
  IRefreshPayload,
  IRefreshToken,
} from 'src/common/interfaces/token/refresh-token.interface';
import { CommonService } from 'src/common/providers/common.service';
import { v4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { IUser } from 'src/features/users/interfaces/user.interface';

@Injectable()
export class JwtService {
  private readonly issuer: string;
  private readonly domain: string;
  private readonly jwtAccessSecret: string;
  private readonly jwtAccessTime: number;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshTime: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {
    this.jwtAccessSecret = this.configService.get<string>('JWT_SECRET');
    this.jwtAccessTime = this.configService.get<number>('JWT_ACCESS_TIME');
    this.jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwtRefreshTime = this.configService.get<number>('JWT_REFRESH_TIME');

    const appId = this.configService.get<number | string>('APP_ID');
    this.issuer = appId ? String(appId) : 'default-issuer';
    this.domain = this.configService.get<string>('domain');
  }

  private static async generateTokenAsync(
    payload: IAccessPayload | IRefreshPayload,
    secret: string,
    options: jwt.SignOptions,
  ): Promise<string> {
    return new Promise((resolve, rejects) => {
      jwt.sign(payload, secret, options, (error, token) => {
        if (error) {
          rejects(error);
          return;
        }
        resolve(token);
      });
    });
  }

  private static async verifyTokenAsync<T>(
    token: string,
    secret: string,
    options: jwt.VerifyOptions,
  ): Promise<T> {
    return new Promise((resolve, rejects) => {
      jwt.verify(token, secret, options, (error, payload: T) => {
        if (error) {
          rejects(error);
          return;
        }
        resolve(payload);
      });
    });
  }

  public async generateToken(
    user: IUser,
    tokenType: TokenTypeEnum,
    domain?: string | null,
    tokenId?: string,
  ): Promise<string> {
    const jwtOptions: jwt.SignOptions = {
      issuer: this.issuer,
      subject: user.email,
      audience: domain ?? this.domain,
      algorithm: 'HS256',
    };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        return this.commonService.throwInternalError(
          JwtService.generateTokenAsync(
            {
              id: user.id,
              roles: user.roles ? user.roles.map((role) => role.name) : [],
            },
            this.jwtAccessSecret,
            {
              ...jwtOptions,
              expiresIn: this.jwtAccessTime,
              algorithm: 'HS256',
            },
          ),
        );
      case TokenTypeEnum.REFRESH:
        return this.commonService.throwInternalError(
          JwtService.generateTokenAsync(
            {
              id: user.id,
              tokenId: tokenId ?? v4(),
            },
            this.jwtRefreshSecret,
            {
              ...jwtOptions,
              expiresIn: this.jwtRefreshTime,
            },
          ),
        );
    }
  }

  public async generateAuthTokens(
    user: IUser,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.generateToken(user, TokenTypeEnum.ACCESS, domain, tokenId),
      this.generateToken(user, TokenTypeEnum.REFRESH, domain, tokenId),
    ]);
  }

  private static async throwBadRequest<T extends IAccessToken | IRefreshToken>(
    promise: Promise<T>,
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestException('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestException('Invalid token');
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async verifyToken<T extends IAccessToken | IRefreshToken>(
    token: string,
    tokenType: TokenTypeEnum,
  ): Promise<T> {
    const jwtOptions: jwt.VerifyOptions = {
      issuer: this.issuer,
      audience: new RegExp(this.domain),
    };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        return JwtService.throwBadRequest(
          JwtService.verifyTokenAsync(token, this.jwtAccessSecret, {
            ...jwtOptions,
            maxAge: this.jwtAccessTime,
            algorithms: ['HS256'],
          }),
        );
      case TokenTypeEnum.REFRESH:
        return JwtService.throwBadRequest(
          JwtService.verifyTokenAsync(token, this.jwtRefreshSecret, {
            ...jwtOptions,
            maxAge: this.jwtRefreshTime,
            algorithms: ['HS256'],
          }),
        );
      default:
        throw new InternalServerErrorException(
          `Unsupported token type: ${tokenType}`,
        );
    }
  }
}
