"""
crear_condiciones_mapuche.py
Total: 146 recetas → 2 condiciones.
"""
import json, pathlib

src = pathlib.Path('data/modulos/mapuche.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'medicina_mapuche': {
        'condicion': 'Medicina Mapuche',
        'modulo': 'mapuche',
        'submodulo': 'medicina_mapuche',
        'emoji': '🌿',
        'descripcion': 'Lawen (remedios) de la tradición médica mapuche: plantas sagradas, machis y sabidurías ancestrales.',
        'maternidad': {'seguridad_general': 'advertencia', 'nota': 'Muchos lawen mapuche son seguros en embarazo. El canelo (foye), el matico y el maqui son plantas respetadas en la tradición. Siempre consultar a una machi o matrona. Evitar paico y chilco en embarazo.'},
        'ids': [2, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 346, 347, 348,
                349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 678, 679,
                680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 813,
                814, 815, 816, 817, 818, 819, 820, 821, 822, 928, 929, 930, 931, 932,
                933, 934, 935, 936, 937, 1003, 1004, 1005, 1006, 1007, 1008, 1009,
                1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020,
                1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031,
                1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042,
                1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053,
                1054, 1055, 1056, 1057, 1058, 1059, 1060],
        'maternidad_map': {
            2: 'segura', 201: 'advertencia', 202: 'advertencia', 203: 'segura',
            204: 'advertencia', 205: 'advertencia', 206: 'segura', 207: 'segura',
            208: 'segura', 209: 'segura', 210: 'segura', 346: 'advertencia',
            347: 'segura', 348: 'advertencia', 349: 'advertencia', 350: 'segura',
            351: 'advertencia', 352: 'segura', 353: 'advertencia', 354: 'segura',
            355: 'advertencia', 356: 'segura', 357: 'segura', 358: 'advertencia',
            359: 'advertencia', 360: 'advertencia', 678: 'segura', 679: 'advertencia',
            680: 'segura', 681: 'segura', 682: 'segura', 683: 'segura',
            684: 'advertencia', 685: 'segura', 686: 'segura', 687: 'segura',
            688: 'segura', 689: 'no_recomendada', 690: 'segura', 691: 'segura',
            692: 'segura', 813: 'segura', 814: 'advertencia', 815: 'segura',
            816: 'segura', 817: 'segura', 818: 'advertencia', 819: 'segura',
            820: 'segura', 821: 'advertencia', 822: 'segura', 928: 'advertencia',
            929: 'segura', 930: 'advertencia', 931: 'segura', 932: 'advertencia',
            933: 'advertencia', 934: 'segura', 935: 'segura', 936: 'segura',
            937: 'segura', 1003: 'advertencia', 1004: 'segura', 1005: 'segura',
            1006: 'segura', 1007: 'segura', 1008: 'segura', 1009: 'segura',
            1010: 'segura', 1011: 'segura', 1012: 'advertencia', 1013: 'segura',
            1014: 'segura', 1015: 'advertencia', 1016: 'segura', 1017: 'segura',
            1018: 'segura', 1019: 'no_recomendada', 1020: 'segura', 1021: 'no_recomendada',
            1022: 'advertencia', 1023: 'segura', 1024: 'segura', 1025: 'segura',
            1026: 'segura', 1027: 'segura', 1028: 'segura', 1029: 'segura',
            1030: 'segura', 1031: 'segura', 1032: 'advertencia', 1033: 'segura',
            1034: 'segura', 1035: 'segura', 1036: 'segura', 1037: 'advertencia',
            1038: 'advertencia', 1039: 'advertencia', 1040: 'no_recomendada',
            1041: 'advertencia', 1042: 'segura', 1043: 'advertencia', 1044: 'segura',
            1045: 'segura', 1046: 'segura', 1047: 'no_recomendada', 1048: 'segura',
            1049: 'segura', 1050: 'segura', 1051: 'advertencia', 1052: 'segura',
            1053: 'segura', 1054: 'segura', 1055: 'segura', 1056: 'segura',
            1057: 'segura', 1058: 'segura', 1059: 'segura', 1060: 'segura',
        },
    },
    'espiritual_ritual': {
        'condicion': 'Espiritual / Ritual',
        'modulo': 'mapuche',
        'submodulo': 'espiritual_ritual',
        'emoji': '🔮',
        'descripcion': 'Baños de limpieza, sahumerios, aguas florales y rituales espirituales de la tradición mapuche y chilota.',
        'maternidad': {'seguridad_general': 'advertencia', 'nota': 'Los baños florales y los sahumerios son seguros en embarazo. Evitar la ruda y el ajenjo tomados internamente. Los baños rituales con agua tibia son beneficiosos para el bienestar emocional.'},
        'ids': [28, 38, 45, 56, 106, 121, 122, 123, 138, 139, 583, 584, 585, 586, 587,
                588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 1084, 1085],
        'maternidad_map': {
            28: 'advertencia', 38: 'segura', 45: 'advertencia', 56: 'segura',
            106: 'no_recomendada', 121: 'advertencia', 122: 'segura', 123: 'advertencia',
            138: 'no_recomendada', 139: 'segura', 583: 'segura', 584: 'segura',
            585: 'segura', 586: 'segura', 587: 'segura', 588: 'segura',
            589: 'segura', 590: 'no_recomendada', 591: 'segura', 592: 'segura',
            593: 'no_recomendada', 594: 'segura', 595: 'segura', 596: 'segura',
            597: 'segura', 1084: 'segura', 1085: 'segura',
        },
    },
}

out_base = pathlib.Path('data/modulos/mapuche')
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
