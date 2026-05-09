# Enciclopedia Naturista de Chile — Reglas del Proyecto

## Descripción general

Aplicación web estática (PWA) de referencia herbolaria chilena: **85 plantas medicinales** y **1.058 recetas tradicionales** de la cultura mapuche, chilota y popular chilena.  
Sin framework, sin build step. HTML + CSS + JS vanilla + Python HTTP server (puerto 8787).

---

## Estructura de archivos

```
proyecto/
├── index.html          ← Toda la estructura HTML. Una sola página (SPA con tabs).
├── styles.css          ← ~4.200 líneas. Sistema de diseño completo.
├── script.js           ← ~2.800 líneas. Toda la lógica JS.
├── illustrations.js    ← SVG artwork para cards de recetas (no tocar sin motivo).
├── sw.js               ← Service Worker (PWA, caché network-first para archivos locales).
├── manifest.json       ← Configuración PWA.
├── data/
│   ├── plantas.json    ← Array de 85 objetos planta.
│   └── recetas.json    ← Array de 1058 objetos receta.
├── img/                ← Imágenes locales de plantas (JPG/WEBP).
├── agregar_plantas.py  ← Script CLI para añadir plantas.
├── agregar_recetas.py  ← Script CLI para añadir recetas.
└── .claude/
    └── launch.json     ← Servidor de preview (python -m http.server 8787).
```

---

## Reglas de desarrollo — NO NEGOCIABLES

### 1. No agregar dependencias externas
El proyecto es 100% vanilla. No instalar npm, no agregar frameworks (React, Vue, etc.), no librerías de componentes. Las únicas dependencias externas permitidas son las ya existentes:
- Google Fonts (Playfair Display + Inter)
- Font Awesome 6.5 (iconos)
- Chart.js 4.4 (solo en stats tab)

### 2. No crear archivos nuevos sin justificación
Todo el CSS va en `styles.css`, todo el JS en `script.js`, toda la estructura en `index.html`.  
Excepción: scripts Python auxiliares para enriquecer datos.

### 3. No tocar `data/plantas.json` ni `data/recetas.json` manualmente
Usar los scripts Python `agregar_plantas.py` y `agregar_recetas.py` para añadir contenido, o editarlos con mucho cuidado respetando el schema.

### 4. El service worker usa network-first para archivos locales
**No cambiar** la estrategia de caché para `script.js`, `styles.css` e `index.html`. Si se cambia a cache-first, los cambios no se reflejarán en el navegador hasta que el usuario limpie la caché manualmente.

### 5. No exponer información interna al usuario
La sección "Cómo agregar más contenido" fue eliminada intencionalmente. No volver a agregar instrucciones de desarrollo, rutas de archivos, scripts o estructuras técnicas en el UI visible.

### 6. Toda la información es para el usuario final
Antes de agregar cualquier sección o dato, preguntarse: **¿Le sirve esto a alguien que busca remedios naturales?** Si la respuesta es no, no va.

---

## Sistema de diseño (CSS)

### Paleta de colores (variables CSS)
```css
--bg-deep:       #14180f   /* Fondo principal oscuro */
--bg-1:          #1a1f14   /* Superficie nivel 1 */
--bg-2:          #1e2418   /* Superficie nivel 2 (cards) */
--moss:          #6a8a52   /* Verde musgo principal */
--moss-bright:   #9bbb7a   /* Verde musgo brillante (accents, CTA) */
--amber:         #d4a574   /* Ámbar (recetario, detalles cálidos) */
--terracotta:    #c97b56   /* Terracota (alertas, emergencia) */
--text:          #e8e4dc   /* Texto principal */
--text-soft:     #c8c4bc   /* Texto secundario */
--text-mute:     #8a8680   /* Texto atenuado */
--glass-bg:      rgba(255,255,255,0.04)
--glass-border:  rgba(255,255,255,0.08)
--glass-border-hi: rgba(255,255,255,0.12)
```

### Tipografía
- **Títulos y nombres de plantas**: `'Playfair Display', Georgia, serif` — peso 600–700
- **Cuerpo y UI**: `'Inter', system-ui, sans-serif` — peso 300–600
- **Tamaño base**: 16px en body

### Border radius
```css
--r-sm: 10px   /* Badges, chips, inputs */
--r-md: 14px   /* Cards pequeñas */
--r:    18px   /* Cards estándar */
--r-xl: 24px   /* Modal, cards hero */
--r-2xl: 32px  /* Secciones hero */
```

### Glassmorphism (patrón para cards)
```css
background: var(--glass-bg);
border: 1px solid var(--glass-border);
backdrop-filter: blur(12px);
border-radius: var(--r);
```

---

## Arquitectura JavaScript

