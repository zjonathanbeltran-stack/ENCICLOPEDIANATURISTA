/* ════════════════════════════════════════════════════════════════════
   ILUSTRACIONES SVG PROFESIONALES POR TIPO DE PREPARACIÓN
   Cada ilustración es vectorial, monocromática (currentColor + accent),
   estilo lineal moderno para sentar bien sobre los gradientes.
   ════════════════════════════════════════════════════════════════════ */

const ILLUSTRATIONS = {
    // ── INFUSIÓN / TÉ — taza con vapor ──
    infusion: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M55 95 Q53 60 60 50 L130 50 Q137 60 135 95 Q132 118 95 118 Q58 118 55 95 Z" stroke-width="2"/>
        <path d="M135 65 Q160 65 160 82 Q160 98 138 100" stroke-width="2"/>
        <ellipse cx="95" cy="50" rx="38" ry="5" fill="currentColor" opacity="0.15"/>
        <path d="M75 32 Q72 22 80 18 Q72 14 78 6" opacity="0.7"/>
        <path d="M95 30 Q92 20 100 16 Q92 12 98 4" opacity="0.7"/>
        <path d="M115 32 Q112 22 120 18 Q112 14 118 6" opacity="0.7"/>
        <path d="M82 60 Q88 65 95 60 M105 60 Q112 65 118 60" opacity="0.6"/>
        <circle cx="90" cy="73" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="100" cy="78" r="1.5" fill="currentColor" opacity="0.5"/>
    </svg>`,

    // ── DECOCCIÓN — olla con fuego ──
    decoccion: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 60 L150 60 L145 110 Q142 118 132 118 L68 118 Q58 118 55 110 Z" stroke-width="2"/>
        <path d="M45 60 L155 60" stroke-width="2.5"/>
        <path d="M60 60 L60 52 Q60 48 64 48 L80 48 Q84 48 84 52 L84 60" opacity="0.8"/>
        <path d="M116 60 L116 52 Q116 48 120 48 L136 48 Q140 48 140 52 L140 60" opacity="0.8"/>
        <path d="M75 40 Q72 28 82 25 Q76 18 86 14" opacity="0.7"/>
        <path d="M100 38 Q97 26 107 22 Q102 14 113 10" opacity="0.7"/>
        <path d="M125 40 Q122 30 132 27 Q126 20 136 16" opacity="0.7"/>
        <ellipse cx="100" cy="125" rx="35" ry="4" fill="currentColor" opacity="0.2"/>
    </svg>`,

    // ── JARABE — frasco con cuchara ──
    jarabe: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="65" y="40" width="50" height="20" rx="3" stroke-width="2"/>
        <path d="M68 60 L68 115 Q68 122 75 122 L105 122 Q112 122 112 115 L112 60 Z" stroke-width="2"/>
        <path d="M70 80 L110 80" opacity="0.6"/>
        <path d="M73 95 Q90 92 107 95 Q107 110 90 115 Q73 110 73 95 Z" fill="currentColor" opacity="0.18"/>
        <path d="M73 95 Q90 92 107 95" opacity="0.7"/>
        <path d="M75 30 L75 40 M105 30 L105 40" opacity="0.5"/>
        <path d="M70 30 L110 30" stroke-width="2"/>
        <ellipse cx="145" cy="55" rx="6" ry="14" stroke-width="1.6"/>
        <line x1="145" y1="69" x2="145" y2="115"/>
        <circle cx="80" cy="105" r="1.2" fill="currentColor"/>
        <circle cx="95" cy="100" r="1.2" fill="currentColor"/>
        <circle cx="100" cy="108" r="1.2" fill="currentColor"/>
    </svg>`,

    // ── CATAPLASMA — hojas machacadas en mortero ──
    cataplasma: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 90 Q50 70 100 70 Q150 70 150 90 L145 110 Q140 120 100 120 Q60 120 55 110 Z" stroke-width="2"/>
        <ellipse cx="100" cy="73" rx="50" ry="6" fill="currentColor" opacity="0.15"/>
        <path d="M125 35 Q135 50 130 70" stroke-width="2"/>
        <ellipse cx="128" cy="32" rx="6" ry="4"/>
        <path d="M75 65 Q60 55 65 40 Q80 38 90 50 Q88 62 75 65 Z" stroke-width="1.5" opacity="0.8"/>
        <path d="M68 50 L82 56" opacity="0.6"/>
        <path d="M105 65 Q120 56 118 42 Q103 38 95 52 Q98 63 105 65 Z" stroke-width="1.5" opacity="0.8"/>
        <path d="M115 48 L100 58" opacity="0.6"/>
        <path d="M85 70 Q90 62 100 60 Q110 62 115 70" opacity="0.5" stroke-width="1.4"/>
        <circle cx="80" cy="95" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="95" cy="100" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="115" cy="98" r="1.5" fill="currentColor" opacity="0.6"/>
    </svg>`,

    // ── BAÑO — tina con agua ──
    bano: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M30 75 L170 75 Q170 105 155 115 Q145 120 100 120 Q55 120 45 115 Q30 105 30 75 Z" stroke-width="2"/>
        <line x1="22" y1="75" x2="178" y2="75" stroke-width="2.5"/>
        <line x1="50" y1="120" x2="50" y2="130" stroke-width="2"/>
        <line x1="150" y1="120" x2="150" y2="130" stroke-width="2"/>
        <path d="M155 60 L155 50 Q155 42 165 42 L172 42" stroke-width="1.6"/>
        <circle cx="172" cy="42" r="3"/>
        <path d="M45 90 Q55 87 65 90 Q75 93 85 90 Q95 87 105 90" opacity="0.6"/>
        <path d="M115 95 Q125 92 135 95 Q145 98 155 95" opacity="0.6"/>
        <path d="M50 102 Q60 99 70 102 Q80 105 90 102" opacity="0.45"/>
        <path d="M75 60 Q70 50 80 48 M82 55 Q90 50 88 60" opacity="0.7"/>
        <path d="M115 58 Q108 50 118 48 M120 55 Q128 50 126 60" opacity="0.7"/>
    </svg>`,

    // ── TINTURA — frasco gotero ──
    tintura: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="78" y="20" width="44" height="14" rx="2" stroke-width="1.8"/>
        <line x1="100" y1="34" x2="100" y2="48"/>
        <ellipse cx="100" cy="50" rx="14" ry="4" stroke-width="1.6"/>
        <path d="M75 50 L75 110 Q75 120 85 122 L115 122 Q125 120 125 110 L125 50" stroke-width="2"/>
        <path d="M75 50 L125 50" stroke-width="2"/>
        <path d="M82 80 Q100 75 118 80 Q118 110 100 115 Q82 110 82 80 Z" fill="currentColor" opacity="0.2"/>
        <path d="M82 80 Q100 75 118 80" opacity="0.7"/>
        <line x1="85" y1="92" x2="92" y2="92" opacity="0.5"/>
        <line x1="85" y1="100" x2="92" y2="100" opacity="0.5"/>
        <line x1="85" y1="108" x2="92" y2="108" opacity="0.5"/>
        <circle cx="150" cy="125" r="2.5" fill="currentColor" opacity="0.7"/>
        <circle cx="160" cy="118" r="1.8" fill="currentColor" opacity="0.5"/>
        <ellipse cx="100" cy="125" rx="32" ry="3" fill="currentColor" opacity="0.15"/>
    </svg>`,

    // ── UNGÜENTO / POMADA — frasco ancho con tapa ──
    unguento: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="55" y="35" width="90" height="18" rx="3" stroke-width="2"/>
        <path d="M58 53 L58 110 Q58 120 68 122 L132 122 Q142 120 142 110 L142 53 Z" stroke-width="2"/>
        <line x1="58" y1="68" x2="142" y2="68" opacity="0.7"/>
        <ellipse cx="100" cy="68" rx="38" ry="3" fill="currentColor" opacity="0.25"/>
        <path d="M70 85 Q85 80 100 85 Q115 90 130 85" opacity="0.6"/>
        <path d="M70 100 Q85 95 100 100 Q115 105 130 100" opacity="0.5"/>
        <path d="M75 115 Q90 112 105 115 Q120 118 128 115" opacity="0.4"/>
        <text x="100" y="92" text-anchor="middle" font-family="serif" font-size="11" fill="currentColor" opacity="0.6" font-style="italic">balm</text>
    </svg>`,

    // ── VAPORES / INHALACIÓN — bowl con vapor + toalla ──
    vapores: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 90 Q40 80 100 80 Q160 80 160 90 L150 115 Q145 122 100 122 Q55 122 50 115 Z" stroke-width="2"/>
        <ellipse cx="100" cy="82" rx="60" ry="5" fill="currentColor" opacity="0.2"/>
        <path d="M70 75 Q66 60 75 55 Q68 48 78 40 Q72 32 82 26" opacity="0.7"/>
        <path d="M90 72 Q86 58 95 52 Q88 44 98 36 Q92 28 102 22" opacity="0.8"/>
        <path d="M110 75 Q106 60 115 55 Q108 48 118 40 Q112 32 122 26" opacity="0.7"/>
        <path d="M130 75 Q126 62 135 57 Q128 50 138 44" opacity="0.5"/>
        <path d="M30 110 Q40 100 60 100" opacity="0.5"/>
        <path d="M170 110 Q160 100 140 100" opacity="0.5"/>
    </svg>`,

    // ── GÁRGARAS / ENJUAGUE — vaso con líquido y gota ──
    gargaras: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M70 40 L130 40 L122 118 Q121 122 117 122 L83 122 Q79 122 78 118 Z" stroke-width="2"/>
        <line x1="68" y1="40" x2="132" y2="40" stroke-width="2"/>
        <path d="M75 65 Q100 60 125 65 L120 118 Q119 120 116 120 L84 120 Q81 120 80 118 Z" fill="currentColor" opacity="0.2"/>
        <path d="M75 65 Q100 60 125 65" opacity="0.7"/>
        <path d="M85 80 Q92 78 100 80 Q108 82 115 80" opacity="0.5"/>
        <path d="M85 95 Q92 93 100 95 Q108 97 115 95" opacity="0.45"/>
        <path d="M100 12 Q92 22 92 28 Q92 35 100 35 Q108 35 108 28 Q108 22 100 12 Z" fill="currentColor" opacity="0.4" stroke-width="1.4"/>
        <circle cx="155" cy="60" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="45" cy="80" r="1.8" fill="currentColor" opacity="0.5"/>
    </svg>`,

    // ── ACEITE / MACERADO — botella aceitera ──
    aceite: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M88 18 L112 18 L112 35 Q120 42 120 55 L120 110 Q120 122 108 122 L92 122 Q80 122 80 110 L80 55 Q80 42 88 35 Z" stroke-width="2"/>
        <line x1="80" y1="55" x2="120" y2="55" opacity="0.7"/>
        <path d="M85 75 Q100 70 115 75 L115 108 Q115 117 107 117 L93 117 Q85 117 85 108 Z" fill="currentColor" opacity="0.25"/>
        <path d="M85 75 Q100 70 115 75" opacity="0.7"/>
        <path d="M88 14 L112 14" stroke-width="2"/>
        <circle cx="95" cy="90" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="105" cy="98" r="1.5" fill="currentColor" opacity="0.5"/>
        <path d="M40 95 Q45 92 50 95 Q48 100 44 100 Q40 100 40 95 Z" fill="currentColor" opacity="0.3"/>
        <ellipse cx="155" cy="50" rx="10" ry="3" stroke-width="1.4" opacity="0.7"/>
        <path d="M150 50 Q150 65 155 70 Q160 65 160 50" opacity="0.7"/>
        <path d="M152 30 Q155 25 158 30" opacity="0.6"/>
        <path d="M153 38 Q156 35 159 38" opacity="0.6"/>
    </svg>`,

    // ── BEBIDA / AGUA — vaso con rebanada ──
    bebida: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M65 35 L135 35 L128 118 Q127 122 123 122 L77 122 Q73 122 72 118 Z" stroke-width="2"/>
        <ellipse cx="100" cy="35" rx="35" ry="6" stroke-width="2"/>
        <path d="M75 55 Q100 50 125 55 L120 118 Q119 120 116 120 L84 120 Q81 120 80 118 Z" fill="currentColor" opacity="0.22"/>
        <ellipse cx="100" cy="55" rx="25" ry="5" fill="currentColor" opacity="0.3"/>
        <path d="M75 55 Q100 50 125 55" opacity="0.7"/>
        <circle cx="100" cy="35" r="14" stroke-width="1.4" opacity="0.7"/>
        <line x1="100" y1="22" x2="100" y2="48" opacity="0.5"/>
        <line x1="86" y1="35" x2="114" y2="35" opacity="0.5"/>
        <line x1="120" y1="20" x2="125" y2="50" stroke-width="1.6"/>
        <circle cx="92" cy="80" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="105" cy="92" r="1.5" fill="currentColor" opacity="0.6"/>
    </svg>`,

    // ── COMPRESA — paño doblado ──
    compresa: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 50 L160 35 L165 95 L45 110 Z" stroke-width="2"/>
        <path d="M40 65 L160 50" opacity="0.6"/>
        <path d="M42 80 L162 65" opacity="0.6"/>
        <path d="M44 95 L163 80" opacity="0.6"/>
        <path d="M40 50 L42 70 L160 55 L160 35" stroke-width="1.4" opacity="0.7"/>
        <circle cx="65" cy="68" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="120" cy="60" r="2" fill="currentColor" opacity="0.5"/>
        <path d="M85 30 Q90 22 100 25 M100 25 Q105 18 113 23" opacity="0.6"/>
    </svg>`,

    // ── FLOR / COSMÉTICO — pétalos abstractos ──
    flor: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="100" cy="70" r="10" stroke-width="2"/>
        <ellipse cx="100" cy="40" rx="11" ry="22" stroke-width="1.6" opacity="0.85"/>
        <ellipse cx="100" cy="100" rx="11" ry="22" stroke-width="1.6" opacity="0.85"/>
        <ellipse cx="70" cy="70" rx="22" ry="11" stroke-width="1.6" opacity="0.85"/>
        <ellipse cx="130" cy="70" rx="22" ry="11" stroke-width="1.6" opacity="0.85"/>
        <ellipse cx="79" cy="49" rx="20" ry="10" stroke-width="1.4" opacity="0.7" transform="rotate(-45 79 49)"/>
        <ellipse cx="121" cy="49" rx="20" ry="10" stroke-width="1.4" opacity="0.7" transform="rotate(45 121 49)"/>
        <ellipse cx="79" cy="91" rx="20" ry="10" stroke-width="1.4" opacity="0.7" transform="rotate(45 79 91)"/>
        <ellipse cx="121" cy="91" rx="20" ry="10" stroke-width="1.4" opacity="0.7" transform="rotate(-45 121 91)"/>
        <circle cx="100" cy="70" r="5" fill="currentColor" opacity="0.4"/>
        <circle cx="100" cy="70" r="2" fill="currentColor"/>
    </svg>`,

    // ── RITUAL / ESPIRITUAL — círculo lunar con humo ──
    ritual: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="100" cy="70" r="32" stroke-width="2" opacity="0.9"/>
        <path d="M115 50 Q105 55 105 70 Q105 85 118 92 Q103 95 92 88 Q80 80 80 65 Q80 48 100 42 Q108 44 115 50 Z" fill="currentColor" opacity="0.25"/>
        <circle cx="100" cy="70" r="46" stroke-width="1" opacity="0.4"/>
        <circle cx="100" cy="70" r="56" stroke-width="0.8" opacity="0.25"/>
        <path d="M55 30 L58 35 M52 32 L52 38 M62 28 L57 32" opacity="0.6"/>
        <path d="M148 42 L152 47 M145 44 L145 50" opacity="0.6"/>
        <path d="M148 105 L150 110" opacity="0.6"/>
        <circle cx="50" cy="100" r="1.5" fill="currentColor" opacity="0.7"/>
        <circle cx="155" cy="95" r="1.5" fill="currentColor" opacity="0.7"/>
        <circle cx="155" cy="115" r="1" fill="currentColor" opacity="0.6"/>
        <circle cx="40" cy="60" r="1" fill="currentColor" opacity="0.6"/>
        <path d="M30 120 Q35 110 30 100 Q35 92 28 85" opacity="0.5"/>
        <path d="M170 120 Q165 110 170 100 Q165 92 172 85" opacity="0.5"/>
    </svg>`,

    // ── HOJA / GENÉRICO — par de hojas ──
    hoja: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M100 120 Q100 90 80 70 Q60 50 65 25 Q90 25 105 50 Q115 75 100 120 Z" stroke-width="2"/>
        <path d="M100 118 Q88 95 75 75 Q67 60 70 40" opacity="0.6"/>
        <path d="M100 120 Q100 95 120 78 Q140 62 138 40 Q115 40 105 60 Q97 85 100 120 Z" stroke-width="2" opacity="0.85"/>
        <path d="M100 118 Q110 95 122 78 Q132 65 130 50" opacity="0.6"/>
        <path d="M85 60 L93 65 M75 50 L85 56" opacity="0.5"/>
        <path d="M115 60 L107 65 M125 50 L115 56" opacity="0.5"/>
    </svg>`,

    // ── POLVO — frasquito con polvo ──
    polvo: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M75 30 L125 30 L125 45 L130 50 L130 115 Q130 122 123 122 L77 122 Q70 122 70 115 L70 50 L75 45 Z" stroke-width="2"/>
        <line x1="70" y1="50" x2="130" y2="50" opacity="0.7"/>
        <path d="M75 75 Q100 70 125 75 L125 115 Q125 118 122 118 L78 118 Q75 118 75 115 Z" fill="currentColor" opacity="0.3"/>
        <circle cx="85" cy="38" r="1" fill="currentColor"/>
        <circle cx="100" cy="38" r="1" fill="currentColor"/>
        <circle cx="115" cy="38" r="1" fill="currentColor"/>
        <circle cx="92" cy="42" r="1" fill="currentColor"/>
        <circle cx="108" cy="42" r="1" fill="currentColor"/>
        <circle cx="155" cy="40" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="160" cy="55" r="1.2" fill="currentColor" opacity="0.5"/>
        <circle cx="50" cy="60" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="42" cy="75" r="1.2" fill="currentColor" opacity="0.5"/>
    </svg>`,

    // ── GOTAS — para oídos ──
    gotas: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="80" cy="35" rx="18" ry="6" stroke-width="1.6"/>
        <path d="M62 35 L62 75 Q62 92 80 92 Q98 92 98 75 L98 35" stroke-width="2"/>
        <path d="M70 60 Q80 55 90 60 L88 88 Q86 90 80 90 Q74 90 72 88 Z" fill="currentColor" opacity="0.3"/>
        <line x1="80" y1="92" x2="80" y2="105" stroke-width="1.6"/>
        <path d="M75 105 Q72 112 80 122 Q88 112 85 105 Z" fill="currentColor" opacity="0.5" stroke-width="1.4"/>
        <path d="M130 50 Q135 60 132 75 Q145 75 152 65 Q160 55 155 45 Q150 38 142 40 Q137 42 130 50 Z" stroke-width="1.6" opacity="0.85"/>
        <path d="M138 55 Q140 65 138 72" opacity="0.5"/>
        <circle cx="170" cy="100" r="3" fill="currentColor" opacity="0.4" stroke="none"/>
        <circle cx="160" cy="115" r="2" fill="currentColor" opacity="0.4" stroke="none"/>
    </svg>`,

    // ── DIENTE — dental ──
    diente: `<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M75 30 Q100 20 125 30 Q135 40 132 60 Q128 85 122 105 Q118 118 110 118 Q103 118 100 95 Q97 118 90 118 Q82 118 78 105 Q72 85 68 60 Q65 40 75 30 Z" stroke-width="2"/>
        <path d="M85 45 Q100 40 115 45" opacity="0.5"/>
        <path d="M88 60 Q100 56 112 60" opacity="0.4"/>
        <circle cx="160" cy="50" r="2" fill="currentColor" opacity="0.4"/>
        <circle cx="40" cy="60" r="2" fill="currentColor" opacity="0.4"/>
        <path d="M30 100 Q35 95 40 100" opacity="0.5"/>
        <path d="M160 100 Q165 95 170 100" opacity="0.5"/>
    </svg>`
};

// ── Mapeo: receta → tipo de ilustración ──
function ilustracionDeReceta(r) {
    const t = ((r.titulo || '') + ' ' + (r.preparacion || '')).toLowerCase();
    const cat = (r.categoria || '').toLowerCase();

    // Por palabras en título/preparación (más específico primero)
    if (/jarabe|miel medicinal|macahue/.test(t)) return ILLUSTRATIONS.jarabe;
    if (/cataplasma|machacar|pasta/.test(t)) return ILLUSTRATIONS.cataplasma;
    if (/baño de asiento/.test(t)) return ILLUSTRATIONS.bano;
    if (/baño|bañ/.test(t)) return ILLUSTRATIONS.bano;
    if (/tintura|maceración|macerar.*alcohol|gotas diluidas/.test(t)) return ILLUSTRATIONS.tintura;
    if (/ungüento|pomada|cera|crema/.test(t)) return ILLUSTRATIONS.unguento;
    if (/vapor|vaho|inhalar|inhalación/.test(t)) return ILLUSTRATIONS.vapores;
    if (/gárgara|gargara|enjuague bucal/.test(t)) return ILLUSTRATIONS.gargaras;
    if (/aceite|maceración.*aceite|macerar.*aceite/.test(t)) return ILLUSTRATIONS.aceite;
    if (/compresa|paño|cubrir con/.test(t)) return ILLUSTRATIONS.compresa;
    if (/gotas? en el oído|gotas? al oído|aplicar.*oído/.test(t)) return ILLUSTRATIONS.gotas;
    if (/polvo|espolvorear|triturar.*polvo/.test(t)) return ILLUSTRATIONS.polvo;
    if (/decocción|cocimiento|hervir.*minutos|cocinar.*fuego/.test(t)) return ILLUSTRATIONS.decoccion;
    if (/infusión|infusion|té|reposar/.test(t)) return ILLUSTRATIONS.infusion;
    if (/loción|loción|enjuague|lavar.*cabello|frotar/.test(t)) return ILLUSTRATIONS.aceite;
    if (/agua de|tomar.*ayunas|disolver/.test(t)) return ILLUSTRATIONS.bebida;

    // Por categoría
    if (cat === 'baño') return ILLUSTRATIONS.bano;
    if (cat === 'tos' || cat === 'expectorante') return ILLUSTRATIONS.jarabe;
    if (cat === 'cicatrizante') return ILLUSTRATIONS.cataplasma;
    if (cat === 'oídos') return ILLUSTRATIONS.gotas;
    if (cat === 'dental') return ILLUSTRATIONS.diente;
    if (cat === 'oftalmológico') return ILLUSTRATIONS.compresa;
    if (cat === 'cosmético' || cat === 'cabello') return ILLUSTRATIONS.flor;
    if (cat === 'espiritual') return ILLUSTRATIONS.ritual;
    if (cat === 'antifúngico') return ILLUSTRATIONS.polvo;
    if (cat === 'dermatológico') return ILLUSTRATIONS.unguento;
    if (cat === 'reumatismo' || cat === 'antiinflamatorio') return ILLUSTRATIONS.compresa;
    if (cat === 'respiratorio') return ILLUSTRATIONS.vapores;
    if (cat === 'garganta') return ILLUSTRATIONS.gargaras;

    // Default: hoja genérica
    return ILLUSTRATIONS.hoja;
}

window.ILLUSTRATIONS = ILLUSTRATIONS;
window.ilustracionDeReceta = ilustracionDeReceta;
