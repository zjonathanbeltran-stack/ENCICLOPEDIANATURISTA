#!/usr/bin/env python3
"""
clasificar_recetas_viejas.py
Asigna modulo + submodulo a las recetas que aún no los tienen,
usando la categoria y keywords del titulo/ingredientes.
"""
import json, re, unicodedata
from pathlib import Path

# ── Normalizar texto ─────────────────────────────────────────────────
def norm(t):
    t = (t or '').lower()
    t = unicodedata.normalize('NFD', t)
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return t

def contiene(texto, *palabras):
    t = norm(texto)
    return any(p in t for p in palabras)

# ── Mapeo por submodulo con keywords ─────────────────────────────────

def submod_digestivo(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'gastritis', 'acidez', 'reflujo', 'ulcera', 'ardor estomacal'):
        return 'gastritis_acidez'
    if contiene(t, 'estrenimiento', 'laxante', 'estreni', 'evacuacion', 'transito intestinal', 'ciruelas'):
        return 'estrenimiento'
    if contiene(t, 'diarrea', 'deposicion', 'colitis'):
        return 'diarrea'
    if contiene(t, 'parasito', 'lombriz', 'ascaris', 'oxiuro', 'tenia', 'antiparasitario'):
        return 'parasitos'
    if contiene(t, 'nausea', 'vomito', 'mareo', 'indigestion', 'empacho'):
        return 'nauseas_indigestion'
    if contiene(t, 'higado', 'vesicula', 'bilis', 'hepatico', 'hepatitis', 'colagogo', 'coletico'):
        return 'higado_vesicula'
    if contiene(t, 'colico', 'gases', 'meteorismo', 'flatulencia', 'aerofagia', 'hinchaz'):
        return 'colicos_gases'
    if contiene(t, 'apetito', 'nutricion', 'desnutricion', 'nutritivo', 'vitamina', 'proteina', 'hierro', 'mineral'):
        return 'nutricion'
    return 'digestion_lenta'  # default digestivo

def submod_nervioso(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'insomnio', 'dormir', 'sueno', 'conciliar el sueno', 'nocturno'):
        return 'insomnio'
    if contiene(t, 'memoria', 'concentracion', 'estudio', 'cognitivo', 'cerebro', 'mental'):
        return 'memoria_concentracion'
    if contiene(t, 'depresion', 'tristeza', 'animo', 'melancolia', 'burnout', 'decaimiento'):
        return 'animo_depresion'
    return 'estres_ansiedad'  # default nervioso

def submod_cardiovascular(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'colesterol', 'triglicerido', 'ldl'):
        return 'colesterol'
    if contiene(t, 'presion', 'hipertension', 'antihipertensivo'):
        return 'presion_arterial'
    if contiene(t, 'circulacion', 'varice', 'varices', 'venas', 'piernas cansadas', 'flebitis'):
        return 'circulacion_varices'
    if contiene(t, 'palpitacion', 'corazon', 'taquicardia', 'arritmia', 'latidos'):
        return 'palpitaciones_corazon'
    if contiene(t, 'rinon', 'renal', 'calculo', 'prostata', 'urinario', 'vejiga'):
        return 'rinones'
    if contiene(t, 'diuretico', 'retencion', 'edema', 'hinchaz'):
        return 'diuretico'
    if contiene(t, 'sangre', 'anemia', 'hemoglobina', 'antioxidante', 'diabetes', 'glucosa', 'azucar'):
        return 'sangre_antioxidantes'
    return 'sangre_antioxidantes'  # default cardiovascular

def submod_general(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'alergia', 'alergico', 'urticaria', 'rinitis alergica'):
        return 'alergia'
    if contiene(t, 'ojo', 'vista', 'conjuntivitis', 'oido', 'audicion'):
        return 'ojos_oidos'
    if contiene(t, 'energia', 'vitalidad', 'fatiga', 'cansancio', 'vigor', 'fortaleza', 'tonico'):
        return 'energizante_vitalidad'
    return 'bienestar_general'  # default general

def submod_ginecologico(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'menopausia', 'sofoco', 'climaterio', 'postmenopaus'):
        return 'menopausia'
    if contiene(t, 'postparto', 'lactancia', 'leche materna', 'galacto', 'amamantar', 'posparto'):
        return 'postparto_lactancia'
    if contiene(t, 'flujo', 'vaginal', 'vaginitis', 'candida', 'ginecologico', 'pelv'):
        return 'salud_ginecologica'
    return 'menstruacion_spm'  # default ginecológico

