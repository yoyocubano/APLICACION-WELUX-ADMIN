# ✅ AUDITORÍA COMPLETA WELUX ADMIN APP - CHECKLIST CORRECCIONES

**Generado:** 2026-01-04  
**Estado:** READY FOR DEVELOPMENT

---

## 🔴 PRIORIDAD ALTA (Corregir AHORA)

### 1. **Mock Data Fallback** (3 archivos)
**Archivos afectados:**
- `src/screens/vlogs/VlogListScreen.js` (líneas 37-44)
- `src/screens/jobs/JobListScreen.js` (líneas 38-43)
- `src/screens/deals/DealListScreen.js` (similar pattern)

**Problema:**
```javascript
catch (err) {
    console.log("Error fetching vlogs, using mock data:", err);
    setVlogs([/* mock data */]);
}
```

**Corrección:**
```javascript
catch (err) {
    console.error("Error fetching vlogs:", err);
    setError('Failed to load vlogs');
    setVlogs([]);
}
```

**Agregar estado de error:**
```javascript
const [error, setError] = useState(null);

// En el render:
{error && <Text style={styles.errorText}>{error}</Text>}
```

---

### 2. **Navegación con Objetos Completos** (6 archivos)
**Archivos afectados:**
- VlogListScreen.js (línea 62): `{vlog: item}`
- JobListScreen.js (línea 62): `{job: item}`
- DealListScreen.js (similar)

**Problema:** Datos pueden quedar desactualizados

**Corrección:**
```javascript
// ANTES:
onPress={() => navigation.navigate('AddEditVlog', { vlog: item })}

// DESPUÉS:
onPress={() => navigation.navigate('AddEditVlog', { vlogId: item.id })}
```

---

### 3. **AddEdit Screens - Cargar Datos Frescos** (3 archivos)
**Archivos afectados:**
- AddEditVlogScreen.js
- AddEditJobScreen.js
- AddEditDealScreen.js

**Agregar lógica de fetch:**
```javascript
const [itemData, setItemData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (vlogId) {
        fetchVlog();
    } else {
        setLoading(false);
    }
}, []);

const fetchVlog = async () => {
    const { data, error } = await supabase
        .from('vlogs')
        .select('*')
        .eq('id', vlogId)
        .single();
    
    if (!error && data) {
        setTitle(data.title);
        setDescription(data.description);
        setItemData(data);
    }
    setLoading(false);
};
```

---

### 4. **App.js - Session Check**
**Archivo:** `App.js`

**Agregar:**
```javascript
export default function App() {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const session = await AsyncStorage.getItem('welux_session');
        setInitialRoute(session === 'active' ? 'Main' : 'Login');
    };

    if (!initialRoute) {
        return <ActivityIndicator size="large" color="#D4AF37" />;
    }

    return (
        // ... NavigationContainer con initialRouteName={initialRoute}
    );
}
```

---

### 5. **Dashboard - Conectar streamingStatus**
**Archivo:** `src/screens/DashboardScreen.js`

**En `fetchStats`:**
```javascript
// Agregar query de stream status
const { data: streamData } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'current_stream_id')
    .single();

setStats(prev => ({
    ...prev,
    totalLeads: count || 0,
    streamingStatus: streamData?.value ? 'LIVE' : 'OFFLINE'
}));
```

---

## 🟡 PRIORIDAD MEDIA (Siguientes días)

### 6. **Timestamps en DB (no cliente)**
**Configuración SQL en Supabase:**
```sql
-- Para todas las tablas: vlogs, jobs, deals, client_inquiries
ALTER TABLE vlogs 
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_ SET DEFAULT now();

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vlogs_updated_at 
  BEFORE UPDATE ON vlogs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Remover del código cliente:**
```javascript
// ELIMINAR de handleSave:
updated_at: new Date(),
created_at: new Date(),
```

---

### 7. **Dashboard Mock Metrics**
**Archivo:** `DashboardScreen.js`

**Eliminar:**
- Revenue card (líneas 169-178)
- weeklyGrowth de stats

**Opcional:** Reemplazar con métricas reales calculadas

---

### 8. **Demo Mode Alerts**
**Archivos:** AddEditVlogScreen, AddEditJobScreen, AddEditDealScreen

**Eliminar:**
```javascript
// ELIMINAR:
Alert.alert("Demo Mode", "Job saved locally (mock).", [
    { text: "OK", onPress: () => navigation.goBack() }
]);
```

**Reemplazar con:**
```javascript
Alert.alert("Error", `Could not save: ${err.message}`);
```

---

## 🟢 PRIORIDAD BAJA (Futuro)

### 9. **Navegación Anidada**
**Refactorizar App.js** para estructura:
```
MainTabs
├─ OverviewStack (Dashboard)
├─ LeadsStack (LeadsScreen)
├─ ContentStack (ContentManager → Vlog/Job/Deal stacks)
└─ LiveStack (StreamingScreen)
```

### 10. **Supabase Auth Real**
- Eliminar master code
- Implementar email/password
- Crear tabla `admin_users`

### 11. **ContentManager Chat Button**
- Conectar a soporte real o eliminar

---

## 📝 TESTING CHECKLIST

Después de aplicar correcciones, probar:

- [ ] Login → guarda sesión → reabrir app (no vuelve a login)
- [ ] Dashboard muestra 6 leads (no 0)
- [ ] Recent Activity muestra leads reales (no "Sophie")
- [ ] Saludo cambia según hora del día
- [ ] Logout funciona → borra sesión
- [ ] Vlogs: crear, editar, borrar (sin mock data errors)
- [ ] Jobs: crear, editar, borrar (sin mock data errors)
- [ ] Deals: crear, editar, borrar (sin mock data errors)
- [ ] StreamingScreen: guardar configuración funciona
- [ ] LeadsScreen: muestra todos los leads de Supabase

---

## 💾 COMMITS SUGERIDOS

```bash
# Orden recomendado:
git commit -m "Fix: Remove mock data fallbacks from all List screens"
git commit -m "Fix: Pass IDs instead of objects in navigation"  
git commit -m "Fix: Load fresh data in AddEdit screens"
git commit -m "Feat: Implement session persistence check on app startup"
git commit -m "Feat: Connect streamingStatus to Supabase"
git commit -m "Refactor: Move timestamps to DB defaults"
git commit -m "Clean: Remove demo mode alerts and mock metrics"
```

---

**Estimated Total Time:** 3-4 hours  
**Complexity:** Medium  
**Impact:** HIGH - App will be production-ready