### Helpers principales
```js
$(selector)   // document.querySelector — solo elementos únicos
$$(selector)  // document.querySelectorAll — listas
```

### Datos globales
```js
plantasDB   // Array<Planta> — cargado vía fetch de data/plantas.json
recetasDB   // Array<Receta> — cargado vía fetch de data/recetas.json
favoritos   // Array<number> de IDs — localStorage 'favoritos'
plantasVistas // Set<number> de IDs — localStorage 'plantasVistas'
```

### Funciones clave
```js
cambiarTab(tabId)              // Navegación entre tabs ('plants','recipes','maternidad','dolencias','tools','stats')
renderPlantas()                // Re-renderiza el grid de plantas (llama getSortedPlantas)
getSortedPlantas(lista)        // Ordena array de plantas según el sortSelect activo
renderMaternidad()             // Renderiza plantas + recetas de embarazo/lactancia
renderEstadisticas()           // Renderiza toda la pestaña de estadísticas
abrirDetallePlanta(id)         // Abre modal con detalle completo de planta
abrirDetalleReceta(id)         // Abre modal con detalle completo de receta
cerrarModal()                  // Cierra cualquier modal
mostrarToast(html, tipo)       // Notificación tipo 'ok' | 'warn' | 'remove' | 'info'
leerNota(plantaId)             // Lee nota personal desde localStorage
guardarNota(plantaId, texto)   // Guarda nota personal en localStorage
actualizarChipCounts()         // Actualiza badges de conteo en filtros (llamar tras cargar DB)
renderTuExploracion()          // Actualiza la card personal en Estadísticas
```

### Constantes importantes
```js
EMB_DESTACADAS   // Array<string> — nombres de plantas útiles en embarazo
LAC_GALACTOGOGAS // Array<string> — nombres de plantas que favorecen la leche
SISTEMAS         // Array<Sistema> — 16 sistemas del cuerpo con gradientes y categorías
MESES            // {1:'Enero', 2:'Febrero', ...} — nombres de meses
```

### Orden de las pestañas (tab IDs)
```
plants → recipes → maternidad → dolencias → tools → stats
```
Este orden está fijado en el HTML. No cambiar sin actualizar `cambiarTab()` y el indicador visual.

---

## Schema de datos

### Planta (`data/plantas.json`)
```json
{
  "id": 1,
  "nombre": "Boldo",
  "cientifico": "Peumus boldus",
  "familia": "Monimiaceae",
  "parte": "Hojas",
  "usos": "Digestivo, hepático, antioxidante...",
  "chiloe": true,
  "region": "Valparaíso, Maule, Biobío",
  "emoji": "🌿",
  "precaucion": "No usar en embarazo. Evitar con problemas biliares graves.",
  "peligroso": false,
  "protegida": false,
  "meses": [9, 10, 11, 12],
  "keywords": ["digestión", "hígado", "bilis"],
  "imagen": "https://upload.wikimedia.org/..."
}
```

**Campos obligatorios**: `id`, `nombre`, `cientifico`, `usos`, `precaucion`  
**`peligroso: true`** → aparece badge de advertencia y se excluye de embarazo/lactancia  
**`protegida: true`** → aparece badge de especie protegida  
**`meses`** → números 1–12 indicando mejor época de recolección  
**`chiloe: true`** → aparece en filtro "Solo Chiloé"

### Receta (`data/recetas.json`)
```json
{
  "id": 1,
  "titulo": "Infusión digestiva de boldo",
  "categoria": "Digestivo",
  "origen": "Tradición chilena",
  "ingredientes": "2 hojas de boldo, 1 taza de agua caliente",
  "preparacion": "Hervir el agua, agregar las hojas...",
  "dosis": "1 taza después de las comidas",
  "modo_uso": "Infusión",
  "tiempo_prep": "5 minutos",
  "dificultad": "Fácil",
  "rendimiento": "1 taza",
  "conservacion": "Consumir de inmediato",
  "evidencia": "Uso tradicional documentado",
  "fuente_tradicion": "Medicina mapuche",
  "contraindicaciones": "Embarazo, problemas biliares"
}
```

**Categorías válidas** (37 en total): Alergia, Alimenticio, Analgésico, Antifúngico, Antiinflamatorio, Antiparasitario, Baño, Cabello, Cardiovascular, Cicatrizante, Cosmético, Dental, Dermatológico, Diarrea, Digestivo, Diurético, Energizante, Espiritual, Expectorante, Febrífugo, Garganta, General, Ginecológico, Hepático, Medicina Mapuche, Memoria, Nervioso, Nutritivo, Oftalmológico, Oídos, Pediátrico, Renal, Resfriados, Respiratorio, Reumatismo, Sedante, Tos

