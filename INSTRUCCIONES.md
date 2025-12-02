# 🚀 INSTRUCCIONES RÁPIDAS

## Para iniciar el proyecto:

1. Abre una terminal en la carpeta del proyecto
2. Ejecuta:

```bash
cd aelityx-eventos-form
npm run dev
```

3. Abre tu navegador en: **http://localhost:3000**

## Rutas disponibles:

- **/** - Página de inicio
- **/dashboard/eventos/nuevo** - Formulario de creación de eventos

## Variables de entorno:

Ya están configuradas en `.env.local`:
- NEXT_PUBLIC_API_URL="https://pixeles.aelityx.com/api"
- NEXT_PUBLIC_API_TOKEN="aelityx_pixeles_2025_secret"

## Stack utilizado:

✅ Next.js 16.0.6 (App Router)
✅ React 19.2.0
✅ TypeScript 5+
✅ Tailwind CSS v4
✅ shadcn/ui
✅ React Hook Form + Zod v4
✅ Framer Motion
✅ Lucide Icons

## Estructura principal:

```
src/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
│   ├── eventos/           # EventoForm.tsx
│   └── ui/                # shadcn/ui components
└── lib/                   # Lógica de negocio
    ├── api/               # Servicios API
    ├── validators/        # Schemas Zod
    ├── types/             # TypeScript types
    └── utils/             # Utilidades
```

## ¡TODO LISTO! 🎉

El proyecto está 100% funcional y listo para usar.
