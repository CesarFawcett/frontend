# LogginPrueba

Un sistema de autenticación "Mobile First" seguro, moderno y contenerizado generado con el **Studio Workflow**.

## Descripción General
Este proyecto implementa un flujo completo de autenticación (Login/Registro) utilizando un diseño *Premium* (React + Tailwind CSS) y un backend robusto basado en Node.js, Express y PostgreSQL. Todo el ecosistema está orquestado con **Docker Compose** para asegurar portabilidad y reproducibilidad.

## Stack Tecnológico
- **Frontend VITE:** React.js, TypeScript, Tailwind CSS
- **Backend API:** Node.js, Express, `bcrypt`, `jsonwebtoken`
- **Base de Datos:** PostgreSQL Alpine
- **Infraestructura:** Docker & Docker Compose

## Requisitos Previos
- [Docker](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

## Pasos para Iniciar
Para levantar todo el entorno de desarrollo con un solo comando, simplemente ejecuta en la raíz del proyecto:
```bash
docker-compose up -d --build
```
> Esto encenderá 3 contenedores:
> - `loggin_db` (Postgres, puerto 5432)
> - `loggin_backend` (API, puerto 3000)
> - `loggin_frontend` (React, puerto 5173)

### Accesos
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** `http://localhost:3000/api`

## Cuenta de Administrador (Por defecto)
La base de datos se inicializa automáticamente con un usuario administrador seguro:
- **Usuario:** `admin`
- **Contraseña:** `admin`

## Documentación del Proyecto
Puedes encontrar los documentos de diseño elaborados por los agentes IA en esta misma carpeta:
- `Documento de requisitos del producto.docx`: PRD (Visión, Mercado, User Stories).
- `Arquitectura.docx`: Diagrama Técnico, Stack detallado y Modelo de Datos (ERD).

## Detener el entorno
Para apagar los contenedores y liberar recursos:
```bash
docker-compose down
```
