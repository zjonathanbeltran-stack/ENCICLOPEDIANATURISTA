/* ════════════════════════════════════════════════════════════════════
   ENCICLOPEDIA NATURISTA — script.js
   ════════════════════════════════════════════════════════════════════ */

// ── Estado ──
let plantasDB = [];
let recetasDB = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

// ── Módulos de recetas (carga lazy) ──
const MODULO_MAP = {
    mapuche:        { file: 'data/modulos/mapuche.json',        cats: ['Medicina Mapuche','Espiritual'] },
    digestivo:      { file: 'data/modulos/digestivo.json',      cats: ['Digestivo','Hepático','Diarrea','Antiparasitario','Nutritivo','Alimenticio'] },
    respiratorio:   { file: 'data/modulos/respiratorio.json',   cats: ['Respiratorio','Tos','Expectorante','Resfriados','Garganta','Febrífugo'] },
    nervioso:       { file: 'data/modulos/nervioso.json',       cats: ['Nervioso','Sedante','Memoria'] },
    piel:           { file: 'data/modulos/piel.json',           cats: ['Dermatológico','Cicatrizante','Cosmético','Cabello','Baño','Antifúngico'] },
    mujer:          { file: 'data/modulos/mujer.json',          cats: ['Ginecológico'] },
    cardiovascular: { file: 'data/modulos/cardiovascular.json', cats: ['Cardiovascular','Renal','Diurético'] },
    dolores:        { file: 'data/modulos/dolores.json',        cats: ['Analgésico','Antiinflamatorio','Reumatismo','Dental'] },
    pediatrico:     { file: 'data/modulos/pediatrico.json',     cats: ['Pediátrico'] },
    general:        { file: 'data/modulos/general.json',        cats: ['Energizante','General','Alergia','Oftalmológico','Oídos'] },
};
const SISTEMA_A_MODULO = {
    digestivo: 'digestivo', respiratorio: 'respiratorio', nervioso: 'nervioso',
    musculo: 'dolores', piel: 'piel', mujer: 'mujer',
    pediatrico: 'pediatrico', inmuno: 'general', cardiovascular: 'cardiovascular',
    renal: 'cardiovascular', energetico: 'general', mapuche: 'mapuche',
};
const modulosCache = {};  // { moduloId: [...recetas] }
let _moduloActivo = null; // módulo seleccionado en recetario (null = catálogo completo)

// ── Lazy loading de recetas ──
let _recetasCargadas  = false;
let _recetasCargando  = null; // Promise en vuelo

function _mostrarSkeletonRecetas() {
    const grid = document.getElementById('recetaCategorias');
    if (!grid || grid.dataset.skeleton) return;
    grid.dataset.skeleton = '1';
    grid.classList.add('skeleton-grid');
    grid.innerHTML = Array.from({ length: 8 }, () => `
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-line w-85"></div>
                <div class="skeleton-line w-50"></div>
            </div>
        </div>`).join('');
}

async function cargarModulo(moduloId) {
    if (modulosCache[moduloId]) return modulosCache[moduloId];
    const res = await fetch(MODULO_MAP[moduloId].file);
    if (!res.ok) throw new Error('Error cargando modulo ' + moduloId);
    const data = await res.json();
    modulosCache[moduloId] = data;
    return data;
}

async function asegurarCatalogoCompleto() {
    if (recetasDB.length > 0) return;
    const todos = await Promise.all(Object.keys(MODULO_MAP).map(id => cargarModulo(id)));
    recetasDB = todos.flat();
    window.recetasDB = recetasDB;
}

async function cargarRecetas() {
    if (_recetasCargadas) return true;
    if (_recetasCargando) return _recetasCargando;
    _mostrarSkeletonRecetas();
    _recetasCargando = (async () => {
        try {
            await asegurarCatalogoCompleto();
            _recetasCargadas = true;
            try { if (typeof renderHomeHero === 'function') renderHomeHero(); } catch(e){}
            const grid = document.getElementById('recetaCategorias');
            if (grid) { grid.classList.remove('skeleton-grid'); delete grid.dataset.skeleton; }
            renderCategoriasChips();
            actualizarChipCounts();
            return true;
        } catch (e) {
            console.error(e);
            _recetasCargando = null;
            return false;
        }
    })();
    return _recetasCargando;
}
let filtroChiloe = false;
let mostrandoFavoritos = false;
let busqueda = '';

