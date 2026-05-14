"""
crear_condiciones_nervioso.py
Genera data/modulos/nervioso/<condicion>/recetas.json para las 3 condiciones.
Total: 92 recetas clasificadas manualmente.
"""
import json, pathlib

src = pathlib.Path('data/modulos/nervioso.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

CONDICIONES = {
    'ansiedad_estres': {
        'condicion': 'Ansiedad / Estrés',
        'modulo': 'nervioso',
        'submodulo': 'ansiedad_estres',
        'emoji': '🧘',
        'descripcion': 'Remedios naturales para la ansiedad, el estrés, la tensión nerviosa y el agotamiento.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'El toronjil, la manzanilla y la lavanda son seguros en embarazo. Evitar kava kava, ashwagandha y rhodiola. Los baños relajantes con lavanda son bien tolerados.',
        },
        'ids': [21, 43, 44, 50, 82, 118, 518, 519, 522, 523, 524, 526, 528, 529, 530,
                531, 532, 533, 534, 536, 537, 753, 754, 755, 756, 758, 759, 760, 761,
                762, 763, 765, 766, 767, 997, 1000],
        'maternidad_map': {
            21: 'segura', 43: 'segura', 44: 'segura', 50: 'advertencia', 82: 'segura',
            118: 'advertencia', 518: 'segura', 519: 'segura', 522: 'no_recomendada',
            523: 'segura', 524: 'segura', 526: 'no_recomendada', 528: 'segura',
            529: 'advertencia', 530: 'segura', 531: 'segura', 532: 'segura',
            533: 'advertencia', 534: 'segura', 536: 'no_recomendada', 537: 'segura',
            753: 'segura', 754: 'no_recomendada', 755: 'segura', 756: 'advertencia',
            758: 'advertencia', 759: 'segura', 760: 'segura', 761: 'segura',
            762: 'no_recomendada', 763: 'segura', 765: 'segura', 766: 'segura',
            767: 'segura', 997: 'segura', 1000: 'segura',
        },
    },
    'insomnio': {
        'condicion': 'Insomnio / Sueño',
        'modulo': 'nervioso',
        'submodulo': 'insomnio',
        'emoji': '🌙',
        'descripcion': 'Sedantes naturales, tisanas y rituales nocturnos para conciliar el sueño.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'El tilo, la manzanilla y la pasiflora son seguros en embarazo en dosis moderadas. Evitar valeriana en primer trimestre. Los rituales de relajación son siempre seguros.',
        },
        'ids': [26, 104, 148, 211, 212, 213, 214, 215, 216, 217, 218, 520, 521, 525,
                527, 535, 757, 764, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867,
                868, 869, 870, 871, 872, 1082],
        'maternidad_map': {
            26: 'advertencia', 104: 'segura', 148: 'segura', 211: 'segura',
            212: 'advertencia', 213: 'segura', 214: 'segura', 215: 'segura',
            216: 'segura', 217: 'segura', 218: 'advertencia', 520: 'advertencia',
            521: 'segura', 525: 'segura', 527: 'advertencia', 535: 'advertencia',
            757: 'no_recomendada', 764: 'segura', 858: 'advertencia', 859: 'segura',
            860: 'segura', 861: 'advertencia', 862: 'no_recomendada', 863: 'segura',
            864: 'segura', 865: 'no_recomendada', 866: 'segura', 867: 'segura',
            868: 'segura', 869: 'advertencia', 870: 'segura', 871: 'segura',
            872: 'segura', 1082: 'segura',
        },
    },
    'memoria_concentracion': {
        'condicion': 'Memoria / Concentración',
        'modulo': 'nervioso',
        'submodulo': 'memoria_concentracion',
        'emoji': '🧠',
        'descripcion': 'Plantas y recetas para mejorar la memoria, la concentración y la agilidad mental.',
        'maternidad': {
            'seguridad_general': 'advertencia',
            'nota': 'El romero, la salvia y la menta son generalmente seguros en dosis culinarias. Algunos adaptógenos como el brahmi y gotu kola no están suficientemente estudiados en embarazo. Preferir infusiones suaves.',
        },
        'ids': [361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372,
                508, 509, 510, 511, 512, 513, 514, 515, 516, 517],
        'maternidad_map': {
            361: 'segura', 362: 'advertencia', 363: 'segura', 364: 'segura',
            365: 'segura', 366: 'segura', 367: 'segura', 368: 'segura',
            369: 'segura', 370: 'advertencia', 371: 'segura', 372: 'segura',
            508: 'advertencia', 509: 'segura', 510: 'segura', 511: 'advertencia',
            512: 'segura', 513: 'segura', 514: 'segura', 515: 'advertencia',
            516: 'segura', 517: 'advertencia',
        },
    },
}

out_base = pathlib.Path('data/modulos/nervioso')
total = 0
todas_ids = set()

for sub_id, meta in CONDICIONES.items():
    out_dir = out_base / sub_id
    out_dir.mkdir(parents=True, exist_ok=True)

    recetas_out = []
    for rid in meta['ids']:
        if rid not in idx:
            print(f'  WARN: id={rid} no encontrado en nervioso.json')
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
