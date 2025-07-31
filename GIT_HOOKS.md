# Git Hooks - Validaciones Automáticas

Este proyecto utiliza Husky para ejecutar validaciones automáticas antes de cada commit y push.

## Hooks Configurados

### Pre-commit Hook (`.husky/pre-commit`)

Se ejecuta automáticamente antes de cada `git commit` y valida:

1. **📝 Linting** - Verifica que el código cumpla con las reglas de ESLint
2. **🧪 Tests** - Ejecuta todos los tests unitarios con cobertura
3. **🔨 Build** - Valida la sintaxis de todos los archivos JavaScript
4. **🔒 Security Audit** - Verifica vulnerabilidades de seguridad

Si alguna validación falla, el commit se cancela automáticamente.

### Pre-push Hook (`.husky/pre-push`)

Se ejecuta automáticamente antes de cada `git push` y valida:

1. **📦 Cambios sin commitear** - Verifica que no haya cambios pendientes
2. **🌿 Rama correcta** - Advierte si no estás en develop/main

## Cómo Funciona

```bash
# Al hacer commit
git commit -m "tu mensaje"
# ↓ Se ejecuta automáticamente:
# 1. npm run lint
# 2. npm run test -- --coverage --ci
# 3. npm run build
# 4. npm audit --audit-level=high

# Al hacer push
git push origin develop
# ↓ Se ejecuta automáticamente:
# 1. Verificación de cambios pendientes
# 2. Verificación de rama
```

## Mensajes de Error

Si alguna validación falla, verás mensajes como:

```
❌ Linting falló. Corrige los errores antes de hacer commit.
❌ Tests fallaron. Corrige los errores antes de hacer commit.
❌ Build falló. Corrige los errores antes de hacer commit.
❌ Se encontraron vulnerabilidades de seguridad. Ejecuta 'npm audit fix' antes de hacer commit.
```

## Bypass de Hooks (Solo en Emergencias)

Si necesitas hacer un commit sin validaciones (NO RECOMENDADO):

```bash
git commit -m "tu mensaje" --no-verify
```

## Configuración

Los hooks se configuran automáticamente al instalar las dependencias:

```bash
npm install
```

## Archivos de Configuración

- `.husky/pre-commit` - Hook de pre-commit
- `.husky/pre-push` - Hook de pre-push
- `package.json` - Scripts de validación

## Beneficios

✅ **Calidad de código** - Solo se permite código que pase todas las validaciones
✅ **Seguridad** - Se detectan vulnerabilidades antes del commit
✅ **Consistencia** - Todos los desarrolladores usan las mismas validaciones
✅ **CI/CD confiable** - Los commits que llegan a CI ya pasaron las validaciones locales