const MESES = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// ════════════════════════════════════════════════════════════════════
// MAPEO DE CATEGORÍAS A SISTEMAS DEL CUERPO
// ════════════════════════════════════════════════════════════════════
const SISTEMAS = [
    {
        id: 'respiratorio',
        nombre: 'Respiratorio',
        descripcion: 'Pulmones, garganta y vías aéreas',
        gradient: 'var(--grad-respiratorio)',
        glyph: '🫁',
        cats: ['Tos', 'Resfriados', 'Respiratorio', 'Garganta', 'Expectorante'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="M5 21c-1-3-1-7 1-10 1.5-2 4-2 5-1"/><path d="M19 21c1-3 1-7-1-10-1.5-2-4-2-5-1"/><path d="M12 10v11"/></svg>'
    },
    {
        id: 'digestivo',
        nombre: 'Digestivo',
        descripcion: 'Estómago, hígado y digestión',
        gradient: 'var(--grad-digestivo)',
        glyph: '🌾',
        cats: ['Digestivo', 'Hepático', 'Diarrea', 'Antiparasitario'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v4"/><path d="M15 3v4"/><path d="M6 7h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7Z"/><path d="M12 16v5"/></svg>'
    },
    {
        id: 'piel',
        nombre: 'Piel y Heridas',
        descripcion: 'Cicatrización, quemaduras y dermatología',
        gradient: 'var(--grad-piel)',
        glyph: '✋',
        cats: ['Cicatrizante', 'Dermatológico', 'Antifúngico'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V6a2 2 0 0 1 4 0v5"/><path d="M13 11V4a2 2 0 0 1 4 0v9"/><path d="M17 11V6a2 2 0 0 1 4 0v9a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-2"/><path d="M9 11V8a2 2 0 0 0-4 0v6"/></svg>'
    },
    {
        id: 'nervioso',
        nombre: 'Sistema Nervioso',
        descripcion: 'Estrés, sueño y bienestar mental',
        gradient: 'var(--grad-nervioso)',
        glyph: '🌙',
        cats: ['Nervioso', 'Sedante', 'Analgésico', 'Memoria'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 4 4"/><path d="M12 22a4 4 0 0 1-4-4"/><path d="M2 12a4 4 0 0 1 4-4"/><path d="M22 12a4 4 0 0 1-4 4"/></svg>'
    },
    {
        id: 'musculoesqueletico',
        nombre: 'Músculos y Huesos',
        descripcion: 'Reumatismo, golpes y articulaciones',
        gradient: 'var(--grad-musculo)',
        glyph: '💪',
        cats: ['Reumatismo', 'Antiinflamatorio'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 6.5a2.5 2.5 0 1 0-3-3"/><path d="M14 4 4 14a2 2 0 0 0 0 3l3 3a2 2 0 0 0 3 0l10-10"/><circle cx="20" cy="4" r="2"/></svg>'
    },
    {
        id: 'urinario',
        nombre: 'Renal y Urinario',
        descripcion: 'Riñones, vías urinarias y diuréticos',
        gradient: 'var(--grad-renal)',
        glyph: '💧',
        cats: ['Diurético', 'Renal'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/></svg>'
    },
    {
        id: 'sentidos',
        nombre: 'Ojos y Oídos',
        descripcion: 'Vista, audición y boca',
        gradient: 'var(--grad-mujer)',
        glyph: '👁️',
        cats: ['Oftalmológico', 'Oídos', 'Dental'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>'
    },
    {
        id: 'defensas',
        nombre: 'Defensas y Vitalidad',
        descripcion: 'Sistema inmune, fiebre y energía',
        gradient: 'var(--grad-defensas)',
        glyph: '⚡',
        cats: ['Febrífugo', 'Energizante', 'Nutritivo', 'Alergia'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
    },
    {
        id: 'cosmetico',
        nombre: 'Cosmética y Cabello',
        descripcion: 'Belleza natural y cuidado capilar',
        gradient: 'var(--grad-cosmetico)',
        glyph: '🌸',
        cats: ['Cosmético', 'Cabello'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 9V3m0 18v-6m-3-3H3m18 0h-6"/><path d="m6 6 3 3m9 9-3-3m0-6 3-3M6 18l3-3"/></svg>'
    },
    {
        id: 'espiritual',
        nombre: 'Espiritual y Ritual',
        descripcion: 'Limpieza energética y tradición',
        gradient: 'var(--grad-espiritual)',
        glyph: '✨',
        cats: ['Espiritual', 'Baño'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6"/></svg>'
    },
    {
        id: 'mujer',
        nombre: 'Salud de la Mujer',
        descripcion: 'Ginecología, ciclo menstrual y maternidad',
        gradient: 'var(--grad-mujer)',
        glyph: '🌺',
        cats: ['Ginecológico'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M12 14v7"/><path d="M9 18h6"/></svg>'
    },
    {
        id: 'cardiovascular',
        nombre: 'Corazón y Circulación',
        descripcion: 'Presión arterial, colesterol y circulación',
        gradient: 'var(--grad-circulatorio)',
        glyph: '❤️',
        cats: ['Cardiovascular'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    },
    {
        id: 'pediatrico',
        nombre: 'Salud Infantil',
        descripcion: 'Remedios seguros para niños y bebés',
        gradient: 'linear-gradient(135deg, #5d9a6e 0%, #8dca9f 60%, #c8e8d2 100%)',
        glyph: '🌿',
        cats: ['Pediátrico'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01M15 12h.01M10 16s.8 1 2 1 2-1 2-1"/><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/></svg>'
    },
    {
        id: 'alimenticio',
        nombre: 'Medicinal Alimenticio',
        descripcion: 'Alimentos y bebidas con propiedades curativas',
        gradient: 'linear-gradient(135deg, #8a7c3a 0%, #c4a84a 60%, #e8d48a 100%)',
        glyph: '🫚',
        cats: ['Alimenticio'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>'
    },
    {
        id: 'mapuche',
        nombre: 'Medicina Machi Mapuche',
        descripcion: 'Saber ancestral de los Machis — lawen, machitún y küme mogen',
        gradient: 'linear-gradient(135deg, #3d5530 0%, #5a7a40 40%, #8a6a30 70%, #c9a87a 100%)',
        glyph: '🌿',
        cats: ['Medicina Mapuche'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12C12 12 7 10 5 6c4 0 7 3 7 6z"/><path d="M12 12C12 12 17 10 19 6c-4 0-7 3-7 6z"/><path d="M12 12C12 12 10 7 12 3c2 4 0 9 0 9z"/><circle cx="12" cy="22" r="1"/></svg>'
    },
    {
        id: 'general',
        nombre: 'Bienestar General',
        descripcion: 'Salud integral y otros usos',
        gradient: 'linear-gradient(135deg, #5a6b48, #8a9b6e, #c5b896)',
        glyph: '🍃',
        cats: ['General'],
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 7-10s7 5 7 10a7 7 0 0 1-7 7z"/><path d="M11 20v-9"/></svg>'
    }
];

// ════════════════════════════════════════════════════════════════════
// PARA QUÉ SIRVE — descripción terapéutica por categoría de receta
// ════════════════════════════════════════════════════════════════════
const CATEGORIA_USO = {
    'Tos':              'Calma la tos seca o con flema, suaviza la garganta irritada y facilita la expectoración.',
    'Resfriados':       'Alivia los síntomas del resfriado común: congestión nasal, estornudos y malestar general.',
    'Respiratorio':     'Apoya la respiración, descongestiona las vías aéreas y favorece la salud pulmonar.',
    'Garganta':         'Combate la inflamación, el dolor y la irritación de garganta y amígdalas.',
    'Expectorante':     'Afloja la mucosidad del pecho y facilita la expulsión de flema acumulada.',
    'Digestivo':        'Mejora la digestión, alivia gases, acidez, inflamación intestinal y malestar estomacal.',
    'Hepático':         'Protege y desintoxica el hígado, estimula la producción de bilis y mejora la vesícula.',
    'Diarrea':          'Frena la diarrea, calma el intestino irritado y repone el equilibrio intestinal.',
    'Antiparasitario':  'Elimina parásitos intestinales y limpia el tracto digestivo de organismos indeseados.',
    'Cicatrizante':     'Acelera la curación de heridas, cortes, quemaduras y úlceras cutáneas.',
    'Dermatológico':    'Trata afecciones de la piel: eccema, dermatitis, psoriasis, picazón y erupciones.',
    'Antifúngico':      'Combate infecciones por hongos en piel, uñas y mucosas de forma natural.',
    'Nervioso':         'Calma la tensión nerviosa, alivia la ansiedad y equilibra el sistema nervioso.',
    'Sedante':          'Favorece el sueño reparador y reduce el insomnio, la agitación y el nerviosismo.',
    'Analgésico':       'Alivia dolores de cabeza, migrañas, dolores musculares y molestias generales.',
    'Memoria':          'Apoya la concentración, la memoria y la claridad mental.',
    'Reumatismo':       'Reduce el dolor e inflamación en articulaciones afectadas por reumatismo y artritis.',
    'Antiinflamatorio': 'Disminuye la inflamación en tejidos, articulaciones y órganos internos.',
    'Diurético':        'Estimula la eliminación de líquidos y toxinas a través de la orina.',
    'Renal':            'Apoya la función renal, previene cálculos y protege las vías urinarias.',
    'Oftalmológico':    'Alivia irritaciones, conjuntivitis y cansancio ocular de forma suave.',
    'Oídos':            'Calma el dolor de oídos, reduce la inflamación del conducto auditivo.',
    'Dental':           'Alivia el dolor de muelas, inflamación de encías y aftas bucales.',
    'Febrífugo':        'Reduce la fiebre de forma natural, favoreciendo la sudoración y el equilibrio térmico.',
    'Energizante':      'Combate el cansancio, aumenta la vitalidad y mejora el rendimiento físico y mental.',
    'Nutritivo':        'Aporta vitaminas, minerales y nutrientes esenciales para el organismo.',
    'Alergia':          'Reduce las reacciones alérgicas, la histamina y los síntomas de hipersensibilidad.',
    'Cosmético':        'Mejora la apariencia de la piel, aporta luminosidad, hidratación y elasticidad.',
    'Cabello':          'Fortalece el cabello, reduce la caída, combate la caspa y nutre el cuero cabelludo.',
    'Espiritual':       'Prepración ceremonial de la medicina ancestral para la purificación y el equilibrio espiritual.',
    'Baño':             'Baño medicinal para absorción transdérmica de propiedades terapéuticas.',
    'Ginecológico':     'Apoya la salud femenina: ciclo menstrual, menopausia, flujo vaginal y equilibrio hormonal.',
    'Cardiovascular':   'Regula la presión arterial, mejora la circulación y protege el corazón.',
    'Pediátrico':       'Preparación suave y segura para aliviar malestares comunes en bebés y niños pequeños.',
    'Alimenticio':      'Rico en nutrientes esenciales; complementa la alimentación y apoya la salud integral.',
    'Medicina Mapuche': 'Preparación de la medicina tradicional mapuche; uso ceremonial y terapéutico ancestral.',
    'Inmunológico':     'Fortalece las defensas del organismo y ayuda a prevenir enfermedades infecciosas.',
    'Musculoesquelético': 'Alivia dolores musculares, contracturas y molestias en huesos y articulaciones.',
    'Piel':             'Trata diversas afecciones dérmicas, suaviza y regenera los tejidos cutáneos.',
    'General':          'Uso polivalente para el bienestar integral; tónico y revitalizante general.',
};

function getParaQueSirve(r) {
    const cat = r.categoria || '';
    const titulo = r.titulo || '';
    const fuente = (r.fuente_tradicion || r.origen || '').toLowerCase();
    const evidencia = (r.evidencia || '').toLowerCase();
    const prep = r.preparacion || '';
    const partes = [];

    // 1. Propósito específico extraído del título ("para el/la X")
    const paraMatch = titulo.match(/\bpara\s+(?:el\s+|la\s+|los\s+|las\s+|un\s+|una\s+)?([A-Za-záéíóúüñÁÉÍÓÚÜÑ][^(\[,]{4,50}?)(?:\s*[(\[,]|$)/i);
    if (paraMatch) {
        const prop = paraMatch[1].trim().replace(/\s+$/, '');
        partes.push(prop.charAt(0).toUpperCase() + prop.slice(1) + '.');
    }

    // 2. Descripción de categoría (base semántica)
    const catBase = CATEGORIA_USO[cat];
    if (catBase) {
        // Evitar duplicar si el título ya lo cubre (comparación simplificada)
        const yaEnPartes = partes.some(p => p.toLowerCase().slice(0, 15) === catBase.toLowerCase().slice(0, 15));
        if (!yaEnPartes) partes.push(catBase);
    }

    // 3. Uso específico extraído del campo preparacion
    const prepPats = [
        /[Ee]s usad[ao] (?:como|para) ([^.]{8,60})\./,
        /[Ss]e usa (?:como|para) ([^.]{8,60})\./,
        /[Ss]irve (?:como|para) ([^.]{8,60})\./,
        /[Aa]yuda a ([^.]{8,60})\./,
    ];
    if (partes.length < 2) {
        for (const pat of prepPats) {
            const m = prep.match(pat);
            if (m) {
                const frase = m[0].trim();
                if (!partes.some(p => p.toLowerCase().includes(m[1].toLowerCase().slice(0, 18)))) {
                    partes.push(frase);
                }
                break;
            }
        }
    }

    // 4. Contexto de tradición si no está ya mencionado
    const hasTrad = partes.some(s => /mapuche|chiloé|chilote|williche|lafkenche/i.test(s));
    if (!hasTrad) {
        if (evidencia.includes('mapuche') || fuente.includes('mapuche') || fuente.includes('williche') || fuente.includes('lafkenche')) {
            partes.push('Saber ancestral del pueblo mapuche.');
        } else if (fuente.includes('chilote') || fuente.includes('chiloé')) {
            partes.push('Medicina tradicional de Chiloé.');
        }
    }

    return partes.filter(Boolean).join(' ') || catBase || '';
}

// ════════════════════════════════════════════════════════════════════
// DOLENCIAS — datos y funciones de búsqueda por síntoma/afección
// ════════════════════════════════════════════════════════════════════

const SISTEMAS_DOL = [
    { id: 'renal',          nombre: 'Sistema Renal',             emoji: '🫘', gradient: 'var(--grad-renal)' },
    { id: 'digestivo',      nombre: 'Sistema Digestivo',          emoji: '🫃', gradient: 'var(--grad-digestivo)' },
    { id: 'respiratorio',   nombre: 'Sistema Respiratorio',       emoji: '🫁', gradient: 'var(--grad-respiratorio)' },
    { id: 'nervioso',       nombre: 'Sistema Nervioso',           emoji: '🧠', gradient: 'var(--grad-nervioso)' },
    { id: 'cardiovascular', nombre: 'Corazón y Circulación',      emoji: '❤️', gradient: 'var(--grad-circulatorio)' },
    { id: 'mujer',          nombre: 'Salud de la Mujer',          emoji: '🌺', gradient: 'var(--grad-mujer)' },
    { id: 'piel',           nombre: 'Piel y Cicatrización',       emoji: '🩺', gradient: 'var(--grad-piel)' },
    { id: 'musculo',        nombre: 'Músculos y Articulaciones',  emoji: '🦴', gradient: 'var(--grad-musculo)' },
    { id: 'inmuno',         nombre: 'Sistema Inmunológico',       emoji: '🛡️', gradient: 'var(--grad-defensas)' },
    { id: 'metabolico',     nombre: 'Metabolismo',                emoji: '⚗️', gradient: 'var(--grad-digestivo)' },
    { id: 'pediatrico',     nombre: 'Salud Infantil',             emoji: '👶', gradient: 'linear-gradient(135deg,#5d9a6e,#8dca9f,#c8e8d2)' },
    { id: 'energetico',     nombre: 'Energía y Vitalidad',        emoji: '⚡', gradient: 'linear-gradient(135deg,#8a7c3a,#c4a84a,#e8d48a)' },
    { id: 'espiritual',     nombre: 'Medicina Ancestral',         emoji: '🌿', gradient: 'var(--grad-ritual)' },
    { id: 'mapuche',        nombre: 'Medicina Machi Mapuche',     emoji: '🪶', gradient: 'var(--grad-mapuche)' },
];

const DOLENCIAS = [
    // RENAL
    { id:'piedras-rinon',       nombre:'Piedras en los riñones',           emoji:'🫘', sistema:'renal',         keywords:['riñon','renal','litiasis','calculo','diuretico','orina','vejiga'],                    cats:['Renal'] },
    { id:'infeccion-urinaria',  nombre:'Infección urinaria',               emoji:'🔬', sistema:'renal',         keywords:['cistitis','urinaria','orina','diuretico','vejiga','antibacteriano'],                  cats:['Renal'] },
    { id:'retencion-liquidos',  nombre:'Retención de líquidos',            emoji:'💧', sistema:'renal',         keywords:['retencion','edema','diuretico','inflamacion','liquido'],                             cats:['Renal','Cardiovascular'] },
    // DIGESTIVO
    { id:'gastritis',           nombre:'Gastritis',                         emoji:'🫃', sistema:'digestivo',     keywords:['gastritis','estomago','gastrico','mucosa','acidez'],                                 cats:['Digestivo'] },
    { id:'acidez',              nombre:'Acidez / Reflujo',                  emoji:'🔥', sistema:'digestivo',     keywords:['acidez','reflujo','estomago','gastrico','ardor','antiacido'],                         cats:['Digestivo'] },
    { id:'estrenimiento',       nombre:'Estreñimiento',                     emoji:'🪨', sistema:'digestivo',     keywords:['estrenimiento','laxante','intestino','transito','digestivo'],                         cats:['Digestivo'] },
    { id:'diarrea',             nombre:'Diarrea',                           emoji:'💫', sistema:'digestivo',     keywords:['diarrea','astringente','intestino','antidiarreico','colon'],                          cats:['Digestivo'] },
    { id:'colitis',             nombre:'Colitis / Colon irritable',         emoji:'🌀', sistema:'digestivo',     keywords:['colitis','colon','intestino','inflamacion','espasmo'],                               cats:['Digestivo'] },
    { id:'nauseas',             nombre:'Náuseas y vómitos',                 emoji:'🤢', sistema:'digestivo',     keywords:['nausea','vomito','mareo','estomago','antiemetico'],                                   cats:['Digestivo','Ginecológico'] },
    { id:'gases',               nombre:'Gases y flatulencias',              emoji:'💨', sistema:'digestivo',     keywords:['gas','flatulencia','carminativo','hinchado'],                                        cats:['Digestivo'] },
    { id:'parasitos',           nombre:'Parásitos intestinales',            emoji:'🦠', sistema:'digestivo',     keywords:['parasito','lombriz','antiparasitario','antihelmint'],                                cats:['Digestivo'] },
    { id:'higado',              nombre:'Problemas del hígado / Vesícula',   emoji:'🍃', sistema:'digestivo',     keywords:['higado','hepatico','bilis','vesicula','depurativo','hepatoprotector'],                cats:['Digestivo'] },
    // RESPIRATORIO
    { id:'tos',                 nombre:'Tos',                               emoji:'😮', sistema:'respiratorio',  keywords:['tos','bronquio','expectorante','mucosidad','pulmon'],                                cats:['Respiratorio'] },
    { id:'gripe',               nombre:'Gripe y resfriado',                 emoji:'🤧', sistema:'respiratorio',  keywords:['gripe','resfrio','fiebre','catarro','viral','virus'],                                cats:['Respiratorio','Inmunológico'] },
    { id:'sinusitis',           nombre:'Sinusitis / Congestión nasal',      emoji:'👃', sistema:'respiratorio',  keywords:['sinusitis','nasal','congestion','rinitis','sinus'],                                  cats:['Respiratorio'] },
    { id:'bronquitis',          nombre:'Bronquitis',                         emoji:'🫁', sistema:'respiratorio',  keywords:['bronquitis','bronquio','expectorante','pecho','pulmon'],                             cats:['Respiratorio'] },
    { id:'asma',                nombre:'Asma',                              emoji:'💨', sistema:'respiratorio',  keywords:['asma','broncoespasmo','respiracion','bronquio'],                                    cats:['Respiratorio'] },
    { id:'garganta',            nombre:'Dolor de garganta / Faringitis',    emoji:'🔴', sistema:'respiratorio',  keywords:['garganta','faringitis','amigdala','dolor garganta'],                                cats:['Respiratorio'] },
    // NERVIOSO
    { id:'insomnio',            nombre:'Insomnio',                          emoji:'😴', sistema:'nervioso',      keywords:['insomnio','sueño','sedante','relajante','dormir'],                                   cats:['Sedante','Nervioso'] },
    { id:'ansiedad',            nombre:'Ansiedad',                          emoji:'😰', sistema:'nervioso',      keywords:['ansiedad','ansiolit','nervioso','tension','relajante'],                              cats:['Nervioso','Sedante'] },
    { id:'estres',              nombre:'Estrés',                            emoji:'🧠', sistema:'nervioso',      keywords:['estres','nervioso','adaptogeno','relajante','agotamiento'],                          cats:['Nervioso','Sedante'] },
    { id:'dolor-cabeza',        nombre:'Dolor de cabeza / Migraña',         emoji:'🤕', sistema:'nervioso',      keywords:['cefalea','migrana','cabeza','jaqueca','analgesi','dolor de cabeza'],                 cats:['Analgésico','Nervioso'] },
    { id:'memoria',             nombre:'Memoria y concentración',           emoji:'🧩', sistema:'nervioso',      keywords:['memoria','concentracion','cognitivo','mente','cerebro'],                            cats:['Memoria','Nervioso'] },
    { id:'depresion',           nombre:'Ánimo bajo / Depresión leve',       emoji:'🌧', sistema:'nervioso',      keywords:['depresion','animo','melanc','antidepresivo','tristeza'],                            cats:['Nervioso'] },
    // CARDIOVASCULAR
    { id:'presion-alta',        nombre:'Presión arterial alta',             emoji:'📈', sistema:'cardiovascular', keywords:['presion','hipertension','hipotensor','cardiovascular','arterial'],                  cats:['Cardiovascular'] },
    { id:'colesterol',          nombre:'Colesterol alto',                   emoji:'🧈', sistema:'cardiovascular', keywords:['colesterol','triglicerido','lipido','cardiovascular','arteria'],                    cats:['Cardiovascular'] },
    { id:'mala-circulacion',    nombre:'Mala circulación',                  emoji:'🌊', sistema:'cardiovascular', keywords:['circulacion','varices','sangre','venoso','extremidades'],                          cats:['Cardiovascular'] },
    { id:'varices',             nombre:'Várices',                           emoji:'🦵', sistema:'cardiovascular', keywords:['varices','vena','circulacion','venoso','piernas','venotonico'],                     cats:['Cardiovascular'] },
    { id:'anemia',              nombre:'Anemia / Falta de hierro',          emoji:'🩸', sistema:'cardiovascular', keywords:['anemia','hierro','hemoglobina','sangre','ferropenia'],                             cats:['Cardiovascular','Alimenticio'] },
    // MUJER
    { id:'dolores-menstruales', nombre:'Dolores menstruales',               emoji:'🌸', sistema:'mujer',          keywords:['menstrual','menstruacion','ciclo','dismenorrea','calambres','utero'],                cats:['Ginecológico'] },
    { id:'menopausia',          nombre:'Menopausia',                        emoji:'🌺', sistema:'mujer',          keywords:['menopausia','climaterio','sofoco','bochorno','hormonal'],                           cats:['Ginecológico'] },
    { id:'premenstrual',        nombre:'Síndrome premenstrual',             emoji:'📅', sistema:'mujer',          keywords:['premenstrual','pms','hormonal','ciclo','menstrual','irritabilidad'],                 cats:['Ginecológico'] },
    { id:'flujo-vaginal',       nombre:'Flujo vaginal / Candidiasis',       emoji:'🌼', sistema:'mujer',          keywords:['flujo','vaginal','candidiasis','hongo','leucorrea'],                               cats:['Ginecológico'] },
    { id:'lactancia',           nombre:'Lactancia / Producción de leche',   emoji:'🤱', sistema:'mujer',          keywords:['lactancia','galactogogo','leche','amamantar','pecho'],                             cats:['Ginecológico'] },
    // PIEL
    { id:'acne',                nombre:'Acné',                              emoji:'😣', sistema:'piel',           keywords:['acne','grano','sebaceo','piel grasa','antibacteriano','poro'],                      cats:['Cosmético','Piel'] },
    { id:'eccema',              nombre:'Eczema / Dermatitis',               emoji:'🔴', sistema:'piel',           keywords:['eccema','eczema','dermatitis','picazon','piel'],                                    cats:['Piel','Cosmético'] },
    { id:'heridas',             nombre:'Heridas y cortes',                  emoji:'🩹', sistema:'piel',           keywords:['herida','corte','cicatrizante','antiseptico','vulnerario'],                         cats:['Cicatrizante'] },
    { id:'quemaduras',          nombre:'Quemaduras',                        emoji:'🔥', sistema:'piel',           keywords:['quemadura','solar','cicatrizante','calor'],                                         cats:['Cicatrizante','Piel'] },
    { id:'hongos',              nombre:'Hongos / Micosis',                  emoji:'🍄', sistema:'piel',           keywords:['hongo','micosis','antifungico','candida','antimicrobiano'],                         cats:['Piel','Cosmético'] },
    { id:'psoriasis',           nombre:'Psoriasis',                         emoji:'🦋', sistema:'piel',           keywords:['psoriasis','escamas','piel','picazon'],                                             cats:['Piel'] },
    { id:'hematomas',           nombre:'Hematomas / Moretones',             emoji:'🟣', sistema:'piel',           keywords:['hematoma','moreton','golpe','contusion','arnica'],                                  cats:['Cicatrizante'] },
    // MÚSCULO / ARTICULACIONES
    { id:'artritis',            nombre:'Artritis / Artrosis',               emoji:'🦴', sistema:'musculo',        keywords:['artritis','artrosis','articular','articulacion','reumatismo'],                      cats:['Musculoesquelético','Analgésico'] },
    { id:'dolores-musculares',  nombre:'Dolores musculares',                emoji:'💪', sistema:'musculo',        keywords:['muscular','contrac','tension','musculo','analgesi'],                                 cats:['Musculoesquelético','Analgésico'] },
    { id:'reumatismo',          nombre:'Reumatismo',                        emoji:'🌡', sistema:'musculo',        keywords:['reumatismo','reuma','articular','artritis','musculo'],                               cats:['Musculoesquelético'] },
    { id:'gota',                nombre:'Gota / Ácido úrico',                emoji:'🧊', sistema:'musculo',        keywords:['gota','acido urico','urico','articular','antiinflamatorio'],                        cats:['Musculoesquelético','Renal'] },
    { id:'dolores-articulares', nombre:'Dolores articulares generales',      emoji:'🤲', sistema:'musculo',        keywords:['articulacion','dolor','articular','golpe','contusion'],                             cats:['Analgésico','Musculoesquelético'] },
    { id:'dolor-espalda',       nombre:'Dolor de espalda / Lumbar',         emoji:'🔙', sistema:'musculo',        keywords:['espalda','lumbar','lumbago','columna','contractura','cervical'],                     cats:['Analgésico','Musculoesquelético'] },
    { id:'ciatico',             nombre:'Nervio ciático',                    emoji:'⚡', sistema:'musculo',        keywords:['ciatico','ciatalgia','nervio','pierna','irradiacion','lumbar'],                      cats:['Analgésico','Nervioso'] },
    // INMUNO
    { id:'defensas-bajas',      nombre:'Defensas bajas / Inmunidad',        emoji:'🛡', sistema:'inmuno',         keywords:['defensa','inmun','inmunoestimulante','adaptogeno','preventivo','virus'],              cats:['Inmunológico'] },
    { id:'alergias',            nombre:'Alergias',                          emoji:'🌼', sistema:'inmuno',         keywords:['alergia','antihistaminico','rinitis','picazon','histamina'],                         cats:['Inmunológico','Respiratorio'] },
    { id:'fiebre',              nombre:'Fiebre',                            emoji:'🌡', sistema:'inmuno',         keywords:['fiebre','antipiretico','febrifugo','temperatura','sudorif'],                         cats:['Inmunológico','Respiratorio'] },
    // METABÓLICO
    { id:'diabetes',            nombre:'Diabetes (apoyo natural)',           emoji:'🍬', sistema:'digestivo',      keywords:['diabetes','glucosa','hipoglucemi','azucar','glucemiante'],                           cats:['Cardiovascular','Digestivo'] },
    { id:'tiroides',            nombre:'Tiroides',                          emoji:'🦋', sistema:'energetico',     keywords:['tiroides','hipotiroid','hipertiroid','metabolismo','glandula'],                      cats:['General'] },
    { id:'control-peso',        nombre:'Control de peso',                   emoji:'⚖', sistema:'energetico',     keywords:['obesidad','adelgaz','metabolismo','lipolitic','peso','grasa'],                       cats:['Digestivo','Energizante'] },
    // PEDIÁTRICO
    { id:'colicos-bebe',        nombre:'Cólicos del bebé',                  emoji:'👶', sistema:'pediatrico',     keywords:['colico','bebe','lactante','infantil','pediatrico'],                                  cats:['Pediátrico'] },
    { id:'fiebre-ninos',        nombre:'Fiebre en niños',                   emoji:'🤒', sistema:'pediatrico',     keywords:['fiebre','nino','pediatrico','infantil','antipiretico'],                              cats:['Pediátrico'] },
    { id:'tos-ninos',           nombre:'Tos en niños',                      emoji:'😮', sistema:'pediatrico',     keywords:['tos','nino','infantil','pediatrico','expectorante'],                                 cats:['Pediátrico'] },
    { id:'denticion',           nombre:'Dentición / Encías inflamadas',     emoji:'🦷', sistema:'pediatrico',     keywords:['diente','encia','denticion','infantil','pediatrico'],                               cats:['Pediátrico','Analgésico'] },
    { id:'dolor-muela',         nombre:'Dolor de muelas',                   emoji:'🦷', sistema:'musculo',         keywords:['muela','muelas','dental','diente','odontalgia','carie','analgesi'],                  cats:['Dental','Analgésico'] },
    // ENERGÉTICO
    { id:'fatiga',              nombre:'Fatiga / Cansancio crónico',        emoji:'⚡', sistema:'energetico',     keywords:['fatiga','cansancio','adaptogeno','energizante','tonico','vigor'],                    cats:['Energizante'] },
    { id:'falta-energia',       nombre:'Vitalidad / Falta de energía',      emoji:'🌟', sistema:'energetico',     keywords:['energia','vitalidad','vigor','tonico','energizante','reactivador'],                   cats:['Energizante'] },
    // ANCESTRAL / MAPUCHE
    { id:'purificacion',        nombre:'Purificación / Detox',              emoji:'🌿', sistema:'mapuche',        keywords:['purif','depurat','detox','limpieza','toxina','mapuche'],                            cats:['Medicina Mapuche','General'] },
    // MEDICINA MACHI MAPUCHE
    { id:'machitun',         nombre:'Machítún / Enfermedad espiritual', emoji:'🩶', sistema:'mapuche', keywords:['machi','mapuche','machitun','espiritual','weda','newen','kutran'],         cats:['Medicina Mapuche'] },
    { id:'puntadas-aire',    nombre:'Puntadas de aire (Weda kürf)',          emoji:'💨', sistema:'mapuche', keywords:['puntada','aire','costado','pleura','weda','intercostal','triwe'],           cats:['Medicina Mapuche','Analégsico'] },
    { id:'newen-bajo',       nombre:'Decaimiento / Newen bajo',                   emoji:'🌱', sistema:'mapuche', keywords:['decaimiento','newen','fuerza','debilidad','agotamiento','vital'],           cats:['Medicina Mapuche','Energizante'] },
    { id:'parasitos-machi',  nombre:'Parásitos intestinales (Machi)',        emoji:'🦠', sistema:'mapuche', keywords:['parasito','lombriz','paico','ascaridol','antihelmint','mapuche'],           cats:['Medicina Mapuche'] },
    { id:'heridas-machi',    nombre:'Heridas y cicatrización (Machi)',        emoji:'🩹', sistema:'mapuche', keywords:['herida','cicatriz','matico','foye','canelo','vulnerario','mapuche'],        cats:['Medicina Mapuche','Cicatrizante'] },
    { id:'reumatismo-machi', nombre:'Reumatismo y articulaciones (Machi)',        emoji:'🦴', sistema:'mapuche', keywords:['reumatismo','articulacion','bailahuen','pangue','cochayuyo','mapuche'],     cats:['Medicina Mapuche'] },
    { id:'digestivo-machi',  nombre:'Digestivo e hígado (Machi)',            emoji:'🫃', sistema:'mapuche', keywords:['digestion','higado','culen','bailahuen','paico','mapuche','hepatico'],      cats:['Medicina Mapuche'] },
    { id:'fiebre-machi',     nombre:'Fiebre (Machi)',                             emoji:'🌡', sistema:'mapuche', keywords:['fiebre','antipiretico','foye','chilco','maqui','mapuche'],                  cats:['Medicina Mapuche'] },
    { id:'kume-mogen',       nombre:'Küme Mogen — Bienestar integral', emoji:'🌿', sistema:'mapuche', keywords:['kume','mogen','bienestar','integral','mapuche','equilibrio','machi'],       cats:['Medicina Mapuche'] },
];

const SISTEMAS_BUSQUEDA = [
    { id:'digestivo',      icon:'seedling',       label:'Digestivo',     desc:'Estómago · Hígado · Intestino',     color:'#6a8a52' },
    { id:'respiratorio',   icon:'wind',           label:'Respiratorio',  desc:'Tos · Gripe · Sinusitis',           color:'#5b8aa0' },
    { id:'nervioso',       icon:'brain',          label:'Nervioso',      desc:'Insomnio · Ansiedad · Migraña',     color:'#8a6aaa' },
    { id:'musculo',        icon:'bone',           label:'Dolores',       desc:'Artritis · Muscular · Reumatismo',  color:'#a06a5b' },
    { id:'piel',           icon:'spa',            label:'Piel',          desc:'Acné · Heridas · Quemaduras',       color:'#c9a84c' },
    { id:'mujer',          icon:'venus',          label:'Mujer',         desc:'Menstrual · Menopausia · Lactancia',color:'#c9679a' },
    { id:'pediatrico',     icon:'child-reaching', label:'Pediátrico',    desc:'Respiratorio · Fiebre · Cólicos',   color:'#6aa08a' },
    { id:'inmuno',         icon:'shield-halved',  label:'Inmunidad',     desc:'Defensas · Alergias · Fiebre',      color:'#7a9ab8' },
    { id:'cardiovascular', icon:'heart-pulse',    label:'Corazón',       desc:'Presión · Colesterol · Circulación',color:'#c97b56' },
    { id:'renal',          icon:'droplet',        label:'Renal',         desc:'Riñones · Vejiga · Orina',          color:'#5a8a9a' },
    { id:'energetico',     icon:'bolt',           label:'Energía',       desc:'Fatiga · Vitalidad · Tónico',       color:'#b8a030' },
    { id:'mapuche', icon:'tree', label:'Mapuche', desc:'Medicina ancestral mapuche', color:'#5a7a4a',
      svg:`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:1.3em;height:1.3em">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.7"/>
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M7 4 A5 5 0 0 0 4 7" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/>
        <path d="M17 4 A5 5 0 0 1 20 7" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/>
        <path d="M7 20 A5 5 0 0 1 4 17" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/>
        <path d="M17 20 A5 5 0 0 0 20 17" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
      </svg>` },
];

// ── Sub-módulos por sistema — 3 niveles: sistema → sub-módulo → condición ──
// Sub-módulos con "file" cargan directo su JSON de condición (resultados precisos).
// Sub-módulos con "condiciones" muestran chips de dolencia (búsqueda por keywords).
const SUBMODULOS = {
    digestivo: {
        label: 'Digestivo',
        submods: [
            { id:'gastritis_acidez',    label:'Gastritis / Acidez',   emoji:'🔥', color:'#c97b56', count:9,  desc:'Gastritis · Acidez · Reflujo',               file:'data/modulos/digestivo/gastritis_acidez/recetas.json' },
            { id:'estrenimiento',       label:'Estreñimiento',         emoji:'🌾', color:'#8a9a52', count:6,  desc:'Tránsito · Psyllium · Ciruelas',             file:'data/modulos/digestivo/estrenimiento/recetas.json' },
            { id:'diarrea',             label:'Diarrea',               emoji:'💧', color:'#5a8aaa', count:12, desc:'Astringentes · Diarrea aguda',               file:'data/modulos/digestivo/diarrea/recetas.json' },
            { id:'colicos_gases',       label:'Cólicos / Gases',       emoji:'💨', color:'#7a6aaa', count:9,  desc:'Meteorismo · Flatulencias · Carminativos',   file:'data/modulos/digestivo/colicos_gases/recetas.json' },
            { id:'higado_vesicula',     label:'Hígado / Vesícula',     emoji:'🫒', color:'#a08a42', count:21, desc:'Hígado graso · Vesícula · Detox',            file:'data/modulos/digestivo/higado_vesicula/recetas.json' },
            { id:'parasitos',           label:'Parásitos',             emoji:'🦠', color:'#6a5a4a', count:23, desc:'Lombrices · Oxiuros · Tenias',               file:'data/modulos/digestivo/parasitos/recetas.json' },
            { id:'nauseas_indigestion', label:'Náuseas / Indigestión', emoji:'🤢', color:'#8a6a8a', count:8,  desc:'Náuseas · Vómitos · Indigestión',            file:'data/modulos/digestivo/nauseas_indigestion/recetas.json' },
            { id:'digestion_lenta',     label:'Digestión lenta',       emoji:'🌿', color:'#6a8a52', count:38, desc:'Digestión pesada · Depurativo · Probióticos', file:'data/modulos/digestivo/digestion_lenta/recetas.json' },
            { id:'nutricion',           label:'Nutrición medicinal',   emoji:'🥗', color:'#52aa7a', count:55, desc:'Alimentos funcionales · Recetas nutritivas',  file:'data/modulos/digestivo/nutricion/recetas.json' },
        ],
    },
    respiratorio: {
        label: 'Respiratorio',
        submods: [
            { id:'gripe_resfrios',         label:'Gripe / Resfríos',     emoji:'🤧', color:'#5a8aaa', count:10, desc:'Gripe · Resfriado · Catarro',                  file:'data/modulos/respiratorio/gripe_resfrios/recetas.json' },
            { id:'tos',                    label:'Tos',                   emoji:'😮‍💨', color:'#8a9a52', count:20, desc:'Tos seca · Jarabes · Irritación',               file:'data/modulos/respiratorio/tos/recetas.json' },
            { id:'bronquitis_expectorante',label:'Bronquitis / Expector.',emoji:'🫁', color:'#6a7a9a', count:15, desc:'Bronquitis · Flemas · Expectorantes',           file:'data/modulos/respiratorio/bronquitis_expectorante/recetas.json' },
            { id:'congestion_sinusitis',   label:'Congestión / Sinusitis',emoji:'👃', color:'#7a9aaa', count:9,  desc:'Congestión nasal · Sinusitis · Vapores',        file:'data/modulos/respiratorio/congestion_sinusitis/recetas.json' },
            { id:'garganta_faringitis',    label:'Garganta / Faringitis', emoji:'🗣️', color:'#aa7a6a', count:14, desc:'Faringitis · Gárgaras · Amígdalas',             file:'data/modulos/respiratorio/garganta_faringitis/recetas.json' },
            { id:'fiebre',                 label:'Fiebre',                emoji:'🌡️', color:'#c97b56', count:22, desc:'Fiebre · Antipirético · Diaforético',           file:'data/modulos/respiratorio/fiebre/recetas.json' },
            { id:'respiratorio_general',   label:'Salud Respiratoria',    emoji:'🌬️', color:'#6a8a7a', count:12, desc:'Pulmones · Defensas · Vías respiratorias',      file:'data/modulos/respiratorio/respiratorio_general/recetas.json' },
        ],
    },
    nervioso: {
        label: 'Nervioso',
        submods: [
            { id:'ansiedad_estres',       label:'Ansiedad / Estrés',     emoji:'🧘', color:'#9a7aaa', count:36, desc:'Ansiedad · Estrés · Tensión nerviosa',          file:'data/modulos/nervioso/ansiedad_estres/recetas.json' },
            { id:'insomnio',              label:'Insomnio / Sueño',      emoji:'🌙', color:'#6a7aaa', count:34, desc:'Insomnio · Sedantes naturales · Relajación',    file:'data/modulos/nervioso/insomnio/recetas.json' },
            { id:'memoria_concentracion', label:'Memoria / Concentración',emoji:'🧠', color:'#5a9aaa', count:22, desc:'Memoria · Concentración · Agilidad mental',     file:'data/modulos/nervioso/memoria_concentracion/recetas.json' },
        ],
    },
    piel: {
        label: 'Piel',
        submods: [
            { id:'heridas_cicatrices', label:'Heridas / Cicatrices', emoji:'🩹', color:'#8a9a72', count:28, desc:'Cicatrices · Quemaduras · Golpes',              file:'data/modulos/piel/heridas_cicatrices/recetas.json' },
            { id:'hongos_infecciones', label:'Hongos / Infecciones', emoji:'🦠', color:'#6a8a5a', count:10, desc:'Hongos · Candidiasis · Pie de atleta',          file:'data/modulos/piel/hongos_infecciones/recetas.json' },
            { id:'problemas_piel',     label:'Problemas de Piel',    emoji:'🌿', color:'#8a7a52', count:22, desc:'Eccema · Acné · Dermatitis · Psoriasis',        file:'data/modulos/piel/problemas_piel/recetas.json' },
            { id:'cosmetica_piel',     label:'Cosmética Natural',    emoji:'✨', color:'#aa8a72', count:65, desc:'Mascarillas · Cremas · Tónicos naturales',      file:'data/modulos/piel/cosmetica_piel/recetas.json' },
            { id:'cabello',            label:'Cuidado del Cabello',  emoji:'💇', color:'#9a7a6a', count:22, desc:'Anticaída · Brillo · Anticaspa · Nutrición',    file:'data/modulos/piel/cabello/recetas.json' },
            { id:'banos_terapeuticos', label:'Baños Terapéuticos',   emoji:'🛁', color:'#6a8a9a', count:18, desc:'Baños de hierbas · Relajación · Piel sana',     file:'data/modulos/piel/banos_terapeuticos/recetas.json' },
        ],
    },
    mujer: {
        label: 'Mujer',
        submods: [
            { id:'menstruacion_spm',   label:'Menstruación / SPM',   emoji:'🌸', color:'#c97aaa', count:20, desc:'Cólicos · SPM · Ciclo irregular',              file:'data/modulos/mujer/menstruacion_spm/recetas.json' },
            { id:'menopausia',         label:'Menopausia',            emoji:'🌺', color:'#aa6a8a', count:12, desc:'Sofocos · Equilibrio hormonal · Menopausia',   file:'data/modulos/mujer/menopausia/recetas.json' },
            { id:'postparto_lactancia',label:'Postparto / Lactancia', emoji:'🤱', color:'#8a9a72', count:9,  desc:'Lactancia · Postparto · Mastitis',             file:'data/modulos/mujer/postparto_lactancia/recetas.json' },
            { id:'salud_ginecologica', label:'Salud Ginecológica',    emoji:'🌿', color:'#7a8a6a', count:18, desc:'Higiene íntima · Candidiasis · Infecciones',   file:'data/modulos/mujer/salud_ginecologica/recetas.json' },
        ],
    },
    cardiovascular: {
        label: 'Cardiovascular',
        submods: [
            { id:'corazon_circulacion', label:'Corazón / Circulación', emoji:'❤️', color:'#c96a6a', count:62, desc:'Presión · Colesterol · Circulación · Corazón', file:'data/modulos/cardiovascular/corazon_circulacion/recetas.json' },
            { id:'rinones',             label:'Riñones',               emoji:'🫘', color:'#8a7a5a', count:22, desc:'Riñones · Cálculos · Infección urinaria',       file:'data/modulos/cardiovascular/rinones/recetas.json' },
            { id:'diuretico',           label:'Diurético',             emoji:'💧', color:'#5a8aaa', count:13, desc:'Retención de líquidos · Edema · Diurético',    file:'data/modulos/cardiovascular/diuretico/recetas.json' },
        ],
    },
    dolores: {
        label: 'Dolores',
        submods: [
            { id:'reumatismo_artritis', label:'Reumatismo / Artritis', emoji:'🦴', color:'#aa7a5a', count:39, desc:'Artritis · Gota · Reumatismo · Articulaciones', file:'data/modulos/dolores/reumatismo_artritis/recetas.json' },
            { id:'dolor_analgesia',     label:'Alivio del Dolor',      emoji:'💊', color:'#8a6a9a', count:20, desc:'Analgésicos naturales · Lumbago · Neuralgias',  file:'data/modulos/dolores/dolor_analgesia/recetas.json' },
            { id:'antiinflamatorio',    label:'Antiinflamatorio',      emoji:'🌡️', color:'#6a9a8a', count:13, desc:'Inflamación · Cúrcuma · Árnica · Aloe',         file:'data/modulos/dolores/antiinflamatorio/recetas.json' },
            { id:'salud_bucal',         label:'Salud Bucal',           emoji:'🦷', color:'#9a8a6a', count:19, desc:'Encias · Dolor de muelas · Enjuagues bucales',  file:'data/modulos/dolores/salud_bucal/recetas.json' },
        ],
    },
    pediatrico: {
        label: 'Pediátrico',
        submods: [
            { id:'colicos_digestion', label:'Cólicos / Digestión',  emoji:'🍼', color:'#8a9a52', count:10, desc:'Cólicos · Gases · Digestión del bebé',          file:'data/modulos/pediatrico/colicos_digestion/recetas.json' },
            { id:'fiebre_resfriado',  label:'Fiebre / Resfriado',   emoji:'🤒', color:'#c97b56', count:14, desc:'Fiebre · Resfriado · Tos · Bronquitis infantil', file:'data/modulos/pediatrico/fiebre_resfriado/recetas.json' },
            { id:'piel_cuidado',      label:'Piel / Bebé',          emoji:'🌼', color:'#c9a84c', count:18, desc:'Pañalitis · Eccema · Dentición · Piel bebé',    file:'data/modulos/pediatrico/piel_cuidado/recetas.json' },
            { id:'nervioso_sueno',    label:'Nerviosismo / Sueño',  emoji:'🌙', color:'#8a6aaa', count:9,  desc:'Insomnio · Nerviosismo · Hiperactividad',        file:'data/modulos/pediatrico/nervioso_sueno/recetas.json' },
        ],
    },
    general: {
        label: 'General',
        submods: [
            { id:'energizante_vitalidad', label:'Energía / Vitalidad', emoji:'⚡', color:'#c9a052', count:52, desc:'Tónicos · Superalimentos · Rendimiento',        file:'data/modulos/general/energizante_vitalidad/recetas.json' },
            { id:'alergia',               label:'Alergia',              emoji:'🤧', color:'#7a9a6a', count:18, desc:'Rinitis · Alergia estacional · Piel reactiva',  file:'data/modulos/general/alergia/recetas.json' },
            { id:'ojos_oidos',            label:'Ojos / Oídos',         emoji:'👁️', color:'#5a8aaa', count:19, desc:'Conjuntivitis · Colirios · Tapón de cera',      file:'data/modulos/general/ojos_oidos/recetas.json' },
            { id:'bienestar_general',     label:'Bienestar General',    emoji:'🌟', color:'#8a7a9a', count:30, desc:'Bienestar · Diabetes leve · Salud integral',    file:'data/modulos/general/bienestar_general/recetas.json' },
        ],
    },
    mapuche: {
        label: 'Mapuche',
        submods: [
            { id:'medicina_mapuche',  label:'Medicina Mapuche', emoji:'🌿', color:'#6a8a52', count:119, desc:'Lawen · Machi · Plantas sagradas · Tradición',  file:'data/modulos/mapuche/medicina_mapuche/recetas.json' },
            { id:'espiritual_ritual', label:'Espiritual',       emoji:'🔮', color:'#8a6a9a', count:27,  desc:'Sahumerios · Rituales · Baños de limpieza',    file:'data/modulos/mapuche/espiritual_ritual/recetas.json' },
        ],
    },
};

let _sistemaActivo = null; // sistema seleccionado actualmente en recetario

function renderSistemasBusqueda() {
    const cont = document.getElementById('recetaSistemas');
    if (!cont) return;
    cont.innerHTML = SISTEMAS_BUSQUEDA.map(s => `
        <button class="rsis-btn" data-sistema="${s.id}" style="--rsis-color:${s.color}" title="${s.desc}">
            <span class="rsis-ico">${s.svg ? s.svg : `<i class="fas fa-${s.icon}"></i>`}</span>
            <span class="rsis-label">${s.label}</span>
            <span class="rsis-desc">${s.desc}</span>
        </button>
    `).join('');
}

function renderCategoriasChips() {
    const cont = document.getElementById('recetaCategorias');
    if (!cont || !recetasDB.length) return;

    // Contar recetas por categoría y ordenar por cantidad
    const conteo = {};
    recetasDB.forEach(r => { conteo[r.categoria] = (conteo[r.categoria] || 0) + 1; });
    const cats = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

    cont.innerHTML = cats.map(([cat, n]) => {
        const grad = gradFromCat(cat);
        return `
        <button class="rcat-chip" data-cat="${cat}" style="--rcat-grad:${grad}">
            <span class="rcat-nombre">${cat}</span>
            <span class="rcat-count">${n}</span>
        </button>`;
    }).join('');

    cont.querySelectorAll('.rcat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cat = chip.dataset.cat;
            const activo = chip.classList.contains('active');
            cont.querySelectorAll('.rcat-chip').forEach(c => c.classList.remove('active'));
            if (activo) {
                limpiarRecetaSearch();
                return;
            }
            chip.classList.add('active');
            const resultado = recetasDB.filter(r => r.categoria === cat);
            // Limpiar búsqueda de texto y sistemas
            const inp = document.getElementById('recetaSearchInput');
            const clr = document.getElementById('recetaSearchClear');
            const panel = document.getElementById('recetaDolenciasPanel');
            if (inp) inp.value = '';
            if (clr) clr.hidden = true;
            if (panel) panel.hidden = true;
            document.querySelectorAll('.rsis-btn').forEach(b => b.classList.remove('active'));
            renderRecetaSearchResults(resultado, cat);
        });
    });
}

function mostrarDolenciasDeSistema(sistemaId) {
    _moduloActivo  = SISTEMA_A_MODULO[sistemaId] || null;
    _sistemaActivo = sistemaId;
    if (_moduloActivo && !modulosCache[_moduloActivo]) {
        cargarModulo(_moduloActivo); // pre-carga sin bloquear
    }
    document.querySelectorAll('.rsis-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.sistema === sistemaId));

    // Si el sistema tiene sub-módulos → mostrar nivel intermedio
    if (SUBMODULOS[sistemaId]) {
        mostrarSubmodulos(sistemaId);
        return;
    }

    // Sin sub-módulos → mostrar dolencias directamente (comportamiento anterior)
    const panel = document.getElementById('recetaDolenciasPanel');
    const chips = document.getElementById('rdolChips');
    if (!panel || !chips) return;
    const dolencias = DOLENCIAS.filter(d => d.sistema === sistemaId);
    chips.innerHTML = dolencias.map(d => `
        <button class="rdol-chip" data-q="${d.nombre}">
            ${d.emoji} ${d.nombre}
        </button>
    `).join('');
    panel.hidden = false;
}

function mostrarSubmodulos(sistemaId) {
    const subData = SUBMODULOS[sistemaId];
    if (!subData) return;
    const panel  = document.getElementById('recetaSubmodulosPanel');
    const chips  = document.getElementById('rsubChips');
    const titulo = document.getElementById('rsubTitulo');
    if (!panel || !chips) return;
    if (titulo) titulo.textContent = subData.label;
    chips.innerHTML = subData.submods.map(sub => `
        <button class="rsub-chip" data-subid="${sub.id}" data-sistema="${sistemaId}"
                style="--rsub-color:${sub.color || '#6a8a52'}">
            <span class="rsub-emoji">${sub.emoji}</span>
            <span class="rsub-label">${sub.label}</span>
            ${sub.count ? `<span class="rsub-count">${sub.count} recetas</span>` : ''}
            <span class="rsub-desc">${sub.desc}</span>
        </button>
    `).join('');
    document.getElementById('recetaDolenciasPanel').hidden = true;
    panel.hidden = false;
}

function mostrarCondicionesDeSubmodulo(sistemaId, subId) {
    const subData = SUBMODULOS[sistemaId];
    if (!subData) return;
    const sub = subData.submods.find(s => s.id === subId);
    if (!sub) return;
    const panel     = document.getElementById('recetaDolenciasPanel');
    const chips     = document.getElementById('rdolChips');
    const backLabel = document.getElementById('rdolBackLabel');
    if (!panel || !chips) return;
    if (backLabel) backLabel.textContent = sub.label;
    chips.innerHTML = sub.condiciones.map(c => `
        <button class="rdol-chip rdol-chip-cond" data-kws='${JSON.stringify(c.kws)}' data-q="${c.nombre}">
            ${c.emoji} ${c.nombre}
        </button>
    `).join('');
    document.getElementById('recetaSubmodulosPanel').hidden = true;
    panel.hidden = false;
}

// Búsqueda directa por keywords de condición (sin pasar por DOLENCIAS)
function buscarPorCondicion(kws, pool) {
    const nkws = kws.map(k => normDol(k));
    const scored = pool.map(r => {
        const titulo = normDol(r.titulo);
        const uso    = normDol((r.uso || '').slice(0, 150));
        const prep   = normDol((r.preparacion || '').slice(0, 150));
        const ing    = normDol((r.ingredientes || '').slice(0, 100));
        let score = 0;
        for (const kw of nkws) { if (titulo.includes(kw)) { score += 10; break; } }
        for (const kw of nkws) { if (uso.includes(kw))    { score += 7;  break; } }
        for (const kw of nkws) { if (prep.includes(kw) || ing.includes(kw)) { score += 4; break; } }
        return { r, score };
    });
    return scored.filter(x => x.score >= 4).sort((a, b) => b.score - a.score).map(x => x.r);
}

function normDol(txt) {
    return (txt || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/g, ' ');
}

// ── Buscador de recetas por síntoma (en pestaña Recetario) ──────────

function buscarRecetasPorSintoma(query, pool) {
    const recetas = pool || recetasDB;
    // Quitar frases de lenguaje natural comunes
    let q = normDol(query)
        .replace(/^(me duele(n)?|tengo|siento|busco( algo)?|quiero( algo)?|algo para|remedio para|para (el|la|los|las|un|una))\s+/i, '')
        .trim();
    if (q.length < 2) return [];

    // Coincidencia de palabra completa (sin substring "tos" dentro de "parasitos")
    const palabraCoincide = (haystack, needle) => {
        if (haystack === needle) return true;
        if (needle.length >= 4 && haystack.startsWith(needle)) return true;
        return haystack.split(' ').some(w => w === needle || (needle.length >= 4 && w.startsWith(needle)));
    };

    // Para búsquedas multi-palabra exigir que la mayoría coincida
    const STOPWORDS = new Set(['las','los','una','uno','del','con','que','mas','sin','por','sus','mis','hay','ese','esa','era','fue','han','has','les','nos','tus']);
    const qWords = q.split(/\s+/).filter(w => w.length >= 3 && !STOPWORDS.has(w));
    if (qWords.length === 0) qWords.push(q.split(' ')[0]);
    const threshold = qWords.length <= 1 ? 1 : Math.ceil(qWords.length * 0.65);

    const dolScore = (d) => {
        const nombre = normDol(d.nombre);
        // Coincidencia de frase completa (sin substring)
        if (nombre === q || q.includes(nombre + ' ') || q.endsWith(nombre)) return qWords.length;
        return qWords.filter(qw =>
            palabraCoincide(nombre, qw) ||
            d.keywords.some(kw => palabraCoincide(normDol(kw), qw))
        ).length;
    };

    const dolCoincidentes = DOLENCIAS.filter(d => dolScore(d) >= threshold);

    const catsDolencia = new Set(dolCoincidentes.flatMap(d => d.cats));
    const kwsDolencia = dolCoincidentes.flatMap(d => d.keywords).map(normDol);
    // "analgesi" es demasiado genérico — matchea cualquier receta analgésica aunque no trate la dolencia
    const kwsContenido = kwsDolencia.filter(kw => kw !== 'analgesi' && kw.length >= 4);

    const scored = recetas.map(r => {
        let score = 0;
        let hasContentMatch = false;

        const titulo  = normDol(r.titulo);
        const usoPrim = normDol((r.uso || '').slice(0, 90));

        // Match en título (mayor peso)
        for (const kw of kwsContenido) {
            if (titulo.includes(kw)) { score += 8; hasContentMatch = true; break; }
        }
        // Match en uso primario (solo si el título no matcheó)
        if (!hasContentMatch) {
            for (const kw of kwsContenido) {
                if (usoPrim.includes(kw)) { score += 6; hasContentMatch = true; break; }
            }
        }
        // Query directo en el título
        if (titulo.includes(q)) { score += 5; hasContentMatch = true; }

        // Categoría = bonus SOLO si ya hay match de contenido
        if (hasContentMatch && catsDolencia.has(r.categoria)) score += 3;

        return { r, score, hasContentMatch };
    });

    // Umbral 6: requiere al menos match en uso primario o título
    return scored
        .filter(x => x.hasContentMatch && x.score >= 6)
        .sort((a, b) => b.score - a.score)
        .map(x => x.r);
}

// Estado de filtros activos para resultados de recetas
let _rfBase = [];   // resultado completo sin filtros
let _rfQuery = '';  // query actual
let _rfCats  = new Set();
let _rfDifs  = new Set();

function _normDif(d) {
    return (d || '').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
}

function _normModo(modo) {
    const s = (modo || '').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
    if (/infusion|tisana|te\b|herbal/.test(s))             return 'Infusión / Té';
    if (/compresa|panos|pano|compresas/.test(s))            return 'Compresa';
    if (/bano\b|banos\b/.test(s))                           return 'Baño';
    if (/balsa|pomada|crema|unguento|linimento/.test(s))    return 'Ungüento / Bálsamo';
    if (/jarabe|almíbar|almíbar/.test(s))                   return 'Jarabe';
    if (/tintura|extracto\b/.test(s))                       return 'Tintura';
    if (/decocc|coccion/.test(s))                           return 'Decocción';
    if (/cataplasma|emplasto/.test(s))                      return 'Cataplasma';
    if (/inhala|vapor|vaporiz/.test(s))                     return 'Inhalación';
    if (/masaje/.test(s))                                   return 'Masaje';
    if (/topico|externo|aplicar|frotar/.test(s))            return 'Uso tópico';
    if (/oral|tomar|beber|ingerir|consumir/.test(s))        return 'Oral';
    return null; // sin clasificar, no mostrar en chips
}

function _rfApply() {
    return _rfBase.filter(r => {
        const catOK = _rfCats.size === 0 || _rfCats.has(_normModo(r.modo_uso));
        const difOK = _rfDifs.size === 0 || _rfDifs.has(_normDif(r.dificultad));
        return catOK && difOK;
    });
}

function _rfRenderGrid(filtradas) {
    const cont = document.getElementById('recetaSearchResults');
    if (!cont) return;
    const total = filtradas.length;
    const base  = _rfBase.length;
    const mostrar = filtradas.slice(0, 48);

    const countEl = cont.querySelector('.rsearch-count');
    if (countEl) {
        countEl.innerHTML = _rfCats.size || _rfDifs.size
            ? `<strong>${total}</strong> de ${base} recetas para <strong>"${_rfQuery}"</strong>`
            : `${base} receta${base !== 1 ? 's' : ''} para <strong>"${_rfQuery}"</strong>`;
    }

    // Actualizar estado activo de chips
    cont.querySelectorAll('.rfilter-chip[data-cat]').forEach(c =>
        c.classList.toggle('active', _rfCats.has(c.dataset.cat)));
    cont.querySelectorAll('.rfilter-chip[data-dif]').forEach(c =>
        c.classList.toggle('active', _rfDifs.has(c.dataset.dif)));

    const grid = cont.querySelector('.rsearch-grid');
    if (!grid) return;

    if (total === 0) {
        grid.innerHTML = `<div class="rsearch-filtro-vacio"><i class="fas fa-filter-circle-xmark"></i> Ninguna receta coincide con estos filtros. <button class="rsearch-filtro-reset">Quitar filtros</button></div>`;
        grid.querySelector('.rsearch-filtro-reset')?.addEventListener('click', () => {
            _rfCats.clear(); _rfDifs.clear();
            _rfRenderGrid(_rfBase);
        });
        return;
    }

    grid.innerHTML = mostrar.map(r => {
        const uso = r.uso ? r.uso.slice(0, 95) + (r.uso.length > 95 ? '…' : '') : '';
        const props = (r.propiedades || []).slice(0, 3);
        return `
        <div class="rsearch-card" data-rid="${r.id}">
            <div class="rsearch-cat" style="background:${gradFromCat(r.categoria)}">${r.categoria}</div>
            <h4 class="rsearch-titulo">${r.titulo}</h4>
            ${uso
                ? `<p class="rsearch-uso"><i class="fas fa-bullseye"></i> ${uso}</p>`
                : `<p class="rsearch-ing"><i class="fas fa-leaf"></i> ${(r.ingredientes||'').slice(0,80)}${(r.ingredientes||'').length>80?'…':''}</p>`
            }
            ${props.length ? `<div class="rsearch-props">${props.map(p=>`<span class="rsearch-prop">${p}</span>`).join('')}</div>` : ''}
            <div class="rsearch-card-footer">
                <div class="rsearch-meta-inline">
                    <span><i class="fas fa-clock"></i> ${r.tiempo_prep||'—'}</span>
                    <span><i class="fas fa-signal"></i> ${r.dificultad||'—'}</span>
                </div>
                <span class="rsearch-ver">Ver receta <i class="fas fa-arrow-right"></i></span>
            </div>
        </div>`;
    }).join('');

    const mas = cont.querySelector('.rsearch-mas');
    if (mas) mas.textContent = total > 48 ? `Mostrando 48 de ${total} recetas. Afina los filtros para ver más.` : '';

    grid.querySelectorAll('.rsearch-card').forEach(card => {
        card.addEventListener('click', () => abrirDetalleReceta(parseInt(card.dataset.rid)));
    });
}

function renderRecetaSearchResults(recetas, query) {
    const cont = document.getElementById('recetaSearchResults');
    if (!cont) return;

    if (recetas.length === 0) {
        const qn = normDol(query).replace(/^(me duele|tengo|para (el|la|los|las))\s+/i, '').trim();
        const sugeridas = DOLENCIAS.filter(d =>
            normDol(d.nombre).includes(qn) || d.keywords.some(k => normDol(k).includes(qn))
        ).slice(0, 4);
        cont.innerHTML = `
            <div class="rsearch-empty">
                <div class="rsearch-empty-ico">🌿</div>
                <p>No encontramos recetas para <strong>"${query}"</strong>.</p>
                ${sugeridas.length ? `
                <p class="rsearch-empty-hint">¿Quizás buscabas?</p>
                <div class="rsearch-empty-sugs">
                    ${sugeridas.map(d => `<button class="rdol-chip rsearch-sug-chip" data-q="${d.nombre}">${d.emoji} ${d.nombre}</button>`).join('')}
                </div>` : `<p class="rsearch-empty-hint">Intenta con otro término o elige un sistema corporal arriba.</p>`}
            </div>`;
        cont.style.display = 'block';
        cont.querySelectorAll('.rsearch-sug-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const q2 = btn.dataset.q;
                const inp = document.getElementById('recetaSearchInput');
                const clr = document.getElementById('recetaSearchClear');
                if (inp) inp.value = q2;
                if (clr) clr.hidden = false;
                renderRecetaSearchResults(buscarRecetasPorSintoma(q2), q2);
            });
        });
        return;
    }

    // Guardar estado base y resetear filtros
    _rfBase  = recetas;
    _rfQuery = query;
    _rfCats.clear();
    _rfDifs.clear();

    const total = recetas.length;

    // Calcular modos de preparación presentes (normalizados, ordenados por frecuencia)
    const catConteo = {};
    recetas.forEach(r => {
        const modo = _normModo(r.modo_uso);
        if (modo) catConteo[modo] = (catConteo[modo] || 0) + 1;
    });
    const cats = Object.entries(catConteo).sort((a, b) => b[1] - a[1]);

    // Calcular dificultades presentes
    const difLabel = { facil: 'Fácil', medio: 'Medio', avanzado: 'Avanzado' };
    const difConteo = {};
    recetas.forEach(r => {
        const k = _normDif(r.dificultad);
        if (difLabel[k]) difConteo[k] = (difConteo[k] || 0) + 1;
    });
    const difs = Object.entries(difConteo).sort((a, b) => {
        const ord = ['facil','medio','avanzado'];
        return ord.indexOf(a[0]) - ord.indexOf(b[0]);
    });

    const necesitaFiltros = total > 8;

    cont.innerHTML = `
        <div class="rsearch-header">
            <span class="rsearch-count">${total} receta${total !== 1 ? 's' : ''} para <strong>"${query}"</strong></span>
            <button class="rsearch-clear-btn" id="rsearchClearBtn">
                <i class="fas fa-times"></i> Ver todo el recetario
            </button>
        </div>
        ${necesitaFiltros ? `
        <div class="rfilter-bar">
            <div class="rfilter-group">
                <span class="rfilter-label"><i class="fas fa-mortar-pestle"></i> Preparación</span>
                <div class="rfilter-chips">
                    ${cats.map(([cat, n]) => `
                    <button class="rfilter-chip" data-cat="${cat}" style="--rfgrad:${gradFromCat(cat)}">
                        ${cat} <span class="rfilter-n">${n}</span>
                    </button>`).join('')}
                </div>
            </div>
            ${difs.length > 1 ? `
            <div class="rfilter-group">
                <span class="rfilter-label"><i class="fas fa-signal"></i> Dificultad</span>
                <div class="rfilter-chips">
                    ${difs.map(([dif, n]) => `
                    <button class="rfilter-chip rfilter-dif rfilter-dif-${dif}" data-dif="${dif}">
                        ${difLabel[dif]} <span class="rfilter-n">${n}</span>
                    </button>`).join('')}
                </div>
            </div>` : ''}
        </div>` : ''}
        <div class="rsearch-grid"></div>
        ${total > 48 ? `<p class="rsearch-mas"></p>` : ''}`;

    cont.style.display = 'block';
    document.getElementById('rsearchClearBtn')?.addEventListener('click', limpiarRecetaSearch);

    // Eventos de chips de filtro
    cont.querySelectorAll('.rfilter-chip[data-cat]').forEach(c => {
        c.addEventListener('click', () => {
            if (_rfCats.has(c.dataset.cat)) _rfCats.delete(c.dataset.cat);
            else _rfCats.add(c.dataset.cat);
            _rfRenderGrid(_rfApply());
        });
    });
    cont.querySelectorAll('.rfilter-chip[data-dif]').forEach(c => {
        c.addEventListener('click', () => {
            if (_rfDifs.has(c.dataset.dif)) _rfDifs.delete(c.dataset.dif);
            else _rfDifs.add(c.dataset.dif);
            _rfRenderGrid(_rfApply());
        });
    });

    _rfRenderGrid(recetas);
}

function limpiarRecetaSearch() {
    _moduloActivo  = null;
    _sistemaActivo = null;
    const inp = document.getElementById('recetaSearchInput');
    const clr = document.getElementById('recetaSearchClear');
    const cont = document.getElementById('recetaSearchResults');
    const panel = document.getElementById('recetaDolenciasPanel');
    const subPanel = document.getElementById('recetaSubmodulosPanel');
    if (inp) inp.value = '';
    if (clr) clr.hidden = true;
    if (cont) { cont.innerHTML = ''; cont.style.display = 'none'; }
    if (panel) panel.hidden = true;
    if (subPanel) subPanel.hidden = true;
    document.querySelectorAll('.rsis-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.rcat-chip').forEach(b => b.classList.remove('active'));
}

function recetasParaDolencia(dol) {
    const kws = dol.keywords.map(normDol);
    return recetasDB.filter(r => {
        if (dol.cats.includes(r.categoria)) return true;
        const hay = normDol([r.titulo, r.ingredientes, r.preparacion, r.dosis].join(' '));
        return kws.some(k => hay.includes(k));
    });
}

// ════════════════════════════════════════════════════════════════════
// MATERNIDAD — Embarazo & Lactancia
// ════════════════════════════════════════════════════════════════════

// Plantas especialmente útiles durante el embarazo
const EMB_DESTACADAS = [
    'Manzanilla', 'Jengibre', 'Tilo', 'Melisa', 'Diente de León',
    'Ortiga', 'Maqui', 'Murtilla', 'Lavanda', 'Llantén',
    'Anís Verde', 'Calafate', 'Hierba del clavo', 'Toronjil cuyano'
];

// Plantas galactogogas (favorecen la producción de leche)
const LAC_GALACTOGOGAS = [
    'Anís Verde', 'Ortiga', 'Melisa', 'Tilo', 'Manzanilla',
    'Maqui', 'Murtilla', 'Hierba del clavo', 'Diente de León', 'Llantén'
];

// Motivo de seguridad breve para cada planta galactogoga
const LAC_GAL_RAZON = {
    'Anís Verde': 'estimula la producción de leche',
    'Ortiga': 'rica en hierro y minerales, nutritiva para la madre',
    'Melisa': 'relaja y reduce estrés en la lactante',
    'Tilo': 'calma la ansiedad postparto, facilita el sueño',
    'Manzanilla': 'antiespasmódica, ayuda al bebé con cólicos vía leche',
    'Maqui': 'antioxidante y rico en vitamina C para la madre',
    'Murtilla': 'vitamina C natural, astringente suave',
    'Diente de León': 'estimula la producción láctea y aporta vitaminas',
    'Llantén': 'anti-inflamatorio suave, apoya la recuperación postparto',
    'Hierba del clavo': 'digestiva suave, pasa beneficios al bebé vía leche',
};

function clasificarPlantaMatern(p) {
    const prec = (p.precaucion || '').toLowerCase();
    const emb  = prec.includes('embarazo') || prec.includes('gestac') || prec.includes('trimestre') || prec.includes('teratog');
    const lac  = prec.includes('lactancia') || prec.includes('amamant') || prec.includes('leche materna');
    return {
        embarazoUnsafe:  emb || !!p.peligroso,
        lactanciaUnsafe: lac || !!p.peligroso,
    };
}

function maternPlantaCard(p, tipo) {
    const esDestacada  = tipo === 'destacada';
    const esGalactogog = tipo === 'galactogoga';
    const usoCorto = (p.usos || '').split('.')[0];
    const tagLabel = esDestacada  ? '⭐ Útil en embarazo'
                   : esGalactogog ? '🍼 Galactogoga'
                   : '';
    const tagClass = esGalactogog ? 'gal' : '';
    return `
    <div class="matern-planta-card${esDestacada ? ' destacada' : ''}${esGalactogog ? ' galactogoga' : ''}"
         data-id="${p.id}" title="Ver detalle de ${p.nombre}">
        <div class="matern-planta-nombre">${p.emoji || '🌿'} ${p.nombre}</div>
        <div class="matern-planta-sci">${p.cientifico}</div>
        <div class="matern-planta-uso">${esGalactogog && LAC_GAL_RAZON[p.nombre] ? LAC_GAL_RAZON[p.nombre] : usoCorto}</div>
        ${tagLabel ? `<div class="matern-planta-tag ${tagClass}">${tagLabel}</div>` : ''}
    </div>`;
}

let maternPrecActivaEmb = null;
let maternPrecActivaLac = null;

function renderMaternidad() {
    if (!plantasDB || !plantasDB.length) return;

    const segEm  = [], destEm = [], warnEm = [];
    const segLac = [], galLac = [], warnLac = [];

    plantasDB.forEach(p => {
        const { embarazoUnsafe, lactanciaUnsafe } = clasificarPlantaMatern(p);

        // Embarazo
        if (embarazoUnsafe) {
            warnEm.push(p);
        } else if (EMB_DESTACADAS.includes(p.nombre)) {
            destEm.push(p);
        } else {
            segEm.push(p);
        }

        // Lactancia
        if (lactanciaUnsafe) {
            warnLac.push(p);
        } else if (LAC_GALACTOGOGAS.includes(p.nombre)) {
            galLac.push(p);
        } else {
            segLac.push(p);
        }
    });

    // Actualizar stats del hero
    const statSeg  = $('#maternStatSeguras');
    const statEvit = $('#maternStatEvitar');
    if (statSeg)  statSeg.textContent  = destEm.length + segEm.length;
    if (statEvit) statEvit.textContent = warnEm.length;

    // ── EMBARAZO ──
    const gDestEm = $('#maternEmbarazoDestacadas');
    const gSegEm  = $('#maternEmbarazoSeguras');
    const gWarnEm = $('#maternEmbarazoEvitar');
    if (gDestEm) gDestEm.innerHTML = destEm.map(p => maternPlantaCard(p, 'destacada')).join('');
    if (gSegEm)  gSegEm.innerHTML  = segEm.map(p => maternPlantaCard(p, '')).join('');
    if (gWarnEm) gWarnEm.innerHTML = warnEm.map(p => `
        <button class="matern-warn-chip" data-id="${p.id}" data-tipo="emb">
            <i class="fas fa-ban"></i>
            <span>${p.nombre}</span>
        </button>`).join('');

    // ── LACTANCIA ──
    const gGalLac  = $('#maternLactanciaGal');
    const gSegLac  = $('#maternLactanciaSeguras');
    const gWarnLac = $('#maternLactanciaEvitar');
    if (gGalLac)  gGalLac.innerHTML  = galLac.map(p => maternPlantaCard(p, 'galactogoga')).join('');
    if (gSegLac)  gSegLac.innerHTML  = segLac.map(p => maternPlantaCard(p, '')).join('');
    if (gWarnLac) gWarnLac.innerHTML = warnLac.map(p => `
        <button class="matern-warn-chip" data-id="${p.id}" data-tipo="lac">
            <i class="fas fa-ban"></i>
            <span>${p.nombre}</span>
        </button>`).join('');

    // Click en planta segura → abre modal
    $$('#maternEmbarazoDestacadas .matern-planta-card, #maternEmbarazoSeguras .matern-planta-card,' +
       '#maternLactanciaGal .matern-planta-card, #maternLactanciaSeguras .matern-planta-card').forEach(card => {
        card.addEventListener('click', () => abrirDetallePlanta(parseInt(card.dataset.id)));
    });

    // Click en chip "evitar" → muestra/oculta precaución
    $$('.matern-warn-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const p   = plantasDB.find(x => x.id === parseInt(chip.dataset.id));
            const tipo = chip.dataset.tipo;
            const box  = tipo === 'emb' ? $('#maternPrecEmbarazo') : $('#maternPrecLactancia');
            if (!p || !box) return;
            $$('.matern-warn-chip').forEach(c => c.style.opacity = '1');
            if (box.dataset.activeId === String(p.id) && box.classList.contains('show')) {
                box.classList.remove('show'); box.dataset.activeId = '';
            } else {
                box.innerHTML = `<strong>⚠️ ${p.nombre}</strong> — ${p.precaucion}`;
                box.classList.add('show'); box.dataset.activeId = String(p.id);
                chip.style.opacity = '1';
            }
        });
    });

    // ── Recetas recomendadas para embarazo ──
    const nombresSegEmb = new Set([...destEm, ...segEm].map(p => p.nombre.toLowerCase()));
    const warnNombres   = new Set(warnEm.map(p => p.nombre.toLowerCase()));
    const nombresSegLac = new Set([...galLac, ...segLac].map(p => p.nombre.toLowerCase()));
    const warnNombresLac = new Set(warnLac.map(p => p.nombre.toLowerCase()));

    function recetaEsSegura(r, nombresSegUro, warnNombresSet) {
        const texto = (r.titulo + ' ' + (r.ingredientes || '')).toLowerCase();
        // Exclude if contains unsafe plants
        for (const nom of warnNombresSet) {
            if (texto.includes(nom)) return false;
        }
        // Include if uses at least one known-safe plant
        for (const nom of nombresSegUro) {
            if (texto.includes(nom)) return true;
        }
        return false;
    }

    const recetasEmb = recetasDB.filter(r => recetaEsSegura(r, nombresSegEmb, warnNombres)).slice(0, 12);
    const recetasLac = recetasDB.filter(r => recetaEsSegura(r, nombresSegLac, warnNombresLac)).slice(0, 12);

    function maternRecetaCard(r) {
        const uso = CATEGORIA_USO[r.categoria] || '';
        return `
        <button class="matern-receta-card" data-rid="${r.id}">
            <div class="matern-receta-cat">${r.categoria}</div>
            <div class="matern-receta-titulo">${r.titulo}</div>
            ${uso ? `<div class="matern-receta-uso"><i class="fas fa-bullseye"></i> ${uso}</div>` : ''}
            <div class="matern-receta-origen">${r.origen || 'Tradición chilena'}</div>
            <div class="matern-receta-arrow"><i class="fas fa-arrow-right"></i></div>
        </button>`;
    }

    const rEmbEl = $('#maternRecetasEmbarazo');
    const rLacEl = $('#maternRecetasLactancia');
    if (rEmbEl) {
        rEmbEl.innerHTML = recetasEmb.length
            ? recetasEmb.map(maternRecetaCard).join('')
            : '<p class="matern-recetas-empty">Cargando recetas…</p>';
    }
    if (rLacEl) {
        rLacEl.innerHTML = recetasLac.length
            ? recetasLac.map(maternRecetaCard).join('')
            : '<p class="matern-recetas-empty">Cargando recetas…</p>';
    }

    // Click en receta maternidad → abre modal receta
    $$('.matern-receta-card').forEach(btn => {
        btn.addEventListener('click', () => abrirDetalleReceta(parseInt(btn.dataset.rid)));
    });
}

function switchMaternSubtab(tipo) {
    $$('.matern-nav-card').forEach(b => b.classList.toggle('active', b.dataset.matern === tipo));
    $('#maternEmbarazo').classList.toggle('active', tipo === 'embarazo');
    $('#maternLactancia').classList.toggle('active', tipo === 'lactancia');
    $('#maternRecetas').classList.toggle('active', tipo === 'recetas');
    const icon = $('#maternidadTab .matern-hero-icon');
    if (icon) {
        if (tipo === 'lactancia') icon.textContent = '🍼';
        else if (tipo === 'recetas') icon.textContent = '📖';
        else icon.textContent = '🤰';
    }
}

function switchMaternSubPanel(section, panel) {
    // Botones de ese nav
    $$(`.matern-sub-nav[data-section="${section}"] .matern-sub-btn`)
        .forEach(b => b.classList.toggle('active', b.dataset.sub === panel));
    // Paneles de esa sección
    $$(`.matern-sub-panel[data-section="${section}"]`)
        .forEach(p => p.classList.toggle('active', p.dataset.panel === panel));
}

// ════════════════════════════════════════════════════════════════════
// MEDICINA ANCESTRAL
// ════════════════════════════════════════════════════════════════════

const ANCESTRAL_PUEBLOS = {
    mapuche:   { label: 'Mapuche',   emoji: '🌲', color: '#6a8a52', keys: ['mapuche'], excl: ['williche','pewenche','lafkenche','huilliche'] },
    williche:  { label: 'Williche',  emoji: '🏔️', color: '#5a7a42', keys: ['williche'] },
    pewenche:  { label: 'Pewenche',  emoji: '🌲', color: '#4a6a32', keys: ['pewenche'] },
    lafkenche: { label: 'Lafkenche', emoji: '🌊', color: '#4a7a8a', keys: ['lafkenche'] },
    huilliche: { label: 'Huilliche / Chiloé', emoji: '🏝️', color: '#5a8a7a', keys: ['huilliche','chilote'] },
    aymara:    { label: 'Aymara',    emoji: '☀️', color: '#c8922a', keys: ['aymara'] },
    atacameno: { label: 'Atacameño / Likan Antai', emoji: '🌵', color: '#c97b56', keys: ['atacameno','likan antai','atacameño'] },
    rapanui:   { label: 'Rapa Nui',  emoji: '🗿', color: '#7a5a9a', keys: ['rapa nui','rapanui'] },
    diaguita:  { label: 'Diaguita', emoji: '⛰️', color: '#9a6a3a', keys: ['diaguita'] },
    kawesqar:  { label: 'Kawésqar', emoji: '🛶', color: '#3a7a8a', keys: ['kawésqar','kawesqar'] },
    selknam:   { label: 'Selknam / Yagán', emoji: '❄️', color: '#5a7aaa', keys: ['selknam','yagán','yagan'] },
    ritual:    { label: 'Rituales y Ceremonias', emoji: '🪶', color: '#9b7ab4', keys: ['ritual','ceremonial','machitun','guillatun','machi'] }
};

const ANCESTRAL_CONTEXTO = {
    mapuche:   { titulo: 'Medicina Mapuche — Lawen', desc: 'El sistema médico mapuche se centra en el concepto de <em>lawen</em> (remedio/planta medicinal) y el rol del <em>machi</em> como especialista espiritual y herbolario. La enfermedad se comprende como ruptura del equilibrio entre el ser humano, la naturaleza y los espíritus. Las plantas sagradas como el <em>foye</em> (canelo) son pilares de toda práctica curativa.' },
    williche:  { titulo: 'Mapuche Williche — Küme Mogelen', desc: 'Los Williche del sur (entre Bío-Bío y Los Lagos) desarrollaron una farmacopea rica en plantas del bosque valdiviano húmedo: tepú, patagua, michay y arrayán. Su medicina integra baños rituales y cataplasmas con grasas animales. El concepto de <em>küme mogelen</em> (buen vivir) guía toda práctica de salud.' },
    pewenche:  { titulo: 'Mapuche Pewenche — Medicina de la Cordillera', desc: 'Los Pewenche habitan la precordillera andina desde Lonquimay hasta el Biobío alto. Su botánica medicinal gira en torno al <em>pewen</em> (araucaria) — árbol sagrado cuya resina y piñones tienen usos curativos. También utilizan hongos del bosque (changle), corteza de lenga y vapores de ñocha en su práctica médica.' },
    lafkenche:  { titulo: 'Mapuche Lafkenche — Medicina Costera', desc: 'Los Lafkenche (gente del mar) de la costa del Pacífico combinan plantas terrestres con recursos marinos: algas como cochayuyo, luche y luga tienen usos medicinales documentados. Sus preparados incluyen caldos reconstituyentes con algas, baños de mar con hierbas y vapores de laminaria para afecciones respiratorias.' },
    huilliche: { titulo: 'Huilliche / Chilote — Medicina del Archipiélago', desc: 'En la Isla Grande de Chiloé convergen tradiciones mapuche huilliche con la medicina popular chilota. Características únicas: uso de manteca de chancho o grasa de animal como vehículo para cataplasmas, murtilla como antidiarreico de referencia, y tepú en baños postparto. El concepto de <em>pichi lawen</em> designa los remedios para niños.' },
    aymara:    { titulo: 'Medicina Aymara — Yatiri y Kallawaya', desc: 'El sistema médico aymara del altiplano chileno incluye la figura del <em>yatiri</em> (adivino-curandero) y el <em>kallawaya</em> (médico itinerante). La medicina se adapta a la altura (3.000–4.500 msnm): plantas como rica-rica, muña, tola y yareta contrarrestan el mal de altura y los rigores del clima andino. La Pachamama es eje espiritual de toda práctica curativa.' },
    atacameno: { titulo: 'Medicina Likan Antai — Desierto de Atacama', desc: 'Los Atacameños o Likan Antai desarrollaron farmacopea adaptada al desierto más árido del mundo. Plantas como talhuén, añañuca y supo del desierto (Tessaria absinthioides) son endémicas de quebradas y oasis. Su medicina integra minerales del desierto (salitre, azufre) con plantas y animales del entorno desértico.' },
    rapanui:   { titulo: 'Medicina Rapa Nui — Taote y Matua Pua\'a', desc: 'La medicina ancestral de Isla de Pascua es administrada por los <em>taote</em> (médicos tradicionales), que desde 2012 atienden en el hospital de Hanga Roa. El <em>matua pua\'a</em> (Microsorum scolopendria) es la planta más utilizada durante más de 800 años — sus ramas se machacan y cuecen para tratar fracturas, dolor óseo y quemaduras. La medicina rapanui combina fitoterapia con <em>tauromi</em> (masaje) y baños de <em>rare rare</em> (lodo volcánico) del Rano Kau.' },
    diaguita:  { titulo: 'Medicina Diaguita — Meica y Maychicúa', desc: 'En el norte chico chileno (Atacama y Coquimbo), las mujeres diaguita son las guardianas del saber medicinal. La <em>Meica</em> aprende su oficio acompañando a la <em>Maychicúa</em>, autoridad tradicional de sanación. La transmisión es matrilineal e intergeneracional. Sus plantas clave son la borraja para el parto, el palqui para la purificación, la llareta para las articulaciones y el copao (cactus del semidesierto) para afecciones respiratorias.' },
    kawesqar:  { titulo: 'Medicina Kawésqar — Nómades de los Canales', desc: 'Los Kawésqar habitaron los canales australes desde el golfo de Penas hasta el estrecho de Magallanes. Su medicina, a diferencia de la mapuche, no era secreto del chamán: todo el grupo conocía las plantas y el saber circulaba oralmente. El canelo (<em>saltáxar</em>) era la planta central: masticaban su corteza como anestésico y hacían lavados con sus hojas para heridas. El calafate (<em>Berberis microphylla</em>) y el apio silvestre (<em>ámtak</em>) completaban su farmacopea patagónica.' },
    selknam:   { titulo: 'Medicina Selknam / Yagán — Tierra del Fuego', desc: 'Los Selknam (cazadores del interior fueguino) y los Yagán (nómades del Cabo de Hornos) desarrollaron medicina adaptada al clima más extremo de Chile. Su conocimiento botánico era compartido por toda la comunidad. Usaban grasa de lobo marino y guanaco como vehículo para ungüentos protectores del frío, el canelo como antiescorbútico y el michay patagónico (<em>Berberis microphylla</em>) para cicatrizar heridas del viento y la sal.' },
    ritual:    { titulo: 'Preparados Rituales y Ceremoniales', desc: 'Muchas recetas ancestrales tienen dimensión espiritual además de física. El <em>machitún</em> mapuche es la ceremonia central de sanación, el <em>nguillatún</em> implica preparados para la comunidad, y el <em>guillatún aymara</em> involucra ofrendas a la Pachamama. Estos preparados requieren conocimiento profundo del contexto cultural para su uso adecuado.' }
};

function esAncestral(r) {
    const fuente = (r.fuente_tradicion || '').toLowerCase();
    const origen = (r.origen || '').toLowerCase();
    const cat    = (r.categoria || '').toLowerCase();
    return fuente.includes('mapuche') || fuente.includes('aymara') ||
           fuente.includes('atacameno') || fuente.includes('atacameño') || fuente.includes('likan') ||
           fuente.includes('rapa nui') || fuente.includes('rapanui') ||
           fuente.includes('diaguita') || fuente.includes('kawésqar') || fuente.includes('kawesqar') ||
           fuente.includes('selknam') || fuente.includes('yagán') || fuente.includes('yagan') ||
           origen.includes('mapuche') || origen.includes('aymara') ||
           origen.includes('atacameno') || origen.includes('atacameño') || origen.includes('likan') ||
           origen.includes('rapa nui') || origen.includes('rapanui') ||
           origen.includes('diaguita') || origen.includes('kawésqar') || origen.includes('kawesqar') ||
           origen.includes('selknam') || origen.includes('yagán') || origen.includes('yagan') ||
           cat === 'medicina mapuche';
}

function puebloDeReceta(r) {
    const txt = ((r.origen || '') + ' ' + (r.fuente_tradicion || '') + ' ' + (r.titulo || '')).toLowerCase();
    if (txt.includes('ritual') || txt.includes('ceremonial') || txt.includes('machitun') || txt.includes('machitún') || txt.includes('guillatun') || txt.includes('guillatún') || txt.includes('nguillatun')) return 'ritual';
    if (txt.includes('selknam') || txt.includes('yagán') || txt.includes('yagan')) return 'selknam';
    if (txt.includes('kawésqar') || txt.includes('kawesqar')) return 'kawesqar';
    if (txt.includes('diaguita')) return 'diaguita';
    if (txt.includes('rapa nui') || txt.includes('rapanui')) return 'rapanui';
    if (txt.includes('atacameno') || txt.includes('atacameño') || txt.includes('likan')) return 'atacameno';
    if (txt.includes('aymara')) return 'aymara';
    if (txt.includes('huilliche') || txt.includes('chilote')) return 'huilliche';
    if (txt.includes('lafkenche')) return 'lafkenche';
    if (txt.includes('pewenche')) return 'pewenche';
    if (txt.includes('williche')) return 'williche';
    return 'mapuche';
}

function ancestralRecetaCard(r) {
    const pueblo = puebloDeReceta(r);
    const info   = ANCESTRAL_PUEBLOS[pueblo] || ANCESTRAL_PUEBLOS.mapuche;
    const dif    = r.dificultad || 'Fácil';
    const tiempo = r.tiempo_prep || '';
    const modo   = r.modo_uso || '';
    const uso    = r.uso || r.usos || '';
    return `
    <button class="anc-receta-card" data-rid="${r.id}" data-pueblo="${pueblo}">
        <div class="anc-receta-header">
            <span class="anc-pueblo-badge" style="--anc-color:${info.color}">${info.emoji} ${info.label}</span>
            <span class="anc-cat-badge">${r.categoria}</span>
        </div>
        <div class="anc-receta-titulo">${r.titulo}</div>
        ${uso ? `<div class="anc-receta-uso">${uso.slice(0, 90)}${uso.length > 90 ? '…' : ''}</div>` : ''}
        <div class="anc-receta-meta">
            ${tiempo ? `<span><i class="fas fa-clock"></i> ${tiempo}</span>` : ''}
            ${modo   ? `<span><i class="fas fa-mortar-pestle"></i> ${modo}</span>` : ''}
            <span class="anc-dif anc-dif-${dif.toLowerCase()}">${dif}</span>
        </div>
        <div class="anc-receta-arrow"><i class="fas fa-arrow-right"></i></div>
    </button>`;
}

let _ancPuebloActivo = 'todos';
let _ancBusqueda = '';
let _ancSistema = null;

function renderMedicinaAncestral() {
    if (!recetasDB || !recetasDB.length) return;

    const todas = recetasDB.filter(esAncestral);

    // Conteos por pueblo
    const conteos = { todos: todas.length };
    Object.keys(ANCESTRAL_PUEBLOS).forEach(p => {
        conteos[p] = todas.filter(r => puebloDeReceta(r) === p).length;
    });

    // Actualizar stats hero
    const statRec = $('#ancStatRecetas');
    if (statRec) statRec.textContent = todas.length;

    // Actualizar conteos en botones
    Object.keys(conteos).forEach(p => {
        const el = $(`#ancCount-${p}`);
        if (el) el.textContent = conteos[p];
    });

    // ── Render grid de sistemas del cuerpo ──
    const sisteGrid = $('#ancSistemasGrid');
    if (sisteGrid) {
        sisteGrid.innerHTML = SISTEMAS.map(s => `
            <button class="anc-sistema-chip${_ancSistema === s.id ? ' active' : ''}"
                    data-sid="${s.id}"
                    style="--anc-sis-grad:${s.gradient}">
                <span class="anc-sis-glyph">${s.glyph}</span>
                <span class="anc-sis-nombre">${s.nombre}</span>
            </button>`).join('');

        sisteGrid.querySelectorAll('.anc-sistema-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const sid = chip.dataset.sid;
                if (_ancSistema === sid) {
                    _ancSistema = null;
                } else {
                    _ancSistema = sid;
                }
                // Re-render chips con estado actualizado
                sisteGrid.querySelectorAll('.anc-sistema-chip').forEach(c => {
                    c.classList.toggle('active', c.dataset.sid === _ancSistema);
                });
                const resetBtn = $('#ancDolenciasReset');
                if (resetBtn) resetBtn.hidden = !_ancSistema;
                filtrarYRenderizar();
            });
        });
    }

    // Reset dolencias
    const resetDol = $('#ancDolenciasReset');
    if (resetDol) {
        resetDol.addEventListener('click', () => {
            _ancSistema = null;
            resetDol.hidden = true;
            sisteGrid && sisteGrid.querySelectorAll('.anc-sistema-chip').forEach(c => c.classList.remove('active'));
            filtrarYRenderizar();
        });
    }

    // ── Filtrar según pueblo, sistema y búsqueda ──
    function filtrarYRenderizar() {
        let lista = todas;

        if (_ancPuebloActivo !== 'todos') {
            lista = lista.filter(r => puebloDeReceta(r) === _ancPuebloActivo);
        }

        if (_ancSistema) {
            const sis = SISTEMAS.find(s => s.id === _ancSistema);
            if (sis) {
                lista = lista.filter(r => sis.cats.includes(r.categoria));
            }
        }

        if (_ancBusqueda) {
            const q = _ancBusqueda.toLowerCase();
            lista = lista.filter(r =>
                (r.titulo || '').toLowerCase().includes(q) ||
                (r.ingredientes || '').toLowerCase().includes(q) ||
                (r.uso || '').toLowerCase().includes(q) ||
                (r.origen || '').toLowerCase().includes(q) ||
                (r.categoria || '').toLowerCase().includes(q)
            );
        }

        // Contador de resultados
        const countEl = $('#ancResultCount');
        if (countEl) {
            const filtroActivo = _ancPuebloActivo !== 'todos' || _ancSistema || _ancBusqueda;
            if (filtroActivo) {
                const sis = _ancSistema ? SISTEMAS.find(s => s.id === _ancSistema) : null;
                const partes = [];
                if (_ancPuebloActivo !== 'todos') partes.push(ANCESTRAL_PUEBLOS[_ancPuebloActivo]?.label);
                if (sis) partes.push(sis.nombre);
                if (_ancBusqueda) partes.push(`"${_ancBusqueda}"`);
                countEl.innerHTML = `<i class="fas fa-filter"></i> <strong>${lista.length}</strong> receta${lista.length !== 1 ? 's' : ''} — ${partes.join(' · ')}`;
                countEl.hidden = false;
            } else {
                countEl.hidden = true;
            }
        }

        const grid = $('#ancestralGrid');
        if (!grid) return;

        if (!lista.length) {
            const sis = _ancSistema ? SISTEMAS.find(s => s.id === _ancSistema) : null;
            grid.innerHTML = `<div class="anc-empty"><i class="fas fa-leaf"></i><p>No hay recetas ancestrales${sis ? ` para <strong>${sis.nombre}</strong>` : ''}${_ancBusqueda ? ` con "<strong>${_ancBusqueda}</strong>"` : ''}.</p></div>`;
            return;
        }
        grid.innerHTML = lista.map(ancestralRecetaCard).join('');

        $$('#ancestralGrid .anc-receta-card').forEach(card => {
            card.addEventListener('click', () => abrirDetalleReceta(parseInt(card.dataset.rid)));
        });
    }

    // ── Contexto cultural ──
    function mostrarContexto(pueblo) {
        const ctx = $('#ancestralContexto');
        if (!ctx) return;
        if (pueblo === 'todos') { ctx.hidden = true; return; }
        const info = ANCESTRAL_CONTEXTO[pueblo];
        if (!info) { ctx.hidden = true; return; }
        const pInfo = ANCESTRAL_PUEBLOS[pueblo] || {};
        ctx.innerHTML = `
            <div class="anc-ctx-header" style="--anc-color:${pInfo.color || '#6a8a52'}">
                <span class="anc-ctx-emoji">${pInfo.emoji || '🌿'}</span>
                <strong>${info.titulo}</strong>
            </div>
            <p>${info.desc}</p>`;
        ctx.hidden = false;
    }

    // ── Eventos filtros pueblo ──
    $$('.anc-pueblo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.anc-pueblo-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            _ancPuebloActivo = btn.dataset.pueblo;
            mostrarContexto(_ancPuebloActivo);
            filtrarYRenderizar();
        });
    });

    // ── Buscador ──
    const searchInput = $('#ancestralSearchInput');
    const searchClear = $('#ancestralSearchClear');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            _ancBusqueda = searchInput.value.trim();
            if (searchClear) searchClear.hidden = !_ancBusqueda;
            filtrarYRenderizar();
        });
    }
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            _ancBusqueda = '';
            searchClear.hidden = true;
            filtrarYRenderizar();
        });
    }

    filtrarYRenderizar();
}

