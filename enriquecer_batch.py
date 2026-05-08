#!/usr/bin/env python3
"""
enriquecer_batch.py — Enriquecimiento enciclopédico de recetas con datos fitoterapéuticos reales.
Fuentes: Hoffmann 1992, Montes & Wilkomirsky 1985, Muñoz et al. 1999,
         WHO Monographs Vol.1-4, MINSAL 2010, Aukanaw 2002, Villagrán & Castro 2003.
Ejecutar: python enriquecer_batch.py
"""
import json, re, os, sys

BASE = os.path.dirname(__file__)
RECETAS_PATH = os.path.join(BASE, 'data', 'recetas.json')

# ══════════════════════════════════════════════════════════════════════
# BASE FITOTERAPÉUTICA — datos verificados por planta
# uso_terapeutico: propósito clínico específico con mecanismo
# pa: principios activos + mecanismo farmacológico
# prop: propiedades terapéuticas (chips)
# ref: referencias bibliográficas
# ══════════════════════════════════════════════════════════════════════
FITO = {
    'alcachofa': {
        'uso_terapeutico': 'Insuficiencia hepática leve y dispepsia biliar: estimula la producción y secreción de bilis facilitando la digestión de grasas y la depuración hepática.',
        'pa': 'Cinarina (ácido 1,3-dicafeoilquínico): inhibe la síntesis de colesterol hepático y estimula la secreción biliar. Flavonoides (luteolina): hepatoprotectores que inhiben la peroxidación lipídica de los hepatocitos.',
        'prop': ['colerético', 'colagogo', 'hepatoprotector', 'depurativo', 'hipocolesterolemiante'],
        'ref': 'Kraft K. Phytomedicine 1997; WHO Monographs Vol.1 (1999); Muñoz O. et al. 1999; MINSAL 2010'
    },
    'boldo': {
        'uso_terapeutico': 'Afecciones hepáticas y biliares (colelitiasis, dispepsia biliar): estimula el flujo de bilis y protege el hepatocito del daño oxidativo.',
        'pa': 'Boldina (alcaloide isoquinoléinico): antioxidante lipídico que inhibe la peroxidación de membranas hepatocitarias y ejerce efecto colerético directo. Aceite esencial (ascaridol, eucaliptol): complementa la acción digestiva.',
        'prop': ['colerético', 'colagogo', 'hepatoprotector', 'digestivo', 'diurético', 'antioxidante'],
        'ref': 'Speisky H. & Cassels BK. Pharmacol Res 1994; 29(1):1-12; Montes & Wilkomirsky 1985; Muñoz et al. 1999; MINSAL 2010'
    },
    'canelo': {
        'uso_terapeutico': 'Dolor neuropático, odontalgias y estados inflamatorios: el poligodial inhibe los canales Nav1.7/Nav1.8 bloqueando la transmisión del impulso doloroso.',
        'pa': 'Poligodial (sesquiterpeno dialdeído): bloquea canales de sodio voltaje-dependientes Nav1.7/Nav1.8 con efecto antinociceptivo; modula receptores TRPA1. Flavonoides (quercetina, taxifolina): inhiben COX-2 reduciendo prostaglandinas inflamatorias.',
        'prop': ['analgésico', 'antiinflamatorio', 'antiséptico', 'antifúngico', 'febrífugo'],
        'ref': 'Burgos RA. et al. J Ethnopharmacol 1999; 67(2):161-9; Aukanaw 2002; Villagrán & Castro 2003; Hoffmann 1992; MINSAL 2010'
    },
    'foye': {
        'uso_terapeutico': 'Dolor, inflamación y fiebre en medicina mapuche (canelo sagrado): el poligodial bloquea la transmisión dolorosa y reduce mediadores inflamatorios.',
        'pa': 'Poligodial (sesquiterpeno dialdeído, Drimys winteri): inhibe canales Nav1.7/Nav1.8 y modula receptores TRPA1 con efecto antinociceptivo potente. Vitamina C y taninos: actividad antioxidante y antiséptica complementaria.',
        'prop': ['analgésico', 'antiinflamatorio', 'antiséptico', 'febrífugo', 'ceremonial mapuche'],
        'ref': 'Burgos RA. et al. J Ethnopharmacol 1999; González-Coloma A. et al. Phytochem Rev 2022; Aukanaw 2002; Villagrán & Castro 2003; Hoffmann 1992'
    },
    'manzanilla': {
        'uso_terapeutico': 'Gastritis, cólicos, síndrome de intestino irritable e inflamación de mucosas: relaja el músculo liso intestinal e inhibe mediadores proinflamatorios.',
        'pa': 'Alfa-bisabolol: espasmolítico sobre músculo liso, reduce la secreción de pepsina sin alterar el pH gástrico. Apigenina (flavonoide): inhibe COX-2 y reduce prostaglandinas proinflamatorias. Camazuleno (aceite esencial): antiinflamatorio por inhibición de leucotrienos.',
        'prop': ['antiinflamatorio', 'antiespasmódico', 'carminativo', 'sedante leve', 'cicatrizante'],
        'ref': 'Srivastava JK. et al. Mol Med Rep 2010; PMC2995283; WHO Monographs Vol.1 (1999); Muñoz et al. 1999; MINSAL 2010'
    },
    'matico': {
        'uso_terapeutico': 'Cicatrización de heridas, úlceras gástricas e inflamación dérmica: estimula la proliferación de fibroblastos, favorece la síntesis de colágeno y ejerce acción antibacteriana local.',
        'pa': 'Verbascósido (feniletanoide): bactericida por alteración de la membrana celular bacteriana. Flavonoides (faradiol y derivados): inhiben la fase inflamatoria y estimulan la proliferación de fibroblastos y la reorganización de colágeno durante la cicatrización.',
        'prop': ['cicatrizante', 'hemostático', 'antiséptico', 'antiinflamatorio', 'astringente'],
        'ref': 'Schmeda-Hirschmann G. et al. Bol Latinoam Caribe 2009; Monografía ISP-MINSAL; Muñoz et al. 1999; Hoffmann 1992'
    },
    'llantén': {
        'uso_terapeutico': 'Catarros, tos y bronquitis leve; heridas y úlceras dérmicas: los mucílagos protegen la mucosa bronquial y la aucubina reduce la inflamación local.',
        'pa': 'Aucubósido (iridoide glucosídico): inhibe la expresión de genes proinflamatorios vía NF-κB y tiene efecto antiespasmódico bronquial. Mucílagos (10-12%): forman capa protectora sobre mucosas. Taninos: astringentes con acción hemostática en heridas.',
        'prop': ['expectorante', 'emoliente', 'antiinflamatorio', 'cicatrizante', 'astringente'],
        'ref': 'Samuelsen AB. J Ethnopharmacol 2000; 71(1-2):1-21; WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010'
    },
    'tilo': {
        'uso_terapeutico': 'Ansiedad leve, nerviosismo e insomnio: los flavonoides modulan receptores GABAérgicos y serotoninérgicos reduciendo la excitabilidad neuronal.',
        'pa': 'Flavonoides (quercetina, isoquercitrina, tilirósido): modulan receptores GABA/benzodiazepínicos aumentando la inhibición neuronal y receptores 5-HT1A reduciendo la ansiedad. Aceite esencial (farnesol): sedante complementario.',
        'prop': ['sedante', 'ansiolítico', 'diaforético', 'antiespasmódico', 'expectorante'],
        'ref': 'Aguirre-Hernández E. et al. Salud Mental 2016; 39(1):37-46; WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010'
    },
    'romero': {
        'uso_terapeutico': 'Fatiga mental, hipotensión y dolor muscular tópico: mejora la circulación periférica y cerebral y protege las membranas celulares del estrés oxidativo.',
        'pa': 'Ácido carnósico y carnosol (diterpenos fenólicos): responsables del 90% de la actividad antioxidante, neutralizan radicales peroxilo y superóxido. Ácido rosmarínico: antiinflamatorio por inhibición de NF-κB. 1,8-cineol y alcanfor: vasodilatadores locales con efecto rubefaciente.',
        'prop': ['antioxidante', 'estimulante circulatorio', 'antiinflamatorio', 'antiséptico', 'carminativo'],
        'ref': 'Masuda T. et al. Plant Physiol 2012; PMC5664485; WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010'
    },
    'lavanda': {
        'uso_terapeutico': 'Ansiedad, estrés y trastornos del sueño: el linalol modula canales de calcio y receptores GABA/serotonina reduciendo la excitabilidad del sistema nervioso.',
        'pa': 'Linalol (28-47% del aceite esencial): bloquea transportadores de serotonina (SERT) y canales de calcio VOCC reduciendo la liberación de neurotransmisores excitadores. Acetato de linalilo (38%): modulador de receptores NMDA con efecto ansiolítico adicional.',
        'prop': ['ansiolítico', 'sedante', 'antiespasmódico', 'antiséptico', 'cicatrizante'],
        'ref': 'Woelk H. & Schläfke S. Phytomedicine 2010; 17(2):94-99; Harada H. et al. Front Behav Neurosci 2018; PMC5437114; EMA/HMPC 2012; Muñoz et al. 1999'
    },
    'melisa': {
        'uso_terapeutico': 'Ansiedad, insomnio y herpes labial recurrente: el ácido rosmarínico inhibe la degradación del GABA cerebral y bloquea la replicación del virus herpes simple (HSV-1 y HSV-2).',
        'pa': 'Ácido rosmarínico: inhibe GABA transaminasa (aumenta niveles de GABA, efecto sedante-ansiolítico) y bloquea la adhesión viral del HSV a células huésped. Citral, geraniol y citronelal (aceite esencial): antiviral directo y sedante por modulación del sistema nervioso vegetativo.',
        'prop': ['sedante', 'ansiolítico', 'antiviral', 'carminativo', 'antiespasmódico'],
        'ref': 'Awad R. et al. Phytochemistry 2003; 63(2):199-207; WHO Monographs Vol.2 (2002); EMA/HMPC 2013; MINSAL 2010; Muñoz et al. 1999'
    },
    'toronjil': {
        'uso_terapeutico': 'Nerviosismo, ansiedad e insomnio leve: el ácido rosmarínico inhibe la MAO y la degradación del GABA, elevando los niveles de neurotransmisores calmantes.',
        'pa': 'Ácido rosmarínico: inhibidor de MAO-A y de GABA transaminasa (efecto antidepresivo y ansiolítico comprobado clínicamente). Citral y citronelal (aceite esencial): sedantes por modulación del sistema nervioso vegetativo.',
        'prop': ['sedante', 'ansiolítico', 'antidepresivo leve', 'carminativo', 'antiespasmódico'],
        'ref': 'WHO Monographs Vol.2 (2002); EMA/HMPC 2013; Muñoz et al. 1999; MINSAL 2010; Montes & Wilkomirsky 1985'
    },
    'valeriana': {
        'uso_terapeutico': 'Insomnio leve, ansiedad y nerviosismo: el ácido valerénico inhibe la degradación del GABA cerebral y potencia la inhibición neuronal, con efecto sedante sin dependencia significativa.',
        'pa': 'Ácido valerénico (sesquiterpeno): inhibe GABA transaminasa y actúa como modulador alostérico positivo de receptores GABAA. Valepotriatos (iridoides): sedación adicional. Flavonoides (linarina, hesperidina): modulación serotoninérgica 5-HT5a complementaria.',
        'prop': ['sedante', 'ansiolítico', 'hipnótico leve', 'antiespasmódico', 'relajante muscular'],
        'ref': 'Bent S. et al. Am J Med 2006; 119(12):1005-12; WHO Monographs Vol.1 (1999); EMA/HMPC 2013; Muñoz et al. 1999; MINSAL 2010'
    },
    'menta': {
        'uso_terapeutico': 'Síndrome de intestino irritable, dispepsia y cefalea tensional: el mentol relaja el músculo liso intestinal antagonizando canales de calcio y activa receptores TRPM8 con efecto analgésico tópico.',
        'pa': 'Mentol (35-55% del aceite esencial): antagonista dosis-dependiente de canales de calcio tipo L en músculo liso intestinal (antiespasmódico); agonista de receptores TRPM8 de "frío" produciendo analgesia contrarritante. Mentona y acetato de mentilo: acción colerética.',
        'prop': ['antiespasmódico', 'digestivo', 'carminativo', 'analgésico local', 'expectorante'],
        'ref': 'Grigoleit HG. & Grigoleit P. Phytomedicine 2005; 12(8):601-606; Taylor BA. et al. Br J Clin Pharmacol 1985; WHO Monographs Vol.2 (2002); MINSAL 2010'
    },
    'hierba buena': {
        'uso_terapeutico': 'Dispepsia leve, flatulencia y náuseas: la carvona relaja la musculatura digestiva aliviando espasmos y facilitando la expulsión de gases; perfil más suave que la menta, apto para niños.',
        'pa': 'L-Carvona (29-65% del aceite esencial): antiespasmódico sobre músculo liso intestinal con modulación de la motilidad gastrointestinal y efecto carminativo. Limoneno (6%): colerético leve. 1,8-cineol: antiséptico de mucosas digestivas.',
        'prop': ['carminativo', 'digestivo', 'antiespasmódico', 'antiséptico', 'suave (pediátrico)'],
        'ref': 'WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010; Montes & Wilkomirsky 1985'
    },
    'llantén': {
        'uso_terapeutico': 'Catarros, tos y bronquitis leve; heridas dérmicas y úlceras: los mucílagos protegen la mucosa bronquial facilitando la expectoración y la aucubina reduce la inflamación local.',
        'pa': 'Aucubósido (iridoide glucosídico): inhibe expresión génica proinflamatoria vía NF-κB. Mucílagos (10-12%): forman capa protectora sobre mucosas respiratorias y digestivas. Taninos: astringentes con acción hemostática en heridas.',
        'prop': ['expectorante', 'emoliente', 'antiinflamatorio', 'cicatrizante', 'astringente'],
        'ref': 'Samuelsen AB. J Ethnopharmacol 2000; 71:1-21; WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010'
    },
    'paico': {
        'uso_terapeutico': 'Parasitosis intestinal (áscaris, anquilostomas, oxiuros): el ascaridol paraliza los helmintos interfiriendo en su cadena respiratoria mitocondrial, facilitando su expulsión.',
        'pa': 'Ascaridol (endoperóxido monoterpénico, 60-80% del aceite esencial): actúa como oxidante tóxico para parásitos, disruptando su cadena respiratoria mitocondrial. Terpineno-4-ol y p-cimeno: actividad antiparasitaria complementaria. PRECAUCIÓN: margen terapéutico estrecho.',
        'prop': ['antiparasitario', 'vermífugo', 'digestivo', 'carminativo'],
        'ref': 'Muñoz et al. 1999; Montes & Wilkomirsky 1985; Cáceres A. et al. J Ethnopharmacol 1992; 38(1):31-8; MINSAL 2010'
    },
    'ruda': {
        'uso_terapeutico': 'Amenorrea y dismenorrea: los alcaloides inducen vasocongestion pélvica y contracciones del músculo liso uterino facilitando el desprendimiento endometrial. Uso bajo supervisión.',
        'pa': 'Metilnonilcetona y metilheptilcetona (cetonas del aceite esencial): estimulan la motilidad uterina por acción directa sobre músculo liso. Rutósido (flavonoide): refuerza la pared capilar endometrial. Furanocumarinas: potencian la acción espasmódica. ADVERTENCIA: abortiva en dosis altas.',
        'prop': ['emenagogo', 'antiespasmódico', 'vasoprotector', 'antiinflamatorio'],
        'ref': 'Monografía ISP-MINSAL: Ruta graveolens; Muñoz et al. 1999; Montes & Wilkomirsky 1985; WHO Monographs Vol.1 (1999)'
    },
    'cola de caballo': {
        'uso_terapeutico': 'Edema leve, infecciones urinarias recurrentes y fragilidad de tejidos conectivos: el silicio orgánico estimula la síntesis de colágeno y los flavonoides ejercen acción diurética sobre el túbulo renal.',
        'pa': 'Silicio orgánico (5-8% de ácido silícico): cofactor de la síntesis de colágeno e hidroxiapatita ósea, estimulando la remineralización. Flavonoides (isoquercitrina): diuréticos por modulación del transporte tubular renal. Sales de potasio: evitan desequilibrio electrolítico.',
        'prop': ['diurético', 'remineralizante', 'hemostático', 'astringente', 'cicatrizante'],
        'ref': 'EMA/HMPC Assessment Report: Equisetum arvense 2016; WHO Monographs Vol.4 (2009); Muñoz et al. 1999; MINSAL 2010'
    },
    'diente de leon': {
        'uso_terapeutico': 'Afecciones hepáticas leves, colecistopatías y retención de líquidos: la taraxacina estimula enzimas antioxidantes hepáticas y los flavonoides ejercen acción diurética.',
        'pa': 'Taraxacina y taraxacerín (eudesmanólidos amargos): estimulan la secreción biliar y aumentan la actividad de catalasa y glutatión peroxidasa hepáticas. Inulina (hasta 40% en otoño): prebiótico. Flavonoides y sales de potasio: efecto diurético sin pérdida de electrolitos.',
        'prop': ['diurético', 'colerético', 'hepatoprotector', 'tónico digestivo', 'prebiótico'],
        'ref': 'Covarrubias-Pinto A. et al. Rev Mex Cienc Farm 2013; 44(4); WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010'
    },
    'eucalipto': {
        'uso_terapeutico': 'Bronquitis, sinusitis y tos productiva: el 1,8-cineol fluidifica el moco, estimula el movimiento ciliar bronquial y ejerce acción antiséptica sobre patógenos respiratorios.',
        'pa': '1,8-Cineol/Eucaliptol (44-84% del aceite esencial): incrementa la frecuencia de batido ciliar facilitando la expectoración; disrumpe la membrana lipídica bacteriana con acción virucida; inhibe TNF-α e IL-6 reduciendo la inflamación bronquial. Activo frente a MRSA y M. tuberculosis.',
        'prop': ['expectorante', 'mucolítico', 'antiséptico respiratorio', 'febrífugo', 'broncodilatador'],
        'ref': 'Worth H. et al. Respir Med 2009; 103(3):366-371; EMA/HMPC 2012; Salari MH. et al. Clin Microbiol Infect 2006; Muñoz et al. 1999; MINSAL 2010'
    },
    'rosa mosqueta': {
        'uso_terapeutico': 'Regeneración cutánea, cicatrización de quemaduras e hiperpigmentación: el aceite del fruto estimula fibroblastos, favorece la síntesis de colágeno y aporta intensa protección antioxidante.',
        'pa': 'Ácido ascórbico (300-500 mg/100g): cofactor de la hidroxilación del colágeno e inmunomodulador. Ácidos grasos esenciales (ω-6 linoléico, ω-3 α-linolénico): mantienen la barrera lipídica cutánea. Ácido trans-retinoico (precursor vitamina A): estimula la renovación celular epidérmica. Carotenoides (licopeno, β-caroteno): antioxidantes potentes.',
        'prop': ['cicatrizante', 'regenerador cutáneo', 'antioxidante', 'inmunoestimulante', 'antiinflamatorio'],
        'ref': 'Concha J. et al. Ciencia e Investigación Agraria 1997; 24(2):101-107; Muñoz et al. 1999; Hoffmann 1992; MINSAL 2010'
    },
    'calendula': {
        'uso_terapeutico': 'Inflamación de piel y mucosas, heridas y quemaduras leves: el faradiol inhibe COX-2 reduciendo la inflamación y los flavonoides estimulan la síntesis de colágeno acelerando la epitelización.',
        'pa': 'Faradiol (triterpeno diol): inhibe COX-2 y reduce citoquinas proinflamatorias (principal agente antiinflamatorio). Flavonoides (narcisina, rutósido): estimulan síntesis de colágeno en fibroblastos cutáneos. Saponinas triterpénicas (2-10%): acción antibacteriana y antifúngica local.',
        'prop': ['antiinflamatorio', 'cicatrizante', 'antiséptico', 'emoliente', 'antifúngico'],
        'ref': 'Zitterl-Eglseer K. et al. J Ethnopharmacol 1997; 57(2):139-44; WHO Monographs Vol.2 (2002); EMA/HMPC 2008; Muñoz et al. 1999; MINSAL 2010'
    },
    'aloe': {
        'uso_terapeutico': 'Cicatrización de quemaduras, heridas y psoriasis: el acemanano estimula fibroblastos y la síntesis de colágeno; los compuestos antiinflamatorios reducen el eritema y el edema.',
        'pa': 'Acemanano (polisacárido acetilado de manosa): estimula proliferación de fibroblastos y síntesis de ácido hialurónico e hidroxiprolina; inhibe prostaglandinas y leucotrienos proinflamatorios; reduce la liberación de histamina. Aloína: laxante estimulante para uso interno (mecanismo diferente).',
        'prop': ['cicatrizante', 'antiinflamatorio', 'emoliente', 'inmunomodulador', 'hidratante'],
        'ref': 'Vogler BK. & Ernst E. Br J Gen Pract 1999; 49(447):823-828; WHO Monographs Vol.1 (1999); Muñoz et al. 1999; MINSAL 2010'
    },
    'jengibre': {
        'uso_terapeutico': 'Náuseas y vómitos (embarazo, quimioterapia, cinetosis) y estados inflamatorios: los gingeroles bloquean receptores 5-HT3 en el tracto digestivo e inhiben mediadores inflamatorios.',
        'pa': '6-Shogaol: inhibe receptor 5-HT3 de serotonina en neuronas gastrointestinales impidiendo la señal emetogénica; inhibe COX-2 e iNOS reduciendo prostaglandinas y óxido nítrico proinflamatorio. 6-Gingerol: inhibe TNF-α, IL-1β e IL-12 en macrófagos vía NF-κB.',
        'prop': ['antiemético', 'antiinflamatorio', 'carminativo', 'estimulante circulatorio', 'analgésico'],
        'ref': 'Ernst E. & Pittler MH. Br J Anaesth 2000; 84(3):367-71; WHO Monographs Vol.1 (1999); Mashhadi NS. et al. Int J Prev Med 2013; Muñoz et al. 1999; MINSAL 2010'
    },
    'ajo': {
        'uso_terapeutico': 'Infecciones bacterianas y fúngicas, hipertensión arterial y dislipemia: la alicina destruye membranas microbianas y la S-alilcisteína inhibe la enzima convertidora de angiotensina (ECA).',
        'pa': 'Alicina (tiosulfinato de dialilo, formada al triturar): altera permeabilidad de membranas bacterianas/fúngicas por oxidación de grupos tiol. Ajoeno: inhibe HMG-CoA reductasa (reduce colesterol). S-alilcisteína: inhibe ECA reduciendo la presión arterial; estimula producción de H2S y NO vasodilatadores.',
        'prop': ['antimicrobiano', 'antifúngico', 'hipotensor', 'hipocolesterolemiante', 'inmunoestimulante'],
        'ref': 'Bayan L. et al. Avicenna J Phytomed 2014; 4(1):1-14; WHO Monographs Vol.1 (1999); Ried K. et al. BMC Cardiovasc Disord 2008; Muñoz et al. 1999; MINSAL 2010'
    },
    'cebolla': {
        'uso_terapeutico': 'Tos, bronquitis leve y reacciones alérgicas: la quercetina estabiliza mastocitos impidiendo la liberación de histamina y los compuestos organosulfurados relajan la musculatura bronquial.',
        'pa': 'Quercetina: estabilizadora de mastocitos y basófilos que reduce la síntesis de leucotrienos y prostaglandinas broncoespasmódicas. Isoalliína y propil tiosulfinato: espasmolíticos sobre músculo liso bronquial y expectorantes por fluidificación del moco. DPPCE: efecto antiasmático demostrado in vitro.',
        'prop': ['expectorante', 'antihistamínico', 'antimicrobiano', 'antioxidante', 'cardiovascular'],
        'ref': 'Shaik YB. et al. J Allergy 2006; WHO Monographs Vol.1 (1999); Muñoz et al. 1999; Montes & Wilkomirsky 1985; MINSAL 2010'
    },
    'oregano': {
        'uso_terapeutico': 'Infecciones bacterianas y fúngicas leves, afecciones gastrointestinales y respiratorias: el carvacrol disrumpe membranas bacterianas causando la muerte de patógenos incluyendo MRSA.',
        'pa': 'Carvacrol (21-98% del aceite esencial): aumenta la permeabilidad de la membrana bacteriana a iones H+ y K+ causando fuga del contenido citoplasmático; inhibe la formación de biofilm. Timol (16%): mecanismo sinérgico. Activos frente a MRSA, E. coli y Candida albicans.',
        'prop': ['antimicrobiano', 'antifúngico', 'antioxidante', 'digestivo', 'antiespasmódico'],
        'ref': 'Burt SA. Int J Food Microbiol 2004; 94(3):223-253; WHO Monographs Vol.2 (2002); Dorman HJD. J Appl Microbiol 2000; Muñoz et al. 1999; MINSAL 2010'
    },
    'clavo': {
        'uso_terapeutico': 'Odontalgia, gingivitis y afecciones bucales: el eugenol bloquea canales de sodio en terminaciones nerviosas pulpares produciendo analgesia local aprobada por la FDA.',
        'pa': 'Eugenol (72-95% del aceite esencial): anestésico local por bloqueo de canales Nav en fibras nerviosas C y Aδ; inhibe prostaglandina H sintetasa bloqueando síntesis de PGE2 (antiinflamatorio); inhibe quimiotaxis de neutrófilos. Aprobado por FDA como anestésico dental OTC.',
        'prop': ['analgésico dental', 'antiséptico', 'antiinflamatorio', 'antifúngico', 'carminativo'],
        'ref': 'Pramod K. et al. Nat Prod Commun 2010; 5(12):1999-2006; Pinto E. et al. J Med Microbiol 2009; Muñoz et al. 1999; MINSAL 2010; Montes & Wilkomirsky 1985'
    },
    'sauce': {
        'uso_terapeutico': 'Dolor leve a moderado (cefalea, reumatismo, lumbalgia) y estados febriles: la salicina se convierte en ácido salicílico que inhibe COX-1 y COX-2 con mejor tolerancia gástrica que la aspirina.',
        'pa': 'Salicina (glucósido fenólico): hidrolizada por bacterias intestinales a saligenina, que se oxida a ácido salicílico; inhibe COX-1 y COX-2 reduciendo prostaglandinas proalgésicas y pirógenas. A diferencia del AAS, no acetila irreversiblemente las COX, con menor efecto antiagregante y mejor tolerancia gástrica.',
        'prop': ['analgésico', 'antiinflamatorio', 'antipirético', 'antirreumático'],
        'ref': 'Schmid B. et al. Phytother Res 2001; 15(4):344-50; WHO Monographs Vol.4 (2009); EMA/HMPC 2009; Muñoz et al. 1999; MINSAL 2010'
    },
    'propóleo': {
        'uso_terapeutico': 'Infecciones bacterianas, víricas y fúngicas leves; inmunomodulación en estados infecciosos recurrentes: los flavonoides alteran la membrana bacteriana y el CAPE activa macrófagos.',
        'pa': 'CAPE (fenetil éster del ácido cafeico): inhibe NF-κB reduciendo citoquinas proinflamatorias y activa la fagocitosis de macrófagos. Artepillin C: antiinflamatorio e inhibidor de PGE2. Flavonoides (galangina, pinocembrina): alteran el potencial de membrana bacteriana inhibiendo síntesis de ATP.',
        'prop': ['antimicrobiano', 'antiviral', 'inmunoestimulante', 'antiinflamatorio', 'cicatrizante'],
        'ref': 'Sforcin JM. J Ethnopharmacol 2011; 133(2):253-260; Marcucci MC. Apidologie 1995; 26(2):83-99; Muñoz et al. 1999; MINSAL 2010'
    },
    'miel': {
        'uso_terapeutico': 'Heridas, úlceras cutáneas e infecciones de mucosas: la acción antimicrobiana multicomponente inhibe el crecimiento de patógenos incluso resistentes y estimula la regeneración tisular.',
        'pa': 'Glucosa oxidasa (aportada por abejas): genera H2O2 continuamente al diluirse en heridas produciendo efecto bactericida sin toxicidad tisular. Defensina-1 (péptido antimicrobiano): activo frente a MRSA y P. aeruginosa. Alta osmolaridad y pH ácido (3,2-4,5): inhiben proliferación de la mayoría de patógenos.',
        'prop': ['antimicrobiano', 'cicatrizante', 'emoliente', 'inmunoestimulante', 'antioxidante'],
        'ref': 'Kwakman PH. et al. FASEB J 2010; 24(7):2576-2582; Molan PC. Bee World 1992; 73(1):5-28; Muñoz et al. 1999; MINSAL 2010'
    },
    'limon': {
        'uso_terapeutico': 'Estados febriles, defensas bajas y lesiones de mucosas: la vitamina C activa la inmunidad innata y los flavonoides ejercen acción antiinflamatoria y antiséptica.',
        'pa': 'Ácido ascórbico (vitamina C): cofactor de la síntesis de colágeno; estimula la función de neutrófilos y linfocitos NK; es antioxidante que protege las membranas celulares. Hesperidina (flavonoide): reduce la permeabilidad capilar y tiene acción antiinflamatoria. Limoneno: antiséptico.',
        'prop': ['inmunoestimulante', 'antiséptico', 'febrífugo', 'antioxidante', 'alcalinizante'],
        'ref': 'Muñoz et al. 1999; MINSAL 2010; Hoffmann 1992; Montes & Wilkomirsky 1985'
    },
    'naranja': {
        'uso_terapeutico': 'Fortalecimiento del sistema inmune, estados carenciales de vitamina C e infecciones leves: la vitamina C y los flavonoides potencian las defensas y reducen la inflamación.',
        'pa': 'Vitamina C: inmunomodulador que estimula la producción de interferones y la función fagocítica. Hesperidina (flavonoide bioflavonoide): reduce permeabilidad capilar y tiene acción antiinflamatoria. Limoneno y ácido cítrico: antisépticos y estimulantes digestivos.',
        'prop': ['inmunoestimulante', 'antioxidante', 'antiinflamatorio', 'nutritivo', 'tónico'],
        'ref': 'Muñoz et al. 1999; MINSAL 2010; Hoffmann 1992'
    },
    'salvia': {
        'uso_terapeutico': 'Hiperhidrosis (sudoración excesiva), gingivitis, estomatitis y afecciones inflamatorias de mucosas: los diterpenos fenólicos inhiben las glándulas sudoríparas y el aceite esencial ejerce potente acción antiséptica oral.',
        'pa': 'Ácido rosmarínico: inhibe COMT reduciendo la actividad simpática de glándulas sudoríparas (efecto antisudorífico). Carnosol y ácido carnósico (diterpenos): antimicrobianos potentes contra patógenos orales incluyendo Streptococcus mutans. Thuiona y alcanfor: antisépticos de contacto.',
        'prop': ['antisudorífico', 'antiséptico oral', 'antiespasmódico', 'astringente', 'estrogénico leve'],
        'ref': 'Ghorbani A. & Esmaeilizadeh M. Asian Pac J Trop Biomed 2017; PMC5634728; WHO Monographs Vol.1 (1999); Muñoz et al. 1999; MINSAL 2010'
    },
    'tomillo': {
        'uso_terapeutico': 'Bronquitis, tos y afecciones respiratorias superiores: el timol y el carvacrol se eliminan por vía pulmonar ejerciendo acción antiséptica directa sobre la mucosa bronquial.',
        'pa': 'Timol (30-70% del aceite esencial): disrumpe la membrana fosfolipídica bacteriana aumentando la permeabilidad a iones K+ y H+; activo frente a MRSA, Pseudomonas aeruginosa y Klebsiella pneumoniae. Carvacrol (3-15%): mecanismo idéntico y sinérgico. Ambos estimulan la ciliocinesis bronquial.',
        'prop': ['expectorante', 'antiséptico bronquial', 'antiespasmódico', 'antimicrobiano', 'carminativo'],
        'ref': 'EMA/HMPC Thymus vulgaris 2013; WHO Monographs Vol.1 (1999); Dorman HJD. J Appl Microbiol 2000; Muñoz et al. 1999; MINSAL 2010'
    },
    'cedron': {
        'uso_terapeutico': 'Dispepsia nerviosa, cólicos digestivos y ansiedad leve: el citral ejerce acción espasmolítica digestiva y el verbascósido tiene efecto ansiolítico sobre el sistema nervioso central.',
        'pa': 'Citral (aldehído monoterpénico principal): espasmolítico sobre músculo liso digestivo y sedante por modulación del sistema nervioso vegetativo. Verbascósido (fenilpropanoide): antioxidante y ansiolítico que inhibe enzimas proinflamatorias. Geraniol: acción carminativa y digestiva complementaria.',
        'prop': ['digestivo', 'carminativo', 'antiespasmódico', 'ansiolítico leve', 'febrífugo'],
        'ref': 'Funes L. et al. Food Chem 2009; 117(3):461-467; Muñoz et al. 1999; MINSAL 2010; Montes & Wilkomirsky 1985'
    },
    'hinojo': {
        'uso_terapeutico': 'Flatulencia, cólicos intestinales del lactante y estimulación de la lactancia: el trans-anetol relaja el músculo liso digestivo y modula receptores dopaminérgicos estimulando la producción de prolactina.',
        'pa': 'Trans-anetol (70-90% del aceite esencial): antiespasmódico sobre músculo liso intestinal por antagonismo de canales de calcio; su similitud estructural con dopamina le confiere efecto galactagogo al modular la secreción de prolactina. Flavonoides (isoquercitrina): antiinflamatorio complementario.',
        'prop': ['carminativo', 'antiespasmódico', 'galactagogo', 'expectorante', 'digestivo'],
        'ref': 'WHO Monographs Vol.3 (2007); EMA/HMPC Foeniculum vulgare 2018; Muñoz et al. 1999; MINSAL 2010'
    },
    'anis': {
        'uso_terapeutico': 'Flatulencia, dispepsia, cólicos intestinales y tos productiva: el trans-anetol relaja el músculo liso digestivo y actúa como expectorante fluidificando las secreciones bronquiales.',
        'pa': 'Trans-anetol (75-90% del aceite esencial): carminativo por relajación del músculo liso intestinal; actúa sobre el epitelio bronquial aumentando la secreción de moco facilitando la expectoración. Flavonoides (isoorientina, glucósidos de apigenina): antiinflamatorios y antiespasmódicos complementarios.',
        'prop': ['carminativo', 'expectorante', 'galactagogo', 'antiespasmódico', 'digestivo'],
        'ref': 'EMA/HMPC Pimpinella anisum 2012; WHO Monographs Vol.1 (1999); Muñoz et al. 1999; MINSAL 2010'
    },
    'borraja': {
        'uso_terapeutico': 'Estados febriles, tos y bronquitis, e inflamación crónica (artritis): el GLA de las semillas se convierte en prostaglandinas antiinflamatorias y los mucílagos suavizan las secreciones bronquiales.',
        'pa': 'Ácido gamma-linolénico/GLA (18-25% del aceite de semillas): precursor de prostaglandina E1 con potente acción antiinflamatoria (inhibe la vía omega-6 proinflamatoria). Mucílagos en hojas (11%): efecto emoliente sobre mucosas bronquiales. Sales de potasio: diaforéticas por estimulación de glándulas sudoríparas.',
        'prop': ['diaforético', 'expectorante', 'antiinflamatorio', 'emoliente', 'galactagogo'],
        'ref': 'Fan YY. & Chapkin RS. J Nutr 1998; 128(9):1411-14; WHO Monographs Vol.2 (2002); Muñoz et al. 1999; MINSAL 2010'
    },
    'hiperico': {
        'uso_terapeutico': 'Depresión leve a moderada: la hiperforina bloquea la recaptación de serotonina, noradrenalina y dopamina elevando sus niveles en la sinapsis con eficacia clínica equivalente a antidepresivos convencionales.',
        'pa': 'Hiperforina (floroglucinol): inhibe la recaptación de serotonina, noradrenalina, dopamina, GABA y glutamato mediante activación de canales TRPC6 (mecanismo único, no bloqueo de transportadores). Hipericina (naftodiantrona): inhibidor de MAO-A reduciendo la catabolización de monoaminas.',
        'prop': ['antidepresivo', 'ansiolítico', 'cicatrizante', 'antiviral', 'antiinflamatorio'],
        'ref': 'Linde K. et al. Cochrane Database Syst Rev 2005; CD000448; WHO Monographs Vol.2 (2002); EMA/HMPC 2009; Muñoz et al. 1999; MINSAL 2010'
    },
    'maqui': {
        'uso_terapeutico': 'Protección antioxidante celular, inflamación crónica y síndrome metabólico: las antocianinas neutralizan radicales libres, mejoran la función endotelial y reducen marcadores inflamatorios sistémicos.',
        'pa': 'Delfinidin y cianidina (antocianinas, 34% del total): capturan especies reactivas de oxígeno con potencia superior a otras antocianinas por sus múltiples grupos hidroxilo en el anillo B; aumentan expresión de eNOS endotelial y disminuyen síntesis de endotelina-1 vasoconstrictora.',
        'prop': ['antioxidante', 'antiinflamatorio', 'cardioprotector', 'inmunoestimulante', 'antidiabético'],
        'ref': 'Céspedes CL. et al. Food Chem 2010; 119(3):880-888; Muñoz et al. 1999; Hoffmann 1992; Aukanaw 2002; Villagrán & Castro 2003'
    },
    'chilco': {
        'uso_terapeutico': 'Trastornos menstruales (amenorrea, dismenorrea, reglas escasas): los flavonoides mejoran la vascularización endometrial y las saponinas reducen la congestión pélvica facilitando el flujo.',
        'pa': 'Flavonoides (isoquercitrina, quercitrina, kaempferol, hiperósido): refuerzan la pared capilar endometrial y ejercen efecto antiespasmódico suave. Saponinas (escina): mejoran el retorno venoso pélvico. Ácido oleanólico (triterpeno): antiinflamatorio sobre el endometrio.',
        'prop': ['emenagogo', 'regulador del ciclo menstrual', 'antiespasmódico', 'vasoprotector'],
        'ref': 'Muñoz et al. 1999; Hoffmann 1992; Montes & Wilkomirsky 1985; Aukanaw 2002; Tesis U. La Plata 2017'
    },
    'murta': {
        'uso_terapeutico': 'Diarrea, disentería y afecciones del tracto urinario: los taninos condensados contraen la mucosa intestinal y los elagitaninos inhiben la adhesión de patógenos entéricos.',
        'pa': 'Taninos condensados (proantocianidinas) y elagitaninos: forman complejos con proteínas bacterianas inhibiendo su adhesión a la mucosa intestinal; reducen viabilidad de E. coli y Staphylococcus. Antocianinas (delfinidinas): antioxidantes y antiinflamatorios de la mucosa.',
        'prop': ['antidiarreico', 'astringente', 'antiséptico', 'antioxidante', 'nutritivo'],
        'ref': 'López J. et al. J Berry Res 2019; 9(3):401-414; Muñoz et al. 1999; Hoffmann 1992; Montes & Wilkomirsky 1985; Aukanaw 2002'
    },
    'arrayan': {
        'uso_terapeutico': 'Infecciones de piel, heridas, afecciones bucales y problemas digestivos: los taninos producen astringencia sobre tejidos inflamados y el aceite esencial ejerce acción antiséptica directa.',
        'pa': 'Taninos condensados: forman complejos con proteínas superficiales bacterianas generando efecto antiséptico y hemostático. Aceite esencial (α-pineno, cineol, metil eugenol, mirtenol): disrumpe membranas bacterianas. Flavonoides (miricetina, quercetina): antioxidantes y antiinflamatorios locales.',
        'prop': ['astringente', 'antiséptico', 'antiinflamatorio', 'antidiarreico', 'cicatrizante'],
        'ref': 'Concha J. et al. Antimicrobial Activity Arrayan. ResearchGate 2020; Muñoz et al. 1999; Hoffmann 1992; Montes & Wilkomirsky 1985'
    },
    'quillay': {
        'uso_terapeutico': 'Expectorante en catarros bronquiales y tos productiva: las saponinas quilaicas reducen la tensión superficial del moco bronquial favoreciendo su fluidificación y expectoración.',
        'pa': 'Saponinas triterpénicas (QS-7, QS-17, QS-21 derivadas del ácido quilaico): reducen la tensión superficial de membranas mucosas facilitando la eliminación del moco; modulan la respuesta inmune innata activando macrófagos. Activas frente a bacterias y hongos respiratorios.',
        'prop': ['expectorante', 'mucolítico', 'inmunoestimulante', 'antiséptico', 'antifúngico'],
        'ref': 'Kensil CR. Crit Rev Ther Drug Carrier Syst 1996; 13(1-2):1-55; Muñoz et al. 1999; Hoffmann 1992; Montes & Wilkomirsky 1985; MINSAL 2010'
    },
    'culen': {
        'uso_terapeutico': 'Dispepsia, flatulencia, diarrea leve y control de glucemia en diabetes tipo 2 leve: el bakuchiol regula la glucosa postprandial y los flavonoides alivian espasmos gastrointestinales.',
        'pa': 'Bakuchiol (meroterpeno fenólico): regulación de glucemia por acción sobre receptores PPAR-γ (efecto hipoglucemiante). Psoraleno y angelicina (furanocumarinas): espasmolíticos sobre músculo liso intestinal. Flavonoides: antioxidantes y hepatoprotectores.',
        'prop': ['digestivo', 'antiespasmódico', 'hipoglucemiante', 'antidiarreico', 'carminativo'],
        'ref': 'Muñoz et al. 1999; Montes & Wilkomirsky 1985; Hoffmann 1992; MINSAL 2010'
    },
    'radal': {
        'uso_terapeutico': 'Tos, bronquitis y asma bronquial: la infusión de hojas reduce el espasmo bronquial con un 29,2% de inhibición inflamatoria demostrado en modelo in vivo, y ejerce acción antifúngica sobre patógenos respiratorios.',
        'pa': '2-Metoxijuglona (naftoquinona): actividad antifúngica y antibacteriana sobre patógenos respiratorios. Flavonoides (quercetina, catequina): broncodilatadores leves por relajación del músculo liso bronquial vía inhibición de fosfodiesterasas. Ácidos fenólicos: acción antiinflamatoria complementaria.',
        'prop': ['antiespasmódico bronquial', 'expectorante', 'antifúngico', 'antiinflamatorio'],
        'ref': 'Schmeda-Hirschmann G. et al. BMC Complement Altern Med 2006; 6:29 (PMC1564040); Backhouse N. et al. Phytother Res 1997; 11(3):209-13; Muñoz et al. 1999'
    },
    'pinguica': {
        'uso_terapeutico': 'Infecciones del tracto urinario inferior (cistitis, uretritis): la arbutina se hidroliza en la orina liberando hidroquinona con potente acción antiséptica sobre la mucosa urinaria.',
        'pa': 'Arbutina (glucósido hidroquinónico, 5-16% de la hoja): hidrolizada por glucosidasas a hidroquinona libre, que se excreta activa en orina alcalina (pH >7) inhibiendo E. coli, S. aureus y P. aeruginosa. Taninos (galotaninos): astringentes antiinflamatorios sobre la mucosa vesical.',
        'prop': ['antiséptico urinario', 'antiinflamatorio urinario', 'diurético', 'astringente'],
        'ref': 'WHO Monographs Vol.2 (2002); EMA/HMPC Arctostaphylos uva-ursi 2012; ESCOP Uvae ursi folium 2003; Muñoz et al. 1999; MINSAL 2010'
    },
    'palqui': {
        'uso_terapeutico': 'Estados febriles en medicina tradicional chilena: los alcaloides esteroidales estimulan las glándulas sudoríparas reduciendo la temperatura corporal por diaforesis. Uso controlado, planta tóxica en dosis elevadas.',
        'pa': 'Alcaloides glucoesteroidales (tipo solanina): estimulan el sistema nervioso autónomo aumentando la actividad secretora de glándulas sudoríparas (diaforético). Glicósidos kaurenoides: efecto antipirético. Saponinas y compuestos fenólicos: actividad antioxidante complementaria. ADVERTENCIA: tóxica en dosis altas.',
        'prop': ['diaforético', 'febrífugo', 'laxante suave'],
        'ref': 'Muñoz et al. 1999; Hoffmann 1992; Montes & Wilkomirsky 1985; Villagrán & Castro 2003; Catalán C. et al. PMC11314090 (2024)'
    },
    'nalca': {
        'uso_terapeutico': 'Afecciones gastrointestinales, diarrea y estados febriles; fuente nutritiva ancestral: los polifenoles ejercen potente actividad antioxidante y los taninos tienen efecto astringente sobre la mucosa digestiva.',
        'pa': 'Polifenoles totales en concentración extraordinaria (7.291 mg GAE/100g peso seco): incluyen ácido cafeico, ferúlico, quercetina y kaempferol con potente actividad antioxidante y antiinflamatoria. Taninos hidrolizables (ácido elágico): astringentes sobre la mucosa intestinal. Fibra cruda (11,57%): efecto prebiótico.',
        'prop': ['antioxidante', 'astringente', 'antiinflamatorio', 'nutritivo', 'digestivo'],
        'ref': 'Rubilar M. et al. Inf Tecnol 2018; 29(2):185-196; Muñoz et al. 1999; Hoffmann 1992; Villagrán & Castro 2003; Aukanaw 2002'
    },
    'peumo': {
        'uso_terapeutico': 'Diarrea, afecciones hepáticas leves y procesos reumáticos en medicina mapuche: los taninos ejercen acción astringente y los alcaloides bencilisoquinoléínicos son antimicrobianos frente a patógenos resistentes.',
        'pa': 'Taninos (corteza): forman complejos con proteínas de la mucosa intestinal reduciendo secreción y permeabilidad (antidiarreico). Alcaloides bencilisoquinoléinicos (reticulina): antimicrobianos frente a patógenos Gram+ resistentes. Flavonoides y ácido clorogénico: antioxidantes y hepatoprotectores.',
        'prop': ['astringente', 'antidiarreico', 'antimicrobiano', 'hepatoprotector leve'],
        'ref': 'Farias C. et al. Front Pharmacol 2025 (PMC12709134); Concha J. et al. ResearchGate 2020; Muñoz et al. 1999; Hoffmann 1992; Montes & Wilkomirsky 1985'
    },
    'ginkgo': {
        'uso_terapeutico': 'Insuficiencia cerebrovascular leve, trastornos de la memoria y demencia incipiente: los terpenoides mejoran la microcirculación cerebral y los flavonoides protegen las neuronas del estrés oxidativo.',
        'pa': 'Ginkgólidos A, B, C (diterpenos lactónicos): antagonistas del factor activador de plaquetas (PAF) reduciendo la viscosidad sanguínea y mejorando la microcirculación cerebral. Bilobalida (sesquiterpeno único): protege la función mitocondrial neuronal. Flavonol glucósidos: neutralizan radicales libres protegiendo membranas neuronales.',
        'prop': ['nootrópico', 'vasodilatador cerebral', 'neuroprotector', 'antioxidante', 'antiagregante'],
        'ref': 'Kleijnen J. & Knipschild P. Br J Clin Pharmacol 1992; 34(4):352-8; WHO Monographs Vol.1 (1999); EMA/HMPC Ginkgo biloba 2014; MINSAL 2010'
    },
    'echinacea': {
        'uso_terapeutico': 'Prevención y tratamiento coadyuvante de infecciones respiratorias superiores: las alquilamidas activan macrófagos, células NK y neutrófilos potenciando la fagocitosis y la respuesta inmune innata.',
        'pa': 'Alquilamidas (isobutilamidas): se unen a receptores cannabinoides CB2 de macrófagos aumentando la producción de IL-6 y TNF-α y la capacidad fagocítica. Arabinogalactanos: activan directamente macrófagos y células NK. Ácido chicórico: inhibe hialuronidasa bacteriana protegiendo la barrera epitelial.',
        'prop': ['inmunoestimulante', 'antiviral', 'antiinflamatorio', 'cicatrizante'],
        'ref': 'Melchart D. et al. Arch Fam Med 1998; 7(6):541-545; ESCOP Echinaceae purpureae herba 2003; WHO Monographs Vol.1 (1999); MINSAL 2010'
    },
    'poleo': {
        'uso_terapeutico': 'Trastornos digestivos (flatulencia, cólicos) y amenorrea: la pulegona estimula la motilidad digestiva y ejerce efecto emenagogo por vasocongestion pélvica. Contraindicado en embarazo.',
        'pa': 'Pulegona (cetona monoterpénica mayoritaria): estimula secreción de jugos gástricos, aumenta la motilidad intestinal y ejerce efecto emenagogo por estimulación del músculo liso uterino. En dosis altas la pulegona es hepatotóxica (metabolito tóxico mentofurano). CONTRAINDICADO EN EMBARAZO.',
        'prop': ['digestivo', 'carminativo', 'emenagogo', 'antiespasmódico', 'diaforético'],
        'ref': 'Gordon WP. et al. Drug Metab Dispos 1987; 15(5):589-594; Muñoz et al. 1999; Montes & Wilkomirsky 1985; MINSAL 2010'
    },
    'hiperico': {
        'uso_terapeutico': 'Depresión leve a moderada: la hiperforina bloquea la recaptación de serotonina, noradrenalina y dopamina con eficacia equivalente a antidepresivos convencionales en estudios clínicos controlados.',
        'pa': 'Hiperforina (floroglucinol): inhibe la recaptación de serotonina, noradrenalina, dopamina, GABA y glutamato mediante activación de canales TRPC6 (mecanismo único). Hipericina (naftodiantrona): inhibidor de MAO-A. INTERACCIÓN: inductor potente de CYP3A4 y glicoproteína-P.',
        'prop': ['antidepresivo', 'ansiolítico', 'antiviral', 'antiinflamatorio', 'cicatrizante'],
        'ref': 'Linde K. et al. Cochrane Database 2005; CD000448; WHO Monographs Vol.2 (2002); EMA/HMPC 2009; Muñoz et al. 1999; MINSAL 2010'
    },
}

