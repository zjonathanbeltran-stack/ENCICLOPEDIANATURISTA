"""
crear_condiciones_digestivo.py
Lee data/modulos/digestivo.json, clasifica manualmente cada receta
en su condicion exacta con campo maternidad_segura, y genera:
  data/modulos/digestivo/<condicion>/recetas.json
"""
import json, pathlib

# ── Clasificacion manual: id -> (condicion, maternidad_segura) ──────────────
# maternidad_segura: "segura" | "advertencia" | "no_recomendada"
CLASIFICACION = {
    # ── GASTRITIS / ACIDEZ / REFLUJO ──
    126:  ("gastritis_acidez", "segura"),        # Matico para Dolor de Estomago
    393:  ("gastritis_acidez", "segura"),        # Tomillo para gastritis
    400:  ("gastritis_acidez", "segura"),        # Manzanilla Romana para gastritis
    703:  ("gastritis_acidez", "segura"),        # Albahaca para la Acidez
    708:  ("gastritis_acidez", "segura"),        # Manzana y Canela para el Estomago
    709:  ("gastritis_acidez", "advertencia"),   # Regaliz para Gastritis (evitar largo plazo)
    715:  ("gastritis_acidez", "segura"),        # Manzanilla con Regaliz para Intestino Irritable
    943:  ("gastritis_acidez", "advertencia"),   # Sabila con Pina para Reflujo (latex de aloe)
    1073: ("gastritis_acidez", "segura"),        # Caldo Luga Roja con Matico para Gastritis

    # ── ESTRENIMIENTO ──
    697:  ("estrenimiento", "segura"),           # Aceite de Oliva para el Transito
    700:  ("estrenimiento", "advertencia"),      # Jugo de Aloe Vera para el Intestino
    710:  ("estrenimiento", "segura"),           # Semillas de Psyllium
    712:  ("estrenimiento", "segura"),           # Compota de Ciruelas
    939:  ("estrenimiento", "segura"),           # Compota de Higos con Miel
    940:  ("estrenimiento", "advertencia"),      # Agua Tibia con Sal (exceso de sal)

    # ── DIARREA ──
    17:   ("diarrea", "advertencia"),            # Pangue para la diarrea (poco documentado)
    65:   ("diarrea", "segura"),                 # Hierba del Clavo para la Diarrea
    252:  ("diarrea", "segura"),                 # Agua de Arroz con Canela y Limon
    253:  ("diarrea", "segura"),                 # Membrillo para Diarrea Aguda
    254:  ("diarrea", "segura"),                 # Llanten y Arayan para Diarrea con Colicos
    255:  ("diarrea", "segura"),                 # Manzanas Ralladas para Diarrea Infantil
    256:  ("diarrea", "segura"),                 # Zarzamora para Diarrea
    399:  ("diarrea", "segura"),                 # Canela para diarrea y bacterias
    706:  ("diarrea", "segura"),                 # Agua de Arroz para Diarrea
    707:  ("diarrea", "segura"),                 # Infusion de Zarzamora para la Diarrea
    717:  ("diarrea", "segura"),                 # Caldo de Zanahorias para Diarrea Infantil
    947:  ("diarrea", "segura"),                 # Compota de Membrillo para la Diarrea

    # ── COLICOS / GASES / METEORISMO ──
    10:   ("colicos_gases", "advertencia"),      # Poleo para colicos (altas dosis abortivo)
    80:   ("colicos_gases", "segura"),           # Hinojo para el Meteorismo
    101:  ("colicos_gases", "segura"),           # Melisa para la Flatulencia
    387:  ("colicos_gases", "segura"),           # Anis Verde y Hinojo para flatulencias
    390:  ("colicos_gases", "segura"),           # Anis Verde para flatulencias y digestion lenta
    694:  ("colicos_gases", "no_recomendada"),   # Angelica para Gases y Colicos (abortivo)
    699:  ("colicos_gases", "segura"),           # Masaje Abdominal con Aceite de Comino
    711:  ("colicos_gases", "segura"),           # Hinojo con Anis para los Gases
    1077: ("colicos_gases", "advertencia"),      # Muna para Digestion y Gases Aymara

    # ── HIGADO / VESICULA ──
    27:   ("higado_vesicula", "advertencia"),    # Yerba lucida para el higado
    32:   ("higado_vesicula", "advertencia"),    # Boldo para Afecciones Hepaticas
    54:   ("higado_vesicula", "advertencia"),    # Hierba del Chancho para el Higado
    114:  ("higado_vesicula", "segura"),         # Cardo Mariano para el Higado (hepatoprotector)
    379:  ("higado_vesicula", "segura"),         # Caldo de Apio y Perejil depuracion hepatica
    388:  ("higado_vesicula", "advertencia"),    # Boldo y Diente de Leon para higado graso
    396:  ("higado_vesicula", "advertencia"),    # Marrubio para la vesicula biliar
    401:  ("higado_vesicula", "segura"),         # Raiz de Bardana para depuracion hepatica
    402:  ("higado_vesicula", "advertencia"),    # Yerba Lucida y Diente de Leon para el higado
    405:  ("higado_vesicula", "advertencia"),    # Alcachofa y Boldo
    420:  ("higado_vesicula", "segura"),         # Alcachofa Depurativa
    668:  ("higado_vesicula", "segura"),         # Jugo de Remolacha, Zanahoria y Limon
    669:  ("higado_vesicula", "segura"),         # Cardo Mariano para el Higado
    670:  ("higado_vesicula", "advertencia"),    # Alcachofa con Boldo y Diente de Leon
    671:  ("higado_vesicula", "segura"),         # Aceite de Higado de Bacalao Tradicional
    672:  ("higado_vesicula", "advertencia"),    # Curcuma y Jengibre para el Higado
    673:  ("higado_vesicula", "advertencia"),    # Diente de Leon con Regaliz
    674:  ("higado_vesicula", "segura"),         # Desayuno Hepatico de Avena con Curcuma
    675:  ("higado_vesicula", "advertencia"),    # Semillas de Mostaza para Detox
    676:  ("higado_vesicula", "advertencia"),    # Tintura de Cardo Mariano (alcohol)
    677:  ("higado_vesicula", "advertencia"),    # Fumaria para el Higado y la Vesicula
    942:  ("higado_vesicula", "advertencia"),    # Achicoria para el Higado y la Digestion

    # ── PARASITOS INTESTINALES ──
    8:    ("parasitos", "no_recomendada"),       # Paico (Chenopodium) - toxico en embarazo
    66:   ("parasitos", "no_recomendada"),       # Ajenjo contra Parasitos - abortivo
    247:  ("parasitos", "no_recomendada"),       # Paico para Parasitos Intestinales
    248:  ("parasitos", "segura"),               # Semillas de Zapallo contra Tenias
    249:  ("parasitos", "no_recomendada"),       # Enema de Ajo para Oxiuros
    250:  ("parasitos", "no_recomendada"),       # Ajenjo para Parasitos - abortivo
    251:  ("parasitos", "segura"),               # Jugo de Cebolla contra Parasitos
    392:  ("parasitos", "no_recomendada"),       # Paico para parasitos intestinales
    718:  ("parasitos", "segura"),               # Semillas de Calabaza contra Parasitos
    719:  ("parasitos", "no_recomendada"),       # Paico para Parasitos Intestinales
    720:  ("parasitos", "segura"),               # Ajo en Ayunas contra Parasitos
    721:  ("parasitos", "advertencia"),          # Cascara de Nuez Verde para Parasitos
    722:  ("parasitos", "no_recomendada"),       # Ajenjo para Parasitos - abortivo
    723:  ("parasitos", "advertencia"),          # Tintura de Clavo de Olor (alcohol)
    724:  ("parasitos", "advertencia"),          # Papaya con Semillas (semillas papaya)
    725:  ("parasitos", "segura"),               # Coctel Antiparasitario Ajo, Limon, Aceite
    726:  ("parasitos", "no_recomendada"),       # Epazote y Oregano para Oxiuros (Paico)
    727:  ("parasitos", "no_recomendada"),       # Ayuno con Zumo de Pina (ayuno embarazo)
    728:  ("parasitos", "advertencia"),          # Cascara de Naranja Amarga contra Gusanos
    729:  ("parasitos", "advertencia"),          # Aceite de Oregano contra Candida
    730:  ("parasitos", "segura"),               # Infusion de Tomillo para Parasitos
    731:  ("parasitos", "no_recomendada"),       # Enema de Cafe para Limpieza Intestinal
    732:  ("parasitos", "advertencia"),          # Romero y Menta para Parasitos (romero dosis altas)

    # ── NAUSEAS / INDIGESTION / APETITO ──
    51:   ("nauseas_indigestion", "no_recomendada"),  # Ajenjo para Dolor Abdominal - abortivo
    52:   ("nauseas_indigestion", "no_recomendada"),  # Ajenjo para Estimular Apetito - abortivo
    137:  ("nauseas_indigestion", "no_recomendada"),  # Ajenjo para la Indigestion - abortivo
    162:  ("nauseas_indigestion", "no_recomendada"),  # Canela y Ajenjo para la Indigestion
    391:  ("nauseas_indigestion", "advertencia"),     # Menta piperita para nauseas
    698:  ("nauseas_indigestion", "advertencia"),     # Jengibre y Menta para nauseas
    704:  ("nauseas_indigestion", "advertencia"),     # Mezcla de Especias Digestivas (Churna)
    938:  ("nauseas_indigestion", "no_recomendada"),  # Anamu para la Digestion

    # ── DIGESTION LENTA / DEPURATIVO ──
    4:    ("digestion_lenta", "advertencia"),    # Boldo para la digestion
    59:   ("digestion_lenta", "advertencia"),    # Te Verde con Menta (cafeina)
    84:   ("digestion_lenta", "advertencia"),    # Te Verde con Menta (cafeina) - duplicado
    119:  ("digestion_lenta", "advertencia"),    # Agua de Romero para la Digestion
    157:  ("digestion_lenta", "segura"),         # Infusion de Cogollos de Manzanilla
    389:  ("digestion_lenta", "advertencia"),    # Curcuma y Jengibre para inflamacion intestinal
    394:  ("digestion_lenta", "segura"),         # Apio y Perejil para depuracion digestiva
    395:  ("digestion_lenta", "segura"),         # Oregano y Manzanilla para digestion pesada
    397:  ("digestion_lenta", "no_recomendada"), # Ruda para digestion pesada - abortivo
    398:  ("digestion_lenta", "advertencia"),    # Cola de Caballo para limpiar
    403:  ("digestion_lenta", "segura"),         # Ortiga y Diente de Leon
    404:  ("digestion_lenta", "segura"),         # Agua de Berro Depurativa
    406:  ("digestion_lenta", "segura"),         # Te Depurativo de Cilantro
    408:  ("digestion_lenta", "segura"),         # Depurativo de Perejil y Limon
    409:  ("digestion_lenta", "segura"),         # Raiz de Bardana Depurativo
    410:  ("digestion_lenta", "advertencia"),    # Agua de Clorofila con Aloe
    411:  ("digestion_lenta", "advertencia"),    # Depurativo de Zarzaparrilla
    413:  ("digestion_lenta", "segura"),         # Infusion Depurativa de Diente de Leon
    415:  ("digestion_lenta", "advertencia"),    # Agua de Jamaica con Hibisco (hibisco uterotonico)
    417:  ("digestion_lenta", "advertencia"),    # Te Verde con Jengibre Depurativo
    418:  ("digestion_lenta", "advertencia"),    # Zumo Depurativo de Aloe y Curcuma
    419:  ("digestion_lenta", "segura"),         # Depurativo de Maiz Morado
    421:  ("digestion_lenta", "segura"),         # Depurativo de Chia y Limon
    422:  ("digestion_lenta", "advertencia"),    # Depurativo Mapuche de Bailahuen y Palque
    693:  ("digestion_lenta", "segura"),         # Vinagreta de Jengibre y Ajo para la Digestion
    695:  ("digestion_lenta", "segura"),         # Alcachofas para la Digestion Lenta
    696:  ("digestion_lenta", "advertencia"),    # Kombucha Casera (fermentada, trazas alcohol)
    701:  ("digestion_lenta", "advertencia"),    # Fenogreco para la Digestion
    702:  ("digestion_lenta", "no_recomendada"), # Papaya Verde para la Digestion
    705:  ("digestion_lenta", "segura"),         # Kefir de Leche Casero
    713:  ("digestion_lenta", "segura"),         # Cardamomo para la Digestion
    714:  ("digestion_lenta", "segura"),         # Vinagre Fermentado de Manzana
    716:  ("digestion_lenta", "advertencia"),    # Oregano para la Candidiasis Intestinal
    941:  ("digestion_lenta", "no_recomendada"), # Genciana para la Digestion Lenta
    944:  ("digestion_lenta", "segura"),         # Semillas de Calabaza Tostadas
    945:  ("digestion_lenta", "advertencia"),    # Poleo Menta para la Digestion
    946:  ("digestion_lenta", "segura"),         # Kefir de Agua con Limon y Jengibre
    1078: ("digestion_lenta", "segura"),         # Chuno Medicinal Aymara para Fortalecer Estomago

    # ── NUTRICION / ALIMENTICIO ──
    11:   ("nutricion", "segura"),   # Ortiga para la anemia
    49:   ("nutricion", "segura"),   # Raiz de Ortiga para la Anemia
    92:   ("nutricion", "segura"),   # Romero y Ortiga para la Anemia
    110:  ("nutricion", "segura"),   # Berro para la Anemia
    373:  ("nutricion", "segura"),   # Jarabe de Sauco y Miel
    374:  ("nutricion", "segura"),   # Agua de Canela y Jengibre para el metabolismo
    375:  ("nutricion", "segura"),   # Vinagre de Canchalagua y Menta para ensaladas
    376:  ("nutricion", "segura"),   # Jugo verde de Ortiga y Manzana para el hierro
    377:  ("nutricion", "segura"),   # Ensalada de Diente de Leon y Ortiga
    378:  ("nutricion", "segura"),   # Mermelada de Maqui
    379:  ("nutricion", "segura"),   # Caldo de Apio y Perejil (aparece en higado tb)
    380:  ("nutricion", "no_recomendada"), # Licor medicinal de Murtilla (alcohol)
    381:  ("nutricion", "segura"),   # Infusion fria de Maqui y Calafate
    382:  ("nutricion", "segura"),   # Smoothie verde de Ortiga y Manzana
    383:  ("nutricion", "segura"),   # Aceite de Romero para cocinar
    384:  ("nutricion", "segura"),   # Arroz medicinal con Curcuma y Jengibre
    385:  ("nutricion", "segura"),   # Te frio de Hierba Buena y Limon
    386:  ("nutricion", "segura"),   # Aceite de Calendula para cocinar
    407:  ("nutricion", "segura"),   # Jugo Verde Depurativo de Espinaca y Manzana
    412:  ("nutricion", "segura"),   # Licuado Depurativo de Remolacha y Manzana
    488:  ("nutricion", "segura"),   # Licuado de Kale con Mango
    489:  ("nutricion", "segura"),   # Caldo de Miso con Alga Wakame
    492:  ("nutricion", "segura"),   # Granola Medicinal con Semillas
    493:  ("nutricion", "segura"),   # Batido Proteico de Lentejas Rojas
    598:  ("nutricion", "segura"),   # Vinagreta Medicinal de Aceite de Oliva y Curcuma
    599:  ("nutricion", "segura"),   # Kimchi Medicinal
    600:  ("nutricion", "segura"),   # Sopa Medicinal de Miso con Jengibre
    601:  ("nutricion", "segura"),   # Aceite de Ajo Medicinal
    602:  ("nutricion", "segura"),   # Chucrut Casero
    603:  ("nutricion", "segura"),   # Granado Desayuno de Semillas y Superalimentos
    604:  ("nutricion", "segura"),   # Caldo de Vegetales Medicinal
    605:  ("nutricion", "segura"),   # Mousse de Aguacate y Cacao
    606:  ("nutricion", "segura"),   # Ensalada Medicinal de Rucula, Nueces y Granada
    607:  ("nutricion", "segura"),   # Infusion de Cascara de Naranja y Canela
    608:  ("nutricion", "segura"),   # Semillas de Canamo Nutricionales
    609:  ("nutricion", "segura"),   # Gazpacho Medicinal de Tomate y Ajo
    610:  ("nutricion", "segura"),   # Smoothie de Espinaca y Pina Antiinflamatorio
    611:  ("nutricion", "segura"),   # Arroz con Leche de Coco y Azafran Medicinal
    612:  ("nutricion", "segura"),   # Jugo de Remolacha y Manzana para la Sangre
    888:  ("nutricion", "segura"),   # Curry Medicinal de Lentejas y Curcuma
    889:  ("nutricion", "segura"),   # Hummus Medicinal con Curcuma y Pimenton
    890:  ("nutricion", "segura"),   # Sopa de Miso con Seta Shiitake
    891:  ("nutricion", "segura"),   # Pesto Medicinal de Albahaca y Nueces
    892:  ("nutricion", "segura"),   # Arroz Integral con Verduras Medicinales
    893:  ("nutricion", "segura"),   # Tabule Medicinal con Perejil y Menta
    894:  ("nutricion", "segura"),   # Caldo de Miso con Hongos Medicinales
    895:  ("nutricion", "segura"),   # Ensalada de Papaya Verde con Achiote
    896:  ("nutricion", "segura"),   # Aji de Gallina Medicinal
    897:  ("nutricion", "segura"),   # Zumo de Noni para la Inmunidad
    898:  ("nutricion", "segura"),   # Gazpacho de Betarraga y Pepino
    899:  ("nutricion", "segura"),   # Sal de Hierbas Medicinal
    900:  ("nutricion", "segura"),   # Caldo de Huesos con Mushrooms y Miso
    901:  ("nutricion", "segura"),   # Batido de Suero de Leche con Miel y Canela
    902:  ("nutricion", "segura"),   # Tapioca con Leche de Coco y Mango
    1065: ("nutricion", "advertencia"), # Lawen de Changle (hongo, datos insuficientes)
}

