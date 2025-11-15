@echo off
echo ============================================
echo    INICIANDO SISTEMA DE BIBLIOTECA
echo ============================================
echo.

REM Compilar todos los servicios
echo [1/4] Compilando servicios...
cd libros-service
call mvn clean package -DskipTests
cd ..

cd usuarios-service
call mvn clean package -DskipTests
cd ..

cd prestamos-service
call mvn clean package -DskipTests
cd ..

echo.
echo [2/4] Iniciando servicio de Libros (puerto 8081)...
start "Servicio Libros" cmd /k "cd libros-service && mvn spring-boot:run"
timeout /t 10 /nobreak > nul

echo [3/4] Iniciando servicio de Usuarios (puerto 8082)...
start "Servicio Usuarios" cmd /k "cd usuarios-service && mvn spring-boot:run"
timeout /t 10 /nobreak > nul

echo [4/4] Iniciando servicio de Prestamos (puerto 8083)...
start "Servicio Prestamos" cmd /k "cd prestamos-service && mvn spring-boot:run"

echo.
echo ============================================
echo    SISTEMA INICIADO CORRECTAMENTE
echo ============================================
echo.
echo Servicios disponibles:
echo   - Libros:    http://localhost:8081
echo   - Usuarios:  http://localhost:8082
echo   - Prestamos: http://localhost:8083
echo.
echo Abre frontend/index.html en tu navegador
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause > nul
start "" "frontend/index.html"