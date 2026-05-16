"""
Corrige compuestos fabricados/incorrectos en recetas.json
usando datos verificados contra PubMed/ScienceDirect.

Fuentes por planta:
- Calafate: PubMed 24697704, 20438111 (ScienceDirect S0021967313001477)
- Pichi: PubMed 22850976, 17236029, 16372369, 15018052
- Bailahúen: PubMed 25580687, 15652282
- Matico: ResearchGate 26604796, PubMed 18164566, 33920316
- Quinchamalium: PubMed 15666537
- Copihue: ResearchGate 359009183, 229150070
- Peumo: PubMed 41415580, 34943100, ResearchGate 277801760
- Palqui: PubMed 14039275, 14759548
- Culén: PubMed 11585684, 25184663, ScienceDirect S0378874112006999

Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# ── Correcciones verificadas ─────────────────────────────────────────────────
# Cada entrada: (texto_a_detectar_en_principios_activos, planta_en_ingredientes, nuevo_compuesto)
# La detección busca la cadena incorrecta en principios_activos del registro.

CORRECCIONES = [
    # ─ Calafate: berberina NO es el compuesto primario de los frutos.
    # Real (frutos): antocianinas cianidina-3,7-β-O-diglucósido + ácido 5-caffeoilquínico
    # PubMed 24697704, 20438111
    {
        'detectar': 'Berberina (alcaloide isoquinolínico): antipirético, antimicrobiano y antiinflamatorio; inhibe la síntesis de prostaglandinas. Oxyacantina',
        'planta_req': 'calafate',
        'correcto': 'Antocianinas (cianidina-3,7-β-O-diglucósido, y derivados de delfinidina, petunidina, peonidina y malvidina): potentes antioxidantes vasculares; reducen LDL oxidado. Ácido 5-caffeoilquínico: el hidroxicinamato más concentrado; antioxidante y hepatoprotector. Ácidos caffeoilglucáricos: antiinflamatorios y antioxidantes. Flavonoles (kaempferol, quercetina): antiinflamatorios.',
    },

    # ─ Pichi: "Fabianina e isofabianina" son compuestos FABRICADOS.
    # Real: ácido clorogénico + p-hidroxiacetofenona + escopoletina + rutina + sesquiterpeno amorfano
    # PubMed 22850976, 17236029, 16372369
    {
        'detectar': 'Fabianina e isofabianina (alcaloides quinolizidínicos)',
        'planta_req': 'pichi',
        'correcto': 'Ácido clorogénico (3-O-caffeoilquínico): antioxidante, antiséptico de vías urinarias y hepatoprotector. p-Hidroxiacetofenona (0.4–6.2% MS): antiséptica y antiinflamatoria. Escopoletina (0.8–1.9% MS): inhibidor no competitivo de β-D-glucuronidasa; diurética y antiinflamatoria de vías urinarias. Rutina (2.1–4.3% MS): venotónica y antiinflamatoria. 11-Hidroxi-4-amorfeno-15-oico (sesquiterpeno): gastroprotector, reduce lesiones gástricas 68% a 100 mg/kg.',
    },

    # ─ Bailahúen: "Bailahuenina" es un compuesto FABRICADO.
    # Real: ácidos caffeoilquínicos + feruloilquínicos + flavonoles + cumarinas
    # PubMed 25580687, 15652282
    {
        'detectar': 'bailahuenina',
        'planta_req': None,  # aplica a cualquier receta con este compuesto incorrecto
        'correcto': 'Ácidos caffeoilquínicos (ácido clorogénico como principal, 30 fenólicos identificados): antioxidantes y hepatoprotectores. Ácidos feruloilquínicos: antiinflamatorios y colerécticos. Flavonoles (kaempferol y quercetina, libres y glucosilados): antiinflamatorios y antioxidantes. Cumarinas y diterpenos: antimicrobianos y hepatoprotectores.',
    },

    # ─ Matico: "Artemetina" NO está documentada en Buddleja globosa.
    # Real: catequina (682 mg/100g DW, compuesto más abundante) + verbascósido + aucubina
    # ResearchGate 26604796, PubMed 18164566, 33920316
    {
        'detectar': 'Artemetina y luteolina: antiinflamatorios y antimicrobianos. Taninos catéquicos',
        'planta_req': 'matico',
        'correcto': 'Catequina (682 mg/100 g MS, el compuesto más abundante): astringente, cicatrizante y antiagregante. Verbascósido (feniletanoide glucosilado): antiinflamatorio, cicatrizante y antimicrobiano. Aucubina y catalpol (iridoides): antiinflamatorios y cicatrizantes de mucosas. Luteolina-7-O-glucósido: antiinflamatoria. β-Hidroxiverbascósido: antioxidante potente.',
    },

    # ─ Quinchamalium: saponinas genéricas reemplazadas por compuestos específicos.
    # Real: ácido betulínico, daucosterol, 5,7-dihidroxiflavona, ácido oleanólico, pinocembrina, ácido ursólico
    # PubMed 15666537 (Quinchamalium majus, especie hermana de Q. chilense)
    {
        'detectar': 'Saponinas triterpénicas: antiinflamatorias e inmunomoduladoras. Flavonoides (quercetina, kaempferol): antiinflamatorios y antioxidantes. Taninos condensados: astringentes y antimicrobianos sobre piel irritada.',
        'planta_req': 'quinchamalí',
        'correcto': 'Ácido betulínico y ácido ursólico (triterpenos pentacíclicos): antituberculosos y antiinflamatorios; activos frente a Mycobacterium tuberculosis. Ácido oleanólico: hepatoprotector y antiinflamatorio. Daucosterol (β-sitosterol-D-glucósido): inmunomodulador. Pinocembrina (-)-2S (flavanona): antimicrobiana y antifúngica. 5,7-Dihidroxiflavona (crisina): ansiolítica y antiinflamatoria.',
    },

    # ─ Copihue: mucílagos, taninos y saponinas NO están documentados científicamente.
    # Real: antocianinas (cianidina-3-O-glucósido, cianidina-3-O-rutinósido) + volátiles (limoneno 29%)
    # ResearchGate 359009183 (La química del copihue, Lapageria rosea)
    {
        'detectar': 'Mucílagos vegetales: emolientes sobre mucosas respiratorias. Taninos condensados: astringentes. Saponinas: expectorantes y bequicas.',
        'planta_req': 'copihue',
        'correcto': 'Antocianinas (cianidina-3-O-glucósido y cianidina-3-O-rutinósido en tépalos): pigmentos vasculoprotectores y antioxidantes; el copihue rojo contiene ambas formas. Compuestos volátiles (limoneno 29%, aldehídos aromáticos ~42%): aromaterapéuticos. Flavonoles: antioxidantes dérmicos. Uso medicinal basado en tradición mapuche; investigación farmacológica en desarrollo.',
    },

    # ─ Peumo: "Criptocarpina" NO está documentada como compuesto de Cryptocarya alba.
    # Real: boldina, laurolitisina, laurotetanina, norglaucina (alcaloides aporfínicos)
    # PubMed 41415580, ResearchGate 277801760
    {
        'detectar': 'Criptocarpina (alcaloide aporfínico): antipirético y analgésico.',
        'planta_req': 'peumo',
        'correcto': 'Boldina, laurolitisina, laurotetanina y norglaucina (alcaloides aporfínicos): antipiréticos, analgésicos y antioxidantes potentes. Antocianinas y catequinas: vasculoprotectoras y antiinflamatorias. Proantocianidinas: astringentes y antidiarreicas. Derivados de criptofooliona (en frutos): antioxidantes.',
    },

    # ─ Palqui/Palque: NO contiene alcaloides tropánicos; los compuestos tóxicos reales son parquina.
    # Real: parquina y carboxyparquina (glucósidos tipo atractilósido, TÓXICOS), nor-isoprenoides C13, saponinas
    # PubMed 14039275, 14759548
    {
        'detectar': 'Alcaloides tropánicos: antiespasmódicos (uso cuidadoso, planta con principios activos potentes).',
        'planta_req': None,
        'correcto': 'Parquina y carboxyparquina (glucósidos similares a atractilósidos): fitotóxicos antimicrobianos e insecticidas. Nor-isoprenoides C13: biocidas. Saponinas con gitogenina y digitogenina: irritantes de mucosas. Planta tóxica con principios activos potentes; uso exclusivamente externo o bajo supervisión médica especializada.',
    },

    # ─ Culén: "Culeína" no está documentada; bergapteno reemplazado por angelicina (verificado).
    # Real: psoraleno + angelicina (furanocumarinas documentadas) + bakuchiol (meroterpeno)
    # PubMed 11585684, 25184663
    {
        'detectar': 'Psoraleno y bergapteno (furanocumarinas): fotoactivables; antisépticos y antifúngicos. Culeína (flavonoide): antiinflamatoria. Taninos: astringentes digestivos.',
        'planta_req': 'culén',
        'correcto': 'Psoraleno y angelicina (furanocumarinas): fotoactivables; antisépticos cutáneos y antifúngicos de amplio espectro. Bakuchiol (meroterpenoide): antiinflamatorio y antifúngico activo contra Botrytis cinerea. Flavonoides (flavonas y flavonoles): antioxidantes. Exudado resinoso rico en terpenoides: antimicrobiano sobre bacterias y hongos fitopatógenos.',
    },
]

# ─ Función de normalización ──────────────────────────────────────────────────
def norm(texto):
    return (texto or '').lower().replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').replace('ñ','n')

# ─ Cargar recetas ───────────────────────────────────────────────────────────
recetas = json.load(open('data/recetas.json', encoding='utf-8'))
total_corregidas = 0

for c in CORRECCIONES:
    detectar = c['detectar'].lower()
    planta_req = c['planta_req']
    correcto = c['correcto']
    corregidas_esta = 0

    for r in recetas:
        principios = r.get('principios_activos', '') or ''
        if detectar not in principios.lower():
            continue
        if planta_req:
            texto = norm(r.get('ingredientes', '') + ' ' + r.get('titulo', ''))
            planta_n = norm(planta_req)
            if planta_n not in texto:
                continue
        r['principios_activos'] = correcto
        corregidas_esta += 1
        total_corregidas += 1

    print(f"[{planta_req or 'cualquier receta'}] '{c['detectar'][:50]}...' → {corregidas_esta} corregidas")

print(f"\nTOTAL corregidas: {total_corregidas}")

# ─ Mostrar ejemplos de las recetas modificadas ──────────────────────────────
plantas_ejemplo = ['calafate', 'pichi', 'bailah', 'matico', 'quinchamal', 'copihue', 'peumo', 'palqu', 'culén', 'culeN']
print("\n=== Ejemplos verificados ===")
for r in recetas:
    titulo_n = norm(r.get('titulo',''))
    ingr_n = norm(r.get('ingredientes',''))
    if any(p in titulo_n or p in ingr_n for p in ['calafate','pichi','bailah','matico','quinchamal','copihue','peumo','palqu','culen']):
        print(f"ID {r['id']} | {r['titulo'][:60]}")
        print(f"  principios: {(r.get('principios_activos','') or '')[:120]}...")
        print()

# ─ Guardar ──────────────────────────────────────────────────────────────────
with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)
print("Guardado en data/recetas.json")
