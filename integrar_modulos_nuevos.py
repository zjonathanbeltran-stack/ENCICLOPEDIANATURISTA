"""
Integra todos los archivos .txt de data/MODULOS NUEVOS/ en data/recetas.json
y regenera los archivos de submódulo con crear_submodulos.py.

Ejecutar desde: /home/user/ENCICLOPEDIANATURISTA/
  python3 integrar_modulos_nuevos.py
"""
import json, os, re, unicodedata, sys

sys.stdout.reconfigure(encoding='utf-8')

RECETAS_JSON = 'data/recetas.json'
NUEVOS_DIR   = 'data/MODULOS NUEVOS'

# ── Mapeo MODULO/SUBMODULO del .txt → (modulo_key, submodulo_key) ────────────
MAPA = {
    # Nervioso
    ('Nervioso', 'Ansiedad'):                            ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Ansiedad / Estrés'):                   ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Ansiedad / Insomnio'):                 ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Estrés'):                              ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Insomnio'):                            ('nervioso', 'insomnio'),
    ('Nervioso', 'Cefalea tensional'):                   ('dolores',  'dolor_cabeza_migrana'),
    ('Nervioso', 'Agotamiento mental  Concentración'):   ('nervioso', 'memoria_concentracion'),
    ('Nervioso', 'Agotamiento mental / Concentración'):  ('nervioso', 'memoria_concentracion'),
    # Respiratorio
    ('Respiratorio', 'Gripe  Resfriado'):                ('respiratorio', 'gripe_resfrios'),
    ('Respiratorio', 'Gripe / Resfriado'):               ('respiratorio', 'gripe_resfrios'),
    ('Respiratorio', 'Bronquitis  Expectorante'):        ('respiratorio', 'bronquitis_expectorante'),
    ('Respiratorio', 'Bronquitis / Expectorante'):       ('respiratorio', 'bronquitis_expectorante'),
    ('Respiratorio', 'Bronquitis / Resfriado'):          ('respiratorio', 'bronquitis_expectorante'),
    ('Respiratorio', 'Congestión  Sinusitis'):           ('respiratorio', 'congestion_sinusitis'),
    ('Respiratorio', 'Congestión / Sinusitis'):          ('respiratorio', 'congestion_sinusitis'),
    ('Respiratorio', 'Faringitis  Dolor de garganta'):   ('respiratorio', 'garganta_faringitis'),
    ('Respiratorio', 'Faringitis / Dolor de garganta'):  ('respiratorio', 'garganta_faringitis'),
    ('Respiratorio', 'Fiebre  Antipirético'):            ('respiratorio', 'fiebre'),
    ('Respiratorio', 'Fiebre / Antipirético'):           ('respiratorio', 'fiebre'),
    ('Respiratorio', 'Tos  Antitusivo'):                 ('respiratorio', 'tos'),
    ('Respiratorio', 'Tos / Antitusivo'):                ('respiratorio', 'tos'),
    ('Respiratorio', 'Tos / Catarro'):                   ('respiratorio', 'tos'),
    ('Respiratorio', 'Tos / Resfriado'):                 ('respiratorio', 'tos'),
    # Mujer
    ('Mujer', 'Menopausia (Sofocos)'):                   ('mujer', 'menopausia'),
    ('Mujer', 'Menopausia (Sofocos y ansiedad)'):        ('mujer', 'menopausia'),
    ('Mujer', 'Menopausia (Insomnio y ansiedad)'):       ('mujer', 'menopausia'),
    ('Mujer', 'Menopausia (Cambios de humor y regulación)'): ('mujer', 'menopausia'),
    ('Mujer', 'Menstruación (Dismenorrea)'):             ('mujer', 'menstruacion_spm'),
    ('Mujer', 'Menstruación (Síndrome Premenstrual)'):   ('mujer', 'menstruacion_spm'),
    ('Mujer', 'Flujo Abundante (Menorragia)'):           ('mujer', 'menstruacion_spm'),
    ('Mujer', 'Salud Ginecológica (Vaginosis Bacteriana)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Higiene Íntima)'):    ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Higiene íntima)'):    ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Sequedad vaginal)'):  ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Infección Urinaria y Flujo)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Regulación Menstrual)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Flujo Vaginal)'):     ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Fertilidad'):                             ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Embarazo (Náuseas)'):                     ('mujer', 'postparto_lactancia'),
    # Maternal
    ('Maternal', 'Náuseas y vómitos del embarazo'):      ('mujer', 'postparto_lactancia'),
    ('Maternal', 'Galactógeno (producción de leche)'):   ('mujer', 'postparto_lactancia'),
    ('Maternal', 'Cuidado de la piel / Estrías'):        ('mujer', 'postparto_lactancia'),
    ('Maternal', 'Recuperación posparto / Aporte de hierro'): ('mujer', 'postparto_lactancia'),
    # Digestivo
    ('Digestivo', 'Cólicos y Gases'):                    ('digestivo', 'colicos_gases'),
    ('Digestivo', 'Náuseas'):                            ('digestivo', 'nauseas_indigestion'),
    ('Digestivo', 'Hígado'):                             ('digestivo', 'higado_vesicula'),
    ('Digestivo', 'Vesícula'):                           ('digestivo', 'higado_vesicula'),
    ('Digestivo', 'Parásitos'):                          ('digestivo', 'parasitos'),
    ('Digestivo', 'Gastritis'):                          ('digestivo', 'gastritis_acidez'),
    ('Digestivo', 'Gases'):                              ('digestivo', 'colicos_gases'),
    ('Digestivo', 'Diarrea'):                            ('digestivo', 'diarrea'),
    ('Digestivo', 'Acidez y Reflujo'):                   ('digestivo', 'gastritis_acidez'),
    ('Digestivo', 'Estreñimiento'):                      ('digestivo', 'estrenimiento'),
    ('Digestivo', 'Digestión Lenta'):                    ('digestivo', 'digestion_lenta'),
    # Dolores
    ('Dolores y Reumatismo', 'Dolores musculares'):      ('dolores', 'dolor_muscular_lumbago'),
    ('Dolores y Reumatismo', 'Golpes y contusiones'):    ('dolores', 'dolor_muscular_lumbago'),
    ('Dolores y Reumatismo', 'Dolores reumáticos y articulares'): ('dolores', 'reumatismo_artritis'),
    ('Dolores y Reumatismo', 'Contracturas musculares'): ('dolores', 'dolor_muscular_lumbago'),
    ('Dolores y Reumatismo', 'Artritis y dolor articular crónico'): ('dolores', 'reumatismo_artritis'),
    # Piel
    ('Piel y Heridas', 'Quemaduras leves'):              ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Heridas y picaduras'):           ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Heridas y cicatrización'):       ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Hemorragias menores'):           ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Inflamación cutánea y eccemas'): ('piel', 'problemas_piel'),
    # Sistema Urinario
    ('Sistema Urinario', 'Próstata / HPB'):              ('cardiovascular', 'rinones'),
    ('Sistema Urinario', 'Retención de líquidos / Depurativo'): ('cardiovascular', 'diuretico'),
    ('Sistema Urinario', 'Retención de líquidos / Diurético'): ('cardiovascular', 'diuretico'),
    ('Sistema Urinario', 'Cálculos renales / Diurético suave'): ('cardiovascular', 'rinones'),
    ('Sistema Urinario', 'Infección urinaria / Diurético'): ('cardiovascular', 'rinones'),
    # Pediátrico
    ('Pediátrico', 'Inquietud / Dificultad para dormir'): ('pediatrico', 'nervioso_sueno'),
    ('Pediátrico', 'Cólicos del lactante'):              ('pediatrico', 'colicos_digestion'),
    ('Pediátrico', 'Cólicos / Malestar general'):        ('pediatrico', 'colicos_digestion'),
    ('Pediátrico', 'Dentición'):                         ('pediatrico', 'piel_cuidado'),
    ('Pediátrico', 'Tos y resfriado'):                   ('pediatrico', 'fiebre_resfriado'),
    # Complementario y Nutricional
    ('Complementario y Nutricional', 'Aporte nutricional / Metabolismo'): ('digestivo', 'nutricion'),
    ('Complementario y Nutricional', 'Digestivo / Astringente'):          ('digestivo', 'digestion_lenta'),
    ('Complementario y Nutricional', 'Vitamínico / Refuerzo inmunológico'): ('general', 'bienestar_general'),
    ('Complementario y Nutricional', 'Antioxidante / Astringente'):       ('general', 'bienestar_general'),
    ('Complementario y Nutricional', 'Antioxidante / Antiinflamatorio'):  ('general', 'bienestar_general'),
    # Alto Riesgo — incluir con contraindicación marcada
    ('Alto Riesgo', 'Dolores articulares (SOLO USO EXTERNO DILUIDO)'):    ('dolores', 'reumatismo_artritis'),
    ('Alto Riesgo', 'Heridas y afecciones cutáneas (USO EXTERNO PUNTUAL)'): ('piel', 'heridas_cicatrices'),
    ('Alto Riesgo', 'Dolores reumáticos (SOLO USO EXTERNO)'):             ('dolores', 'reumatismo_artritis'),
    ('Alto Riesgo', 'Parásitos (solo bajo supervisión)'):                  ('digestivo', 'parasitos'),
}