// ────────────────────────────────────────────────────────────────────

// Devuelve el sistema correspondiente a una categoría
function sistemaDeCategoria(cat) {
    return SISTEMAS.find(s => s.cats.includes(cat)) || SISTEMAS.find(s => s.id === 'general');
}

// Glyph emoji por categoría
const CAT_GLYPHS = {
    'Tos': '💨', 'Resfriados': '🤧', 'Respiratorio': '🫁', 'Garganta': '🗣️', 'Expectorante': '☁️',
    'Digestivo': '🌾', 'Hepático': '🍂', 'Diarrea': '🌀', 'Antiparasitario': '🦠',
    'Cicatrizante': '🩹', 'Dermatológico': '✋', 'Antifúngico': '🍄',
    'Nervioso': '🌙', 'Sedante': '😴', 'Analgésico': '⚪',
    'Reumatismo': '🦴', 'Antiinflamatorio': '🔥',
    'Diurético': '💧', 'Renal': '💧',
    'Oftalmológico': '👁️', 'Oídos': '👂', 'Dental': '🦷',
    'Febrífugo': '🌡️', 'Energizante': '⚡', 'Nutritivo': '🌰', 'Alergia': '🌼', 'Medicina Mapuche': '🌳',
    'Cosmético': '🌸', 'Cabello': '💇', 'Baño': '🛁', 'Espiritual': '✨', 'General': '🍃'
};