def submod_pediatrico(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'fiebre', 'resfriado', 'gripe', 'tos', 'bebe enfermo', 'nino enfermo'):
        return 'fiebre_resfriado'
    if contiene(t, 'piel bebe', 'piel del bebe', 'dermatitis', 'panal', 'irritacion bebe', 'eccema'):
        return 'piel_cuidado'
    if contiene(t, 'sueno', 'dormir', 'insomnio', 'nervioso', 'calmar nino', 'tranquilizar'):
        return 'nervioso_sueno'
    return 'colicos_digestion'  # default pediátrico

def submod_respiratorio(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'fiebre', 'febrifugo', 'antipiretico', 'temperatura'):
        return 'fiebre'
    if contiene(t, 'garganta', 'faringitis', 'amigdalas', 'gargaras', 'angina'):
        return 'garganta_faringitis'
    if contiene(t, 'congestion', 'sinusitis', 'nariz', 'moco', 'catarro nasal'):
        return 'congestion_sinusitis'
    if contiene(t, 'bronquitis', 'bronquial', 'expectorante', 'flema', 'mucosidad'):
        return 'bronquitis_expectorante'
    if contiene(t, 'tos', 'jarabe para la tos', 'antitusivo'):
        return 'tos'
    if contiene(t, 'gripe', 'resfriado', 'catarro', 'influenza'):
        return 'gripe_resfrios'
    return 'respiratorio_general'  # default respiratorio

def submod_piel(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'cabello', 'pelo', 'caida del pelo', 'caspa', 'cuero cabelludo'):
        return 'cabello'
    if contiene(t, 'bano', 'inmersion', 'sitz', 'tina'):
        return 'banos_terapeuticos'
    if contiene(t, 'hongo', 'candida', 'micosis', 'antifungico', 'pie de atleta', 'tinea'):
        return 'hongos_infecciones'
    if contiene(t, 'herida', 'corte', 'cicatriz', 'quemadura', 'llagas', 'cicatrizante', 'ulcera cutanea'):
        return 'heridas_cicatrices'
    if contiene(t, 'cosmet', 'crema facial', 'mascarilla', 'anti-edad', 'arrugas', 'tonico facial'):
        return 'cosmetica_piel'
    return 'problemas_piel'  # default piel

def submod_dolores(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'dental', 'muela', 'diente', 'encias', 'oral', 'bucal'):
        return 'salud_bucal'
    if contiene(t, 'cabeza', 'migrana', 'jaqueca', 'cefalea'):
        return 'dolor_cabeza_migrana'
    if contiene(t, 'muscular', 'lumbago', 'espalda', 'contractura', 'tortícolis', 'cuello'):
        return 'dolor_muscular_lumbago'
    if contiene(t, 'artritis', 'reumatismo', 'articulacion', 'articulaciones', 'gota', 'artrosis'):
        return 'reumatismo_artritis'
    if contiene(t, 'antiinflamatorio', 'inflamacion'):
        return 'antiinflamatorio'
    return 'dolor_cronico_general'  # default dolores

def submod_mapuche(titulo, ingredientes):
    t = norm(titulo + ' ' + ingredientes)
    if contiene(t, 'espiritual', 'ritual', 'limpieza energetica', 'newen', 'machi', 'nguillatun', 'ceremonia'):
        return 'espiritual_ritual'
    return 'medicina_mapuche'