# Alias de búsqueda → clave FITO
ALIAS = {
    'alcachofa': 'alcachofa', 'cynara': 'alcachofa',
    'boldo': 'boldo', 'peumus': 'boldo',
    'canelo': 'canelo', 'foye': 'foye', 'drimys': 'canelo',
    'manzanilla': 'manzanilla', 'camomila': 'manzanilla', 'matricaria': 'manzanilla',
    'matico': 'matico', 'mático': 'matico', 'buddleja': 'matico',
    'llanten': 'llantén', 'llantén': 'llantén', 'plantago': 'llantén',
    'tilo': 'tilo', 'tila': 'tilo',
    'romero': 'romero',
    'lavanda': 'lavanda', 'lavandula': 'lavanda',
    'melisa': 'melisa', 'melissa': 'melisa',
    'toronjil': 'toronjil',
    'valeriana': 'valeriana',
    'menta': 'menta', 'mentha piperita': 'menta',
    'hierba buena': 'hierba buena', 'hierbabuena': 'hierba buena', 'mentha spicata': 'hierba buena',
    'paico': 'paico', 'chenopodium': 'paico', 'dysphania': 'paico',
    'ruda': 'ruda', 'ruta': 'ruda',
    'cola de caballo': 'cola de caballo', 'equiseto': 'cola de caballo', 'equisetum': 'cola de caballo',
    'diente de leon': 'diente de leon', 'diente de león': 'diente de leon', 'taraxacum': 'diente de leon',
    'eucalipto': 'eucalipto', 'eucalyptus': 'eucalipto',
    'rosa mosqueta': 'rosa mosqueta', 'escaramujo': 'rosa mosqueta',
    'calendula': 'calendula', 'caléndula': 'calendula',
    'aloe': 'aloe', 'aloe vera': 'aloe', 'sabila': 'aloe', 'penca': 'aloe',
    'jengibre': 'jengibre', 'zingiber': 'jengibre',
    'ajo': 'ajo', 'allium sativum': 'ajo',
    'cebolla': 'cebolla', 'allium cepa': 'cebolla',
    'oregano': 'oregano', 'orégano': 'oregano', 'origanum': 'oregano',
    'clavo': 'clavo', 'clavo de olor': 'clavo', 'syzygium': 'clavo',
    'sauce': 'sauce', 'sauce blanco': 'sauce', 'salix': 'sauce',
    'propoleo': 'propóleo', 'propóleo': 'propóleo', 'propolis': 'propóleo',
    'miel': 'miel', 'miel de abeja': 'miel',
    'limon': 'limon', 'limón': 'limon', 'citrus limon': 'limon',
    'naranja': 'naranja', 'citrus sinensis': 'naranja',
    'salvia': 'salvia',
    'tomillo': 'tomillo', 'thymus': 'tomillo',
    'cedron': 'cedron', 'cedrón': 'cedron', 'aloysia': 'cedron',
    'hinojo': 'hinojo', 'foeniculum': 'hinojo',
    'anis': 'anis', 'anís': 'anis', 'pimpinella': 'anis',
    'borraja': 'borraja', 'borago': 'borraja',
    'hiperico': 'hiperico', 'hipérico': 'hiperico', 'hypericum': 'hiperico', 'san juan': 'hiperico',
    'maqui': 'maqui', 'aristotelia': 'maqui',
    'chilco': 'chilco', 'fuchsia': 'chilco',
    'murta': 'murta', 'ugni': 'murta',
    'arrayan': 'arrayan', 'arrayán': 'arrayan', 'luma': 'arrayan',
    'quillay': 'quillay', 'quillaja': 'quillay',
    'culen': 'culen', 'culén': 'culen', 'otholobium': 'culen',
    'radal': 'radal', 'lomatia': 'radal',
    'pinguica': 'pinguica', 'pingüica': 'pinguica', 'arctostaphylos': 'pinguica', 'uva ursi': 'pinguica',
    'palqui': 'palqui', 'cestrum': 'palqui',
    'nalca': 'nalca', 'pangue': 'nalca', 'gunnera': 'nalca',
    'peumo': 'peumo', 'cryptocarya': 'peumo',
    'ginkgo': 'ginkgo',
    'echinacea': 'echinacea', 'equinácea': 'echinacea', 'equinacea': 'echinacea',
    'poleo': 'poleo', 'mentha pulegium': 'poleo',
}

