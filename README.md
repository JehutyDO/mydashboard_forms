# 🎉 Aelityx Eventos - Sistema de Gestión de Eventos

Sistema premium de gestión de eventos desarrollado con Next.js 16, React 19, TypeScript y Tailwind CSS v4.

## 🚀 Stack Tecnológico

### Framework & Core
- **Next.js 16.0.6** - App Router
- **React 19.2.0** - Última versión estable
- **TypeScript 5+** - Type safety completo

### Estilos & UI
- **Tailwind CSS v4** - Última versión con @theme
- **shadcn/ui** - Componentes UI premium
- **Radix UI** - Primitivos accesibles
- **Framer Motion 12** - Animaciones suaves
- **Lucide React** - Iconos modernos
- **class-variance-authority** - Gestión de variantes

### Formularios & Validación
- **React Hook Form 7.67.0** - Manejo de formularios
- **@hookform/resolvers 5.2.2** - Resolvers para validación
- **Zod 4.1.13** - Validación de schemas
- **clsx 2.1.1** - Utilidades de clases CSS

## 📁 Estructura del Proyecto

```
aelityx-eventos-form/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Layout principal
│   │   ├── page.tsx                       # Página de inicio
│   │   ├── globals.css                    # Estilos globales
│   │   └── dashboard/
│   │       └── eventos/
│   │           └── nuevo/
│   │               └── page.tsx           # Página formulario nuevo evento
│   ├── components/
│   │   ├── eventos/
│   │   │   └── EventoForm.tsx             # Componente formulario principal
│   │   └── ui/                            # Componentes shadcn/ui
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── textarea.tsx
│   │       └── card.tsx
│   └── lib/
│       ├── api/
│       │   └── eventos.service.ts         # Servicio API eventos
│       ├── validators/
│       │   └── evento.schema.ts           # Schema Zod validación
│       ├── types/
│       │   └── evento.types.ts            # TypeScript types
│       ├── utils/
│       │   └── fetcher.ts                 # Utilidad fetch API
│       └── utils.ts                       # Utilidad cn() para clsx
├── .env.local                             # Variables de entorno
├── components.json                        # Config shadcn/ui
├── next.config.ts                         # Config Next.js
├── tsconfig.json                          # Config TypeScript
├── package.json                           # Dependencias
└── README.md                              # Este archivo
```

## 🔧 Configuración del Proyecto

### 1. Variables de Entorno

El archivo `.env.local` debe ser creado con tus credenciales:

```env
NEXT_PUBLIC_API_URL="https://tu-dominio.com/api"
NEXT_PUBLIC_API_TOKEN="tu_token_secreto_aqui"
```

### 2. Instalación de Dependencias

Ya están instaladas todas las dependencias. Si necesitas reinstalar:

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

### 4. Compilar para Producción

```bash
npm run build
npm start
```

## 📋 Características del Formulario

### Campos del Formulario

1. **Nombre del Evento*** (requerido)
   - Validación: mínimo 3 caracteres, máximo 100

2. **Fecha*** (requerido)
   - Input tipo date con validación

3. **Hora** (opcional)
   - Input tipo time con formato HH:MM

4. **Lugar** (opcional)
   - Texto libre, máximo 200 caracteres

5. **Descripción** (opcional)
   - Textarea, máximo 1000 caracteres

6. **Capacidad Total*** (requerido)
   - Número, mínimo 1, máximo 10,000

7. **Tipo de Evento*** (requerido)
   - Select con opciones:
     - 🎊 Boda
     - 👑 XV Años
     - 🎂 Cumpleaños
     - 💼 Corporativo
     - 🎉 Otro

8. **Estado*** (requerido)
   - Select con opciones:
     - 📝 Borrador
     - ✅ Activo
     - 🏁 Finalizado

### Validaciones

Todas las validaciones se realizan con **Zod v4**:

- Validación en tiempo real
- Mensajes de error personalizados en español
- Validación de tipos de datos
- Validación de rangos numéricos
- Validación de formatos (fecha, hora)

### Funcionalidades

✅ **Manejo de Estado**
- React Hook Form para gestión eficiente
- Estado de carga con spinner
- Mensajes de éxito/error con animaciones

✅ **Integración API**
- Servicio dedicado para eventos
- Headers de autenticación configurados
- Manejo de errores robusto
- TypeScript types completos

