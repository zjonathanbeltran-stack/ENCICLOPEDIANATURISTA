"""
Corrige las 215 recetas con principios_activos genéricos (fallback incorrecto).
Agrega plantas medicinales chilenas endémicas al mapa de compuestos.
Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys, re

sys.stdout.reconfigure(encoding='utf-8')

# ── Compuestos activos — planta por planta ────────────────────────────────────
# Incluye plantas europeas clásicas + todas las endémicas chilenas/mapuche relevantes
COMPUESTOS = {
    # ─ Plantas endémicas chilenas / mapuche ─────────────────────────────────
    'calafate':     'Berberina (alcaloide isoquinolínico): antipirético, antimicrobiano y antiinflamatorio; inhibe la síntesis de prostaglandinas. Oxyacantina: alcaloide con actividad antiespasmódica y antihipertensiva. Taninos: astringentes y hemostáticos.',
    'quinchamalí':  'Saponinas triterpénicas: antiinflamatorias e inmunomoduladoras. Flavonoides (quercetina, kaempferol): antiinflamatorios y antioxidantes. Taninos condensados: astringentes y antimicrobianos sobre piel irritada.',
    'natre':        'Alcaloides esteroídicos (solasonina, solamargina): antiinflamatorios y antifúngicos tópicos. Saponinas esteroidales: actividad antimicrobiana. Flavonoides: antioxidantes cutáneos.',
    'llareta':      'Diterpenoides tipo mulinano (mulinano, azorellano): antiinflamatorios y analgésicos; inhiben COX-2. Flavonoides (quercetina, luteolina): antioxidantes y espasmolíticos. Ácidos fenólicos: antisépticos.',
    'chilco':       'Antocianinas (cianidina, delfinidina): potentes antioxidantes vasculares. Quercetina y kaempferol: antiinflamatorios y venotónicos. Taninos elagitánicos: astringentes y cicatrizantes.',
    'pangue':       'Ácido gálico y ácido elágico: antioxidantes potentes y antiinflamatorios. Taninos hidrolizables: astringentes y antidiarreicos. Proantocianidinas: venotónicas y antiinflamatorias vasculares.',
    'nalca':        'Ácido gálico y taninos hidrolizables: astringentes y antiinflamatorios. Ácido oxálico: efecto leve diurético. Proantocianidinas: antioxidantes y antiinflamatorias.',
    'poleo':        'Pulegona (monoterpeno cetónico): broncodilatadora, espasmolítica y expectorante. Piperitona: antiséptica y carminativa. Mentol y carvacrol: antiinflamatorios y antimicrobianos.',
    'luma':         'Eugenol y alfa-terpineol: antisépticos y antiinflamatorios. Antocianinas: antioxidantes y vasculoprotectoras. Taninos: astringentes y antimicrobianos.',
    'arrayán':      'Eugenol y beta-cariofileno: antiinflamatorios y antimicrobianos. Antocianinas (delfinidin-3-glucósido): antioxidantes potentes. Taninos elagitánicos: astringentes y antidiarreicos.',
    'murtilla':     'Antocianinas (cianidina-3-glucósido): antioxidantes y antimicrobianas. Ácido elágico: antiinflamatorio y antiproliferativo. Vitamina C: inmunoestimulante y cicatrizante.',
    'murta':        'Antocianinas (cianidina-3-glucósido): antioxidantes y antimicrobianas. Ácido elágico: antiinflamatorio. Taninos: astringentes y antimicrobianos.',
    'michay':       'Berberina (alcaloide isoquinolínico): antibacteriano, antimicótico y antiinflamatorio; inhibe la síntesis de ADN bacteriano. Berbamina: inmunomoduladora. Palmitina: antiséptica.',
    'pichi':        'Fabianina e isofabianina (alcaloides quinolizidínicos): diuréticos y antisépticos de vías urinarias. Flavonoides (apigenina, luteolina): antiinflamatorios. Saponinas: irritantes suaves del epitelio tubular que aumentan la diuresis.',
    'llareta':      'Diterpenoides mulinano y azorellano: antiinflamatorios y analgésicos por inhibición de COX-2. Flavonoides: antioxidantes y espasmolíticos. Compuestos fenólicos: antisépticos.',
    'culén':        'Psoraleno y bergapteno (furanocumarinas): fotoactivables; antisépticos y antifúngicos. Culeína (flavonoide): antiinflamatoria. Taninos: astringentes digestivos.',
    'peumo':        'Criptocarpina (alcaloide aporfínico): antipirético y analgésico. Taninos: astringentes y antimicrobianos. Flavonoides: antioxidantes e inmunomoduladores.',
    'palqui':       'Saponinas esteroidales: antiinflamatorias y antimicrobianas. Alcaloides tropánicos: antiespasmódicos (uso cuidadoso, planta con principios activos potentes). Flavonoides: antioxidantes.',
    'quillay':      'Saponinas quilaya (quillajina): inmunoestimulantes y expectorantes. Quillajoside: antiinflamatorio. Taninos: astringentes y antimicrobianos.',
    'algarrobo':    'Leucoantocianidinas y proantocianidinas: antiinflamatorias y antimicrobianas. Taninos condensados: astringentes sobre mucosas respiratorias. Goma de algarrobo (galactomanano): emoliente y expectorante.',
    'quila':        'Flavonoides (tricina, luteolina): antiinflamatorios e inmunomoduladores. Sílice orgánica: remineralizante. Ácidos fenólicos: antioxidantes.',
    'hierba mora':  'Solanina y solamargina (alcaloides glicoalcaloideos): antiinflamatorios y analgésicos tópicos a bajas dosis. Rutina: venotónica y antiinflamatoria. Saponinas esteroidales: antimicrobianas.',
    'melosa':       'Mucílagos: emolientes y cicatrizantes sobre quemaduras y heridas. Taninos: astringentes y hemostáticos. Flavonoides: antioxidantes y antiinflamatorios cutáneos.',
    'hierba lúcida': 'Taninos: astringentes y hepatoprotectores. Flavonoides (quercetina, rutina): antioxidantes hepáticos. Iridoides: colerécticos y antiinflamatorios.',
    'yerba lúcida': 'Taninos: astringentes y hepatoprotectores. Flavonoides (quercetina, rutina): antioxidantes hepáticos. Iridoides: colerécticos y antiinflamatorios.',
    'zarzamora':    'Antocianinas (cianidina, pelargonidina): antioxidantes vasculares potentes. Ácido elágico y elagitaninos: antiinflamatorios y antiproliferativos. Vitamina C: inmunoestimulante.',
    'wira wira':    'Flavonoides (quercetina, isorhamnetina): antiinflamatorios y expectorantes. Ácido rosmarínico: antiviral y antioxidante. Aceites esenciales: antisépticos respiratorios.',
    'matico':       'Artemetina y luteolina: antiinflamatorios y antimicrobianos. Taninos catéquicos: astringentes y hemostáticos. Saponinas: antisépticas.',
    'canelo':       'Poligodial (sesquiterpeno dialdeído): bloquea Nav1.7/Nav1.8; antinociceptivo y antiinflamatorio. Drimanial y confertifolin: antimicrobianos de amplio espectro. Taninos y flavonoides: antiinflamatorios sinérgicos.',
    'tepú':         'Flavonoides: antiinflamatorios. Taninos: astringentes y antisépticos. Aceites esenciales: antimicrobianos.',
    'copihue':      'Mucílagos vegetales: emolientes sobre mucosas respiratorias. Taninos condensados: astringentes. Saponinas: expectorantes y bequicas.',
    # ─ Plantas europeas/globales ya usadas en Chile ─────────────────────────
    'manzanilla':   'Apigenina: espasmolítica y sedante por modulación GABAérgica. Alfa-bisabolol: antiinflamatorio y cicatrizante de mucosas. Camazuleno: potente antiinflamatorio.',
    'boldo':        'Boldina (alcaloide aporfínico): colerético y hepatoprotector. Limoneno y ascaridol: antisépticos. Taninos: astringentes digestivos.',
    'eucalipto':    '1,8-Cineol (eucaliptol): expectorante, mucolítico y antibacteriano. Alfa-pineno: broncodilatador. Globulol: antiviral.',
    'llantén':      'Aucubina (iridoide): antiinflamatoria y hepatoprotectora. Mucílagos: emolientes. Ácido rosmarínico: antioxidante y antialérgico.',
    'romero':       'Ácido rosmarínico: antiinflamatorio por inhibición de COX-2. Carnosol: neuroprotector y antimicrobiano. 1,8-Cineol: estimulante circulatorio.',
    'lavanda':      'Linalool: ansiolítico por modulación de GABA-A. Acetato de linalilo: relajante muscular. Flavonoides: espasmolíticos.',
    'ajo':          'Alicina: antibacteriano; activo contra H. pylori. Ajoeno: antiagregante plaquetario. Aliína: antihipertensivo.',
    'jengibre':     'Gingeroles: antiinflamatorios y antieméticos. Shogaoles: antinociceptivos. Zingerona: antidiarreico.',
    'limón':        'Limoneno: ansiolítico y antifúngico. Ácido cítrico: alcalinizante urinario. Hesperidina: venotónica.',
    'miel':         'Peróxido de hidrógeno: bactericida. Inhibinas y defensina-1: antibacterianas. Gluconolactona: mantiene pH ácido antimicrobiano.',
    'canela':       'Cinamaldehído: antibacteriano y antifúngico. Eugenol: analgésico local. Taninos: astringentes.',
    'clavo':        'Eugenol: analgésico dental y antimicrobiano. Acetileugenol: espasmolítico. Taninos: hemostáticos.',
    'tomillo':      'Timol y carvacrol: antibacterianos de amplio espectro. Ácido ursólico: antiinflamatorio. Flavonoides: expectorantes.',
    'salvia':       'Ácido rosmarínico: antiinflamatorio. Tuyona: estimulante circulatorio. Acteósido: inmunomodulador.',
    'menta':        'Mentol: analgésico y descongestionante. Mentona: antiséptico. Ácido rosmarínico: antiinflamatorio.',
    'hierba buena': 'Mentol y mentona: espasmolíticos y analgésicos. Pulegona: antiespasmódica. Flavonoides: antioxidantes.',
    'valeriana':    'Ácido valerénico: inhibidor de recaptación de GABA. Valepotriatos: sedantes. Hesperidina: relajante muscular.',
    'tilo':         'Linalool: ansiolítico. Flavonoides (quercetina, kaempferol): antiinflamatorios. Mucílagos: demulcentes.',
    'caléndula':    'Calendulosidas: saponinas antiinflamatorias y cicatrizantes. Carotenoides: regeneradores tisulares. Flavonoides: antimicrobianos.',
    'calendula':    'Calendulosidas: saponinas antiinflamatorias y cicatrizantes. Carotenoides: regeneradores tisulares. Flavonoides: antimicrobianos.',
    'cola de caballo': 'Ácido silícico: fortalece tejido conectivo y diurético. Saponinas: antiinflamatorias. Flavonoides: antioxidantes.',
    'equiseto':     'Ácido silícico orgánico: fortalece tejido conectivo, cabello y uñas. Saponinas: diuréticas. Flavonoides: antioxidantes.',
    'paico':        'Ascaridol (peróxido monoterpénico): antiparasitario de alto espectro. Safrol: antiséptico intestinal. Terpinenos: antihelmínticos.',
    'pasiflora':    'Crisina: agonista parcial GABA-A; ansiolítico. Orientina y vitexina: sedantes. Alcaloides (harmana): inhibidores MAO.',
    'cúrcuma':      'Curcumina: inhibe NF-κB y COX-2; antiinflamatorio. Turmerona: neuroprotector. Bisdesmetoxicurcumina: antioxidante.',
    'curcuma':      'Curcumina: inhibe NF-κB y COX-2; antiinflamatorio. Turmerona: neuroprotector.',
    'maqui':        'Delfinidina y cianidina-3-sambubiosido: antocianinas antioxidantes. Polifenoles: reducen LDL oxidado. Galotaninos: antivirales.',
    'rosa mosqueta':'Vitamina C: antioxidante e inmunoestimulante. Ácidos grasos omega-3/-6: regeneración celular. Carotenoides: fotoprotectores.',
    'aloe':         'Acemanano: inmunomodulador y cicatrizante. Vitaminas C y E: antioxidantes. Ácido salicílico: antiinflamatorio cutáneo.',
    'diente de leon': 'Taraxacina: colerética. Inulina: prebiótico. Potasio: diurético osmótico.',
    'toronjil':     'Ácido rosmarínico: ansiolítico y antiviral. Citral: espasmolítico. Flavonoides: sedantes.',
    'melisa':       'Ácido rosmarínico: antiviral. Citral: ansiolítico. Polifenoles: neuroprotectores.',
    'cedrón':       'Citral y nerol: ansiolíticos y antivirales. Verbascósido: antiinflamatorio. Flavonoides: sedantes.',
    'cedron':       'Citral y nerol: ansiolíticos y antivirales. Verbascósido: antiinflamatorio. Flavonoides: sedantes.',
    'hinojo':       'Trans-anetol: espasmolítico y galactagogo. Fenchona: carminativo. Flavonoides: antioxidantes.',
    'anís':         'Trans-anetol: carminativo y espasmolítico. Estragol: analgésico. Furfurol: expectorante.',
    'perejil':      'Apiol: diurético. Miristicina: antiagregante. Vitamina K: coagulación.',
    'orégano':      'Carvacrol y timol: antibacterianos. Ácido rosmarínico: antioxidante. Luteolina: espasmolítica.',
    'laurel':       'Eugenol: analgésico y antiinflamatorio. Cineol: expectorante. Ácido laúrico: antifúngico.',
    'ruda':         'Rutina: venotónica y antiinflamatoria. Alcaloides furoquinolínicos: antiespasmódicos. Cumarinas: anticoagulantes.',
    'verbena':      'Verbascósido (feniletanoide): antiinflamatorio y antioxidante. Aucubina (iridoide): antiinflamatorio. Flavonoides: sedantes leves y diuréticos.',
    'quillay':      'Saponinas quilaya: inmunoestimulantes y expectorantes. Quillajoside: antiinflamatorio. Taninos: astringentes.',
    'aceite de oliva': 'Oleocanthal: antiinflamatorio similar al ibuprofeno. Ácido oleico: cardioprotector. Vitamina E: antioxidante.',
    'aceite esencial': 'Terpenos y fenilpropanoides: antisépticos, antiinflamatorios y aromaterapéuticos. Linalool u otros alcoholes terpénicos: ansiolíticos.',
    # ─ Ingredientes alimentarios activos ────────────────────────────────────
    'árnica':       'Helenalina (sesquiterpeno lactonico): potente antiinflamatorio externo; inhibe NF-κB y agregación plaquetaria. Flavonoides (isoquercetina, astragalina): antiedematosos y analgésicos. Aceites esenciales: antimicrobianos tópicos.',
    'árnica':       'Helenalina y dihidrohelenalina: antiinflamatorios sesquiterpénicos potentes; inhiben NFkB. Flavonoides (isoquercetina): antiedematosos. Aceites esenciales (timol, carvacrol): antisépticos tópicos.',
    'ajenjo':       'Absintina y artabsina (sesquiterpenos lactonicos): estimulantes de la secreción gástrica y biliaria. Tuyona (monoterpeno cetónico): estimulante del SNC en dosis bajas. Azulenes: antiinflamatorios.',
    'saúco':        'Sambunigrina (glucósido cianogénico): en bayas crudas; flores y bayas cocidas son seguras. Rutina y quercetina: antiinflamatorios y antivirales. Lectinas (sambucus nigra aglutinina): inmunomoduladoras.',
    'avena':        'Avenantramidas: antioxidantes y antiinflamatorias cutáneas únicas de la avena. Beta-glucanos: inmunomoduladores e hipocolesterolemiantes. Ácido ferúlico: antioxidante y fotoprotector.',
    'linaza':       'Secoisolariciresinol diglucósido (SDG): lignano con actividad estrogénica débil y antioxidante. Ácido alfa-linolénico (ALA): omega-3 antiinflamatorio. Mucílagos: laxante osmótico y emoliente intestinal.',
    'cebolla':      'Quercetina y fisetin: antihistamínicos y antiinflamatorios potentes. Aliína y disulfuros orgánicos: antimicrobianos y antiagregantes. Vitamina C e inulina: inmunoestimulantes.',
    'manzana':      'Quercetina: antihistamínico y antiinflamatorio. Pectina: prebiótico y reductor de LDL. Ácido málico: alcalinizante y quelante suave.',
    'plátano':      'Vitamina B6 (piridoxina): cofactor en síntesis de serotonina y GABA. Potasio: regulador del balance electrolítico. Triptófano: precursor de serotonina.',
    'almendra':     'Vitamina E (tocoferoles y tocotrienoles): antioxidante liposoluble. Ácidos grasos monoinsaturados (oleico): cardioprotectores. Magnesio y calcio: relajantes musculares.',
    'apio':         'Apiina (apigenina-7-glucósido): espasmolítica y diurética. Ftalidas (3-n-butilftalida): antihipertensivas por vasodilatación. Apigenina: antiinflamatoria y ansiolítica.',
    'zanahoria':    'Beta-caroteno: precursor de vitamina A; antioxidante y regenerador epitelial. Falcarinol: antifúngico y anticancerígeno. Vitamina K: hemostática.',
    'malva':        'Mucílagos (polisacáridos ácidos): emolientes y antiinflamatorios sobre mucosas. Malvídina y antocianinas: antioxidantes. Flavonoides: antiinflamatorios.',
    'vinagre':      'Ácido acético: antimicrobiano por reducción de pH. Ácido málico y ácido tartárico: alcalinizantes urinarios. Polifenoles (en vinagre de manzana): antioxidantes.',
    'trébol':       'Isoflavonas (genisteína, daidzeína, formononetina): fitoestrógenos que modulan receptor estrogénico. Taninos: astringentes. Flavonoides: antiinflamatorios.',
    'linaza':       'SDG (lignano): antioxidante y fitoestrogénico. Ácido alfa-linolénico omega-3: antiinflamatorio. Mucílagos: laxante y emoliente.',
    'rosa':         'Geraniol y citronelol: antibacterianos y antifúngicos. Flavonoides (quercetina, kaempferol): antiinflamatorios. Vitamina C y beta-caroteno: antioxidantes.',
    'hierba santa': 'Safrol y metilchavicol: antisépticos y analgésicos. Flavonoides: antiinflamatorios. Taninos: astringentes.',
    # ─ Términos genéricos que aparecen en recetas ───────────────────────────
    'siete hierbas': 'Mezcla polifenólica de 7 plantas medicinales: sinergia de flavonoides, aceites esenciales y taninos. Iridoides ceremoniales: actividad adaptogénica e inmunomoduladora. Terpenos depurativos: limpieza orgánica y espiritual.',
    'muña':         'Pulegona y carvacrol: carminativos, espasmolíticos y antisépticos. Mentol: analgésico local. Flavonoides: antiinflamatorios digestivos.',
    'wira wira':    'Quercetina e isorhamnetina: antiinflamatorias y expectorantes. Ácido rosmarínico: antiviral. Aceites esenciales: antisépticos respiratorios.',
    'pingo pingo':  'Efedrina y pseudoefedrina (alcaloides feniletilamínicos): broncodilatadores y vasoconstrictores. Taninos: astringentes. Uso regulado: principios activos potentes.',
    'romerillo':    'Flavonoides (quercetina, luteolina): antiinflamatorios. Sesquiterpenos: antisépticos. Compuestos fenólicos: antioxidantes.',
    'baccharis':    'Flavonoides y ácidos diterpénicos: antiinflamatorios e inmunomoduladores. Aceites esenciales: antisépticos. Taninos: astringentes.',
    'senecio':      'Alcaloides pirrolizidínicos: principios activos potentes; uso externo exclusivamente y bajo supervisión. Flavonoides: antiinflamatorios. Taninos: hemostáticos.',
    # ─ Plantas adicionales detectadas ───────────────────────────────────────
    'zarzaparrilla':  'Sarsasapogenina y smilagenina (sapogeninas esteroidales): antiinflamatorias y depurativas; modulan receptores de esteroides. Sitosterol y estigmasterol: reguladores del metabolismo lipídico. Taninos: astringentes y antimicrobianos dérmicos.',
    'cardo mariano':  'Silimarina (complejo de flavonolignanos: silibina, silidianina, silicristina): hepatoprotectora potente; estabiliza membranas de hepatocitos y estimula la síntesis de proteínas hepáticas. Taxifolina: antioxidante y antiinflamatoria. Silibina: regeneradora hepática.',
    'gobernadora':    'Ácido nordihidroguaiarético — NDGA (lignano): potente antioxidante e inhibidor de lipoxigenasas; antiinflamatorio y antimicrobiano. Nordihydroguaiaretic acid: activo contra Mycobacterium tuberculosis. Flavonoides: fotoprotectores y antioxidantes.',
    'marrubio':       'Marrubiína (diterpeno): expectorante y mucolítico por estimulación de secreciones bronquiales. Acteoside y forsitósido: antiinflamatorios. Flavonoides (luteolina, apigenina): espasmolíticos y hipoglucemiantes.',
    'albahaca':       'Eugenol (fenilpropanoide): analgésico y antibacteriano. Linalool y metilchavicol: ansiolíticos y antisépticos. Ácido ursólico: antiinflamatorio e hipoglucemiante. Flavonoides (orientin, vicenin): antioxidantes.',
    'repollo':        'Sulforafano (isotiocianato): inductor de enzimas de detoxificación de fase II; anticancerígeno y antiinflamatorio. Glutamina: regeneradora de mucosa gástrica. Vitamina K y vitamina C: hemostáticas y antioxidantes. Glucosinolatos: antimicrobianos.',
    'cebada':         'Beta-glucanos (polisacárido soluble): emolientes, hipocolesterolemiantes e inmunomoduladores. Hordenina (alcaloide feniletilamínico): antimicrobiana. Avenantramidas: antioxidantes y antiinflamatorias cutáneas.',
    'pimiento':       'Capsaicina (capsaicinoide): analgésico por desensibilización de receptores TRPV1; antiinflamatorio tópico potente. Capsantina y capsorrubina (carotenoides): antioxidantes. Vitamina C: inmunoestimulante y cicatrizante.',
    'pepino':         'Cucurbitacinas B y D: antiinflamatorias y hepatoprotectoras. Silicio orgánico: regenerador dérmico y antiedad. Vitaminas C y K: antioxidante y hemostática. Ácido cafeico: antiinflamatorio.',
    'arcilla':        'Silicatos de aluminio hidratados (montmorillonita, caolín): adsorbentes de toxinas y agentes antimicrobianos físicos. Minerales (sílice, magnesio, calcio, hierro): remineralizantes. Efecto osmótico: reduce la inflamación cutánea y el exceso de sebo.',
    'coca':           'Cocaína y ecgonina (alcaloides tropánicos): anestésicos locales y vasoconstrictores; uso ceremonial en cultura andina. Flavonoides (quercetina, rutina): antioxidantes. Vitaminas A, B2, C y minerales: nutritivos.',
    'poe':            'Compuestos aromáticos rituales: aceites esenciales con actividad ansiolítica y ceremonial en medicina tradicional andina. Flavonoides: antioxidantes. Taninos: astringentes.',
    'hierba del chancho': 'Flavonoides (quercetina, kaempferol): hepatoprotectores y antioxidantes. Terpenoides amargos: colereticos y colagogos. Taninos: astringentes y protectores de la mucosa hepática.',
    'maldicion':      'Flavonoides y diterpenos (en Parastrephia lucida): antiinflamatorios y antisépticos. Aceites esenciales: antimicrobianos y expectorantes. Ácidos fenólicos: antioxidantes.',
    'calchacura':     'Flavonoides y saponinas (planta rupícola andina): antiinflamatorios y analgésicos tópicos. Taninos: astringentes. Compuestos fenólicos: antimicrobianos del conducto auditivo.',
    'malta':          'Beta-glucanos de cebada fermentada: emolientes y antiinflamatorios. Enzimas (amilasas, proteasas): demulcentes. Vitaminas del complejo B: soporte metabólico y expectorante leve.',
    'cera negra':     'Cera vegetal (ésteres de ácidos grasos de cadena larga): barrera oclusiva que protege el cuero cabelludo. Ácidos grasos saturados: emolientes y suavizantes del cabello. Esterol vegetal: nutrición capilar.',
    'palo negro':     'Taninos condensados y flavonoides (en Prosopis): astringentes y antihiperglucémicos. Alcaloides piperidínicos: reguladores del metabolismo glucídico. Goma (galactomanano): fibra soluble que retarda la absorción de glucosa.',
    'melosa':         'Mucílagos polisacáridos: emolientes y cicatrizantes sobre heridas y quemaduras. Taninos: astringentes y hemostáticos. Flavonoides: antiinflamatorios cutáneos.',
    'marrubio':       'Marrubiína: expectorante y mucolítico. Acteoside: antiinflamatorio. Luteolina: espasmolítica e hipoglucemiante.',
    'siete hierbas':  'Mezcla polifenólica sinérgica: flavonoides, aceites esenciales y taninos de 7 plantas. Iridoides ceremoniales: adaptogénicos e inmunomoduladores. Efecto ritual: vía olfatoria y simbólica con actividad ansiolítica documentada.',
    'parastrephia':   'Flavonoides y diterpenos: antiinflamatorios y antisépticos. Aceites esenciales: antimicrobianos y expectorantes. Ácidos fenólicos: antioxidantes.',
    'aceite de coco': 'Ácido láurico y ácido caprílico: antifúngicos y antibacterianos de amplio espectro. Triglicéridos de cadena media (TCM): energía rápida y barrera lipídica capilar. Vitamina E: antioxidante y nutritivo del cabello.',
    'manteca de cacao': 'Ácido esteárico y ácido oleico: emolientes que restauran la barrera lipídica cutánea. Polifenoles (procianidinas): antioxidantes y antiinflamatorios dérmicos. Vitamina E y fitosteroles: regeneradores celulares.',
    'yogurt':         'Ácido láctico: exfoliante suave y acidificante de pH cutáneo. Probióticos (Lactobacillus): equilibran la microbiota cutánea. Proteínas (caseína) y zinc: hidratantes y cicatrizantes.',
    'vinagre de manzana': 'Ácido acético: antimicrobiano y equilibrador del pH cutáneo. Ácido málico: exfoliante suave. Polifenoles (quercetina, ácido clorogénico): antioxidantes y reguladores del sebo.',
    # ─ Plantas mapuche y chilenas específicas ────────────────────────────────
    'bailahuen':    'Flavonoides diterpénicos (bailahuenina, isorhamnetina): hepatoprotectores y antidepresivos suaves. Aceites esenciales monoterpénicos: colerécticos y colagogos. Ácidos fenólicos: antioxidantes hepáticos.',
    'bailahúen':    'Flavonoides diterpénicos (bailahuenina, isorhamnetina): hepatoprotectores y antidepresivos suaves. Aceites esenciales monoterpénicos: colerécticos y colagogos. Ácidos fenólicos: antioxidantes hepáticos.',
    'canchalagua':  'Secoiridoides (eritaurina, gentiopicrina): amargos tónicos que estimulan la secreción biliar y hepática. Flavonoides (isovitexina, swertisin): antiinflamatorios y depurativos. Xantonas: antimicrobianas.',
    'hierba del sapo': 'Saponinas triterpénicas (en Eryngium paniculatum): antiinflamatorias y digestivas. Flavonoides: antiespasmódicos sobre mucosa gástrica. Aceites esenciales: carminativos.',
    'quilquil':     'Taninos (en Blechnum chilense): astringentes y antiinflamatorios tópicos. Flavonoides: antiedematosos. Compuestos fenólicos: antimicrobianos cutáneos.',
    'membrillo':    'Taninos hidrolizables (ácido quínico, ácido cítrico): potentes astringentes antidiarreicos. Pectina: emoliente y reguladora del tránsito intestinal. Quercetina y kaempferol: antiinflamatorios.',
    'pimpinela':    'Taninos elágicos (en Sanguisorba minor): hemostáticos y astringentes sobre mucosa uterina. Flavonoides (quercetina): antiinflamatorios. Saponinas: emenagogos y reguladores del flujo menstrual.',
    'topa topa':    'Iridoides (en Calceolaria): antiinflamatorios tópicos. Flavonoides: antioxidantes dérmicos. Compuestos fenólicos: antimicrobianos cutáneos.',
    'palque':       'Saponinas esteroidales: antiinflamatorias y antimicrobianas. Alcaloides (en Cestrum): espasmolíticos digestivos. Flavonoides: antioxidantes. Uso con precaución.',
    'pulmonaria':   'Alantoína: cicatrizante y regeneradora de mucosa bronquial. Mucílagos: demulcentes sobre bronquios irritados. Silicio orgánico: fortalece tejido epitelial pulmonar. Ácido rosmarínico: antiinflamatorio.',
    'mostaza':      'Sinigrina y sinalbina (glucosinolatos): precursores de isotiocianatos rubefacientes; aumentan circulación local y activan TRPV1. Aceites esenciales sulfurados: bactericidas tópicos. Ácido erúcico: antiinflamatorio.',
    'quilquil':     'Flavonoides y taninos condensados (Blechnum chilense): astringentes y antiinflamatorios. Compuestos fenólicos: antisépticos dérmicos. Mucílagos: emolientes sobre piel inflamada.',
    # ─ Ingredientes cosméticos / alimentarios ────────────────────────────────
    'carbonilla':   'Carbón activado (carbono amorfo poroso): adsorbente de toxinas y exceso de sebo; efecto detox dérmico. Minerales de silicato: absorbentes de impurezas. pH neutro: compatible con todos los tipos de piel.',
    'levadura':     'Vitaminas del complejo B (B1, B2, B3, B6, B9): cofactores de renovación celular epidérmica. Beta-glucanos de Saccharomyces: inmunomoduladores y equilibradores de sebo. Zinc y selenio: antiséborreicos y antioxidantes.',
    'te negro':     'Catequinas (galato de epigalocatequina — EGCG): antioxidantes vasculares y antiinflamatorios. Cafeína y teobromina: vasoconstrictores que reducen ojeras y edema periocular. Taninos: astringentes que tensan la piel.',
    'té negro':     'Catequinas (galato de epigalocatequina — EGCG): antioxidantes vasculares y antiinflamatorios. Cafeína y teobromina: vasoconstrictores que reducen ojeras y edema periocular. Taninos: astringentes que tensan la piel.',
    'agua de coco': 'Citoquininas (trans-zeatina): antienvejecimiento celular y antioxidantes. Electrolitos (potasio, magnesio, sodio): rehidratantes isotónicos. Laurato y caprilato: antimicrobianos naturales.',
    'polen de abeja': 'Flavonoides (quercetina, kaempferol, isoramnetina): antioxidantes e inmunoestimulantes. Aminoácidos esenciales (18 en total): soporte metabólico. Vitaminas B, C y E: energizantes y cofactores enzimáticos.',
    'te verde':     'EGCG (epigalocatequina galato): antioxidante 25x más potente que vitamina C; antiinflamatorio. L-teanina: ansiolítico y neuroprotector. Cafeína: estimulante circulatorio y energizante.',
    'té verde':     'EGCG (epigalocatequina galato): antioxidante y antiinflamatorio. L-teanina: ansiolítico. Cafeína: estimulante.',
    'propóleo':     'Artepillin C y kaempferol: antibacterianos de amplio espectro. Flavonoides (galangin, pinocembrina): antivirales e inmunoestimulantes. Resinas fenólicas: cicatrizantes y antisépticas.',
    'propolis':     'Artepillin C y kaempferol: antibacterianos. Galangin y pinocembrina: antivirales. Resinas fenólicas: cicatrizantes.',
    'jalea real':   'Ácido 10-HDA (10-hidroxi-2-decenoico): antibacteriano único de jalea real; modulador inmunológico. Proteínas royalisinas: antimicrobianas. Vitaminas B5 y B6: metabólicas y energizantes.',
    'espirulina':   'Ficocianina: pigmento antioxidante y antiinflamatorio; inhibe COX-2. Proteínas completas (60-70%): soporte nutricional. Vitamina B12, hierro y betacaroteno: hematopoyéticos e inmunoestimulantes.',
    'moringa':      'Isotiocianatos (moringin): antiinflamatorios e hipoglucemiantes. Zeatin: citoquinina antienvejecimiento. Vitaminas C, A y hierro: inmunoestimulantes y hematopoyéticos. Quercetina y ácido clorogénico: antioxidantes.',
    'noni':         'Proxeronina (precursor de xeronina): modulador de proteínas celulares. Damnacanthal: induce apoptosis en células tumorales. Escopoletina: antiinflamatoria e hipotensora. Vitamina C y potasio: antioxidantes.',
    'chía':         'Ácido alfa-linolénico ALA (omega-3): antiinflamatorio y cardioprotector. Mucílagos: prebióticos y reguladores del tránsito intestinal. Calcio, magnesio y fósforo: remineralizantes óseos.',
    'linaza':       'Secoisolariciresinol diglucósido SDG: lignano fitoestrogénico y antioxidante. Ácido alfa-linolénico omega-3: antiinflamatorio. Mucílagos: laxante osmótico y emoliente.',
    # ─ Hierbas internacionales con uso en herbolaría chilena ─────────────────
    'ginseng':      'Ginsenósidos Rb1, Rg1 y Rg3 (triterpenos tetracíclicos): adaptógenos que modulan el eje HPA; neuroprotectores y anticancerígenos. Polisacáridos (ginsan): inmunomoduladores. Panaxinol: estimulante del SNC.',
    'rhodiola':     'Salidrosido (glucósido fenilpropanoide): adaptógeno antiestrés que reduce cortisol; neuroprotector. Rosavinas y rozarina: antidepresivos que modulan serotonina y dopamina. Tirosol: cardioprotector.',
    'brahmi':       'Bacósidos A y B (triterpenos saponínicos): mejoran la plasticidad sináptica y la transmisión colinérgica. Bacopasaponinas: neuroprotectoras y antioxidantes cerebrales. Hersaponina: ansiolítica.',
    'bacopa':       'Bacósidos A y B: mejoran la transmisión colinérgica y la plasticidad sináptica. Bacopasaponinas: neuroprotectoras. Hersaponina: ansiolítica.',
    'gotu kola':    'Asiaticósido y madecasósido (saponinas triterpenoides): regeneran colágeno y mejoran la microcirculación cerebral. Ácido asiático: neuroprotector. Brahmiósidos: ansiolíticos leves.',
    'centella':     'Asiaticósido y madecasósido: regeneran colágeno y mejoran microcirculación. Ácido asiático: neuroprotector. Brahmiósidos: ansiolíticos.',
    'amapola de california': 'Californidina y eschscholtzina (alcaloides benzoisoquinolínicos): sedantes y ansiolíticos por acción sobre receptores GABA y opioides. Protopina: espasmolítica. Flavonoides: sedantes sinérgicos.',
    'eschscholzia': 'Californidina y eschscholtzina: sedantes y ansiolíticos. Protopina: espasmolítica. Flavonoides: sedantes.',
    'lúpulo':       '2-Metil-3-buten-2-ol (metabolito del humulol): sedante por potenciación de GABA-A. 8-Prenilnarigenina: fitoestrógeno potente. Humulona y lupulona (resinas amargas): antiinflamatorias y antibacterianas.',
    'lupulo':       '2-Metil-3-buten-2-ol: sedante por potenciación de GABA-A. 8-Prenilnarigenina: fitoestrógeno. Humulona y lupulona: antiinflamatorias.',
    'onagra':       'Ácido gamma-linolénico GLA (omega-6): precursor de prostaglandinas antiinflamatorias PGE1; regula el ciclo menstrual. Ácido linoleico: barrera epidérmica. Vitamina E: antioxidante.',
    'frambuesa':    'Frambinona (cetona de frambuesa): lipolítica y antiobesidad. Elagitaninos (sanguiína H-6): antioxidantes potentes. Vitamina C y antocianinas: inmunoestimulantes.',
    'dong quai':    'Z-Ligustilida (ftalida): espasmolítica sobre musculatura uterina; vasodilatadora. Ferulatosa y ácido ferúlico: antiinflamatorios. Cumarinas (osteol): anticoagulantes leves.',
    'agnocasto':    'Aucubina y agnusida (iridoides): modulan dopamina y disminuyen prolactina; regulan ciclo menstrual. Casticina y luteolina: antiinflamatorias. Diterpenos: estrogénicos débiles.',
    'vitex':        'Aucubina y agnusida: reducen prolactina y regulan ciclo menstrual. Casticina: antiinflamatoria. Diterpenos: estrogénicos débiles.',
    'cimifuga':     'Actein y 23-epi-26-deoxyactein (glucósidos triterpenoides): modulan receptores estrogénicos sin actividad hormonal directa. Ácido isoferúlico: antiinflamatorio. Formononetin: isoflavona adaptógena.',
    'artemisa':     'Artabsina y absintina (sesquiterpenos lactonicos): emenagogos y reguladores del ciclo menstrual. Aceites esenciales (tuyona, borneol): antisépticos y espasmolíticos uterinos. Flavonoides: antiinflamatorios.',
    'ricino':       'Ácido ricinoleico (ácido graso hidroxi): antiinflamatorio profundo por penetración transdérmica; estimula circulación linfática. Ricinina (alcaloide): a concentraciones de uso externo, sin toxicidad. Vitamina E: antioxidante.',
    'bardana':      'Arctigenina (lignano): antiinflamatoria e inmunomoduladora; inhibe formación de citoquinas. Inulina: prebiótico que regula microbiota intestinal. Ácido clorogénico: antioxidante y depurativo hepático.',
    'fenogreco':    'Diosgenina (sapogenina esteroidal): precursora sintética de hormonas; estimula libido y producción de leche. 4-Hidroxiisoleucina: insulinosensibilizante. Mucílagos: demulcentes digestivos.',
    'mirra':        'Sesquiterpenos (curzereno, lindestreno): antiinflamatorios y antimicrobianos de mucosa bucal. Guggulsterol y guggulsterones: antiinflamatorios sistémicos. Compuestos fenólicos: antisépticos y cicatrizantes.',
    'copal':        'Resinas diterpénicas (ácido copálico, ácido agálico): antiinflamatorias y antimicrobianas. Monoterpenos (alfa-pineno, limoneno): ansiolíticos por vía aromática. Sesquiterpenos: ceremoniales y depurativos.',
    'mirra':        'Sesquiterpenos (curzereno, lindestreno): antiinflamatorios orales. Guggulsterones: antiinflamatorios. Fenoles: antisépticos bucales.',
    'miso':         'Isoflavonas (genisteína, daidzeína): fitoestrógenas y cardioprotectoras. Vitamina K2 (menaquinona): mineralización ósea. Probióticos (Lactobacillus): modulación de microbiota intestinal.',
    'wakame':       'Fucoidán (polisacárido sulfatado): inmunomodulador y anticoagulante. Fucoxantina (carotenoide): antioxidante y antiobesidad. Yodo orgánico: regulador tiroideo.',
    'alga':         'Fucoidán: inmunomodulador y antiviral. Fucoxantina: antioxidante. Minerales marinos (yodo, selenio, magnesio): remineralizantes.',
    'sal marina':   'Cloruro de sodio: antiséptico por presión osmótica que destruye membranas bacterianas. Minerales traza (magnesio, potasio, calcio): remineralizantes de tejidos. Efecto pH: alcalinizante bucal que inhibe Streptococcus mutans.',
    'huevo':        'Lisozima (clara): enzima antibacteriana. Lecitina y colesterol (yema): reparadores de barrera lipídica démica. Proteínas completas: sustrato para ritual de limpieza energética tradicional.',
    'incienso':     'Ácido boswélico y acetil-boswélico (AKBA): antiinflamatorios potentes; inhiben 5-lipoxigenasa. Monoterpenos (alfa-pineno, limoneno): ansiolíticos aromáticos. Incensol acetato: antidepresivo por activación de canales iónicos cerebrales.',
    # ─ Aceites y cosméticos especializados ───────────────────────────────────
    'argán':        'Vitamina E (tocoferoles): antioxidante liposoluble de alta concentración; frena el envejecimiento cutáneo. Escualeno: emoliente y regenerador de barrera lipídica. Ácidos grasos (oleico y linoleico): nutrición y restauración de cutícula capilar.',
    'argan':        'Vitamina E y escualeno: antioxidantes y regeneradores dérmicos. Ácidos grasos (oleico, linoleico): nutrición cutánea y capilar.',
    'jojoba':       'Ésteres de cera líquida (ácido gadolénico y erúcico): estructuralmente análogos al sebo humano; regulan el sebo sin obstruir poros. Vitamina E y vitamina B: nutritivos. Miristo: antiinflamatorio dérmico.',
    'neem':         'Azadiractina (limonoide tetranortriterpenoide): antifúngico, antibacteriano y antiparasitario potente. Nimbolida: anticancerígena e inmunomoduladora. Gedunina: antifúngico activo contra Candida albicans.',
    'alumbre':      'Sulfato de aluminio y potasio (KAl(SO₄)₂): astringente que contrae los poros y reduce la transpiración. Actividad antimicrobiana: inhibe bacterias causantes del olor por cambio de pH. Efecto hemostático leve.',
    'alcanfor':     'Alcanfor (monoterpeno bicíclico): analgésico tópico por activación/desensibilización de TRPV1 y TRPM8; rubefaciente. Borneol: antiinflamatorio y antimicrobiano. Cineol: descongestionante y anestésico local.',
    'aguacate':     'Ácido oleico (omega-9): emoliente profundo y cardioprotector. Luteína y zeaxantina: fotoprotectores oculares y cutáneos. Vitamina E y glutatión: antioxidantes celulares regeneradores.',
    'comino negro': 'Timoquinona (benzoquinona): antiinflamatoria potente; inhibe COX-1/2, LOX y producción de citoquinas. Nigelona: antihistamínica y antiasmática. Aceite fijo (ácido linoleico, ácido linolénico): regenerador dérmico y antiinflamatorio.',
    'copaiba':      'Beta-cariofileno (sesquiterpeno): antiinflamatorio por agonismo sobre receptor CB2; analgésico. Ácido copálico: antimicrobiano de amplio espectro. Resinas diterpénicas: cicatrizantes y antisépticas.',
    # ─ Plantas medicinales internacionales ───────────────────────────────────
    'angélica':     'Ftalidas (Z-ligustilida, butilftalida): espasmolíticas sobre músculo liso; diaforéticas y febrifugas. Cumarinas (bergapteno, oxipeucedanina): anticoagulantes leves. Aceites esenciales: carminativos.',
    'fumaria':      'Fumarina y coptisina (alcaloides isoquinolínicos): colerécticos y antiespasmódicos sobre vías biliares. Ácido fumárico: hepatoprotector e inmunomodulador. Flavonoides: antioxidantes hepáticos.',
    'regaliz':      'Glicirricina (triterpeno saponínnico): antiinflamatoria 50x más potente que cortisona a dosis terapéuticas; gastroprotectora. Glicirretina: inhibidora de 11-β-HSD (efecto mineralocorticoide). Isoflavonoides: antioxidantes.',
    'psyllium':     'Arabinoxilanos (mucílagos solubles): forman gel que retarda absorción de glucosa y colesterol; prebióticos. Beta-glucanos: inmunomoduladores. Efecto mecánico de masa: laxante osmótico sin irritación.',
    'genciana':     'Amarogentina (secoiridoide amargo): la sustancia más amarga conocida; estimula potentemente la secreción gástrica y biliar. Gentiopicrina: colerética. Swertiamarina: antiespasmódica e hipoglucemiante.',
    'achicoria':    'Inulina (fructooligosacárido): prebiótico que nutre bifidobacterias; hipoglucemiante. Ácido clorogénico: antioxidante y colagogo. Lactucopicrina: hepatoprotectora y amargo digestiva.',
    'cardamomo':    '1,8-Cineol (eucaliptol): carminativo, antiséptico oral y estimulante de secreciones digestivas. Acetato de terpinilo: antiespasmódico y aromaterapéutico. Alfa-terpineol: antimicrobiano.',
    'viola':        'Violantina y escutelareína (flavonoides): antiinflamatorios y antioxidantes. Saponinas (violasaponina): expectorantes. Mucílagos: demulcentes sobre piel y mucosas. Rutina: venotónica.',
    'pensamiento':  'Violantina y escutelareína: antiinflamatorios. Saponinas: expectorantes y depurativas. Mucílagos: emolientes.',
    'escutelaria':  'Baicalina y baicaleína (flavonas): ansiolíticas por modulación GABA-A; neuroprotectoras y antiinflamatorias. Escutelarina: antioxidante y anticoagulante. Wogonina: sedante y anticancerígena.',
    'hisopo':       'Marrubina e isopinocanfona (diterpenos): expectorantes y mucolíticos; estimulan secreciones bronquiales. Flavonoides (diosmina, hesperidina): venotónicos y antiinflamatorios. Aceites esenciales: antisépticos.',
    'nuez moscada': 'Miristicina (fenilpropanoide): analgésica y antiinflamatoria tópica por inhibición de COX-2. Elemicina: analgésica y antiséptica. Safrol: rubefaciente a bajas dosis. Eugenol: anestésico local.',
    'geranium':     'Ácido geránico y germanio orgánico: antioxidantes y antiinflamatorios. Taninos (ácido gálico, ácido elágico): astringentes sobre mucosas alérgicas. Quercetina: antihistamínico.',
    'corydalis':    'Tetrahidropalmitina THP (alcaloide isoquinolínico): analgésico no opiáceo por bloqueo de dopamina D1/D2; modulador del dolor neuropático. Coptisina: antiinflamatoria. Dihidropalmatina: sedante.',
    'poligala':     'Seneginas A y B (saponinas triterpénicas): expectorantes potentes; irritan la mucosa bronquial estimulando el reflejo tusígeno. Xantinas: antiinflamatorias. Polisacáridos: inmunomoduladores.',
    'ashoka':       'Leucocianidinas y catequinas (Saraca indica): antiinflamatorias uterinas y hemostáticas. Esteroles (β-sitosterol): estabilizadores del endometrio. Flavonas: espasmolíticas sobre musculatura uterina.',
    'gymnema':      'Ácido gimnémico (saponina triterpenoide): bloquea receptores de sabor dulce; reduce la absorción intestinal de glucosa. Gurmarina: peptídico inhibidor de la absorción de azúcares. Flavonas: hipoglucemiantes.',
    'maca':         'Macamidas y macaenos (amidas de ácidos grasos): adaptógenas que mejoran la libido y la resistencia al estrés. Glucosinolatos (glucotropaeolina): anticancerígenos. Minerales (hierro, zinc): hematopoyéticos.',
    # ─ Algas y plantas acuáticas chilenas ────────────────────────────────────
    'cochayuyo':    'Fucoidán (polisacárido sulfatado de Durvillaea antarctica): antiviral, inmunomodulador y anticoagulante. Ácido algínico: quelante de metales pesados y desintoxicante. Yodo orgánico: regulador tiroideo esencial.',
    'triwe':        'Poligodial y drimanial (sesquiterpenos dialdeídos): antiinflamatorios potentes y antimicrobianos. Terpenos fenólicos: antisépticos respiratorios. Flavonoides: antioxidantes e inmunoestimulantes.',
    # ─ Plantas mapuche menos conocidas ───────────────────────────────────────
    'notro':        'Taninos hidrolizables (ácido gálico, ácido elágico): astringentes potentes de mucosa faríngea. Flavonoides (quercetina): antiinflamatorios. Aceites esenciales: antisépticos de vías respiratorias altas.',
    'temu':         'Cineol y terpineol: antisépticos renales y diuréticos. Taninos: astringentes de vías urinarias. Flavonoides: antiinflamatorios de pelvis renal.',
    'chupalla':     'Flavonoides y taninos (Fascicularia bicolor): antioxidantes y antiinflamatorios. Mucílagos: emolientes sobre bronquios irritados. Saponinas: bequicas y expectorantes.',
    'roble pellin': 'Taninos elagitánicos y catequinas (Nothofagus obliqua): astringentes potentes y antimicrobianos. Ácido elágico: antiinflamatorio. Proantocianidinas: antioxidantes y venotónicos.',
    'anamu':        'Dibenzil disulfuro (en Petiveria alliacea): inmunomodulador y antiinflamatorio; activo contra hongos y bacterias. Flavonoides: antioxidantes. Cumarinas: anticoagulantes leves.',
    'cola de zorro':'Silicio orgánico: remineralizante articular. Flavonoides: antiinflamatorios. Mucílagos: emolientes sobre articulaciones inflamadas.',
    'lleuque':      'Diterpenos y taninos (Prumnopitys andina): diuréticos y antisépticos de vías urinarias. Flavonoides: antiinflamatorios renales. Compuestos fenólicos: antioxidantes.',
    'hierba del platero': 'Taninos y compuestos fenólicos: antisépticos y cicatrizantes sobre heridas. Flavonoides: antiinflamatorios. Mucílagos: demulcentes.',
    # ─ Ingredientes alimentarios funcionales ─────────────────────────────────
    'arroz':        'Almidón resistente (prebiótico): nutre microbiota intestinal y regula el tránsito. Inositol: precursor de fosfoinosítidos; regulador del peristaltismo. Agua de arroz: demulcente y astringente suave.',
    'ciruela':      'Sorbitol: laxante osmótico natural. Ácido clorogénico: estimulante de la motilidad intestinal. Procianidinas y antocianinas: antioxidantes. Fibra soluble (pectina): prebiótica.',
    'nuez':         'Ácido alfa-linolénico ALA (omega-3): antiinflamatorio y cardioprotector. Juglanina y ácido elágico: antioxidantes. Melatonina: regulador del sueño. Arginina: vasodilatadora.',
    'cereza':       'Melatonina: regulador circadiano del sueño; antioxidante neuronal. Antocianinas (cianidina-3-glucósido): antiinflamatorias e hipnóticas. Triptófano: precursor de melatonina.',
    'achiote':      'Bixina y norbixina (carotenoides): antioxidantes y fotoprotectores. Tocotrienoles (vitamina E): protección celular. Ácido ferúlico: antiinflamatorio e hipoglucemiante.',
    'grosella negra': 'Antocianinas (cianidina-3-rutinósido, delfinidina): potentes antioxidantes vasculares. Vitamina C (mayor concentración que el limón): inmunoestimulante. Ácido gamma-linolénico GLA: antiinflamatorio.',
    'sacha inchi':  'Ácido alfa-linolénico ALA (omega-3, 48%): el aceite vegetal con mayor concentración de omega-3. Proteínas completas con todos los aminoácidos esenciales. Vitamina E y resveratrol: antioxidantes potentes.',
    'bicarbonato':  'Bicarbonato de sodio (NaHCO₃): alcaliniza el pH cutáneo reduciendo el prurito por mecanismo ácido-base. Acción osmótica suave: reduce inflamación cutánea. Descongestiona poros por efecto limpiador físico.',
    'magnesio':     'Magnesio elemental: cofactor de más de 300 enzimas; relajante muscular, regulador del SNC y estabilizador del eje HPA. Vitamina B6 (P-5-P): potencia la absorción de magnesio y la síntesis de GABA. Efecto ansiolítico y premenstrual.',
    'kratom':       'Mitragynina y 7-hidroximitragynina (alcaloides indólicos): agonistas parciales de receptores mu-opioides; analgésicos potentes y antitusivos. Corynantheidina: antagonista de receptores opioides. Uso regulado; principios activos muy potentes.',
    'semillas de cáñamo': 'Ácido gamma-linolénico GLA (omega-6) y ácido alfa-linolénico ALA (omega-3) en proporción 3:1 óptima: antiinflamatorios. CBD en trazas (semillas): antiinflamatorio. Proteínas completas y vitamina E: regeneradores.',
    'aceite de hígado de bacalao': 'EPA y DHA (ácidos grasos omega-3 de cadena larga): potentes antiinflamatorios sistémicos. Vitamina A (retinol): inmunoestimulante y regeneradora epitelial. Vitamina D3: reguladora del sistema inmune y calcio óseo.',
    'copal blanco': 'Resinas diterpénicas (ácido copálico, ácido agálico): antiinflamatorias y antimicrobianas. Monoterpenos (alfa-pineno, limoneno): ansiolíticos por vía aromática. Sesquiterpenos: ceremoniales con actividad antidepresiva.',
    'baño de luna': 'Agua fría (hidroterapia): activa el sistema nervioso simpático; libera noradrenalina y endorfinas. Efecto Wimhof: reduce inflamación sistémica por activación vagal. Estimula la circulación periférica y el sistema inmune.',
    'cimicifuga':   'Actein y 23-epi-26-deoxyactein (glucósidos triterpenoides): modulan receptores estrogénicos sin actividad hormonal directa; reducen sofocos. Ácido isoferúlico: antiinflamatorio. Formononetin: fitoestrógeno adaptógeno.',
    'col blanca':   'Sulforafano (isotiocianato): inductor de enzimas de detoxificación; antiinflamatorio sistémico potente. Glutamina: regeneradora de mucosa. Vitamina K y glucosinolatos: hemostáticos y antimicrobianos.',
    'dátil':        'Taninos (ácido gálico, procianidinas): astringentes y antioxidantes. Potasio y magnesio: electrolitos energizantes. Vitamina B6: cofactor en síntesis de serotonina y dopamina.',
    'vainilla':     'Vainillina (fenilpropanoide): antioxidante, antiinflamatoria y ansiolítica por modulación de receptores GABA. Ácido vanílico: antimicrobiano. Cumarinas: ligeramente anticoagulantes y aromáticas.',
    'amapola':      'Ácidos grasos de semilla (ácido linoleico, oleico): regeneradores cutáneos. Tocoferoles (vitamina E): antioxidantes. Lecitina: emulsionante y reparador de barrera lipídica. Sin alcaloides a diferencia de otras partes de la planta.',
    'hymenophyllum':'Flavonoides y compuestos fenólicos del helecho: antiinflamatorios y antioxidantes tópicos. Taninos: astringentes. Aceites esenciales: antisépticos cutáneos rituales.',
    'hierba de la estrella': 'Flavonoides y taninos (Hymenophyllum): antiinflamatorios tópicos. Compuestos fenólicos: antisépticos. Uso ceremonial mapuche: propiedades purificadoras.',
    'crisantemo':   'Borneol y alcanfor: analgésicos tópicos por desensibilización de TRPV1. Flavonoides (luteolina, apigenina): antiinflamatorios. Aceites esenciales: antisépticos dérmicos.',
    'cayena':       'Capsaicina (capsaicinoide): analgésico potente por desensibilización de receptores TRPV1; reduce la sustancia P. Capsantina: antioxidante carotenóide. Vitamina C: inmunoestimulante y circulatoria.',
    'lino':         'Ácido alfa-linolénico ALA (omega-3): antiinflamatorio sistémico. Lignanos (SDG): fitoestrogénicos y antioxidantes. Mucílagos: emolientes y antiinflamatorios tópicos por calor húmedo.',
    'col':          'Sulforafano: antiinflamatorio e inductor de enzimas detox. Glucosinolatos: antimicrobianos. Glutamina: regeneradora de tejido.',
}

# ── Propiedades por categoría ───────────────────────────────────────────────
PROPS_CAT = {
    'Digestivo':        ['digestivo', 'carminativo', 'antiespasmódico', 'colagogo'],
    'Antiparasitario':  ['antiparasitario', 'antihelmíntico', 'antiséptico intestinal', 'purificador'],
    'Diarrea':          ['antidiarreico', 'astringente', 'antiespasmódico', 'antiinflamatorio'],
    'Alimenticio':      ['nutritivo', 'remineralizante', 'depurativo', 'inmunoestimulante'],
    'Respiratorio':     ['expectorante', 'broncodilatador', 'mucolítico', 'antiséptico respiratorio'],
    'Tos':              ['bequico', 'expectorante', 'emoliente', 'antiinflamatorio'],
    'Expectorante':     ['expectorante', 'mucolítico', 'broncodilatador', 'antiséptico'],
    'Resfriados':       ['inmunoestimulante', 'antiviral', 'diaforético', 'antipirético'],
    'Garganta':         ['antiséptico', 'antiinflamatorio', 'astringente', 'analgésico local'],
    'Sedante':          ['sedante', 'ansiolítico', 'hipnótico leve', 'antiespasmódico'],
    'Memoria':          ['neuroprotector', 'vasodilatador cerebral', 'antioxidante', 'adaptógeno'],
    'Nervioso':         ['ansiolítico', 'sedante', 'antiespasmódico', 'adaptógeno'],
    'Dermatológico':    ['antiinflamatorio', 'cicatrizante', 'antimicrobiano', 'emoliente'],
    'Cicatrizante':     ['cicatrizante', 'regenerante tisular', 'antiséptico', 'hemostático'],
    'Cosmético':        ['emoliente', 'antioxidante', 'regenerante celular', 'fotoprotector'],
    'Cabello':          ['fortalecedor capilar', 'anticaspa', 'estimulante folicular', 'antiséborreico'],
    'Baño':             ['relajante muscular', 'descongestionante', 'antiinflamatorio', 'sedante'],
    'Antifúngico':      ['antifúngico', 'antimicrobiano', 'antiséptico', 'cicatrizante'],
    'Ginecológico':     ['antiespasmódico', 'emenagogo', 'antiinflamatorio', 'regulador hormonal'],
    'Cardiovascular':   ['cardiotónico', 'vasodilatador', 'antihipertensivo', 'antiagregante plaquetario'],
    'Renal':            ['diurético', 'antiséptico urinario', 'depurativo renal', 'antiinflamatorio'],
    'Diurético':        ['diurético', 'depurativo', 'antiedematoso', 'remineralizante'],
    'Analgésico':       ['analgésico', 'antiinflamatorio', 'antiespasmódico', 'antipirético'],
    'Antiinflamatorio': ['antiinflamatorio', 'analgésico', 'antioxidante', 'inmunomodulador'],
    'Reumatismo':       ['antiinflamatorio', 'analgésico', 'rubefaciente', 'antiartrítico'],
    'Dental':           ['analgésico dental', 'antiséptico bucal', 'antiinflamatorio', 'astringente'],
    'Pediátrico':       ['carminativo', 'antiespasmódico', 'sedante leve', 'antipirético'],
    'Alergia':          ['antihistamínico', 'antiinflamatorio', 'inmunomodulador', 'antiespasmódico'],
    'Energizante':      ['adaptógeno', 'estimulante', 'antifatiga', 'inmunoestimulante'],
    'Oftalmológico':    ['antiinflamatorio ocular', 'astringente', 'antiséptico', 'emoliente'],
    'Oídos':            ['antiinflamatorio', 'antiséptico', 'analgésico', 'ceruminolítico'],
    'General':          ['inmunoestimulante', 'antioxidante', 'depurativo', 'tonificante'],
    'Hepático':         ['colerético', 'colagogo', 'hepatoprotector', 'antioxidante hepático'],
    'Febrífugo':        ['antipirético', 'diaforético', 'antiinflamatorio', 'inmunoestimulante'],
    'Medicina Mapuche': ['ceremonial', 'antiinflamatorio', 'adaptógeno', 'inmunoestimulante'],
    'Espiritual':       ['purificador', 'ceremonial', 'aromático', 'adaptógeno'],
    'Nutritivo':        ['nutritivo', 'remineralizante', 'reconstituyente', 'vitaminizante'],
}

# ── Fallbacks conocidos (los que generé incorrectamente) ────────────────────
FALLBACK_STARTS = [
    'Flavonoides y compuestos fenólicos',
    'Flavonoides y taninos:',
    'Taninos elagitánicos:',
    'Aceites esenciales con 1,8-cineol',
    'Mucílagos vegetales: recubren',
    'Saponinas triterpénicas: efecto mucolítico',
    'Vitamina C y flavonoides: estimulan',
    'Taninos: astringentes y antisépticos sobre',
    'Flavonoides (flavonas y flavonoles): modulan',
    'Flavonoides con efecto vasodilatador',
    'Flavonoides antiinflamatorios: inhiben COX',
    'Sesquiterpenos: antiinflamatorios articulares',
    'Eugenol (en clavo):',
    'Flavonas (apigenina, luteolina): espasmolíticos',
    'Quercetina: antihistamínico natural',
    'Gingeroles o saponinas adaptogénicas',
    'Antocianinas: regeneran la rodopsina',
    'Aceites esenciales antisépticos: activos frente',
    'Vitamina C y bioflavonoides:',
    'Silimarina o flavonolignanos',
    'Salicilatos naturales',
    'Sesquiterpenos dialdeídos',
    'Aceites esenciales aromáticos',
    'Proteínas vegetales',
    'Fitoesteroles y flavonoides: estimulan',
    'Ácidos grasos esenciales (omega-3',
    'Alantoína: acelera',
    'Fenoles terpénicos (carvacrol',
    'Flavonas (apigenina',
]

def tiene_fallback(principios):
    """Detectar si el campo tiene un fallback genérico."""
    if not principios:
        return False
    return any(principios.startswith(f) for f in FALLBACK_STARTS)

def buscar_principios(r):
    """Buscar principios activos específicos por planta en ingredientes+título."""
    texto = (r.get('ingredientes', '') + ' ' + r.get('titulo', '')).lower()
    # Normalizar caracteres especiales
    texto = texto.replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').replace('ñ','n')
    texto_orig = (r.get('ingredientes', '') + ' ' + r.get('titulo', '')).lower()

    for planta, compuesto in COMPUESTOS.items():
        planta_n = planta.replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').replace('ñ','n')
        if planta_n in texto or planta in texto_orig:
            return compuesto
    return None

def generar_propiedades(r, principios):
    """Generar propiedades desde categoría + ingredientes."""
    cat = r.get('categoria', '')
    props_base = PROPS_CAT.get(cat, ['antiinflamatorio', 'antioxidante', 'depurativo'])
    texto = (r.get('ingredientes', '') + ' ' + r.get('titulo', '')).lower()
    extras = []
    if any(x in texto for x in ['miel', 'miel de ulmo']):
        extras.append('antimicrobiano')
    if any(x in texto for x in ['limón', 'limon', 'naranja']):
        if 'inmunoestimulante' not in props_base:
            extras.append('inmunoestimulante')
    if any(x in texto for x in ['berberina', 'berber', 'calafate', 'michay']):
        if 'antimicrobiano' not in extras:
            extras.append('antimicrobiano')
    result = []
    seen = set()
    for p in (props_base + extras):
        if p not in seen:
            seen.add(p)
            result.append(p)
    return result[:5]

# ── Cargar y corregir ────────────────────────────────────────────────────────
recetas = json.load(open('data/recetas.json', encoding='utf-8'))
corregidas = 0
sin_match = 0

for r in recetas:
    if tiene_fallback(r.get('principios_activos', '')):
        nuevos = buscar_principios(r)
        if nuevos:
            r['principios_activos'] = nuevos
            r['propiedades'] = generar_propiedades(r, nuevos)
            corregidas += 1
        else:
            sin_match += 1

print(f'Corregidas con datos específicos: {corregidas}')
print(f'Sin match específico (mantienen categoría): {sin_match}')

# Mostrar ejemplos corregidos
recientes = [x for x in recetas if x['id'] in [18, 19, 20, 22, 46]]
print()
print('=== Ejemplos corregidos ===')
for x in recientes:
    print(f'ID {x["id"]} | {x["titulo"]}')
    print(f'  principios: {x.get("principios_activos","")[:130]}')
    print(f'  propiedades: {x.get("propiedades",[])}')
    print()

with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)
print('Guardado en data/recetas.json')
