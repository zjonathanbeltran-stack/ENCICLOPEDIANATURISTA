# 🌿 Enciclopedia Naturista de Chile

> Atlas herbolario digital de la sabiduría medicinal chilena — mapuche, chilota y popular.

[![Deploy](https://img.shields.io/github/deployments/zjonathanbeltran-stack/ENCICLOPEDIANATURISTA/github-pages?label=GitHub%20Pages&logo=github)](https://zjonathanbeltran-stack.github.io/ENCICLOPEDIANATURISTA/)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8?logo=pwa)](https://zjonathanbeltran-stack.github.io/ENCICLOPEDIANATURISTA/)

**Demo:** https://zjonathanbeltran-stack.github.io/ENCICLOPEDIANATURISTA/

---

## ¿Qué es?

Aplicación web progresiva (PWA) de referencia herbolaria chilena con **85 plantas medicinales** y más de **1.058 recetas tradicionales** organizadas por sistema corporal, condición de salud y pueblo originario.

Funciona sin conexión, se instala como app nativa y está optimizada para móvil.

---

## Características

- **85 plantas medicinales** con nombre científico, región, temporada de recolección y contraindicaciones
- **1.058 recetas tradicionales** de medicina mapuche, chilota y popular chilena
- **Buscador inteligente** por síntoma, sistema corporal y condición específica (3 niveles)
- **Guía de Maternidad** — plantas seguras, a evitar y recetas para embarazo y lactancia
- **Medicina Ancestral** — recetas por pueblo originario (mapuche, aymara, atacameño, etc.)
- **PWA instalable** — funciona sin conexión con Service Worker network-first
- **Estadísticas personales** — seguimiento de plantas exploradas y favoritas
- **Herramientas** — calendario de temporadas, quiz de plantas, zona interactiva por región

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3 (variables + glassmorphism), JavaScript ES2022 vanilla |
| PWA | Service Worker (network-first) + Web App Manifest |
| Fuentes | Google Fonts (Playfair Display + Inter) |
| Iconos | Font Awesome 6.5 |
| Gráficos | Chart.js 4.4 (solo pestaña Estadísticas) |
| Deploy | GitHub Pages + GitHub Actions |
| Servidor local | Python `http.server` |

Sin frameworks. Sin npm. Sin build step. Carga directa en el navegador.

---

## Estructura del proyecto

```
ENCICLOPEDIANATURISTA/
├── index.html              # Estructura SPA completa
├── styles.css              # Sistema de diseño (~8.000 líneas)
├── script.js               # Lógica de la aplicación (~3.200 líneas)
├── illustrations.js        # Artwork SVG para tarjetas de recetas
├── sw.js                   # Service Worker (network-first)
├── manifest.json           # Configuración PWA
├── img/                    # Imágenes de plantas (JPG/WEBP) + fondo
├── data/
│   ├── plantas.json        # 85 plantas con metadata completa
│   ├── recetas.json        # 1.058 recetas (fuente completa)
│   └── modulos/            # Módulos por sistema corporal
│       ├── digestivo/      # → estomago/, higado/, intestino/, ...
│       ├── respiratorio/   # → tos/, gripe/, sinusitis/, ...
│       ├── nervioso/       # → insomnio/, ansiedad/, ...
│       ├── dolores/        # → reumatismo/, muscular/, cabeza/, ...
│       ├── cardiovascular/ # → colesterol/, presion/, rinones/, ...
│       └── ...             # (11 sistemas en total)
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD automático a GitHub Pages
```

---

## Instalación y uso local

### Requisitos
- Python 3.x (incluido en macOS/Linux; en Windows instalar desde python.org)
- Navegador moderno (Chrome, Edge, Firefox, Safari)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/zjonathanbeltran-stack/ENCICLOPEDIANATURISTA.git
cd ENCICLOPEDIANATURISTA

# 2. Iniciar servidor local
python -m http.server 8787

# 3. Abrir en el navegador
# http://localhost:8787
```

> **Importante:** Usar un servidor HTTP (no abrir `index.html` directamente) para que el Service Worker y las peticiones JSON funcionen correctamente.

---

## PWA — Instalación como app

### En móvil (Android/iOS)
1. Abrir la URL en Chrome o Safari
2. Tocar el menú del navegador (⋮ o botón compartir)
3. Seleccionar **"Añadir a pantalla de inicio"** o **"Instalar app"**

### En escritorio (Chrome/Edge)
1. Abrir la URL
2. Hacer clic en el ícono de instalación en la barra de direcciones (⊕)
3. Confirmar instalación

La app funciona **sin conexión a internet** después de la primera visita.

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
  "usos": "Digestivo, hepático, antioxidante",
  "region": "Valparaíso, Maule, Biobío",
  "emoji": "🌿",
  "precaucion": "No usar en embarazo.",
  "peligroso": false,
  "protegida": false,
  "meses": [9, 10, 11],
  "keywords": ["digestión", "hígado"],
  "chiloe": false
}
```

### Receta (`data/recetas.json`)
```json
{
  "id": 1,
  "titulo": "Infusión digestiva de boldo",
  "categoria": "Digestivo",
  "origen": "Tradición chilena",
  "ingredientes": "2 hojas de boldo, 1 taza de agua",
  "preparacion": "Hervir el agua, agregar las hojas...",
  "dosis": "1 taza después de las comidas",
  "modo_uso": "Infusión",
  "tiempo_prep": "5 minutos",
  "dificultad": "Fácil",
  "evidencia": "Uso tradicional documentado",
  "fuente_tradicion": "Medicina mapuche",
  "contraindicaciones": "Embarazo, problemas biliares"
}
```

---

## Scripts auxiliares

Scripts Python para mantener los datos modulares:

```bash
# Agregar una nueva planta
python agregar_plantas.py

# Agregar nuevas recetas
python agregar_recetas.py

# Regenerar módulos de condiciones (por sistema)
python crear_condiciones_digestivo.py
python crear_condiciones_cardiovascular.py
python crear_condiciones_dolores.py
# ... (uno por sistema corporal)
```

---

## Contribuir

1. Fork del repositorio
2. Crear rama: `git checkout -b feat/nueva-funcionalidad`
3. Commit: `git commit -m "feat: descripción del cambio"`
4. Push: `git push origin feat/nueva-funcionalidad`
5. Abrir Pull Request

---

## Licencia

Contenido etnobotánico de dominio público y tradición oral chilena.  
Código fuente bajo licencia MIT.

---

*Hecho con respeto por la sabiduría herbolaria de Chile.*
