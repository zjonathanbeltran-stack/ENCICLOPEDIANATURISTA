// ── Enciclopedia Naturista de Chile — Service Worker ──
const CACHE_NAME = 'naturista-v8';

// Archivos locales pre-cacheados en install (app funciona sin internet)
const PRECACHE_LOCAL = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './illustrations.js',
    './manifest.json',
    './data/plantas.json',
    './data/recetas.json',
    // Módulos raíz
    './data/modulos/cardiovascular.json',
    './data/modulos/digestivo.json',
    './data/modulos/dolores.json',
    './data/modulos/general.json',
    './data/modulos/inmunidad.json',
    './data/modulos/mapuche.json',
    './data/modulos/mujer.json',
    './data/modulos/nervioso.json',
    './data/modulos/pediatrico.json',
    './data/modulos/piel.json',
    './data/modulos/respiratorio.json',
    // Submódulos cardiovascular
    './data/modulos/cardiovascular/circulacion_varices/recetas.json',
    './data/modulos/cardiovascular/colesterol/recetas.json',
    './data/modulos/cardiovascular/diuretico/recetas.json',
    './data/modulos/cardiovascular/palpitaciones_corazon/recetas.json',
    './data/modulos/cardiovascular/presion_arterial/recetas.json',
    './data/modulos/cardiovascular/rinones/recetas.json',
    './data/modulos/cardiovascular/sangre_antioxidantes/recetas.json',
    // Submódulos digestivo
    './data/modulos/digestivo/colicos_gases/recetas.json',
    './data/modulos/digestivo/diarrea/recetas.json',
    './data/modulos/digestivo/digestion_lenta/recetas.json',
    './data/modulos/digestivo/estrenimiento/recetas.json',
    './data/modulos/digestivo/gastritis_acidez/recetas.json',
    './data/modulos/digestivo/higado_vesicula/recetas.json',
    './data/modulos/digestivo/nauseas_indigestion/recetas.json',
    './data/modulos/digestivo/nutricion/recetas.json',
    './data/modulos/digestivo/parasitos/recetas.json',
    // Submódulos dolores
    './data/modulos/dolores/antiinflamatorio/recetas.json',
    './data/modulos/dolores/dolor_cabeza_migrana/recetas.json',
    './data/modulos/dolores/dolor_cronico_general/recetas.json',
    './data/modulos/dolores/dolor_muscular_lumbago/recetas.json',
    './data/modulos/dolores/reumatismo_artritis/recetas.json',
    './data/modulos/dolores/salud_bucal/recetas.json',
    // Submódulos general
    './data/modulos/general/alergia/recetas.json',
    './data/modulos/general/bienestar_general/recetas.json',
    './data/modulos/general/energizante_vitalidad/recetas.json',
    './data/modulos/general/ojos_oidos/recetas.json',
    // Submódulos mapuche
    './data/modulos/mapuche/espiritual_ritual/recetas.json',
    './data/modulos/mapuche/medicina_mapuche/recetas.json',
    // Submódulos mujer
    './data/modulos/mujer/menopausia/recetas.json',
    './data/modulos/mujer/menstruacion_spm/recetas.json',
    './data/modulos/mujer/postparto_lactancia/recetas.json',
    './data/modulos/mujer/salud_ginecologica/recetas.json',
    // Submódulos nervioso
    './data/modulos/nervioso/animo_depresion/recetas.json',
    './data/modulos/nervioso/estres_ansiedad/recetas.json',
    './data/modulos/nervioso/insomnio/recetas.json',
    './data/modulos/nervioso/memoria_concentracion/recetas.json',
    // Submódulos pediátrico
    './data/modulos/pediatrico/colicos_digestion/recetas.json',
    './data/modulos/pediatrico/fiebre_resfriado/recetas.json',
    './data/modulos/pediatrico/nervioso_sueno/recetas.json',
    './data/modulos/pediatrico/piel_cuidado/recetas.json',
    // Submódulos piel
    './data/modulos/piel/banos_terapeuticos/recetas.json',
    './data/modulos/piel/cabello/recetas.json',
    './data/modulos/piel/cosmetica_piel/recetas.json',
    './data/modulos/piel/heridas_cicatrices/recetas.json',
    './data/modulos/piel/hongos_infecciones/recetas.json',
    './data/modulos/piel/problemas_piel/recetas.json',
    // Submódulos respiratorio
    './data/modulos/respiratorio/bronquitis_expectorante/recetas.json',
    './data/modulos/respiratorio/congestion_sinusitis/recetas.json',
    './data/modulos/respiratorio/fiebre/recetas.json',
    './data/modulos/respiratorio/garganta_faringitis/recetas.json',
    './data/modulos/respiratorio/gripe_resfrios/recetas.json',
    './data/modulos/respiratorio/respiratorio_general/recetas.json',
    './data/modulos/respiratorio/tos/recetas.json',
    // Íconos
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png',
];

// Assets externos cacheados en caliente (fuentes, iconos CDN)
const CDN_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// Install — pre-cachear todos los archivos locales
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            // Pre-cache local (crítico) + CDN (best-effort)
            cache.addAll(PRECACHE_LOCAL)
                .then(() => cache.addAll(CDN_ASSETS).catch(() => {}))
        ).then(() => self.skipWaiting())
    );
});

// Activate — limpiar cachés viejos
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch strategy:
//   • Archivos locales → cache first (app funciona offline)
//   • CDN externo      → stale-while-revalidate
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Solo GET
    if (e.request.method !== 'GET') return;

    // CDN externo: stale-while-revalidate
    if (url.origin !== location.origin) {
        e.respondWith(
            caches.match(e.request).then(cached => {
                const fresh = fetch(e.request).then(res => {
                    if (res.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
                    return res;
                }).catch(() => cached);
                return cached || fresh;
            })
        );
        return;
    }

    // Archivos locales: cache first → network fallback → actualiza caché en segundo plano
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fetchPromise = fetch(e.request).then(res => {
                if (res.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
                return res;
            }).catch(() => null);

            // Si está en caché, devolver inmediatamente (offline-first)
            // Si no está, esperar la red
            return cached || fetchPromise;
        })
    );
});
