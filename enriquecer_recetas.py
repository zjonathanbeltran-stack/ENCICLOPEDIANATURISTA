#!/usr/bin/env python3
"""
enriquecer_recetas.py — CLI para agregar campos enciclopédicos a las recetas.

Uso:
    python enriquecer_recetas.py              # recorre recetas sin campos
    python enriquecer_recetas.py --id 42      # edita una receta específica
    python enriquecer_recetas.py --cat "Analgésico"  # filtra por categoría
    python enriquecer_recetas.py --pendientes  # solo las que faltan campos
"""

import json, sys, os, argparse

RECETAS_PATH = os.path.join(os.path.dirname(__file__), 'data', 'recetas.json')
CAMPOS_NUEVOS = ['uso', 'principios_activos', 'propiedades', 'referencias']

def cargar():
    with open(RECETAS_PATH, encoding='utf-8') as f:
        return json.load(f)

def guardar(data):
    with open(RECETAS_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('\n✅ Guardado en recetas.json')

def limpiar():
    os.system('cls' if os.name == 'nt' else 'clear')

def mostrar_receta(r):
    print('─' * 60)
    print(f"  ID {r['id']}  |  {r['categoria']}")
    print(f"  📜 {r['titulo']}")
    print(f"  🌿 Ingredientes: {r.get('ingredientes','—')}")
    print(f"  📋 Preparación:  {r.get('preparacion','—')[:120]}{'…' if len(r.get('preparacion','')) > 120 else ''}")
    print(f"  💊 Dosis:        {r.get('dosis','—')}")
    print(f"  🖐  Modo de uso:  {r.get('modo_uso','—')[:120]}{'…' if len(r.get('modo_uso','')) > 120 else ''}")
    print('─' * 60)
    print()

def mostrar_actuales(r):
    for campo in CAMPOS_NUEVOS:
        val = r.get(campo)
        if val:
            if isinstance(val, list):
                print(f"  ✓ {campo}: {', '.join(val)}")
            else:
                print(f"  ✓ {campo}: {val[:80]}{'…' if len(val) > 80 else ''}")
        else:
            print(f"  · {campo}: (vacío)")
    print()

def pedir_campo(nombre, actual, ejemplo):
    if actual:
        if isinstance(actual, list):
            print(f"  Actual → {', '.join(actual)}")
        else:
            print(f"  Actual → {actual}")
    print(f"  Ejemplo → {ejemplo}")
    valor = input(f"  {nombre} (Enter para mantener, '-' para borrar): ").strip()
    if valor == '-':
        return None
    if not valor:
        return actual
    return valor

def editar_receta(r):
    limpiar()
    mostrar_receta(r)
    print("── CAMPOS ACTUALES ──")
    mostrar_actuales(r)
    print("── INGRESAR DATOS (Enter = mantener actual, '-' = borrar) ──\n")

    # USO
    print("1. USO — ¿Para qué sirve específicamente esta receta?")
    uso = pedir_campo('uso', r.get('uso'), 'Emenagogo: regulariza ciclos menstruales irregulares.')
    print()

    # PRINCIPIOS ACTIVOS
    print("2. PRINCIPIOS ACTIVOS — ¿Qué compuestos hacen efecto y cómo?")
    pa = pedir_campo('principios_activos', r.get('principios_activos'),
                     'Flavonoides y taninos del chilco actúan sobre la musculatura uterina.')
    print()

    # PROPIEDADES
    print("3. PROPIEDADES — Lista separada por comas (ej: analgésico, antiséptico)")
    props_actual = r.get('propiedades', [])
    props_str = ', '.join(props_actual) if props_actual else ''
    props_nuevo = pedir_campo('propiedades', props_str, 'emenagogo, espasmolítico, regulador hormonal')
    if isinstance(props_nuevo, str) and props_nuevo:
        props_nuevo = [p.strip() for p in props_nuevo.split(',') if p.strip()]
    elif not props_nuevo:
        props_nuevo = None
    print()

    # REFERENCIAS
    print("4. REFERENCIAS — Fuentes (libros, estudios, tradición documentada)")
    refs = pedir_campo('referencias', r.get('referencias'),
                       'Hoffmann 1992; Montes & Wilkomirsky 1985; MINSAL 2010')
    print()

    # Aplicar cambios
    if uso is not None:
        r['uso'] = uso
    elif 'uso' in r and uso is None:
        del r['uso']

    if pa is not None:
        r['principios_activos'] = pa
    elif 'principios_activos' in r and pa is None:
        del r['principios_activos']

    if props_nuevo is not None:
        r['propiedades'] = props_nuevo
    elif 'propiedades' in r and props_nuevo is None:
        del r['propiedades']

    if refs is not None:
        r['referencias'] = refs
    elif 'referencias' in r and refs is None:
        del r['referencias']

    return r

def completados(recetas):
    return sum(1 for r in recetas if any(r.get(c) for c in CAMPOS_NUEVOS))

def main():
    parser = argparse.ArgumentParser(description='Enriquecer recetas con campos enciclopédicos')
    parser.add_argument('--id', type=int, help='ID de receta específica')
    parser.add_argument('--cat', type=str, help='Filtrar por categoría')
    parser.add_argument('--pendientes', action='store_true', help='Solo recetas sin campos')
    args = parser.parse_args()

    recetas = cargar()
    total = len(recetas)

    if args.id:
        lista = [r for r in recetas if r['id'] == args.id]
        if not lista:
            print(f'❌ No se encontró receta con ID {args.id}')
            return
    elif args.cat:
        lista = [r for r in recetas if args.cat.lower() in r.get('categoria','').lower()]
    elif args.pendientes:
        lista = [r for r in recetas if not any(r.get(c) for c in CAMPOS_NUEVOS)]
    else:
        lista = recetas

    print(f'\n🌿 Enciclopedia Naturista — Enriquecedor de Recetas')
    print(f'   Total: {total} recetas | Completadas: {completados(recetas)} | Por hacer: {total - completados(recetas)}')
    print(f'   Trabajando con: {len(lista)} receta(s)\n')

    guardado = False
    for i, r in enumerate(lista):
        idx = next(j for j, x in enumerate(recetas) if x['id'] == r['id'])
        print(f'\n[{i+1}/{len(lista)}]', end='')
        recetas[idx] = editar_receta(recetas[idx])

        opcion = input('\n  ¿Continuar? [Enter=sí / g=guardar y salir / s=saltar / q=salir sin guardar]: ').strip().lower()
        if opcion == 'q':
            print('Saliendo sin guardar.')
            return
        if opcion == 'g':
            guardar(recetas)
            guardado = True
            break
        if opcion == 's':
            continue
        # Guardar progreso cada 5 recetas
        if (i + 1) % 5 == 0:
            guardar(recetas)
            guardado = True
            print(f'  💾 Progreso guardado ({i+1}/{len(lista)})')

    if not guardado:
        guardar(recetas)

if __name__ == '__main__':
    main()