// ════════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════════
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function gradFromCat(cat) {
    const sis = sistemaDeCategoria(cat);
    return sis ? sis.gradient : 'var(--grad-defensas)';
}

// Vincular receta con plantas mencionadas en sus ingredientes
function plantasEnReceta(receta) {
    const texto = ((receta.ingredientes || '') + ' ' + (receta.titulo || '') + ' ' + (receta.preparacion || '')).toLowerCase();
    const matches = [];
    const seen = new Set();
    plantasDB.forEach(p => {
        const nombre = p.nombre.toLowerCase();
        // match por nombre completo o keywords
        if ((texto.includes(nombre) || (p.cientifico && texto.includes(p.cientifico.toLowerCase().split(' ')[0]))) && !seen.has(p.id)) {
            seen.add(p.id);
            matches.push(p);
        }
    });
    return matches.slice(0, 6);
}

// ════════════════════════════════════════════════════════════════════
// REVEAL ON SCROLL
// ════════════════════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.01, rootMargin: '0px 0px 200px 0px' });

function applyReveal(scope = document) {
    // Si el elemento ya está en (o cerca de) el viewport al renderizar,
    // muéstralo de inmediato sin animación de stagger para evitar el "demora al scrollear".
    const vh = window.innerHeight;
    scope.querySelectorAll('.reveal:not(.in)').forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh + 100) {
            // visible o casi visible -> reveal sin delay (cascada corta)
            el.style.setProperty('--reveal-delay', Math.min(i, 8) * 30 + 'ms');
            requestAnimationFrame(() => el.classList.add('in'));
        } else {
            el.style.setProperty('--reveal-delay', '0ms');
            revealObserver.observe(el);
        }
    });
}