# ── Tabla categoria → módulo (+  función de submodulo) ────────────────
CATEGORIA_MAP = {
    # Módulo directo (submodulo por keywords)
    'Digestivo':        ('digestivo',      submod_digestivo),
    'Hepático':         ('digestivo',      lambda t,i: 'higado_vesicula'),
    'Diarrea':          ('digestivo',      lambda t,i: 'diarrea'),
    'Antiparasitario':  ('digestivo',      lambda t,i: 'parasitos'),
    'Nutritivo':        ('digestivo',      lambda t,i: 'nutricion'),
    'Alimenticio':      ('digestivo',      lambda t,i: 'nutricion'),
    'Respiratorio':     ('respiratorio',   submod_respiratorio),
    'Tos':              ('respiratorio',   lambda t,i: 'tos'),
    'Expectorante':     ('respiratorio',   lambda t,i: 'bronquitis_expectorante'),
    'Resfriados':       ('respiratorio',   lambda t,i: 'gripe_resfrios'),
    'Garganta':         ('respiratorio',   lambda t,i: 'garganta_faringitis'),
    'Febrífugo':        ('respiratorio',   lambda t,i: 'fiebre'),
    'Nervioso':         ('nervioso',       submod_nervioso),
    'Sedante':          ('nervioso',       lambda t,i: submod_nervioso(t,i) if contiene(norm(t), 'insomnio','dormir','sueno') else 'insomnio'),
    'Memoria':          ('nervioso',       lambda t,i: 'memoria_concentracion'),
    'Dermatológico':    ('piel',           submod_piel),
    'Cicatrizante':     ('piel',           lambda t,i: 'heridas_cicatrices'),
    'Cosmético':        ('piel',           lambda t,i: 'cosmetica_piel'),
    'Cabello':          ('piel',           lambda t,i: 'cabello'),
    'Baño':             ('piel',           lambda t,i: 'banos_terapeuticos'),
    'Antifúngico':      ('piel',           lambda t,i: 'hongos_infecciones'),
    'Ginecológico':     ('mujer',          submod_ginecologico),
    'Cardiovascular':   ('cardiovascular', submod_cardiovascular),
    'Renal':            ('cardiovascular', lambda t,i: 'rinones'),
    'Diurético':        ('cardiovascular', lambda t,i: 'diuretico'),
    'Analgésico':       ('dolores',        submod_dolores),
    'Antiinflamatorio': ('dolores',        lambda t,i: 'antiinflamatorio'),
    'Reumatismo':       ('dolores',        lambda t,i: 'reumatismo_artritis'),
    'Dental':           ('dolores',        lambda t,i: 'salud_bucal'),
    'Pediátrico':       ('pediatrico',     submod_pediatrico),
    'Energizante':      ('general',        lambda t,i: 'energizante_vitalidad'),
    'General':          ('general',        submod_general),
    'Alergia':          ('general',        lambda t,i: 'alergia'),
    'Oftalmológico':    ('general',        lambda t,i: 'ojos_oidos'),
    'Oídos':            ('general',        lambda t,i: 'ojos_oidos'),
    'Inmunidad':        ('general',        lambda t,i: 'bienestar_general'),
    'Medicina Mapuche': ('mapuche',        submod_mapuche),
    'Espiritual':       ('mapuche',        lambda t,i: 'espiritual_ritual'),
}

# ── Procesar recetas ──────────────────────────────────────────────────
with open('data/recetas.json', encoding='utf-8') as f:
    recetas = json.load(f)

clasificadas = 0
sin_mapa = {}

for r in recetas:
    if r.get('modulo') and r.get('submodulo'):
        continue  # ya clasificada

    cat = r.get('categoria', '')
    if cat not in CATEGORIA_MAP:
        sin_mapa[cat] = sin_mapa.get(cat, 0) + 1
        # Asignar fallback general
        r['modulo'] = 'general'
        r['submodulo'] = 'bienestar_general'
        clasificadas += 1
        continue

    modulo, fn_submod = CATEGORIA_MAP[cat]
    titulo = r.get('titulo', '')
    ingredientes = r.get('ingredientes', '')
    submodulo = fn_submod(titulo, ingredientes)

    r['modulo'] = modulo
    r['submodulo'] = submodulo
    clasificadas += 1

# ── Guardar ───────────────────────────────────────────────────────────
with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)

print(f'✅ Clasificadas: {clasificadas} recetas')
if sin_mapa:
    print(f'⚠️  Categorías sin mapa (→ general/bienestar_general): {sin_mapa}')

# Verificar
with open('data/recetas.json') as f:
    r2 = json.load(f)
sin_modulo = [r for r in r2 if not r.get('modulo')]
print(f'📊 Recetas aún sin módulo: {len(sin_modulo)}')

# Mostrar distribución resultado
from collections import Counter
dist = Counter(f"{r.get('modulo')}/{r.get('submodulo')}" for r in r2 if r.get('modulo'))
print(f'\nDistribución final (top 15):')
for k, v in dist.most_common(15):
    print(f'  {v:5d}  {k}')
