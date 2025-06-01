import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { Request } from 'express-serve-static-core';
import { IAccessToken } from 'src/common/interfaces/token/access-token.interface';
import { User } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/providers/user.service';
import { JwtService } from 'src/features/jwt/providers/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = !!this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<Request>();

    await this.setHttpHeader(request, isPublic);

    if (isPublic) {
      return true;
    }

    if (!request.user) {
      throw new UnauthorizedException(
        'Authentication required and user not found on request.',
      );
    }

    return true;
  }

  private async setHttpHeader(
    req: Request,
    isPublicRoute: boolean,
  ): Promise<void> {
    const auth = req.headers?.authorization;

    if (!auth || auth.length === 0) {
      if (!isPublicRoute) {
        throw new UnauthorizedException('Authorization header not found.');
      }
      return;
    }

    const authArr = auth.split(' ');
    const bearer = authArr[0];
    const token = authArr[1];

    if (!bearer || bearer !== 'Bearer' || !token) {
      if (!isPublicRoute) {
        throw new UnauthorizedException(
          'Invalid Authorization header format. Expected Bearer token.',
        );
      }
      return;
    }

    try {
      const payload = await this.jwtService.verifyToken<IAccessToken>(
        token,
        TokenTypeEnum.ACCESS,
      );

      if (!payload || !payload.id) {
        if (!isPublicRoute) {
          throw new UnauthorizedException('Invalid token payload.');
        }
        return;
      }

      const userEntity = await this.userService.findUserWithRolesAndPermissions(
        payload.id,
      );
      if (!userEntity) {
        if (!isPublicRoute) {
          throw new UnauthorizedException('User from token not found.');
        }
        return;
      }

      const userPayloadForRequest: Partial<User> = {
        id: userEntity.id,
        username: userEntity.username,
        email: userEntity.email,
        roles: userEntity.roles,
        created_at: userEntity.created_at,
        updated_at: userEntity.updated_at,
      };
      req.user = userPayloadForRequest as User;
    } catch (error) {
      if (!isPublicRoute) {
        if (
          error instanceof UnauthorizedException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new UnauthorizedException('Invalid or expired token.');
      }
      return;
    }
  }
}
