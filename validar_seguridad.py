#!/usr/bin/env python3
"""
Validador de seguridad — Enciclopedia Naturista de Chile
Detecta contradicciones y errores que podrían dañar al usuario.

Uso:
    python3 validar_seguridad.py              # valida todo, sale con código 1 si hay CRÍTICOS
    python3 validar_seguridad.py --fix        # imprime lista sin salir con error
"""
import json, sys, re

# ── Configuración ────────────────────────────────────────────────────────────

# Palabras en cualquier campo que indican que NO debe ingerirse
NO_INGERIR = [
    'no ingerir', 'no consumir', 'no tomar', 'solo uso externo',
    'solo para uso externo', 'uso tópico únicamente', 'uso externo únicamente',
    'no ingestión', 'prohibido ingerir',
]

# Palabras en preparación/dosis que indican uso tópico
TOPICO_PREP = [
    'aplicar en la piel', 'aplicar sobre la piel', 'gotas en el oído',
    'aplicar tópicamente', 'uso externo', 'solo externo',
    'cataplasma', 'compresas', 'masaje', 'frotar',
    'aplicar en el oído', 'aplicar en el conducto',
    'enjuague bucal', 'gargarismo',
]

# Submódulos donde hay usuarios embarazadas o lactantes
SUBMODULOS_MATERNIDAD = {'postparto_lactancia', 'menstruacion_spm'}

# Plantas con propiedades abortivas documentadas
PLANTAS_ABORTIVAS = [
    'ruda', 'ajenjo', 'poleo', 'sabina', 'artemisa',
    'tanaceto', 'tansy', 'cohosh negro',
]

# Plantas extremadamente tóxicas
PLANTAS_LETALES = [
    'chamico', 'datura', 'dedalera', 'digitalis', 'belladona',
    'cicuta', 'acónito', 'estramonio', 'beleño',
]

# ── Checks ───────────────────────────────────────────────────────────────────

def check_oral_vs_topico(r):
    """modo_uso dice Oral pero algún campo dice que no se ingiere."""
    issues = []
    modo = (r.get('modo_uso') or '').lower()
    if 'oral' not in modo and 'infusión' not in modo and 'decocción' not in modo:
        return issues

    # Solo revisar preparacion y dosis — contraindicaciones puede decir
    # "no consumir en embarazo" sin ser una contradicción con modo_uso oral
    campos_instrucciones = ' '.join([
        r.get('preparacion', ''), r.get('dosis', ''),
    ]).lower()

    for frase in NO_INGERIR:
        if frase in campos_instrucciones:
            # Excluir restricciones de tiempo/duración — no son contradicción con oral
            if 'no consumir después' in campos_instrucciones:
                continue
            if re.search(r'no consumir (más de|por más|durante más|cerca|por la noche|de noche)', campos_instrucciones):
                continue
            issues.append(
                f"[CRÍTICO] modo_uso='{r['modo_uso']}' pero texto dice \"{frase}\""
            )
            break

    prep = (r.get('preparacion') or '').lower()
    # Si modo_uso ya menciona "tópico", el uso tópico en la preparación es intencional
    modo_menciona_topico = 'tópico' in modo or 'topico' in modo
    if not modo_menciona_topico:
        for frase in TOPICO_PREP:
            if frase in prep:
                issues.append(
                    f"[CRÍTICO] modo_uso='{r['modo_uso']}' pero preparación indica uso tópico ('{frase}')"
                )
                break

    return issues


def check_abortivas_maternidad(r):
    """Planta abortiva en receta de submódulo de maternidad/lactancia."""
    issues = []
    if r.get('submodulo') not in SUBMODULOS_MATERNIDAD:
        return issues
    texto = ' '.join([
        r.get('ingredientes', ''), r.get('titulo', ''), r.get('preparacion', '')
    ]).lower()
    for planta in PLANTAS_ABORTIVAS:
        if planta in texto:
            issues.append(
                f"[CRÍTICO] Planta abortiva '{planta}' en receta de submódulo '{r['submodulo']}'"
            )
    return issues


