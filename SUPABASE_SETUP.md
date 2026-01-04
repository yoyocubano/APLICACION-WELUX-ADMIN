# 🛡️ SUPABASE SETUP - Welux Events
**Guía de Configuración Completa**  
Fecha: Enero 2026

---

## 📌 INFORMACIÓN CRÍTICA

### Credenciales de Acceso
- **URL del Proyecto:** https://supabase.com/dashboard/project/[tu-project-id]
- **Service Role Key:** (Ver archivo `MIS_APIS.md`)
- **Anon Key:** (Ver archivo `MIS_APIS.md`)

### Tablas Principales
- `client_inquiries` → Leads de clientes
- `app_settings` → Configuraciones (stream_config, master_security_code)

---

## 🔒 PASO 1: ACTIVAR ROW LEVEL SECURITY (RLS)

**⏱️ Tiempo estimado:** 5 minutos  
**🎯 Objetivo:** Proteger tu base de datos de accesos no autorizados

### Instrucciones:
1. Ve a: https://supabase.com/dashboard → Tu proyecto
2. Click en `SQL Editor` (menú lateral izquierdo)
3. Click en `+ New query`
4. **Copia y pega este SQL completo:**

```sql
-- ============================================
-- ACTIVAR ROW LEVEL SECURITY (RLS)
-- ============================================

-- 1. Activar RLS en tablas principales
ALTER TABLE client_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 2. Política para client_inquiries
-- El backend (service_role) puede ESCRIBIR
-- La app admin (authenticated) puede LEER
CREATE POLICY "Backend can insert leads" 
ON client_inquiries
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Admin can read leads" 
ON client_inquiries
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Política para app_settings
-- Solo autenticados pueden leer configuraciones
CREATE POLICY "Authenticated can read settings" 
ON app_settings
FOR SELECT 
TO authenticated 
USING (true);

-- Admin puede actualizar settings (ej: stream_config)
CREATE POLICY "Authenticated can update settings" 
ON app_settings
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esto para ver tus políticas activas:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

5. Click en **`Run`** (o presiona `Ctrl + Enter`)
6. ✅ Deberías ver: `Success. No rows returned`

---

## 🔔 PASO 2: ACTIVAR REALTIME (Notificaciones Instantáneas)

**⏱️ Tiempo estimado:** 30 segundos  
**🎯 Objetivo:** Ver los leads aparecer en tiempo real en la App sin recargar

### Instrucciones:
1. Ve a: `Database` → `Tables` (menú lateral)
2. Busca la tabla `client_inquiries`
3. Click en los **`...`** (3 puntos verticales) al lado del nombre
4. Click en **`Edit table`**
5. Scroll hacia abajo hasta **"Enable Realtime"**
6. ✅ **Marca la casilla**
7. Click en **`Save`**

### Verificar que funcionó:
```sql
-- Ejecuta en SQL Editor:
SELECT * FROM pg_publication_tables 
WHERE tablename = 'client_inquiries';

-- Deberías ver: pubname = 'supabase_realtime'
```

---

## 📦 PASO 3: CREAR STORAGE BUCKET (Opcional - Para Imágenes)

**⏱️ Tiempo estimado:** 2 minutos  
**🎯 Objetivo:** Subir fotos de vlogs, portadas, logos desde la App

### Instrucciones:
1. Ve a: `Storage` (menú lateral)
2. Click en **`+ New bucket`**
3. **Nombre:** `vlog-media`
4. ✅ **Marcar:** "Public bucket"
5. Click en **`Create bucket`**

### Configurar Políticas de Acceso:
```sql
-- Ejecuta en SQL Editor:

-- Permitir que usuarios autenticados suban archivos
CREATE POLICY "Authenticated users can upload" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'vlog-media');

-- Permitir que usuarios autenticados actualicen sus archivos
CREATE POLICY "Authenticated users can update" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'vlog-media')
WITH CHECK (bucket_id = 'vlog-media');

