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

function getInferredPermission(context: ExecutionContext): string | null {
  const controllerClass = context.getClass();
  const handler = context.getHandler();

  if (!controllerClass || !handler || !controllerClass.name || !handler.name) {
    return null;
  }

  const resourceName = controllerClass.name
    .replace('Controller', '')
    .toLowerCase();
  let actionName = handler.name;

  // Mapping of common CRUD actions
  switch (actionName) {
    case 'create':
    case 'new':
      actionName = 'create';
      break;
    case 'findAll':
    case 'findOne':
      actionName = 'read';
      break;
    case 'update':
    case 'patch':
      actionName = 'update';
      break;
    case 'remove':
    case 'delete':
      actionName = 'delete';
      break;
    // Custome actiosn keep their names: eg. 'assignUserToProject' -> 'assignUserToProject'
  }

  return `${resourceName}:${actionName}`;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let requiredPermissions = this.reflector.getAllAndOverride<
      string[] | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

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

    if (!requiredPermissions || requiredPermissions.length === 0) {
      const inferredPermission = getInferredPermission(context);
      if (inferredPermission) {
        requiredPermissions = [inferredPermission];
      } else {
        return true;
      }
    }

    const userPermissions = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions?.forEach((permission) =>
        userPermissions.add(permission.name),
      );
    });

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Permisos insuficientes.');
    }
    return true;
  }
}
