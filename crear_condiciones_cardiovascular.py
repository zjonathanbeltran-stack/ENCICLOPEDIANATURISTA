"""
crear_condiciones_cardiovascular.py (v2)
97 recetas → 7 condiciones específicas.
"""
import json, pathlib, shutil

src = pathlib.Path('data/modulos/cardiovascular.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

out_base = pathlib.Path('data/modulos/cardiovascular')
for d in ['corazon_circulacion','rinones','diuretico']:
    p = out_base / d
    if p.exists():
        shutil.rmtree(p)

CONDICIONES = {
    'colesterol': {
        'condicion': 'Colesterol',
        'modulo': 'cardiovascular',
        'submodulo': 'colesterol',
        'emoji': '🫀',
        'descripcion': 'Remedios naturales para bajar el colesterol LDL, triglicéridos y proteger las arterias.',
        'maternidad': {'seguridad_general': 'segura',
            'nota': 'Los alimentos funcionales (avena, linaza, arándanos, ajo moderado) son seguros y beneficiosos en embarazo. Evitar grandes cantidades de ajo o vinagre de sidra concentrado.'},
        'ids': [307,321,456,457,459,461,462,464,465,467,770,772,773,774,779,780,782,955,956,776,949],
        'maternidad_map': {307:'advertencia',321:'segura',456:'segura',457:'segura',
            459:'segura',461:'segura',462:'segura',464:'segura',465:'segura',
            467:'segura',770:'no_recomendada',772:'segura',773:'segura',774:'segura',
            779:'segura',780:'segura',782:'segura',955:'segura',956:'segura',
            776:'segura',949:'segura'},
    },
    'presion_arterial': {
        'condicion': 'Presión Arterial',
        'modulo': 'cardiovascular',
        'submodulo': 'presion_arterial',
        'emoji': '🩺',
        'descripcion': 'Infusiones y alimentos para bajar la presión arterial alta (hipertensión) de forma natural.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'La hipertensión en embarazo (preeclampsia) requiere atención médica urgente. El agua de apio, la remolacha y el hibisco son seguros como complemento. Nunca suspender medicación sin consultar médico.'},
        'ids': [306,308,322,453,458,463,775,777,781,954,1071],
        'maternidad_map': {306:'segura',308:'segura',322:'segura',453:'advertencia',
            458:'advertencia',463:'advertencia',775:'segura',777:'segura',
            781:'segura',954:'segura',1071:'segura'},
    },
    'circulacion_varices': {
        'condicion': 'Circulación / Várices',
        'modulo': 'cardiovascular',
        'submodulo': 'circulacion_varices',
        'emoji': '🦵',
        'descripcion': 'Remedios para mejorar la circulación periférica, várices, piernas cansadas y mala circulación.',
        'maternidad': {'seguridad_general': 'segura',
            'nota': 'Los baños de contraste frío/caliente y el meliloto son muy útiles para várices del embarazo. Evitar ginkgo biloba en primer trimestre. La elevación de piernas complementa estos remedios.'},
        'ids': [311,319,460,466,768,769,771,953,996],
        'maternidad_map': {311:'advertencia',319:'segura',460:'no_recomendada',
            466:'segura',768:'segura',769:'segura',771:'no_recomendada',
            953:'advertencia',996:'segura'},
    },
    'palpitaciones_corazon': {
        'condicion': 'Palpitaciones / Corazón',
        'modulo': 'cardiovascular',
        'submodulo': 'palpitaciones_corazon',
        'emoji': '💓',
        'descripcion': 'Plantas para palpitaciones nerviosas, arritmias leves, taquicardia y apoyo al corazón.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Las palpitaciones en embarazo son comunes. El tilo y la melisa son seguros. Evitar valeriana en primer trimestre. Ante arritmia persistente consultar médico inmediatamente.'},
        'ids': [310,318,320,454,778,948,957],
        'maternidad_map': {310:'segura',318:'segura',320:'advertencia',454:'advertencia',
            778:'segura',948:'segura',957:'advertencia'},
    },
    'sangre_antioxidantes': {
        'condicion': 'Sangre / Antioxidantes',
        'modulo': 'cardiovascular',
        'submodulo': 'sangre_antioxidantes',
        'emoji': '🩸',
        'descripcion': 'Depurativos de la sangre, antioxidantes cardiovasculares y remedios para la anemia leve.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'La ortiga y la remolacha son excelentes para el hierro en embarazo. Evitar paico y zarzaparrilla internamente. Los jugos de maqui y calafate son seguros y ricos en antioxidantes.'},
        'ids': [309,312,313,314,315,316,317,323,324,325,455,950,951,952],
        'maternidad_map': {309:'segura',312:'advertencia',313:'segura',314:'advertencia',
            315:'advertencia',316:'segura',317:'advertencia',323:'no_recomendada',
            324:'advertencia',325:'advertencia',455:'segura',950:'advertencia',
            951:'segura',952:'advertencia'},
    },
    'rinones': {
        'condicion': 'Riñones / Vías Urinarias',
        'modulo': 'cardiovascular',
        'submodulo': 'rinones',
        'emoji': '🫘',
        'descripcion': 'Infusiones depurativas para los riñones, cálculos renales e infecciones urinarias.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'El agua de maíz y la limonada depurativa son seguros. Cola de caballo y perejil concentrado se evitan en primer trimestre. Consultar médico ante infecciones urinarias en embarazo.'},
        'ids': [34,120,257,258,259,260,261,416,541,542,543,544,545,549,
                551,988,989,990,991,992,1001,1079],
        'maternidad_map': {34:'advertencia',120:'advertencia',257:'advertencia',258:'segura',
            259:'advertencia',260:'advertencia',261:'segura',416:'advertencia',
            541:'segura',542:'segura',543:'advertencia',544:'segura',545:'segura',
            549:'advertencia',551:'advertencia',988:'advertencia',989:'segura',
            990:'advertencia',991:'segura',992:'advertencia',1001:'advertencia',1079:'advertencia'},
    },
    'diuretico': {
        'condicion': 'Diurético / Retención de Líquidos',
        'modulo': 'cardiovascular',
        'submodulo': 'diuretico',
        'emoji': '💧',
        'descripcion': 'Remedios diuréticos naturales para la retención de líquidos, edema e hinchazón.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'La retención de líquidos es común en embarazo. Agua de sandía y jugo de pepino son seguros. Evitar diente de león y cola de caballo en primer trimestre.'},
        'ids': [16,69,72,117,166,538,539,540,546,547,548,550,552],
        'maternidad_map': {16:'advertencia',69:'advertencia',72:'advertencia',117:'segura',
            166:'segura',538:'advertencia',539:'advertencia',540:'segura',546:'advertencia',
            547:'segura',548:'segura',550:'segura',552:'segura'},
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
