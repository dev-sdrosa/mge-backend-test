import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { User } from 'src/features/users/entities/user.entity';
import { RoleEnum } from '../enums/role.enum';

const ADMIN_ROLE_NAME = RoleEnum.ADMIN;

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
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

    const isAdmin = user.roles.some((role) => role.name === ADMIN_ROLE_NAME);

    if (isAdmin) {
      return true;
    }

    const userPermissions = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions?.forEach((permission) =>
        userPermissions.add(permission.name),
      );
    });

    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Permisos insuficientes.');
    }
    return true;
  }
}