---

## Preview y desarrollo

### Iniciar servidor
```bash
# Opción 1 — desde .claude/launch.json (Claude Code preview)
# Usar preview_start con name: "Enciclopedia Medicinal"

# Opción 2 — manual
python -m http.server 8787
# Abrir: http://localhost:8787
```

### Flujo de cambios
1. Editar `index.html`, `styles.css` o `script.js`
2. El servidor Python sirve los archivos directamente desde disco (sin caché)
3. Si el service worker está activo, hacer hard reload (`Ctrl+Shift+R`) o usar eval para desregistrarlo:
   ```js
   navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()));
   caches.keys().then(k => k.forEach(x => caches.delete(x)));
   location.reload(true);
   ```
4. Verificar cambios con `preview_eval` antes de reportar como completado
5. **Siempre hacer commit y push al terminar cada tarea** — nunca dejar cambios sin subir

### Problema conocido: screenshots lentos
Los screenshots del preview pueden timeout por las animaciones CSS (`orbDrift`, `gradShift`). Usar `preview_eval` para verificar lógica y DOM cuando el screenshot falla.

---

## Reglas de UX — qué NO hacer

| ❌ Incorrecto | ✅ Correcto |
|---|---|
| Mostrar datos sin contexto para el usuario ("51 plantas") | Mostrar con acción ("51 plantas en Chiloé → ver cuáles") |
| Información de desarrollo en el UI (rutas, scripts, schemas) | Solo contenido útil para quien busca plantas medicinales |
| Secciones solo con números/barras estáticas | Elementos interactivos que llevan al usuario a la información |
| Texto técnico en inglés en el UI | Todo el UI en español de Chile |
| Modales sin botón de cerrar accesible | Siempre: botón ×, clic en overlay, tecla Esc |
| Confirmaciones de eliminación sin advertencia | Siempre avisar antes de acciones destructivas |
| Botones/tarjetas del mismo aspecto genérico oscuro | Cada elemento con identidad visual propia usando `--rsis-color` (fondo tintado, borde y glow del color del sistema) |

---

## Características implementadas (no duplicar)

- **Planta del Día** — se rota automáticamente cada 24h (localStorage)
- **Favoritos** — localStorage, badge contador en header
- **Notas personales** — por planta, localStorage `plantNotas`
- **Vista grid/lista** — toggle con ícono, recuerda preferencia
- **Ordenamiento** — A→Z, temporada, precaución, Chiloé
- **Filtros** — Chiloé, Favoritos, En temporada, Por síntoma, Por región
- **Contador en filtros** — chips muestran cuántas plantas hay en cada filtro
- **Búsqueda global** — busca en nombre, cientifico, usos, keywords
- **Barra de progreso** — muestra plantas exploradas vs total
- **Botón aleatorio** — abre planta al azar
- **Compartir** — Web Share API (móvil) o clipboard (escritorio)
- **Barra de lectura** — progreso de scroll en modal de planta
- **Back-to-top** — aparece al bajar 280px
- **Keyboard shortcuts** — `/` para buscar, `Esc` para cerrar modales
- **Quiz de plantas** — modal con preguntas interactivas
- **Calendario interactivo** — clic en mes muestra plantas en temporada
- **Zona interactiva** — clic en región muestra plantas de esa área
- **Recetas en Maternidad** — filtradas automáticamente por seguridad
- **"Tu exploración"** — estadísticas personales en pestaña Estadísticas
- **PWA** — manifest + service worker (network-first para archivos locales)
- **Ajustes visuales** — panel de partículas, fondo animado, cursor hoja

---

## Convenciones de código

### CSS
- Agrupar por componente con comentarios `/* ── Nombre ── */`
- Usar variables CSS (`var(--moss-bright)`) — nunca colores hardcoded
- Mobile-first para nuevas secciones
- Transiciones estándar: `all 0.22s` o `transform 0.18s`

### JavaScript
- Las funciones `render*` son idempotentes (se pueden llamar varias veces sin efectos secundarios)
- Usar template literals para HTML generado dinámicamente
- Eventos se registran dentro de la función `render*` correspondiente (no al inicio global)
- `localStorage` keys usadas: `favoritos`, `plantasVistas`, `plantNotas`, `tweaks`, `plantaDiaFecha`, `plantaDiaId`

### HTML
- Semántica correcta: `<button>` para acciones, `<a>` para navegación
- Atributos `title` y `aria-label` en iconos sin texto
- `loading="lazy"` en todas las imágenes de plantas
- IDs de tab content: `plantsTab`, `recipesTab`, `maternidadTab`, `dolenciasTab`, `toolsTab`, `statsTab`
