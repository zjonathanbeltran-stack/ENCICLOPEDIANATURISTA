"""
partir_recetas.py
Divide data/recetas.json en 10 módulos bajo data/modulos/
Normaliza categorías duplicadas (sin tilde → con tilde) en el proceso.
"""
import json, os, pathlib, unicodedata

# ── Normalización de categorías duplicadas ──────────────────────────────────
NORMALIZAR = {
    'Ginecologico':  'Ginecológico',
    'Dermatologico': 'Dermatológico',
    'Analgesico':    'Analgésico',
    'Febrifugo':     'Febrífugo',
    'Bano':          'Baño',
    'Oftalmologico': 'Oftalmológico',
    'Cosmetico':     'Cosmético',
}

# ── Mapa módulo → categorías ────────────────────────────────────────────────
MODULOS = {
    'mapuche': {
        'label': 'Mapuche',
        'cats': ['Medicina Mapuche', 'Espiritual'],
    },
    'digestivo': {
        'label': 'Digestivo',
        'cats': ['Digestivo', 'Hepático', 'Diarrea', 'Antiparasitario', 'Nutritivo', 'Alimenticio'],
    },
    'respiratorio': {
        'label': 'Respiratorio',
        'cats': ['Respiratorio', 'Tos', 'Expectorante', 'Resfriados', 'Garganta', 'Febrífugo'],
    },
    'nervioso': {
        'label': 'Nervioso',
        'cats': ['Nervioso', 'Sedante', 'Memoria'],
    },
    'piel': {
        'label': 'Piel',
        'cats': ['Dermatológico', 'Cicatrizante', 'Cosmético', 'Cabello', 'Baño', 'Antifúngico'],
    },
    'mujer': {
        'label': 'Mujer',
        'cats': ['Ginecológico'],
    },
    'cardiovascular': {
        'label': 'Cardiovascular',
        'cats': ['Cardiovascular', 'Renal', 'Diurético'],
    },
    'dolores': {
        'label': 'Dolores',
        'cats': ['Analgésico', 'Antiinflamatorio', 'Reumatismo', 'Dental'],
    },
    'pediatrico': {
        'label': 'Pediátrico',
        'cats': ['Pediátrico'],
    },
    'general': {
        'label': 'General',
        'cats': ['Energizante', 'General', 'Alergia', 'Oftalmológico', 'Oídos'],
    },
}

# ── Cargar fuente ───────────────────────────────────────────────────────────
src = pathlib.Path('data/recetas.json')
recetas = json.loads(src.read_text(encoding='utf-8'))
print(f'Total recetas cargadas: {len(recetas)}')

# Normalizar categorías
for r in recetas:
    cat = r.get('categoria', '')
    if cat in NORMALIZAR:
        r['categoria'] = NORMALIZAR[cat]

# ── Construir índice cat → módulo ───────────────────────────────────────────
cat_a_modulo = {}
for mod_id, mod in MODULOS.items():
    for cat in mod['cats']:
        cat_a_modulo[cat] = mod_id

# ── Partir ─────────────────────────────────────────────────────────────────
out_dir = pathlib.Path('data/modulos')
out_dir.mkdir(parents=True, exist_ok=True)

buckets = {mod_id: [] for mod_id in MODULOS}
sin_modulo = []

for r in recetas:
    cat = r.get('categoria', '')
    mod_id = cat_a_modulo.get(cat)
    if mod_id:
        buckets[mod_id].append(r)
    else:
        sin_modulo.append(r)

# Recetas sin módulo van a 'general'
for r in sin_modulo:
    buckets['general'].append(r)
    print(f'  [general fallback] id={r["id"]} cat="{r.get("categoria","")}" titulo="{r.get("titulo","")[:50]}"')

# ── Escribir archivos ───────────────────────────────────────────────────────
total_escritas = 0
for mod_id, lista in buckets.items():
    out_path = out_dir / f'{mod_id}.json'
    out_path.write_text(
        json.dumps(lista, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )
    total_escritas += len(lista)
    print(f'  data/modulos/{mod_id}.json -> {len(lista)} recetas  ({MODULOS[mod_id]["label"]})')

print(f'\nTotal escrito: {total_escritas} (original: {len(recetas)})')
assert total_escritas == len(recetas), '¡Error! El total no cuadra.'
print('✓ Partición correcta — todos los módulos suman el total original.')

# ── Generar modulos_index.json (meta para el JS) ────────────────────────────
index = {
    mod_id: {
        'label': mod['label'],
        'cats':  mod['cats'],
        'file':  f'data/modulos/{mod_id}.json',
        'count': len(buckets[mod_id]),
    }
    for mod_id, mod in MODULOS.items()
}
(pathlib.Path('data') / 'modulos_index.json').write_text(
    json.dumps(index, ensure_ascii=False, indent=2),
    encoding='utf-8'
)
print('✓ data/modulos_index.json generado.')
