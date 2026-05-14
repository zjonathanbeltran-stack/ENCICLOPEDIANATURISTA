"""
crear_condiciones_pediatrico.py
Total: 51 recetas → 4 condiciones.
"""
import json, pathlib

src = pathlib.Path('data/modulos/pediatrico.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'colicos_digestion': {
        'condicion': 'Cólicos / Digestión',
        'modulo': 'pediatrico',
        'submodulo': 'colicos_digestion',
        'emoji': '🍼',
        'descripcion': 'Remedios para cólicos del lactante, gases, digestión infantil y reflujo.',
        'maternidad': {'seguridad_general': 'segura', 'nota': 'Manzanilla, hinojo y anís son seguros en embarazo en dosis normales.'},
        'ids': [326, 328, 334, 340, 342, 573, 575, 783, 797, 1089],
        'maternidad_map': {326: 'segura', 328: 'segura', 334: 'advertencia', 340: 'segura',
                           342: 'segura', 573: 'segura', 575: 'segura', 783: 'segura',
                           797: 'segura', 1089: 'advertencia'},
    },
    'fiebre_resfriado': {
        'condicion': 'Fiebre / Resfriado / Tos',
        'modulo': 'pediatrico',
        'submodulo': 'fiebre_resfriado',
        'emoji': '🤒',
        'descripcion': 'Jarabes, vapores e infusiones para fiebre, resfriado, tos y bronquitis infantil.',
        'maternidad': {'seguridad_general': 'segura', 'nota': 'La miel, el tilo y el saúco son seguros en embarazo. El vapor de eucalipto también es seguro.'},
        'ids': [329, 330, 331, 338, 343, 568, 570, 572, 577, 578, 786, 787, 790, 795],
        'maternidad_map': {329: 'segura', 330: 'segura', 331: 'segura', 338: 'segura',
                           343: 'segura', 568: 'segura', 570: 'segura', 572: 'segura',
                           577: 'advertencia', 578: 'segura', 786: 'segura', 787: 'segura',
                           790: 'segura', 795: 'segura'},
    },
    'piel_cuidado': {
        'condicion': 'Piel / Cuidado del Bebé',
        'modulo': 'pediatrico',
        'submodulo': 'piel_cuidado',
        'emoji': '🌼',
        'descripcion': 'Cremas, compresas y baños para la piel del bebé: pañalitis, eccema, dentición y golpes.',
        'maternidad': {'seguridad_general': 'segura', 'nota': 'Todos los remedios tópicos para bebés son seguros en embarazo. Caléndula, manzanilla y aceite de almendras son especialmente beneficiosos para la piel.'},
        'ids': [327, 332, 333, 335, 337, 339, 341, 345, 569, 574, 576, 579, 784, 785, 788, 789, 792, 793],
        'maternidad_map': {327: 'segura', 332: 'segura', 333: 'segura', 335: 'segura',
                           337: 'segura', 339: 'segura', 341: 'segura', 345: 'segura',
                           569: 'segura', 574: 'segura', 576: 'segura', 579: 'segura',
                           784: 'segura', 785: 'segura', 788: 'segura', 789: 'segura',
                           792: 'segura', 793: 'segura'},
    },
    'nervioso_sueno': {
        'condicion': 'Nerviosismo / Sueño Infantil',
        'modulo': 'pediatrico',
        'submodulo': 'nervioso_sueno',
        'emoji': '🌙',
        'descripcion': 'Infusiones y baños relajantes para niños inquietos, ansiedad infantil e insomnio.',
        'maternidad': {'seguridad_general': 'segura', 'nota': 'El toronjil, la manzanilla y la lavanda son seguros en embarazo. Los aceites de lavanda para masaje también son seguros.'},
        'ids': [336, 344, 571, 580, 581, 582, 791, 794, 796],
        'maternidad_map': {336: 'segura', 344: 'segura', 571: 'segura', 580: 'segura',
                           581: 'segura', 582: 'segura', 791: 'advertencia',
                           794: 'segura', 796: 'segura'},
    },
}

out_base = pathlib.Path('data/modulos/pediatrico')
total = 0; todas_ids = set()
for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id; out_dir.mkdir(parents=True, exist_ok=True)
    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx: print(f'  WARN: {rid} no encontrado'); continue
        if rid in todas_ids: print(f'  WARN: {rid} dup'); continue
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
