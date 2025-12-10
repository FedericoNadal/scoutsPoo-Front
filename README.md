# ScoutsPOO-Front

Frontend de la aplicación de gestión de Scouts, desarrollado con **React + TypeScript + Bootstrap**, siguiendo una arquitectura **SPA (Single Page Application)**.

Este proyecto forma parte de un sistema completo que incluye backend (API REST) para manejar entidades como:

- Sedes
- Comunidades
- Grupos
- Scouts
- Actividades

## Características implementadas hasta ahora

- Listado dinámico de entidades (`Display.tsx`) con renderizado de tablas según el endpoint.
- Creación y edición de registros mediante **modal dinámico** (`FormModal` + `DynamicForm`).
- Eliminación de registros con confirmación y re-renderizado inmediato.
- Manejo de estados locales para control de vistas y modales.
- Sistema de menús lateral y superior, responsive para móviles y escritorio.
- Botones de acciones específicos por entidad (ej. actividades tiene "Tomar asistencia" e "Inscripciones").
- Formulario dinámico que obtiene los campos de la entidad desde el primer registro del endpoint.

## Requisitos

- Node.js >= 18
- npm / yarn / pnpm
- Backend corriendo y accesible (endpoints `/sedes`, `/comunidades`, `/grupo`, `/scouts`, `/actividades`)

## Instalación

```bash
git clone https://github.com/FedericoNadal/scoutsPoo-Front.git
cd scoutsPoo-Front
npm install
# o yarn install / pnpm install
Uso

Levantar la aplicación en modo desarrollo:

npm run dev


La app estará disponible en http://localhost:5173 (o el puerto que Vite asigne).

Estructura principal
src/
 ├─ api/axiosConfig.ts   # Configuración Axios para la API
 ├─ components/
 │   ├─ Display.tsx      # Renderiza tablas según vista
 │   ├─ DynamicForm.tsx  # Formulario dinámico de create/edit
 │   ├─ FormModal.tsx    # Modal reusable para formularios
 │   ├─ MenuLateral.tsx  # Menú lateral responsive
 │   ├─ MenuSuperior.tsx # Menú superior
 │   ├─ Nav.tsx
 │   └─ Header.tsx
 ├─ App.tsx              # Componente principal
 └─ main.tsx

Decisiones de diseño

La SPA mantiene un único estado para la vista actual (vistaActual).

Los formularios son dinámicos, derivando campos automáticamente del primer registro de cada endpoint.

La separación entre consola de backend y display frontend se mantiene, aunque los botones de acción se manejan en el Display.

Bootstrap 5 se utiliza para estilos y responsive, incluyendo menús desplegables y modales.



Próximos pasos / TODO

Completar validaciones en formularios (ej. tipos, requeridos).

Mejorar experiencia de usuario en móviles.

Agregar manejo de errores más detallado.

Integración con autenticación y permisos.

Refactor de DynamicForm para soportar selects, fechas y otros tipos de campos.