def check_letales_sin_advertencia(r):
    """Planta letal sin contraindicación clara."""
    issues = []
    texto_ing = (r.get('ingredientes') or '').lower()
    contra = (r.get('contraindicaciones') or '').lower()
    for planta in PLANTAS_LETALES:
        if planta in texto_ing:
            palabras_peligro = ['tóxico', 'letal', 'veneno', 'peligros', 'mortal', 'prohibid', 'muerte']
            if not any(w in contra for w in palabras_peligro):
                issues.append(
                    f"[CRÍTICO] Planta letal '{planta}' en ingredientes sin advertencia de toxicidad"
                )
    return issues


def check_sin_contraindicaciones(r):
    """Receta sin contraindicaciones."""
    issues = []
    if not (r.get('contraindicaciones') or '').strip():
        issues.append("[ADVERTENCIA] Sin campo contraindicaciones")
    return issues


def check_sin_dosis(r):
    """Receta sin dosis."""
    issues = []
    if not (r.get('dosis') or '').strip():
        issues.append("[ADVERTENCIA] Sin campo dosis")
    return issues


def check_sin_modulo(r):
    """Receta sin modulo o submodulo."""
    issues = []
    if not (r.get('modulo') or '').strip():
        issues.append("[ADVERTENCIA] Sin campo modulo")
    if not (r.get('submodulo') or '').strip():
        issues.append("[ADVERTENCIA] Sin campo submodulo")
    return issues


def check_titulo_vs_prep(r):
    """Título dice 'infusión' pero preparación es maceración en aceite."""
    issues = []
    titulo = r.get('titulo', '').lower()
    prep = (r.get('preparacion') or '').lower()
    if 'infusión' in titulo and 'macerar' in prep and 'aceite' in prep:
        issues.append(
            "[ADVERTENCIA] Título dice 'infusión' pero la preparación es una maceración en aceite"
        )
    return issues


def check_prohibido_visible(r):
    """Receta marcada como PROHIBIDA con modo_uso que no lo indica."""
    issues = []
    titulo = r.get('titulo', '').upper()
    modo = (r.get('modo_uso') or '').upper()
    if 'PROHIBIDO' in titulo or 'NO USAR' in titulo:
        if 'PROHIBIDO' not in modo and 'NO PREPARAR' not in modo:
            issues.append(
                f"[CRÍTICO] Título indica planta prohibida pero modo_uso='{r['modo_uso']}' no lo advierte"
            )
    return issues


# ── Runner ───────────────────────────────────────────────────────────────────

CHECKS = [
    check_oral_vs_topico,
    check_abortivas_maternidad,
    check_letales_sin_advertencia,
    check_prohibido_visible,
    check_sin_contraindicaciones,
    check_sin_dosis,
    check_sin_modulo,
    check_titulo_vs_prep,
]

def validar(archivo='data/recetas.json'):
    with open(archivo, encoding='utf-8') as f:
        data = json.load(f)

    criticos = 0
    advertencias = 0
    recetas_con_problemas = 0

    for r in data:
        problemas = []
        for check in CHECKS:
            problemas.extend(check(r))

        if not problemas:
            continue

        recetas_con_problemas += 1
        criticos_receta = sum(1 for p in problemas if '[CRÍTICO]' in p)
        criticos += criticos_receta
        advertencias += len(problemas) - criticos_receta

        print(f"\nID {r['id']:>4} — {r['titulo']}")
        for p in problemas:
            print(f"         {p}")

    print()
    print("─" * 60)
    print(f"  Recetas revisadas : {len(data)}")
    print(f"  Con problemas     : {recetas_con_problemas}")
    print(f"  🔴 CRÍTICOS       : {criticos}")
    print(f"  🟡 Advertencias   : {advertencias}")
    print("─" * 60)

    if criticos > 0:
        print("\n  ⛔  Corregir todos los CRÍTICOS antes de publicar.\n")
        return 1
    elif advertencias > 0:
        print("\n  ⚠️   Hay advertencias — revisar antes de publicar.\n")
        return 0
    else:
        print("\n  ✅  Sin problemas de seguridad detectados.\n")
        return 0


if __name__ == '__main__':
    sys.exit(validar())
