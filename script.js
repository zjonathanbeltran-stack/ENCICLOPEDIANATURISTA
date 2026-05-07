/* ════════════════════════════════════════════════════════════════════
   ENCICLOPEDIA NATURISTA — script.js
   ════════════════════════════════════════════════════════════════════ */

// ── Estado ──
let plantasDB = [];
let recetasDB = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
let filtroChiloe = false;
let mostrandoFavoritos = false;
let busqueda = '';
let sistemaActivo = null;        // qué sistema está abierto en el hub
let categoriaFiltro = null;       // filtro de subcategoría dentro del sistema

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
    // INMUNO
    { id:'defensas-bajas',      nombre:'Defensas bajas / Inmunidad',        emoji:'🛡', sistema:'inmuno',         keywords:['defensa','inmun','inmunoestimulante','adaptogeno','preventivo','virus'],              cats:['Inmunológico'] },
    { id:'alergias',            nombre:'Alergias',                          emoji:'🌼', sistema:'inmuno',         keywords:['alergia','antihistaminico','rinitis','picazon','histamina'],                         cats:['Inmunológico','Respiratorio'] },
    { id:'fiebre',              nombre:'Fiebre',                            emoji:'🌡', sistema:'inmuno',         keywords:['fiebre','antipiretico','febrifugo','temperatura','sudorif'],                         cats:['Inmunológico','Respiratorio'] },
    // METABÓLICO
    { id:'diabetes',            nombre:'Diabetes (apoyo natural)',           emoji:'🍬', sistema:'metabolico',     keywords:['diabetes','glucosa','hipoglucemi','azucar','glucemiante'],                           cats:['Cardiovascular','Digestivo'] },
    { id:'tiroides',            nombre:'Tiroides',                          emoji:'🦋', sistema:'metabolico',     keywords:['tiroides','hipotiroid','hipertiroid','metabolismo','glandula'],                      cats:['General'] },
    { id:'control-peso',        nombre:'Control de peso',                   emoji:'⚖', sistema:'metabolico',     keywords:['obesidad','adelgaz','metabolismo','lipolitic','peso','grasa'],                       cats:['Digestivo','Energizante'] },
    // PEDIÁTRICO
    { id:'colicos-bebe',        nombre:'Cólicos del bebé',                  emoji:'👶', sistema:'pediatrico',     keywords:['colico','bebe','lactante','infantil','pediatrico'],                                  cats:['Pediátrico'] },
    { id:'fiebre-ninos',        nombre:'Fiebre en niños',                   emoji:'🤒', sistema:'pediatrico',     keywords:['fiebre','nino','pediatrico','infantil','antipiretico'],                              cats:['Pediátrico'] },
    { id:'tos-ninos',           nombre:'Tos en niños',                      emoji:'😮', sistema:'pediatrico',     keywords:['tos','nino','infantil','pediatrico','expectorante'],                                 cats:['Pediátrico'] },
    { id:'denticion',           nombre:'Dentición / Encías inflamadas',     emoji:'🦷', sistema:'pediatrico',     keywords:['diente','encia','denticion','infantil','pediatrico'],                               cats:['Pediátrico','Analgésico'] },
    // ENERGÉTICO
    { id:'fatiga',              nombre:'Fatiga / Cansancio crónico',        emoji:'⚡', sistema:'energetico',     keywords:['fatiga','cansancio','adaptogeno','energizante','tonico','vigor'],                    cats:['Energizante'] },
    { id:'falta-energia',       nombre:'Vitalidad / Falta de energía',      emoji:'🌟', sistema:'energetico',     keywords:['energia','vitalidad','vigor','tonico','energizante','reactivador'],                   cats:['Energizante'] },
    // ANCESTRAL / MAPUCHE
    { id:'purificacion',        nombre:'Purificación / Detox',              emoji:'🌿', sistema:'espiritual',     keywords:['purif','depurat','detox','limpieza','toxina','mapuche'],                            cats:['Medicina Mapuche','General'] },
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

let dolenciaActiva = null;

function normDol(txt) {
    return (txt || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/g, ' ');
}

function recetasParaDolencia(dol) {
    const kws = dol.keywords.map(normDol);
    return recetasDB.filter(r => {
        if (dol.cats.includes(r.categoria)) return true;
        const hay = normDol([r.titulo, r.ingredientes, r.preparacion, r.dosis].join(' '));
        return kws.some(k => hay.includes(k));
    });
}

