# 🎨 ESPECIFICACIONES STITCH - Live Streaming Control Screen
**Diseñador:** Stitch AI  
**Fecha:** 2026-01-04  
**Estado:** ROADMAP FASE 2

---

## 📋 DESCRIPCIÓN GENERAL

Pantalla de control activo de transmisión en vivo, estilo OBS/StreamYard, para gestionar streams EN TIEMPO REAL desde la app móvil.

**Diferencia con StreamingScreen actual:**
- **Actual:** Configura QUÉ URL/plataforma mostrar en la web (YouTube, Twitch, etc.)
- **Stitch propuesta:** Controla UNA transmisión en vivo con preview, stats y botón Go Live

---

## 🧩 COMPONENTES DETALLADOS

### Component 4.1: Root View Container
- `flex: 1`
- `backgroundColor: #FAF8F3` (Soft Cream)
- `padding: 16px`
- `paddingTop: 24px`

### Component 4.2: Header Title
- **Text:** "Control de Transmisión"
- `fontFamily: 'Georgia'` (serif)
- `fontSize: 28px`
- `fontWeight: 'bold'`
- `color: #333333`
- `marginBottom: 24px`

### Component 4.3: Stream Preview Window
- **Purpose:** Vista previa del video EN VIVO
- `width: '100%'`
- `aspectRatio: 16/9`
- `backgroundColor: #1A1A1A` (cuando está offline)
- `borderRadius: 12px`
- `overflow: 'hidden'`
- **Placeholder Text:** "Stream Offline"
  - `fontSize: 18px`
  - `color: #A0A0A0`

### Component 4.4: Stream Status Indicator (Card)
- `backgroundColor: #FFFFFF`
- `borderRadius: 10px`
- `padding: 16px`
- `flexDirection: 'row'`
- `justifyContent: 'space-between'`
- Shadow: Same as LeadCard

#### 4.5: Status Dot & Text
- **Dot:**
  - `width: 12px`
  - `height: 12px`
  - `borderRadius: 6px`
  - `backgroundColor: red` (Offline) / `green` (Live)
- **Text:** "Offline" / "Live"
  - `fontSize: 18px`
  - `fontWeight: 'bold'`

#### 4.6: Viewer Count
- Icon: user icon (20px, #A0A0A0)
- **Text:** "1,452" (live count)
  - `fontSize: 18px`
  - `fontWeight: 'bold'`

### Component 4.7: Stream Title Input
- Same styling as Login input
- `height: 56px`
- `backgroundColor: #FFFFFF`
- `borderRadius: 8px`
- `placeholder: "Título de la Transmisión"`

### Component 4.8: Go Live / End Stream Button
- `width: '100%'`
- `height: 56px`
- `borderRadius: 8px`
- `backgroundColor: green` ("GO LIVE") / `red` ("END STREAM")
- **Text:**
  - `color: #FFFFFF`
  - `fontSize: 18px`
  - `fontWeight: 'bold'`

---

## 🔧 REQUISITOS TÉCNICOS PARA IMPLEMENTACIÓN

### Backend Necesario:
1. **Servidor de Streaming** (RTMP/WebRTC)
   - Sugerencia: Agora.io, Daily.co, o Mux
2. **API de Viewers** en tiempo real
   - WebSocket connection
3. **Stream Key Management**
   - Generar y almacenar keys por sesión

### Frontend Necesario:
1. **Video Player Component**
   - react-native-video o similar
2. **WebSocket Client**
   - Para stats en tiempo real
3. **Camera Access** (si stream desde móvil)
   - expo-camera

### Supabase Schema:
```sql
CREATE TABLE live_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  status TEXT CHECK (status IN ('offline', 'live', 'ended')),
  stream_key TEXT UNIQUE,
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📅 ROADMAP

### Fase 1 (Actual - Completada):
- ✅ StreamingScreen: Configurador de URL/plataforma

### Fase 2 (Futuro - Esta spec):
- ⏳ Implementar backend de streaming
- ⏳ Agregar Live Streaming Control Screen según Stitch
- ⏳ Integrar viewer stats en tiempo real

### Fase 3 (Avanzado):
- ⏳ Multi-camera support
- ⏳ Chat en vivo integrado
- ⏳ Recording automático

---

## 💰 ESTIMACIÓN

**Tiempo:** 2-3 días de desarrollo full-time  
**Costo de servicios:** $50-200/mes (Agora/Mux)  
**Complejidad:** ALTA

---

**Nota del Ingeniero Senior:**  
Esta funcionalidad es un **gran salto de features**. Requiere infraestructura de streaming profesional. Recomiendo implementar en Fase 2 cuando el MVP actual esté 100% pulido y haya demanda comprobada del cliente.
