"""
crear_condiciones_general.py
Total: 119 recetas → 4 condiciones.
"""
import json, pathlib

src = pathlib.Path('data/modulos/general.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'energizante_vitalidad': {
        'condicion': 'Energizante / Vitalidad',
        'modulo': 'general',
        'submodulo': 'energizante_vitalidad',
        'emoji': '⚡',
        'descripcion': 'Tónicos, batidos y superalimentos para la energía, vitalidad y rendimiento.',
        'maternidad': {'seguridad_general': 'advertencia', 'nota': 'La mayoría de los tónicos energizantes son seguros. Evitar ginseng, rhodiola, ashwagandha y guaraná en embarazo. La espirulina, la moringa y los batidos de frutas son seguros.'},
        'ids': [5, 272, 273, 274, 275, 276, 483, 484, 485, 486, 487, 490, 491, 494, 495,
                496, 497, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745,
                746, 747, 748, 749, 750, 751, 752, 873, 874, 875, 876, 877, 878, 879, 880,
                881, 882, 883, 884, 885, 886, 887],
        'maternidad_map': {
            5: 'segura', 272: 'segura', 273: 'segura', 274: 'segura', 275: 'segura',
            276: 'segura', 483: 'segura', 484: 'segura', 485: 'no_recomendada',
            486: 'segura', 487: 'segura', 490: 'advertencia', 491: 'no_recomendada',
            494: 'segura', 495: 'segura', 496: 'segura', 497: 'no_recomendada',
            733: 'segura', 734: 'segura', 735: 'segura', 736: 'segura', 737: 'segura',
            738: 'segura', 739: 'segura', 740: 'segura', 741: 'segura', 742: 'segura',
            743: 'advertencia', 744: 'segura', 745: 'segura', 746: 'segura',
            747: 'segura', 748: 'no_recomendada', 749: 'segura', 750: 'segura',
            751: 'segura', 752: 'segura', 873: 'segura', 874: 'segura', 875: 'segura',
            876: 'segura', 877: 'segura', 878: 'advertencia', 879: 'segura',
            880: 'segura', 881: 'no_recomendada', 882: 'segura', 883: 'segura',
            884: 'segura', 885: 'segura', 886: 'segura', 887: 'advertencia',
        },
    },
    'alergia': {
        'condicion': 'Alergia',
        'modulo': 'general',
        'submodulo': 'alergia',
        'emoji': '🤧',
        'descripcion': 'Remedios naturales antihistamínicos para alergias estacionales, rinitis y reacciones cutáneas.',
        'maternidad': {'seguridad_general': 'advertencia', 'nota': 'El llantén, la manzanilla y el agua de mar nasal son seguros. Evitar ortiga concentrada en primer trimestre. La miel y el jengibre son buenos antihistamínicos seguros en embarazo.'},
        'ids': [57, 242, 243, 244, 245, 246, 838, 839, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912],
        'maternidad_map': {
            57: 'segura', 242: 'segura', 243: 'advertencia', 244: 'segura',
            245: 'segura', 246: 'segura', 838: 'segura', 839: 'advertencia',
            903: 'advertencia', 904: 'segura', 905: 'advertencia', 906: 'segura',
            907: 'segura', 908: 'advertencia', 909: 'segura', 910: 'advertencia',
            911: 'segura', 912: 'segura',
        },
    },
    'ojos_oidos': {
        'condicion': 'Ojos / Oídos',
        'modulo': 'general',
        'submodulo': 'ojos_oidos',
        'emoji': '👁️',
        'descripcion': 'Colirios naturales, compresas oculares y remedios para el oído y los tapones de cera.',
        'maternidad': {'seguridad_general': 'segura', 'nota': 'Las compresas de manzanilla para los ojos y el aceite de oliva templado para los oídos son completamente seguros en embarazo.'},
        'ids': [14, 25, 61, 87, 111, 125, 140, 170, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 1083],
        'maternidad_map': {
            14: 'no_recomendada', 25: 'segura', 61: 'segura', 87: 'segura',
            111: 'segura', 125: 'segura', 140: 'segura', 170: 'segura',
            648: 'segura', 649: 'segura', 650: 'segura', 651: 'segura',
            652: 'segura', 653: 'segura', 654: 'segura', 655: 'segura',
            656: 'segura', 657: 'segura', 1083: 'segura',
        },
    },
    'bienestar_general': {
        'condicion': 'Bienestar General',
        'modulo': 'general',
        'submodulo': 'bienestar_general',
        'emoji': '🌟',
        'descripcion': 'Infusiones, rituales y remedios para el bienestar cotidiano, diabetes leve y salud integral.',
        'maternidad': {'seguridad_general': 'advertencia', 'nota': 'Los remedios para la diabetes (marrubio, palo negro) requieren supervisión médica en embarazo. Las infusiones suaves de manzanilla y los caldos reconstituyentes son seguros y recomendados.'},
        'ids': [75, 108, 113, 128, 129, 130, 149, 150, 152, 153, 156, 171, 913, 914,
                915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 1002, 1076, 1105],
        'maternidad_map': {
            75: 'segura', 108: 'advertencia', 113: 'advertencia', 128: 'segura',
            129: 'segura', 130: 'advertencia', 149: 'advertencia', 150: 'advertencia',
            152: 'segura', 153: 'segura', 156: 'no_recomendada', 171: 'segura',
            913: 'segura', 914: 'segura', 915: 'segura', 916: 'segura',
            917: 'segura', 918: 'segura', 919: 'segura', 920: 'segura',
            921: 'segura', 922: 'segura', 923: 'segura', 924: 'segura',
            925: 'advertencia', 926: 'segura', 927: 'segura', 1002: 'segura',
            1076: 'advertencia', 1105: 'segura',
        },
    },
}

out_base = pathlib.Path('data/modulos/general')
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
