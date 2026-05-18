"""
Crea la arquitectura de submódulos: data/modulos/{modulo}/{submodulo}/recetas.json
Fuentes:
  1. Recetas existentes en los archivos monolíticos (nervioso.json, mujer.json, etc.)
  2. Recetas nuevas ya integradas en recetas.json (IDs > 1058)
  3. Archivos .txt de MODULOS NUEVOS (con campos MODULO/SUBMODULO ya definidos)

Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys, os, re, unicodedata, shutil
sys.stdout.reconfigure(encoding='utf-8')

MODULOS_DIR  = 'data/modulos'
RECETAS_JSON = 'data/recetas.json'
NUEVOS_DIR   = 'data/MODULOS NUEVOS'

# ── Normalización ────────────────────────────────────────────────────────────
def slug(txt):
    """Convierte texto a slug ASCII sin tildes ni espacios."""
    txt = unicodedata.normalize('NFD', txt)
    txt = ''.join(c for c in txt if unicodedata.category(c) != 'Mn')
    txt = txt.lower()
    txt = re.sub(r'[^a-z0-9]+', '_', txt)
    return txt.strip('_')

def norm(txt):
    """Normaliza para búsqueda: minúsculas, sin tildes."""
    t = unicodedata.normalize('NFD', str(txt or ''))
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return t.lower()

# ── Clasificación de recetas existentes en submódulos ───────────────────────
def clasificar_receta(r):
    """Devuelve (modulo_key, submodulo_key) para una receta del corpus existente."""
    cat   = r.get('categoria', '')
    titulo = norm(r.get('titulo', ''))
    prep   = norm(r.get('preparacion', ''))
    ing    = norm(r.get('ingredientes', ''))
    origen = norm(r.get('origen', ''))
    uso    = norm(r.get('dosis', '') + ' ' + r.get('evidencia', ''))
    blob   = titulo + ' ' + prep + ' ' + ing + ' ' + uso

    def hit(*kws):
        return any(kw in blob for kw in kws)

    # ── MAPUCHE ──────────────────────────────────────────────────────────────
    if cat == 'Medicina Mapuche':
        return ('mapuche', 'medicina_mapuche')
    if cat == 'Espiritual':
        return ('mapuche', 'espiritual_ritual')

    # ── NERVIOSO ─────────────────────────────────────────────────────────────
    if cat in ('Sedante', 'Nervioso', 'Memoria'):
        if cat == 'Memoria' or hit('memor', 'concentr', 'cognit', 'mental', 'cerebr'):
            return ('nervioso', 'memoria_concentracion')
        if hit('insomnio', 'sueño', 'dormir', 'sedant', 'somnif'):
            return ('nervioso', 'insomnio')
        if hit('ansied', 'estres', 'nervios', 'tension', 'nervio'):
            return ('nervioso', 'estres_ansiedad')
        if hit('animo', 'depres', 'melanc', 'fatiga', 'agotam', 'burnout', 'tristez'):
            return ('nervioso', 'animo_depresion')
        return ('nervioso', 'estres_ansiedad')

    # ── DIGESTIVO ────────────────────────────────────────────────────────────
    if cat in ('Digestivo', 'Hepático', 'Diarrea', 'Antiparasitario', 'Nutritivo', 'Alimenticio'):
        if cat in ('Nutritivo', 'Alimenticio') or hit('nutrit', 'aliment', 'vitamina', 'mineral', 'superalim'):
            return ('digestivo', 'nutricion')
        if cat == 'Antiparasitario' or hit('parasit', 'lombriz', 'oxiur', 'tenia', 'giardia', 'ameba'):
            return ('digestivo', 'parasitos')
        if cat in ('Hepático',) or hit('higado', 'hepat', 'vesicula', 'bilis', 'hepatic', 'detox'):
            return ('digestivo', 'higado_vesicula')
        if cat == 'Diarrea' or hit('diarrea', 'astringen', 'heces'):
            return ('digestivo', 'diarrea')
        if hit('gastrit', 'acidez', 'reflujo', 'ulcera'):
            return ('digestivo', 'gastritis_acidez')
        if hit('estrenim', 'constip', 'laxant', 'estreñim'):
            return ('digestivo', 'estrenimiento')
        if hit('colico', 'gases', 'meteoris', 'flatulen', 'carminat'):
            return ('digestivo', 'colicos_gases')
        if hit('nausea', 'vomit', 'indiges'):
            return ('digestivo', 'nauseas_indigestion')
        return ('digestivo', 'digestion_lenta')

    # ── RESPIRATORIO ─────────────────────────────────────────────────────────
    if cat in ('Respiratorio', 'Tos', 'Expectorante', 'Resfriados', 'Garganta', 'Febrífugo'):
        if hit('fiebre', 'antipir', 'febrif', 'calent', 'diafor'):
            return ('respiratorio', 'fiebre')
        if cat == 'Garganta' or hit('gargant', 'faringi', 'amigdal', 'gargara'):
            return ('respiratorio', 'garganta_faringitis')
        if cat == 'Expectorante' or hit('bronquit', 'expector', 'flema', 'moco', 'pecto'):
            return ('respiratorio', 'bronquitis_expectorante')
        if hit('sinusit', 'congestion', 'nariz', 'senos paranas'):
            return ('respiratorio', 'congestion_sinusitis')
        if cat == 'Tos' or hit(' tos ', 'antitus', 'tos seca', 'tos grasa'):
            return ('respiratorio', 'tos')
        if cat == 'Resfriados' or hit('resfri', 'gripe', 'catarro', 'influenz'):
            return ('respiratorio', 'gripe_resfrios')
        return ('respiratorio', 'respiratorio_general')

    # ── PIEL ─────────────────────────────────────────────────────────────────
    if cat in ('Dermatológico', 'Cicatrizante', 'Cosmético', 'Cabello', 'Baño', 'Antifúngico'):
        if cat == 'Baño':
            return ('piel', 'banos_terapeuticos')
        if cat == 'Cabello' or hit('cabello', 'cabell', 'pelo', 'caspa', 'cuero cabellu'):
            return ('piel', 'cabello')
        if cat in ('Cosmético',) or hit('mascaril', 'crema', 'tonico', 'cosmet', 'tratam facial'):
            return ('piel', 'cosmetica_piel')
        if cat == 'Antifúngico' or hit('hongo', 'candida', 'pie de atleta', 'tiña', 'infeccion'):
            return ('piel', 'hongos_infecciones')
        if cat == 'Cicatrizante' or hit('herida', 'cicatriz', 'quemad', 'golpe', 'contusion', 'llaga'):
            return ('piel', 'heridas_cicatrices')
        if hit('eccema', 'acne', 'dermatit', 'psoriasis', 'urtic', 'sarpull'):
            return ('piel', 'problemas_piel')
        return ('piel', 'problemas_piel')

    # ── MUJER ────────────────────────────────────────────────────────────────
    if cat in ('Ginecológico',):
        if hit('menopaus', 'sofoco', 'climater', 'climaterio'):
            return ('mujer', 'menopausia')
        if hit('lactancia', 'leche materna', 'postparto', 'posparto', 'galacto', 'mastit'):
            return ('mujer', 'postparto_lactancia')
        if hit('menstrual', 'menstruac', 'ciclo', 'spm', 'dismenorr', 'dolor pelvic', 'regla'):
            return ('mujer', 'menstruacion_spm')
        return ('mujer', 'salud_ginecologica')

    # ── CARDIOVASCULAR ───────────────────────────────────────────────────────
    if cat in ('Cardiovascular', 'Renal', 'Diurético'):
        if cat == 'Diurético' or hit('diureti', 'retencion', 'edema', 'hinchaz'):
            return ('cardiovascular', 'diuretico')
        if cat == 'Renal' or hit('riñon', 'calculo renal', 'nefr', 'infeccion urinaria', 'vejiga'):
            return ('cardiovascular', 'rinones')
        if hit('colesterol', 'triglicer', 'ldl', 'hdl'):
            return ('cardiovascular', 'colesterol')
        if hit('presion', 'hipertens', 'antihipert'):
            return ('cardiovascular', 'presion_arterial')
        if hit('vari', 'circulac', 'piernas cansad', 'flebitis'):
            return ('cardiovascular', 'circulacion_varices')
        if hit('palpitac', 'arritm', 'taquicard', 'corazon'):
            return ('cardiovascular', 'palpitaciones_corazon')
        if hit('anemia', 'sangre', 'antioxid', 'hemoglob'):
            return ('cardiovascular', 'sangre_antioxidantes')
        return ('cardiovascular', 'sangre_antioxidantes')

    # ── DOLORES ──────────────────────────────────────────────────────────────
    if cat in ('Analgésico', 'Antiinflamatorio', 'Reumatismo', 'Dental'):
        if cat == 'Dental' or hit('muelas', 'encias', 'encía', 'dental', 'diente', 'boca'):
            return ('dolores', 'salud_bucal')
        if cat == 'Antiinflamatorio' and not hit('reuma', 'artrit', 'articulac'):
            return ('dolores', 'antiinflamatorio')
        if cat == 'Reumatismo' or hit('reuma', 'artrit', 'gota', 'articulac', 'artros'):
            return ('dolores', 'reumatismo_artritis')
        if hit('cabeza', 'jaquec', 'migran', 'cefale', 'migran'):
            return ('dolores', 'dolor_cabeza_migrana')
        if hit('muscul', 'lumbar', 'lumbal', 'contract', 'espalda', 'tendon', 'neuralg'):
            return ('dolores', 'dolor_muscular_lumbago')
        if hit('antiinflamator', 'inflam'):
            return ('dolores', 'antiinflamatorio')
        return ('dolores', 'dolor_cronico_general')

    # ── PEDIÁTRICO ───────────────────────────────────────────────────────────
    if cat == 'Pediátrico':
        if hit('colico', 'gas', 'diges', 'estomac'):
            return ('pediatrico', 'colicos_digestion')
        if hit('fiebre', 'resfri', 'tos', 'bronquit'):
            return ('pediatrico', 'fiebre_resfriado')
        if hit('pañal', 'eccema', 'denticion', 'piel', 'acne'):
            return ('pediatrico', 'piel_cuidado')
        if hit('insomnio', 'nervios', 'hiperact', 'sueño', 'dormir'):
            return ('pediatrico', 'nervioso_sueno')
        return ('pediatrico', 'colicos_digestion')

    # ── ALERGIA / GENERAL ────────────────────────────────────────────────────
    if cat == 'Alergia':
        return ('general', 'alergia')
    if cat == 'Energizante':
        return ('general', 'energizante_vitalidad')
    if cat in ('Oftalmológico', 'Oídos'):
        return ('general', 'ojos_oidos')

    # Fallback: general
    return ('general', 'bienestar_general')


# ── Mapeo MODULO/SUBMODULO de archivos .txt → keys de submódulo ─────────────
MODULO_TXT_MAP = {
    # Nervioso
    ('Nervioso', 'Ansiedad'):                       ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Ansiedad / Estrés'):               ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Ansiedad / Insomnio'):             ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Estrés'):                          ('nervioso', 'estres_ansiedad'),
    ('Nervioso', 'Insomnio'):                        ('nervioso', 'insomnio'),
    ('Nervioso', 'Cefalea tensional'):               ('dolores', 'dolor_cabeza_migrana'),
    ('Nervioso', 'Agotamiento mental / Concentración'): ('nervioso', 'memoria_concentracion'),
    # Respiratorio
    ('Respiratorio', 'Gripe / Resfriado'):           ('respiratorio', 'gripe_resfrios'),
    ('Respiratorio', 'Bronquitis / Resfriado'):      ('respiratorio', 'bronquitis_expectorante'),
    ('Respiratorio', 'Tos / Antitusivo'):            ('respiratorio', 'tos'),
    ('Respiratorio', 'Tos / Catarro'):               ('respiratorio', 'tos'),
    ('Respiratorio', 'Tos / Resfriado'):             ('respiratorio', 'tos'),
    ('Respiratorio', 'Bronquitis / Expectorante'):   ('respiratorio', 'bronquitis_expectorante'),
    ('Respiratorio', 'Congestión / Sinusitis'):      ('respiratorio', 'congestion_sinusitis'),
    ('Respiratorio', 'Faringitis / Dolor de garganta'): ('respiratorio', 'garganta_faringitis'),
    ('Respiratorio', 'Fiebre / Antipirético'):       ('respiratorio', 'fiebre'),
    # Mujer
    ('Mujer', 'Menopausia (Sofocos y ansiedad)'):    ('mujer', 'menopausia'),
    ('Mujer', 'Menopausia (Sofocos)'):               ('mujer', 'menopausia'),
    ('Mujer', 'Menopausia (Insomnio y ansiedad)'):   ('mujer', 'menopausia'),
    ('Mujer', 'Menopausia (Cambios de humor y regulación)'): ('mujer', 'menopausia'),
    ('Mujer', 'Menstruación (Dismenorrea)'):          ('mujer', 'menstruacion_spm'),
    ('Mujer', 'Menstruación (Síndrome Premenstrual)'): ('mujer', 'menstruacion_spm'),
    ('Mujer', 'Flujo Abundante (Menorragia)'):        ('mujer', 'menstruacion_spm'),
    ('Mujer', 'Salud Ginecológica (Vaginosis Bacteriana)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Higiene Íntima)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Sequedad vaginal)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Infección Urinaria y Flujo)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Regulación Menstrual)'): ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Salud Ginecológica (Flujo Vaginal)'):  ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Fertilidad'):                          ('mujer', 'salud_ginecologica'),
    ('Mujer', 'Embarazo (Náuseas)'):                  ('mujer', 'postparto_lactancia'),
    # Maternal
    ('Maternal', 'Náuseas y vómitos del embarazo'):  ('mujer', 'postparto_lactancia'),
    ('Maternal', 'Galactógeno (producción de leche)'):('mujer', 'postparto_lactancia'),
    ('Maternal', 'Cuidado de la piel / Estrías'):    ('mujer', 'postparto_lactancia'),
    ('Maternal', 'Recuperación posparto / Aporte de hierro'): ('mujer', 'postparto_lactancia'),
    ('Maternal', 'Advertencias'):                    None,  # skip advertencias
    # Digestivo
    ('Digestivo', 'Cólicos y Gases'):                ('digestivo', 'colicos_gases'),
    ('Digestivo', 'Náuseas'):                         ('digestivo', 'nauseas_indigestion'),
    ('Digestivo', 'Hígado'):                          ('digestivo', 'higado_vesicula'),
    ('Digestivo', 'Parásitos'):                       ('digestivo', 'parasitos'),
    ('Digestivo', 'Vesícula'):                        ('digestivo', 'higado_vesicula'),
    ('Digestivo', 'Gastritis'):                       ('digestivo', 'gastritis_acidez'),
    ('Digestivo', 'Gases'):                           ('digestivo', 'colicos_gases'),
    ('Digestivo', 'Diarrea'):                         ('digestivo', 'diarrea'),
    ('Digestivo', 'Acidez y Reflujo'):               ('digestivo', 'gastritis_acidez'),
    ('Digestivo', 'Estreñimiento'):                   ('digestivo', 'estrenimiento'),
    ('Digestivo', 'Digestión Lenta'):                 ('digestivo', 'digestion_lenta'),
    # Dolores y Reumatismo
    ('Dolores y Reumatismo', 'Dolores musculares'):   ('dolores', 'dolor_muscular_lumbago'),
    ('Dolores y Reumatismo', 'Golpes y contusiones'): ('dolores', 'dolor_muscular_lumbago'),
    ('Dolores y Reumatismo', 'Dolores reumáticos y articulares'): ('dolores', 'reumatismo_artritis'),
    ('Dolores y Reumatismo', 'Contracturas musculares'): ('dolores', 'dolor_muscular_lumbago'),
    ('Dolores y Reumatismo', 'Artritis y dolor articular crónico'): ('dolores', 'reumatismo_artritis'),
    # Piel y Heridas
    ('Piel y Heridas', 'Quemaduras leves'):           ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Heridas y picaduras'):        ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Heridas y cicatrización'):   ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Hemorragias menores'):        ('piel', 'heridas_cicatrices'),
    ('Piel y Heridas', 'Inflamación cutánea y eccemas'): ('piel', 'problemas_piel'),
    # Sistema Urinario
    ('Sistema Urinario', 'Próstata / HPB'):           ('cardiovascular', 'rinones'),
    ('Sistema Urinario', 'Retención de líquidos / Depurativo'): ('cardiovascular', 'diuretico'),
    ('Sistema Urinario', 'Retención de líquidos / Diurético'): ('cardiovascular', 'diuretico'),
    ('Sistema Urinario', 'Cálculos renales / Diurético suave'): ('cardiovascular', 'rinones'),
    ('Sistema Urinario', 'Infección urinaria / Diurético'): ('cardiovascular', 'rinones'),
    # Pediátrico
    ('Pediátrico', 'Inquietud / Dificultad para dormir'): ('pediatrico', 'nervioso_sueno'),
    ('Pediátrico', 'Cólicos del lactante'):           ('pediatrico', 'colicos_digestion'),
    ('Pediátrico', 'Cólicos / Malestar general'):    ('pediatrico', 'colicos_digestion'),
    ('Pediátrico', 'Dentición'):                      ('pediatrico', 'piel_cuidado'),
    ('Pediátrico', 'Tos y resfriado'):               ('pediatrico', 'fiebre_resfriado'),
    # Complementario y Nutricional
    ('Complementario y Nutricional', 'Aporte nutricional / Metabolismo'): ('digestivo', 'nutricion'),
    ('Complementario y Nutricional', 'Digestivo / Astringente'):          ('digestivo', 'digestion_lenta'),
    ('Complementario y Nutricional', 'Vitamínico / Refuerzo inmunológico'): ('general', 'bienestar_general'),
    ('Complementario y Nutricional', 'Antioxidante / Astringente'):       ('general', 'bienestar_general'),
    ('Complementario y Nutricional', 'Antioxidante / Antiinflamatorio'):  ('general', 'bienestar_general'),
    # Alto Riesgo → usar categoría con nota de advertencia en la receta
    ('Alto Riesgo', 'Dolores articulares (SOLO USO EXTERNO DILUIDO)'):    ('dolores', 'reumatismo_artritis'),
    ('Alto Riesgo', 'Heridas y afecciones cutáneas (USO EXTERNO PUNTUAL)'): ('piel', 'heridas_cicatrices'),
    ('Alto Riesgo', 'Dolores reumáticos (SOLO USO EXTERNO)'):             ('dolores', 'reumatismo_artritis'),
    ('Alto Riesgo', 'Parásitos (solo bajo supervisión)'):                  ('digestivo', 'parasitos'),
    ('Alto Riesgo', 'NINGUNO (PLANTA PROHIBIDA PARA USO INTERNO)'):       None,  # skip
}


# ── Parsear un archivo .txt de MODULOS NUEVOS ────────────────────────────────
def parsear_txt(filepath):
    """Lee un .txt y devuelve un dict con los campos de la receta + MODULO/SUBMODULO."""
    with open(filepath, encoding='utf-8') as f:
        texto = f.read()

    def extrae(campo, siguiente=None):
        """Extrae el valor de un campo del archivo .txt."""
        patron = rf'^{re.escape(campo)}:\s*(.+?)(?=\n[A-ZÁÉÍÓÚÑÜ ]+:|\n=====|\Z)'
        m = re.search(patron, texto, re.MULTILINE | re.DOTALL)
        if m:
            return m.group(1).strip()
        return ''

    def extrae_bloque(inicio, fin_patrones):
        """Extrae un bloque de texto entre dos patrones."""
        pat = rf'{re.escape(inicio)}:\n(.*?)(?=\n[A-ZÁÉÍÓÚÑÜ /]+:|\n====|\Z)'
        m = re.search(pat, texto, re.DOTALL)
        if m:
            return m.group(1).strip()
        return ''

    # Campos básicos
    id_txt    = extrae('ID')
    nombre    = extrae('NOMBRE')
    planta    = extrae('PLANTA')
    origen    = extrae('ORIGEN') or extrae('DISTRIBUCIÓN') or 'Tradición chilena'
    modulo    = extrae('MODULO')
    submodulo = extrae('SUBMODULO')
    seguridad = extrae('NIVEL SEGURIDAD')
    indicacion = extrae('INDICACIÓN')
    dosis     = extrae('DOSIS')
    duracion  = extrae('DURACIÓN MÁXIMA')
    contra    = extrae('CONTRAINDICACIONES')
    interacc  = extrae('INTERACCIONES')
    efectos   = extrae('EFECTOS SECUNDARIOS')
    fuente    = extrae('FUENTE')

    # Ingredientes (bloque multi-línea)
    m = re.search(r'INGREDIENTES:\n(.*?)(?=\n[A-ZÁÉÍÓÚÑÜ /]+:|\n====|\Z)', texto, re.DOTALL)
    ingredientes = m.group(1).strip() if m else ''

    # Preparación (bloque multi-línea)
    m = re.search(r'PREPARACI[ÓO]N:\n(.*?)(?=\nDOSIS:|\n====|\Z)', texto, re.DOTALL)
    preparacion = m.group(1).strip() if m else ''

    if not nombre or not modulo:
        return None

    r = {
        'titulo': nombre,
        'categoria': _modulo_a_categoria(modulo, submodulo),
        'origen': origen,
        'ingredientes': ingredientes,
        'preparacion': preparacion,
        'dosis': (dosis + (' — ' + duracion if duracion else '')) if dosis else '',
        'modo_uso': 'Infusión',
        'tiempo_prep': '10-15 min',
        'dificultad': 'Fácil',
        'rendimiento': '1-2 tazas',
        'conservacion': 'Consumir el mismo día',
        'evidencia': fuente or 'Medicina tradicional chilena',
        'fuente_tradicion': origen,
        'contraindicaciones': contra,
        '_modulo': modulo,
        '_submodulo': submodulo,
        '_seguridad': seguridad,
        '_indicacion': indicacion,
        '_planta': planta,
        '_interacciones': interacc,
        '_efectos_secundarios': efectos,
    }
    return r


def _modulo_a_categoria(modulo, submodulo):
    CAT_MAP = {
        'Nervioso': 'Nervioso',
        'Respiratorio': 'Respiratorio',
        'Mujer': 'Ginecológico',
        'Maternal': 'Ginecológico',
        'Digestivo': 'Digestivo',
        'Dolores y Reumatismo': 'Reumatismo',
        'Piel y Heridas': 'Dermatológico',
        'Sistema Urinario': 'Diurético',
        'Pediátrico': 'Pediátrico',
        'Complementario y Nutricional': 'General',
        'Alto Riesgo': 'General',
    }
    return CAT_MAP.get(modulo, 'General')


# ── Cargar todas las recetas existentes ─────────────────────────────────────
print('Cargando recetas.json...')
recetas_all = json.load(open(RECETAS_JSON, encoding='utf-8'))
id_max = max(r['id'] for r in recetas_all)
print(f'  Total: {len(recetas_all)} recetas, max ID={id_max}')

# IDs ya en recetas.json (para no duplicar desde txt)
ids_en_recetas = {r['id'] for r in recetas_all}

# ── Agrupar recetas existentes en submódulos ─────────────────────────────────
submod_buckets = {}  # clave: (modulo, submodulo) → lista de recetas

for r in recetas_all:
    # Si la receta ya tiene modulo/submodulo explícitos, respetarlos
    if r.get('modulo') and r.get('submodulo'):
        mk, sk = r['modulo'], r['submodulo']
    else:
        mk, sk = clasificar_receta(r)
    submod_buckets.setdefault((mk, sk), []).append(r)

print(f'\nRecetas existentes clasificadas en {len(submod_buckets)} submódulos.')

# ── Parsear archivos .txt de MODULOS NUEVOS ──────────────────────────────────
print('\nParsando archivos .txt de MODULOS NUEVOS...')
txt_recetas = []
skipped = 0
for root, dirs, files in os.walk(NUEVOS_DIR):
    dirs.sort()
    for fname in sorted(files):
        if not fname.endswith('.txt'):
            continue
        if 'advertencia' in fname.lower() or 'prohibida' in fname.lower():
            skipped += 1
            continue
        fpath = os.path.join(root, fname)
        rec = parsear_txt(fpath)
        if not rec:
            print(f'  SKIP (sin datos): {fname}')
            skipped += 1
            continue
        modulo_txt   = rec.pop('_modulo')
        submodulo_txt = rec.pop('_submodulo')
        seguridad    = rec.pop('_seguridad', '')
        indicacion   = rec.pop('_indicacion', '')
        planta       = rec.pop('_planta', '')
        interacc     = rec.pop('_interacciones', '')
        efectos      = rec.pop('_efectos_secundarios', '')

        # Determinar submódulo destino
        key = (modulo_txt, submodulo_txt)
        destino = MODULO_TXT_MAP.get(key)
        if destino is None:
            # advertencia / skip explícito
            print(f'  SKIP (prohibida/advertencia): {fname}')
            skipped += 1
            continue
        if destino == 'NOTFOUND':
            print(f'  SIN MAPEO: {modulo_txt} | {submodulo_txt} → {fname}')
            destino = ('general', 'bienestar_general')

        # Asignar ID (temporal para el submódulo — los IDs finales son los de recetas.json)
        id_max += 1
        rec['id'] = id_max

        # Enriquecer con datos extras del .txt
        if indicacion:
            rec['uso'] = indicacion
        if planta:
            rec['planta_principal'] = planta
        if interacc:
            rec['interacciones'] = interacc
        if efectos:
            rec['efectos_secundarios_nota'] = efectos
        if seguridad:
            rec['nivel_seguridad'] = seguridad

        txt_recetas.append((destino, rec))
        print(f'  OK: [{modulo_txt} / {submodulo_txt}] → {destino[0]}/{destino[1]} | {rec["titulo"][:50]}')

print(f'\nArchivos .txt procesados: {len(txt_recetas)} recetas | {skipped} omitidos')

# Agregar recetas txt a sus buckets
for (mk, sk), rec in txt_recetas:
    submod_buckets.setdefault((mk, sk), []).append(rec)

# ── Crear estructura de directorios y guardar JSON ───────────────────────────
print('\nCreando archivos de submódulos...')
total_archivos = 0
total_recetas_escritas = 0

for (mk, sk), recetas in sorted(submod_buckets.items()):
    dirpath = os.path.join(MODULOS_DIR, mk, sk)
    os.makedirs(dirpath, exist_ok=True)
    fpath = os.path.join(dirpath, 'recetas.json')
    payload = {'modulo': mk, 'submodulo': sk, 'recetas': recetas}
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f'  {mk}/{sk}/recetas.json — {len(recetas)} recetas')
    total_archivos += 1
    total_recetas_escritas += len(recetas)

print(f'\n✅ {total_archivos} archivos de submódulo creados')
print(f'✅ {total_recetas_escritas} recetas en total (con superposición por categoría)')

# ── Sincronizar al worktree ──────────────────────────────────────────────────
WORKTREE = '.claude/worktrees/goofy-leavitt-dbc53f/data/modulos'
if os.path.isdir(WORKTREE):
    for mk_sk, _ in submod_buckets.items():
        mk, sk = mk_sk
        src_dir = os.path.join(MODULOS_DIR, mk, sk)
        dst_dir = os.path.join(WORKTREE, mk, sk)
        os.makedirs(dst_dir, exist_ok=True)
        shutil.copy2(os.path.join(src_dir, 'recetas.json'),
                     os.path.join(dst_dir, 'recetas.json'))
    print(f'\n✅ Sincronizado al worktree: {WORKTREE}')
else:
    print(f'\n⚠ Worktree no encontrado: {WORKTREE}')