function renderDolencias() {
    const grid = $('#dolenciasGrid');
    if (!grid) return;
    const inputEl = $('#dolenciasInput');
    const query = normDol(inputEl ? inputEl.value : '');

    const filtradas = query
        ? DOLENCIAS.filter(d =>
            normDol(d.nombre).includes(query) ||
            d.keywords.some(k => k.includes(query)))
        : DOLENCIAS;

    if (filtradas.length === 0) {
        grid.innerHTML = '<p class="dol-empty">No se encontraron dolencias para esa búsqueda.</p>';
        return;
    }

    const grupos = {};
    filtradas.forEach(d => {
        (grupos[d.sistema] = grupos[d.sistema] || []).push(d);
    });

    let html = '';
    SISTEMAS_DOL.forEach(sis => {
        const grupo = grupos[sis.id];
        if (!grupo) return;
        html += `<div class="dol-grupo reveal">
            <div class="dol-grupo-hdr" style="background:${sis.gradient}">
                <span class="dol-grupo-emoji">${sis.emoji}</span>
                <span class="dol-grupo-nombre">${sis.nombre}</span>
            </div>
            <div class="dol-cards">`;
        grupo.forEach(d => {
            const count = recetasParaDolencia(d).length;
            const isActive = dolenciaActiva && dolenciaActiva.id === d.id;
            html += `<button class="dol-card${isActive ? ' active' : ''}" data-dol="${d.id}">
                <span class="dol-card-emoji">${d.emoji}</span>
                <span class="dol-card-nombre">${d.nombre}</span>
                <span class="dol-card-badge">${count}</span>
            </button>`;
        });
        html += '</div></div>';
    });

    grid.innerHTML = html;

    grid.querySelectorAll('.dol-card').forEach(btn => {
        btn.addEventListener('click', () => {
            const d = DOLENCIAS.find(x => x.id === btn.dataset.dol);
            if (d) mostrarResultadosDolencia(d);
        });
    });

    setTimeout(() => applyReveal(document), 40);
}

function mostrarResultadosDolencia(dol) {
    dolenciaActiva = dol;
    $$('.dol-card').forEach(b => b.classList.toggle('active', b.dataset.dol === dol.id));

    const matches = recetasParaDolencia(dol);
    const resultados = $('#dolenciasResultados');
    if (!resultados) return;

    const backBtn = `<button class="dol-back-btn" id="dolBackBtn"><i class="fas fa-arrow-left"></i> Volver</button>`;
    const header = `<div class="dol-res-hdr">
        ${backBtn}
        <div class="dol-res-title-wrap">
            <span class="dol-res-emoji">${dol.emoji}</span>
            <div>
                <h3 class="dol-res-titulo">${dol.nombre}</h3>
                <span class="dol-res-count">${matches.length} receta${matches.length !== 1 ? 's' : ''} encontrada${matches.length !== 1 ? 's' : ''}</span>
            </div>
        </div>
    </div>`;

    let cardsHtml = '';
    if (matches.length === 0) {
        cardsHtml = '<p class="dol-empty">No encontramos recetas específicas. Intenta buscar en el Recetario.</p>';
    } else {
        cardsHtml = '<div class="dol-recetas-grid">';
        matches.slice(0, 60).forEach(r => {
            const ing = (r.ingredientes || '').substring(0, 90);
            const ingCorto = r.ingredientes && r.ingredientes.length > 90 ? ing + '…' : ing;
            const usoText = CATEGORIA_USO[r.categoria] || '';
            cardsHtml += `<div class="dol-receta-card" data-rid="${r.id}">
                <div class="dol-receta-cat" style="background:${gradFromCat(r.categoria)}">${r.categoria}</div>
                <h4 class="dol-receta-titulo">${r.titulo}</h4>
                ${usoText ? `<p class="dol-receta-uso"><i class="fas fa-bullseye"></i> ${usoText}</p>` : ''}
                <p class="dol-receta-ing"><i class="fas fa-leaf"></i> ${ingCorto}</p>
                <div class="dol-receta-meta">
                    <span><i class="fas fa-clock"></i> ${r.tiempo_prep || '—'}</span>
                    <span><i class="fas fa-signal"></i> ${r.dificultad || '—'}</span>
                </div>
                <button class="dol-ver-btn" data-rid="${r.id}">Ver receta <i class="fas fa-arrow-right"></i></button>
            </div>`;
        });
        cardsHtml += '</div>';
        if (matches.length > 60) {
            cardsHtml += `<p class="dol-mas">Mostrando 60 de ${matches.length} recetas. Afina la búsqueda para ver más.</p>`;
        }
    }

    resultados.innerHTML = header + cardsHtml;
    resultados.style.display = 'block';

    setTimeout(() => resultados.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);

    $('#dolBackBtn').addEventListener('click', cerrarResultadosDolencia);
    resultados.addEventListener('click', (e) => {
        const card = e.target.closest('[data-rid]');
        if (!card) return;
        abrirDetalleReceta(parseInt(card.dataset.rid));
    });
}

