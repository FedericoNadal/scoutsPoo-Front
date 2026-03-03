# SIGASA — Frontend

**Sistema de Gestión de Actividades para la Asociación de Scouts Argentina**

Aplicación web desarrollada en **React + TypeScript**, compilada con **Vite** y estilizada con **Bootstrap 5**. Se ejecuta íntegramente en el navegador del cliente y se comunica con el backend Java/Spring Boot mediante peticiones HTTP REST.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Framework y tipado |
| Vite | Bundler / servidor de desarrollo |
| Bootstrap 5 | Estilos y componentes UI |
| React Bootstrap | Componentes Bootstrap para React |
| Axios | Cliente HTTP con interceptores |

---

## Requisitos previos

- Node.js >= 18
- Backend ScoutsPoo corriendo en el puerto `8080`

---

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo (acceso local)
npm run dev

# Modo desarrollo (accesible desde la red local)
npm run dev -- --host

# Build de producción
npm run build
```

> El resultado del build es una carpeta de archivos estáticos (`dist/`) que puede servirse con Nginx, Apache u cualquier servidor web.

---

## Estructura del proyecto

```
src/
├── auth/
│   ├── AuthContext.tsx        # Contexto global de autenticación (JWT)
│   ├── authService.ts         # Llamada al endpoint de login
│   ├── authTypes.ts           # Tipos de autenticación
│   ├── LoginForm.tsx          # Formulario de inicio de sesión
│   ├── LoginOffCanvas.tsx     # Contenedor offcanvas del login
│   └── RegisterForm.tsx       # Formulario de registro de usuario
│
├── components/
│   ├── api/
│   │   ├── axiosConfig.ts     # Instancia Axios + interceptor JWT + URL dinámica
│   │   └── api.ts             # fetchWithAuth (fetch nativo con token)
│   │
│   ├── BotoneraObservaciones.tsx  # Botonera emoji para registrar asistencia
│   ├── CarruselPublico.tsx        # Carrusel con Ley Scout (solo usuarios no logueados)
│   ├── Consola.tsx                # Panel de selección de entidad (desarrollo)
│   ├── Display.tsx                # Tabla central dinámica con CRUD completo
│   ├── DynamicForm.tsx            # Formulario genérico basado en schemas
│   ├── FormModal.tsx              # Modal contenedor de formularios
│   ├── Header.tsx                 # Encabezado con logo y datos del usuario
│   ├── MenuLateral.tsx            # Menú lateral filtrado por rol
│   ├── MenuSuperior.tsx           # Menú superior (mobile)
│   ├── Nav.tsx                    # Barra de navegación + login/logout
│   └── ScoutParticipaciones.tsx   # Vista de historial de participaciones por scout
│
├── App.tsx                    # Componente raíz, layout principal
├── App.css                    # Estilos globales
├── main.tsx                   # Entry point, monta AuthProvider
└── index.css                  # Reset / estilos base
```

---

## Autenticación

El sistema usa **JWT** almacenado en `localStorage`.

- Al hacer login, el backend devuelve un token que se decodifica para extraer `username` y `role` (`sub` y `rol` del payload).
- El `AuthContext` expone `user`, `login(token)` y `logout()` a toda la aplicación.
- `axiosConfig.ts` inyecta automáticamente el header `Authorization: Bearer <token>` en cada request saliente.

### Roles disponibles

| Rol | Permisos |
|---|---|
| `SCOUT` | Solo puede ver actividades y su propio historial |
| `JEFE` | Puede ver scouts, actividades y gestionar asistencia |
| `EDUCADOR` | Acceso completo: sedes, comunidades, grupos, scouts, actividades |

---

## Componente Display

Es el núcleo de la aplicación. Renderiza una tabla dinámica cuyo contenido y acciones disponibles dependen del valor de `vistaActual`.

### Vistas disponibles

| vistaActual | Endpoint | Descripción |
|---|---|---|
| `actividades` | `GET /actividades` | Lista de actividades |
| `misActividades` | `GET /actividades/misActividades` | Actividades del scout logueado |
| `scouts` | `GET /scouts` | Lista de scouts |
| `sedes` | `GET /sedes` | Sedes registradas |
| `comunidades` | `GET /comunidades` | Comunidades |
| `grupo` | `GET /grupo` | Grupos |
| `scoutParticipaciones-{id}` | `GET /participaciones/scout/:id` | Historial de un scout |

### Acciones CRUD

- **Crear** → `POST /:vista` via `DynamicForm` en `FormModal`
- **Editar** → `PUT /:vista/:id` con payload filtrado por `editableFieldsMap`
- **Eliminar** → `DELETE /:vista/:id` con confirmación
- **Asistencia** → modo especial sobre `GET /actividades/:id/participaciones`

---

## Modo Asistencia

Al hacer clic en el botón de asistencia de una actividad, `Display` entra en `modoAsistencia`:

- Carga los scouts inscriptos en esa actividad.
- Muestra la `BotoneraObservaciones` por cada scout, con las opciones:

| Emoji | Valor | Significado |
|---|---|---|
| ❌ | `ausente` | Sin observación |
| ⏰ | `tarde` | Tarde |
| 🅿 | `presente` | Presente |
| ✅ | `participa satisfactoriamente` | Participa |
| 🏅 | `destaca entre sus compañerxs` | Destaca |

- Cada cambio dispara `PUT /participaciones/:id` de forma inmediata.
- Se puede dar de baja una inscripción con `DELETE /participaciones/:id`.

---

## Formulario dinámico (DynamicForm)

Genera los campos del formulario automáticamente a partir del schema `schemaPost` definido internamente:

- Campos con valores en `camposSelect` renderizan un `<select>` cargado desde la API.
- Campos en `camposFecha` renderizan un `<input type="date">`.
- El resto renderizan un `<input type="text">`.
- Campos en `camposDefault` se omiten del formulario y se envían con su valor por defecto.

---

## Configuración de la URL del backend

`axiosConfig.ts` detecta automáticamente el entorno:

```ts
const API_URL = isLocalhost
  ? 'http://localhost:8080'           // Acceso desde la misma máquina
  : `http://${window.location.hostname}:8080`; // Acceso desde la red local
```

Esto permite usar la app desde otros dispositivos de la red sin cambiar configuración, siempre que se inicie el servidor con `npm run dev -- --host`.

---


