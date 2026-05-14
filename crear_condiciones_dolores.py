"""
crear_condiciones_dolores.py
Genera data/modulos/dolores/<condicion>/recetas.json para las 4 condiciones.
Total: 91 recetas clasificadas manualmente.
"""
import json, pathlib

src = pathlib.Path('data/modulos/dolores.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'reumatismo_artritis': {
        'condicion': 'Reumatismo / Artritis',
        'modulo': 'dolores',
        'submodulo': 'reumatismo_artritis',
        'emoji': '🦴',
        'descripcion': 'Remedios para artritis, reumatismo, gota y dolor articular crónico.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Muchos remedios para artritis son contraindicados en embarazo (sauce blanco, paico, harpagofito). Los baños tibios y cataplasmas suaves son aceptables. Consultar médico.',
        },
        'ids': [36, 39, 83, 134, 135, 136, 468, 469, 471, 473, 474, 475, 477, 478, 480,
                481, 482, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834,
                835, 836, 837, 965, 1063, 1074, 1090, 1092, 1095, 1099],
        'maternidad_map': {
            36: 'no_recomendada', 39: 'no_recomendada', 83: 'advertencia', 134: 'segura',
            135: 'advertencia', 136: 'segura', 468: 'segura', 469: 'segura',
            471: 'segura', 473: 'advertencia', 474: 'advertencia', 475: 'segura',
            477: 'no_recomendada', 478: 'no_recomendada', 480: 'segura',
            481: 'no_recomendada', 482: 'segura', 823: 'no_recomendada', 824: 'segura',
            825: 'segura', 826: 'segura', 827: 'advertencia', 828: 'advertencia',
            829: 'advertencia', 830: 'advertencia', 831: 'segura', 832: 'segura',
            833: 'no_recomendada', 834: 'segura', 835: 'segura', 836: 'advertencia',
            837: 'advertencia', 965: 'segura', 1063: 'advertencia', 1074: 'segura',
            1090: 'segura', 1092: 'segura', 1095: 'advertencia', 1099: 'advertencia',
        },
    },
    'dolor_analgesia': {
        'condicion': 'Alivio del Dolor',
        'modulo': 'dolores',
        'submodulo': 'dolor_analgesia',
        'emoji': '💊',
        'descripcion': 'Analgésicos naturales para dolores musculares, neuralgias, lumbago y dolor crónico.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Varios analgésicos naturales están contraindicados en embarazo (sauce blanco, ruda, kratom, kava kava). Preferir cataplasmas calientes y masajes suaves.',
        },
        'ids': [224, 225, 226, 227, 228, 229, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 1068, 1080, 1086, 1091],
        'maternidad_map': {
            224: 'no_recomendada', 225: 'segura', 226: 'segura', 227: 'segura',
            228: 'segura', 229: 'segura', 968: 'no_recomendada', 969: 'advertencia',
            970: 'no_recomendada', 971: 'advertencia', 972: 'advertencia',
            973: 'no_recomendada', 974: 'advertencia', 975: 'advertencia',
            976: 'segura', 977: 'advertencia', 1068: 'segura', 1080: 'advertencia',
            1086: 'advertencia', 1091: 'no_recomendada',
        },
    },
    'antiinflamatorio': {
        'condicion': 'Antiinflamatorio',
        'modulo': 'dolores',
        'submodulo': 'antiinflamatorio',
        'emoji': '🌡️',
        'descripcion': 'Remedios antiinflamatorios naturales para dolor e inflamación articular y muscular.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'La cúrcuma, el aloe vera y la manzanilla son seguros en dosis normales. Algunos antiinflamatorios como la ortiga deben evitarse en embarazo. Preferir aplicación externa.',
        },
        'ids': [99, 230, 231, 232, 233, 234, 235, 470, 472, 476, 479, 1070, 1098],
        'maternidad_map': {
            99: 'segura', 230: 'no_recomendada', 231: 'segura', 232: 'segura',
            233: 'segura', 234: 'advertencia', 235: 'segura', 470: 'segura',
            472: 'segura', 476: 'advertencia', 479: 'segura', 1070: 'segura',
            1098: 'segura',
        },
    },
    'salud_bucal': {
        'condicion': 'Salud Bucal',
        'modulo': 'dolores',
        'submodulo': 'salud_bucal',
        'emoji': '🦷',
        'descripcion': 'Enjuagues, gárgaras y remedios naturales para dientes, encías y aftas.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'Los enjuagues bucales y la higiene dental son seguros y recomendados en embarazo. El clavo de olor aplicado localmente es seguro. Evitar ingestión de aceite de árbol de té.',
        },
        'ids': [42, 127, 145, 161, 267, 268, 269, 270, 271, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507],
        'maternidad_map': {
            42: 'segura', 127: 'segura', 145: 'segura', 161: 'segura',
            267: 'segura', 268: 'segura', 269: 'segura', 270: 'segura',
            271: 'advertencia', 498: 'segura', 499: 'segura', 500: 'segura',
            501: 'segura', 502: 'segura', 503: 'advertencia', 504: 'advertencia',
            505: 'segura', 506: 'segura', 507: 'segura',
        },
    },
}

out_base = pathlib.Path('data/modulos/dolores')
total = 0
todas_ids = set()

for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id
    out_dir.mkdir(parents=True, exist_ok=True)

    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx:
            print(f'  WARN: id={rid} no encontrado en dolores.json')
            continue
        if rid in todas_ids:
            print(f'  WARN: id={rid} duplicado en {sub_id}')
            continue
        todas_ids.add(rid)
        r = dict(idx[rid])
        r['maternidad_segura'] = meta['maternidad_map'].get(rid, 'advertencia')
        recetas_out.append(r)

    doc = {
        'condicion':   meta['condicion'],
        'modulo':      meta['modulo'],
        'submodulo':   meta['submodulo'],
        'emoji':       meta['emoji'],
        'descripcion': meta['descripcion'],
        'maternidad':  meta['maternidad'],
        'recetas':     recetas_out,
    }
    out_path = out_dir / 'recetas.json'
    out_path.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding='utf-8')
    total += len(recetas_out)
    print(f'  {sub_id}/ -> {len(recetas_out)} recetas')

print(f'\nTotal escrito: {total} / {len(todas)} esperadas')
assert total == len(todas), f'ERROR: {total} != {len(todas)}'
print('OK - todas las recetas clasificadas correctamente.')