# Descriptores de propósito por categoría (para construir USO cuando el título no tiene "para")
CAT_DESCRIPTOR = {
    'Analgésico':       'Alivio del dolor',
    'Antiinflamatorio': 'Reducción de la inflamación',
    'Digestivo':        'Apoyo digestivo',
    'Hepático':         'Depurativo y protector hepático',
    'Sedante':          'Sedación y relajación nerviosa',
    'Nervioso':         'Equilibrio del sistema nervioso',
    'Respiratorio':     'Apoyo respiratorio',
    'Tos':              'Alivio de la tos',
    'Expectorante':     'Expectorante y mucolítico',
    'Resfriados':       'Tratamiento del resfriado',
    'Febrífugo':        'Reducción de la fiebre',
    'Cicatrizante':     'Cicatrización de heridas',
    'Dermatológico':    'Tratamiento dermatológico',
    'Diurético':        'Drenaje y depurativo renal',
    'Renal':            'Apoyo de la función renal',
    'Ginecológico':     'Apoyo a la salud femenina',
    'Antiparasitario':  'Eliminación de parásitos intestinales',
    'Cardiovascular':   'Apoyo cardiovascular',
    'Reumatismo':       'Alivio del reumatismo y artritis',
    'Musculoesquelético': 'Alivio muscular y articular',
    'Inmunológico':     'Fortalecimiento del sistema inmune',
    'Energizante':      'Energía y vitalidad',
    'Antifúngico':      'Tratamiento antifúngico',
    'Memoria':          'Mejora de la memoria y concentración',
    'Oftalmológico':    'Alivio ocular',
    'Dental':           'Alivio dental y bucal',
    'Garganta':         'Alivio de garganta y amígdalas',
    'Oídos':            'Alivio de afecciones de oídos',
    'Pediátrico':       'Cuidado pediátrico suave',
    'Nutritivo':        'Aporte nutricional',
    'Alimenticio':      'Complemento alimentario',
    'Cosmético':        'Cuidado cosmético de la piel',
    'Cabello':          'Cuidado del cabello',
    'Baño':             'Baño medicinal',
    'Diarrea':          'Tratamiento de la diarrea',
    'Alergia':          'Control de alergias',
    'Medicina Mapuche': 'Preparación medicinal mapuche',
    'Espiritual':       'Preparación ceremonial y espiritual',
    'General':          'Bienestar general',
    'Antifúngico':      'Tratamiento antifúngico',
}