# ── Metadata por condicion ───────────────────────────────────────────────────
CONDICIONES_META = {
    "gastritis_acidez": {
        "label": "Gastritis / Acidez / Reflujo",
        "emoji": "🔥",
        "descripcion": "Remedios para gastritis, acidez estomacal, reflujo gastroesofagico e inflamacion de mucosa gastrica.",
        "maternidad": {
            "seguridad_general": "advertencia",
            "nota": "La gastritis es comun en el embarazo. La manzanilla y el matico son seguros. Evitar regaliz en dosis altas. Consultar medico si los sintomas son intensos."
        }
    },
    "estrenimiento": {
        "label": "Estrenimiento",
        "emoji": "🌾",
        "descripcion": "Remedios naturales para el estrenimiento y transito intestinal lento.",
        "maternidad": {
            "seguridad_general": "advertencia",
            "nota": "El estrenimiento es muy comun en el embarazo. Las ciruelas, higos y psyllium son seguros. Evitar laxantes fuertes como sen o cascara sagrada. El aceite de aloe (latex) esta contraindicado."
        }
    },
    "diarrea": {
        "label": "Diarrea",
        "emoji": "💧",
        "descripcion": "Remedios astringentes y antidiarreicos naturales para adultos y ninos.",
        "maternidad": {
            "seguridad_general": "segura",
            "nota": "La mayoria de los remedios para diarrea son seguros en el embarazo. Priorizar la hidratacion. El agua de arroz, membrillo y zarzamora son muy seguros."
        }
    },
    "colicos_gases": {
        "label": "Colicos / Gases / Meteorismo",
        "emoji": "💨",
        "descripcion": "Remedios carminativos para gases, meteorismo, colicos intestinales y flatulencias.",
        "maternidad": {
            "seguridad_general": "advertencia",
            "nota": "El hinojo, la melisa y el anis verde son seguros en dosis normales. Evitar el poleo (abortivo en dosis altas) y la angelica. El masaje abdominal suave es seguro."
        }
    },
    "higado_vesicula": {
        "label": "Higado / Vesicula biliar",
        "emoji": "🫒",
        "descripcion": "Remedios hepatoprotectores y colagogos para el higado, higado graso y vesicula biliar.",
        "maternidad": {
            "seguridad_general": "advertencia",
            "nota": "El cardo mariano es hepatoprotector y generalmente seguro. El boldo debe usarse con cautela. Evitar tinturas alcoholicas. El jugo de remolacha y zanahoria es muy seguro."
        }
    },
    "parasitos": {
        "label": "Parasitos intestinales",
        "emoji": "🦠",
        "descripcion": "Remedios antiparasitarios para lombrices, tenias, oxiuros y otros parasitos intestinales.",
        "maternidad": {
            "seguridad_general": "no_recomendada",
            "nota": "ATENCION: La mayoria de los antiparasitarios potentes (ajenjo, paico, epazote) estan contraindicados en el embarazo por ser abortivos. Usar SOLO bajo supervision medica. Las semillas de zapallo y calabaza son las opciones mas seguras."
        }
    },
    "nauseas_indigestion": {
        "label": "Nauseas / Indigestion",
        "emoji": "🤢",
        "descripcion": "Remedios para nauseas, vomitos, indigestion, apetito y malestar estomacal general.",
        "maternidad": {
            "seguridad_general": "advertencia",
            "nota": "El jengibre en dosis bajas es el remedio mas documentado para nauseas del embarazo. Evitar el ajenjo (abortivo) y la ruda. La menta piperita puede agravar las nauseas en el primer trimestre."
        }
    },
    "digestion_lenta": {
        "label": "Digestion lenta / Depurativo",
        "emoji": "🌿",
        "descripcion": "Remedios digestivos, depurativos y probioticos para digestion pesada y limpieza intestinal.",
        "maternidad": {
            "seguridad_general": "advertencia",
            "nota": "El kefir, el berro y el diente de leon son seguros. Evitar la papaya verde, la ruda, el ajenjo y el hibisco (uterotonico). Los ayunos depurativos no son recomendables en el embarazo."
        }
    },
    "nutricion": {
        "label": "Nutricion y Alimentacion medicinal",
        "emoji": "🥗",
        "descripcion": "Preparaciones alimenticias medicinales, alimentos funcionales y recetas nutritivas con plantas.",
        "maternidad": {
            "seguridad_general": "segura",
            "nota": "La gran mayoria de estas preparaciones son seguras en el embarazo al ser base de alimentos. Evitar el licor medicinal y las preparaciones alcoholicas. Las sopas, batidos y ensaladas medicinales son excelentes."
        }
    },
}