OMITIR_MODULO  = {'Alto Riesgo'}  # omitir completamente estos módulos por seguridad
OMITIR_NOMBRE  = {'PROHIBIDO', 'NO USAR', 'PROHIBIDA', 'TÓXICO'}

CAT_MAP = {
    'nervioso':      'Nervioso',
    'respiratorio':  'Respiratorio',
    'mujer':         'Ginecológico',
    'digestivo':     'Digestivo',
    'dolores':       'Analgésico',
    'piel':          'Dermatológico',
    'cardiovascular':'Cardiovascular',
    'pediatrico':    'Pediátrico',
    'general':       'General',
    'mapuche':       'Medicina Mapuche',
}

def modo_uso(titulo):
    t = titulo.lower()
    if 'infusión' in t or 'tisana' in t or 'té de' in t:  return 'Infusión'
    if 'decocción' in t or 'caldo' in t:                   return 'Decocción'
    if 'jarabe' in t:                                       return 'Jarabe'
    if 'cataplasma' in t:                                   return 'Cataplasma'
    if 'baño' in t or 'vahos' in t or 'vapor' in t:        return 'Baño/Vapores'
    if 'tintura' in t or 'macerado' in t:                  return 'Tintura'
    if 'pomada' in t or 'ungüento' in t or 'crema' in t:  return 'Ungüento'
    if 'aceite' in t:                                       return 'Aceite'
    if 'compresa' in t:                                     return 'Compresa'
    if 'gel' in t:                                          return 'Aplicación tópica'
    if 'leche' in t or 'bebida' in t or 'agua de' in t:    return 'Bebida'
    return 'Infusión'