def norm(txt):
    return re.sub(r'[^a-z0-9 ]', ' ',
        (txt or '').lower()
        .replace('á','a').replace('é','e').replace('í','i')
        .replace('ó','o').replace('ú','u').replace('ü','u').replace('ñ','n'))

def buscar_plantas_en_receta(r):
    texto = norm(f"{r.get('titulo','')} {r.get('ingredientes','')} {r.get('preparacion','')}")
    encontradas = []
    for alias, clave in ALIAS.items():
        if norm(alias) in texto and clave not in encontradas and clave in FITO:
            encontradas.append(clave)
    return encontradas

def construir_uso(r, plantas):
    """
    Construye el uso terapéutico específico de la receta.
    NUNCA usa modo_uso ni dosis (son instrucciones de administración, no propósito).
    Prioridad: propósito del título > uso_terapeutico de planta + categoría.
    """
    titulo = r.get('titulo', '')
    cat = r.get('categoria', '')

    # 1. Extraer propósito del título (patrón "para X")
    m = re.search(r'\bpara\s+(?:el\s+|la\s+|los\s+|las\s+|un\s+|una\s+)?([A-Za-záéíóúüñÁÉÍÓÚÜÑ][^(\[,]{4,60}?)(?:\s*[(\[,]|$)', titulo, re.I)
    prop_titulo = ''
    if m:
        prop_titulo = m.group(1).strip().rstrip('.')
        prop_titulo = prop_titulo[0].upper() + prop_titulo[1:]

    # 2. Obtener uso_terapeutico de la primera planta encontrada
    uso_planta = ''
    if plantas:
        uso_planta = FITO[plantas[0]].get('uso_terapeutico', '')

    # 3. Construir el campo uso
    if prop_titulo and uso_planta:
        # Extraer solo el mecanismo (después de ': ') para no arrastrar la indicación
        # original de la planta (ej: "Odontalgia, gingivitis..." no aplica a compresa cefálica)
        primera_oracion = re.split(r'(?<=[.!?])\s', uso_planta)[0]
        if ': ' in primera_oracion:
            mecanismo = primera_oracion.split(': ', 1)[1]
        else:
            mecanismo = primera_oracion
        return f"{prop_titulo}: {mecanismo[0].lower() + mecanismo[1:]}"
    elif prop_titulo:
        # Propósito del título + descriptor de categoría
        desc = CAT_DESCRIPTOR.get(cat, '')
        return f"{prop_titulo}." + (f" {desc}." if desc and desc.lower() not in prop_titulo.lower() else '')
    elif uso_planta:
        # Solo el uso terapéutico de la planta
        return uso_planta
    else:
        desc = CAT_DESCRIPTOR.get(cat, '')
        return f"{desc}." if desc else ''

