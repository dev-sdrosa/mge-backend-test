# MGE Backend

MGE Backend es una API RESTful desarrollada con NestJS, TypeORM y PostgreSQL, diseñada para gestionar de forma integral los recursos y operaciones de una organización. Esta API permite la administración de usuarios, roles, permisos, vehículos, proyectos, unidades organizacionales (OU) y transferencias de activos entre usuarios.

## Índice

1. [MGE Backend](#mge-backend)
2. [Configuración Inicial](#configuración-inicial)
3. [Variables de Entorno Necesarias](#variables-de-entorno-necesarias)
4. [Descripción de las Rutas y Funcionalidad](#descripción-de-las-rutas-y-funcionalidad)
    - [Auth (`/auth`)](#auth-auth)
    - [Usuarios (`/users`)](#usuarios-users)
    - [Roles (`/roles`)](#roles-roles)
    - [Permisos (`/permissions`)](#permisos-permissions)
    - [Vehículos (`/vehicles`)](#vehículos-vehicles)
    - [Proyectos (`/projects`)](#proyectos-projects)
    - [Unidades Organizacionales (`/organizational-units`)](#unidades-organizacionales-organizational-units)
    - [Transferencias (`/transfers`)](#transferencias-transfers)
5. [Seguridad](#seguridad)
6. [Migraciones y Seeders](#migraciones-y-seeders)

## Configuración Inicial

1. **Clona el repositorio**  
   ```sh
   git clone <repo-url>
   cd mge-backend
   ```

2. **Instala las dependencias**  
   ```sh
   npm install
   ```

3. **Configura las variables de entorno**  
   Copia el archivo `.env.example` a `.env` y ajusta los valores según tu entorno:
   ```sh
   cp .env.example .env
   ```

4. **Ejecuta las migraciones**  
   ```sh
   npm run typeorm migration:run
   ```

5. **Inicia el servidor**  
   ```sh
   npm run start:dev
   ```

6. **Accede a la documentación Swagger**  
   Una vez iniciado, visita [http://localhost:3000/api/docs](http://localhost:3000/api/docs) para ver la documentación interactiva de la API.

---

## Variables de Entorno Necesarias

Las principales variables de entorno requeridas están en `.env.example`. Algunas de las más importantes son:

- `DB_URL` — Cadena de conexión a PostgreSQL (ejemplo: `postgresql://user:password@host:port/database`)
- `JWT_SECRET` — Secreto para firmar JWT (mínimo 32 caracteres)
- `JWT_ACCESS_TIME` — Tiempo de expiración del access token (en segundos)
- `JWT_REFRESH_SECRET` — Secreto para refresh tokens
- `JWT_REFRESH_TIME` — Tiempo de expiración del refresh token (en segundos)
- `REFRESH_COOKIE` — Nombre de la cookie para refresh token
- `COOKIE_SECRET` — Secreto para firmar cookies
- `SEED_ADMIN_EMAIL` — Email del usuario admin inicial (opcional)
- `SEED_ADMIN_PASSWORD` — Contraseña del usuario admin inicial (opcional)
- `SEED_USER_EMAIL` — Email del usuario estándar inicial (opcional)
- `SEED_USER_PASSWORD` — Contraseña del usuario estándar inicial (opcional)
- `PORT` — Puerto en el que corre la API (por defecto 3000)
- `DOMAIN` — Dominio o IP para el servidor (por defecto localhost)
- `CORS_ORIGINS` — Orígenes permitidos para CORS, separados por coma

Consulta el archivo [.env.example](.env.example) para la lista completa.

---

## Descripción de las Rutas y Funcionalidad

La API está dividida en los siguientes módulos principales:

### Auth (`/auth`)
- **POST /auth/sign-up** — Registro de usuario
- **POST /auth/sign-in** — Login de usuario
- **POST /auth/refresh-access** — Refrescar token de acceso
- **POST /auth/logout** — Cerrar sesión y limpiar cookie de refresh
- **GET /auth/me** — Obtener información del usuario autenticado
- **Protegido con JWT y roles (excepto sign-up y sign-in)**

---

### Usuarios (`/users`)
- **GET /users** — Listar todos los usuarios (requiere permisos de admin)
- **GET /users/:id** — Obtener usuario por ID
- **POST /users** — Crear usuario (admin)
- **PATCH /users/:id** — Actualizar usuario
- **DELETE /users/:id** — Eliminar usuario
- **POST /users/:id/roles** — Asignar roles a un usuario
- **GET /users/:id/roles** — Listar roles de un usuario
- **Protegido con JWT, roles y permisos**

---

### Roles (`/roles`)
- **GET /roles** — Listar todos los roles
- **GET /roles/:id** — Obtener rol por ID
- **POST /roles** — Crear un nuevo rol
- **PATCH /roles/:id** — Actualizar un rol existente
- **DELETE /roles/:id** — Eliminar un rol
- **Protegido con JWT, roles y permisos (solo ADMIN por defecto)**

---

### Permisos (`/permissions`)
- **GET /permissions** — Listar todos los permisos
- **GET /permissions/:id** — Obtener permiso por ID
- **POST /permissions** — Crear un nuevo permiso
- **PATCH /permissions/:id** — Actualizar un permiso existente
- **DELETE /permissions/:id** — Eliminar un permiso
- **Protegido con JWT, roles y permisos (solo ADMIN por defecto)**

---

### Vehículos (`/vehicles`)
- **GET /vehicles** — Listar todos los vehículos (USER y ADMIN)
- **GET /vehicles/:id** — Obtener vehículo por ID (USER y ADMIN)
- **POST /vehicles** — Crear un nuevo vehículo (solo ADMIN)
- **PATCH /vehicles/:id** — Actualizar un vehículo (solo ADMIN)
- **DELETE /vehicles/:id** — Eliminar un vehículo (solo ADMIN)
- **Protegido con JWT, roles y permisos**

---

### Proyectos (`/projects`)
- **GET /projects** — Listar todos los proyectos (USER y ADMIN)
- **GET /projects/:id** — Obtener proyecto por ID (USER y ADMIN)
- **POST /projects** — Crear un nuevo proyecto (solo ADMIN)
- **PATCH /projects/:id** — Actualizar un proyecto (solo ADMIN)
- **DELETE /projects/:id** — Eliminar un proyecto (solo ADMIN)
- **POST /projects/:id/users** — Asociar usuarios a un proyecto
- **Protegido con JWT, roles y permisos**

---

### Unidades Organizacionales (`/organizational-units`)
- **GET /organizational-units** — Listar todas las unidades organizacionales (USER y ADMIN)
- **GET /organizational-units/:id** — Obtener unidad organizacional por ID (USER y ADMIN)
- **POST /organizational-units** — Crear una nueva unidad organizacional (solo ADMIN)
- **PATCH /organizational-units/:id** — Actualizar una unidad organizacional (solo ADMIN)
- **DELETE /organizational-units/:id** — Eliminar una unidad organizacional (solo ADMIN)
- **POST /organizational-units/:id/users** — Asociar usuarios a una unidad organizacional
- **Protegido con JWT, roles y permisos**

---

### Transferencias (`/transfers`)
- **GET /transfers** — Listar transferencias accesibles por el usuario
- **GET /transfers/:id** — Obtener detalles de una transferencia específica
- **POST /transfers** — Crear una nueva transferencia
- **PATCH /transfers/:id** — Actualizar una transferencia existente
- **DELETE /transfers/:id** — Eliminar una transferencia
- **Protegido con JWT, roles y permisos. Los usuarios solo pueden ver y operar sobre transferencias asociadas a sus proyectos o unidades.**

---

## Seguridad

- **Autenticación:** JWT Bearer tokens y HTTP Only Cookies
- **Autorización:** Guards de roles y permisos basados en entidades y acciones

---

## Migraciones y Seeders

- Las migraciones de la base de datos están en `src/db/migrations/`.
- Al iniciar en entorno de desarrollo, se ejecutan seeders para crear roles, permisos y usuarios base.
