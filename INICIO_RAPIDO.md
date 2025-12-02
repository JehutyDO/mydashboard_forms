# 🚀 INICIO RÁPIDO - 3 PASOS

## ✅ EL PROYECTO YA ESTÁ CORRIENDO

**URL:** http://localhost:3001

---

## 📍 Si necesitas reiniciar:

### 1️⃣ Abrir Terminal
Presiona `Ctrl + ñ` en VS Code o abre PowerShell

### 2️⃣ Navegar al Proyecto
```powershell
cd "c:\Users\beyon\Desktop\Project_Ae\0_dev_stack_learning\14_dashboard_weddings\aelityx_events_wedding_forms\aelityx-eventos-form"
```

### 3️⃣ Iniciar Servidor
```powershell
npm run dev
```

**¡Listo!** Abre: http://localhost:3001

---

## 🎯 RUTAS DISPONIBLES

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con presentación |
| `/dashboard/eventos/nuevo` | Formulario de creación de eventos |

---

## 🔧 COMANDOS ÚTILES

```powershell
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm start

# Verificar errores ESLint
npm run lint

# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📝 MODIFICAR VARIABLES DE ENTORNO

Edita el archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL="https://pixeles.aelityx.com/api"
NEXT_PUBLIC_API_TOKEN="aelityx_pixeles_2025_secret"
```

**Nota:** Después de cambiar variables de entorno, reinicia el servidor.

---

## 🎨 ARCHIVOS PRINCIPALES

### Para modificar el formulario:
📄 `src/components/eventos/EventoForm.tsx`

### Para cambiar validaciones:
📄 `src/lib/validators/evento.schema.ts`

### Para modificar estilos:
📄 `src/app/globals.css`

### Para cambiar la API:
📄 `src/lib/api/eventos.service.ts`

---

## ✅ VERIFICAR QUE TODO FUNCIONA

1. Servidor iniciado sin errores ✅
2. Abrir http://localhost:3001 ✅
3. Ver página de inicio ✅
4. Ir a /dashboard/eventos/nuevo ✅
5. Ver formulario completo ✅
6. Probar validación (campos vacíos) ✅

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Port already in use"
```powershell
# Next.js usa automáticamente el siguiente puerto disponible
# Si 3000 está ocupado, usará 3001, 3002, etc.
```

### Error: "Module not found"
```powershell
npm install
```

### Error: Cambios no se reflejan
```powershell
# Presiona Ctrl+C para detener el servidor
# Luego ejecuta de nuevo:
npm run dev
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- **README.md** → Documentación técnica completa
- **RESUMEN_PROYECTO.md** → Resumen ejecutivo
- **ARCHIVOS_CREADOS.md** → Lista de todos los archivos
- **INSTRUCCIONES.md** → Esta guía

---

## 🎉 ¡ÉXITO!

Tu proyecto está **100% funcional** y listo para usar.

**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui

**Desarrollado por:** Aelityx Team 🚀
