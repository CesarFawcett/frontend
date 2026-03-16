# ARQUITECTURA TÉCNICA: LogginPrueba

## 1. Visión General de Arquitectura
El proyecto "LogginPrueba" utilizará una arquitectura cliente-servidor basada en microservicios contenerizados (separación clara entre Frontend, Backend y Base de Datos). Esta separación permite un despliegue aislado y un entorno de desarrollo reproducible garantizado por Docker, cumpliendo con la premisa de "Mobile First" y asegurando un fácil mantenimiento y escalabilidad a futuro.

## 2. Stack Tecnológico Detallado

### Backend
- **Lenguaje:** Node.js / TypeScript
- **Framework:** Express
- **Justificación:** Express es ligero, ágil y permite construir rápidamente una API RESTful para el inicio de sesión. TypeScript provee seguridad de tipos, reduciendo errores en tiempo de desarrollo.

### Frontend
- **Framework:** React con Vite
- **Estado:** Context API
- **Estilos:** Tailwind CSS
- **Justificación:** React permite construir interfaces web fluidas (Single Page Application) que se adaptan a móviles y computadoras. Tailwind CSS asegura un diseño moderno "premium" de manera rápida y altamente responsive. Vite ofrece un entorno de desarrollo ultrarrápido.

### Base de Datos
- **Principal:** PostgreSQL
- **Justificación:** Base de datos relacional robusta, ideal para mantener un registro seguro, estructurado y ACID-compliant de los usuarios registrados y los administradores.
- **Caching:** No aplicable en la fase inicial de un login básico, pero escalable en el futuro.

### Infraestructura y Despliegue
- **Entorno Local:** Docker & Docker Compose (Frontend, Backend, Postgres)
- **Base de datos en:** Contenedor de Postgres
- **Seguridad:** Encriptación de contraseñas mediante `bcrypt` y manejo de sesiones con `jsonwebtoken` (JWT) almacenado en HTTP-Only Cookies.

## 3. Modelo de Datos (ERD)
```sql
ENTITY User {
  id UUID PK
  username VARCHAR UNIQUE NOT NULL
  password_hash VARCHAR NOT NULL
  role ENUM ['user', 'admin'] DEFAULT 'user'
  created_at TIMESTAMP
  updated_at TIMESTAMP
}
```
