import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/features/users/entities/user.entity';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: User }>();

    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    if (!user.roles) {
      throw new ForbiddenException(
        'Usuario no encontrado o sin roles para derivar permisos.',
      );
    }

    return requiredRoles.some((role) =>
      user.roles.map((r) => r.name).includes(role),
    );
  }
}
