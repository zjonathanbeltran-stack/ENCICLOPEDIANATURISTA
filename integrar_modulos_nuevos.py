"""
Parsea todos los .txt de data/MODULOS NUEVOS/ y los integra en data/recetas.json.
Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

CARPETA = 'data/MODULOS NUEVOS'

# Mapeo MODULO/SUBMODULO → categoria de recetas.json
CATEGORIA_MAP = {
    # Nervioso
    ('Nervioso', 'Ansiedad'):               'Sedante',
    ('Nervioso', 'Insomnio'):               'Sedante',
    ('Nervioso', 'Estrés'):                 'Sedante',
    ('Nervioso', 'Cefalea tensional'):      'Analgésico',
    ('Nervioso', 'Agotamiento mental'):     'Memoria',
    # Respiratorio
    ('Respiratorio', 'Bronquitis'):         'Respiratorio',
    ('Respiratorio', 'Congestión'):         'Respiratorio',
    ('Respiratorio', 'Sinusitis'):          'Respiratorio',
    ('Respiratorio', 'Faringitis'):         'Garganta',
    ('Respiratorio', 'Dolor de garganta'): 'Garganta',
    ('Respiratorio', 'Fiebre'):             'Febrífugo',
    ('Respiratorio', 'Antipirético'):       'Febrífugo',
    ('Respiratorio', 'Gripe'):              'Resfriados',
    ('Respiratorio', 'Resfriado'):          'Resfriados',
    ('Respiratorio', 'Tos'):                'Tos',
    ('Respiratorio', 'Antitusivo'):         'Tos',
    ('Respiratorio', 'Expectorante'):       'Expectorante',
    # Mujer y Maternal
    ('Mujer', 'Embarazo'):                  'Ginecológico',
    ('Mujer', 'Fertilidad'):                'Ginecológico',
    ('Mujer', 'Flujo Abundante'):           'Ginecológico',
    ('Mujer', 'Menorragia'):                'Ginecológico',
    ('Mujer', 'Menopausia'):                'Ginecológico',
    ('Mujer', 'Menstruación'):              'Ginecológico',
    ('Mujer', 'Dismenorrea'):               'Ginecológico',
    ('Mujer', 'Síndrome Premenstrual'):     'Ginecológico',
    ('Mujer', 'Salud Ginecológica'):        'Ginecológico',
    ('Mujer', 'Vaginosis Bacteriana'):      'Ginecológico',
    ('Mujer', 'Higiene íntima'):            'Ginecológico',
    ('Mujer', 'Sequedad vaginal'):          'Ginecológico',
    ('Mujer', 'Regulación Menstrual'):      'Ginecológico',
    ('Mujer', 'Flujo Vaginal'):             'Ginecológico',
    ('Maternal', 'Náuseas'):                'Ginecológico',
    ('Maternal', 'Galactógeno'):            'Ginecológico',
    ('Maternal', 'Estrías'):                'Cosmético',
    ('Maternal', 'Recuperación posparto'):  'Ginecológico',
    ('Maternal', 'Advertencias'):           None,  # saltear MAT-005
}

def get_categoria(modulo, submodulo):
    """Busca la categoría por claves normalizadas."""
    sub_norm = submodulo.replace('(', '').replace(')', '').strip()
    # Buscar por clave exacta
    for (m, s), cat in CATEGORIA_MAP.items():
        if m.lower() in modulo.lower():
            if s.lower() in sub_norm.lower():
                return cat
    # Fallback por módulo
    if 'mujer' in modulo.lower() or 'maternal' in modulo.lower():
        return 'Ginecológico'
    if 'nervioso' in modulo.lower():
        return 'Sedante'
    if 'respiratorio' in modulo.lower():
        return 'Respiratorio'
    return 'General'

def get_modo_uso(nombre, ingredientes, preparacion):
    """Infiere el modo de uso desde el texto."""
    texto = (nombre + ' ' + ingredientes + ' ' + preparacion).lower()
    if 'baño de asiento' in texto or 'compresa' in texto:
        return 'Uso externo'
    if 'aceite' in nombre.lower() and ('aplicar' in texto or 'tópico' in texto or 'piel' in texto):
        return 'Uso tópico'
    if 'cápsula' in texto or 'cápsulas' in texto:
        return 'Cápsulas'
    if 'decocción' in nombre.lower() or 'hervir' in texto:
        return 'Decocción'
    return 'Infusión'

def parse_campo(texto, campo):
    """Extrae el valor de un campo con regex."""
    patron = rf'{campo}:\s*(.+?)(?=\n[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]+:|$)'
    m = re.search(patron, texto, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1).strip().rstrip('=').strip()
    return ''

def limpiar(t):
    """Limpia saltos de línea y espacios extra."""
    return re.sub(r'\s+', ' ', t).strip()

def parse_txt(ruta):
    """Parsea un archivo .txt de MODULOS NUEVOS y retorna dict con campos normalizados."""
    with open(ruta, encoding='utf-8', errors='replace') as f:
        contenido = f.read()

    # Extraer campos del encabezado
    def campo_enc(clave):
        m = re.search(rf'^{clave}:\s*(.+)$', contenido, re.MULTILINE | re.IGNORECASE)
        return m.group(1).strip() if m else ''

    ficha_id    = campo_enc('ID')
    nombre      = campo_enc('NOMBRE')
    planta      = campo_enc('PLANTA') or campo_enc('PLANTAS')
    modulo      = campo_enc('MODULO')
    submodulo   = campo_enc('SUBMODULO')
    seguridad   = campo_enc('NIVEL SEGURIDAD')
    origen_raw  = campo_enc('ORIGEN')
    distribucion = campo_enc('DISTRIBUCIÓN') or campo_enc('DISTRIBUCION')

    # Saltar archivos de advertencia sin receta
    if not nombre or not ficha_id:
        return None
    if campo_enc('ADVERTENCIA') and not ficha_id:
        return None

    # Extraer secciones de texto libre
    def seccion(clave, siguiente=None):
        if siguiente:
            patron = rf'{clave}[:\s]*\n(.*?)(?={siguiente})'
        else:
            patron = rf'{clave}[:\s]*\n(.*?)(?=\n[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ ]+:|$)'
        m = re.search(patron, contenido, re.DOTALL | re.IGNORECASE)
        return m.group(1).strip() if m else ''

    indicacion    = limpiar(seccion('INDICACIÓN', 'INGREDIENTES'))
    ingredientes  = limpiar(seccion('INGREDIENTES', 'PREPARACIÓN'))
    preparacion   = limpiar(seccion('PREPARACIÓN', r'DOSIS|APLICACIÓN|DURACIÓN'))
    dosis_raw     = limpiar(seccion(r'DOSIS(?:\s+MÁXIMA)?', r'DURACIÓN|CONTRAINDICACIONES|INTERACCIONES'))
    duracion      = limpiar(campo_enc('DURACIÓN MÁXIMA') or seccion('DURACIÓN MÁXIMA', 'CONTRAINDICACIONES'))
    contraindic   = limpiar(seccion(r'CONTRAINDICACIONES(?: ABSOLUTAS)?', 'INTERACCIONES'))
    interacciones = limpiar(seccion('INTERACCIONES', r'EFECTOS|FUENTE'))
    efectos       = limpiar(seccion('EFECTOS SECUNDARIOS', 'FUENTE'))
    fuente        = limpiar(seccion('FUENTE', None))

    # Limpiar referencias del tipo [reference:N]
    fuente = re.sub(r'\[reference:\d+\]', '', fuente).strip()

    # Dosis: tomar solo primera línea si hay varias
    dosis_linea = dosis_raw.split('\n')[0].strip() if dosis_raw else ''

    # Modo de uso
    modo = get_modo_uso(nombre, ingredientes, preparacion)

    # Dificultad
    if 'hervir' in preparacion.lower() and len(preparacion) > 200:
        dificultad = 'Media'
    else:
        dificultad = 'Fácil'

    # Tiempo de preparación
    m_min = re.search(r'(\d+)[\s-]*minutos', contenido, re.IGNORECASE)
    tiempo = f"{m_min.group(1)} minutos" if m_min else '10-15 minutos'

    # Categoría
    categoria = get_categoria(modulo, submodulo)

    # Origen / fuente_tradicion
    if 'mapuche' in origen_raw.lower():
        fuente_trad = 'Medicina mapuche'
    elif 'chilena' in origen_raw.lower():
        fuente_trad = 'Tradición chilena'
    elif 'europea' in origen_raw.lower():
        fuente_trad = 'Fitoterapia europea'
    elif 'clínica' in origen_raw.lower() or 'ensayo' in origen_raw.lower():
        fuente_trad = 'Fitoterapia clínica'
    else:
        fuente_trad = origen_raw[:80] if origen_raw else 'Medicina tradicional'

    # Embarazo/lactancia info
    emb_lac = ''
    if '🛑' in seguridad or 'ALTO RIESGO' in seguridad.upper():
        emb_lac = 'CONTRAINDICADO en embarazo y lactancia. Alto riesgo.'
    elif 'Embarazo' in contraindic or 'embarazo' in contraindic:
        emb_lac = 'Contraindicado en embarazo.'
    elif 'apto embarazo' in contenido.lower():
        m_emb = re.search(r'APTO EMBARAZO:\s*(.+)', contenido, re.IGNORECASE)
        emb_lac = m_emb.group(1).strip() if m_emb else ''

    # Evidencia (resumen de fuente + indicación)
    evidencia = fuente[:200] if fuente else 'Uso tradicional documentado'

    return {
        '_id_modulo': ficha_id,
        '_modulo':    modulo,
        '_submodulo': submodulo,
        'titulo':           nombre,
        'categoria':        categoria,
        'origen':           origen_raw[:120] if origen_raw else 'Medicina tradicional',
        'ingredientes':     ingredientes,
        'preparacion':      preparacion,
        'dosis':            dosis_linea or dosis_raw[:150],
        'modo_uso':         modo,
        'tiempo_prep':      tiempo,
        'dificultad':       dificultad,
        'rendimiento':      '1-2 tazas',
        'conservacion':     'Consumir inmediatamente.',
        'evidencia':        evidencia,
        'fuente_tradicion': fuente_trad,
        'contraindicaciones': contraindic[:300] if contraindic else '',
        'uso':              indicacion[:300] if indicacion else '',
        'principios_activos': '',
        'propiedades':      '',
        'referencias':      fuente[:300] if fuente else '',
        'indicaciones_principales': indicacion[:200] if indicacion else '',
        'interacciones_medicamentos': interacciones[:300] if interacciones else '',
        'embarazo_lactancia': emb_lac,
        'duracion_tratamiento': duracion[:150] if duracion else '',
        'sinergia_plantas': '',
        'nivel_seguridad':  seguridad,
        'distribucion':     distribucion[:150] if distribucion else '',
        'efectos_secundarios': efectos[:200] if efectos else '',
    }

# ── Leer todos los .txt ──────────────────────────────────────────────────────
fichas_nuevas = []
ids_vistos = set()

for raiz, dirs, archivos in os.walk(CARPETA):
    dirs.sort()
    for archivo in sorted(archivos):
        if not archivo.endswith('.txt'):
            continue
        ruta = os.path.join(raiz, archivo)
        ficha = parse_txt(ruta)
        if not ficha:
            print(f'  SALTADO (sin receta): {archivo}')
            continue
        if not ficha['titulo']:
            print(f'  SALTADO (sin título): {archivo}')
            continue
        if ficha['categoria'] is None:
            print(f'  SALTADO (advertencia): {archivo}')
            continue
        # Evitar duplicados por ID de módulo
        mid = ficha.pop('_id_modulo')
        ficha.pop('_modulo', None)
        ficha.pop('_submodulo', None)
        if mid in ids_vistos:
            print(f'  DUPLICADO: {mid} ({ficha["titulo"][:40]})')
            continue
        ids_vistos.add(mid)
        fichas_nuevas.append(ficha)
        print(f'  OK: {mid} — {ficha["titulo"][:55]}')

print(f'\nFichas a integrar: {len(fichas_nuevas)}')

# ── Cargar recetas.json ───────────────────────────────────────────────────────
recetas = json.load(open('data/recetas.json', encoding='utf-8'))
max_id = max(r['id'] for r in recetas)
print(f'Recetas existentes: {len(recetas)}, max ID: {max_id}')

# Títulos existentes para evitar duplicados exactos
titulos_existentes = {r.get('titulo','').lower().strip() for r in recetas}

añadidas = 0
for ficha in fichas_nuevas:
    titulo_norm = ficha['titulo'].lower().strip()
    if titulo_norm in titulos_existentes:
        print(f'  YA EXISTE: {ficha["titulo"][:50]}')
        continue
    max_id += 1
    ficha['id'] = max_id
    recetas.append(ficha)
    titulos_existentes.add(titulo_norm)
    añadidas += 1

print(f'\nRecetas añadidas: {añadidas}')
print(f'Total final: {len(recetas)}')

with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)
print('Guardado data/recetas.json')
