# Práctica Final Coworking – Frontend

Aplicación web para reservar espacios de coworking (sedes, salas, cabinas…).
Incluye landing, exploración de sedes y recursos, diálogo de reserva con disponibilidad, autenticación, gestión de perfil (con foto) y panel de gestión de reservas para administradores.

## URL de la pagina subida vercel

[https://practica-final-frontend.vercel.app/](https://practica-final-frontend.vercel.app/)

## Funcionalidades

- Landing Page con CTA.
- Listado de sedes y detalle de sede con filtros.
- Reserva con diálogo y toasts de feedback.
- Autenticación (login/registro).
- Mis reservas: KPIs clicables (Aceptadas / Pendientes / Canceladas), tarjetas con estado, fecha/hora y cancelación con motivo.
- Gestión admin: listado de pendientes para aprobar/denegar.
- Configuración de usuario: editar nombre/email/contraseña y subir foto.

## Stack utilizado

- React + Vite
- React Router - gestión de rutas (rutas protegidas y por rol)
- TanStack Query - fetching/cache de datos
- Tailwind CSS - estilizado de la web
- React Hook Form + Zod - formularios y validación
- Axios - cliente HTTP con interceptores
- date-fns - formateo de fechas
- Font Awesome - iconos

## Puesta en marcha

Este proyecto requiere [Node.js](https://nodejs.org/) v20+ para funcionar.

Instala las dependencias y las dependencias de desarrollo.

```sh
cd practica-final-frontend
npm i
```

Para arrancar el proyecto.

```sh
npm run dev
```

## Roles y navegación

### Usuario no autenticado

- / – landing con CTA a “Sedes”.
- /locations – Listado de sedes.
- /locations/:id – Ficha de sede.
- /login – Iniciar sesión.
- /register – Registro.

### Usuario autenticado

- Navbar: foto de perfil + nombre de usuario. Menú desplegable con Configuración y Salir.
- /locations/:id – Botón “Reservar” abre Diálogo de reserva:
  Selección de fecha y duración de la reserva.
  Consulta disponibilidad y muestra huecos.
  Confirmar crea reserva en pending y notifica con toast.
- /bookings/me – Mis reservas:
  3 cards KPI (Aceptadas, Pendientes, Canceladas) con contador de las reservas de cada estado.
  Botón Cancelar con modal para indicar el motivo de la cancelación.
- /settings – Configuración del usuario:
  Cambiar nombre e email.
  Subir foto. Envío multipart a PATCH /users/:id.
  Actualiza AuthContext para refrescar foto de perfil y nombre de usuario al instante.

### Admin

- /manage-bookings – Gestionar reservas:
  Lista pendientes.
  Acciones: Aprobar o Denegar, esta última abre un modal para indicar el motivo.
  Toasts en éxito y errores.

## Consumo de APi

Autenticación via JWT guardado en localStorage (user + token) y añadido en Axios

## Licencia

MIT