def tiempo_prep(modo):
    if modo in ('Tintura', 'Macerado'):        return '3-7 días'
    if modo in ('Ungüento', 'Aceite'):         return '30-60 min'
    if modo in ('Jarabe',):                    return '20-30 min'
    if modo in ('Decocción',):                 return '15-20 min'
    if modo in ('Cataplasma', 'Compresa'):     return '5-10 min'
    return '10-15 min'

def extrae(texto, campo):
    patron = rf'^{re.escape(campo)}:\s*(.+?)(?=\n[A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ /()]+:|\n=====|\Z)'
    m = re.search(patron, texto, re.MULTILINE | re.DOTALL)
    return m.group(1).strip() if m else ''

def extrae_bloque(texto, campo):
    m = re.search(rf'{re.escape(campo)}:\n(.*?)(?=\n[A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ /()]+:|\n====|\Z)', texto, re.DOTALL)
    return m.group(1).strip() if m else ''

def parsear(filepath):
    with open(filepath, encoding='utf-8') as f:
        texto = f.read()

    nombre    = extrae(texto, 'NOMBRE')
    if not nombre:
        return None

    # Omitir recetas peligrosas/prohibidas
    for palabra in OMITIR_NOMBRE:
        if palabra in nombre.upper():
            return None

    modulo_txt   = extrae(texto, 'MODULO')
    submodulo_txt = extrae(texto, 'SUBMODULO')

    if modulo_txt in OMITIR_MODULO:
        return None

    clave = (modulo_txt, submodulo_txt)
    destino = MAPA.get(clave)
    if destino is None:
        # Intentar match parcial de submodulo
        for (m, s), d in MAPA.items():
            if m == modulo_txt and (s in submodulo_txt or submodulo_txt in s):
                destino = d
                break
    if destino is None:
        print(f'  SIN MAPEO: {modulo_txt} | {submodulo_txt} → {os.path.basename(filepath)}')
        return None

    mk, sk = destino
    categoria = CAT_MAP.get(mk, 'General')

    origen       = extrae(texto, 'ORIGEN') or extrae(texto, 'DISTRIBUCIÓN') or 'Tradición chilena'
    indicacion   = extrae(texto, 'INDICACIÓN')
    dosis_raw    = extrae(texto, 'DOSIS')
    duracion     = extrae(texto, 'DURACIÓN MÁXIMA')
    contra       = extrae(texto, 'CONTRAINDICACIONES')
    fuente       = extrae(texto, 'FUENTE')
    planta       = extrae(texto, 'PLANTA')
    seguridad    = extrae(texto, 'NIVEL SEGURIDAD')

    ingredientes = extrae_bloque(texto, 'INGREDIENTES')
    preparacion  = extrae_bloque(texto, 'PREPARACIÓN') or extrae_bloque(texto, 'PREPARACION')

    dosis = dosis_raw
    if duracion:
        dosis = (dosis + ' — ' + duracion) if dosis else duracion

    mu = modo_uso(nombre)
    tp = tiempo_prep(mu)

    # Dificultad basada en tiempo
    if 'día' in tp or 'días' in tp or 'min' in tp and int(re.search(r'\d+', tp).group()) > 20:
        dif = 'Medio'
    else:
        dif = 'Fácil'

    rec = {
        'titulo':          nombre,
        'categoria':       categoria,
        'modulo':          mk,
        'submodulo':       sk,
        'origen':          origen,
        'ingredientes':    ingredientes,
        'preparacion':     preparacion,
        'dosis':           dosis,
        'modo_uso':        mu,
        'tiempo_prep':     tp,
        'dificultad':      dif,
        'rendimiento':     '1-2 porciones',
        'conservacion':    'Consumir el mismo día',
        'evidencia':       fuente or 'Medicina tradicional chilena',
        'fuente_tradicion': origen,
        'contraindicaciones': contra,
    }
    if indicacion:
        rec['uso'] = indicacion
    if planta:
        rec['planta_principal'] = planta
    if seguridad:
        rec['nivel_seguridad'] = seguridad

    return rec