// ════════════════════════════════════════════════════════════════════
// SEARCH HERO
// ════════════════════════════════════════════════════════════════════
function renderSearchHero() {
    const container = document.getElementById('plantsSearchHero');
    if (!container) return;
    const pills = [
        { emoji: '🫁', label: 'Tos' },
        { emoji: '🧠', label: 'Insomnio' },
        { emoji: '🤢', label: 'Digestión' },
        { emoji: '🤧', label: 'Resfriado' },
        { emoji: '😣', label: 'Dolor' },
        { emoji: '💆', label: 'Ansiedad' },
    ];
    const nPlantas = plantasDB.length || 85;
    const nRecetas = (window.recetasDB || []).length || 1058;
    container.innerHTML = `
        <section class="search-hero">
            <div class="search-hero-stats">
                <div class="shs-stat">
                    <span class="shs-num" data-target="${nPlantas}">0</span>
                    <span class="shs-label">plantas</span>
                </div>
                <div class="shs-sep">·</div>
                <div class="shs-stat">
                    <span class="shs-num" data-target="${nRecetas}">0</span>
                    <span class="shs-label">recetas</span>
                </div>
                <div class="shs-sep">·</div>
                <div class="shs-stat">
                    <span class="shs-num">∞</span>
                    <span class="shs-label">saber ancestral</span>
                </div>
            </div>
            <h2 class="search-hero-title">¿Qué necesitas hoy?</h2>
            <div class="search-hero-wrap">
                <i class="fas fa-search search-hero-icon-left"></i>
                <input class="search-hero-input" type="search" id="searchHeroInput"
                    placeholder="Buscar planta o síntoma…" autocomplete="off"
                    aria-label="Buscar planta o síntoma" />
                <kbd class="search-hero-kbd">/</kbd>
            </div>
            <div class="search-hero-pills">
                ${pills.map(p => `<button class="search-pill" data-term="${p.label}">${p.emoji} ${p.label}</button>`).join('')}
            </div>
        </section>`;

    // Animated counters
    container.querySelectorAll('.shs-num[data-target]').forEach(el => {
        const target = +el.dataset.target;
        const steps = 28;
        const interval = 32; // ~30fps via setTimeout (works even in background tabs)
        let step = 0;
        const tick = () => {
            step++;
            const p = step / steps;
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target);
            if (step < steps) setTimeout(tick, interval);
        };
        setTimeout(tick, interval);
    });

    const heroInput = document.getElementById('searchHeroInput');
    const mainInput = document.getElementById('searchInput');

    heroInput?.addEventListener('input', () => {
        busqueda = heroInput.value;
        if (mainInput) mainInput.value = heroInput.value;
        actualizarBtnReset();
        renderPlantas();
        if (heroInput.value.length > 0) {
            document.getElementById('plantList')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    container.querySelectorAll('.search-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const term = pill.dataset.term;
            busqueda = term;
            if (mainInput) mainInput.value = term;
            if (heroInput) heroInput.value = term;
            actualizarBtnReset();
            renderPlantas();
            document.getElementById('plantList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ════════════════════════════════════════════════════════════════════
// PLANTAS
// ════════════════════════════════════════════════════════════════════
const plantListDiv = $('#plantList');

function renderPlantas() {
    // Remove initial skeleton state
    plantListDiv?.classList.remove('plant-list--loading');

    let lista = mostrandoFavoritos
        ? plantasDB.filter(p => favoritos.includes(p.id))
        : plantasDB;

    const mesActualFiltro = new Date().getMonth() + 1;
    let filtradas = lista.filter(p => {
        if (filtroChiloe && !p.chiloe) return false;
        if (filtroTemporada && !(p.meses && p.meses.includes(mesActualFiltro))) return false;
        if (filtroRegion && !(p.region || '').includes(filtroRegion)) return false;
        const term = busqueda.toLowerCase();
        if (term === '') return true;
        return p.nombre.toLowerCase().includes(term) ||
               p.cientifico.toLowerCase().includes(term) ||
               (p.usos || '').toLowerCase().includes(term) ||
               (p.keywords || []).some(k => k.includes(term));
    });

    if (filtradas.length === 0) {
        if (mostrandoFavoritos) {
            plantListDiv.innerHTML = `
            <div class="empty-state-v2">
                <span class="es-icon">🌿</span>
                <h3 class="es-title">Aún no tienes favoritas</h3>
                <p class="es-desc">Explora el catálogo y guarda las plantas que más usas tocando el ♥ en cada tarjeta.</p>
                <button class="es-btn" id="emptyFavBtn"><i class="fas fa-seedling"></i> Explorar plantas</button>
            </div>`;
            document.getElementById('emptyFavBtn')?.addEventListener('click', () => {
                mostrandoFavoritos = false;
                $('#filterFav').classList.remove('active');
                renderPlantas();
            });
        } else {
            plantListDiv.innerHTML = `
            <div class="empty-state-v2">
                <span class="es-icon">🔍</span>
                <h3 class="es-title">Sin resultados</h3>
                <p class="es-desc">No encontramos plantas con ese criterio. Prueba con otro término o quita los filtros.</p>
                <button class="es-btn" id="emptySearchBtn"><i class="fas fa-times-circle"></i> Limpiar filtros</button>
            </div>`;
            document.getElementById('emptySearchBtn')?.addEventListener('click', () => {
                busqueda = '';
                const heroInput = document.getElementById('searchHeroInput');
                if (heroInput) heroInput.value = '';
                $('#searchInput').value = '';
                filtroChiloe = false;
                filtroTemporada = false;
                filtroRegion = null;
                mostrandoFavoritos = false;
                $$('.chip').forEach(c => c.classList.remove('active'));
                renderPlantas();
            });
        }
        return;
    }

    const mesActual = new Date().getMonth() + 1;
    const notasGuardadas = JSON.parse(localStorage.getItem('plantNotas') || '{}');
    plantListDiv.innerHTML = getSortedPlantas(filtradas).map(p => {
        const enTemporada = p.meses && p.meses.includes(mesActual);
        const usoCorto = (p.usos || '').split('.')[0];
        const tieneNota = !!notasGuardadas[p.id];
        const placeholderContent = p.emoji
            ? `<span class="placeholder-emoji">${p.emoji}</span>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="photo-placeholder-icon"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 7-10s7 5 7 10a7 7 0 0 1-7 7z"/><path d="M11 20v-9"/></svg>`;
        const { embarazoUnsafe, lactanciaUnsafe } = clasificarPlantaMatern(p);
        const embDestacada = EMB_DESTACADAS.includes(p.nombre);
        const lacGal = LAC_GALACTOGOGAS.includes(p.nombre);
        const embBadge = embarazoUnsafe
            ? '<span class="badge matern-badge emb-warn" title="Evitar en embarazo">🤰⛔</span>'
            : embDestacada
                ? '<span class="badge matern-badge emb-ok" title="Recomendada en embarazo">🤰✅</span>'
                : '';
        const lacBadge = lactanciaUnsafe
            ? '<span class="badge matern-badge lac-warn" title="Evitar en lactancia">🍼⛔</span>'
            : lacGal
                ? '<span class="badge matern-badge lac-ok" title="Galactogoga — favorece la leche">🍼✅</span>'
                : '';
        return `
        <div class="plant-card reveal${enTemporada ? ' planta-temporada' : ''}${p.peligroso ? ' peligrosa' : ''}" data-id="${p.id}">
            <div class="plant-img-wrap">
                ${p.imagen
                    ? `<img src="${p.imagen}" alt="${p.nombre}" class="plant-img" loading="lazy" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden')">`
                    : ''}
                <div class="photo-placeholder${p.imagen ? ' hidden' : ''}">${placeholderContent}</div>
                ${tieneNota ? '<span class="card-note-dot" title="Nota guardada"><i class="fas fa-pen"></i></span>' : ''}
            </div>
            <div class="plant-name">${p.nombre}</div>
            <div class="plant-sci">${p.cientifico}</div>
            <div class="plant-uso-preview">${usoCorto}</div>
            <div class="plant-badges">
                ${p.chiloe ? '<span class="badge chiloe">📍 Chiloé</span>' : ''}
                ${p.protegida ? '<span class="badge shield">🛡️ Protegida</span>' : ''}
                ${p.peligroso ? '<span class="badge warn">⚠️ Precaución</span>' : ''}
                ${embBadge}${lacBadge}
            </div>
            <button class="fav-btn ${favoritos.includes(p.id) ? 'active' : ''}" data-id="${p.id}" title="${favoritos.includes(p.id) ? 'Quitar de favoritos' : 'Guardar planta'}">
                <i class="fas fa-bookmark"></i>
            </button>
            <div class="card-cta"><i class="fas fa-arrow-right"></i> Ver detalle</div>
        </div>
    `}).join('');

    $$('.plant-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        card.addEventListener('click', (e) => {
            if (e.target.closest('.fav-btn')) return;
            abrirDetallePlanta(id);
        });
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorito(id);
        });
    });

    applyReveal(plantListDiv);

    // Update plant count bar
    const countBar = document.getElementById('plantCountBar');
    const countTxt = document.getElementById('plantCountTxt');
    const hayFiltroActivo = filtroChiloe || mostrandoFavoritos || filtroTemporada || filtroRegion || busqueda;
    if (countBar && countTxt) {
        if (hayFiltroActivo) {
            countBar.style.display = 'flex';
            countTxt.textContent = `${filtradas.length} de ${plantasDB.length} plantas`;
        } else {
            countBar.style.display = 'none';
        }
    }

    // Update header bookmark badge
    actualizarFavBadge();
}

function actualizarFavBadge() {
    const favBtn = document.getElementById('favBtn');
    if (!favBtn) return;
    const existing = favBtn.querySelector('.fav-count-badge');
    if (favoritos.length > 0) {
        if (existing) {
            existing.textContent = favoritos.length;
        } else {
            const badge = document.createElement('span');
            badge.className = 'fav-count-badge';
            badge.textContent = favoritos.length;
            favBtn.style.position = 'relative';
            favBtn.appendChild(badge);
        }
    } else {
        existing?.remove();
    }
}

function slugify(str) {
    return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function abrirDetallePlanta(id) {
    const p = plantasDB.find(p => p.id === id);
    if (!p) return;
    history.replaceState(null, '', '#planta/' + slugify(p.nombre));
    // Registrar como vista para progreso
    marcarPlantaVista(id);

    const mesesTexto = p.meses && p.meses.length > 0
        ? p.meses.map(m => MESES[m]).join(' · ')
        : 'Todo el año / Sin datos';

    const sis = SISTEMAS.find(s => (p.usos || '').toLowerCase().match(/digest|estomag|higad/) ? s.id === 'digestivo' : false) || SISTEMAS[7];

    // Recetas que mencionan esta planta
    const nombre = p.nombre.toLowerCase();
    const recetasDeEstaPlanta = recetasDB.filter(r => {
        const t = ((r.titulo||'') + ' ' + (r.ingredientes||'') + ' ' + (r.preparacion||'')).toLowerCase();
        return t.includes(nombre);
    });

    $('#modalBody').innerHTML = `
        <div class="modal-art${p.imagen ? ' modal-art-photo' : ''}" style="${p.imagen ? '' : 'background:' + sis.gradient + ';'}">
            ${p.imagen
                ? `<img src="${p.imagen}" alt="${p.nombre}" class="modal-plant-img" onerror="this.parentElement.classList.remove('modal-art-photo'); this.parentElement.style.background='${sis.gradient}'; this.remove();">`
                : `<div class="modal-plant-placeholder">${p.emoji ? `<span style="font-size:4rem;filter:drop-shadow(0 4px 16px rgba(0,0,0,0.5));opacity:0.8">${p.emoji}</span>` : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 7-10s7 5 7 10a7 7 0 0 1-7 7z"/><path d="M11 20v-9"/></svg>`}</div>`}
        </div>
        <h2 class="modal-plant-name">${p.emoji ? `<span style="margin-right:8px">${p.emoji}</span>` : ''}${p.nombre}</h2>
        <p class="scientific">${p.cientifico}</p>

        <div class="modal-row">
            <div class="ico">🌿</div>
            <div><div class="label">Familia</div><div class="value">${p.familia}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">✂️</div>
            <div><div class="label">Parte usada</div><div class="value">${p.parte}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">🩺</div>
            <div><div class="label">Usos medicinales</div><div class="value">${p.usos}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">📍</div>
            <div><div class="label">Región</div><div class="value">${p.region}${p.chiloe ? ' · ✅ Presente en Chiloé' : ''}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">📅</div>
            <div><div class="label">Mejor época</div><div class="value">${mesesTexto}</div></div>
        </div>

        ${p.protegida ? `<div class="alert-box shield"><span class="ico">🛡️</span><div><strong>Especie protegida.</strong> No recolectar. Compra a proveedores autorizados.</div></div>` : ''}
        <div class="alert-box warn"><span class="ico">⚠️</span><div><strong>Precauciones:</strong> ${p.precaucion}</div></div>

        ${recetasDeEstaPlanta.length ? `
            <div class="modal-divider"></div>
            <button class="recipe-cta" id="verRecetasBtn">
                <span class="cta-icon">📖</span>
                <span class="cta-text">
                    <strong>Ver ${recetasDeEstaPlanta.length} receta${recetasDeEstaPlanta.length > 1 ? 's' : ''} con ${p.nombre}</strong>
                    <small>Preparaciones tradicionales</small>
                </span>
                <span class="cta-arrow">→</span>
            </button>
            <div class="related-recipes" id="relatedRecipes">
                ${recetasDeEstaPlanta.slice(0, 6).map(r => `
                    <button class="related-recipe-mini" data-id="${r.id}">
                        <span class="mini-cat">${r.categoria}</span>
                        <span class="mini-title">${r.titulo}</span>
                    </button>
                `).join('')}
            </div>
        ` : ''}

        <div class="modal-divider"></div>
        <div class="plant-notes-wrap">
            <label class="plant-notes-label"><i class="fas fa-pen-to-square"></i> Mis notas sobre ${p.nombre}</label>
            <textarea id="plantNotesArea" class="plant-notes-area" placeholder="Anota preparaciones, dosis, experiencias personales…" maxlength="600" rows="3">${leerNota(p.id)}</textarea>
            <div class="plant-notes-footer">
                <span id="plantNotesCount" class="notes-count">${leerNota(p.id).length}/600</span>
                <button id="plantNotesSave" class="notes-save-btn">Guardar</button>
            </div>
        </div>
    `;

    if (recetasDeEstaPlanta.length) {
        $('#verRecetasBtn').addEventListener('click', () => {
            cerrarModal();
            cambiarTab('recipes');
            // Usar el nuevo buscador del recetario con el nombre de la planta
            const inp = document.getElementById('recetaSearchInput');
            const clr = document.getElementById('recetaSearchClear');
            if (inp) { inp.value = p.nombre; }
            if (clr) clr.hidden = false;
            setTimeout(() => {
                const res = buscarRecetasPorSintoma(p.nombre);
                renderRecetaSearchResults(res, p.nombre);
            }, 80);
        });
        $$('#relatedRecipes .related-recipe-mini').forEach(btn => {
            btn.addEventListener('click', () => {
                const rid = parseInt(btn.dataset.id);
                cerrarModal();
                setTimeout(() => abrirDetalleReceta(rid), 250);
            });
        });
    }

    // ── Plant notes ──
    const notesArea = document.getElementById('plantNotesArea');
    const notesCount = document.getElementById('plantNotesCount');
    const notesSave = document.getElementById('plantNotesSave');
    if (notesArea && notesSave) {
        notesArea.addEventListener('input', () => {
            if (notesCount) notesCount.textContent = `${notesArea.value.length}/600`;
        });
        notesSave.addEventListener('click', () => {
            guardarNota(p.id, notesArea.value.trim());
            mostrarToast('<i class="fas fa-check"></i> Nota guardada', 'ok');
            notesSave.textContent = '✓ Guardado';
            setTimeout(() => { notesSave.textContent = 'Guardar'; }, 1800);
        });
    }

    configurarShareBtn(
        `${p.nombre} — Enciclopedia Naturista de Chile`,
        `${p.nombre} (${p.cientifico}): ${(p.usos || '').split('.')[0]}.`
    );

    abrirModal();
}

function toggleFavorito(id) {
    const p = plantasDB.find(p => p.id === id);
    const nombre = p ? p.nombre : '';
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        mostrarToast(`<i class="fas fa-bookmark"></i> ${nombre} eliminado de favoritos`, 'remove');
    } else {
        favoritos.push(id);
        mostrarToast(`<i class="fas fa-bookmark"></i> ${nombre} agregado a favoritos`, 'success');
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    renderPlantas();
    actualizarBtnFavoritos();
}

function actualizarBtnFavoritos() {
    const favBtn = $('#favBtn');
    favBtn.title = favoritos.length > 0 ? `Favoritos (${favoritos.length})` : 'Favoritos';
    actualizarFavBadge();
    actualizarBottomNavBadge();
}

function actualizarBottomNavBadge() {
    const badge = document.getElementById('bottomFavBadge');
    if (!badge) return;
    if (favoritos.length > 0) {
        badge.textContent = favoritos.length > 9 ? '9+' : favoritos.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function actualizarBtnReset() {
    const hayFiltro = filtroChiloe || mostrandoFavoritos || filtroTemporada || filtroRegion || busqueda;
    const btn = $('#resetFiltros');
    if (btn) btn.style.display = hayFiltro ? 'inline-flex' : 'none';
}

function resetearFiltros() {
    filtroChiloe = false;
    mostrandoFavoritos = false;
    filtroTemporada = false;
    filtroRegion = null;
    busqueda = '';
    $('#searchInput').value = '';
    $('#filterChiloe').classList.remove('active');
    $('#filterFav').classList.remove('active');
    $('#filterTemporada').classList.remove('active');
    $('#filterRegionBtn').classList.remove('active');
    $('#regionPanel').style.display = 'none';
    $$('.region-chip').forEach(c => c.classList.remove('active'));
    actualizarBtnReset();
    renderPlantas();
}

// ════════════════════════════════════════════════════════════════════
// RECETARIO — ACCORDION
// ════════════════════════════════════════════════════════════════════


function abrirDetalleReceta(id) {
    const r = recetasDB.find(r => r.id === id);
    if (!r) return;
    history.replaceState(null, '', '#receta/' + id);
    const linked = plantasEnReceta(r);

    const evidenciaBadge = {
        'Saber ancestral': { color: 'var(--amber)', icon: '🌿' },
        'Saber ancestral mapuche y chileno': { color: 'var(--amber)', icon: '🌿' },
        'Saber ancestral mapuche (medicina tradicional indígena)': { color: 'var(--terracotta-soft)', icon: '🌳' },
        'Uso tradicional documentado': { color: 'var(--moss-bright)', icon: '📚' },
        'Respaldo científico': { color: '#7ab8d4', icon: '🔬' },
    };
    const ev = evidenciaBadge[r.evidencia] || { color: 'var(--text-mute)', icon: '📖' };

    $('#modalBody').innerHTML = `
        <div class="modal-art" style="background: ${gradFromCat(r.categoria)};">
            <div class="illus illus-lg">${ilustracionDeReceta(r)}</div>
        </div>

        <!-- Encabezado -->
        <div class="receta-meta-top">
            <span class="receta-cat-pill">${r.categoria}</span>
            <span class="receta-origen-pill">${r.fuente_tradicion || r.origen}</span>
        </div>
        <h2 style="margin-bottom:4px">${r.titulo}</h2>

        <!-- Chips de info rápida -->
        <div class="receta-info-chips">
            ${r.tiempo_prep ? `<div class="rec-chip"><i class="fas fa-clock"></i> ${r.tiempo_prep}</div>` : ''}
            ${r.dificultad  ? `<div class="rec-chip"><i class="fas fa-signal"></i> ${r.dificultad}</div>` : ''}
            ${r.modo_uso    ? `<div class="rec-chip"><i class="fas fa-hand-holding-medical"></i> ${r.modo_uso.split('—')[0].trim()}</div>` : ''}
            ${r.rendimiento ? `<div class="rec-chip"><i class="fas fa-flask"></i> ${r.rendimiento}</div>` : ''}
        </div>

        <!-- Uso -->
        ${(() => { const pqs = r.uso || getParaQueSirve(r); return pqs ? `
        <div class="receta-para-que">
            <div class="para-que-icon">🎯</div>
            <div class="para-que-body">
                <div class="para-que-label">Uso</div>
                <div class="para-que-texto">${pqs}</div>
            </div>
        </div>` : ''; })()}

        <!-- Propiedades -->
        ${r.propiedades && r.propiedades.length ? `
        <div class="receta-propiedades">
            ${r.propiedades.map(p => `<span class="prop-chip">${p}</span>`).join('')}
        </div>` : ''}

        <div class="modal-divider"></div>

        <!-- Ingredientes y Preparación -->
        <div class="modal-row">
            <div class="ico">🌿</div>
            <div><div class="label">Ingredientes</div><div class="value">${r.ingredientes || '—'}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">📋</div>
            <div><div class="label">Preparación</div><div class="value">${r.preparacion || '—'}</div></div>
        </div>

        <div class="modal-divider"></div>

        <!-- Dosis y modo de uso -->
        <div class="modal-row">
            <div class="ico">💊</div>
            <div><div class="label">Dosis y frecuencia</div><div class="value">${r.dosis || '—'}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">🖐️</div>
            <div><div class="label">Modo de uso</div><div class="value">${r.modo_uso || '—'}</div></div>
        </div>
        <div class="modal-row">
            <div class="ico">❄️</div>
            <div><div class="label">Conservación</div><div class="value">${r.conservacion || '—'}</div></div>
        </div>

        <div class="modal-divider"></div>

        <!-- Contraindicaciones -->
        <div class="alert-box warn receta-contra">
            <span class="ico">⚠️</span>
            <div><strong>Contraindicaciones:</strong> ${r.contraindicaciones || 'Consultar con profesional de salud antes del uso.'}</div>
        </div>

        <!-- Nivel de evidencia -->
        <div class="evidencia-badge" style="--ev-color:${ev.color}">
            <span>${ev.icon}</span>
            <span>${r.evidencia || 'Uso tradicional'}</span>
        </div>

        <!-- Plantas vinculadas -->
        ${linked.length ? `
            <div class="modal-divider"></div>
            <div class="modal-row">
                <div class="ico">🌱</div>
                <div>
                    <div class="label">Plantas en esta receta</div>
                    <div class="linked-plants">
                        ${linked.map(p => `<button class="linked-plant-chip" data-id="${p.id}">${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" class="chip-photo" onerror="this.remove()">` : ''}<span>${p.nombre}</span></button>`).join('')}
                    </div>
                </div>
            </div>
        ` : ''}

        <!-- Principios activos -->
        ${r.principios_activos ? `
        <div class="modal-divider"></div>
        <div class="receta-principios">
            <div class="principios-icon">🔬</div>
            <div class="principios-body">
                <div class="principios-label">Principios activos</div>
                <div class="principios-texto">${r.principios_activos}</div>
            </div>
        </div>` : ''}

        <!-- Referencias -->
        ${r.referencias ? `
        <div class="modal-divider"></div>
        <div class="receta-referencias">
            <span class="referencias-icon"><i class="fas fa-book-open"></i></span>
            <div>
                <div class="referencias-label">Referencias</div>
                <div class="referencias-texto">${r.referencias}</div>
            </div>
        </div>` : ''}

        <div class="modal-divider"></div>
        <button class="btn-print-receta" id="btnPrintReceta" data-id="${r.id}">
            <i class="fas fa-print"></i> Imprimir receta
        </button>
    `;

    $$('.linked-plant-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            cerrarModal();
            setTimeout(() => abrirDetallePlanta(parseInt(chip.dataset.id)), 250);
        });
    });

    $('#btnPrintReceta')?.addEventListener('click', () => imprimirReceta(r.id));

    configurarShareBtn(
        `${r.titulo} — Enciclopedia Naturista de Chile`,
        `${r.titulo}: ${(r.uso || '').split('.')[0]}.`
    );

    abrirModal();
}

// ════════════════════════════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════════════════════════════
function configurarShareBtn(title, text) {
    const btn = document.getElementById('modalShareBtn');
    if (!btn) return;
    btn.style.display = 'flex';
    btn.title = 'Compartir';
    btn.innerHTML = '<i class="fas fa-share-nodes"></i><span>Compartir</span>';
    btn.onclick = () => {
        if (navigator.share) {
            navigator.share({ title, text, url: window.location.href }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(window.location.href).then(() =>
                mostrarToast('<i class="fas fa-share-alt"></i> Enlace copiado al portapapeles', 'ok')
            ).catch(() => {});
        }
    };
}

const modal = $('#detailModal');
function abrirModal() { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }
function cerrarModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname + location.search);
}
$('#detailModal .close-modal').addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('quizModal')?.classList.contains('show')) cerrarQuizModal();
        else cerrarModal();
    }
});

// ════════════════════════════════════════════════════════════════════
// BÚSQUEDA Y FILTROS
// ════════════════════════════════════════════════════════════════════
$('#searchInput').addEventListener('input', (e) => {
    busqueda = e.target.value;
    mostrandoFavoritos = false;
    actualizarBtnFavoritos();
    actualizarBtnReset();
    renderPlantas();
});

$('#clearSearch').addEventListener('click', () => {
    $('#searchInput').value = '';
    busqueda = '';
    actualizarBtnReset();
    renderPlantas();
});

$('#filterChiloe').addEventListener('click', () => {
    filtroChiloe = !filtroChiloe;
    $('#filterChiloe').classList.toggle('active', filtroChiloe);
    mostrandoFavoritos = false;
    $('#filterFav').classList.remove('active');
    actualizarBtnReset();
    renderPlantas();
});

$('#filterFav').addEventListener('click', () => {
    mostrandoFavoritos = !mostrandoFavoritos;
    $('#filterFav').classList.toggle('active', mostrandoFavoritos);
    if (mostrandoFavoritos) {
        filtroChiloe = false;
        $('#filterChiloe').classList.remove('active');
    }
    actualizarBtnReset();
    renderPlantas();
});

$('#symptomSearch').addEventListener('click', () => {
    abrirSintomasMenu();
});

let filtroTemporada = false;
let filtroRegion = null;

$('#filterTemporada').addEventListener('click', () => {
    filtroTemporada = !filtroTemporada;
    $('#filterTemporada').classList.toggle('active', filtroTemporada);
    if (filtroTemporada) {
        const mes = new Date().getMonth() + 1;
        const count = plantasDB.filter(p => p.meses && p.meses.includes(mes)).length;
        mostrarToast(`<i class="fas fa-calendar-check"></i> ${count} plantas en temporada ahora`, 'info');
    }
    actualizarBtnReset();
    renderPlantas();
});

$('#filterRegionBtn').addEventListener('click', () => {
    const panel = $('#regionPanel');
    const visible = panel.style.display !== 'none';
    panel.style.display = visible ? 'none' : 'block';
    $('#filterRegionBtn').classList.toggle('active', !visible);
    if (!visible && $('#regionChips').childElementCount === 0) {
        renderRegionChips();
    }
});

$('#resetFiltros').addEventListener('click', resetearFiltros);

function renderRegionChips() {
    const regMap = {};
    plantasDB.forEach(p => {
        const r = (p.region || '').split(',')[0].split(' y ')[0].trim();
        if (r && r.length > 3) regMap[r] = (regMap[r] || 0) + 1;
    });
    const sorted = Object.entries(regMap).sort((a,b) => b[1]-a[1]).slice(0, 12);
    $('#regionChips').innerHTML = `<button class="region-chip ${!filtroRegion ? 'active' : ''}" data-region="">Todas</button>` +
        sorted.map(([r, n]) => `<button class="region-chip ${filtroRegion === r ? 'active' : ''}" data-region="${r}">${r} <span style="opacity:0.5;font-size:0.7em;">${n}</span></button>`).join('');
    $$('.region-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            filtroRegion = chip.dataset.region || null;
            $$('.region-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            actualizarBtnReset();
            renderPlantas();
        });
    });
}

// Preset de síntomas comunes -> términos de búsqueda
const SINTOMAS_PRESET = [
    { label: 'Tos', term: 'tos', icon: '💨' },
    { label: 'Resfriado', term: 'resfri', icon: '🤧' },
    { label: 'Dolor de cabeza', term: 'dolor', icon: '🧠' },
    { label: 'Insomnio', term: 'insomnio', icon: '🌙' },
    { label: 'Ansiedad / Nervios', term: 'nervios', icon: '🌊' },
    { label: 'Digestión', term: 'digestion', icon: '🌾' },
    { label: 'Hígado', term: 'higado', icon: '🍂' },
    { label: 'Riñones', term: 'riñon', icon: '💧' },
    { label: 'Garganta', term: 'garganta', icon: '🗣️' },
    { label: 'Heridas / Piel', term: 'herida', icon: '🩹' },
    { label: 'Reumatismo', term: 'reumat', icon: '🦴' },
    { label: 'Fiebre', term: 'fiebre', icon: '🌡️' },
    { label: 'Diarrea', term: 'diarrea', icon: '🌀' },
    { label: 'Quemaduras', term: 'quemad', icon: '🔥' },
    { label: 'Cabello', term: 'cabello', icon: '💇' },
    { label: 'Inflamación', term: 'inflama', icon: '✨' }
];

function abrirSintomasMenu() {
    const panel = $('#symptomPanel');
    const list = $('#symptomList');
    list.innerHTML = SINTOMAS_PRESET.map((s, i) => `
        <button class="symptom-row" data-term="${s.term}" style="--i:${i};">
            <span class="symptom-row-icon">${s.icon}</span>
            <span class="symptom-row-label">${s.label}</span>
            <span class="symptom-row-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </span>
        </button>
    `).join('');

    $$('.symptom-row').forEach(row => {
        row.addEventListener('click', () => {
            aplicarSintoma(row.dataset.term);
        });
    });

    const input = $('#customSymptom');
    input.value = '';
    input.onkeydown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            aplicarSintoma(e.target.value.trim());
        }
    };

    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 280);
}

function cerrarSintomasMenu() {
    const panel = $('#symptomPanel');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function aplicarSintoma(term) {
    cerrarSintomasMenu();
    busqueda = term;
    $('#searchInput').value = term;
    mostrandoFavoritos = false;
    actualizarBtnReset();
    renderPlantas();
}

// Listeners del panel lateral
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('symptomPanel');
    if (!panel) return;
    panel.querySelector('.side-panel-close').addEventListener('click', cerrarSintomasMenu);
    panel.querySelector('.side-panel-backdrop').addEventListener('click', cerrarSintomasMenu);
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const panel = document.getElementById('symptomPanel');
        if (panel && panel.classList.contains('open')) cerrarSintomasMenu();
    }
});

$('#favBtn').addEventListener('click', () => {
    cambiarTab('plants');
    mostrandoFavoritos = true;
    $('#filterFav').classList.add('active');
    renderPlantas();
});

// ════════════════════════════════════════════════════════════════════
// TABS — con indicador móvil
// ════════════════════════════════════════════════════════════════════
function moverIndicador() {
    const activeBtn = $('#navTabs .tab-btn.active');
    const indicator = $('#tabIndicator');
    if (!activeBtn || !indicator) return;
    const rect = activeBtn.getBoundingClientRect();
    const parentRect = activeBtn.parentElement.getBoundingClientRect();
    indicator.style.left = (rect.left - parentRect.left) + 'px';
    indicator.style.width = rect.width + 'px';
}

function cambiarTab(tabId) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    $$('.tab-content').forEach(t => t.classList.toggle('active', t.id === tabId + 'Tab'));
    moverIndicador();
    const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeTabBtn) {
        activeTabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Sincronizar bottom nav (home → home, plants → plants, etc.)
    $$('.bottom-nav-item').forEach(b => b.classList.toggle('active', b.dataset.bottomTab === tabId));
    if (tabId === 'plants') renderPlantas();
    if (tabId === 'home') { /* home is static; re-run reveal animations */ setTimeout(() => applyReveal(document), 50); }
    if (tabId === 'stats') { cargarRecetas().then(() => renderEstadisticas()); renderTuExploracion(); }
    if (tabId === 'maternidad') { cargarRecetas().then(() => renderMaternidad()); setTimeout(() => checkLogros('maternidad'), 500); }
    if (tabId === 'recipes' || tabId === 'dolencias') { cargarRecetas(); setTimeout(() => checkLogros('recetario'), 500); }
    if (tabId === 'ancestral') { cargarRecetas().then(() => renderMedicinaAncestral()); setTimeout(() => checkLogros('ancestral'), 500); }
    setTimeout(() => applyReveal(document), 50);
    if (window.innerWidth <= 767) window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarTab(btn.dataset.tab));
});

// Bottom navigation — delega en cambiarTab
$$('.bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.bottomTab;
        if (tab) cambiarTab(tab);
    });
});

window.addEventListener('resize', moverIndicador);

// ════════════════════════════════════════════════════════════════════
// EMERGENCIA
// ════════════════════════════════════════════════════════════════════
function showEmergency() {
    alert('🚨 EMERGENCIA TOXICOLÓGICA 🚨\n\nSAMU: 131\nCITUC: +56 2 2635 3800\n\nSi ingirió una planta tóxica, llame de inmediato.');
}
$('#emergencyBtn').addEventListener('click', showEmergency);
$('#emergencyToolsBtn')?.addEventListener('click', showEmergency);

// ════════════════════════════════════════════════════════════════════
// PARTÍCULAS — hojas flotantes
// ════════════════════════════════════════════════════════════════════
const canvas = $('#particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let particleMode = 'leaves';
let bgMotion = 'on';
let rafId;

function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function initParticles() {
    const N = particleMode === 'off' ? 0 : (particleMode === 'leaves' ? 28 : 60);
    particles = Array.from({ length: N }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.15 + Math.random() * 0.4,
        size: particleMode === 'leaves' ? 6 + Math.random() * 10 : 1 + Math.random() * 2,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        hue: Math.random() < 0.5 ? '155,187,122' : '212,165,116',
        a: 0.3 + Math.random() * 0.4
    }));
}

function drawLeaf(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `rgba(${p.hue},${p.a})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${p.hue},${p.a * 0.6})`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(-p.size, 0);
    ctx.lineTo(p.size, 0);
    ctx.stroke();
    ctx.restore();
}

function drawDot(p) {
    ctx.fillStyle = `rgba(${p.hue},${p.a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
}

function tickParticles() {
    if (particleMode === 'off' || bgMotion === 'off') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const speedFactor = bgMotion === 'calm' ? 0.4 : 1;
    particles.forEach(p => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;
        p.rot += p.vr * speedFactor;
        if (p.y > window.innerHeight + 20) { p.y = -20; p.x = Math.random() * window.innerWidth; }
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (particleMode === 'leaves') drawLeaf(p);
        else drawDot(p);
    });
    rafId = requestAnimationFrame(tickParticles);
}

function startParticles() {
    cancelAnimationFrame(rafId);
    if (particleMode !== 'off' && bgMotion !== 'off') tickParticles();
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// ════════════════════════════════════════════════════════════════════
// TWEAKS PANEL
// ════════════════════════════════════════════════════════════════════
const tweaksPanel = $('#tweaksPanel');
$('#tweaksBtn').addEventListener('click', () => {
    tweaksPanel.classList.toggle('open');
});

$$('.tweaks-panel .seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            seg.querySelectorAll('button').forEach(b => b.classList.remove('on'));
            btn.classList.add('on');
            const tweak = seg.dataset.tweak;
            const val = btn.dataset.val;
            applyTweak(tweak, val);
        });
    });
});

function applyTweak(tweak, val) {
    if (tweak === 'particles') {
        particleMode = val;
        initParticles();
        startParticles();
    }
    if (tweak === 'bgMotion') {
        bgMotion = val;
        const orbs = $$('.bg-orb');
        if (val === 'off') orbs.forEach(o => o.style.animationPlayState = 'paused');
        else if (val === 'calm') orbs.forEach(o => { o.style.animationPlayState = 'running'; o.style.animationDuration = '60s'; });
        else orbs.forEach(o => { o.style.animationPlayState = 'running'; o.style.animationDuration = '22s'; });
        startParticles();
    }
    // hubStyle tweak eliminado (accordion no usa grid de tarjetas)
}



// ════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════
function mostrarToast(msg, tipo = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast toast-${tipo}`;
    t.innerHTML = msg;
    container.appendChild(t);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => t.classList.add('show'));
    });
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 400);
    }, 2600);
}

// ════════════════════════════════════════════════════════════════════
// PLANTA DEL DÍA
// ════════════════════════════════════════════════════════════════════
function renderPlantaDelDia() {
    const container = document.getElementById('plantaDia');
    if (!container || !plantasDB.length) return;
    const dayIndex = Math.floor(Date.now() / 86400000) % plantasDB.length;
    const p = plantasDB[dayIndex];
    const mesActual = new Date().getMonth() + 1;
    const enTemporada = p.meses && p.meses.includes(mesActual);

    container.innerHTML = `
        <div class="planta-dia-card" id="plantaDiaCard">
            <div class="planta-dia-img">
                ${p.imagen
                    ? `<img src="${p.imagen}" alt="${p.nombre}" class="pdd-img">
                       <div class="planta-dia-placeholder pdd-ph" style="display:none"></div>`
                    : `<div class="planta-dia-placeholder pdd-ph"></div>`}
            </div>
            <div class="planta-dia-body">
                <div class="planta-dia-badge">
                    🌿 Planta del día${enTemporada ? ' · En temporada' : ''}
                </div>
                <div class="planta-dia-nombre">${p.nombre}</div>
                <div class="planta-dia-sci">${p.cientifico}</div>
                <div class="planta-dia-uso">${(p.usos || '').split('.')[0]}.</div>
                <button class="planta-dia-cta" id="plantaDiaCta">
                    <i class="fas fa-leaf"></i> Explorar planta
                </button>
            </div>
        </div>
    `;

    // Manejar error de imagen sin SVG en el onerror
    const img = container.querySelector('.pdd-img');
    const ph = container.querySelector('.pdd-ph');
    if (img && ph) {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            ph.style.display = 'grid';
        });
    }

    // Click en card completo y en botón
    document.getElementById('plantaDiaCard')?.addEventListener('click', (e) => {
        abrirDetallePlanta(p.id);
    });
}

// ════════════════════════════════════════════════════════════════════
// TEMPORADA BANNER
// ════════════════════════════════════════════════════════════════════
function renderTemporadaBanner() {
    const banner = document.getElementById('temporadaBanner');
    if (!banner || !plantasDB.length) return;
    const mesesNombres = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const mesActual = new Date().getMonth() + 1;
    const plantsEnTemporada = plantasDB.filter(p => p.meses && p.meses.includes(mesActual));
    if (plantsEnTemporada.length > 0) {
        banner.style.display = 'flex';
        banner.innerHTML = `
            <span class="tb-icon">🌿</span>
            <div>
                <strong>${plantsEnTemporada.length} plantas en temporada</strong> este ${mesesNombres[mesActual - 1]}:
                ${plantsEnTemporada.slice(0, 4).map(p => p.nombre).join(', ')}${plantsEnTemporada.length > 4 ? ` y ${plantsEnTemporada.length - 4} más` : ''}.
            </div>
        `;
    }
}

// ════════════════════════════════════════════════════════════════════
// PROGRESO DE EXPLORACIÓN
// ════════════════════════════════════════════════════════════════════
let plantasVistas = new Set(JSON.parse(localStorage.getItem('plantasVistas') || '[]'));

function marcarPlantaVista(id) {
    if (!plantasVistas.has(id)) {
        plantasVistas.add(id);
        localStorage.setItem('plantasVistas', JSON.stringify([...plantasVistas]));
        actualizarProgreso();
    }
    trackPlantaVisit(id);
    // Disparar logros después de marcar
    setTimeout(() => checkLogros(), 400);
}

function actualizarProgreso() {
    const total = plantasDB.length;
    if (!total) return;
    const vistas = plantasVistas.size;
    const pct = Math.round(vistas / total * 100);
    const numEl = document.getElementById('progresoNum');
    const barEl = document.getElementById('progresoBar');
    if (numEl) numEl.textContent = `${vistas} / ${total}`;
    if (barEl) barEl.style.width = pct + '%';
    // Reveal the bar once we have real data
    const wrap = document.querySelector('.progreso-wrap[data-loading]');
    if (wrap) delete wrap.dataset.loading;
}

// ════════════════════════════════════════════════════════════════════
// RECETA ALEATORIA
// ════════════════════════════════════════════════════════════════════
function recetaAleatoria() {
    if (!recetasDB.length) return;
    const r = recetasDB[Math.floor(Math.random() * recetasDB.length)];
    abrirDetalleReceta(r.id);
    mostrarToast(`<i class="fas fa-dice"></i> Receta aleatoria: ${r.titulo.slice(0, 30)}…`, 'info');
}

// ════════════════════════════════════════════════════════════════════
// IMPRIMIR RECETA
// ════════════════════════════════════════════════════════════════════
function imprimirReceta(id) {
    const r = recetasDB.find(r => r.id === id);
    if (!r) return;
    let printArea = document.querySelector('.print-recipe-area');
    if (!printArea) {
        printArea = document.createElement('div');
        printArea.className = 'print-recipe-area';
        document.body.appendChild(printArea);
    }
    printArea.innerHTML = `
        <h1>${r.titulo}</h1>
        <div class="print-sci">${r.categoria} · ${r.origen}</div>
        <div class="print-section">
            <h3>🌿 Ingredientes</h3>
            <p>${r.ingredientes || '—'}</p>
        </div>
        <div class="print-section">
            <h3>📋 Preparación</h3>
            <p>${r.preparacion || '—'}</p>
        </div>
        <div class="print-footer">Enciclopedia Naturista de Chile · Saber ancestral chileno y chilote</div>
    `;
    window.print();
}

// ════════════════════════════════════════════════════════════════════
// CURSOR PERSONALIZADO
// ════════════════════════════════════════════════════════════════════
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // no en táctil

    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let isAnimating = false;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX; dotY = e.clientY;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        if (!isAnimating) {
            isAnimating = true;
            animateCursorRing();
        }
    });

    function animateCursorRing() {
        const ease = 0.12;
        ringX += (dotX - ringX) * ease;
        ringY += (dotY - ringY) * ease;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        if (Math.abs(dotX - ringX) > 0.5 || Math.abs(dotY - ringY) > 0.5) {
            requestAnimationFrame(animateCursorRing);
        } else {
            isAnimating = false;
        }
    }

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('button, a, .plant-card, .recipe-card, .acc-trigger, .linked-plant-chip')) {
            ring.classList.add('hovering');
        } else {
            ring.classList.remove('hovering');
        }
    });
}

// ════════════════════════════════════════════════════════════════════
// AUTOCOMPLETADO DE BÚSQUEDA
// ════════════════════════════════════════════════════════════════════
function initAutocompletado() {
    const input = document.getElementById('searchInput');
    const suggestions = document.getElementById('searchSuggestions');
    if (!input || !suggestions) return;

    let selectedIdx = -1;

    function posicionarSuggestions() {
        const box = input.closest('.search-box');
        const rect = box.getBoundingClientRect();
        suggestions.style.top = (rect.bottom + 6) + 'px';
        suggestions.style.left = rect.left + 'px';
        suggestions.style.width = rect.width + 'px';
    }

    function mostrarSuggestions(term) {
        if (term.length < 2) { ocultarSuggestions(); return; }
        const t = term.toLowerCase();
        const matches = plantasDB
            .filter(p => p.nombre.toLowerCase().includes(t) || p.cientifico.toLowerCase().includes(t))
            .slice(0, 6);
        if (!matches.length) { ocultarSuggestions(); return; }

        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        suggestions.innerHTML = matches.map((p, i) => `
            <div class="suggest-item" data-id="${p.id}" tabindex="-1">
                ${p.imagen
                    ? `<img class="suggest-photo" src="${p.imagen}" alt="${p.nombre}" onerror="this.outerHTML='<div class=\\'suggest-photo-placeholder\\'>🌿</div>'">`
                    : `<div class="suggest-photo-placeholder">🌿</div>`}
                <div class="suggest-info">
                    <div class="suggest-nombre">${p.nombre.replace(regex, '<mark>$1</mark>')}</div>
                    <div class="suggest-sci">${p.cientifico}</div>
                </div>
            </div>
        `).join('');

        suggestions.querySelectorAll('.suggest-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const planta = plantasDB.find(p => p.id === id);
                if (planta) {
                    input.value = planta.nombre;
                    busqueda = planta.nombre;
                    renderPlantas();
                    ocultarSuggestions();
                    abrirDetallePlanta(id);
                }
            });
        });

        posicionarSuggestions();
        suggestions.classList.add('visible');
        selectedIdx = -1;
    }

    function ocultarSuggestions() {
        suggestions.classList.remove('visible');
        selectedIdx = -1;
    }

    input.addEventListener('input', (e) => {
        mostrarSuggestions(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
        const items = suggestions.querySelectorAll('.suggest-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
            items.forEach((el, i) => el.classList.toggle('selected', i === selectedIdx));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIdx = Math.max(selectedIdx - 1, 0);
            items.forEach((el, i) => el.classList.toggle('selected', i === selectedIdx));
        } else if (e.key === 'Enter' && selectedIdx >= 0) {
            items[selectedIdx]?.click();
        } else if (e.key === 'Escape') {
            ocultarSuggestions();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box') && !e.target.closest('.search-suggestions')) {
            ocultarSuggestions();
        }
    });

    window.addEventListener('resize', () => {
        if (suggestions.classList.contains('visible')) posicionarSuggestions();
    });
}

// ════════════════════════════════════════════════════════════════════
// QUIZ DE PLANTAS
// ════════════════════════════════════════════════════════════════════
const TIPOS_PREGUNTA = ['uso', 'cientifico', 'familia', 'parte'];
let quizState = {
    preguntas: [],
    actual: 0,
    correctas: 0,
    respondida: false
};

function generarPreguntas(n = 10) {
    const shuffled = [...plantasDB].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n).map(p => {
        const tipo = TIPOS_PREGUNTA[Math.floor(Math.random() * TIPOS_PREGUNTA.length)];
        let pregunta, respuesta, campo;
        if (tipo === 'uso') {
            const uso = (p.usos || '').split('.')[0];
            pregunta = `¿Para qué se usa principalmente el <strong>${p.nombre}</strong>?`;
            respuesta = uso;
            campo = 'usos';
        } else if (tipo === 'cientifico') {
            pregunta = `¿Cuál es el nombre científico del <strong>${p.nombre}</strong>?`;
            respuesta = p.cientifico;
            campo = 'cientifico';
        } else if (tipo === 'familia') {
            pregunta = `¿A qué familia botánica pertenece el <strong>${p.nombre}</strong>?`;
            respuesta = p.familia;
            campo = 'familia';
        } else {
            pregunta = `¿Qué parte del <strong>${p.nombre}</strong> se usa medicinalmente?`;
            respuesta = p.parte;
            campo = 'parte';
        }
        // Generar 3 opciones incorrectas del mismo campo
        const incorrectas = plantasDB
            .filter(x => x.id !== p.id && x[campo] && x[campo] !== respuesta)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(x => tipo === 'uso' ? (x.usos || '').split('.')[0] : x[campo]);
        const opciones = [respuesta, ...incorrectas].sort(() => Math.random() - 0.5);
        return { planta: p, pregunta, respuesta, opciones, tipo };
    });
}

function iniciarQuiz() {
    quizState = { preguntas: generarPreguntas(10), actual: 0, correctas: 0, respondida: false };
    const modal = document.getElementById('quizModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    renderPreguntaQuiz();
}

function renderPreguntaQuiz() {
    const { preguntas, actual, correctas } = quizState;
    const q = preguntas[actual];
    const total = preguntas.length;
    const pct = Math.round(actual / total * 100);
    document.getElementById('quizBody').innerHTML = `
        <div class="quiz-header">
            <div style="font-size:0.75rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.1em;">
                Pregunta ${actual + 1} de ${total}
            </div>
            <h2>${correctas} <span style="color:var(--text-mute);font-size:0.7em;font-weight:400;">correctas</span></h2>
            <div class="quiz-progress-bar-wrap">
                <div class="quiz-progress-fill" style="width:${pct}%"></div>
            </div>
        </div>
        ${q.planta.imagen
            ? `<img class="quiz-planta-photo" src="${q.planta.imagen}" alt="${q.planta.nombre}" onerror="this.outerHTML='<div class=\\'quiz-planta-placeholder\\'>🌿</div>'">`
            : `<div class="quiz-planta-placeholder">🌿</div>`}
        <div class="quiz-pregunta">${q.pregunta}</div>
        <div class="quiz-opciones">
            ${q.opciones.map((op, i) => `
                <button class="quiz-opcion" data-op="${i}" data-respuesta="${op === q.respuesta ? '1' : '0'}">
                    ${op}
                </button>
            `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <button class="quiz-btn-next" id="quizBtnNext">
            ${actual + 1 < total ? 'Siguiente pregunta <i class="fas fa-arrow-right"></i>' : 'Ver resultado <i class="fas fa-trophy"></i>'}
        </button>
    `;

    document.querySelectorAll('.quiz-opcion').forEach(btn => {
        btn.addEventListener('click', () => {
            if (quizState.respondida) return;
            quizState.respondida = true;
            const esCorrecta = btn.dataset.respuesta === '1';
            if (esCorrecta) quizState.correctas++;

            document.querySelectorAll('.quiz-opcion').forEach(b => {
                b.disabled = true;
                if (b.dataset.respuesta === '1') b.classList.add('correcta');
                else if (b === btn && !esCorrecta) b.classList.add('incorrecta');
            });

            const feedback = document.getElementById('quizFeedback');
            if (esCorrecta) {
                feedback.textContent = ['¡Correcto! 🌿', '¡Exacto! 🎯', '¡Muy bien! ✨'][Math.floor(Math.random()*3)];
                feedback.className = 'quiz-feedback bien';
            } else {
                feedback.textContent = `Incorrecto. La respuesta era: "${q.respuesta}"`;
                feedback.className = 'quiz-feedback mal';
            }

            const nextBtn = document.getElementById('quizBtnNext');
            nextBtn.classList.add('visible');
            nextBtn.addEventListener('click', () => {
                quizState.actual++;
                quizState.respondida = false;
                if (quizState.actual < quizState.preguntas.length) {
                    renderPreguntaQuiz();
                } else {
                    mostrarResultadoQuiz();
                }
            });
        });
    });
}

function mostrarResultadoQuiz() {
    const { correctas, preguntas } = quizState;
    const total = preguntas.length;
    const pct = Math.round(correctas / total * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '🌿' : '🌱';
    const msg = pct >= 80 ? '¡Experto en plantas chilenas!' : pct >= 50 ? '¡Buen conocimiento!' : '¡Sigue aprendiendo!';

    document.getElementById('quizBody').innerHTML = `
        <div class="quiz-resultado">
            <div class="quiz-emoji-big">${emoji}</div>
            <div class="quiz-score-big">${correctas}/${total}</div>
            <h3>${msg}</h3>
            <p>Respondiste correctamente el ${pct}% de las preguntas.</p>
            <button class="quiz-start-btn" id="repetirQuizBtn" style="margin:0 auto;">
                <i class="fas fa-redo"></i> Jugar de nuevo
            </button>
        </div>
    `;

    // Guardar mejor puntuación
    const mejorScore = JSON.parse(localStorage.getItem('quizMejorScore') || '0');
    if (correctas > mejorScore) {
        localStorage.setItem('quizMejorScore', correctas);
        mostrarToast(`🏆 ¡Nuevo récord! ${correctas}/${total}`, 'success');
    }

    const scoreBadge = document.getElementById('quizScoreBadge');
    if (scoreBadge) {
        scoreBadge.style.display = 'inline-flex';
        const mejor = Math.max(correctas, parseInt(localStorage.getItem('quizMejorScore') || '0'));
        scoreBadge.innerHTML = `🏆 Mejor puntuación: ${mejor}/${total}`;
    }

    document.getElementById('repetirQuizBtn')?.addEventListener('click', iniciarQuiz);
}

function cerrarQuizModal() {
    const modal = document.getElementById('quizModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ════════════════════════════════════════════════════════════════════
// HASH ROUTING — URLs amigables por planta y receta
// ════════════════════════════════════════════════════════════════════
async function resolverHash() {
    const hash = location.hash.replace('#', '');
    if (!hash) return;

    const [tipo, valor] = hash.split('/');

    if (tipo === 'planta' && valor) {
        const planta = plantasDB.find(p => slugify(p.nombre) === valor);
        if (planta) { cambiarTab('plants'); abrirDetallePlanta(planta.id); }
    } else if (tipo === 'receta' && valor) {
        await cargarRecetas();
        const id = parseInt(valor, 10);
        const receta = recetasDB.find(r => r.id === id);
        if (receta) { cambiarTab('recipes'); abrirDetalleReceta(receta.id); }
    }
}

// ════════════════════════════════════════════════════════════════════
// SEO — JSON-LD dinámico de plantas
// ════════════════════════════════════════════════════════════════════
function inyectarJsonLdPlantas() {
    if (!plantasDB.length) return;
    const base = 'https://zjonathanbeltran-stack.github.io/ENCICLOPEDIANATURISTA/';
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Plantas medicinales chilenas',
        description: `Catálogo de ${plantasDB.length} plantas medicinales de Chile con usos terapéuticos, contraindicaciones y recetas tradicionales.`,
        numberOfItems: plantasDB.length,
        itemListElement: plantasDB.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Drug',
                name: p.nombre,
                alternateName: p.cientifico,
                description: (p.usos || '').split('.')[0].trim(),
                url: `${base}#planta-${p.id}`,
                ...(p.precaucion ? { warning: p.precaucion } : {}),
                ...(p.imagen ? { image: p.imagen } : {})
            }
        }))
    };
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'jsonld-plantas';
    tag.textContent = JSON.stringify(itemList);
    document.head.appendChild(tag);
}

// ════════════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════════════
async function inicializar() {
    try {
        // 1. Cargar solo plantas — render inmediato
        const rPlant = await fetch('data/plantas.json');
        if (!rPlant.ok) throw new Error('No se pudieron cargar los datos.');
        plantasDB = await rPlant.json();
        window.plantasDB = plantasDB;

        renderSearchHero();
        renderPlantas();
        renderSistemasBusqueda();
        actualizarBtnFavoritos();
        actualizarBottomNavBadge();
        moverIndicador();

        resizeCanvas();
        initParticles();
        startParticles();

        renderPlantaDelDia();
        renderTemporadaBanner();
        actualizarProgreso();
        initAutocompletado();
        initCursor();

        actualizarChipCounts();
        applyReveal(document);
        inyectarJsonLdPlantas();
        initBottomSheetGestures();
        initGlobalSearch();
        initOnboarding();
        AmbientAudio.init();
        calcularRacha();
        checkLogros();

        // 2. Resolver hash — si apunta a receta, espera carga
        await resolverHash();

        // 3. Precargar recetas en background sin bloquear
        cargarRecetas();
    } catch (err) {
        plantListDiv.innerHTML = `
            <div class="empty">
                <div class="icon">⚠️</div>
                <p><strong>Error al cargar los datos.</strong></p>
                <p style="font-size:0.85rem;margin-top:12px;max-width:480px;margin-left:auto;margin-right:auto;">
                    No abras el archivo directamente — usa <strong>iniciar_servidor.bat</strong>
                    de la misma carpeta para que la página se cargue mediante un servidor local.
                </p>
            </div>`;
        console.error(err);
    }
}

// ════════════════════════════════════════════════════════════════════
// ESTADÍSTICAS / INFOGRAFÍA
// ════════════════════════════════════════════════════════════════════
let statsChartInstance = null;

function animarContador(el, target, duracion = 1200) {
    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / duracion, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function renderEstadisticas() {
    if (!plantasDB.length || !recetasDB.length) return;

    // ── Hero stats ──
    animarContador(document.getElementById('statPlantas'), plantasDB.length);
    animarContador(document.getElementById('statRecetas'), recetasDB.length);
    const categorias = new Set(recetasDB.map(r => r.categoria));
    animarContador(document.getElementById('statCategorias'), categorias.size);
    animarContador(document.getElementById('statChiloe'), plantasDB.filter(p => p.chiloe).length);

    // ── Safety stats ──
    const peligrosas = plantasDB.filter(p => p.peligroso).length;
    const protegidas = plantasDB.filter(p => p.protegida).length;
    const seguras = plantasDB.length - peligrosas - protegidas;
    document.getElementById('safetyStats').innerHTML = `
        <div class="safety-item">
            <div class="safety-badge safe">✅</div>
            <div class="safety-txt">
                <strong>${seguras} plantas de uso habitual</strong>
                <span>Sin restricciones especiales de uso</span>
            </div>
        </div>
        <div class="safety-item">
            <div class="safety-badge warn">⚠️</div>
            <div class="safety-txt">
                <strong>${peligrosas} plantas con precaución</strong>
                <span>Requieren supervisión o dosis exactas</span>
            </div>
        </div>
        <div class="safety-item">
            <div class="safety-badge danger">🛡️</div>
            <div class="safety-txt">
                <strong>${protegidas} especies protegidas</strong>
                <span>No recolectar; compra a proveedores autorizados</span>
            </div>
        </div>
        <div class="safety-item">
            <div class="safety-badge safe">🌿</div>
            <div class="safety-txt">
                <strong>${plantasDB.filter(p => p.chiloe).length} plantas en Chiloé</strong>
                <span>Presente en el territorio chilote</span>
            </div>
        </div>
    `;

    // ── Gráfico de torta: recetas por sistema ──
    const sistemaCount = {};
    SISTEMAS.forEach(s => { sistemaCount[s.nombre] = 0; });
    recetasDB.forEach(r => {
        const s = sistemaDeCategoria(r.categoria);
        if (s) sistemaCount[s.nombre] = (sistemaCount[s.nombre] || 0) + 1;
    });
    const colores = [
        '#6a8a52','#9bbb7a','#c97b56','#d4a574','#8a9b6e',
        '#5a7a42','#e2a585','#4d6e38','#b88c6a','#3d5530',
        '#c5b896','#7a9b5a'
    ];
    const labels = Object.keys(sistemaCount).filter(k => sistemaCount[k] > 0);
    const values = labels.map(k => sistemaCount[k]);

    const canvas = document.getElementById('chartSistemas');
    if (statsChartInstance) { statsChartInstance.destroy(); statsChartInstance = null; }
    if (canvas && typeof Chart !== 'undefined') {
        statsChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colores.slice(0, labels.length),
                    borderColor: 'rgba(28,34,24,0.8)',
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f1e8',
                            font: { size: 11 },
                            padding: 10,
                            boxWidth: 12,
                            boxHeight: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.label}: ${ctx.raw} recetas`
                        }
                    }
                },
                cutout: '55%'
            }
        });
    }

    // ── Top plantas más usadas en recetas ──
    const usoCuenta = {};
    recetasDB.forEach(r => {
        const texto = ((r.ingredientes || '') + ' ' + r.titulo + ' ' + (r.preparacion || '')).toLowerCase();
        plantasDB.forEach(p => {
            if (texto.includes(p.nombre.toLowerCase())) {
                usoCuenta[p.nombre] = (usoCuenta[p.nombre] || 0) + 1;
            }
        });
    });
    const top15 = Object.entries(usoCuenta)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    const maxUso = top15[0]?.[1] || 1;
    document.getElementById('topPlantas').innerHTML = top15.map(([nombre, cnt]) => `
        <div class="bar-row">
            <span class="bar-label">${nombre}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${Math.round(cnt/maxUso*100)}%"></div>
            </div>
            <span class="bar-count">${cnt}</span>
        </div>
    `).join('');

    // ── Tu exploración personal ──
    renderTuExploracion();
}

function renderTuExploracion() {
    const el = document.getElementById('tuExploracion');
    if (!el) return;

    const vistas = [...plantasVistas];
    const favs = favoritos.length;
    const pct = plantasDB.length ? Math.round(vistas.length / plantasDB.length * 100) : 0;

    // Last 4 viewed plants
    const recientes = vistas.slice(-4).reverse()
        .map(id => plantasDB.find(p => p.id === id))
        .filter(Boolean);

    el.innerHTML = `
        <div class="tuexp-row">
            <div class="tuexp-stat">
                <span class="tuexp-num">${vistas.length}</span>
                <span class="tuexp-lbl">plantas exploradas</span>
            </div>
            <div class="tuexp-stat accent">
                <span class="tuexp-num">${pct}%</span>
                <span class="tuexp-lbl">del catálogo</span>
            </div>
            <div class="tuexp-stat">
                <span class="tuexp-num">${favs}</span>
                <span class="tuexp-lbl">favoritas guardadas</span>
            </div>
        </div>
        <div class="tuexp-bar-wrap" title="${vistas.length} de ${plantasDB.length} plantas">
            <div class="tuexp-bar-fill" style="width:${pct}%"></div>
        </div>
        ${recientes.length ? `
        <div class="tuexp-recientes">
            <span class="tuexp-recientes-label">Vistas recientemente</span>
            <div class="tuexp-chips">
                ${recientes.map(p => `
                    <button class="tuexp-chip" data-id="${p.id}">
                        ${p.emoji ? `<span>${p.emoji}</span>` : '🌿'} ${p.nombre}
                    </button>
                `).join('')}
            </div>
        </div>` : `<p class="tuexp-empty">Explora plantas para ver tu progreso aquí</p>`}
    `;

    el.querySelectorAll('.tuexp-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            cambiarTab('plants');
            abrirDetallePlanta(parseInt(btn.dataset.id));
        });
    });
}

// ── Event listeners post-carga ──
document.addEventListener('DOMContentLoaded', () => {
    // Receta aleatoria
    document.getElementById('recetaAleatoriaBtn')?.addEventListener('click', recetaAleatoria);

    // Quiz
    document.getElementById('iniciarQuizBtn')?.addEventListener('click', iniciarQuiz);
    document.getElementById('closeQuizModal')?.addEventListener('click', cerrarQuizModal);
    document.getElementById('quizModal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('quizModal')) cerrarQuizModal();
    });

    // Cursor personalizado — agregar toggle al tweaks panel
    const tweaksPanel = document.getElementById('tweaksPanel');
    if (tweaksPanel) {
        const existingOpts = tweaksPanel.querySelector('.opt-row:last-child');
        const cursorRow = document.createElement('div');
        cursorRow.className = 'opt-row';
        cursorRow.innerHTML = `
            <label>Cursor hoja</label>
            <div class="seg" data-tweak="cursor">
                <button data-val="on">On</button>
                <button data-val="off" class="on">Off</button>
            </div>
        `;
        tweaksPanel.appendChild(cursorRow);
        cursorRow.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                cursorRow.querySelectorAll('button').forEach(b => b.classList.remove('on'));
                btn.classList.add('on');
                if (btn.dataset.val === 'on') {
                    document.body.classList.add('custom-cursor-on');
                } else {
                    document.body.classList.remove('custom-cursor-on');
                }
            });
        });
    }

    // Mostrar mejor puntuación si existe
    const mejorScore = localStorage.getItem('quizMejorScore');
    if (mejorScore && parseInt(mejorScore) > 0) {
        const badge = document.getElementById('quizScoreBadge');
        if (badge) {
            badge.style.display = 'inline-flex';
            badge.innerHTML = `🏆 Mejor puntuación: ${mejorScore}/10`;
        }
    }
});

inicializar();

// ── Recetario: buscador por síntoma + sistemas corporales ────────────
(function() {
    let debounceTimer;

    // Input: búsqueda libre
    document.addEventListener('input', (e) => {
        if (e.target.id !== 'recetaSearchInput') return;
        const clr = document.getElementById('recetaSearchClear');
        if (clr) clr.hidden = !e.target.value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const q = e.target.value.trim();
            if (q.length < 2) { limpiarRecetaSearch(); return; }
            document.querySelectorAll('.rsis-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('recetaDolenciasPanel').hidden = true;
            _moduloActivo = null; // búsqueda libre = catálogo completo
            await cargarRecetas();
            renderRecetaSearchResults(buscarRecetasPorSintoma(q), q);
        }, 280);
    });

    document.addEventListener('click', (e) => {
        // Limpiar búsqueda
        if (e.target.id === 'recetaSearchClear' || e.target.closest('#recetaSearchClear')) {
            limpiarRecetaSearch();
            return;
        }

        // Botón volver desde panel de condiciones → sub-módulos (si los hay) o sistemas
        if (e.target.id === 'rdolBack' || e.target.closest('#rdolBack')) {
            document.getElementById('recetaDolenciasPanel').hidden = true;
            if (_sistemaActivo && SUBMODULOS[_sistemaActivo]) {
                mostrarSubmodulos(_sistemaActivo);
            } else {
                document.querySelectorAll('.rsis-btn').forEach(b => b.classList.remove('active'));
            }
            return;
        }

        // Botón volver desde sub-módulos → sistemas
        if (e.target.id === 'rsubBack' || e.target.closest('#rsubBack')) {
            document.getElementById('recetaSubmodulosPanel').hidden = true;
            document.querySelectorAll('.rsis-btn').forEach(b => b.classList.remove('active'));
            _sistemaActivo = null;
            return;
        }

        // Clic en tarjeta de sub-módulo
        const subChip = e.target.closest('.rsub-chip');
        if (subChip) {
            const sistemaId = subChip.dataset.sistema;
            const subId     = subChip.dataset.subid;
            const subData   = SUBMODULOS[sistemaId];
            const sub       = subData?.submods.find(s => s.id === subId);
            if (!sub) return;
            if (sub.file) {
                // Condición con archivo propio → cargar y mostrar resultados directo
                (async () => {
                    const res  = await fetch(sub.file);
                    const data = await res.json();
                    document.getElementById('recetaSubmodulosPanel').hidden = true;
                    const inp = document.getElementById('recetaSearchInput');
                    const clr = document.getElementById('recetaSearchClear');
                    if (inp) inp.value = sub.label;
                    if (clr) clr.hidden = false;
                    renderRecetaSearchResults(data.recetas, sub.label);
                })();
            } else {
                // Sub-módulo con condiciones/dolencias → mostrar panel intermedio
                mostrarCondicionesDeSubmodulo(sistemaId, subId);
            }
            return;
        }

        // Clic en sistema corporal
        const sisBtn = e.target.closest('.rsis-btn');
        if (sisBtn) {
            const sistemaId = sisBtn.dataset.sistema;
            if (sisBtn.classList.contains('active')) {
                limpiarRecetaSearch();
            } else {
                mostrarDolenciasDeSistema(sistemaId);
                const cont = document.getElementById('recetaSearchResults');
                if (cont) { cont.innerHTML = ''; cont.style.display = 'none'; }
                const inp = document.getElementById('recetaSearchInput');
                const clr = document.getElementById('recetaSearchClear');
                if (inp) inp.value = '';
                if (clr) clr.hidden = true;
            }
            return;
        }

        // Clic en chip de condición precisa (sub-módulo) → buscarPorCondicion
        const condChip = e.target.closest('.rdol-chip-cond');
        if (condChip) {
            const q = condChip.dataset.q;
            const kws = JSON.parse(condChip.dataset.kws || '[]');
            const inp = document.getElementById('recetaSearchInput');
            const clr = document.getElementById('recetaSearchClear');
            if (inp) inp.value = q;
            if (clr) clr.hidden = false;
            (async () => {
                const pool = _moduloActivo ? await cargarModulo(_moduloActivo) : (await cargarRecetas(), recetasDB);
                renderRecetaSearchResults(buscarPorCondicion(kws, pool), q);
            })();
            return;
        }

        // Clic en chip de dolencia genérica → buscarRecetasPorSintoma
        const dolChip = e.target.closest('.rdol-chip');
        if (!dolChip) return;
        const q = dolChip.dataset.q;
        const inp = document.getElementById('recetaSearchInput');
        const clr = document.getElementById('recetaSearchClear');
        if (inp) inp.value = q;
        if (clr) clr.hidden = false;
        (async () => {
            const pool = _moduloActivo ? await cargarModulo(_moduloActivo) : (await cargarRecetas(), recetasDB);
            renderRecetaSearchResults(buscarRecetasPorSintoma(q, pool), q);
        })();
    });
})();

// ── Maternidad subtabs ──
(function() {
    $$('.matern-nav-card').forEach(btn => {
        btn.addEventListener('click', () => switchMaternSubtab(btn.dataset.matern));
    });

    $$('.matern-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nav = btn.closest('.matern-sub-nav');
            if (nav) switchMaternSubPanel(nav.dataset.section, btn.dataset.sub);
        });
    });

    // ── Header scroll-state ──
    const headerEl = document.querySelector('header');
    if (headerEl) {
        window.addEventListener('scroll', () => {
            headerEl.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // ── Back-to-top button ──
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 280);
        }, { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── View toggle (grid / list) ──
    let vistaLista = false;
    const viewGrid = document.getElementById('viewGrid');
    const viewList = document.getElementById('viewList');
    const plantListDiv2 = document.getElementById('plantList');

    if (viewGrid && viewList) {
        viewGrid.addEventListener('click', () => {
            vistaLista = false;
            plantListDiv2.classList.remove('list-view');
            viewGrid.classList.add('active');
            viewList.classList.remove('active');
            renderPlantas();
        });
        viewList.addEventListener('click', () => {
            vistaLista = true;
            plantListDiv2.classList.add('list-view');
            viewList.classList.add('active');
            viewGrid.classList.remove('active');
            renderPlantas();
        });
    }

    // ── Sort select ──
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => renderPlantas());
    }

    // ── Keyboard shortcuts ──
    document.addEventListener('keydown', (e) => {
        // "/" to focus search
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
                cambiarTab('plants');
            }
        }
        // Escape to close modals / panels
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
            const sidePanel = document.querySelector('.side-panel.open');
            if (sidePanel) sidePanel.classList.remove('open');
        }
    });
    // Show "/" hint in search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput && !('ontouchstart' in window)) {
        searchInput.placeholder = 'Buscar planta, síntoma, receta… ( / )';
    }

    // ── PWA Install prompt ──
    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        const card = document.getElementById('pwaInstallCard');
        if (card) card.style.display = 'block';
    });
    document.getElementById('pwaInstallBtn')?.addEventListener('click', () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                document.getElementById('pwaInstallCard').style.display = 'none';
                mostrarToast('<i class="fas fa-check"></i> App instalada correctamente', 'ok');
            }
            deferredInstallPrompt = null;
        });
    });

    // (chip counts are updated by actualizarChipCounts() after data loads)

    // ── Modal reading progress bar ──
    (() => {
        const modalOverlay = document.getElementById('detailModal');
        const modalContent = modalOverlay?.querySelector('.modal-content');
        if (!modalContent) return;

        // Create progress bar stuck to top of modal-content
        const bar = document.createElement('div');
        bar.id = 'modalProgressBar';
        bar.className = 'modal-progress-bar';
        bar.innerHTML = '<div class="modal-progress-fill"></div>';
        modalContent.prepend(bar);

        const fill = bar.querySelector('.modal-progress-fill');

        // Reset bar when modal opens
        const observer = new MutationObserver(() => {
            if (!modalOverlay.classList.contains('show')) {
                fill.style.width = '0%';
                modalOverlay.scrollTop = 0;
            }
        });
        observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });

        // Track scroll on the overlay (actual scrolling element)
        modalOverlay.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = modalOverlay;
            const progress = scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight);
            fill.style.width = (progress * 100) + '%';
        }, { passive: true });
    })();

    // ── Random plant button ──
    const randomBtn = document.getElementById('randomPlantBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            cambiarTab('plants');
            const idx = Math.floor(Math.random() * plantasDB.length);
            abrirDetallePlanta(plantasDB[idx].id);
        });
    }

})();

// ── Plant notes (localStorage) ──
function leerNota(id) {
    const notas = JSON.parse(localStorage.getItem('plantNotas') || '{}');
    return notas[id] || '';
}
function guardarNota(id, texto) {
    const notas = JSON.parse(localStorage.getItem('plantNotas') || '{}');
    if (texto) { notas[id] = texto; } else { delete notas[id]; }
    localStorage.setItem('plantNotas', JSON.stringify(notas));
    setTimeout(() => checkLogros('nota'), 300);
}

// ── Filter chip counts (called after plantasDB loads) ──
function actualizarChipCounts() {
    const mes = new Date().getMonth() + 1;
    const chiloeCount = plantasDB.filter(p => p.chiloe).length;
    const tempCount   = plantasDB.filter(p => p.meses && p.meses.includes(mes)).length;

    const chiloeChip = document.getElementById('filterChiloe');
    const tempChip   = document.getElementById('filterTemporada');
    if (chiloeChip) {
        chiloeChip.innerHTML = `<i class="fas fa-location-dot"></i> Solo Chiloé <span class="chip-count">${chiloeCount}</span>`;
    }
    if (tempChip) {
        tempChip.innerHTML = `<i class="fas fa-calendar-check"></i> En temporada <span class="chip-count">${tempCount}</span>`;
    }
}

// ════════════════════════════════════════════════════════════════════
// SISTEMA DE LOGROS
// ════════════════════════════════════════════════════════════════════
const LOGROS = [
    { id: 'primera_hoja',    icono: '🌿', titulo: 'Primera Hoja',       desc: 'Abriste tu primera planta medicinal',       check: () => plantasVistas.size >= 1 },
    { id: 'aprendiz',        icono: '🌱', titulo: 'Machi Aprendiz',     desc: 'Exploraste 10 plantas medicinales',         check: () => plantasVistas.size >= 10 },
    { id: 'herbolario',      icono: '🍃', titulo: 'Herbolario',         desc: 'Exploraste 30 plantas medicinales',         check: () => plantasVistas.size >= 30 },
    { id: 'machi_mayor',     icono: '🦅', titulo: 'Machi Mayor',        desc: 'Exploraste las 85 plantas del catálogo',    check: () => plantasDB.length > 0 && plantasVistas.size >= plantasDB.length },
    { id: 'hijo_chiloe',     icono: '🏝️', titulo: 'Hijo de Chiloé',    desc: 'Exploraste todas las plantas de Chiloé',   check: () => { const c = plantasDB.filter(p => p.chiloe); return c.length > 0 && c.every(p => plantasVistas.has(p.id)); } },
    { id: 'guardian_mapuche',icono: '🔥', titulo: 'Guardián Mapuche',   desc: 'Visitaste la sección Medicina Ancestral',   check: () => !!(JSON.parse(localStorage.getItem('logros_triggers')||'{}').ancestral) },
    { id: 'coleccionista',   icono: '⭐', titulo: 'Coleccionista',      desc: 'Guardaste 10 plantas en favoritos',         check: () => favoritos.length >= 10 },
    { id: 'cronista',        icono: '✍️', titulo: 'Cronista Natural',   desc: 'Escribiste notas en 5 plantas',             check: () => Object.keys(JSON.parse(localStorage.getItem('plantNotas')||'{}')).length >= 5 },
    { id: 'racha_7',         icono: '🔥', titulo: 'Espíritu Constante', desc: '7 días seguidos explorando',               check: () => calcularRacha() >= 7 },
    { id: 'recetario_vivo',  icono: '🫙', titulo: 'Recetario Vivo',     desc: 'Exploraste el Recetario completo',          check: () => !!(JSON.parse(localStorage.getItem('logros_triggers')||'{}').recetario) },
    { id: 'quiz_master',     icono: '🧠', titulo: 'Quiz Master',        desc: 'Completaste el quiz de plantas',            check: () => !!(JSON.parse(localStorage.getItem('logros_triggers')||'{}').quiz_done) },
    { id: 'maternidad',      icono: '🤰', titulo: 'Sabiduría Maternal', desc: 'Visitaste la sección de Maternidad',        check: () => !!(JSON.parse(localStorage.getItem('logros_triggers')||'{}').maternidad) }
];

function getLogrosDesbloqueados() {
    return JSON.parse(localStorage.getItem('logrosDesbloqueados') || '[]');
}

function checkLogros(trigger = null) {
    if (trigger) {
        const t = JSON.parse(localStorage.getItem('logros_triggers') || '{}');
        t[trigger] = true;
        localStorage.setItem('logros_triggers', JSON.stringify(t));
    }
    const desbloqueados = getLogrosDesbloqueados();
    let nuevos = false;
    LOGROS.forEach(logro => {
        if (desbloqueados.includes(logro.id)) return;
        try {
            if (logro.check()) {
                desbloqueados.push(logro.id);
                nuevos = true;
                // Delay toasts so they don't stack instantly
                setTimeout(() => mostrarLogroToast(logro), (desbloqueados.indexOf(logro.id) - 1) * 600);
            }
        } catch(e) {}
    });
    if (nuevos) {
        localStorage.setItem('logrosDesbloqueados', JSON.stringify(desbloqueados));
        actualizarLogrosBadge();
    }
}

function mostrarLogroToast(logro) {
    const toast = document.createElement('div');
    toast.className = 'logro-toast';
    toast.innerHTML = `
        <div class="logro-toast-inner">
            <div class="logro-toast-icon">${logro.icono}</div>
            <div class="logro-toast-content">
                <div class="logro-toast-eyebrow">🏆 Logro desbloqueado</div>
                <div class="logro-toast-titulo">${logro.titulo}</div>
                <div class="logro-toast-desc">${logro.desc}</div>
            </div>
        </div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, 4500);
}

function actualizarLogrosBadge() {
    const badge = document.getElementById('logrosBadge');
    if (!badge) return;
    const n = getLogrosDesbloqueados().length;
    badge.textContent = `${n}/${LOGROS.length}`;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
}

// ════════════════════════════════════════════════════════════════════
// SISTEMA DE RACHA + PERFIL CULTURAL
// ════════════════════════════════════════════════════════════════════
function calcularRacha() {
    const hoy = new Date().toDateString();
    const historial = JSON.parse(localStorage.getItem('visitHistorial') || '[]');
    if (!historial.includes(hoy)) {
        historial.push(hoy);
        if (historial.length > 90) historial.shift();
        localStorage.setItem('visitHistorial', JSON.stringify(historial));
    }
    let racha = 0;
    const fecha = new Date();
    for (let i = 0; i < 90; i++) {
        if (historial.includes(fecha.toDateString())) {
            racha++;
            fecha.setDate(fecha.getDate() - 1);
        } else break;
    }
    return racha;
}

function trackPlantaVisit(id) {
    const counts = JSON.parse(localStorage.getItem('plantVisitCounts') || '{}');
    counts[id] = (counts[id] || 0) + 1;
    localStorage.setItem('plantVisitCounts', JSON.stringify(counts));
}

function calcularPlantaDelAlma() {
    const counts = JSON.parse(localStorage.getItem('plantVisitCounts') || '{}');
    let maxId = null, maxCount = 0;
    Object.entries(counts).forEach(([id, count]) => {
        if (count > maxCount) { maxCount = count; maxId = parseInt(id); }
    });
    if (!maxId) return null;
    return plantasDB.find(p => p.id === maxId) || null;
}

function calcularEspecialidad() {
    const cats = [
        ['digestiv', 'Digestivo'], ['hígado', 'Hepático'], ['nervios', 'Nervioso'],
        ['piel', 'Dermatológico'], ['respirat', 'Respiratorio'], ['dolor', 'Analgésico'],
        ['mapuche', 'Ancestral'], ['chiloe', 'Chilota'], ['cardio', 'Cardiovascular']
    ];
    const score = {};
    [...plantasVistas].forEach(id => {
        const p = plantasDB.find(x => x.id === id);
        if (!p) return;
        const usos = (p.usos + ' ' + (p.keywords || []).join(' ')).toLowerCase();
        cats.forEach(([kw, label]) => {
            if (usos.includes(kw)) score[label] = (score[label] || 0) + 1;
        });
    });
    return Object.entries(score).sort((a,b) => b[1]-a[1]).slice(0,2).map(e => e[0]);
}

function renderTuExploracion() {
    const el = document.getElementById('tuExploracion');
    if (!el) return;

    const vistas      = [...plantasVistas];
    const pct         = plantasDB.length ? Math.round(vistas.length / plantasDB.length * 100) : 0;
    const racha       = calcularRacha();
    const plantaAlma  = calcularPlantaDelAlma();
    const specs       = calcularEspecialidad();
    const logrosN     = getLogrosDesbloqueados().length;
    const nivel = vistas.length < 5  ? 'Curioso Natural'     :
                  vistas.length < 15 ? 'Aprendiz de Machi'   :
                  vistas.length < 30 ? 'Herbolario'           :
                  vistas.length < 60 ? 'Conocedor Ancestral'  : 'Machi Mayor';
    const recientes = vistas.slice(-4).reverse().map(id => plantasDB.find(p => p.id === id)).filter(Boolean);

    el.innerHTML = `
    <div class="perfil-card">
        <div class="perfil-header">
            <div class="perfil-avatar">${plantaAlma ? (plantaAlma.emoji || '🌿') : '🌱'}</div>
            <div class="perfil-info">
                <div class="perfil-titulo">${nivel}</div>
                <div class="perfil-racha">${racha > 1 ? `🔥 <strong>${racha}</strong> días seguidos` : '🌱 Bienvenido de vuelta'}</div>
                ${specs.length ? `<div class="perfil-especialidad">${specs.map(s=>`<span class="perfil-spec-badge">${s}</span>`).join('')}</div>` : ''}
            </div>
        </div>
        <div class="perfil-stats-grid">
            <div class="perfil-stat"><span class="perfil-stat-num">${vistas.length}</span><span class="perfil-stat-lbl">exploradas</span></div>
            <div class="perfil-stat accent"><span class="perfil-stat-num">${pct}%</span><span class="perfil-stat-lbl">del catálogo</span></div>
            <div class="perfil-stat"><span class="perfil-stat-num">${favoritos.length}</span><span class="perfil-stat-lbl">favoritas</span></div>
            <div class="perfil-stat amber"><span class="perfil-stat-num">${logrosN}</span><span class="perfil-stat-lbl">logros</span></div>
        </div>
        <div class="perfil-progress">
            <div class="perfil-progress-bar"><div class="perfil-progress-fill" style="width:${pct}%"></div></div>
            <span class="perfil-progress-txt">${vistas.length} de ${plantasDB.length} plantas exploradas</span>
        </div>
        ${plantaAlma ? `
        <div class="perfil-alma">
            <span class="perfil-alma-label">Tu planta del alma</span>
            <button class="perfil-alma-btn" data-id="${plantaAlma.id}">
                <span>${plantaAlma.emoji || '🌿'}</span>
                <strong>${plantaAlma.nombre}</strong>
                <span>${plantaAlma.cientifico}</span>
            </button>
        </div>` : ''}
        ${recientes.length ? `
        <div class="perfil-recientes">
            <span class="perfil-recientes-lbl">Vistas recientemente</span>
            <div class="perfil-chips">${recientes.map(p=>`<button class="tuexp-chip" data-id="${p.id}">${p.emoji||'🌿'} ${p.nombre}</button>`).join('')}</div>
        </div>` : '<p class="tuexp-empty">Explora plantas para ver tu progreso aquí</p>'}
    </div>

    <div class="logros-section">
        <h3 class="logros-titulo">Mis Logros <span id="logrosBadge" class="logros-count-badge"></span></h3>
        <div class="logros-grid">
            ${LOGROS.map(l => {
                const ok = getLogrosDesbloqueados().includes(l.id);
                return `<div class="logro-card ${ok ? 'unlocked' : 'locked'}" title="${l.desc}">
                    <span class="logro-icono">${l.icono}</span>
                    <span class="logro-nombre">${l.titulo}</span>
                    <span class="logro-desc">${l.desc}</span>
                </div>`;
            }).join('')}
        </div>
    </div>`;

    el.querySelector('.perfil-alma-btn')?.addEventListener('click', function() {
        cambiarTab('plants'); abrirDetallePlanta(parseInt(this.dataset.id));
    });
    el.querySelectorAll('.tuexp-chip').forEach(btn => {
        btn.addEventListener('click', () => { cambiarTab('plants'); abrirDetallePlanta(parseInt(btn.dataset.id)); });
    });
    actualizarLogrosBadge();
}

// ════════════════════════════════════════════════════════════════════
// MODO EXPLORADOR — ONBOARDING
// ════════════════════════════════════════════════════════════════════
const PERFILES_EXPLORER = {
    curandero:  { titulo: 'Curandero',   tab: 'dolencias'  },
    viajero:    { titulo: 'Viajero',     tab: 'plants'     },
    estudioso:  { titulo: 'Estudioso',   tab: 'plants'     },
    madre:      { titulo: 'Madre',       tab: 'maternidad' },
    ancestral:  { titulo: 'Ancestral',   tab: 'ancestral'  },
    general:    { titulo: 'Explorador',  tab: 'plants'     }
};

function initOnboarding() {
    if (localStorage.getItem('explorerProfile')) return;
    const overlay = document.getElementById('onboardingOverlay');
    if (!overlay) return;
    // Show after short delay so app loads first
    setTimeout(() => overlay.classList.add('show'), 800);

    overlay.querySelectorAll('.onb-profile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.profile;
            localStorage.setItem('explorerProfile', id);
            const perfil = PERFILES_EXPLORER[id];
            overlay.classList.add('closing');
            setTimeout(() => {
                overlay.style.display = 'none';
                if (perfil?.tab && perfil.tab !== 'plants') cambiarTab(perfil.tab);
                mostrarToast(`¡Bienvenido, ${perfil?.titulo || 'Explorador'}! El saber ancestral te espera. 🌿`, 'ok');
                checkLogros();
            }, 500);
        });
    });
    overlay.querySelector('.onb-skip')?.addEventListener('click', () => {
        localStorage.setItem('explorerProfile', 'general');
        overlay.classList.add('closing');
        setTimeout(() => overlay.style.display = 'none', 500);
    });
}

