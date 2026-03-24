# Sistema de Biblioteca (BiblioSystem)

Un sistema de gestión de biblioteca completo, construido con una arquitectura basada en microservicios utilizando **Spring Boot** para el backend y una interfaz **Frontend en HTML/CSS/JS (Vanilla)**, preparada para ser servida a través de **Nginx**.

## 🏗 Arquitectura del Proyecto

El proyecto está dividido en varios microservicios independientes que se comunican entre sí. Además, incluye un servidor web frontend.

### Componentes:

1. **Frontend (`frontend/`)**
   - Interfaz de usuario construida con HTML, CSS y JavaScript puro (Vanilla).
   - Incluye vistas para la gestión de Libros, Usuarios y Préstamos.
   - Preparado para desplegarse mediante un contenedor Nginx (accesible por defecto en el puerto `90` al usar Docker).

2. **Libros Service (`libros-service/`)** - Puerto `8081`
   - Microservicio encargado de la administración del catálogo completo de libros.
   - Controla el stock y la disponibilidad.

3. **Usuarios Service (`usuarios-service/`)** - Puerto `8082`
   - Microservicio para el registro y la administración de los usuarios del sistema.

4. **Préstamos Service (`prestamos-service/`)** - Puerto `8083`
   - Microservicio que gestiona la lógica de préstamos y devoluciones de los libros.
   - Interactúa con `libros-service` y `usuarios-service`.

## 🛠 Tecnologías Utilizadas

- **Backend:** Java 21, Spring Boot 3.5.7, Spring Data JPA, H2 Database (Persistent mode) / MySQL Connector.
- **Frontend:** HTML5, CSS3, JavaScript Vanilla, FontAwesome.
- **Despliegue y Construcción:** Maven, Docker, Docker Compose.

## 🚀 Cómo Iniciar el Sistema

Hay dos formas principales de ejecutar el sistema de biblioteca en su entorno local: usando **Docker Compose** o mediante el **Script Local (Windows)**.

### Opción 1: Usando Docker Compose (Recomendado)

Asegúrate de tener instalado [Docker](https://www.docker.com/) y `docker-compose`. En la raíz del proyecto, ejecuta el siguiente comando:

```bash
docker-compose up --build
```

Esto compilará los microservicios, creará las imágenes y levantará los 4 contenedores (los tres servicios backend y el servidor Nginx para el frontend) en una misma red (`biblioteca-net`).

- Frontend accesible en: `http://localhost:90`

### Opción 2: Usando el Script de Windows (`iniciar-sistema.bat`)

Si estás en un entorno Windows y tienes **Maven** y **Java 21** configurados en tus variables de entorno, puedes ejecutar el sistema simplemente haciendo doble clic en el archivo `iniciar-sistema.bat`.

Este script se encarga de:
1. Compilar cada uno de los microservicios sin ejecutar pruebas (`mvn clean package -DskipTests`).
2. Levantar independientemente cada servicio:
   - *Libros* en `http://localhost:8081`
   - *Usuarios* en `http://localhost:8082`
   - *Préstamos* en `http://localhost:8083`
3. Finalmente, abre el archivo `frontend/index.html` en el navegador predeterminado.

## 🗄 Base de Datos

El sistema por defecto hace uso de **H2 Database** configurada para guardar los datos en archivos locales persistentes dentro de cada servicio (ej. `./data/librosdb`).

Para acceder a la consola de administración de base de datos H2 de cada servicio, puedes navegar a:
- Libros: `http://localhost:8081/h2-console`
- Usuarios: `http://localhost:8082/h2-console`
- Préstamos: `http://localhost:8083/h2-console`

## 👨‍💻 Desarrollo

Para realizar modificaciones:
- Cada microservicio es un proyecto Maven independiente, contiene su propio `pom.xml`.
- Las configuraciones como los puertos, configuración de la base de datos y logging se encuentran en `src/main/resources/application.properties` de cada servicio.
- El Frontend está puramente basado en archivos estáticos; cualquier cambio en `html`, `css` o `js` se reflejará directamente al recargar la página (si no estás usando Docker).

---
*Desarrollado con cariño usando Spring Boot - 2025*
