"""
crear_condiciones_mujer.py
Genera data/modulos/mujer/<condicion>/recetas.json para las 4 condiciones.
Total: 59 recetas clasificadas manualmente.
"""
import json, pathlib

src = pathlib.Path('data/modulos/mujer.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'menstruacion_spm': {
        'condicion': 'Menstruación / SPM',
        'modulo': 'mujer',
        'submodulo': 'menstruacion_spm',
        'emoji': '🌸',
        'descripcion': 'Remedios para cólicos menstruales, síndrome premenstrual y regularizar el ciclo.',
        'maternidad': {
            'seguridad_general': 'no_recomendada',
            'nota': 'Los remedios para regularizar la menstruación (artemisa, ruda, agnocasto) son contraindicados en embarazo pues pueden estimular contracciones. El toronjil y la manzanilla son los únicos seguros.',
        },
        'ids': [282, 283, 285, 290, 295, 296, 299, 304, 305, 553, 554, 556, 557, 558,
                562, 563, 800, 806, 811, 812],
        'maternidad_map': {
            282: 'segura', 283: 'segura', 285: 'advertencia', 290: 'advertencia',
            295: 'segura', 296: 'segura', 299: 'advertencia', 304: 'no_recomendada',
            305: 'advertencia', 553: 'segura', 554: 'advertencia', 556: 'no_recomendada',
            557: 'segura', 558: 'no_recomendada', 562: 'no_recomendada',
            563: 'no_recomendada', 800: 'segura', 806: 'advertencia',
            811: 'advertencia', 812: 'segura',
        },
    },
    'menopausia': {
        'condicion': 'Menopausia',
        'modulo': 'mujer',
        'submodulo': 'menopausia',
        'emoji': '🌺',
        'descripcion': 'Remedios naturales para sofocos, insomnio y síntomas de la menopausia.',
        'maternidad': {
            'seguridad_general': 'no_recomendada',
            'nota': 'Los remedios para la menopausia (cimicifuga, sauzgatillo, maca, progesterona natural) son contraindicados en embarazo. Consultar siempre con un profesional de salud.',
        },
        'ids': [287, 288, 289, 292, 560, 801, 802, 803, 807, 808, 809, 999],
        'maternidad_map': {
            287: 'advertencia', 288: 'no_recomendada', 289: 'no_recomendada',
            292: 'advertencia', 560: 'no_recomendada', 801: 'segura',
            802: 'no_recomendada', 803: 'no_recomendada', 807: 'no_recomendada',
            808: 'no_recomendada', 809: 'advertencia', 999: 'no_recomendada',
        },
    },
    'postparto_lactancia': {
        'condicion': 'Postparto / Lactancia',
        'modulo': 'mujer',
        'submodulo': 'postparto_lactancia',
        'emoji': '🤱',
        'descripcion': 'Remedios para el postparto, la lactancia, mastitis y recuperación tras el parto.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Estos remedios son para el período postparto y la lactancia. Algunos son seguros durante el embarazo (árnica externa, manzanilla), otros están destinados solo para después del parto. Consultar al profesional.',
        },
        'ids': [291, 297, 301, 302, 555, 559, 561, 798, 799],
        'maternidad_map': {
            291: 'segura', 297: 'advertencia', 301: 'segura', 302: 'segura',
            555: 'segura', 559: 'segura', 561: 'segura', 798: 'segura', 799: 'segura',
        },
    },
    'salud_ginecologica': {
        'condicion': 'Salud Ginecológica',
        'modulo': 'mujer',
        'submodulo': 'salud_ginecologica',
        'emoji': '🌿',
        'descripcion': 'Higiene íntima, infecciones vaginales, candidiasis y salud del útero.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Los lavados externos con matico, quillay y caléndula son seguros en embarazo. Las compresas externas son seguras. Evitar remedios internos que afecten el útero o los ovarios sin supervisión médica.',
        },
        'ids': [284, 286, 293, 294, 298, 300, 303, 564, 565, 566, 567, 804, 805, 810,
                1062, 1066, 1088, 1093],
        'maternidad_map': {
            284: 'segura', 286: 'segura', 293: 'segura', 294: 'segura',
            298: 'segura', 300: 'segura', 303: 'advertencia', 564: 'no_recomendada',
            565: 'advertencia', 566: 'no_recomendada', 567: 'segura',
            804: 'no_recomendada', 805: 'advertencia', 810: 'no_recomendada',
            1062: 'advertencia', 1066: 'segura', 1088: 'advertencia', 1093: 'advertencia',
        },
    },
}

out_base = pathlib.Path('data/modulos/mujer')
total = 0
todas_ids = set()

for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id
    out_dir.mkdir(parents=True, exist_ok=True)
    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx:
            print(f'  WARN: id={rid} no encontrado'); continue
        if rid in todas_ids:
            print(f'  WARN: id={rid} duplicado en {sub_id}'); continue
        todas_ids.add(rid)
        r = dict(idx[rid])
        r['maternidad_segura'] = meta['maternidad_map'].get(rid, 'advertencia')
        recetas_out.append(r)
    doc = {'condicion': meta['condicion'], 'modulo': meta['modulo'], 'submodulo': meta['submodulo'],
           'emoji': meta['emoji'], 'descripcion': meta['descripcion'], 'maternidad': meta['maternidad'],
           'recetas': recetas_out}
    (out_dir / 'recetas.json').write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding='utf-8')
    total += len(recetas_out)
    print(f'  {sub_id}/ -> {len(recetas_out)} recetas')

print(f'\nTotal: {total} / {len(todas)}')
assert total == len(todas), f'ERROR'
print('OK')