// ════════════════════════════════════════════════════════════════════
// SONIDOS AMBIENTALES — Web Audio API
// ════════════════════════════════════════════════════════════════════
const AmbientAudio = (() => {
    let ctx = null, masterGain = null, activeNodes = [], currentMood = null;

    function initCtx() {
        if (ctx) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);
    }

    function createNoiseBuffer() {
        const sr  = ctx.sampleRate;
        const buf = ctx.createBuffer(2, sr * 4, sr);
        for (let ch = 0; ch < 2; ch++) {
            const d = buf.getChannelData(ch);
            let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
            for (let i = 0; i < d.length; i++) {
                const w = Math.random()*2-1;
                b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
                b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
                b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
                d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.10; b6=w*0.115926;
            }
        }
        return buf;
    }

    function playMood(mood) {
        if (mood === currentMood) { stop(); return; }
        stop();
        currentMood = mood;
        initCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const buf    = createNoiseBuffer();
        const src    = ctx.createBufferSource();
        src.buffer   = buf; src.loop = true;

        const filt   = ctx.createBiquadFilter();
        const gNode  = ctx.createGain();

        if (mood === 'bosque') {
            filt.type = 'lowpass';  filt.frequency.value = 700;  filt.Q.value = 0.5; gNode.gain.value = 0.38;
        } else if (mood === 'costa') {
            filt.type = 'bandpass'; filt.frequency.value = 350;  filt.Q.value = 0.3; gNode.gain.value = 0.30;
        } else {
            filt.type = 'highpass'; filt.frequency.value = 1400; filt.Q.value = 0.4; gNode.gain.value = 0.20;
        }

        src.connect(filt); filt.connect(gNode); gNode.connect(masterGain);
        src.start();
        activeNodes = [src, filt, gNode];
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
        updateSoundUI();
    }

    function stop() {
        if (!ctx || !masterGain) return;
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        setTimeout(() => {
            activeNodes.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch(e){} });
            activeNodes = [];
        }, 1600);
        currentMood = null;
        updateSoundUI();
    }

    function updateSoundUI() {
        document.querySelectorAll('.sound-btn').forEach(b => b.classList.toggle('active', b.dataset.mood === currentMood));
        const tog = document.getElementById('soundToggle');
        if (tog) {
            tog.classList.toggle('sound-on', !!currentMood);
            const labels = { bosque:'Bosque Sur', costa:'Costa Chiloé', altura:'Cordillera' };
            tog.title = currentMood ? `Sonido: ${labels[currentMood]}` : 'Sonidos ambientales';
        }
    }

    function init() {
        const tog   = document.getElementById('soundToggle');
        const panel = document.getElementById('soundPanel');
        const stopB = document.getElementById('soundStop');
        if (!tog || !panel) return;

        tog.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('open'); });
        stopB?.addEventListener('click', () => { stop(); panel.classList.remove('open'); });
        panel.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', () => { playMood(btn.dataset.mood); panel.classList.remove('open'); });
        });
        document.addEventListener('click', e => {
            if (!e.target.closest('#soundToggle') && !e.target.closest('#soundPanel'))
                panel.classList.remove('open');
        });
    }

    return { init, playMood, stop };
})();