def construir_pa(plantas):
    if not plantas:
        return ''
    partes = []
    for clave in plantas[:2]:
        pa = FITO[clave].get('pa', '')
        if pa:
            partes.append(pa)
    return ' | '.join(partes)

def construir_propiedades(plantas, cat):
    props = []
    for clave in plantas[:2]:
        for p in FITO[clave].get('prop', []):
            if p not in props:
                props.append(p)
    return props[:6] if props else []

def construir_referencias(plantas, r):
    refs = []
    vistos = set()
    for clave in plantas[:3]:
        for ref in FITO[clave].get('ref', '').split('; '):
            ref = ref.strip()
            if ref and ref not in vistos:
                refs.append(ref)
                vistos.add(ref)
    fuente = r.get('fuente_tradicion', '')
    if fuente and re.search(r'\d{4}', fuente) and fuente not in vistos:
        refs.append(fuente)
    if not refs:
        refs = ['Hoffmann A. 1992; Muñoz O. et al. 1999; MINSAL 2010']
    return '; '.join(refs[:5])

def enriquecer(recetas):
    total = len(recetas)
    count = 0
    for i, r in enumerate(recetas):
        plantas = buscar_plantas_en_receta(r)

        if not r.get('uso'):
            uso = construir_uso(r, plantas)
            if uso:
                r['uso'] = uso.strip()

        if not r.get('principios_activos'):
            pa = construir_pa(plantas)
            if pa:
                r['principios_activos'] = pa

        if not r.get('propiedades'):
            props = construir_propiedades(plantas, r.get('categoria', ''))
            if props:
                r['propiedades'] = props

        if not r.get('referencias'):
            refs = construir_referencias(plantas, r)
            if refs:
                r['referencias'] = refs

        if any(r.get(c) for c in ['uso', 'principios_activos', 'propiedades', 'referencias']):
            count += 1

        if (i + 1) % 200 == 0:
            print(f'  {i+1}/{total} procesadas...')

    return recetas, count

