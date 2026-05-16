"""
Corrige los compuestos residuales incorrectos que quedaron tras la primera ronda.
Targets específicos por ID y/o substring detectado.

Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

recetas = json.load(open('data/recetas.json', encoding='utf-8'))
idx = {r['id']: r for r in recetas}

cambios = 0

# ─────────────────────────────────────────────────────────────────────────────
# 1. COPIHUE (IDs 15, 41, 358)
# "Mucílagos vegetales: acción emoliente" — NO está documentado en la literatura.
# Real: antocianinas (cianidina-3-O-glucósido, -rutinósido) + limoneno volátil
# Fuente: ResearchGate 359009183 — La química del copihue (Lapageria rosea)
# ─────────────────────────────────────────────────────────────────────────────
COPIHUE_OK = (
    'Antocianinas (cianidina-3-O-glucósido y cianidina-3-O-rutinósido, en tépalos): '
    'vasculoprotectoras y antioxidantes; responsables del color del copihue rojo. '
    'Compuestos volátiles (limoneno 29%, aldehídos aromáticos ~42%): aromaterapéuticos. '
    'Flavonoles: antioxidantes. Uso medicinal basado en tradición mapuche; '
    'investigación farmacológica publicada limitada a composición fitoquímica.'
)
COPIHUE_VIEJO = 'Mucílagos vegetales: acción emoliente y antiinflamatoria sobre mucosas irritadas.'

for rid in [15, 41, 358]:
    if rid in idx and COPIHUE_VIEJO in (idx[rid].get('principios_activos') or ''):
        idx[rid]['principios_activos'] = COPIHUE_OK
        print(f'ID {rid}: copihue corregido')
        cambios += 1

# ─────────────────────────────────────────────────────────────────────────────
# 2. BAILAHÚEN (ID 1125)
# "Haplopappina, ácido beilascuénico" — compuestos FABRICADOS
# Real: ácidos caffeoilquínicos, feruloilquínicos, kaempferol/quercetina, cumarinas
# Fuente: PubMed 25580687, 15652282
# ─────────────────────────────────────────────────────────────────────────────
if 1125 in idx:
    r = idx[1125]
    if 'Haplopappina' in (r.get('principios_activos') or ''):
        r['principios_activos'] = (
            'Ácidos caffeoilquínicos (ácido clorogénico como principal): antioxidantes y hepatoprotectores. '
            'Ácidos feruloilquínicos: antiinflamatorios y colerécticos. '
            'Flavonoles (kaempferol y quercetina, libres y glucosilados): antiinflamatorios. '
            'Antocianinas del maqui (delfinidina, cianidina): antioxidantes vasculares potentes. '
            'Cumarinas del bailahúen: antimicrobianas.'
        )
        print(f'ID 1125: bailahúen haplopappina corregido')
        cambios += 1

# ─────────────────────────────────────────────────────────────────────────────
# 3. PICHI (ID 1181)
# "fabianina (pichi)" — compuesto FABRICADO
# Real: ácido clorogénico + escopoletina + p-hidroxiacetofenona + rutina
# Fuente: PubMed 22850976, 17236029, 16372369
# ─────────────────────────────────────────────────────────────────────────────
if 1181 in idx:
    r = idx[1181]
    if 'fabianina' in (r.get('principios_activos') or '').lower():
        r['principios_activos'] = (
            'Ácido clorogénico (pichi): antiséptico de vías urinarias y antioxidante. '
            'Escopoletina (0.8–1.9% MS, pichi): diurética e inhibidora de β-D-glucuronidasa. '
            'p-Hidroxiacetofenona (pichi): antiinflamatoria urinaria. '
            'Rutina (pichi): venotónica y antiinflamatoria. '
            'Aucubina y catalpol (llantén): antiinflamatorios renales. '
            'Ácido silícico (cola de caballo): fortalecedor de tejido renal y diurético.'
        )
        print(f'ID 1181: pichi fabianina corregido')
        cambios += 1

# ─────────────────────────────────────────────────────────────────────────────
# 4. MATICO con "dilapiol" (IDs 1117, 1119, 1129)
# "dilapiol del matico" — confusión con Piper aduncum (otro "matico" peruano).
# El matico CHILENO es Buddleja globosa: catechin, verbascósido, aucubina, catalpol.
# "asaridina" también es de Piper, no de Buddleja.
# Fuente: ResearchGate 26604796, PubMed 18164566, 33920316
# ─────────────────────────────────────────────────────────────────────────────

# ID 1117: Decocción inmunoestimulante de matico y canelo
if 1117 in idx:
    r = idx[1117]
    if 'dilapiol' in (r.get('principios_activos') or '').lower():
        r['principios_activos'] = (
            'Poligodial y drimanial (sesquiterpenos dialdeídos del canelo/foye): '
            'antiinflamatorios potentes; bloquean Nav1.7/Nav1.8. '
            'Catequina y verbascósido (matico/pañil): astringentes, antimicrobianos y cicatrizantes. '
            'Aucubina y catalpol (matico, iridoides): antiinflamatorios y cicatrizantes. '
            'β-Cariofileno (ambas plantas): antiinflamatorio por agonismo CB2.'
        )
        print(f'ID 1117: dilapiol del matico corregido (canelo+matico)')
        cambios += 1

# ID 1119: Cataplasma de matico y llantén
if 1119 in idx:
    r = idx[1119]
    if 'dilapiol' in (r.get('principios_activos') or '').lower():
        r['principios_activos'] = (
            'Catequina (682 mg/100g MS, matico): astringente, cicatrizante y antiagregante. '
            'Verbascósido (matico): antibacteriano y cicatrizante de heridas. '
            'Aucubina y catalpol (matico + llantén, iridoides): antiinflamatorios tisulares. '
            'Alantoína (llantén): cicatrizante que estimula la proliferación celular. '
            'Mucílagos (llantén): emolientes y protectores de mucosas.'
        )
        print(f'ID 1119: dilapiol corregido (matico+llantén)')
        cambios += 1

# ID 1129: Decocción broncodilatadora de pañil y matico
if 1129 in idx:
    r = idx[1129]
    if 'dilapiol' in (r.get('principios_activos') or '').lower():
        r['principios_activos'] = (
            'Verbascósido (matico/pañil): antiinflamatorio y antimicrobiano bronquial. '
            'Aucubina y catalpol (matico, iridoides): antiinflamatorios de mucosas respiratorias. '
            'β-Cariofileno: broncodilatador por agonismo CB2 y reducción de edema mucoso. '
            'Catequina (matico): antioxidante y astringente de mucosa bronquial.'
        )
        print(f'ID 1129: dilapiol corregido (pañil+matico broncodilatador)')
        cambios += 1

# ─────────────────────────────────────────────────────────────────────────────
print(f'\nTotal cambios aplicados: {cambios}')

with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)
print('Guardado en data/recetas.json')
