"""
crear_condiciones_cardiovascular.py
Total: 97 recetas → 3 condiciones.
"""
import json, pathlib

src = pathlib.Path('data/modulos/cardiovascular.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'corazon_circulacion': {
        'condicion': 'Corazón / Circulación',
        'modulo': 'cardiovascular',
        'submodulo': 'corazon_circulacion',
        'emoji': '❤️',
        'descripcion': 'Remedios para el corazón, la circulación, la presión arterial y el colesterol.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'El espino blanco, el tilo y la melisa son seguros en embarazo para las palpitaciones leves. Evitar ginkgo biloba, ajo en grandes cantidades y plantas que afecten la coagulación. Nunca automedicarse para el corazón en embarazo.',
        },
        'ids': [306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319,
                320, 321, 322, 323, 324, 325, 453, 454, 455, 456, 457, 458, 459, 460,
                461, 462, 463, 464, 465, 466, 467, 768, 769, 770, 771, 772, 773, 774,
                775, 776, 777, 778, 779, 780, 781, 782, 948, 949, 950, 951, 952, 953,
                954, 955, 956, 957, 996, 1071],
        'maternidad_map': {
            306: 'segura', 307: 'advertencia', 308: 'segura', 309: 'segura',
            310: 'segura', 311: 'advertencia', 312: 'advertencia', 313: 'segura',
            314: 'advertencia', 315: 'advertencia', 316: 'segura', 317: 'advertencia',
            318: 'segura', 319: 'segura', 320: 'advertencia', 321: 'advertencia',
            322: 'segura', 323: 'no_recomendada', 324: 'advertencia', 325: 'advertencia',
            453: 'segura', 454: 'advertencia', 455: 'segura', 456: 'segura',
            457: 'segura', 458: 'advertencia', 459: 'segura', 460: 'no_recomendada',
            461: 'segura', 462: 'segura', 463: 'advertencia', 464: 'segura',
            465: 'segura', 466: 'segura', 467: 'segura', 768: 'advertencia',
            769: 'segura', 770: 'no_recomendada', 771: 'no_recomendada', 772: 'segura',
            773: 'segura', 774: 'segura', 775: 'segura', 776: 'segura',
            777: 'segura', 778: 'segura', 779: 'segura', 780: 'segura',
            781: 'segura', 782: 'segura', 948: 'segura', 949: 'segura',
            950: 'advertencia', 951: 'segura', 952: 'advertencia', 953: 'advertencia',
            954: 'segura', 955: 'segura', 956: 'segura', 957: 'advertencia',
            996: 'segura', 1071: 'segura',
        },
    },
    'rinones': {
        'condicion': 'Riñones',
        'modulo': 'cardiovascular',
        'submodulo': 'rinones',
        'emoji': '🫘',
        'descripcion': 'Infusiones y depurativos para los riñones, cálculos renales e infecciones urinarias.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'La cola de caballo y el agua de perejil en grandes cantidades son contraindicados en embarazo. El agua de maíz (pelos de choclo) y la limonada depurativa son seguros. Consultar médico ante infecciones urinarias en embarazo.',
        },
        'ids': [34, 120, 257, 258, 259, 260, 261, 416, 541, 542, 543, 544, 545, 549,
                551, 988, 989, 990, 991, 992, 1001, 1079],
        'maternidad_map': {
            34: 'advertencia', 120: 'advertencia', 257: 'advertencia', 258: 'segura',
            259: 'advertencia', 260: 'advertencia', 261: 'segura', 416: 'advertencia',
            541: 'segura', 542: 'segura', 543: 'advertencia', 544: 'segura',
            545: 'segura', 549: 'advertencia', 551: 'advertencia', 988: 'advertencia',
            989: 'segura', 990: 'advertencia', 991: 'segura', 992: 'advertencia',
            1001: 'advertencia', 1079: 'advertencia',
        },
    },
    'diuretico': {
        'condicion': 'Diurético / Retención de Líquidos',
        'modulo': 'cardiovascular',
        'submodulo': 'diuretico',
        'emoji': '💧',
        'descripcion': 'Remedios diuréticos naturales para la retención de líquidos e hinchazón.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'La retención de líquidos es común en embarazo. El agua de sandía y el jugo de pepino son seguros. Evitar diente de león concentrado y cola de caballo en primer trimestre. Siempre consultar ante edema severo.',
        },
        'ids': [16, 69, 72, 117, 166, 538, 539, 540, 546, 547, 548, 550, 552],
        'maternidad_map': {
            16: 'advertencia', 69: 'advertencia', 72: 'advertencia', 117: 'segura',
            166: 'segura', 538: 'advertencia', 539: 'advertencia', 540: 'segura',
            546: 'advertencia', 547: 'segura', 548: 'segura', 550: 'segura',
            552: 'segura',
        },
    },
}

out_base = pathlib.Path('data/modulos/cardiovascular')
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
    doc = {'condicion': meta['condicion'], 'modulo': meta['modulo'], 'submodulo': meta['submodulo'],
           'emoji': meta['emoji'], 'descripcion': meta['descripcion'], 'maternidad': meta['maternidad'],
           'recetas': recetas_out}
    (out_dir / 'recetas.json').write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding='utf-8')
    total += len(recetas_out); print(f'  {sub_id}/ -> {len(recetas_out)}')
print(f'\nTotal: {total} / {len(todas)}')
assert total == len(todas); print('OK')