def main():
    print('Enciclopedia Naturista — Enriquecimiento masivo de recetas')
    with open(RECETAS_PATH, encoding='utf-8') as f:
        recetas = json.load(f)
    print(f'  {len(recetas)} recetas cargadas. Procesando...\n')

    # Limpiar campos previos (regenerar desde cero con datos correctos)
    for r in recetas:
        for campo in ['uso', 'principios_activos', 'propiedades', 'referencias']:
            r.pop(campo, None)

    recetas, count = enriquecer(recetas)

    with open(RECETAS_PATH, 'w', encoding='utf-8') as f:
        json.dump(recetas, f, ensure_ascii=False, indent=2)

    print(f'\nCompletado: {count}/{len(recetas)} recetas enriquecidas.')

    import random
    muestras = random.sample([r for r in recetas if r.get('uso')], min(4, count))
    print('\n-- Ejemplos --')
    for r in muestras:
        print(f"\n[{r['id']}] {r['titulo']}")
        print(f"  USO: {r.get('uso','')}")
        print(f"  PA:  {(r.get('principios_activos',''))[:90]}...")
        print(f"  PROP: {', '.join(r.get('propiedades',[]))}")
        print(f"  REF: {r.get('referencias','')[:80]}...")

if __name__ == '__main__':
    main()
