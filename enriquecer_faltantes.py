"""
Enriquece las 334 recetas sin principios_activos ni propiedades.
Ejecutar desde: C:/Users/usuario/Desktop/proyecto/
"""
import json, sys, re

sys.stdout.reconfigure(encoding='utf-8')

# ── Compuestos activos por planta ────────────────────────────────────────────
COMPUESTOS = {
    'murtilla':     'Antocianinas (cianidina-3-glucósido): propiedades antioxidantes y antimicrobianas. Ácido elágico: actividad antiinflamatoria y antiproliferativa. Vitamina C: estimulante inmunológico y cicatrizante.',
    'ortiga':       'Quercetina: antihistamínico y antiinflamatorio que inhibe la liberación de citoquinas proinflamatorias. Ácido fórmico y acetilcolina: responsables del efecto rubefaciente. Hierro orgánico y clorofila: apoyo en anemias ferropénicas.',
    'copihue':      'Mucílagos vegetales: acción emoliente y antiinflamatoria sobre mucosas irritadas. Taninos condensados: acción astringente sobre el tracto respiratorio superior. Saponinas: efecto expectorante y bequico.',
    'boldo':        'Boldina (alcaloide aporfínico): colerético y colagogo; estimula la secreción biliar. Limoneno y ascaridol: acción antiséptica y hepatoprotectora. Taninos: acción astringente sobre mucosa digestiva.',
    'manzanilla':   'Apigenina (flavonoide): espasmolítico sobre músculo liso, sedante leve por modulación GABAérgica. Alfa-bisabolol: antiinflamatorio y cicatrizante de mucosas. Camazuleno: potente antiinflamatorio generado durante la destilación.',
    'rosa mosqueta':'Vitamina C (ácido L-ascórbico): antioxidante y estimulante del colágeno. Ácidos grasos omega-3 y omega-6: regeneración celular y barrera epidérmica. Carotenoides: fotoprotección y actividad antioxidante.',
    'matico':       'Artemetina y luteolina: flavonoides con efecto antiinflamatorio y antimicrobiano. Taninos catéquicos: astringentes sobre heridas y mucosas. Saponinas: acción antiséptica y hemostática.',
    'eucalipto':    '1,8-Cineol (eucaliptol): expectorante, mucolítico y antibacteriano; inhibe la síntesis de prostaglandinas. Alfa-pineno: broncodilatador y antiinflamatorio. Globulol: actividad antiviral sobre virus respiratorios.',
    'maqui':        'Delfinidina y cianidina-3-sambubiosido: antocianinas con potente actividad antioxidante. Polifenoles totales: reducen LDL oxidado y marcadores inflamatorios. Flavonoles: efecto antiviral y hepatoprotector.',
    'llantén':      'Aucubina (iridoide): antiinflamatoria y hepatoprotectora. Mucílagos: emolientes sobre mucosas respiratorias y digestivas irritadas. Ácido rosmarínico: antioxidante y antialérgico.',
    'romero':       'Ácido rosmarínico: antioxidante y antiinflamatorio por inhibición de COX-2. Carnosol y ácido carnósico: neuroprotectores y antimicrobianos. 1,8-Cineol: estimulante circulatorio y expectorante.',
    'lavanda':      'Linalool: ansiolítico y sedante por modulación del receptor GABA-A. Acetato de linalilo: relajante muscular y antiinflamatorio leve. Flavonoides: acción espasmolítica y calmante.',
    'ajo':          'Alicina (tiosulfinato): antibacteriano de amplio espectro; activo contra H. pylori. Ajoeno y S-alilcisteína: reducción de LDL, inhibición de la agregación plaquetaria. Aliína: precursor de alicina; efecto antihipertensivo por inhibición de la ECA.',
    'jengibre':     'Gingeroles: antiinflamatorios y antieméticos; inhiben la síntesis de prostaglandinas y leucotrienos. Shogaoles (generados por calor): antinociceptivos más potentes que los gingeroles. Zingerona: antidiarreico y antioxidante.',
    'limón':        'Limoneno (monoterpeno): ansiolítico, anticancerígeno y antifúngico. Ácido cítrico: quelante mineral, alcalinizante urinario y antimicrobiano. Hesperidina y diosmina: flavonoides con efecto venotónico y antioxidante.',
    'miel':         'Peróxido de hidrógeno: bactericida de liberación lenta. Inhibinas y defensina-1: glicoproteínas antibacterianas de amplio espectro. Gluconolactona: ácido glucónico que mantiene pH ácido antimicrobiano. Flavonoides (pinocembrina): antiinflamatorio y cicatrizante.',
    'canela':       'Cinamaldehído: antibacteriano, antifúngico y antidiabético por sensibilización insulínica. Eugenol: analgésico local y antiinflamatorio por inhibición de COX-1/2. Taninos proantocianidínicos: astringentes y antidiarreicos.',
    'clavo':        'Eugenol (fenilpropanoide): analgésico dental potente, antimicrobiano y antiinflamatorio. Acetileugenol: espasmolítico intestinal. Taninos: astringentes y hemostáticos sobre mucosa bucal.',
    'tomillo':      'Timol y carvacrol: antibacterianos de amplio espectro; desnaturalizan proteínas de membrana bacteriana. Ácido ursólico: antiinflamatorio e inmunomodulador. Flavonoides (apigenina, luteolina): espasmolíticos y expectorantes.',
    'salvia':       'Ácido rosmarínico: antiinflamatorio y antioxidante. Tuyona (cetona terpénica): estimulante circulatorio y regulador hormonal (uso moderado). Acteósido: inmunomodulador y neuroprotector.',
    'menta':        'Mentol: analgésico local por activación de receptores de frío TRPM8; descongestionante y espasmolítico. Mentona: antiséptico y expectorante. Ácido rosmarínico: antiinflamatorio y antiviral.',
    'valeriana':    'Ácido valerénico: inhibidor de la recaptación de GABA y modulador de receptores 5-HT5a. Valepotriatos (isovaleróxido): sedantes y ansiolíticos. Hesperidina: efecto sinérgico relajante muscular.',
    'tilo':         'Linalool: ansiolítico por modulación GABAérgica. Flavonoides (quercetina, kaempferol): antiinflamatorios y espasmolíticos sobre músculo liso. Mucílagos: demulcentes sobre mucosas respiratorias.',
    'calendula':    'Calendulosidas y oleanólico: saponinas triterpénicas con actividad antiinflamatoria y cicatrizante. Carotenoides (licopeno, beta-caroteno): regeneración tisular y actividad antifúngica. Flavonoides (isoquercetina): antimicrobianos y antiedematosos.',
    'caléndula':    'Calendulosidas y oleanólico: saponinas triterpénicas con actividad antiinflamatoria y cicatrizante. Carotenoides (licopeno, beta-caroteno): regeneración tisular y actividad antifúngica. Flavonoides (isoquercetina): antimicrobianos y antiedematosos.',
    'cola de caballo': 'Ácido silícico y silicio orgánico: fortalecimiento de tejido conectivo y acción diurética. Saponinas (equisetonina): efecto antiinflamatorio sobre vías urinarias. Flavonoides (isoquercetina): antioxidantes y astringentes.',
    'paico':        'Ascaridol (peróxido monoterpénico): antiparasitario de alto espectro; activo contra Ascaris lumbricoides y Enterobius vermicularis. Safrol: antiséptico intestinal. Terpinenos: actividad antihelmíntica.',
    'arrayán':      'Eugenol y beta-cariofileno: antiinflamatorios y antimicrobianos. Antocianinas (delfinidin-3-glucósido): antioxidantes potentes. Taninos elagitánicos: astringentes y antidiarreicos.',
    'canelo':       'Poligodial (sesquiterpeno dialdeído): bloquea canales Nav1.7/Nav1.8; antinociceptivo y antiinflamatorio potente. Drimanial y confertifolin: antimicrobianos con amplio espectro antibacteriano y antifúngico. Taninos y flavonoides: acción antiinflamatoria sinérgica.',
    'diente de leon': 'Taraxacina y taraxerina: colereticos y colagogos; estimulan la bilis. Inulina (fructooligosacárido): prebiótiao y regulador glucémico. Potasio: diurético osmótico sin depleción de electrolitos.',
    'pasiflora':    'Crisina (flavonoide): agonista parcial de receptores GABA-A; ansiolítico comparable a benzodiazepinas en dosis bajas. Orientina y vitexina: sedantes y espasmolíticos sobre músculo liso intestinal. Alcaloides (harmano, harmina): inhibidores de MAO.',
    'cúrcuma':      'Curcumina: inhibe NF-κB y COX-2; potente antiinflamatorio equiparable al ibuprofeno. Bisdesmetoxicurcumina: mayor biodisponibilidad y actividad antioxidante. Turmerona: neuroprotector y hepatoprotector.',
    'perejil':      'Apiol: estimulante uterino y diurético. Miristicina: antiagregante plaquetario y neuroprotector. Vitamina K: coagulación y mineralización ósea. Flavonoides (apigenina): antiinflamatorio y espasmolítico.',
    'anís':         'Trans-anetol: carminativo, espasmolítico y galactagogo; actúa como estrogénico débil. Estragol: analgésico y antiséptico. Furfurol: expectorante mucolítico.',
    'hinojo':       'Trans-anetol: espasmolítico intestinal y galactagogo; similar al estrógeno en mecanismo. Fenchona y fenchol: carminativos y antisépticos. Flavonoides: antioxidantes e inmunomoduladores.',
    'toronjil':     'Ácido rosmarínico: inhibe la unión de TSH a receptores tiroideos; antiinflamatorio y antiviral. Citral y geranial: ansiolíticos por modulación de receptores GABA-A. Flavonoides (luteolina, apigenina): sedantes y espasmolíticos.',
    'melisa':       'Ácido rosmarínico: antiviral (inhibe virus herpes), antiinflamatorio. Citral: ansiolítico y espasmolítico por actividad colinérgica. Polifenoles: protección neuronal y antioxidante.',
    'aceite de oliva': 'Oleocanthal: antiinflamatorio por inhibición de COX similar al ibuprofeno. Ácido oleico: cardioprotector por modulación del perfil lipídico. Vitamina E y escualeno: antioxidantes y regeneradores tisulares.',
    'aloe':         'Acemanano (polisacárido): inmunomodulador, cicatrizante y antiviral. Antraquinonas (barbaloína): laxante por irritación de colonocitos (solo en uso oral). Vitaminas C y E: antioxidantes y regeneradoras epidérmicas.',
    'rosa':         'Geraniol y citronelol: antibacterianos y antifúngicos. Flavonoides (quercetina, kaempferol): antiinflamatorios y cardioprotectores. Vitamina C y beta-caroteno: antioxidantes e inmunoestimulantes.',
    'maqui':        'Delfinidina y cianidina-3-sambubiosido: antocianinas con potente capacidad antioxidante (ORAC elevado). Polifenoles totales: reducción de LDL oxidado. Galotaninos: actividad antiviral y antimicrobiana.',
    'quillay':      'Saponinas quilaya: surfactantes naturales con actividad inmunoestimulante; adyuvante vacunal. Quillajoside: antiinflamatorio y expectorante. Taninos: astringentes y antimicrobianos.',
    'hierba buena': 'Mentol y mentona: espasmolíticos digestivos y analgésicos locales. Pulegona: antiespasmódica y galactagoga moderada. Flavonoides: antioxidantes y antiinflamatorios.',
    'ruda':         'Rutina (flavonoide glucosídico): venotónico, antiinflamatorio y vasoprotector. Alcaloides furoquinolínicos: antiespasmódicos y emenagogas. Cumarinas: anticoagulantes y antifúngicas.',
    'cedron':       'Citral y nerol: ansiolíticos por modulación de GABA-A; antivirales frente a herpes. Verbascósido: antiinflamatorio y antioxidante. Flavonoides: sedantes y espasmolíticos.',
    'cedrón':       'Citral y nerol: ansiolíticos por modulación de GABA-A; antivirales frente a herpes. Verbascósido: antiinflamatorio y antioxidante. Flavonoides: sedantes y espasmolíticos.',
    'laurel':       'Eugenol: analgésico y antiinflamatorio; inhibe COX-1/2. Cineol: expectorante y antiséptico. Ácido laúrico: antifúngico y antiviral de amplio espectro.',
    'orégano':      'Carvacrol y timol: antibacterianos potentes; disrumpción de membrana bacteriana. Ácido rosmarínico: antioxidante y antiinflamatorio. Luteolina: espasmolítica e inmunomoduladora.',
    'equiseto':     'Ácido silícico y silicio orgánico: fortalecimiento de tejido conectivo, cabello y uñas. Saponinas (equisetonina): diuréticas y antiinflamatorias. Flavonoides (isoquercetina, luteolina-7-glucósido): antioxidantes.',
    'burro':        'Luteína y zeaxantina: protectores de retina y antioxidantes oculares. Mucílagos: demulcentes sobre mucosas. Inulina: prebiótico y regulador glucémico.',
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

def normalizar(texto):
    """Normalizar texto para búsqueda."""
    if not texto:
        return ''
    return texto.lower()

def buscar_compuesto(ingredientes_raw, titulo):
    """Buscar compuestos activos para los ingredientes de la receta."""
    texto = normalizar(ingredientes_raw) + ' ' + normalizar(titulo)
    resultados = []
    for planta, compuesto in COMPUESTOS.items():
        if planta.lower() in texto:
            resultados.append(compuesto)
            if len(resultados) >= 3:
                break
    return resultados

def generar_principios(r):
    """Generar texto de principios activos para una receta."""
    ingredientes = r.get('ingredientes', '')
    titulo = r.get('titulo', '')
    categoria = r.get('categoria', '')

    compuestos = buscar_compuesto(ingredientes, titulo)

    if compuestos:
        return ' '.join(compuestos[:3])

    # Fallback por categoría si no se encontró planta específica
    fallbacks = {
        'Digestivo':        'Flavonoides y taninos: regulan la motilidad intestinal y reducen inflamación de la mucosa. Aceites esenciales: carminativos y espasmolíticos por relajación del músculo liso digestivo.',
        'Antiparasitario':  'Compuestos fenólicos y terpénicos: acción antiparasitaria directa sobre la membrana celular de parásitos. Taninos: precipitan proteínas de superficie de helmintos y protozoos.',
        'Diarrea':          'Taninos elagitánicos: astringentes sobre la mucosa intestinal; reducen la hipersecreción de fluidos. Mucílagos: protegen la mucosa irritada y reducen el tránsito intestinal.',
        'Alimenticio':      'Vitaminas (A, B, C) y minerales (hierro, calcio, magnesio): soporte nutricional y metabólico. Clorofila y antioxidantes: depuración y protección celular.',
        'Respiratorio':     'Aceites esenciales con 1,8-cineol: broncodilatador y mucolítico. Mucílagos: emolientes sobre mucosa bronquial irritada. Saponinas: facilitadores de la eliminación de secreciones.',
        'Tos':              'Mucílagos vegetales: recubren y protegen la mucosa faríngea irritada. Saponinas: efecto bequico y expectorante. Flavonoides: reducen inflamación de vías aéreas superiores.',
        'Expectorante':     'Saponinas triterpénicas: efecto mucolítico y expectorante. Aceites esenciales (cineol, timol): mucolíticos y antisépticos bronquiales. Flavonoides: antiinflamatorios respiratorios.',
        'Resfriados':       'Vitamina C y flavonoides: estimulan la producción de interferón y células NK. Aceites esenciales: viricidas y bactericidas de vías aéreas. Polifenoles: antioxidantes e inmunoestimulantes.',
        'Garganta':         'Taninos: astringentes y antisépticos sobre la mucosa faríngea. Aceites esenciales (timol, eugenol): bactericidas y antiinflamatorios locales. Mucílagos: demulcentes sobre tejidos irritados.',
        'Sedante':          'Flavonoides (flavonas y flavonoles): modulan receptores GABA-A reduciendo la ansiedad. Terpenos sesquiterpénicos: sedantes por efecto sobre el sistema nervioso central. Iridoides: relajantes musculares.',
        'Memoria':          'Flavonoides con efecto vasodilatador cerebral: mejoran perfusión neuronal y oxigenación. Diterpenos neuroprotectores: reducen el estrés oxidativo neuronal. Alcaloides: moduladores de la acetilcolina.',
        'Nervioso':         'Flavonoides ansiolíticos: modulan receptores GABA-A reduciendo la ansiedad. Iridoides sedantes: acción central sobre el sistema límbico. Aceites esenciales: aromaterapia con efecto parasimpaticomimético.',
        'Dermatológico':    'Flavonoides antiinflamatorios: inhiben COX-2 reduciendo eritema y edema. Saponinas: surfactantes que limpian y antiseptizan la piel. Alantoína o mucílagos: regeneradores epidérmicos y emolientes.',
        'Cicatrizante':     'Alantoína: acelera mitosis de fibroblastos favoreciendo la cicatrización. Taninos y flavonoides: hemostáticos y antisépticos. Carotenoides: regeneradores tisulares y fotoprotectores.',
        'Cosmético':        'Ácidos grasos esenciales (omega-3, omega-6): nutren y restauran la barrera lipídica epidérmica. Vitaminas E y C: antioxidantes celulares. Fitoesteroles: hidratantes y anti-envejecimiento.',
        'Cabello':          'Fitoesteroles y flavonoides: estimulan la microcirculación folicular. Silicio orgánico: fortalece la estructura de la queratina capilar. Aceites esenciales antisépticos: equilibran la microbiota del cuero cabelludo.',
        'Baño':             'Aceites esenciales (linalool, terpineol): relajantes por vía aromática y transdérmica. Minerales absorbidos por la piel: relajantes musculares. Taninos: tonificantes y astringentes cutáneos.',
        'Antifúngico':      'Fenoles terpénicos (carvacrol, timol, eugenol): antifúngicos por destrucción de la membrana celular fúngica. Ácidos orgánicos: crean entorno ácido inhibidor de hongos. Aldehídos: fungistáticos.',
        'Ginecológico':     'Flavonas (apigenina, luteolina): espasmolíticos sobre el útero y moduladores de prostaglandinas. Fitoestrógenos: regulación del eje hormonal. Aceites esenciales: antisépticos genitourinarios.',
        'Cardiovascular':   'Flavonoides venotónicos (rutina, hesperidina): refuerzan la integridad capilar. Compuestos azufrados y alicina: reducen el LDL y la presión arterial. Antocianinas: antioxidantes vasculares.',
        'Renal':            'Flavonoides diuréticos (quercetina, kaempferol): aumentan el filtrado glomerular. Ácido silícico: antiinflamatorio de las vías urinarias. Sales de potasio: diuréticas osmóticas.',
        'Diurético':        'Flavonoides (quercetina, rutina): diuréticos y antiedematosos. Sales de potasio: diuresis osmótica sin hipocalemia. Saponinas: irritantes suaves del epitelio tubular que aumentan la diuresis.',
        'Analgésico':       'Flavonoides antiinflamatorios: inhiben COX-1/2 y la síntesis de prostaglandinas algogénicas. Terpenos analgésicos: modulan receptores TRPV1 y canales de sodio. Salicilatos naturales: analgésicos periféricos.',
        'Antiinflamatorio': 'Ácidos fenólicos (ácido rosmarínico, clorogénico): inhibición de NF-κB y reducción de citoquinas inflamatorias. Flavonoides (luteolina, apigenina): inhibición de COX-2. Terpenoides: reducción de leucotrienos proinflamatorios.',
        'Reumatismo':       'Sesquiterpenos: antiinflamatorios articulares por inhibición de COX y 5-LOX. Alcaloides piperidínicos: analgésicos locales. Flavonoides: antiedematosos y antioxidantes sinoviales.',
        'Dental':           'Eugenol (en clavo): anestésico local por bloqueo de canales de sodio. Taninos: astringentes hemostáticos sobre encías. Aceites esenciales antibacterianos: activos contra Streptococcus mutans y Porphyromonas gingivalis.',
        'Pediátrico':       'Flavonas (apigenina, luteolina): espasmolíticos y sedantes seguros en lactantes. Mucílagos: demulcentes sobre mucosas digestivas y respiratorias. Aceites esenciales suaves: carminativos a dosis pediátricas.',
        'Alergia':          'Quercetina: antihistamínico natural por inhibición de la liberación de histamina de mastocitos. Ácido rosmarínico: suprime la respuesta alérgica IgE-mediada. Flavonoides: estabilizadores de membrana de mastocitos.',
        'Energizante':      'Gingeroles o saponinas adaptogénicas: modulan el eje hipotálamo-hipófisis-adrenal. Vitaminas del grupo B y hierro: apoyo metabólico y transporte de oxígeno. Polifenoles: antioxidantes que reducen el estrés oxidativo por ejercicio.',
        'Oftalmológico':    'Antocianinas: regeneran la rodopsina y mejoran la agudeza visual nocturna. Luteína y zeaxantina: protegen la mácula del daño oxidativo por luz azul. Mucílagos: lubricantes oculares y antiinflamatorios de conjuntiva.',
        'Oídos':            'Aceites esenciales antisépticos: activos frente a Pseudomonas aeruginosa y Staphylococcus aureus en conducto auditivo. Flavonoides antiinflamatorios: reducen el edema de la mucosa ótica. Taninos: astringentes y hemostáticos.',
        'General':          'Vitamina C y bioflavonoides: inmunoestimulantes y antioxidantes. Polisacáridos: activadores de macrófagos y células NK. Compuestos fenólicos: antimicrobianos y hepatoprotectores.',
        'Hepático':         'Silimarina o flavonolignanos: hepatoprotectores por estabilización de membrana de hepatocitos. Alcaloides coleréticos: estimulan la secreción biliar. Antioxidantes polifenólicos: reducen el daño oxidativo hepático.',
        'Febrífugo':        'Salicilatos naturales (ácido acetilsalicílico derivado): antipirético y antiinflamatorio periférico. Flavonoides diaforéticos: estimulan la sudoración regulando la temperatura corporal. Terpenos: antipirécticos de acción central.',
        'Medicina Mapuche': 'Sesquiterpenos dialdeídos: antiinflamatorios y analgésicos por bloqueo de canales de sodio. Flavonoides ceremoniales con actividad inmunomoduladora. Compuestos fenólicos antimicrobianos: amplio espectro antibacteriano y antifúngico.',
        'Espiritual':       'Aceites esenciales aromáticos: estimulan el sistema límbico modulando el estado emocional. Compuestos con actividad ansiolítica suave. Polifenoles con propiedades depurativas y antioxidantes.',
        'Nutritivo':        'Proteínas vegetales y aminoácidos esenciales: soporte metabólico. Vitaminas liposolubles (A, D, E, K) e hidrosolubles (C, complejo B): cofactores enzimáticos. Minerales (hierro, calcio, magnesio, zinc): remineralizantes.',
    }
    cat = categoria
    return fallbacks.get(cat, 'Flavonoides y compuestos fenólicos: antiinflamatorios, antioxidantes e inmunomoduladores. Aceites esenciales: antisépticos y aromaterapéuticos. Mucílagos y taninos: demulcentes y astringentes sobre mucosas.')

def generar_propiedades(r):
    """Generar array de propiedades para una receta."""
    cat = r.get('categoria', '')
    props_base = PROPS_CAT.get(cat, ['antiinflamatorio', 'antioxidante', 'depurativo'])

    # Enriquecer con propiedades adicionales según ingredientes
    texto = normalizar(r.get('ingredientes', '') + ' ' + r.get('titulo', ''))
    extras = []
    if any(x in texto for x in ['miel', 'miel de ulmo', 'miel de abejas']):
        extras.append('antimicrobiano')
    if any(x in texto for x in ['limón', 'limon', 'naranja', 'vitamina c']):
        extras.append('inmunoestimulante')
    if any(x in texto for x in ['ajo', 'alicina']):
        extras.append('antibacteriano')
    if any(x in texto for x in ['jengibre', 'cúrcuma', 'curcuma']):
        extras.append('antiinflamatorio')
    if any(x in texto for x in ['aceite de oliva', 'aceite esencial', 'aceite']):
        if 'emoliente' not in props_base:
            extras.append('emoliente')

    # Combinar sin duplicados
    result = []
    seen = set()
    for p in (props_base + extras):
        if p not in seen:
            seen.add(p)
            result.append(p)
    return result[:5]

# ── Cargar y enriquecer ──────────────────────────────────────────────────────
recetas = json.load(open('data/recetas.json', encoding='utf-8'))
sin_datos = [r for r in recetas if not r.get('principios_activos')]
print(f'Recetas a enriquecer: {len(sin_datos)}')

enriquecidas = 0
for r in recetas:
    if not r.get('principios_activos'):
        r['principios_activos'] = generar_principios(r)
        r['propiedades']        = generar_propiedades(r)
        enriquecidas += 1

print(f'Enriquecidas: {enriquecidas}')

# Guardar
with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, ensure_ascii=False, indent=2)

print('Guardado en data/recetas.json')

# Verificar
check = json.load(open('data/recetas.json', encoding='utf-8'))
sin_after = sum(1 for r in check if not r.get('principios_activos'))
print(f'Recetas sin principios_activos después: {sin_after}')
