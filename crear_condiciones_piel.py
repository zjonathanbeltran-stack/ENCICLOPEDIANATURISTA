"""
crear_condiciones_piel.py
Genera data/modulos/piel/<condicion>/recetas.json para las 6 condiciones.
Total: 165 recetas clasificadas manualmente.
"""
import json, pathlib

src = pathlib.Path('data/modulos/piel.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'heridas_cicatrices': {
        'condicion': 'Heridas / Cicatrices',
        'modulo': 'piel',
        'submodulo': 'heridas_cicatrices',
        'emoji': '🩹',
        'descripcion': 'Cataplasmas, ungüentos y aceites para cicatrizar heridas, quemaduras y contusiones.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'El aloe vera, la caléndula y el aceite de rosa mosqueta son seguros en embarazo. El árnica solo en uso externo y lejos de mucosas. Todos los remedios cicatrizantes tópicos son generalmente seguros.',
        },
        'ids': [3, 9, 24, 35, 46, 70, 79, 103, 105, 151, 160, 440, 441, 442, 443,
                447, 451, 959, 963, 964, 993, 994, 995, 998, 1061, 1087, 1102, 1103],
        'maternidad_map': {
            3: 'segura', 9: 'segura', 24: 'segura', 35: 'segura', 46: 'segura',
            70: 'segura', 79: 'segura', 103: 'segura', 105: 'segura', 151: 'advertencia',
            160: 'segura', 440: 'segura', 441: 'segura', 442: 'segura', 443: 'segura',
            447: 'segura', 451: 'segura', 959: 'segura', 963: 'segura', 964: 'segura',
            993: 'segura', 994: 'segura', 995: 'segura', 998: 'segura', 1061: 'segura',
            1087: 'segura', 1102: 'segura', 1103: 'segura',
        },
    },
    'hongos_infecciones': {
        'condicion': 'Hongos e Infecciones',
        'modulo': 'piel',
        'submodulo': 'hongos_infecciones',
        'emoji': '🦠',
        'descripcion': 'Antifúngicos naturales para pie de atleta, candidiasis cutánea, hongos en uñas y piel.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'Los baños de vinagre y los geles de aloe son seguros. Evitar aceite de orégano concentrado y aceite de árbol de té en grandes cantidades. Las soluciones tópicas diluidas son aceptables.',
        },
        'ids': [20, 219, 220, 221, 222, 223, 444, 445, 450, 960],
        'maternidad_map': {
            20: 'advertencia', 219: 'segura', 220: 'advertencia', 221: 'segura',
            222: 'segura', 223: 'segura', 444: 'segura', 445: 'segura',
            450: 'segura', 960: 'segura',
        },
    },
    'problemas_piel': {
        'condicion': 'Problemas de Piel',
        'modulo': 'piel',
        'submodulo': 'problemas_piel',
        'emoji': '🌿',
        'descripcion': 'Remedios para eccema, dermatitis, acné, psoriasis, verrugas y afecciones cutáneas.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'La mayoría de los remedios dermatológicos tópicos son seguros en embarazo. Evitar gobernadora por vía interna. El aceite de coco, la manzanilla y la caléndula son especialmente seguros.',
        },
        'ids': [12, 19, 40, 58, 64, 74, 91, 95, 102, 159, 172, 438, 439, 446, 449,
                958, 961, 966, 967, 1067, 1072, 1104],
        'maternidad_map': {
            12: 'segura', 19: 'advertencia', 40: 'segura', 58: 'segura', 64: 'segura',
            74: 'advertencia', 91: 'segura', 95: 'no_recomendada', 102: 'segura',
            159: 'segura', 172: 'advertencia', 438: 'segura', 439: 'segura',
            446: 'segura', 449: 'segura', 958: 'segura', 961: 'segura',
            966: 'advertencia', 967: 'segura', 1067: 'segura', 1072: 'segura',
            1104: 'segura',
        },
    },
    'cosmetica_piel': {
        'condicion': 'Cosmética Natural',
        'modulo': 'piel',
        'submodulo': 'cosmetica_piel',
        'emoji': '✨',
        'descripcion': 'Mascarillas, cremas, tónicos y cosméticos naturales para el cuidado de la piel.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'Los cosméticos naturales con avena, miel, aloe y aceites vegetales son seguros y recomendados en embarazo. Evitar retinol concentrado y aceites esenciales en primer trimestre.',
        },
        'ids': [60, 63, 67, 78, 85, 89, 107, 132, 133, 144, 146, 154, 155, 163,
                167, 168, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185,
                186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198,
                199, 200, 448, 452, 613, 614, 615, 616, 617, 618, 619, 620, 621,
                622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 962],
        'maternidad_map': {
            60: 'segura', 63: 'segura', 67: 'segura', 78: 'segura', 85: 'segura',
            89: 'segura', 107: 'segura', 132: 'segura', 133: 'advertencia',
            144: 'segura', 146: 'segura', 154: 'segura', 155: 'segura',
            163: 'segura', 167: 'segura', 168: 'segura', 175: 'segura',
            176: 'segura', 177: 'segura', 178: 'segura', 179: 'segura',
            180: 'segura', 181: 'segura', 182: 'segura', 183: 'segura',
            184: 'segura', 185: 'segura', 186: 'segura', 187: 'segura',
            188: 'segura', 189: 'segura', 190: 'segura', 191: 'segura',
            192: 'segura', 193: 'segura', 194: 'segura', 195: 'segura',
            196: 'segura', 197: 'segura', 198: 'segura', 199: 'segura',
            200: 'segura', 448: 'segura', 452: 'segura', 613: 'segura',
            614: 'segura', 615: 'segura', 616: 'segura', 617: 'segura',
            618: 'segura', 619: 'segura', 620: 'segura', 621: 'advertencia',
            622: 'segura', 623: 'segura', 624: 'segura', 625: 'advertencia',
            626: 'segura', 627: 'segura', 628: 'advertencia', 629: 'segura',
            630: 'segura', 631: 'segura', 632: 'segura', 962: 'segura',
        },
    },
    'cabello': {
        'condicion': 'Cuidado del Cabello',
        'modulo': 'piel',
        'submodulo': 'cabello',
        'emoji': '💇',
        'descripcion': 'Mascarillas, enjuagues y aceites naturales para el cabello: anticaída, brillo, anticaspa.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'Los tratamientos capilares naturales son completamente seguros en embarazo. El aceite de ricino, el vinagre de sidra y las mascarillas de huevo son especialmente recomendados.',
        },
        'ids': [68, 93, 98, 112, 124, 131, 165, 633, 634, 635, 636, 637, 638, 639,
                640, 641, 642, 643, 644, 645, 646, 647],
        'maternidad_map': {
            68: 'segura', 93: 'segura', 98: 'segura', 112: 'segura', 124: 'advertencia',
            131: 'advertencia', 165: 'segura', 633: 'segura', 634: 'segura',
            635: 'segura', 636: 'segura', 637: 'segura', 638: 'segura', 639: 'segura',
            640: 'segura', 641: 'segura', 642: 'segura', 643: 'segura', 644: 'segura',
            645: 'segura', 646: 'segura', 647: 'segura',
        },
    },
    'banos_terapeuticos': {
        'condicion': 'Baños Terapéuticos',
        'modulo': 'piel',
        'submodulo': 'banos_terapeuticos',
        'emoji': '🛁',
        'descripcion': 'Baños de hierbas medicinales para la piel, el relajamiento muscular y la salud general.',
        'maternidad': {
            'seguridad_general': 'segura',
            'nota': 'Los baños de hierbas son seguros en embarazo con agua tibia (no caliente). Evitar temperaturas superiores a 37°C. La avena, la manzanilla y la lavanda son especialmente beneficiosos.',
        },
        'ids': [7, 37, 48, 62, 71, 88, 100, 158, 164, 169, 173, 174, 983, 984, 985, 986, 987, 1064],
        'maternidad_map': {
            7: 'segura', 37: 'segura', 48: 'advertencia', 62: 'segura', 71: 'segura',
            88: 'segura', 100: 'segura', 158: 'segura', 164: 'segura', 169: 'segura',
            173: 'segura', 174: 'segura', 983: 'segura', 984: 'segura',
            985: 'advertencia', 986: 'segura', 987: 'segura', 1064: 'segura',
        },
    },
}

out_base = pathlib.Path('data/modulos/piel')
total = 0
todas_ids = set()

for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id
    out_dir.mkdir(parents=True, exist_ok=True)

    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx:
            print(f'  WARN: id={rid} no encontrado en piel.json')
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
