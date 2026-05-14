"""
crear_condiciones_dolores.py (v2)
91 recetas → 6 condiciones específicas (agrega dolor de cabeza y muscular).
"""
import json, pathlib, shutil

src = pathlib.Path('data/modulos/dolores.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

out_base = pathlib.Path('data/modulos/dolores')
for d in ['reumatismo_artritis','dolor_analgesia','antiinflamatorio','salud_bucal']:
    p = out_base / d
    if p.exists():
        shutil.rmtree(p)

CONDICIONES = {
    'reumatismo_artritis': {
        'condicion': 'Reumatismo / Artritis',
        'modulo': 'dolores',
        'submodulo': 'reumatismo_artritis',
        'emoji': '🦴',
        'descripcion': 'Remedios para artritis, reumatismo, gota y dolor articular crónico.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Sauce blanco, paico y harpagofito están contraindicados en embarazo. Baños tibios y cataplasmas suaves son seguros. Consultar médico.'},
        'ids': [36,39,83,134,135,136,468,469,471,473,474,475,477,478,480,
                481,482,823,824,825,826,827,828,829,830,831,832,833,834,
                835,836,837,965,1063,1074,1090,1092,1095,1099],
        'maternidad_map': {36:'no_recomendada',39:'no_recomendada',83:'advertencia',134:'segura',
            135:'advertencia',136:'segura',468:'segura',469:'segura',471:'segura',
            473:'advertencia',474:'advertencia',475:'segura',477:'no_recomendada',
            478:'no_recomendada',480:'segura',481:'no_recomendada',482:'segura',
            823:'no_recomendada',824:'segura',825:'segura',826:'segura',827:'advertencia',
            828:'advertencia',829:'advertencia',830:'advertencia',831:'segura',832:'segura',
            833:'no_recomendada',834:'segura',835:'segura',836:'advertencia',837:'advertencia',
            965:'segura',1063:'advertencia',1074:'segura',1090:'segura',1092:'segura',
            1095:'advertencia',1099:'advertencia'},
    },
    'dolor_cabeza_migrana': {
        'condicion': 'Dolor de Cabeza / Migraña',
        'modulo': 'dolores',
        'submodulo': 'dolor_cabeza_migrana',
        'emoji': '🤯',
        'descripcion': 'Remedios naturales específicos para dolor de cabeza, migraña y cefalea tensional.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Las compresas frías de manzanilla y las compresas de clavo (externamente) son seguras. Evitar ruda internamente en embarazo. Para migraña persistente consultar médico.'},
        'ids': [228, 973, 1080],
        'maternidad_map': {228:'segura', 973:'no_recomendada', 1080:'advertencia'},
    },
    'dolor_muscular_lumbago': {
        'condicion': 'Dolor Muscular / Lumbago',
        'modulo': 'dolores',
        'submodulo': 'dolor_muscular_lumbago',
        'emoji': '💪',
        'descripcion': 'Aceites, cataplasmas y ungüentos para dolores musculares, lumbago, contracturas y neuralgias.',
        'maternidad': {'seguridad_general': 'segura',
            'nota': 'Los aceites de masaje con romero y árnica (uso externo) son seguros. Las cataplasmas calientes de semillas de lino alivian el lumbago del embarazo. Evitar aceite de wintergreen en primer trimestre.'},
        'ids': [225, 226, 971, 974, 975, 976, 1068],
        'maternidad_map': {225:'segura',226:'segura',971:'advertencia',974:'advertencia',
            975:'advertencia',976:'segura',1068:'segura'},
    },
    'dolor_cronico_general': {
        'condicion': 'Dolor Crónico / General',
        'modulo': 'dolores',
        'submodulo': 'dolor_cronico_general',
        'emoji': '💊',
        'descripcion': 'Analgésicos naturales sistémicos para dolor crónico, neuropático y dolor generalizado.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Sauce blanco, kratom y kava kava están contraindicados en embarazo. La cúrcuma con jengibre y el baño de asiento de manzanilla son las opciones más seguras.'},
        'ids': [224, 227, 229, 968, 969, 970, 972, 977, 1086, 1091],
        'maternidad_map': {224:'no_recomendada',227:'segura',229:'segura',968:'no_recomendada',
            969:'advertencia',970:'no_recomendada',972:'advertencia',977:'advertencia',
            1086:'advertencia',1091:'no_recomendada'},
    },
    'antiinflamatorio': {
        'condicion': 'Antiinflamatorio',
        'modulo': 'dolores',
        'submodulo': 'antiinflamatorio',
        'emoji': '🌡️',
        'descripcion': 'Remedios antiinflamatorios naturales para dolor e inflamación articular y muscular.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Cúrcuma, aloe vera y manzanilla son seguros en dosis normales. Ortiga evitar en embarazo. Preferir aplicación externa.'},
        'ids': [99,230,231,232,233,234,235,470,472,476,479,1070,1098],
        'maternidad_map': {99:'segura',230:'no_recomendada',231:'segura',232:'segura',
            233:'segura',234:'advertencia',235:'segura',470:'segura',472:'segura',
            476:'advertencia',479:'segura',1070:'segura',1098:'segura'},
    },
    'salud_bucal': {
        'condicion': 'Salud Bucal / Dolor de Muelas',
        'modulo': 'dolores',
        'submodulo': 'salud_bucal',
        'emoji': '🦷',
        'descripcion': 'Enjuagues, gárgaras y remedios naturales para dolor de muelas, encías y aftas bucales.',
        'maternidad': {'seguridad_general': 'segura',
            'nota': 'Los enjuagues bucales y la higiene dental son seguros y recomendados en embarazo. El clavo aplicado localmente es seguro para el dolor de muelas.'},
        'ids': [42,127,145,161,267,268,269,270,271,498,499,500,501,502,503,504,505,506,507],
        'maternidad_map': {42:'segura',127:'segura',145:'segura',161:'segura',267:'segura',
            268:'segura',269:'segura',270:'segura',271:'advertencia',498:'segura',
            499:'segura',500:'segura',501:'segura',502:'segura',503:'advertencia',
            504:'advertencia',505:'segura',506:'segura',507:'segura'},
    },
}

total = 0; todas_ids = set()
for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id; out_dir.mkdir(parents=True, exist_ok=True)
    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx: print(f'  WARN: {rid} no encontrado'); continue
        if rid in todas_ids: print(f'  WARN: {rid} dup en {sub_id}'); continue
        todas_ids.add(rid); r = dict(idx[rid])
        r['maternidad_segura'] = meta['maternidad_map'].get(rid, 'advertencia')
        recetas_out.append(r)
    doc = {'condicion':meta['condicion'],'modulo':meta['modulo'],'submodulo':meta['submodulo'],
           'emoji':meta['emoji'],'descripcion':meta['descripcion'],'maternidad':meta['maternidad'],
           'recetas':recetas_out}
    (out_dir / 'recetas.json').write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding='utf-8')
    total += len(recetas_out); print(f'  {sub_id}/ -> {len(recetas_out)} recetas')

print(f'\nTotal: {total} / {len(todas)}')
assert total == len(todas), f'ERROR: {total} != {len(todas)}'
print('OK')
