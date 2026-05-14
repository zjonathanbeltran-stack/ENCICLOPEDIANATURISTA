"""
crear_condiciones_respiratorio.py
Genera data/modulos/respiratorio/<condicion>/recetas.json para las 7 condiciones.
Total: 102 recetas clasificadas manualmente.
"""
import json, pathlib

src = pathlib.Path('data/modulos/respiratorio.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'gripe_resfrios': {
        'condicion': 'Gripe / Resfríos',
        'modulo': 'respiratorio',
        'submodulo': 'gripe_resfrios',
        'emoji': '🤧',
        'descripcion': 'Remedios naturales para la gripe, resfríos y primeros síntomas del catarro.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Muchos remedios para el resfriado son seguros en embarazo. Evitar alcohol, plantas estimulantes del útero y dosis altas de hierbas. La miel, el limón y el jengibre suave son generalmente seguros.',
        },
        'ids': [1, 55, 96, 143, 277, 278, 279, 280, 281, 849],
        'maternidad_map': {
            1: 'segura', 55: 'advertencia', 96: 'segura', 143: 'segura',
            277: 'segura', 278: 'no_recomendada', 279: 'segura', 280: 'segura',
            281: 'advertencia', 849: 'segura',
        },
    },
    'tos': {
        'condicion': 'Tos',
        'modulo': 'respiratorio',
        'submodulo': 'tos',
        'emoji': '😮‍💨',
        'descripcion': 'Jarabes y tisanas para la tos seca, irritativa o persistente.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'La miel y el limón son seguros. Algunos jarabes contienen plantas contraindicadas en embarazo (regaliz, horehound). Revisar cada receta individualmente.',
        },
        'ids': [6, 15, 22, 33, 41, 73, 90, 97, 109, 147, 423, 426, 427, 435, 841, 842, 846, 853, 855, 1097],
        'maternidad_map': {
            6: 'segura', 15: 'advertencia', 22: 'advertencia', 33: 'segura',
            41: 'advertencia', 73: 'segura', 90: 'segura', 97: 'segura',
            109: 'segura', 147: 'segura', 423: 'segura', 426: 'no_recomendada',
            427: 'advertencia', 435: 'segura', 841: 'segura', 842: 'advertencia',
            846: 'segura', 853: 'segura', 855: 'advertencia', 1097: 'segura',
        },
    },
    'bronquitis_expectorante': {
        'condicion': 'Bronquitis / Expectorante',
        'modulo': 'respiratorio',
        'submodulo': 'bronquitis_expectorante',
        'emoji': '🫁',
        'descripcion': 'Expectorantes y remedios para bronquitis, flemas y tos productiva.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Las cataplasmas de mostaza y los vapores son generalmente seguros. Evitar ipecacuana y plantas fuertes. Consultar médico si hay bronquitis aguda en embarazo.',
        },
        'ids': [30, 236, 237, 238, 239, 240, 241, 431, 433, 978, 979, 980, 981, 982, 1075],
        'maternidad_map': {
            30: 'advertencia', 236: 'segura', 237: 'segura', 238: 'segura',
            239: 'segura', 240: 'segura', 241: 'segura', 431: 'advertencia',
            433: 'segura', 978: 'no_recomendada', 979: 'advertencia', 980: 'segura',
            981: 'segura', 982: 'segura', 1075: 'segura',
        },
    },
    'congestion_sinusitis': {
        'condicion': 'Congestión / Sinusitis',
        'modulo': 'respiratorio',
        'submodulo': 'congestion_sinusitis',
        'emoji': '👃',
        'descripcion': 'Vapores, inhalaciones y remedios para la congestión nasal y sinusitis.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'Los vapores de eucalipto y las inhalaciones de hierbas son seguros en embarazo. Evitar aceites esenciales concentrados en primer trimestre.',
        },
        'ids': [53, 86, 424, 428, 437, 843, 847, 852, 856],
        'maternidad_map': {
            53: 'segura', 86: 'segura', 424: 'segura', 428: 'advertencia',
            437: 'advertencia', 843: 'segura', 847: 'segura', 852: 'segura', 856: 'segura',
        },
    },
    'garganta_faringitis': {
        'condicion': 'Garganta / Faringitis',
        'modulo': 'respiratorio',
        'submodulo': 'garganta_faringitis',
        'emoji': '🗣️',
        'descripcion': 'Gárgaras, jarabes y tisanas para aliviar la garganta y la faringitis.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'Las gárgaras y tisanas para la garganta son seguras en embarazo. Limón, miel y manzanilla son especialmente recomendados.',
        },
        'ids': [29, 47, 81, 115, 116, 141, 142, 425, 434, 840, 844, 850, 854, 857],
        'maternidad_map': {
            29: 'segura', 47: 'segura', 81: 'segura', 115: 'segura',
            116: 'advertencia', 141: 'advertencia', 142: 'segura', 425: 'segura',
            434: 'segura', 840: 'segura', 844: 'advertencia', 850: 'advertencia',
            854: 'advertencia', 857: 'segura',
        },
    },
    'fiebre': {
        'condicion': 'Fiebre',
        'modulo': 'respiratorio',
        'submodulo': 'fiebre',
        'emoji': '🌡️',
        'descripcion': 'Remedios para bajar la fiebre: infusiones diaforéticas, compresas y baños febrífugos.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'La fiebre alta en embarazo es riesgosa. Los métodos físicos (compresas frías, baño tibio) son seguros. El sauce contiene salicilatos (evitar). Consultar médico si fiebre supera 38°C.',
        },
        'ids': [18, 23, 31, 262, 263, 264, 265, 266, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 1069, 1081, 1100, 1101],
        'maternidad_map': {
            18: 'advertencia', 23: 'advertencia', 31: 'advertencia', 262: 'segura',
            263: 'segura', 264: 'segura', 265: 'no_recomendada', 266: 'segura',
            658: 'no_recomendada', 659: 'segura', 660: 'segura', 661: 'segura',
            662: 'advertencia', 663: 'segura', 664: 'segura', 665: 'segura',
            666: 'no_recomendada', 667: 'advertencia', 1069: 'no_recomendada',
            1081: 'advertencia', 1100: 'advertencia', 1101: 'segura',
        },
    },
    'respiratorio_general': {
        'condicion': 'Salud Respiratoria General',
        'modulo': 'respiratorio',
        'submodulo': 'respiratorio_general',
        'emoji': '🌬️',
        'descripcion': 'Remedios generales para fortalecer las vías respiratorias y prevenir infecciones.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Muchos tónicos respiratorios son seguros en embarazo. Revisar plantas individuales: la gobernadora y algunas hierbas del norte son contraindicadas.',
        },
        'ids': [13, 94, 414, 429, 430, 432, 436, 845, 848, 851, 1094, 1096],
        'maternidad_map': {
            13: 'advertencia', 94: 'no_recomendada', 414: 'segura', 429: 'segura',
            430: 'segura', 432: 'segura', 436: 'advertencia', 845: 'advertencia',
            848: 'advertencia', 851: 'segura', 1094: 'advertencia', 1096: 'advertencia',
        },
    },
}

out_base = pathlib.Path('data/modulos/respiratorio')
total = 0
todas_ids = set()

for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id
    out_dir.mkdir(parents=True, exist_ok=True)

    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx:
            print(f'  WARN: id={rid} no encontrado en respiratorio.json')
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