✅ **UX Premium**
- Diseño responsive (mobile-first)
- Animaciones suaves con Framer Motion
- Feedback visual inmediato
- Loading states durante submit
- Auto-reset del formulario tras éxito

✅ **Estilos**
- Color principal: #ff3ea5 (rosa Pixeles)
- Glassmorphism effects
- Gradientes sutiles
- Sombras y bordes premium
- Dark mode ready (variables CSS)

## 🔌 API Integration

### Endpoint POST: Crear Evento

```typescript
POST ${NEXT_PUBLIC_API_URL}/eventos.php

Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ${NEXT_PUBLIC_API_TOKEN}"
}

Body:
{
  "nombre": "string",
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM" (opcional),
  "lugar": "string" (opcional),
  "descripcion": "string" (opcional),
  "capacidad_total": number,
  "tipo_evento": "boda" | "xv" | "cumpleaños" | "corporativo" | "otro",
  "estado": "borrador" | "activo" | "finalizado"
}

Response Success:
{
  "success": true,
  "data": {
    "evento_id": number,
    "uuid": "string",
    ...campos del evento
  }
}

Response Error:
{
  "success": false,
  "message": "string",
  "error": "string"
}
```

### Servicios Disponibles

El archivo `eventos.service.ts` incluye:

- `createEvento(data)` - Crear nuevo evento
- `getEventos()` - Obtener todos los eventos
- `getEventoById(id)` - Obtener evento por ID
- `updateEvento(id, data)` - Actualizar evento
- `deleteEvento(id)` - Eliminar evento

## 🎨 Diseño y Estilos

### Colores Principales

```css
--color-primary: #ff3ea5;          /* Rosa Pixeles */
--color-primary-dark: #e63594;     /* Rosa oscuro */
--color-primary-light: #ff6bb8;    /* Rosa claro */
```

### Componentes UI

Todos los componentes están basados en **shadcn/ui** y son completamente customizables:

- Button - Con variantes y tamaños
- Input - Con validación visual
- Label - Accesible
- Select - Dropdown con iconos
- Textarea - Multi-línea
- Card - Contenedores premium

### Responsive Design

- **Mobile**: < 768px (stack vertical)
- **Tablet**: 768px - 1024px (2 columnas)
- **Desktop**: > 1024px (4 columnas en features)

## 📦 Scripts Disponibles

```json
{
  "dev": "next dev",          // Modo desarrollo
  "build": "next build",      // Compilar producción
  "start": "next start",      // Servidor producción
  "lint": "eslint"            // Linter
}
```

## 🚀 ¡LISTO PARA USAR!

El proyecto está 100% configurado y listo. Para comenzar:

```bash
cd aelityx-eventos-form
npm run dev
```

Luego abre: **http://localhost:3000**

## 🔐 Seguridad

- Variables de entorno para API keys
- Validación del lado del cliente y servidor
- TypeScript para prevenir errores de tipos
- Headers de autenticación en todas las peticiones

## 📝 Notas Importantes

1. **Compatibilidad con Dashboard Actual**
   - La estructura de carpetas coincide exactamente
   - Los tipos TypeScript son compatibles
   - Las rutas siguen el mismo patrón

2. **Variables de Entorno**
   - `.env.local` ya está configurado
   - NO commitear en Git (ya está en .gitignore)

3. **Versiones**
   - Next.js 16.0.6 (última estable)
   - React 19.2.0 (última estable)
   - Tailwind CSS v4 (con @theme)
   - Zod v4 (con nueva API)

## 🆘 Solución de Problemas

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Variables de entorno no definidas
Verifica que `.env.local` existe y tiene las variables correctas.

## ✅ Checklist Completo

- [x] Proyecto creado con `npm create next-app@latest`
- [x] Estructura de carpetas `src/` configurada
- [x] TypeScript configurado
- [x] Tailwind CSS v4 instalado
- [x] shadcn/ui components agregados
- [x] React Hook Form + Zod configurado
- [x] Variables de entorno creadas
- [x] Servicio API implementado
- [x] Validaciones con Zod
- [x] Formulario completo funcional
- [x] Diseño responsive premium
- [x] Animaciones con Framer Motion
- [x] Types TypeScript completos
- [x] Error handling implementado
- [x] Success/Error feedback UI
- [x] README completo

---

**Desarrollado con ❤️ por el equipo de Aelityx**

**Powered by Pixeles 🎨**
