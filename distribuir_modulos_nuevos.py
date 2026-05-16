"""
Distribuye las 89 recetas nuevas de MODULOS NUEVOS (que están en recetas.json
pero no en data/modulos/*.json) a los archivos modulares correctos.
Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

RECETAS_JSON = 'data/recetas.json'
MODULOS_DIR  = 'data/modulos'

# Mapeo categoría → archivo modular
CAT_A_MODULO = {
    'Sedante':       'nervioso.json',
    'Memoria':       'nervioso.json',
    'Nervioso':      'nervioso.json',
    'Analgésico':    'dolores.json',
    'Antiinflamatorio': 'dolores.json',
    'Reumatismo':    'dolores.json',
    'Dental':        'dolores.json',
    'Respiratorio':  'respiratorio.json',
    'Tos':           'respiratorio.json',
    'Expectorante':  'respiratorio.json',
    'Resfriados':    'respiratorio.json',
    'Garganta':      'respiratorio.json',
    'Febrífugo':     'respiratorio.json',
    'Ginecológico':  'mujer.json',
    'Cosmético':     'piel.json',
    'Dermatológico': 'piel.json',
    'Cicatrizante':  'piel.json',
    'Cabello':       'piel.json',
    'General':       'general.json',
    'Energizante':   'general.json',
    'Alergia':       'general.json',
    'Cardiovascular':'cardiovascular.json',
    'Diurético':     'cardiovascular.json',
    'Renal':         'cardiovascular.json',
    'Digestivo':     'digestivo.json',
    'Hepático':      'digestivo.json',
    'Diarrea':       'digestivo.json',
    'Nutritivo':     'digestivo.json',
    'Pediátrico':    'pediatrico.json',
    'Medicina Mapuche': 'mapuche.json',
    'Espiritual':    'mapuche.json',
}

# Cargar recetas.json
recetas = json.load(open(RECETAS_JSON, encoding='utf-8'))

# Construir set de IDs ya en módulos
ids_en_modulos = set()
modulo_data = {}

for fname in os.listdir(MODULOS_DIR):
    if not fname.endswith('.json') or not os.path.isfile(f'{MODULOS_DIR}/{fname}'):
        continue
    data = json.load(open(f'{MODULOS_DIR}/{fname}', encoding='utf-8'))
    modulo_data[fname] = data
    for r in data:
        ids_en_modulos.add(r['id'])

# Identificar las 89 recetas nuevas
nuevas = [r for r in recetas if r['id'] not in ids_en_modulos]
print(f'Recetas nuevas a distribuir: {len(nuevas)}')

# Distribuir por categoría
distribuidas = 0
no_mapeadas = []

for r in nuevas:
    cat = r.get('categoria', 'General')
    fname = CAT_A_MODULO.get(cat)
    if not fname:
        # Fallback: general
        fname = 'general.json'
        print(f'  Sin mapeo para categoría "{cat}" → general.json')
    if fname not in modulo_data:
        modulo_data[fname] = []
    modulo_data[fname].append(r)
    distribuidas += 1
    print(f'  OK: [{cat}] → {fname} | {r["titulo"][:55]}')

# Guardar todos los módulos actualizados
for fname, data in modulo_data.items():
    ruta = f'{MODULOS_DIR}/{fname}'
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'Guardado {fname}: {len(data)} recetas')

print(f'\nTotal distribuidas: {distribuidas}')

# También sincronizar al worktree
WORKTREE = '.claude/worktrees/goofy-leavitt-dbc53f/data/modulos'
if os.path.isdir(WORKTREE):
    import shutil
    for fname in modulo_data:
        src = f'{MODULOS_DIR}/{fname}'
        dst = f'{WORKTREE}/{fname}'
        shutil.copy2(src, dst)
    print(f'Sincronizado al worktree: {WORKTREE}')
else:
    print(f'Worktree no encontrado: {WORKTREE}')
