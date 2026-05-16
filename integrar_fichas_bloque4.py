"""
Integra fichas_bloque4.json en data/plantas.json.
Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

fichas = json.load(open('fichas_bloque4.json', encoding='utf-8'))
plantas = json.load(open('data/plantas.json', encoding='utf-8'))

idx = {p['id']: i for i, p in enumerate(plantas)}
campos_privados = {'_id', '_nombre'}

actualizadas = 0
for ficha in fichas:
    pid = ficha['_id']
    if pid not in idx:
        print(f'ERROR: ID {pid} no encontrado en plantas.json')
        continue
    i = idx[pid]
    for k, v in ficha.items():
        if k in campos_privados:
            continue
        plantas[i][k] = v
    print(f'OK: ID {pid} — {plantas[i]["nombre"]} actualizada con ficha_completa')
    actualizadas += 1

print(f'\nPlantas actualizadas: {actualizadas}')

with open('data/plantas.json', 'w', encoding='utf-8') as f:
    json.dump(plantas, f, ensure_ascii=False, indent=2)
print('Guardado data/plantas.json')