// ── A4: Bottom Sheet swipe-to-dismiss ──
function initBottomSheetGestures() {
    const modal = document.getElementById('detailModal');
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    if (!content) return;

    let startY = 0, startScrollTop = 0, dragging = false;

    content.addEventListener('touchstart', e => {
        if (window.innerWidth > 767) return;
        startY = e.touches[0].clientY;
        startScrollTop = content.scrollTop;
        dragging = true;
    }, { passive: true });

    content.addEventListener('touchmove', e => {
        if (!dragging || window.innerWidth > 767) return;
        const dy = e.touches[0].clientY - startY;
        // Only drag when scrolled to top and pulling down
        if (dy > 0 && content.scrollTop <= 0) {
            content.style.transform = `translateY(${Math.min(dy * 0.55, 180)}px)`;
            content.style.transition = 'none';
        }
    }, { passive: true });

    content.addEventListener('touchend', e => {
        if (!dragging || window.innerWidth > 767) return;
        dragging = false;
        const dy = e.changedTouches[0].clientY - startY;
        content.style.transition = '';
        if (dy > 100 && content.scrollTop <= 0) {
            content.classList.add('sheet-dismissing');
            setTimeout(() => {
                content.classList.remove('sheet-dismissing');
                content.style.transform = '';
                cerrarModal();
            }, 260);
        } else {
            content.style.transform = '';
        }
    }, { passive: true });
}