# ── Procesar ─────────────────────────────────────────────────────────────────
src = pathlib.Path("data/modulos/digestivo.json")
recetas = json.loads(src.read_text(encoding="utf-8"))

# Indexar por id
recetas_por_id = {r["id"]: r for r in recetas}

# Construir buckets por condicion
buckets = {c: [] for c in CONDICIONES_META}
sin_clasificar = []

for r in recetas:
    rid = r["id"]
    if rid in CLASIFICACION:
        condicion, mat = CLASIFICACION[rid]
        r_mod = dict(r)
        r_mod["maternidad_segura"] = mat
        # Evitar duplicar receta 379 (aparece en higado y nutricion)
        if r_mod not in buckets[condicion]:
            buckets[condicion].append(r_mod)
    else:
        sin_clasificar.append(r)

# Crear directorios y archivos
base = pathlib.Path("data/modulos/digestivo")
base.mkdir(parents=True, exist_ok=True)

total_escritas = 0
for cond_id, meta in CONDICIONES_META.items():
    cond_dir = base / cond_id
    cond_dir.mkdir(parents=True, exist_ok=True)
    recetas_cond = buckets[cond_id]
    payload = {
        "condicion":    meta["label"],
        "modulo":       "digestivo",
        "submodulo":    cond_id,
        "emoji":        meta["emoji"],
        "descripcion":  meta["descripcion"],
        "maternidad":   meta["maternidad"],
        "recetas":      recetas_cond,
    }
    out = cond_dir / "recetas.json"
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    total_escritas += len(recetas_cond)
    print(f"  {cond_id:25s}  {len(recetas_cond):3d} recetas -> {out}")

print(f"\nTotal clasificadas: {total_escritas}")
if sin_clasificar:
    print(f"SIN CLASIFICAR ({len(sin_clasificar)}):")
    for r in sin_clasificar:
        print(f"  id={r['id']} cat={r.get('categoria','')} | {r.get('titulo','')[:60]}")
