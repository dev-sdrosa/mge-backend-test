import { PermissionEnum } from '../enums/permission.enum';

export interface PermissionDefinition {
  name: PermissionEnum;
  description: string;
}

export const PERMISSIONS_DEFINITIONS: PermissionDefinition[] = [
  { name: PermissionEnum.SYSTEM_ADMIN, description: 'Acceso total a todas las rutas.' },
  { name: PermissionEnum.VIEW_TRANSFERS, description: 'Permite visualizar las transferencias.' },
  { name: PermissionEnum.CREATE_TRANSFER, description: 'Permite crear nuevas transferencias.' },
  { name: PermissionEnum.EDIT_TRANSFER, description: 'Permite modificar transferencias existentes.' },
  { name: PermissionEnum.DELETE_TRANSFER, description: 'Permite eliminar transferencias existentes.' },
  { name: PermissionEnum.VIEW_VEHICLES, description: 'Permite visualizar vehículos.' },
  { name: PermissionEnum.CREATE_VEHICLE, description: 'Permite crear nuevos vehículos.' },
  { name: PermissionEnum.EDIT_VEHICLE, description: 'Permite modificar vehículos existentes.' },
  { name: PermissionEnum.DELETE_VEHICLE, description: 'Permite eliminar vehículos existentes.' },
  { name: PermissionEnum.VIEW_PROJECTS, description: 'Permite visualizar los proyectos.' },
  { name: PermissionEnum.CREATE_PROJECT, description: 'Permite crear nuevos proyectos.' },
  { name: PermissionEnum.EDIT_PROJECT, description: 'Permite modificar proyectos existentes.' },
  { name: PermissionEnum.DELETE_PROJECT, description: 'Permite eliminar proyectos.' },
  { name: PermissionEnum.VIEW_ORGANIZATIONAL_UNITS, description: 'Permite visualizar las unidades organizativas.' },
  { name: PermissionEnum.CREATE_ORGANIZATIONAL_UNIT, description: 'Permite crear nuevas unidades organizativas.' },
  { name: PermissionEnum.EDIT_ORGANIZATIONAL_UNIT, description: 'Permite modificar unidades organizativas existentes.' },
  { name: PermissionEnum.DELETE_ORGANIZATIONAL_UNIT, description: 'Permite eliminar unidades organizativas.' },
  { name: PermissionEnum.PROFILE_VIEW, description: 'Permite visualizar el perfil propio.' },
];