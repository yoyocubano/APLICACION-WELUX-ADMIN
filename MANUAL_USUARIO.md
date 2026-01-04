# Manual de Usuario: Welux Admin App 📱
*(Versión 2.0 - Universal Streaming Edition)*

Bienvenido al panel de control de Welux Events. Esta aplicación te permite gestionar los clientes potenciales (Leads) y controlar la emisión en vivo de la página web.

---

## 🔑 ATAJO SECRETO - Acceso Rápido desde la Web

**Combinación de Teclas Mágica:**
- **Mac:** `Cmd + Shift + L`
- **Windows/Linux:** `Ctrl + Shift + L`

Cuando estés en **weluxevents.com**, presiona esta combinación para acceder instantáneamente al panel Admin.
Este atajo **solo tú lo conoces** y realiza login automático.

---

## 1. Acceso (Login) 🔐
Para entrar en la aplicación, necesitas el Código Maestro de Seguridad.
*   **Código Actual:** `welux2026`
*   *(Nota: Este código se gestiona desde la base de datos Supabase, tabla `app_settings`)*.

---

## 2. Panel de Control (Dashboard) 📊
La pantalla principal te ofrece una vista rápida del estado del negocio.
*   **Total Leads:** Contador en tiempo real de los clientes registrados en la base de datos.
*   **Revenue:** Estimación de ingresos (Demo).
*   **Live Status:** Indica si hay una transmisión activa configurada.

---

## 3. Gestión de Leads (CRM) 👥
En la pestaña de "Contactos", puedes ver la lista de todos los formularios recibidos desde la web.

*   **Ver Detalles:** Toca cualquier tarjeta para desplegar el mensaje completo del cliente.
*   **Contactar:**
    *   📞 **Botón Llamar:** Abre el teléfono con el número del cliente.
    *   📧 **Botón Email:** Abre tu app de correo para responder al cliente.
*   **Filtros:** Usa las pestañas superiores para filtrar por "Nuevos", "Contactados", etc.

---

## 4. Centro de Streaming Universal (Live) 📡
**Esta es la sala de máquinas de tu web.** Desde aquí decides qué video se muestra en la sección "En Vivo" de `weluxevents.com`.

### Pasos para Emitir (Paso a Paso):

1.  Ve a la pestaña **Streaming** (Icono de cámara 🎥).
2.  **Selecciona la Fuente de Emisión:**
    Toca el botón correspondiente a la plataforma que vas a usar:

    *   🔴 **YouTube:** Ideal para videos musicales, resúmenes o directos de YouTube.
        *   *¿Qué pegar?:* El enlace completo del video (Ej: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).

    *   🟣 **Twitch:** Ideal para retransmitir canales de gaming o eventos.
        *   *¿Qué pegar?:* Solo el **nombre del canal** (Ej: `ibai`, `weluxevents`).

    *   🔗 **Link / OBS:** Para usar tu propio servidor de streaming o OBS Studio.
        *   *¿Qué pegar?:* La URL directa del flujo de video (suele terminar en `.m3u8` o `.mp4`).
        *   *Ejemplo:* `https://mi-servidor.com/hls/stream.m3u8`

    *   📝 **HTML (Avanzado):** Para incrustar reproductores de Facebook, Vimeo, Dailymotion, etc.
        *   *¿Qué pegar?:* El código de inserción completo que te da la plataforma (Empieza por `<iframe...`).

3.  **Introduce el ID/Link:** Pega el contenido en el campo de texto.
4.  **Pulsa "ACTUALIZAR SITIO WEB"**: El botón negro inferior.
5.  **Confirmación:** Espera a que aparezca el mensaje *"¡Web actualizada con éxito!"*.

¡Listo! En ese momento, la página web `weluxevents.com` cambiará su reproductor automáticamente para mostrar la señal que has elegido.

---
*Generado por Welux Architect Team - 2026*
