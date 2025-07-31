# PDF Reader API

API para visualización de archivos PDF con autenticación de usuarios.

## Características

- Autenticación de usuarios con sesiones
- CRUD completo de usuarios
- Validación de datos
- Rate limiting
- Seguridad con Helmet
- Tests unitarios e integración con cobertura del 100%

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` con las siguientes variables:

```env
PORT=3000
NODE_ENV=development
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
```

## Scripts disponibles

### Desarrollo

```bash
npm run dev          # Ejecutar en modo desarrollo con nodemon
npm start           # Ejecutar en producción
```

### Testing

```bash
npm run test        # Ejecutar tests
npm run test -- --coverage  # Ejecutar tests con cobertura
```

### Linting

```bash
npm run lint        # Ejecutar ESLint
npm run lint-fix    # Ejecutar ESLint y arreglar errores automáticamente
```

## Estructura del proyecto

```
src/
├── config/         # Configuración de base de datos
├── controllers/    # Controladores de la aplicación
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de Sequelize
├── routes/         # Definición de rutas
└── services/       # Lógica de negocio

test/
├── unit/           # Tests unitarios
└── integration/    # Tests de integración
```

## Endpoints

### Autenticación

- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión

### Usuarios (requiere autenticación)

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario específico
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

## Tests

El proyecto incluye una suite completa de tests con:

- **Tests unitarios**: Para servicios, controladores y middlewares
- **Tests de integración**: Para rutas y flujos completos
- **Cobertura del 100%**: Todos los archivos están completamente cubiertos

### Ejecutar tests

```bash
# Todos los tests
npm run test

# Tests con cobertura
npm run test -- --coverage

# Tests en modo watch
npm run test -- --watch
```

## CI/CD

El proyecto incluye un workflow de GitHub Actions que:

1. Valida mensajes de commit con commitlint
2. Ejecuta linting con ESLint
3. Ejecuta tests unitarios con cobertura
4. Ejecuta build del proyecto
5. Verifica vulnerabilidades con npm audit

## Tecnologías utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **Jest** - Framework de testing
- **ESLint** - Linter de código
- **bcrypt** - Hashing de contraseñas
- **express-session** - Manejo de sesiones
- **helmet** - Seguridad HTTP
- **express-rate-limit** - Rate limiting

## Autor

Johan Posso
