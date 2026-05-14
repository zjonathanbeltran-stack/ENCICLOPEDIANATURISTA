"""
crear_condiciones_nervioso.py (v2)
92 recetas → 4 condiciones más específicas.
"""
import json, pathlib, shutil

src = pathlib.Path('data/modulos/nervioso.json')
todas = json.loads(src.read_text(encoding='utf-8'))
idx = {r['id']: r for r in todas}

# Limpiar carpetas anteriores
out_base = pathlib.Path('data/modulos/nervioso')
for d in ['ansiedad_estres','insomnio','memoria_concentracion']:
    p = out_base / d
    if p.exists():
        shutil.rmtree(p)

CONDICIONES = {
    'estres_ansiedad': {
        'condicion': 'Estrés / Ansiedad',
        'modulo': 'nervioso',
        'submodulo': 'estres_ansiedad',
        'emoji': '🧘',
        'descripcion': 'Plantas calmantes para la ansiedad, tensión nerviosa, nerviosismo y taquicardia por estrés.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Toronjil, manzanilla, tilo y lavanda son seguros en embarazo. Evitar kava kava. Los baños relajantes de lavanda son especialmente recomendados.'},
        'ids': [21,43,44,50,82,118,518,519,522,524,531,532,534,756,759,761,766,767,997,1000],
        'maternidad_map': {21:'segura',43:'segura',44:'segura',50:'advertencia',82:'segura',
            118:'advertencia',518:'segura',519:'segura',522:'no_recomendada',524:'segura',
            531:'segura',532:'segura',534:'segura',756:'advertencia',759:'segura',
            761:'segura',766:'segura',767:'segura',997:'segura',1000:'segura'},
    },
    'animo_depresion': {
        'condicion': 'Ánimo / Depresión',
        'modulo': 'nervioso',
        'submodulo': 'animo_depresion',
        'emoji': '☀️',
        'descripcion': 'Adaptógenos, aromaterapia y remedios para el agotamiento nervioso, tristeza, burnout y bajo ánimo.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Evitar ashwagandha, rhodiola y CBD en embarazo. Los baños de bienestar, la aromaterapia suave y las infusiones de verbena son opciones seguras.'},
        'ids': [523,526,528,529,530,533,536,537,753,754,755,758,760,762,763,765,1082],
        'maternidad_map': {523:'segura',526:'no_recomendada',528:'segura',529:'advertencia',
            530:'segura',533:'advertencia',536:'no_recomendada',537:'segura',
            753:'segura',754:'no_recomendada',755:'segura',758:'advertencia',
            760:'segura',762:'no_recomendada',763:'segura',765:'segura',1082:'segura'},
    },
    'insomnio': {
        'condicion': 'Insomnio / Sueño',
        'modulo': 'nervioso',
        'submodulo': 'insomnio',
        'emoji': '🌙',
        'descripcion': 'Sedantes naturales, tisanas nocturnas, almohadas de hierbas y rituales para conciliar el sueño.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Tilo, pasiflora y manzanilla son seguros. Evitar valeriana en primer trimestre. Los rituales de relajación sin plantas son siempre seguros.'},
        # insomnio original - sacando id=1082 (movido a animo)
        'ids': [26,104,148,211,212,213,214,215,216,217,218,520,521,525,
                527,535,757,764,858,859,860,861,862,863,864,865,866,867,
                868,869,870,871,872],
        'maternidad_map': {26:'advertencia',104:'segura',148:'segura',211:'segura',
            212:'advertencia',213:'segura',214:'segura',215:'segura',216:'segura',
            217:'segura',218:'advertencia',520:'advertencia',521:'segura',525:'segura',
            527:'advertencia',535:'advertencia',757:'no_recomendada',764:'segura',
            858:'advertencia',859:'segura',860:'segura',861:'advertencia',
            862:'no_recomendada',863:'segura',864:'segura',865:'no_recomendada',
            866:'segura',867:'segura',868:'segura',869:'advertencia',870:'segura',
            871:'segura',872:'segura'},
    },
    'memoria_concentracion': {
        'condicion': 'Memoria / Concentración',
        'modulo': 'nervioso',
        'submodulo': 'memoria_concentracion',
        'emoji': '🧠',
        'descripcion': 'Plantas y recetas para mejorar la memoria, concentración, agilidad mental y protección cognitiva.',
        'maternidad': {'seguridad_general': 'advertencia',
            'nota': 'Romero, menta y cúrcuma son seguros en dosis culinarias. Brahmi y gotu kola no están suficientemente estudiados en embarazo.'},
        'ids': [361,362,363,364,365,366,367,368,369,370,371,372,
                508,509,510,511,512,513,514,515,516,517],
        'maternidad_map': {361:'segura',362:'advertencia',363:'segura',364:'segura',
            365:'segura',366:'segura',367:'segura',368:'segura',369:'segura',
            370:'advertencia',371:'segura',372:'segura',508:'advertencia',509:'segura',
            510:'segura',511:'advertencia',512:'segura',513:'segura',514:'segura',
            515:'advertencia',516:'segura',517:'advertencia'},
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