# ── Main ─────────────────────────────────────────────────────────────────────
print('Cargando recetas.json...')
recetas = json.load(open(RECETAS_JSON, encoding='utf-8'))
id_max  = max(r['id'] for r in recetas)
titulos_existentes = {r['titulo'].lower().strip() for r in recetas}
print(f'  {len(recetas)} recetas, max ID={id_max}')

nuevas = []
omitidas = 0

for root, dirs, files in os.walk(NUEVOS_DIR):
    dirs.sort()
    for fname in sorted(files):
        if not fname.endswith('.txt'):
            continue
        if any(p in fname.lower() for p in ('advertencia', 'prohibida', 'lista')):
            omitidas += 1
            continue
        fpath = os.path.join(root, fname)
        rec = parsear(fpath)
        if rec is None:
            omitidas += 1
            continue
        titulo_norm = rec['titulo'].lower().strip()
        if titulo_norm in titulos_existentes:
            print(f'  DUPLICADO: {rec["titulo"][:60]}')
            omitidas += 1
            continue

        id_max += 1
        rec['id'] = id_max
        nuevas.append(rec)
        titulos_existentes.add(titulo_norm)
        print(f'  +{id_max} [{rec["modulo"]}/{rec["submodulo"]}] {rec["titulo"][:55]}')

print(f'\n{"="*60}')
print(f'Recetas nuevas: {len(nuevas)} | Omitidas: {omitidas}')

if not nuevas:
    print('Nada que agregar.')
    sys.exit(0)

recetas.extend(nuevas)
recetas.sort(key=lambda r: r['id'])

with open(RECETAS_JSON, 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)

print(f'✅ recetas.json actualizado: {len(recetas)} recetas totales')
print('\nEjecutar ahora: python3 crear_submodulos.py')