-- Permitir que cualquiera lea los archivos (bucket público)
CREATE POLICY "Public can view files" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'vlog-media');
```

---

## 🚀 PASO 4: EDGE FUNCTIONS (Avanzado - Futuro)

**🎯 Objetivo:** Automatizar emails cuando llega un lead (sin usar n8n)

### Crear Edge Function:
```bash
# En tu terminal local:
npx supabase functions new notify-lead
```

### Código de la función:
**Archivo:** `supabase/functions/notify-lead/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json()
  
  // Enviar email con Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'notifications@weluxevents.com',
      to: Deno.env.get('LEAD_NOTIFICATION_EMAIL'),
      subject: `🆕 Nuevo Lead: ${record.name}`,
      html: `
        <h2>Nuevo Cliente Potencial</h2>
        <p><strong>Nombre:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Evento:</strong> ${record.eventType}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote>${record.message}</blockquote>
      `
    })
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Activar Database Webhook:
1. Ve a: `Database` → `Webhooks`
2. Click en **`+ Create a new hook`**
3. **Nombre:** `notify-on-lead`
4. **Tabla:** `client_inquiries`
5. **Evento:** `INSERT`
6. **URL:** `https://[tu-project].supabase.co/functions/v1/notify-lead`
7. **Método:** `POST`
8. **Headers:**
   ```json
   {
     "Authorization": "Bearer [tu-service-role-key]"
   }
   ```

---

## 🧪 TESTING Y VERIFICACIÓN

### Verificar RLS está activo:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('client_inquiries', 'app_settings');

-- Resultado esperado: rowsecurity = true
```

### Verificar Realtime está activo:
```sql
SELECT * FROM pg_publication_tables;
```

### Verificar Policies:
```sql
SELECT * FROM pg_policies 
WHERE schemaname = 'public';
```

### Insertar Lead de Prueba:
```sql
INSERT INTO client_inquiries (name, email, "eventType", message, phone)
VALUES (
  'Test Usuario',
  'test@welux.com',
  'Wedding',
  'Mensaje de prueba para verificar que todo funciona',
  '+352 621 234 567'
);
```

---

## 🆘 TROUBLESHOOTING

### Problema: "RLS is blocking my queries"
**Síntoma:** La App Admin no puede leer datos después de activar RLS

**Solución:**
```sql
-- Temporalmente desactivar RLS para debug:
ALTER TABLE client_inquiries DISABLE ROW LEVEL SECURITY;

-- Si funciona, el problema está en las policies
-- Revisa que las policies incluyan el rol correcto
```

### Problema: "Realtime no funciona"
**Síntoma:** Los leads no aparecen automáticamente

**Solución:**
1. Verifica que la tabla tenga Realtime habilitado
2. Verifica que el código de suscripción esté correcto
3. Abre Chrome DevTools → Network → WS (WebSocket)
4. Deberías ver conexión a `wss://...supabase.co/realtime/v1/websocket`

### Problema: "Storage upload failed"
**Síntoma:** Error al subir imágenes

**Solución:**
```sql
-- Verificar policies de storage:
SELECT * FROM storage.policies;

-- Si no hay policies, ejecuta de nuevo el SQL del PASO 3
```

---

## 📚 RECURSOS ÚTILES

- **Supabase Docs:** https://supabase.com/docs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **Realtime Guide:** https://supabase.com/docs/guides/realtime
- **Storage Guide:** https://supabase.com/docs/guides/storage

---

## 🎯 CHECKLIST FINAL

Marca cuando completes cada paso:

- [ ] RLS activado en `client_inquiries`
- [ ] RLS activado en `app_settings`
- [ ] Policies creadas (4 en total mínimo)
- [ ] Realtime habilitado en `client_inquiries`
- [ ] Storage bucket `vlog-media` creado (opcional)
- [ ] Storage policies configuradas (opcional)
- [ ] Edge Function creada (opcional - futuro)
- [ ] Lead de prueba insertado y visible en App

---

**Última actualización:** Enero 4, 2026  
**Autor:** Welux Architect Team