// ── A1: Global Search Overlay ──
let _gsoSelectedIdx = -1;

function abrirGlobalSearch() {
    const overlay = document.getElementById('globalSearchOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    const input = document.getElementById('gsoInput');
    if (input) { input.value = ''; input.focus(); }
    _gsoSelectedIdx = -1;
    renderGsoResults('');
}

function cerrarGlobalSearch() {
    const overlay = document.getElementById('globalSearchOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
}

function renderGsoResults(q) {
    const container = document.getElementById('gsoResults');
    if (!container) return;
    const query = q.trim().toLowerCase();

    if (!query) { container.innerHTML = ''; return; }

    const plantas = (plantasDB || []).filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        (p.cientifico || '').toLowerCase().includes(query) ||
        (p.usos || '').toLowerCase().includes(query) ||
        (p.keywords || []).some(k => k.toLowerCase().includes(query))
    ).slice(0, 6);

    const recetas = (recetasDB || []).filter(r =>
        r.titulo.toLowerCase().includes(query) ||
        (r.categoria || '').toLowerCase().includes(query) ||
        (r.ingredientes || '').toLowerCase().includes(query)
    ).slice(0, 5);

    if (!plantas.length && !recetas.length) {
        container.innerHTML = `<div class="gso-no-results">Sin resultados para <strong>"${q.trim()}"</strong></div>`;
        return;
    }

    let html = '';
    if (plantas.length) {
        html += `<div class="gso-section-label"><i class="fas fa-seedling"></i> Plantas</div>`;
        html += plantas.map((p, i) => `
            <div class="gso-item" role="option" data-gso-type="planta" data-gso-id="${p.id}" tabindex="-1">
                ${p.imagen ? `<img class="gso-item-img" src="${p.imagen}" alt="${p.nombre}" loading="lazy">` : `<span class="gso-item-emoji">${p.emoji || '🌿'}</span>`}
                <div>
                    <div class="gso-item-name">${p.nombre}</div>
                    <div class="gso-item-sub">${p.cientifico || ''}</div>
                </div>
                <span class="gso-item-badge gso-badge-planta">Planta</span>
            </div>`).join('');
    }
    if (recetas.length) {
        html += `<div class="gso-section-label"><i class="fas fa-mortar-pestle"></i> Recetas</div>`;
        html += recetas.map(r => `
            <div class="gso-item" role="option" data-gso-type="receta" data-gso-id="${r.id}" tabindex="-1">
                <span class="gso-item-emoji">🫙</span>
                <div>
                    <div class="gso-item-name">${r.titulo}</div>
                    <div class="gso-item-sub">${r.categoria || ''}</div>
                </div>
                <span class="gso-item-badge gso-badge-receta">Receta</span>
            </div>`).join('');
    }

    container.innerHTML = html;
    _gsoSelectedIdx = -1;

    container.querySelectorAll('.gso-item').forEach(item => {
        item.addEventListener('click', () => _gsoNavigateTo(item));
    });
}

function _gsoNavigateTo(item) {
    const type = item.dataset.gsoType;
    const id   = parseInt(item.dataset.gsoId, 10);
    cerrarGlobalSearch();
    if (type === 'planta') {
        cambiarTab('plants');
        setTimeout(() => abrirDetallePlanta(id), 120);
    } else if (type === 'receta') {
        cambiarTab('recipes');
        setTimeout(() => abrirDetalleReceta(id), 250);
    }
}

function _gsoMoveSelection(dir) {
    const items = [...document.querySelectorAll('#gsoResults .gso-item')];
    if (!items.length) return;
    items.forEach(i => i.classList.remove('selected'));
    _gsoSelectedIdx = Math.max(0, Math.min(items.length - 1, _gsoSelectedIdx + dir));
    items[_gsoSelectedIdx].classList.add('selected');
    items[_gsoSelectedIdx].scrollIntoView({ block: 'nearest' });
}

function initGlobalSearch() {
    const overlay  = document.getElementById('globalSearchOverlay');
    const backdrop = document.getElementById('gsoBackdrop');
    const closeBtn = document.getElementById('gsoClose');
    const input    = document.getElementById('gsoInput');
    if (!overlay || !input) return;

    backdrop?.addEventListener('click', cerrarGlobalSearch);
    closeBtn?.addEventListener('click', cerrarGlobalSearch);

    input.addEventListener('input', () => renderGsoResults(input.value));

    input.addEventListener('keydown', e => {
        if (e.key === 'Escape') { cerrarGlobalSearch(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); _gsoMoveSelection(1); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); _gsoMoveSelection(-1); return; }
        if (e.key === 'Enter') {
            const sel = document.querySelector('#gsoResults .gso-item.selected');
            if (sel) _gsoNavigateTo(sel);
        }
    });

    // Global keyboard shortcut: '/' opens overlay (when not typing in an input)
    document.addEventListener('keydown', e => {
        if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
            // Skip if already on plants tab (the main search input handles it there)
            const activeTab = document.querySelector('.tab-btn.active')?.dataset?.tab;
            if (activeTab && activeTab !== 'plants') {
                e.preventDefault();
                abrirGlobalSearch();
            }
        }
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            cerrarGlobalSearch();
        }
    });
}

// ── View sort helper (called from renderPlantas) ──
function getSortedPlantas(lista) {
    const sortSelect = document.getElementById('sortSelect');
    const sort = sortSelect?.value || 'default';
    const mes = new Date().getMonth() + 1;
    const sorted = [...lista];
    if (sort === 'temporada') {
        sorted.sort((a, b) => {
            const aT = a.meses && a.meses.includes(mes) ? 0 : 1;
            const bT = b.meses && b.meses.includes(mes) ? 0 : 1;
            return aT - bT || a.nombre.localeCompare(b.nombre);
        });
    } else if (sort === 'precaucion') {
        sorted.sort((a, b) => {
            const aP = a.peligroso ? 1 : 0;
            const bP = b.peligroso ? 1 : 0;
            return aP - bP || a.nombre.localeCompare(b.nombre);
        });
    } else if (sort === 'chiloe') {
        sorted.sort((a, b) => {
            const aC = a.chiloe ? 0 : 1;
            const bC = b.chiloe ? 0 : 1;
            return aC - bC || a.nombre.localeCompare(b.nombre);
        });
    } else {
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }
    return sorted;
}


// ════════════════════════════════════════════════════════════════════
// HOMEPAGE — Hero CTAs, Access cards, Atlas Chile, Calendario, Reveal
// ════════════════════════════════════════════════════════════════════

// Animated stats counters in the hero
function renderHomeHero() {
    const hero = document.getElementById('homeHero');
    if (!hero) return;
    // Update targets to live counts
    const nP = (window.plantasDB || []).length || 85;
    const nR = (window.recetasDB || []).length || 1058;
    const stats = hero.querySelectorAll('.hh-stat-num[data-target]');
    if (stats[0]) stats[0].dataset.target = nP;
    if (stats[1]) stats[1].dataset.target = nR;
    // Counter animation — only animate once, never reset to 0
    if (!hero.dataset.heroAnimated) {
        hero.dataset.heroAnimated = '1';
        stats.forEach(el => {
            const target = +el.dataset.target;
            const steps = 36;
            let step = 0;
            const start = +el.textContent.replace(/\D/g, '') || target;
            const tick = () => {
                step++;
                const p = step / steps;
                const ease = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(start + (target - start) * ease).toLocaleString('es-CL');
                if (step < steps) setTimeout(tick, 28);
            };
            setTimeout(tick, 400);
        });
    }

    // CTAs
    const explore = document.getElementById('hhExploreBtn');
    explore?.addEventListener('click', () => {
        cambiarTab('plants');
    });

    const random = document.getElementById('hhRandomBtn');
    random?.addEventListener('click', () => {
        const list = window.plantasDB || [];
        if (!list.length) return;
        const p = list[Math.floor(Math.random() * list.length)];
        if (typeof abrirDetallePlanta === 'function') abrirDetallePlanta(p.id);
    });

    // Subtle parallax on hero SVG layers
    const svg = hero.querySelector('.hh-svg');
    if (svg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const y = Math.min(window.scrollY, 600);
                svg.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
                raf = null;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }
}

// Acceso rápido cards → cambian de tab
function wireHomeAccess() {
    document.querySelectorAll('.ha-card').forEach(card => {
        card.addEventListener('click', () => {
            const tab = card.dataset.targetTab;
            const action = card.dataset.action;
            if (action === 'scroll-plants') {
                cambiarTab('plants');
                return;
            }
            if (tab && typeof cambiarTab === 'function') {
                cambiarTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// ── REVEAL ON SCROLL ──
function setupHomeReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('is-revealed'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('is-revealed');
                io.unobserve(en.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach(e => io.observe(e));
}

// ── Categorías medicinales — navegación ──
function wireCategorias() {
    document.querySelectorAll('.hcat-card').forEach(card => {
        card.addEventListener('click', () => {
            const tab = card.dataset.gotoTab;
            const sistema = card.dataset.gotoSistema;
            const filter = card.dataset.gotoFilter;

            if (tab) {
                cambiarTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            if (filter === 'chiloe') {
                filtroChiloe = true;
                document.getElementById('filterChiloe')?.classList.add('active');
                actualizarBtnReset();
                renderPlantas();
                cambiarTab('plants');
                return;
            }
            if (sistema) {
                cambiarTab('recipes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Open the matching accordion after a short delay
                setTimeout(() => {
                    const acc = document.querySelector(`.acc-trigger[data-sistema="${sistema}"]`);
                    if (acc) acc.click();
                }, 350);
                return;
            }
        });
    });
}

// Bootstrap home — call after DB loaded
function initHomepage() {
    renderHomeHero();
    wireHomeAccess();
    wireCategorias();
    setupHomeReveal();
}

// Patch initialisation: call initHomepage after DB load (added to existing renderSearchHero call site)
const _origRenderSearchHero = typeof renderSearchHero === 'function' ? renderSearchHero : null;
if (_origRenderSearchHero) {
    window._initHomeOnce = false;
    const wrap = function() {
        try { _origRenderSearchHero.apply(null, arguments); } catch(e){ console.warn(e); }
        if (!window._initHomeOnce) { window._initHomeOnce = true; initHomepage(); }
    };
    // Override
    window.renderSearchHero = wrap;
}
