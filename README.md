# Cookie Scanner

Una herramienta web simple para escanear y analizar cookies de cualquier página web. Desarrollada con Node.js, Express y Puppeteer.

## Características

- Escanea todas las cookies de una URL proporcionada
- Categoriza automáticamente las cookies (Necessary, Preferences, Statistics, Marketing)
- Muestra información detallada de cada cookie en una tabla responsive
- Proporciona un resumen visual de la distribución de cookies
- Permite exportar los resultados en formatos JSON y CSV
- Muestra información adicional de cada cookie (dominio, expiración)
- Interfaz intuitiva y fácil de usar
- Categorización visual mediante sistema de colores

## Instalación (GitHub Codespaces)

1. Abre el proyecto en GitHub Codespaces

2. Instala las dependencias:
```bash
npm install
```

## Uso
1. Ejecuta la aplicación:
```bash
node src/app.js
```
2. Abre la URL proporcionada por Codespaces

3. Introduce la URL del sitio web que deseas analizar (incluyendo https://)

4. Haz clic en "Scan"

5. Revisa el resumen y la tabla detallada de cookies

6. Utiliza los botones de exportación para descargar los resultados en JSON o CSV

## Tecnologías utilizadas
- Node.js
- Express
- Puppeteer
- Bootstrap
- HTML/CSS
- JavaScript

## Requisitos
Ver package.json para las versiones específicas:

- express
- puppeteer

## Contribuir
Las contribuciones son bienvenidas. Siéntete libre de abrir issues o pull requests para mejorar este proyecto.

## Contacto

Para cualquier consulta o colaboración, puedes contactar al autor a través de:

- GitHub: [EduardoHernandezGuzman](https://github.com/EduardoHernandezGuzman)