function cerrarResultadosDolencia() {
    dolenciaActiva = null;
    const r = $('#dolenciasResultados');
    if (r) { r.style.display = 'none'; r.innerHTML = ''; }
    $$('.dol-card').forEach(b => b.classList.remove('active'));
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
    $$('.matern-btn').forEach(b => b.classList.toggle('active', b.dataset.matern === tipo));
    $('#maternEmbarazo').classList.toggle('active', tipo === 'embarazo');
    $('#maternLactancia').classList.toggle('active', tipo === 'lactancia');
    // Update hero icon
    const icon = $('#maternidadTab .matern-hero-icon');
    if (icon) icon.textContent = tipo === 'lactancia' ? '🍼' : '🤰';
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
// PLANTAS
// ════════════════════════════════════════════════════════════════════
const plantListDiv = $('#plantList');

function renderPlantas() {
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
            <div class="empty">
                <span class="icon">🌿</span>
                <p class="empty-title">Aún no tienes favoritas</p>
                <p class="empty-sub">Explora el catálogo y guarda las plantas que más usas<br>tocando el <i class="fas fa-bookmark"></i> en cada tarjeta.</p>
                <button class="empty-cta" id="emptyFavBtn"><i class="fas fa-seedling"></i> Explorar plantas</button>
            </div>`;
            document.getElementById('emptyFavBtn')?.addEventListener('click', () => {
                mostrandoFavoritos = false;
                $('#filterFav').classList.remove('active');
                renderPlantas();
            });
        } else {
            plantListDiv.innerHTML = `
            <div class="empty">
                <span class="icon">🔍</span>
                <p class="empty-title">Sin resultados</p>
                <p class="empty-sub">No encontramos plantas con ese criterio.<br>Prueba con otro término o quita los filtros activos.</p>
                <button class="empty-cta" id="emptySearchBtn"><i class="fas fa-times-circle"></i> Limpiar filtros</button>
            </div>`;
            document.getElementById('emptySearchBtn')?.addEventListener('click', () => {
                busqueda = '';
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
        return `
        <div class="plant-card reveal${enTemporada ? ' planta-temporada' : ''}${p.peligroso ? ' peligrosa' : ''}" data-id="${p.id}">
            <div class="plant-img-wrap">
                ${p.imagen
                    ? `<img src="${p.imagen}" alt="${p.nombre}" class="plant-img" loading="lazy" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden')">`
                    : ''}
                <div class="photo-placeholder${p.imagen ? ' hidden' : ''}">${placeholderContent}</div>
                ${tieneNota ? '<span class="card-note-dot" title="Tienes una nota guardada">✏️</span>' : ''}
            </div>
            <div class="plant-name">${p.nombre}</div>
            <div class="plant-sci">${p.cientifico}</div>
            <div class="plant-badges">
                ${p.chiloe ? '<span class="badge chiloe">📍 Chiloé</span>' : ''}
                ${p.protegida ? '<span class="badge shield">🛡️ Protegida</span>' : ''}
                ${p.peligroso ? '<span class="badge warn">⚠️ Precaución</span>' : ''}
            </div>
            <div class="plant-uso-preview">${usoCorto}</div>
            <button class="fav-btn ${favoritos.includes(p.id) ? 'active' : ''}" data-id="${p.id}" title="Favorito">
                <i class="fas fa-bookmark"></i>
            </button>
            <div class="card-hover-overlay">
                <div class="card-hover-uso">${usoCorto}</div>
                <div class="card-hover-cta"><i class="fas fa-arrow-right"></i> Ver detalle</div>
            </div>
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

function abrirDetallePlanta(id) {
    const p = plantasDB.find(p => p.id === id);
    if (!p) return;
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
            // Ir a Recetario y filtrar por nombre de la planta
            cambiarTab('recipes');
            // Si hay un sistema activo de antes, volver al hub
            volverAlHub();
            // Buscar recetas con esta planta
            busqueda = p.nombre;
            $('#searchInput').value = p.nombre;
            // Abrir el primer sistema que tenga recetas
            const primerCat = recetasDeEstaPlanta[0].categoria;
            const sisDest = sistemaDeCategoria(primerCat);
            if (sisDest) setTimeout(() => abrirSistema(sisDest.id), 200);
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

    // ── Web Share API ──
    const shareBtn = document.getElementById('modalShareBtn');
    if (shareBtn) {
        if (navigator.share) {
            shareBtn.style.display = 'flex';
            shareBtn.onclick = () => {
                navigator.share({
                    title: `${p.nombre} — Enciclopedia Naturista de Chile`,
                    text: `${p.nombre} (${p.cientifico}): ${(p.usos || '').split('.')[0]}.`,
                    url: window.location.href
                }).catch(() => {});
            };
        } else {
            // Fallback: copy to clipboard
            shareBtn.style.display = 'flex';
            shareBtn.title = 'Copiar enlace';
            shareBtn.innerHTML = '<i class="fas fa-link"></i>';
            shareBtn.onclick = () => {
                const text = `${p.nombre} (${p.cientifico}) — ${(p.usos || '').split('.')[0]}`;
                navigator.clipboard?.writeText(text).then(() => {
                    mostrarToast('<i class="fas fa-check"></i> Información copiada', 'ok');
                }).catch(() => {});
            };
        }
    }

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

// Estado por fila de accordion: { sisId -> categoriaFiltro }
const accCatFiltros = {};

function renderSystemHub() {
    const accordion = $('#systemAccordion');
    if (!accordion) return;

    accordion.innerHTML = SISTEMAS.map((sis, idx) => {
        const count = recetasDB.filter(r => sis.cats.includes(r.categoria)).length;
        if (count === 0) return '';

        // Extraer colores representativos del gradiente para stripe e icono
        return `
            <div class="acc-row reveal" data-system="${sis.id}" style="--reveal-delay:${idx * 50}ms">
                <button class="acc-trigger" aria-expanded="false" aria-controls="acc-panel-${sis.id}" style="--_grad: ${sis.gradient};">
                    <div class="acc-stripe" style="background: ${sis.gradient};"></div>
                    <div class="acc-icon" style="background: ${sis.gradient}; color: rgba(255,255,255,0.92);">
                        ${sis.icon}
                    </div>
                    <div class="acc-info">
                        <div class="acc-name">${sis.nombre}</div>
                        <div class="acc-desc">${sis.descripcion}</div>
                    </div>
                    <div class="acc-count" style="background: ${sis.gradient}; color: rgba(255,255,255,0.9);">${count}</div>
                    <div class="acc-chevron">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </button>
                <div class="acc-panel" id="acc-panel-${sis.id}" role="region">
                    <div class="acc-panel-inner">
                        <div class="acc-cat-filters" data-sis="${sis.id}"></div>
                        <div class="recipes-list" id="recipes-${sis.id}"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Listeners de cada trigger
    accordion.querySelectorAll('.acc-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const row = trigger.closest('.acc-row');
            const sisId = row.dataset.system;
            const isOpen = row.classList.contains('open');

            // Cerrar todos
            accordion.querySelectorAll('.acc-row.open').forEach(r => {
                r.classList.remove('open');
                r.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
            });

            // Abrir el clickeado si estaba cerrado
            if (!isOpen) {
                row.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                sistemaActivo = SISTEMAS.find(s => s.id === sisId);
                categoriaFiltro = accCatFiltros[sisId] || null;
                renderAccordionRecetas(sisId);
                // Scroll suave al trigger
                setTimeout(() => {
                    const top = row.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }, 60);
            } else {
                sistemaActivo = null;
                categoriaFiltro = null;
            }
        });
    });

    applyReveal(accordion);
}

function renderAccordionRecetas(sisId) {
    const sis = SISTEMAS.find(s => s.id === sisId);
    if (!sis) return;

    const catFiltro = accCatFiltros[sisId] || null;
    let lista = recetasDB.filter(r => sis.cats.includes(r.categoria));
    const categoriasUsadas = [...new Set(lista.map(r => r.categoria))];

    // Render filtros de subcategoría
    const filtersEl = document.querySelector(`.acc-cat-filters[data-sis="${sisId}"]`);
    if (filtersEl && filtersEl.childElementCount === 0) {
        // Solo renderizar filtros la primera vez
        filtersEl.innerHTML = `
            <button class="chip ${!catFiltro ? 'active' : ''}" data-cat="">Todas</button>
            ${categoriasUsadas.map(c => {
                const n = lista.filter(r => r.categoria === c).length;
                return `<button class="chip ${catFiltro === c ? 'active' : ''}" data-cat="${c}">${c} <span style="opacity:0.55;font-size:0.7em;">${n}</span></button>`;
            }).join('')}
        `;
        filtersEl.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                filtersEl.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                accCatFiltros[sisId] = chip.dataset.cat || null;
                categoriaFiltro = accCatFiltros[sisId];
                renderAccordionRecetas(sisId);
            });
        });
    } else if (filtersEl) {
        // Actualizar estado active de los chips
        filtersEl.querySelectorAll('.chip').forEach(chip => {
            chip.classList.toggle('active', (chip.dataset.cat || null) === catFiltro);
        });
    }

    // Filtrar por categoría y búsqueda
    if (catFiltro) lista = lista.filter(r => r.categoria === catFiltro);
    if (busqueda) {
        const t = busqueda.toLowerCase();
        lista = lista.filter(r =>
            (r.titulo || '').toLowerCase().includes(t) ||
            (r.ingredientes || '').toLowerCase().includes(t) ||
            (r.preparacion || '').toLowerCase().includes(t) ||
            (r.categoria || '').toLowerCase().includes(t)
        );
    }

    const cont = document.getElementById(`recipes-${sisId}`);
    if (!cont) return;

    if (lista.length === 0) {
        cont.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="icon">📖</div><p>No hay recetas con ese filtro.</p></div>';
        return;
    }

    cont.innerHTML = lista.map(r => `
        <div class="recipe-card reveal" data-id="${r.id}">
            <div class="recipe-art">
                <div class="grad" style="background: ${gradFromCat(r.categoria)};"></div>
                <div class="origin-tag">${r.origen}</div>
                <div class="illus">${ilustracionDeReceta(r)}</div>
            </div>
            <div class="recipe-body">
                <div class="cat-pill">${r.categoria}</div>
                <h3>${r.titulo}</h3>
                ${CATEGORIA_USO[r.categoria] ? `<div class="recipe-uso"><i class="fas fa-bullseye"></i> ${CATEGORIA_USO[r.categoria]}</div>` : ''}
                <div class="ingredients-preview">${r.ingredientes || 'Sin ingredientes registrados'}</div>
                <div class="read-more">Ver receta completa <i class="fas fa-arrow-right"></i></div>
            </div>
        </div>
    `).join('');

    cont.querySelectorAll('.recipe-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        card.addEventListener('click', () => abrirDetalleReceta(id));
    });

    applyReveal(cont);
}

// Compatibilidad: mantener función volverAlHub por si se llama desde abrirDetallePlanta
function volverAlHub() {
    sistemaActivo = null;
    categoriaFiltro = null;
    // Cerrar todos los accordions
    const accordion = $('#systemAccordion');
    if (accordion) {
        accordion.querySelectorAll('.acc-row.open').forEach(r => {
            r.classList.remove('open');
            r.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        });
    }
}

function abrirSistema(sisId) {
    // Redirige a la tab de recetas y abre el accordion del sistema
    cambiarTab('recipes');
    setTimeout(() => {
        const accordion = $('#systemAccordion');
        if (!accordion) return;
        // Cerrar todos primero
        accordion.querySelectorAll('.acc-row.open').forEach(r => {
            r.classList.remove('open');
            r.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        });
        // Abrir el sistema pedido
        const row = accordion.querySelector(`.acc-row[data-system="${sisId}"]`);
        if (!row) return;
        row.classList.add('open');
        row.querySelector('.acc-trigger').setAttribute('aria-expanded', 'true');
        sistemaActivo = SISTEMAS.find(s => s.id === sisId);
        categoriaFiltro = accCatFiltros[sisId] || null;
        renderAccordionRecetas(sisId);
        setTimeout(() => {
            const top = row.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
    }, 60);
}

function renderRecetas() {
    // Ya no se usa directamente; el accordion llama renderAccordionRecetas
    if (sistemaActivo) renderAccordionRecetas(sistemaActivo.id);
}

function abrirDetalleReceta(id) {
    const r = recetasDB.find(r => r.id === id);
    if (!r) return;
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

        <!-- Para qué sirve -->
        ${(CATEGORIA_USO[r.categoria] || r.categoria) ? `
        <div class="receta-para-que">
            <div class="para-que-icon">🎯</div>
            <div class="para-que-body">
                <div class="para-que-label">Para qué sirve</div>
                <div class="para-que-texto">${CATEGORIA_USO[r.categoria] || r.categoria}</div>
            </div>
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

    abrirModal();
}

// ════════════════════════════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════════════════════════════
const modal = $('#detailModal');
function abrirModal() { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }
function cerrarModal() { modal.classList.remove('show'); document.body.style.overflow = ''; }
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
    if (sistemaActivo) renderRecetas();
});

$('#clearSearch').addEventListener('click', () => {
    $('#searchInput').value = '';
    busqueda = '';
    actualizarBtnReset();
    renderPlantas();
    if (sistemaActivo) renderRecetas();
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
    // Scroll active tab button into view (for mobile scrollable nav)
    const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeTabBtn) {
        activeTabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    if (tabId === 'plants') renderPlantas();
    if (tabId === 'stats') renderEstadisticas();
    if (tabId === 'dolencias') {
        dolenciaActiva = null;
        cerrarResultadosDolencia();
        renderDolencias();
    }
    if (tabId === 'maternidad') renderMaternidad();
    setTimeout(() => applyReveal(document), 50);
}

$$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarTab(btn.dataset.tab));
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
}

function actualizarProgreso() {
    const total = plantasDB.length;
    const vistas = plantasVistas.size;
    const pct = total > 0 ? Math.round(vistas / total * 100) : 0;
    const numEl = document.getElementById('progresoNum');
    const barEl = document.getElementById('progresoBar');
    if (numEl) numEl.textContent = `${vistas} / ${total}`;
    if (barEl) barEl.style.width = pct + '%';
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
// INIT
// ════════════════════════════════════════════════════════════════════
async function inicializar() {
    try {
        const [rPlant, rRecet] = await Promise.all([
            fetch('data/plantas.json'),
            fetch('data/recetas.json')
        ]);
        if (!rPlant.ok || !rRecet.ok) throw new Error('No se pudieron cargar los datos.');
        plantasDB = await rPlant.json();
        recetasDB = await rRecet.json();

        renderPlantas();
        renderSystemHub();
        actualizarBtnFavoritos();
        moverIndicador();

        resizeCanvas();
        initParticles();
        startParticles();

        // Nuevas features
        renderPlantaDelDia();
        renderTemporadaBanner();
        actualizarProgreso();
        initAutocompletado();
        initCursor();

        // Chip counts (need data to be loaded first)
        actualizarChipCounts();

        applyReveal(document);
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

    // ── Calendario interactivo de recolección ──
    const MESES_LABEL = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const MESES_FULL  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const mesCount = Array(12).fill(0);
    plantasDB.forEach(p => {
        if (p.meses && p.meses.length) {
            p.meses.forEach(m => { if (m >= 1 && m <= 12) mesCount[m-1]++; });
        }
    });
    const maxMes = Math.max(...mesCount, 1);
    const mesActualStats = new Date().getMonth(); // 0-indexed

    const calEl = document.getElementById('calendarChart');
    if (calEl) {
        calEl.innerHTML = MESES_LABEL.map((mes, i) => `
            <div class="cal-col${i === mesActualStats ? ' cal-actual' : ''}" data-mes="${i+1}" title="${MESES_FULL[i]}: ${mesCount[i]} plantas">
                <span class="cal-count">${mesCount[i]}</span>
                <div class="cal-bar" style="height:${Math.round(mesCount[i]/maxMes*90)}px"></div>
                <span class="cal-label">${mes}</span>
            </div>
        `).join('');

        const calResultEl = document.getElementById('calendarPlantas');
        let mesSeleccionado = mesActualStats + 1; // start with current month

        function mostrarPlantasMes(mesNum) {
            mesSeleccionado = mesNum;
            calEl.querySelectorAll('.cal-col').forEach(col => {
                col.classList.toggle('selected', parseInt(col.dataset.mes) === mesNum);
            });
            const enMes = plantasDB.filter(p => p.meses && p.meses.includes(mesNum));
            if (!calResultEl) return;
            if (!enMes.length) {
                calResultEl.style.display = 'block';
                calResultEl.innerHTML = `<p class="cal-empty">No hay registros de plantas para este mes.</p>`;
                return;
            }
            calResultEl.style.display = 'block';
            calResultEl.innerHTML = `
                <div class="cal-result-header">
                    <span class="cal-result-mes">${MESES_FULL[mesNum-1]}</span>
                    <span class="cal-result-count">${enMes.length} plantas en temporada</span>
                </div>
                <div class="cal-result-chips">
                    ${enMes.map(p => `
                        <button class="cal-planta-chip" data-id="${p.id}">
                            ${p.emoji || '🌿'} <span>${p.nombre}</span>
                        </button>
                    `).join('')}
                </div>
            `;
            calResultEl.querySelectorAll('.cal-planta-chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    cambiarTab('plants');
                    abrirDetallePlanta(parseInt(btn.dataset.id));
                });
            });
        }

        calEl.querySelectorAll('.cal-col').forEach(col => {
            col.addEventListener('click', () => mostrarPlantasMes(parseInt(col.dataset.mes)));
        });
        // Show current month by default
        mostrarPlantasMes(mesActualStats + 1);
    }

    // ── Plantas de tu zona (interactivo) ──
    const regionMap = {};
    plantasDB.forEach(p => {
        const r = (p.region || 'Todo Chile').split(',')[0].split(' y ')[0].trim();
        if (!regionMap[r]) regionMap[r] = [];
        regionMap[r].push(p);
    });
    const regiones = Object.entries(regionMap).sort((a,b) => b[1].length - a[1].length).slice(0, 12);

    const regChartEl = document.getElementById('regionChart');
    const regPlantasEl = document.getElementById('regionPlantas');
    const maxReg = regiones[0]?.[1].length || 1;

    if (regChartEl) {
        regChartEl.innerHTML = regiones.map(([reg, plantas]) => `
            <div class="region-row region-row-btn" data-reg="${reg}" title="Ver las ${plantas.length} plantas de ${reg}">
                <span class="bar-label">${reg}</span>
                <div class="bar-track">
                    <div class="bar-fill" style="width:${Math.round(plantas.length/maxReg*100)}%"></div>
                </div>
                <span class="bar-count">${plantas.length} <i class="fas fa-chevron-right bar-arrow"></i></span>
            </div>
        `).join('');

        regChartEl.querySelectorAll('.region-row-btn').forEach(row => {
            row.addEventListener('click', () => {
                const reg = row.dataset.reg;
                const plantas = regionMap[reg] || [];
                regChartEl.querySelectorAll('.region-row-btn').forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
                if (!regPlantasEl) return;
                regPlantasEl.style.display = 'block';
                regPlantasEl.innerHTML = `
                    <div class="cal-result-header">
                        <span class="cal-result-mes">📍 ${reg}</span>
                        <span class="cal-result-count">${plantas.length} plantas</span>
                    </div>
                    <div class="cal-result-chips">
                        ${plantas.map(p => `
                            <button class="cal-planta-chip" data-id="${p.id}">
                                ${p.emoji || '🌿'} <span>${p.nombre}</span>
                            </button>
                        `).join('')}
                    </div>
                `;
                regPlantasEl.querySelectorAll('.cal-planta-chip').forEach(btn => {
                    btn.addEventListener('click', () => {
                        cambiarTab('plants');
                        abrirDetallePlanta(parseInt(btn.dataset.id));
                    });
                });
                regPlantasEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

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

// ── Dolencias: buscador en tiempo real ──────────────────────────────
(function() {
    const inp = $('#dolenciasInput');
    const clr = $('#dolenciasClear');
    if (!inp) return;
    inp.addEventListener('input', () => {
        if (clr) clr.style.display = inp.value ? 'flex' : 'none';
        cerrarResultadosDolencia();
        renderDolencias();
    });
    if (clr) {
        clr.addEventListener('click', () => {
            inp.value = '';
            clr.style.display = 'none';
            cerrarResultadosDolencia();
            renderDolencias();
        });
    }

    // ── Maternidad subtabs ──
    $$('.matern-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMaternSubtab(btn.dataset.matern));
    });

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
    if (texto) {
        notas[id] = texto;
    } else {
        delete notas[id];
    }
    localStorage.setItem('plantNotas', JSON.stringify(notas));
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
