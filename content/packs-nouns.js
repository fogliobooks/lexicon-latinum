/* Paradigm packs: nouns and adjectives. Each pack is the "example set" for one inflectional class. */
var PACKS = (typeof PACKS !== 'undefined') ? PACKS : {};

PACKS["N-1-F"] = {
  id: "N-1-F", title: "First declension (feminine, -a)", pos: "N",
  model: { hw: "puella", parts: "puella, puellae", gender: "f.", gloss: "girl" },
  modelEntry: { s: ["puell", "puell"], p: "N", c: [1, 1], g: "F", k: "P" },
  intro: "<p>First-declension nouns end in <b>-a</b> in the nominative singular and <b>-ae</b> in the genitive singular. Almost all are feminine (<i>puella, rosa, terra, via, aqua</i>); the exceptions are names of male persons and occupations such as <i>nauta</i> sailor, <i>poēta</i> poet, <i>agricola</i> farmer, which are masculine but decline exactly the same way.</p><p>The stem is found by removing <b>-ae</b> from the genitive: <i>puell-</i>. The characteristic vowel of the declension is <b>ā</b>.</p>",
  formation: "<p>Note the three forms spelled <i>puellae</i> (gen. sg., dat. sg., nom./voc. pl.) and the two spelled <i>puella</i> (nom./voc. sg. with short -a, abl. sg. with long -ā). Context decides. <i>Dea</i> and <i>fīlia</i> have dat./abl. pl. <i>deābus, fīliābus</i> to keep them distinct from <i>deīs, fīliīs</i>. The old genitive singular <i>-āī</i> (aulāī) appears in Vergil and Lucretius.</p>",
  rows: {
    "NOM S": { ex: "Puella in hortō cantat.", en: "The girl is singing in the garden.", note: "subject" },
    "GEN S": { ex: "Māter puellae est laeta.", en: "The girl's mother is happy.", note: "possession" },
    "DAT S": { ex: "Rosam puellae dō.", en: "I give the rose to the girl.", note: "indirect object" },
    "ACC S": { ex: "Puellam in viā videō.", en: "I see the girl in the street.", note: "direct object" },
    "ABL S": { ex: "Cum puellā ambulō.", en: "I am walking with the girl.", note: "accompaniment (cum + abl.)" },
    "VOC S": { ex: "Puella, venī hūc!", en: "Girl, come here!", note: "direct address" },
    "LOC S": { ex: "Rōmae habitat.", en: "She lives in Rome.", note: "locative of a town name (= gen. form)" },
    "NOM P": { ex: "Puellae in hortō lūdunt.", en: "The girls are playing in the garden.", note: "subject, plural" },
    "GEN P": { ex: "Vōcēs puellārum audiō.", en: "I hear the girls' voices.", note: "possession" },
    "DAT P": { ex: "Magister puellīs fābulam nārrat.", en: "The teacher tells the girls a story.", note: "indirect object" },
    "ACC P": { ex: "Puellās ad lūdum mittit.", en: "He sends the girls to school.", note: "direct object" },
    "ABL P": { ex: "Ā puellīs laudātur.", en: "He is praised by the girls.", note: "agent with passive verb (ā/ab + abl.)" },
    "VOC P": { ex: "Puellae, audīte!", en: "Girls, listen!", note: "address" },
    "LOC P": { ex: "Athēnīs philosophiam discit.", en: "He learns philosophy at Athens.", note: "locative of a plural town name (= abl. form)" },
  },
  tips: ["<i>puellae</i> can be genitive singular, dative singular or nominative plural: let the verb and the rest of the sentence decide.", "The ablative singular <i>puellā</i> has a long ā; in texts without macrons it looks identical to the nominative.", "Masculine first-declension nouns (<i>nauta, poēta, agricola, incola</i>) take masculine adjectives: <i>nauta bonus</i>.", "Greek names in -ē/-ās/-ēs (<i>Pēnelopē, Aenēās, Anchīsēs</i>) belong here with Greek endings in the singular."],
  related: ["N-1-M", "N-2-M", "ADJ-1-2"]
};

PACKS["N-1-M"] = {
  id: "N-1-M", title: "First declension, masculine (nauta, poēta)", pos: "N",
  model: { hw: "nauta", parts: "nauta, nautae", gender: "m.", gloss: "sailor" },
  modelEntry: { s: ["naut", "naut"], p: "N", c: [1, 1], g: "M", k: "P" },
  intro: "<p>A small group of first-declension nouns denoting men are <b>masculine</b> although they decline exactly like <i>puella</i>: <i>nauta</i> sailor, <i>poēta</i> poet, <i>agricola</i> farmer, <i>incola</i> inhabitant, <i>scrība</i> clerk, <i>aurīga</i> charioteer, and many Greek names (<i>Catilīna</i>). The only visible difference is that adjectives and pronouns referring to them are masculine: <i>nauta bonus</i>, <i>poēta clārus</i>.</p>",
  formation: "<p>Identical to puella. Remember that <i>nautae</i> may be gen. sg., dat. sg. or nom. pl.</p>",
  rows: {
    "NOM S": { ex: "Nauta perītus nāvem regit.", en: "The skilled sailor steers the ship.", note: "subject with masculine adjective" },
    "GEN S": { ex: "Fīlius nautae in portū manet.", en: "The sailor's son stays in the harbour.", note: "possession" },
    "DAT S": { ex: "Nautae pecūniam dedī.", en: "I gave money to the sailor.", note: "indirect object" },
    "ACC S": { ex: "Nautam fessum vidēmus.", en: "We see the tired sailor.", note: "direct object" },
    "ABL S": { ex: "Ā nautā servātus est.", en: "He was saved by the sailor.", note: "agent" },
    "VOC S": { ex: "Nauta, nāvem solve!", en: "Sailor, cast off the ship!", note: "address" },
    "NOM P": { ex: "Nautae tempestātem timent.", en: "The sailors fear the storm.", note: "subject" },
    "GEN P": { ex: "Clāmor nautārum audītur.", en: "The shouting of the sailors is heard.", note: "possession" },
    "DAT P": { ex: "Ventus nautīs secundus est.", en: "The wind is favourable for the sailors.", note: "dative of reference" },
    "ACC P": { ex: "Imperātor nautās laudat.", en: "The commander praises the sailors.", note: "direct object" },
    "ABL P": { ex: "Cum nautīs nāvigāvimus.", en: "We sailed with the sailors.", note: "accompaniment" },
    "VOC P": { ex: "Nautae, rēmōs capite!", en: "Sailors, take the oars!", note: "address" },
  },
  tips: ["Gender here is about meaning (men), not form: the dictionary marks these <i>m.</i>", "In poetry the genitive plural <i>-um</i> is found for Greek-type words: <i>Trōiugenum</i>."],
  related: ["N-1-F", "N-2-M"]
};

PACKS["N-2-M"] = {
  id: "N-2-M", title: "Second declension, masculine (-us)", pos: "N",
  model: { hw: "amīcus", parts: "amīcus, amīcī", gender: "m.", gloss: "friend" },
  modelEntry: { s: ["amic", "amic"], p: "N", c: [2, 1], g: "M", k: "P" },
  intro: "<p>Second-declension nouns have genitive singular <b>-ī</b>. Those ending in <b>-us</b> are masculine (<i>amīcus, servus, dominus, hortus</i>); a few names of trees, towns and countries in -us are feminine (<i>pōpulus</i> poplar, <i>Aegyptus</i>), and <i>vulgus, pelagus, vīrus</i> are neuter.</p><p>The stem is the genitive minus -ī: <i>amīc-</i>. The characteristic vowel is <b>o</b> (seen in <i>-ō, -ōrum, -ōs</i>).</p>",
  formation: "<p>The <b>vocative singular</b> is the one place in Latin where it differs from the nominative: <i>-us → -e</i> (<i>amīce</i>); nouns in <i>-ius</i> have <i>-ī</i> (<i>fīlī</i>), and <i>meus</i> has <i>mī</i>. The genitive plural <i>-um</i> for <i>-ōrum</i> occurs in a few words (<i>deum, virum, nummum</i>) and in poetry.</p>",
  rows: {
    "NOM S": { ex: "Amīcus meus Rōmā venit.", en: "My friend is coming from Rome.", note: "subject" },
    "GEN S": { ex: "Domus amīcī prope forum est.", en: "My friend's house is near the forum.", note: "possession" },
    "DAT S": { ex: "Librum amīcō dedī.", en: "I gave the book to my friend.", note: "indirect object" },
    "ACC S": { ex: "Amīcum in forō vīdī.", en: "I saw my friend in the forum.", note: "direct object" },
    "ABL S": { ex: "Cum amīcō cēnāvī.", en: "I dined with my friend.", note: "accompaniment" },
    "VOC S": { ex: "Salvē, amīce!", en: "Hello, friend!", note: "vocative -e" },
    "LOC S": { ex: "Corinthī nātus est.", en: "He was born at Corinth.", note: "locative of a town (= gen. form)" },
    "NOM P": { ex: "Amīcī vērī rārī sunt.", en: "True friends are rare.", note: "subject" },
    "GEN P": { ex: "Cōnsilium amīcōrum petō.", en: "I seek the advice of my friends.", note: "possession / objective genitive" },
    "DAT P": { ex: "Amīcīs semper crēdō.", en: "I always trust my friends.", note: "dative with crēdō" },
    "ACC P": { ex: "Amīcōs ad cēnam vocāvit.", en: "He invited his friends to dinner.", note: "direct object" },
    "ABL P": { ex: "Ab amīcīs dēfēnsus est.", en: "He was defended by his friends.", note: "agent" },
    "VOC P": { ex: "Amīcī, mē audīte!", en: "Friends, listen to me!", note: "address" },
  },
  tips: ["<i>amīcī</i> = genitive singular or nominative/vocative plural; <i>amīcō</i> = dative or ablative singular; <i>amīcīs</i> = dative or ablative plural.", "The same word is also an adjective (<i>amīcus, -a, -um</i> friendly) — the dictionary lists both.", "Compare the -er type (<i>puer, ager</i>) and the neuter type (<i>bellum</i>), which share every ending except nom./voc. sg. and nom./acc./voc. pl."],
  related: ["N-2-ER", "N-2-N", "N-2-IUS", "ADJ-1-2"]
};

PACKS["N-2-ER"] = {
  id: "N-2-ER", title: "Second declension in -er / -ir (puer, ager, vir)", pos: "N",
  model: { hw: "puer", parts: "puer, puerī", gender: "m.", gloss: "boy" },
  modelEntry: { s: ["puer", "puer"], p: "N", c: [2, 3], g: "M", k: "P" },
  intro: "<p>Some masculine second-declension nouns have no ending in the nominative singular: <b>-er</b> or <b>-ir</b>. Two sub-types: those that keep the <i>e</i> throughout (<i>puer, puerī; socer; gener; vesper; Līber</i>) and those that drop it (<i>ager, agrī; magister, magistrī; liber, librī</i> book). <i>Vir, virī</i> man is the only word in -ir. The genitive shows which type a word belongs to.</p>",
  formation: "<p>Nominative and vocative singular are identical (no -e ending); otherwise the endings are those of <i>amīcus</i>. For the <i>ager</i> type remember the stem <i>agr-</i>: <i>agrī, agrō, agrum, agrō; agrī, agrōrum, agrīs, agrōs</i>.</p>",
  rows: {
    "NOM S": { ex: "Puer in viā currit.", en: "The boy is running in the street.", note: "subject" },
    "GEN S": { ex: "Canis puerī lātrat.", en: "The boy's dog is barking.", note: "possession" },
    "DAT S": { ex: "Pater puerō dōnum dat.", en: "The father gives the boy a gift.", note: "indirect object" },
    "ACC S": { ex: "Magister puerum laudat.", en: "The teacher praises the boy.", note: "direct object" },
    "ABL S": { ex: "Dē puerō loquimur.", en: "We are talking about the boy.", note: "dē + ablative" },
    "VOC S": { ex: "Puer, tacē!", en: "Boy, be quiet!", note: "vocative = nominative" },
    "NOM P": { ex: "Puerī in agrō lūdunt.", en: "The boys are playing in the field.", note: "subject" },
    "GEN P": { ex: "Clāmōrēs puerōrum audiō.", en: "I hear the shouts of the boys.", note: "possession" },
    "DAT P": { ex: "Puerīs fābulās nārrō.", en: "I tell stories to the boys.", note: "indirect object" },
    "ACC P": { ex: "Puerōs domum vocat.", en: "She calls the boys home.", note: "direct object" },
    "ABL P": { ex: "Ā puerīs amātur.", en: "She is loved by the boys.", note: "agent" },
    "VOC P": { ex: "Puerī, venīte!", en: "Boys, come!", note: "address" },
  },
  tips: ["<i>liber, librī</i> (book) drops the e; <i>līber, līberī</i> (free, and <i>līberī</i> children) keeps it — the macron and the genitive tell them apart.", "<i>vir</i> has genitive plural <i>virōrum</i> or, in poetry, <i>virum</i>."],
  related: ["N-2-M", "ADJ-1-2-ER"]
};

PACKS["N-2-N"] = {
  id: "N-2-N", title: "Second declension, neuter (-um)", pos: "N",
  model: { hw: "bellum", parts: "bellum, bellī", gender: "n.", gloss: "war" },
  modelEntry: { s: ["bell", "bell"], p: "N", c: [2, 2], g: "N", k: "T" },
  intro: "<p>Neuter nouns of the second declension end in <b>-um</b> (<i>bellum, dōnum, templum, verbum, oppidum</i>). As with every neuter in Latin, the <b>nominative, accusative and vocative are identical</b>, and in the plural those three cases end in <b>-a</b>. All other endings are the same as <i>amīcus</i>.</p>",
  formation: "<p>Watch the neuter plural <i>bella</i>: it looks like a first-declension feminine singular but is neuter plural (nominative or accusative). Neuter plural subjects take a plural verb: <i>bella gesta sunt</i>.</p>",
  rows: {
    "NOM S": { ex: "Bellum longum erat.", en: "The war was long.", note: "subject" },
    "GEN S": { ex: "Fīnis bellī omnibus grātus est.", en: "The end of the war is welcome to all.", note: "possession / 'of'" },
    "DAT S": { ex: "Bellō sē parant.", en: "They are preparing themselves for war.", note: "dative of purpose" },
    "ACC S": { ex: "Rōmānī bellum gerunt.", en: "The Romans are waging war.", note: "direct object (= nominative in form)" },
    "ABL S": { ex: "In bellō multī cadunt.", en: "In war many fall.", note: "place where" },
    "VOC S": { ex: "Ō bellum crūdēle!", en: "O cruel war!", note: "exclamation (vocative = nominative)" },
    "NOM P": { ex: "Bella cīvīlia rem pūblicam dēlēvērunt.", en: "The civil wars destroyed the republic.", note: "neuter plural subject, plural verb" },
    "GEN P": { ex: "Memoria bellōrum manet.", en: "The memory of the wars remains.", note: "possession" },
    "DAT P": { ex: "Bellīs fīnem imposuit.", en: "He put an end to the wars.", note: "indirect object" },
    "ACC P": { ex: "Multa bella gessit.", en: "He waged many wars.", note: "direct object plural -a" },
    "ABL P": { ex: "Dē bellīs Pūnicīs legimus.", en: "We read about the Punic wars.", note: "dē + ablative" },
    "VOC P": { ex: "Ō bella, quantum malī fertis!", en: "O wars, how much evil you bring!", note: "exclamation" },
  },
  tips: ["Nominative = accusative for every neuter; look at the verb's number and the sentence to tell subject from object.", "<i>-a</i> plural neuters (<i>bella, dōna, verba</i>) are a classic trap for mistaking them as 1st-declension singulars.", "A few neuters in -us belong here too: <i>vulgus</i> crowd, <i>pelagus</i> sea, <i>vīrus</i> poison (acc. = nom.)."],
  related: ["N-2-M", "N-2-IUS", "N-3-N"]
};

PACKS["N-2-IUS"] = {
  id: "N-2-IUS", title: "Second declension in -ius / -ium (fīlius, cōnsilium)", pos: "N",
  model: { hw: "fīlius", parts: "fīlius, fīliī", gender: "m.", gloss: "son" },
  modelEntry: { s: ["fili", "fili"], p: "N", c: [2, 4], g: "M", k: "P" },
  intro: "<p>Nouns in <b>-ius</b> (<i>fīlius, gladius, Cornēlius</i>) and <b>-ium</b> (<i>cōnsilium, imperium, ingenium</i>) decline like <i>amīcus</i> and <i>bellum</i>, with two peculiarities: the genitive singular in classical authors is usually contracted to <b>-ī</b> (<i>fīlī, cōnsilī</i>; the uncontracted <i>fīliī</i> becomes normal from Ovid on), and the vocative singular of <i>-ius</i> nouns is <b>-ī</b> (<i>fīlī, Cornēlī</i>), not <i>-ie</i>.</p>",
  formation: "<p>Nominative plural <i>fīliī</i> (two i's), dative/ablative plural <i>fīliīs</i>; the accent of the contracted genitive stays where it was (<i>Vergílī</i>).</p>",
  rows: {
    "NOM S": { ex: "Fīlius patrem imitātur.", en: "The son imitates his father.", note: "subject" },
    "GEN S": { ex: "Uxor fīliī Rōmam vēnit.", en: "The son's wife came to Rome.", note: "possession (also fīlī)" },
    "DAT S": { ex: "Pater fīliō agrum relīquit.", en: "The father left the field to his son.", note: "indirect object" },
    "ACC S": { ex: "Māter fīlium amplectitur.", en: "The mother embraces her son.", note: "direct object" },
    "ABL S": { ex: "Dē fīliō saepe cōgitat.", en: "He often thinks about his son.", note: "dē + ablative" },
    "VOC S": { ex: "Mī fīlī, audī mē!", en: "My son, listen to me!", note: "vocative -ī (and mī for meus)" },
    "NOM P": { ex: "Fīliī eius in Graeciā sunt.", en: "His sons are in Greece.", note: "subject" },
    "GEN P": { ex: "Mātrēs fīliōrum lacrimant.", en: "The mothers of the sons are weeping.", note: "possession" },
    "DAT P": { ex: "Fīliīs omnia dedit.", en: "He gave everything to his sons.", note: "indirect object" },
    "ACC P": { ex: "Fīliōs bene ēducāvit.", en: "He brought up his sons well.", note: "direct object" },
    "ABL P": { ex: "Cum fīliīs vēnit.", en: "He came with his sons.", note: "accompaniment" },
    "VOC P": { ex: "Fīliī, patrem honōrāte!", en: "Sons, honour your father!", note: "address" },
  },
  tips: ["Neuters in -ium (<i>cōnsilium</i>) are identical except that nom./acc./voc. are <i>-ium</i> (sg.) and <i>-ia</i> (pl.).", "Proper names in -ius have the vocative in -ī: <i>Antōnī! Iūlī!</i>"],
  related: ["N-2-M", "N-2-N"]
};

PACKS["N-3-M"] = {
  id: "N-3-M", title: "Third declension, masculine (consonant stem)", pos: "N",
  model: { hw: "rēx", parts: "rēx, rēgis", gender: "m.", gloss: "king" },
  modelEntry: { s: ["rex", "reg"], p: "N", c: [3, 1], g: "M", k: "P" },
  intro: "<p>The third declension is the largest and most varied. Its mark is genitive singular <b>-is</b>. The nominative singular can end in almost anything (<i>rēx, mīles, homō, pater, cōnsul, dux</i>), so you must learn the <b>genitive</b>, which reveals the stem: <i>rēg-, mīlit-, homin-, patr-, cōnsul-, duc-</i>. Masculine and feminine nouns share one set of endings; gender has to be learnt (rules of thumb: <i>-or, -ōs, -er, -es</i> (gen. -itis) masculine; <i>-iō, -tās, -tūs, -x, -s</i> after a consonant feminine).</p>",
  formation: "<p>Endings: <i>-is, -ī, -em, -e</i> | <i>-ēs, -um, -ibus, -ēs, -ibus</i>. Consonant-stem nouns have genitive plural <b>-um</b> (<i>rēgum</i>); compare the i-stems (<i>cīvium</i>). The nominative is often a shortened or altered stem: <i>rēg-s → rēx</i>, <i>mīlit-s → mīles</i>, <i>homin- → homō</i>.</p>",
  rows: {
    "NOM S": { ex: "Rēx populum regit.", en: "The king rules the people.", note: "subject" },
    "GEN S": { ex: "Fīlia rēgis pulchra est.", en: "The king's daughter is beautiful.", note: "possession" },
    "DAT S": { ex: "Lēgātī rēgī dōna ferunt.", en: "The envoys bring gifts to the king.", note: "indirect object" },
    "ACC S": { ex: "Cīvēs rēgem expulērunt.", en: "The citizens drove out the king.", note: "direct object" },
    "ABL S": { ex: "Ā rēge accūsātus est.", en: "He was accused by the king.", note: "agent" },
    "VOC S": { ex: "Rēx, parce victīs!", en: "King, spare the conquered!", note: "vocative = nominative" },
    "LOC S": { ex: "Carthāgine habitābat.", en: "He lived at Carthage.", note: "locative -e / -ī of a town" },
    "NOM P": { ex: "Rēgēs Rōmānī septem fuērunt.", en: "There were seven Roman kings.", note: "subject" },
    "GEN P": { ex: "Nōmina rēgum memoriā tenēmus.", en: "We hold the names of the kings in memory.", note: "possession, gen. pl. -um" },
    "DAT P": { ex: "Rēgibus nōn pārēbimus.", en: "We shall not obey kings.", note: "dative with pāreō" },
    "ACC P": { ex: "Poētae rēgēs laudant.", en: "Poets praise kings.", note: "direct object (= nominative)" },
    "ABL P": { ex: "Lībertās ā rēgibus ērepta est.", en: "Freedom was snatched away by the kings.", note: "agent" },
    "VOC P": { ex: "Rēgēs, iūstitiam colite!", en: "Kings, cultivate justice!", note: "address" },
  },
  tips: ["Nominative and accusative plural are both <i>-ēs</i>; dative and ablative plural both <i>-ibus</i>.", "Nouns with the same number of syllables in nom. and gen. (<i>cīvis, nūbēs</i>) or a stem in two consonants (<i>urbs, mōns</i>) are i-stems with gen. pl. <i>-ium</i>.", "Family words <i>pater, māter, frāter</i> and <i>senex, iuvenis, canis</i> are consonant stems (gen. pl. <i>patrum, canum</i>) despite looking like i-stems."],
  related: ["N-3-F", "N-3-I", "N-3-N", "ADJ-3-1"]
};

PACKS["N-3-F"] = {
  id: "N-3-F", title: "Third declension, feminine (consonant stem)", pos: "N",
  model: { hw: "vōx", parts: "vōx, vōcis", gender: "f.", gloss: "voice" },
  modelEntry: { s: ["vox", "voc"], p: "N", c: [3, 1], g: "F", k: "T" },
  intro: "<p>Feminine third-declension consonant stems take exactly the same endings as the masculines (<i>rēx</i>); only the adjectives agreeing with them show the gender: <i>vōx clāra</i>, <i>lēx nova</i>. Common groups: abstract nouns in <b>-tās, -tātis</b> (<i>vēritās</i>), <b>-tiō, -tiōnis</b> (<i>ōrātiō</i>), <b>-tūdō, -tūdinis</b> (<i>multitūdō</i>), and many in <b>-x</b> (<i>vōx, lēx, pāx, lūx, nox</i>).</p>",
  formation: "<p>Stem from the genitive: <i>vōc-</i>. The nominative <i>vōx</i> = <i>vōc-s</i>. Genitive plural <i>-um</i> (<i>vōcum</i>); i-stem feminines such as <i>urbs, nox, ars</i> have <i>-ium</i>.</p>",
  rows: {
    "NOM S": { ex: "Vōx eius clāra est.", en: "His voice is clear.", note: "subject with feminine adjective" },
    "GEN S": { ex: "Sonus vōcis mē terruit.", en: "The sound of the voice frightened me.", note: "possession" },
    "DAT S": { ex: "Vōcī populī cēdit.", en: "He yields to the voice of the people.", note: "dative with cēdō" },
    "ACC S": { ex: "Vōcem magnam audīvimus.", en: "We heard a loud voice.", note: "direct object" },
    "ABL S": { ex: "Magnā vōce clāmat.", en: "He shouts in a loud voice.", note: "ablative of manner" },
    "VOC S": { ex: "Ō vōx dulcis!", en: "O sweet voice!", note: "exclamation" },
    "NOM P": { ex: "Vōcēs puerōrum audiuntur.", en: "The boys' voices are heard.", note: "subject" },
    "GEN P": { ex: "Varietās vōcum mīra est.", en: "The variety of voices is wonderful.", note: "possession, gen. pl. -um" },
    "DAT P": { ex: "Vōcibus amīcōrum crēdit.", en: "He trusts the voices of his friends.", note: "dative with crēdō" },
    "ACC P": { ex: "Vōcēs avium amāmus.", en: "We love the voices of the birds.", note: "direct object" },
    "ABL P": { ex: "Vōcibus et manibus signa dant.", en: "They give signals with voices and hands.", note: "ablative of means" },
    "VOC P": { ex: "Vōcēs, tacēte!", en: "Voices, be silent!", note: "address" },
  },
  tips: ["Learn gender with the genitive: <i>vōx, vōcis, f.</i>", "The abstract suffixes <i>-tās, -tiō, -tūdō, -gō</i> are reliably feminine; <i>-or</i> is reliably masculine."],
  related: ["N-3-M", "N-3-I", "N-3-N"]
};

PACKS["N-3-N"] = {
  id: "N-3-N", title: "Third declension, neuter (corpus, nōmen, tempus)", pos: "N",
  model: { hw: "corpus", parts: "corpus, corporis", gender: "n.", gloss: "body" },
  modelEntry: { s: ["corpus", "corpor"], p: "N", c: [3, 2], g: "N", k: "T" },
  intro: "<p>Neuter nouns of the third declension follow the neuter rule: nominative, accusative and vocative are the same, and in the plural those cases end in <b>-a</b>. Common types: <b>-us, -oris/-eris</b> (<i>corpus, tempus, genus, opus</i>), <b>-men, -minis</b> (<i>nōmen, flūmen, carmen</i>), <b>-ut/-ur</b> (<i>caput, capitis; iter, itineris</i>).</p>",
  formation: "<p>Endings sg.: <i>—, -is, -ī, —, -e</i>; pl.: <i>-a, -um, -ibus, -a, -ibus</i>. The nominative is the bare stem, often with a changed final vowel (<i>corpus / corpor-</i>, <i>nōmen / nōmin-</i>).</p>",
  rows: {
    "NOM S": { ex: "Corpus hominis mortāle est.", en: "The human body is mortal.", note: "subject" },
    "GEN S": { ex: "Vīrēs corporis dēficiunt.", en: "The strength of the body is failing.", note: "possession" },
    "DAT S": { ex: "Cibus corporī necessārius est.", en: "Food is necessary for the body.", note: "dative with an adjective" },
    "ACC S": { ex: "Corpus exercitātiōne firmāmus.", en: "We strengthen the body by exercise.", note: "direct object (= nominative)" },
    "ABL S": { ex: "Animus ē corpore discēdit.", en: "The soul departs from the body.", note: "separation (ē/ex + abl.)" },
    "VOC S": { ex: "Ō corpus fessum!", en: "O weary body!", note: "exclamation" },
    "NOM P": { ex: "Corpora mīlitum in campō iacent.", en: "The bodies of the soldiers lie on the plain.", note: "neuter plural subject" },
    "GEN P": { ex: "Cūra corporum medicīs est.", en: "The care of bodies belongs to doctors.", note: "possession, gen. pl. -um" },
    "DAT P": { ex: "Somnus corporibus prōdest.", en: "Sleep is good for bodies.", note: "dative with prōsum" },
    "ACC P": { ex: "Corpora mortuōrum sepelīvērunt.", en: "They buried the bodies of the dead.", note: "direct object plural -a" },
    "ABL P": { ex: "Corporibus validīs labōrant.", en: "They work with strong bodies.", note: "ablative of means / description" },
    "VOC P": { ex: "Corpora, quiēscite!", en: "Bodies, rest!", note: "address" },
  },
  tips: ["<i>tempus, temporis</i> (time) and <i>tempus</i> as a 2nd-declension-looking word are the same noun — the genitive <i>-oris</i> proves it is 3rd declension neuter.", "<i>-us</i> neuters (<i>corpus, genus, opus, onus, latus</i>) are easily confused with 2nd-declension masculines; the genitive settles it.", "<i>caput, capitis</i> and <i>cor, cordis</i> (gen. pl. <i>cordium</i>) are frequent irregular-looking neuters."],
  related: ["N-3-N-I", "N-3-M", "N-2-N"]
};

PACKS["N-3-I"] = {
  id: "N-3-I", title: "Third declension i-stems, m./f. (cīvis, urbs, nox)", pos: "N",
  model: { hw: "cīvis", parts: "cīvis, cīvis", gender: "m./f.", gloss: "citizen" },
  modelEntry: { s: ["civ", "civ"], p: "N", c: [3, 3], g: "C", k: "P" },
  intro: "<p>I-stem nouns differ from the consonant stems in the <b>genitive plural -ium</b> (and, optionally, accusative plural <b>-īs</b> beside -ēs). Recognise them by three rules: (1) nominative in <b>-is</b> or <b>-ēs</b> with the same number of syllables in the genitive (<i>cīvis, cīvis; nūbēs, nūbis; hostis, nāvis</i>); (2) monosyllables whose stem ends in two consonants (<i>urbs, urbis; mōns, montis; nox, noctis; ars, artis; pars, partis</i>); (3) nouns in <b>-ns/-rs</b> (<i>cliēns</i>).</p>",
  formation: "<p>Same endings as <i>rēx</i> except gen. pl. <i>-ium</i> and acc. pl. <i>-ēs</i> or <i>-īs</i>. A few have accusative singular <i>-im</i> and ablative <i>-ī</i>: <i>turris, sitis, tussis, vīs</i>, and river names (<i>Tiberim, Tiberī</i>); <i>nāvis, ignis</i> have optional abl. <i>-ī</i>.</p>",
  rows: {
    "NOM S": { ex: "Cīvis Rōmānus sum.", en: "I am a Roman citizen.", note: "predicate nominative" },
    "GEN S": { ex: "Domus cīvis incēnsa est.", en: "The citizen's house was burnt.", note: "possession" },
    "DAT S": { ex: "Cīvī bonō patria cāra est.", en: "To a good citizen the fatherland is dear.", note: "dative of reference" },
    "ACC S": { ex: "Cōnsul cīvem dēfendit.", en: "The consul defends the citizen.", note: "direct object" },
    "ABL S": { ex: "Ā cīve accūsātus est.", en: "He was accused by a citizen.", note: "agent" },
    "VOC S": { ex: "Cīvis, lēgibus pārē!", en: "Citizen, obey the laws!", note: "address" },
    "NOM P": { ex: "Cīvēs in forum conveniunt.", en: "The citizens gather in the forum.", note: "subject" },
    "GEN P": { ex: "Salūs cīvium suprēma lēx est.", en: "The safety of the citizens is the highest law.", note: "possession, i-stem gen. pl. -ium" },
    "DAT P": { ex: "Cīvibus pānem dīvīsit.", en: "He distributed bread to the citizens.", note: "indirect object" },
    "ACC P": { ex: "Cīvēs (cīvīs) ad arma vocat.", en: "He calls the citizens to arms.", note: "direct object, -ēs or -īs" },
    "ABL P": { ex: "Cum cīvibus cōnsilium cēpit.", en: "He made a plan with the citizens.", note: "accompaniment" },
    "VOC P": { ex: "Cīvēs, lībertātem servāte!", en: "Citizens, preserve liberty!", note: "address" },
  },
  tips: ["The -ium genitive plural is the tell-tale sign: <i>cīvium, urbium, noctium, hostium, partium</i>.", "Exceptions among same-syllable nouns: <i>pater, māter, frāter, senex, iuvenis, canis, sēdēs, vātēs</i> have <i>-um</i>.", "<i>vīs</i> (force) is irregular: <i>vīs, vim, vī</i>; pl. <i>vīrēs, vīrium, vīribus</i>."],
  related: ["N-3-M", "N-3-F", "N-3-N-I", "ADJ-3-2"]
};

PACKS["N-3-N-I"] = {
  id: "N-3-N-I", title: "Third declension neuter i-stems (mare, animal, exemplar)", pos: "N",
  model: { hw: "mare", parts: "mare, maris", gender: "n.", gloss: "sea" },
  modelEntry: { s: ["mar", "mar"], p: "N", c: [3, 4], g: "N", k: "T" },
  intro: "<p>Neuter nouns ending in <b>-e, -al, -ar</b> (<i>mare, animal, exemplar, vectīgal, calcar</i>) are i-stems. They show the i in three places: ablative singular <b>-ī</b> (<i>marī</i>), nominative/accusative plural <b>-ia</b> (<i>maria</i>), genitive plural <b>-ium</b> (<i>marium</i>, rare). Otherwise they decline like <i>corpus</i>.</p>",
  formation: "<p>Sg.: <i>mare, maris, marī, mare, marī</i>; pl.: <i>maria, marium, maribus, maria, maribus</i>. Words in -al/-ar have lost a final -e: <i>animal</i> (= animāle), hence the long vowel in <i>animālis</i>.</p>",
  rows: {
    "NOM S": { ex: "Mare tranquillum est.", en: "The sea is calm.", note: "subject" },
    "GEN S": { ex: "Fluctūs maris nāvem iactant.", en: "The waves of the sea toss the ship.", note: "possession" },
    "DAT S": { ex: "Neptūnus marī imperat.", en: "Neptune commands the sea.", note: "dative with imperō" },
    "ACC S": { ex: "Nautae mare trānsiērunt.", en: "The sailors crossed the sea.", note: "direct object (= nominative)" },
    "ABL S": { ex: "Marī terrāque pugnātum est.", en: "There was fighting by sea and land.", note: "ablative of place, i-stem -ī" },
    "VOC S": { ex: "Ō mare immēnsum!", en: "O boundless sea!", note: "exclamation" },
    "NOM P": { ex: "Maria multōs terrent.", en: "The seas frighten many.", note: "neuter plural -ia" },
    "GEN P": { ex: "Deus marium Neptūnus est.", en: "Neptune is the god of the seas.", note: "possession, gen. pl. -ium" },
    "DAT P": { ex: "Flūmina maribus aquam dant.", en: "Rivers give water to the seas.", note: "indirect object" },
    "ACC P": { ex: "Omnia maria nāvigāvit.", en: "He sailed all the seas.", note: "direct object -ia" },
    "ABL P": { ex: "In maribus multa animālia vīvunt.", en: "Many animals live in the seas.", note: "place where" },
    "VOC P": { ex: "Maria, quiēscite!", en: "Seas, be still!", note: "address" },
  },
  tips: ["Remember the triad <i>-ī, -ia, -ium</i> for neuter i-stems.", "<i>mare</i> itself has ablative <i>marī</i> (poetic <i>mare</i>) and a rare genitive plural."],
  related: ["N-3-N", "N-3-I", "ADJ-3-2"]
};

PACKS["N-4-M"] = {
  id: "N-4-M", title: "Fourth declension, masculine (-us, -ūs)", pos: "N",
  model: { hw: "frūctus", parts: "frūctus, frūctūs", gender: "m.", gloss: "fruit, profit" },
  modelEntry: { s: ["fruct", "fruct"], p: "N", c: [4, 1], g: "M", k: "T" },
  intro: "<p>Fourth-declension nouns have nominative <b>-us</b> and genitive <b>-ūs</b> (long u). Most are masculine (<i>frūctus, exercitus, senātus, metus, portus, cāsus</i>); <i>manus, domus, tribus, Īdūs, porticus</i> are feminine; <i>cornū, genū</i> are neuter. The characteristic vowel <b>u</b> runs through the whole declension.</p>",
  formation: "<p>Sg.: <i>-us, -ūs, -uī, -um, -ū</i>; pl.: <i>-ūs, -uum, -ibus, -ūs, -ibus</i>. Because nominative -us is short and genitive/plural -ūs is long, texts without macrons leave <i>fructus</i> ambiguous between nom. sg., gen. sg., nom. pl. and acc. pl. A few nouns have dat./abl. pl. <i>-ubus</i> (<i>artubus, tribubus, lacubus</i>). Do not confuse with 2nd-declension -us (gen. -ī).</p>",
  rows: {
    "NOM S": { ex: "Frūctus arboris dulcis est.", en: "The fruit of the tree is sweet.", note: "subject" },
    "GEN S": { ex: "Sapor frūctūs mē dēlectat.", en: "The taste of the fruit delights me.", note: "possession, gen. -ūs" },
    "DAT S": { ex: "Frūctuī suō cōnfīdit.", en: "He relies on his profit.", note: "dative with cōnfīdō" },
    "ACC S": { ex: "Frūctum ex arbore carpit.", en: "She picks the fruit from the tree.", note: "direct object" },
    "ABL S": { ex: "Frūctū labōris gaudet.", en: "He rejoices in the fruit of his labour.", note: "ablative with gaudeō" },
    "VOC S": { ex: "Ō frūctus optātus!", en: "O longed-for fruit!", note: "exclamation" },
    "NOM P": { ex: "Frūctūs autumnō mātūrēscunt.", en: "Fruits ripen in autumn.", note: "subject, -ūs" },
    "GEN P": { ex: "Cōpia frūctuum magna est.", en: "The supply of fruits is great.", note: "possession, gen. pl. -uum" },
    "DAT P": { ex: "Imber frūctibus prōdest.", en: "Rain is good for the fruits.", note: "dative with prōsum" },
    "ACC P": { ex: "Frūctūs in forō vēndunt.", en: "They sell fruits in the market.", note: "direct object" },
    "ABL P": { ex: "Frūctibus vīvunt.", en: "They live on fruits.", note: "ablative of means" },
    "VOC P": { ex: "Frūctūs, crēscite!", en: "Fruits, grow!", note: "address" },
  },
  tips: ["Many 4th-declension nouns are formed from the supine of verbs: <i>cāsus</i> (cadō), <i>mōtus</i> (moveō), <i>adventus</i> (adveniō), <i>exercitus</i>.", "<i>domus</i> mixes 4th and 2nd: <i>domus, domūs/domī, domuī/domō, domum, domō; domūs, domuum/domōrum, domibus, domōs/domūs</i>; locative <i>domī</i> at home.", "<i>senātus</i> has genitive <i>senātūs</i> or (older) <i>senātī</i>."],
  related: ["N-4-F", "N-4-N", "N-2-M"]
};

PACKS["N-4-F"] = {
  id: "N-4-F", title: "Fourth declension, feminine (manus, domus)", pos: "N",
  model: { hw: "manus", parts: "manus, manūs", gender: "f.", gloss: "hand" },
  modelEntry: { s: ["man", "man"], p: "N", c: [4, 1], g: "F", k: "T" },
  intro: "<p><i>Manus</i> hand (also band of men), <i>domus</i> house, <i>tribus</i> tribe, <i>porticus</i> colonnade, <i>Īdūs</i> the Ides, <i>acus</i> needle and <i>anus</i> old woman are <b>feminine</b> fourth-declension nouns. They decline like <i>frūctus</i>; only agreeing adjectives show the gender: <i>manus dextra</i>, <i>manūs ambae</i>.</p>",
  formation: "<p>Identical to frūctus. <i>Manus</i> is one of the commonest nouns in Latin; <i>manū</i> (abl.) is frequent in phrases such as <i>manū tenēre</i>, <i>in manū esse</i>.</p>",
  rows: {
    "NOM S": { ex: "Manus dextra gladium tenet.", en: "The right hand holds the sword.", note: "subject with feminine adjective" },
    "GEN S": { ex: "Digitī manūs quīnque sunt.", en: "The fingers of the hand are five.", note: "possession, gen. -ūs" },
    "DAT S": { ex: "Anulum manuī aptāvit.", en: "She fitted the ring to her hand.", note: "dative with a compound verb" },
    "ACC S": { ex: "Manum amīcō dedit.", en: "He gave his hand to his friend.", note: "direct object" },
    "ABL S": { ex: "Manū suā epistulam scrīpsit.", en: "He wrote the letter with his own hand.", note: "ablative of means" },
    "VOC S": { ex: "Ō manus fortis!", en: "O brave hand!", note: "exclamation" },
    "NOM P": { ex: "Manūs eius tremunt.", en: "His hands are trembling.", note: "subject" },
    "GEN P": { ex: "Opus manuum nostrārum vidēs.", en: "You see the work of our hands.", note: "possession, gen. pl. -uum" },
    "DAT P": { ex: "Manibus parcit.", en: "He spares his hands.", note: "dative with parcō" },
    "ACC P": { ex: "Manūs ad caelum tollit.", en: "He raises his hands to the sky.", note: "direct object" },
    "ABL P": { ex: "Manibus pedibusque pugnant.", en: "They fight with hands and feet.", note: "ablative of means" },
    "VOC P": { ex: "Manūs, labōrāte!", en: "Hands, work!", note: "address" },
  },
  tips: ["<i>manus</i> also means a band or troop: <i>manus mīlitum</i>.", "<i>domus</i> (f.) has mixed forms and the locative <i>domī</i> 'at home', <i>domum</i> 'homewards', <i>domō</i> 'from home'."],
  related: ["N-4-M", "N-4-N"]
};

PACKS["N-4-N"] = {
  id: "N-4-N", title: "Fourth declension, neuter (cornū, genū)", pos: "N",
  model: { hw: "cornū", parts: "cornū, cornūs", gender: "n.", gloss: "horn; wing of an army" },
  modelEntry: { s: ["corn", "corn"], p: "N", c: [4, 2], g: "N", k: "T" },
  intro: "<p>Only a handful of neuters belong to the fourth declension: <i>cornū</i> horn, <i>genū</i> knee, <i>verū</i> spit, <i>pecū</i> cattle. They end in <b>-ū</b> in nominative, accusative, vocative, dative and ablative singular, and in <b>-ua</b> in the plural nominative/accusative/vocative.</p>",
  formation: "<p>Sg.: <i>cornū, cornūs, cornū, cornū, cornū</i>; pl.: <i>cornua, cornuum, cornibus, cornua, cornibus</i>.</p>",
  rows: {
    "NOM S": { ex: "Cornū dextrum hostium cessit.", en: "The enemy's right wing gave way.", note: "subject (military sense)" },
    "GEN S": { ex: "Sonus cornūs audītur.", en: "The sound of the horn is heard.", note: "possession" },
    "DAT S": { ex: "Cornū sinistrō auxilium mīsit.", en: "He sent help to the left wing.", note: "indirect object" },
    "ACC S": { ex: "Taurus cornū hominem petit.", en: "The bull attacks the man with its horn.", note: "cornū here = ablative of means" },
    "ABL S": { ex: "Cornū signum datum est.", en: "The signal was given with the horn.", note: "ablative of means" },
    "VOC S": { ex: "Ō cornū sonōrum!", en: "O resounding horn!", note: "exclamation" },
    "NOM P": { ex: "Cornua cervī magna sunt.", en: "The stag's horns are large.", note: "neuter plural -ua" },
    "GEN P": { ex: "Vīs cornuum terribilis est.", en: "The force of the horns is terrible.", note: "possession, gen. pl. -uum" },
    "DAT P": { ex: "Cornibus fīdit taurus.", en: "The bull trusts in its horns.", note: "dative with fīdō" },
    "ACC P": { ex: "Cornua ad caelum tollit.", en: "He raises his horns to the sky.", note: "direct object" },
    "ABL P": { ex: "Cornibus pugnant arietēs.", en: "Rams fight with their horns.", note: "ablative of means" },
    "VOC P": { ex: "Cornua, sonāte!", en: "Horns, sound!", note: "address" },
  },
  tips: ["The one form <i>cornū</i> covers five cases in the singular; the plural shows the case clearly.", "<i>genū</i> knee is equally common in poetry: <i>genua</i> knees, <i>genibus</i> on one's knees."],
  related: ["N-4-M", "N-3-N"]
};

PACKS["N-5-F"] = {
  id: "N-5-F", title: "Fifth declension (rēs, fidēs, spēs)", pos: "N",
  model: { hw: "rēs", parts: "rēs, reī", gender: "f.", gloss: "thing, matter, affair" },
  modelEntry: { s: ["r", "r"], p: "N", c: [5, 1], g: "F", k: "T" },
  intro: "<p>The fifth declension is the smallest: nominative <b>-ēs</b>, genitive <b>-ēī</b> (after a vowel: <i>diēī</i>) or <b>-eī</b> (after a consonant: <i>reī, fideī, speī</i>). All are feminine except <i>diēs</i> day (m., sometimes f. for a fixed day) and <i>merīdiēs</i> midday (m.). Only <i>rēs</i> and <i>diēs</i> have a complete plural.</p>",
  formation: "<p>Sg.: <i>-ēs, -ēī/-eī, -ēī/-eī, -em, -ē</i>; pl.: <i>-ēs, -ērum, -ēbus, -ēs, -ēbus</i>. The vowel <b>ē</b> runs throughout except the accusative singular (<i>rem, diem</i>).</p>",
  rows: {
    "NOM S": { ex: "Rēs difficilis est.", en: "The matter is difficult.", note: "subject" },
    "GEN S": { ex: "Fīnis reī nōn appāret.", en: "The end of the affair is not in sight.", note: "possession, gen. -eī" },
    "DAT S": { ex: "Reī pūblicae sē dēvōvit.", en: "He devoted himself to the republic.", note: "dative with dēvoveō" },
    "ACC S": { ex: "Rem tōtam nārrāvit.", en: "He told the whole story.", note: "direct object" },
    "ABL S": { ex: "Dē rē pūblicā disputant.", en: "They argue about the state.", note: "dē + ablative" },
    "VOC S": { ex: "Ō rēs mīra!", en: "O amazing thing!", note: "exclamation" },
    "NOM P": { ex: "Rēs adversae virtūtem probant.", en: "Adversities test courage.", note: "subject" },
    "GEN P": { ex: "Rērum nātūra mīrābilis est.", en: "The nature of things is wonderful.", note: "possession, gen. pl. -ērum" },
    "DAT P": { ex: "Rēbus futūrīs prōvidet.", en: "He provides for future events.", note: "dative with prōvideō" },
    "ACC P": { ex: "Rēs gestās Rōmānōrum legimus.", en: "We read the deeds of the Romans.", note: "direct object" },
    "ABL P": { ex: "In rēbus adversīs fortis est.", en: "In adversity he is brave.", note: "place / circumstance" },
    "VOC P": { ex: "Ō rēs hūmānae!", en: "O human affairs!", note: "exclamation" },
  },
  tips: ["<i>rēs</i> is a chameleon: thing, matter, affair, property, the state (<i>rēs pūblica</i>), fact, deed (<i>rēs gestae</i>).", "<i>fidēs, spēs, aciēs, speciēs, faciēs</i> normally lack plural genitive, dative and ablative.", "Genitive and dative singular are identical (<i>reī</i>), as in the 1st declension."],
  related: ["N-5-M", "N-3-F"]
};

PACKS["N-5-M"] = {
  id: "N-5-M", title: "Fifth declension, masculine (diēs)", pos: "N",
  model: { hw: "diēs", parts: "diēs, diēī", gender: "m.", gloss: "day" },
  modelEntry: { s: ["di", "di"], p: "N", c: [5, 1], g: "M", k: "T" },
  intro: "<p><i>Diēs</i> day and its compound <i>merīdiēs</i> midday are the masculine members of the fifth declension (<i>diēs</i> is occasionally feminine in the sense of an appointed day). Because the stem ends in a vowel, the genitive and dative singular are <b>-ēī</b> with a long e: <i>diēī</i>.</p>",
  formation: "<p>Sg.: <i>diēs, diēī, diēī, diem, diē</i>; pl.: <i>diēs, diērum, diēbus, diēs, diēbus</i>. Common phrases: <i>in diēs</i> day by day, <i>diē nocteque</i>, <i>multō diē</i> late in the day, <i>hodiē</i> (= hōc diē) today, <i>prīdiē, postrīdiē</i>.</p>",
  rows: {
    "NOM S": { ex: "Diēs longus est aestāte.", en: "The day is long in summer.", note: "subject with masculine adjective" },
    "GEN S": { ex: "Prīmā hōrā diēī surgit.", en: "He rises at the first hour of the day.", note: "possession, gen. -ēī" },
    "DAT S": { ex: "Diēī certō opus dēstināvit.", en: "He assigned the work to a fixed day.", note: "indirect object" },
    "ACC S": { ex: "Tōtum diem labōrat.", en: "He works the whole day.", note: "accusative of duration" },
    "ABL S": { ex: "Tertiō diē rediit.", en: "He returned on the third day.", note: "ablative of time when" },
    "VOC S": { ex: "Ō diēs fēlīx!", en: "O happy day!", note: "exclamation" },
    "NOM P": { ex: "Diēs hiemis brevēs sunt.", en: "The days of winter are short.", note: "subject" },
    "GEN P": { ex: "Numerus diērum incertus est.", en: "The number of days is uncertain.", note: "possession, gen. pl. -ērum" },
    "DAT P": { ex: "Diēbus fēstīs nōn labōrāmus.", en: "On festival days we do not work.", note: "ablative/dative plural -ēbus (here time when)" },
    "ACC P": { ex: "Paucōs diēs exspectā.", en: "Wait a few days.", note: "accusative of duration" },
    "ABL P": { ex: "Paucīs diēbus revertit.", en: "He came back within a few days.", note: "ablative of time within which" },
    "VOC P": { ex: "Ō diēs beātī!", en: "O blessed days!", note: "exclamation" },
  },
  tips: ["Nominative and accusative plural are both <i>diēs</i>, like the nominative singular.", "<i>merīdiēs</i> (midday, south) is the only other masculine; <i>rēs</i> and the rest are feminine."],
  related: ["N-5-F"]
};

PACKS["N-INDECL"] = {
  id: "N-INDECL", title: "Indeclinable nouns (fās, nefās, nihil, instar)", pos: "N",
  model: { hw: "nihil", parts: "nihil", gender: "n.", gloss: "nothing" },
  modelEntry: { s: ["nihil"], p: "N", c: [9, 9], g: "N", k: "T" },
  intro: "<p>A few nouns never change form: <i>fās</i> (divine) right, <i>nefās</i> wrong, <i>nihil / nīl</i> nothing, <i>instar</i> likeness, <i>mane</i> morning, the letters of the alphabet, and foreign names and words (<i>Adam, Iēsūs</i> partly, Hebrew words). They are neuter and used mainly as subject or object; other relations are expressed by prepositions or by a related declinable word (<i>nihil</i> → gen. <i>nūllīus reī</i>, abl. <i>nūllā rē</i>).</p>",
  formation: "<p>No endings. <i>nihil</i> also appears as <i>nihilum, -ī</i> (2nd decl.) in <i>nihilī</i> of no value, <i>nihilō</i> by nothing, <i>ad nihilum</i>.</p>",
  rows: {
    "NOM S": { ex: "Nihil novī est sub sōle.", en: "There is nothing new under the sun.", note: "subject + partitive genitive" },
    "ACC S": { ex: "Nihil timeō.", en: "I fear nothing.", note: "direct object" },
    "GEN S": { ex: "Nihilī est.", en: "It is worth nothing.", note: "genitive of value from nihilum" },
    "ABL S": { ex: "Nihilō minus perseverat.", en: "Nonetheless he perseveres.", note: "ablative of degree of difference from nihilum" },
  },
  tips: ["<i>nihil</i> is also used adverbially: <i>nihil cūrō</i> I care not at all.", "<i>fās est</i> + infinitive: it is right to …"],
  related: ["N-2-N"]
};

PACKS["N-GREEK"] = {
  id: "N-GREEK", title: "Greek nouns (Aenēās, Dīdō, Achillēs)", pos: "N",
  model: { hw: "Aenēās", parts: "Aenēās, Aenēae", gender: "m.", gloss: "Aeneas" },
  modelEntry: { s: ["Aene", "Aene"], p: "N", c: [1, 7], g: "M", k: "N" },
  intro: "<p>Greek names and loanwords often keep some Greek endings, especially in poetry: 1st declension <i>Aenēās, -ae, -ae, -ān (-am), -ā; Anchīsēs, -ae, -ae, -ēn, -ē (voc. -ē/-ā); Pēnelopē, -ēs, -ae, -ēn, -ē</i>; 2nd declension <i>Dēlos, -ī</i> (acc. <i>Dēlon</i>), <i>Īlion</i> (n.); 3rd declension <i>Achillēs</i> (acc. <i>Achillem/Achillēn</i>), <i>Dīdō, Dīdōnis</i> or <i>Dīdūs</i>, <i>Orpheus</i> (voc. <i>Orpheu</i>), <i>Sōcratēs</i> (gen. <i>Sōcratis/Sōcratī</i>). Prose authors usually latinise them fully.</p>",
  formation: "<p>The app shows the Latin and Greek endings that Whitaker's data records for each name; expect variation between authors.</p>",
  rows: {
    "NOM S": { ex: "Aenēās Trōiā fūgit.", en: "Aeneas fled from Troy.", note: "subject" },
    "GEN S": { ex: "Fīlius Aenēae Ascanius erat.", en: "Aeneas' son was Ascanius.", note: "possession" },
    "DAT S": { ex: "Venus Aenēae apparuit.", en: "Venus appeared to Aeneas.", note: "indirect object" },
    "ACC S": { ex: "Dīdō Aenēān amāvit.", en: "Dido loved Aeneas.", note: "Greek accusative -ān" },
    "ABL S": { ex: "Dē Aenēā Vergilius canit.", en: "Vergil sings of Aeneas.", note: "dē + ablative" },
    "VOC S": { ex: "Aenēā, quid agis?", en: "Aeneas, what are you doing?", note: "vocative -ā" },
  },
  tips: ["Greek accusatives in -ān, -ēn, -a (<i>āera</i> air) and nominatives in -os/-on are frequent in Vergil and Ovid.", "Dictionaries usually give both the Greek and the Latin form."],
  related: ["N-1-F", "N-3-M"]
};

/* ---------------- adjectives ---------------- */

PACKS["ADJ-1-2"] = {
  id: "ADJ-1-2", title: "Adjectives of the 1st/2nd declension (bonus, -a, -um)", pos: "ADJ",
  model: { hw: "bonus", parts: "bonus, bona, bonum", gloss: "good" },
  modelEntry: { s: ["bon", "bon", "meli", "optim"], p: "ADJ", c: [1, 1], k: "X" },
  intro: "<p>Most Latin adjectives decline like <i>amīcus</i> (masculine), <i>puella</i> (feminine) and <i>bellum</i> (neuter): <i>bonus, bona, bonum</i>. The dictionary gives the three nominatives (<i>-us, -a, -um</i>). An adjective <b>agrees</b> with its noun in gender, number and case, not necessarily in ending: <i>nauta bonus</i> (masculine noun of the 1st declension), <i>manus bona</i> (feminine noun of the 4th).</p><p>Comparison: comparative <i>-ior, -ius</i> (<i>melior, melius</i> is irregular for bonus), superlative <i>-issimus</i> (<i>optimus</i>).</p>",
  formation: "<p>Masculine like amīcus (voc. sg. <i>bone</i>), feminine like puella (abl. <i>bonā</i>), neuter like bellum (pl. <i>bona</i>). Adjectives in <i>-ius</i> (<i>ēgregius</i>) have genitive <i>-iī</i> and vocative <i>-ie</i>, unlike nouns.</p>",
  rows: {
    "POS NOM S M": { ex: "Vir bonus est.", en: "He is a good man.", note: "predicate adjective agreeing with subject" },
    "POS GEN S M": { ex: "Fīlius bonī patris est.", en: "He is the son of a good father.", note: "agreement in the genitive" },
    "POS DAT S F": { ex: "Bonae puellae dōnum dō.", en: "I give a gift to the good girl.", note: "indirect object" },
    "POS ACC S N": { ex: "Bonum cōnsilium capit.", en: "He adopts a good plan.", note: "direct object" },
    "POS ABL S F": { ex: "Cum bonā spē venit.", en: "He comes with good hope.", note: "cum + ablative" },
    "POS VOC S M": { ex: "Bone amīce, salvē!", en: "Good friend, hello!", note: "vocative -e" },
    "POS NOM P M": { ex: "Bonī cīvēs lēgibus pārent.", en: "Good citizens obey the laws.", note: "adjective with a 3rd-declension noun" },
    "POS GEN P F": { ex: "Memoria bonārum rērum iūvat.", en: "The memory of good things helps.", note: "agreement with rēs" },
    "POS DAT P N": { ex: "Bonīs operibus studet.", en: "He is devoted to good works.", note: "dative with studeō" },
    "POS ACC P M": { ex: "Bonōs amīcōs habet.", en: "He has good friends.", note: "direct object" },
    "POS ABL P F": { ex: "Bonīs artibus flōret.", en: "He flourishes through good skills.", note: "ablative of means" },
    "POS VOC P M": { ex: "Bonī virī, audīte!", en: "Good men, listen!", note: "address" },
    "POS NOM S N": { ex: "Bonum est tacēre.", en: "It is good to be silent.", note: "neuter as abstract noun" },
    "COMP NOM S M": { ex: "Hic liber melior est quam ille.", en: "This book is better than that one.", note: "comparison with quam" },
    "COMP ACC S N": { ex: "Nihil melius invēnī.", en: "I have found nothing better.", note: "neuter comparative -ius" },
    "COMP ABL S M": { ex: "Meliōre cōnsiliō ūsus est.", en: "He used a better plan.", note: "comparative abl. sg. -e" },
    "COMP GEN P M": { ex: "Iūdicium meliōrum sequor.", en: "I follow the judgement of better men.", note: "comparative gen. pl. -um" },
    "SUPER NOM S M": { ex: "Optimus cīvis erat.", en: "He was the best citizen.", note: "superlative" },
    "SUPER ACC P F": { ex: "Optimās rēs ēlēgit.", en: "He chose the best things.", note: "superlative agreeing with rēs" },
    "SUPER ABL S N": { ex: "Optimō animō venit.", en: "He comes with the best of intentions.", note: "ablative of manner" },
  },
  tips: ["Agreement is in gender/number/case, not spelling: <i>poēta clārus</i>, <i>diēs longus</i>, <i>manus parva</i>.", "Neuter plural adjectives are often used as nouns: <i>bona</i> goods, <i>multa</i> many things, <i>omnia</i> everything.", "The comparative declines like a 3rd-declension consonant stem (<i>meliōris, meliōre, meliōrum</i>), the superlative like bonus itself.", "The ablative singular feminine <i>bonā</i> is long; the nominative <i>bona</i> short."],
  related: ["ADJ-1-2-ER", "ADJ-PRONOMINAL", "ADJ-COMP", "ADJ-SUPER", "N-2-M"]
};

PACKS["ADJ-1-2-ER"] = {
  id: "ADJ-1-2-ER", title: "Adjectives in -er (pulcher, līber, miser)", pos: "ADJ",
  model: { hw: "pulcher", parts: "pulcher, pulchra, pulchrum", gloss: "beautiful" },
  modelEntry: { s: ["pulcher", "pulchr", "pulchri", "pulcherri"], p: "ADJ", c: [1, 2], k: "X" },
  intro: "<p>Some first/second-declension adjectives have a masculine nominative in <b>-er</b> with no ending. Like the nouns <i>puer</i> and <i>ager</i>, they split into those that keep the e (<i>līber, lībera, līberum; miser; tener; asper; prosper</i>) and those that drop it (<i>pulcher, pulchra, pulchrum; sacer, sacra; niger; ruber; aeger; piger; integer; dexter</i>). The feminine shows which.</p><p>All adjectives in -er form the superlative with <b>-errimus</b>: <i>pulcherrimus, līberrimus, miserrimus</i>.</p>",
  formation: "<p>Masculine like puer/ager (voc. = nom. <i>pulcher</i>); feminine <i>pulchra</i>, neuter <i>pulchrum</i> regular. Comparative <i>pulchrior, pulchrius</i>.</p>",
  rows: {
    "POS NOM S M": { ex: "Hortus pulcher est.", en: "The garden is beautiful.", note: "predicate" },
    "POS NOM S F": { ex: "Puella pulchra cantat.", en: "The beautiful girl is singing.", note: "feminine shows the stem pulchr-" },
    "POS NOM S N": { ex: "Templum pulchrum vidēmus.", en: "We see a beautiful temple.", note: "neuter" },
    "POS GEN S F": { ex: "Vōx pulchrae puellae audītur.", en: "The beautiful girl's voice is heard.", note: "agreement" },
    "POS DAT S M": { ex: "Pulchrō iuvenī flōrem dat.", en: "She gives a flower to the handsome youth.", note: "indirect object" },
    "POS ACC S M": { ex: "Equum pulchrum ēmit.", en: "He bought a beautiful horse.", note: "direct object" },
    "POS ABL S F": { ex: "In pulchrā urbe vīvit.", en: "He lives in a beautiful city.", note: "place where" },
    "POS NOM P N": { ex: "Pulchra sunt verba poētae.", en: "The poet's words are beautiful.", note: "neuter plural" },
    "POS GEN P M": { ex: "Fāma pulchrōrum hortōrum manet.", en: "The fame of the beautiful gardens remains.", note: "possession" },
    "POS ACC P F": { ex: "Pulchrās rosās carpit.", en: "She picks beautiful roses.", note: "direct object" },
    "POS ABL P M": { ex: "Pulchrīs carminibus dēlectātur.", en: "He is delighted by beautiful songs.", note: "ablative of means" },
    "COMP NOM S F": { ex: "Haec urbs pulchrior est quam illa.", en: "This city is more beautiful than that one.", note: "comparative" },
    "SUPER NOM S F": { ex: "Rōma urbs pulcherrima est.", en: "Rome is the most beautiful city.", note: "superlative -errimus" },
  },
  tips: ["<i>līber</i> (free) keeps the e: <i>lībera, līberum</i>; <i>liber</i> (book) is a noun — note the different vowel length.", "<i>dexter</i> has <i>dextra</i> or <i>dextera</i>; <i>sinister</i> drops the e: <i>sinistra</i>.", "Superlatives in -errimus are the rule for every -er adjective, including the 3rd-declension <i>ācer, celer</i>."],
  related: ["ADJ-1-2", "N-2-ER", "ADJ-3-3"]
};

PACKS["ADJ-PRONOMINAL"] = {
  id: "ADJ-PRONOMINAL", title: "Pronominal adjectives (ūnus, sōlus, tōtus, nūllus, alius …)", pos: "ADJ",
  model: { hw: "sōlus", parts: "sōlus, sōla, sōlum", gloss: "alone, only" },
  modelEntry: { s: ["sol", "sol"], p: "ADJ", c: [1, 3], k: "POS" },
  intro: "<p>Nine adjectives of the 1st/2nd declension have pronoun-like endings in the <b>genitive singular -īus</b> and <b>dative singular -ī</b> for all three genders. The traditional mnemonic is <b>UNUS NAUTA</b>: <i>ūnus</i> one, <i>nūllus</i> no, <i>ūllus</i> any, <i>sōlus</i> alone, <i>neuter</i> neither, <i>alius</i> other (gen. <i>alterīus</i> borrowed, n. <i>aliud</i>), <i>uter</i> which of two, <i>tōtus</i> whole, <i>alter</i> the other (gen. <i>alterīus</i>). Everywhere else they decline like <i>bonus</i>.</p>",
  formation: "<p><i>sōlus, sōla, sōlum</i>; gen. <i>sōlīus</i> (all genders); dat. <i>sōlī</i> (all genders); acc. <i>sōlum, sōlam, sōlum</i>; abl. <i>sōlō, sōlā, sōlō</i>; plural regular. <i>alius</i> and <i>alter</i> have neuter <i>aliud, alterum</i>; <i>uter, neuter, alter</i> drop the e (<i>utra, utrum</i>).</p>",
  rows: {
    "POS NOM S M": { ex: "Sōlus in hortō sedet.", en: "He sits alone in the garden.", note: "predicate adjective" },
    "POS GEN S F": { ex: "Sōlīus virtūtis memor est.", en: "He is mindful of virtue alone.", note: "pronominal genitive -īus" },
    "POS DAT S M": { ex: "Sōlī Caesarī pāruit.", en: "He obeyed Caesar alone.", note: "pronominal dative -ī" },
    "POS ACC S F": { ex: "Sōlam fīliam amat.", en: "He loves his only daughter.", note: "direct object" },
    "POS ABL S N": { ex: "Sōlō verbō eum mōvit.", en: "He moved him with a single word.", note: "ablative of means" },
    "POS NOM P M": { ex: "Sōlī Rōmānī restitērunt.", en: "The Romans alone resisted.", note: "plural regular" },
    "POS GEN P M": { ex: "Cōnsilium sōlōrum sapientium quaerit.", en: "He seeks the advice of the wise alone.", note: "plural regular" },
  },
  tips: ["<i>tōtīus urbis</i> of the whole city, <i>nūllī hominī</i> to no man, <i>alterī</i> to the other, <i>utrī</i> to which of the two.", "<i>alius … alius</i> = one … another; <i>aliī … aliī</i> = some … others; <i>alter … alter</i> = the one … the other (of two).", "<i>neuter</i> (neither) is the source of the grammatical term 'neuter'."],
  related: ["ADJ-1-2", "PRON-IS", "NUM"]
};

PACKS["ADJ-3-1"] = {
  id: "ADJ-3-1", title: "Third-declension adjectives of one termination (fēlīx, ingēns, sapiēns)", pos: "ADJ",
  model: { hw: "fēlīx", parts: "fēlīx, fēlīcis", gloss: "lucky, happy" },
  modelEntry: { s: ["felix", "felic", "felici", "felicissi"], p: "ADJ", c: [3, 1], k: "X" },
  intro: "<p>Third-declension adjectives have one nominative singular form for all genders (<i>fēlīx, ingēns, audāx, vetus, pauper, sapiēns</i>, and all present participles). The dictionary therefore gives nominative and <b>genitive</b>: <i>fēlīx, fēlīcis</i>. Masculine and feminine are identical throughout; the neuter differs only where neuters always differ (acc. sg. = nom.; nom./acc. pl. <b>-ia</b>).</p>",
  formation: "<p>They are i-stems: abl. sg. <b>-ī</b>, gen. pl. <b>-ium</b>, n. pl. <b>-ia</b>. Exceptions with consonant-stem forms (abl. -e, gen. pl. -um, n. pl. -a): <i>vetus</i> (<i>vetere, veterum, vetera</i>), <i>pauper, dīves</i> (<i>dīvite, dīvitum</i>), <i>prīnceps, memor, compos, particeps</i>, and comparatives. Present participles used as participles take abl. <i>-e</i> (<i>amante</i>), used as adjectives <i>-ī</i> (<i>amantī</i>).</p>",
  rows: {
    "POS NOM S M": { ex: "Vir fēlīx est.", en: "The man is fortunate.", note: "one form for m., f., n." },
    "POS NOM S F": { ex: "Fēlīx fuit illa diēs.", en: "That was a happy day.", note: "same form, feminine" },
    "POS GEN S M": { ex: "Fortūna hominis fēlīcis mūtābilis est.", en: "The fortune of a lucky man is changeable.", note: "genitive -is" },
    "POS DAT S F": { ex: "Fēlīcī mātrī grātulantur.", en: "They congratulate the happy mother.", note: "dative -ī" },
    "POS ACC S M": { ex: "Fēlīcem amīcum vidēmus.", en: "We see our fortunate friend.", note: "accusative -em" },
    "POS ACC S N": { ex: "Fēlīx ōmen accēpit.", en: "He received a lucky omen.", note: "neuter acc. = nom." },
    "POS ABL S F": { ex: "Fēlīcī fortūnā ūsus est.", en: "He enjoyed good fortune.", note: "ablative -ī (i-stem)" },
    "POS NOM P M": { ex: "Fēlīcēs sunt quī sapiunt.", en: "Happy are those who are wise.", note: "nom. pl. -ēs" },
    "POS NOM P N": { ex: "Fēlīcia tempora erant.", en: "The times were happy.", note: "neuter plural -ia" },
    "POS GEN P M": { ex: "Vīta fēlīcium brevis vidētur.", en: "The life of the fortunate seems short.", note: "gen. pl. -ium" },
    "POS DAT P F": { ex: "Fēlīcibus puellīs dōna dant.", en: "They give gifts to the happy girls.", note: "dat./abl. pl. -ibus" },
    "POS ACC P M": { ex: "Deī fēlīcēs hominēs amant.", en: "The gods love fortunate men.", note: "acc. pl. -ēs (or -īs)" },
    "COMP NOM S M": { ex: "Nēmō fēlīcior est quam tū.", en: "No one is luckier than you.", note: "comparative -ior" },
    "SUPER NOM S F": { ex: "Fēlīcissima omnium erat.", en: "She was the happiest of all.", note: "superlative -issimus" },
  },
  tips: ["The adverb is formed with <i>-iter</i>: <i>fēlīciter</i> happily, <i>audācter</i> boldly; from -ns stems <i>-nter</i>: <i>sapienter</i>.", "Present participles (<i>amāns, amantis</i>) decline exactly like fēlīx.", "Comparatives (<i>fēlīcior, fēlīcius</i>) are NOT i-stems: <i>fēlīciōre, fēlīciōrum, fēlīciōra</i>."],
  related: ["ADJ-3-2", "ADJ-3-3", "ADJ-COMP", "N-3-M"]
};

PACKS["ADJ-3-2"] = {
  id: "ADJ-3-2", title: "Third-declension adjectives of two terminations (fortis, forte)", pos: "ADJ",
  model: { hw: "fortis", parts: "fortis, forte", gloss: "brave, strong" },
  modelEntry: { s: ["fort", "fort", "forti", "fortissi"], p: "ADJ", c: [3, 2], k: "X" },
  intro: "<p>The largest group of third-declension adjectives has two nominative forms: <b>-is</b> for masculine and feminine, <b>-e</b> for neuter (<i>fortis, forte; omnis, omne; brevis; gravis; levis; dulcis; facilis; similis; turpis; tristis</i>). They are i-stems throughout: abl. sg. <b>-ī</b>, gen. pl. <b>-ium</b>, n. pl. <b>-ia</b>.</p>",
  formation: "<p>m./f.: <i>fortis, fortis, fortī, fortem, fortī; fortēs, fortium, fortibus, fortēs (-īs), fortibus</i>. n.: <i>forte, fortis, fortī, forte, fortī; fortia, fortium, fortibus, fortia, fortibus</i>. Six adjectives in -lis form the superlative with <i>-limus</i>: <i>facillimus, difficillimus, similimus, dissimillimus, gracillimus, humillimus</i>.</p>",
  rows: {
    "POS NOM S M": { ex: "Mīles fortis pugnat.", en: "The brave soldier fights.", note: "m./f. form -is" },
    "POS NOM S N": { ex: "Forte cōnsilium cēpit.", en: "He adopted a bold plan.", note: "neuter -e" },
    "POS GEN S F": { ex: "Fāma fortis fēminae manet.", en: "The fame of the brave woman remains.", note: "genitive -is (= nom.)" },
    "POS DAT S M": { ex: "Fortī virō praemium dant.", en: "They give a reward to the brave man.", note: "dative -ī" },
    "POS ACC S F": { ex: "Fortem mātrem laudant.", en: "They praise the brave mother.", note: "accusative -em" },
    "POS ABL S M": { ex: "Cum fortī duce vincunt.", en: "With a brave leader they win.", note: "ablative -ī" },
    "POS NOM P M": { ex: "Fortēs fortūna adiuvat.", en: "Fortune helps the brave.", note: "nom. pl. -ēs; adjective as noun" },
    "POS NOM P N": { ex: "Fortia facta memorantur.", en: "Brave deeds are remembered.", note: "neuter plural -ia" },
    "POS GEN P M": { ex: "Glōria fortium aeterna est.", en: "The glory of the brave is eternal.", note: "gen. pl. -ium" },
    "POS DAT P F": { ex: "Fortibus fēminīs honōrem tribuit.", en: "He paid honour to the brave women.", note: "dat. pl. -ibus" },
    "POS ACC P M": { ex: "Fortēs mīlitēs dēlēgit.", en: "He chose brave soldiers.", note: "acc. pl. -ēs / -īs" },
    "POS ABL P N": { ex: "Fortibus factīs clārus est.", en: "He is famous for brave deeds.", note: "ablative of cause" },
    "COMP NOM S M": { ex: "Frāter fortior est quam soror.", en: "The brother is braver than the sister.", note: "comparative" },
    "SUPER NOM P M": { ex: "Rōmānī fortissimī erant.", en: "The Romans were the bravest.", note: "superlative" },
  },
  tips: ["<i>omnis, omne</i> (every, all) belongs here: <i>omnium</i> of all, <i>omnia</i> everything.", "Adverb: <i>fortiter</i> bravely, <i>breviter</i>, <i>graviter</i>; comparative adverb = neuter comparative <i>fortius</i>; superlative <i>fortissimē</i>.", "The accusative plural <i>-īs</i> (<i>omnīs, fortīs</i>) is common in classical texts beside <i>-ēs</i>."],
  related: ["ADJ-3-1", "ADJ-3-3", "N-3-I", "N-3-N-I"]
};

PACKS["ADJ-3-3"] = {
  id: "ADJ-3-3", title: "Third-declension adjectives of three terminations (ācer, ācris, ācre)", pos: "ADJ",
  model: { hw: "ācer", parts: "ācer, ācris, ācre", gloss: "sharp, keen, fierce" },
  modelEntry: { s: ["acer", "acr", "acri", "acerri"], p: "ADJ", c: [3, 3], k: "X" },
  intro: "<p>About a dozen adjectives in <b>-er</b> have three nominative singular forms: <i>ācer</i> (m.), <i>ācris</i> (f.), <i>ācre</i> (n.). Others: <i>celer, celeris, celere</i> swift; <i>alacer; celeber; equester; pedester; volucer; salūber; palūster; campester; terrester; silvester</i>, and the month adjectives <i>September, Octōber, November, December</i>. Apart from the masculine nominative they decline exactly like <i>fortis</i>.</p>",
  formation: "<p>Stem <i>ācr-</i>: gen. <i>ācris</i>, dat. <i>ācrī</i>, acc. <i>ācrem/ācre</i>, abl. <i>ācrī</i>; pl. <i>ācrēs/ācria, ācrium, ācribus</i>. Superlative <b>-errimus</b>: <i>ācerrimus, celerrimus</i>. <i>celer</i> keeps the e: <i>celeris, celere</i>, gen. pl. <i>celerum</i>.</p>",
  rows: {
    "POS NOM S M": { ex: "Ācer hostis urbem oppugnat.", en: "A fierce enemy attacks the city.", note: "masculine -er" },
    "POS NOM S F": { ex: "Ācris hiems erat.", en: "It was a sharp winter.", note: "feminine -is" },
    "POS NOM S N": { ex: "Ācre bellum gestum est.", en: "A fierce war was waged.", note: "neuter -e" },
    "POS GEN S M": { ex: "Vōx ācris ducis audītur.", en: "The voice of the fierce leader is heard.", note: "genitive -is" },
    "POS DAT S F": { ex: "Ācrī pugnae sē parant.", en: "They prepare for a fierce battle.", note: "dative -ī" },
    "POS ACC S M": { ex: "Ācrem equum domat.", en: "He tames the spirited horse.", note: "accusative -em" },
    "POS ABL S N": { ex: "Ācrī ingeniō praestat.", en: "He excels in keen intellect.", note: "ablative of respect, -ī" },
    "POS NOM P M": { ex: "Ācrēs mīlitēs impetum faciunt.", en: "The fierce soldiers make an attack.", note: "nom. pl. -ēs" },
    "POS NOM P N": { ex: "Ācria verba dīxit.", en: "He spoke sharp words.", note: "neuter plural -ia" },
    "POS GEN P M": { ex: "Clāmor ācrium hostium crēscit.", en: "The shouting of the fierce enemy grows.", note: "gen. pl. -ium" },
    "POS ABL P F": { ex: "Ācribus sagittīs pugnant.", en: "They fight with sharp arrows.", note: "ablative of means" },
    "COMP NOM S N": { ex: "Ferrum ācrius est quam lignum.", en: "Iron is sharper than wood.", note: "comparative neuter -ius" },
    "SUPER NOM S M": { ex: "Ācerrimus omnium erat.", en: "He was the keenest of all.", note: "superlative -errimus" },
  },
  tips: ["Only the masculine nominative singular distinguishes this type from fortis.", "<i>celer</i> is the exception that keeps its e everywhere: <i>celeris, celere, celerum</i>."],
  related: ["ADJ-3-2", "ADJ-1-2-ER"]
};

PACKS["ADJ-COMP"] = {
  id: "ADJ-COMP", title: "Comparative adjectives (fortior, fortius; melior; maior)", pos: "ADJ",
  model: { hw: "fortior", parts: "fortior, fortius", gloss: "braver, rather brave" },
  modelEntry: { s: ["fortior"], p: "ADJ", c: [0, 0], k: "COMP" },
  intro: "<p>The comparative is formed by adding <b>-ior</b> (m./f.) and <b>-ius</b> (n.) to the stem of the positive (genitive minus -ī/-is): <i>fortis → fortior, fortius; fēlīx → fēlīcior; pulcher → pulchrior</i>. Irregular: <i>bonus → melior, melius; malus → peior; magnus → maior; parvus → minor, minus; multus → plūs (n. noun), pl. plūrēs, plūra</i>. Adjectives in -eus/-ius use <i>magis</i>: <i>magis idōneus</i>.</p><p>Meaning: “-er / more”, but also “rather”, “too”, “somewhat” when nothing is compared: <i>senex loquācior</i> a rather talkative old man.</p>",
  formation: "<p>Comparatives decline as <b>consonant stems</b> of the 3rd declension (not i-stems): abl. sg. <b>-e</b> (<i>fortiōre</i>, poetic -ī), gen. pl. <b>-um</b> (<i>fortiōrum</i>), n. pl. <b>-a</b> (<i>fortiōra</i>). m./f.: <i>fortior, fortiōris, fortiōrī, fortiōrem, fortiōre; fortiōrēs, fortiōrum, fortiōribus</i>; n.: <i>fortius, fortiōris …; fortiōra</i>. <i>plūs</i> is irregular: sg. n. only <i>plūs, plūris, plūre</i>; pl. <i>plūrēs, plūra, plūrium, plūribus</i>.</p>",
  rows: {
    "COMP NOM S M": { ex: "Frāter meus fortior est quam ego.", en: "My brother is braver than I.", note: "comparison with quam (same case)" },
    "COMP NOM S N": { ex: "Fortius est pugnāre quam fugere.", en: "It is braver to fight than to flee.", note: "neuter -ius" },
    "COMP GEN S M": { ex: "Fortiōris mīlitis arma vidēs.", en: "You see the arms of a braver soldier.", note: "gen. -iōris" },
    "COMP DAT S F": { ex: "Fortiōrī fēminae praemium dedit.", en: "He gave a reward to the braver woman.", note: "dat. -iōrī" },
    "COMP ACC S M": { ex: "Fortiōrem ducem ēlēgērunt.", en: "They chose a braver leader.", note: "acc. -iōrem" },
    "COMP ABL S M": { ex: "Nēmō fortiōre animō erat.", en: "No one had a braver spirit.", note: "abl. -iōre (consonant stem)" },
    "COMP NOM P M": { ex: "Rōmānī fortiōrēs Gallīs erant.", en: "The Romans were braver than the Gauls.", note: "ablative of comparison without quam" },
    "COMP NOM P N": { ex: "Fortiōra facta nōn vīdī.", en: "I have not seen braver deeds.", note: "neuter plural -a (not -ia)" },
    "COMP GEN P M": { ex: "Glōria fortiōrum manet.", en: "The glory of the braver remains.", note: "gen. pl. -um (not -ium)" },
    "COMP DAT P F": { ex: "Fortiōribus mātribus grātiās ēgit.", en: "He thanked the braver mothers.", note: "dat./abl. pl. -ibus" },
    "COMP ACC P M": { ex: "Fortiōrēs mīlitēs mīsit.", en: "He sent braver soldiers.", note: "acc. pl. -ēs" },
  },
  tips: ["The ablative of comparison replaces <i>quam</i> + nominative/accusative: <i>fortior patre</i> = <i>fortior quam pater</i>.", "<i>multō</i> (by much) and <i>paulō</i> (by a little) strengthen a comparative: <i>multō fortior</i>.", "<i>quam</i> + superlative = 'as … as possible': <i>quam fortissimus</i>."],
  related: ["ADJ-SUPER", "ADJ-3-1", "ADV"]
};

PACKS["ADJ-SUPER"] = {
  id: "ADJ-SUPER", title: "Superlative adjectives (fortissimus, pulcherrimus, facillimus)", pos: "ADJ",
  model: { hw: "fortissimus", parts: "fortissimus, fortissima, fortissimum", gloss: "bravest, very brave" },
  modelEntry: { s: ["fortissim"], p: "ADJ", c: [0, 0], k: "SUPER" },
  intro: "<p>The superlative adds <b>-issimus, -a, -um</b> to the stem (<i>fortissimus, fēlīcissimus, altissimus</i>). Adjectives in <b>-er</b> add <b>-rimus</b> to the nominative (<i>pulcherrimus, ācerrimus, celerrimus, miserrimus</i>); six in <b>-lis</b> add <b>-limus</b> to the stem (<i>facillimus, difficillimus, similimus, dissimillimus, gracillimus, humillimus</i>). Irregular: <i>optimus, pessimus, maximus, minimus, plūrimus, summus/suprēmus, īnfimus/īmus, extrēmus, proximus</i>.</p><p>Meaning: “-est / most” or, without comparison, “very”: <i>vir fortissimus</i> a very brave man.</p>",
  formation: "<p>All superlatives decline exactly like <i>bonus, -a, -um</i>. The genitive plural of the group compared is common: <i>fortissimus omnium</i> the bravest of all; <i>quam</i> + superlative = as … as possible.</p>",
  rows: {
    "SUPER NOM S M": { ex: "Caesar fortissimus omnium erat.", en: "Caesar was the bravest of all.", note: "superlative + partitive genitive" },
    "SUPER NOM S F": { ex: "Fortissima fēmina urbem servāvit.", en: "A very brave woman saved the city.", note: "'very' sense" },
    "SUPER NOM S N": { ex: "Fortissimum cōnsilium cēpit.", en: "He adopted a most courageous plan.", note: "neuter" },
    "SUPER GEN S M": { ex: "Fortissimī virī exemplum sequimur.", en: "We follow the example of a very brave man.", note: "genitive" },
    "SUPER DAT S F": { ex: "Fortissimae mātrī statuam posuērunt.", en: "They set up a statue to the bravest mother.", note: "dative" },
    "SUPER ACC S M": { ex: "Fortissimum ducem quam celerrimē mīsērunt.", en: "They sent the bravest leader as quickly as possible.", note: "quam + superlative adverb" },
    "SUPER ABL S F": { ex: "Cum fortissimā legiōne vēnit.", en: "He came with the bravest legion.", note: "accompaniment" },
    "SUPER NOM P M": { ex: "Fortissimī mīlitēs prīmī pugnant.", en: "The bravest soldiers fight first.", note: "plural" },
    "SUPER GEN P M": { ex: "Nōmina fortissimōrum in memoriā sunt.", en: "The names of the bravest are remembered.", note: "genitive plural" },
    "SUPER ACC P F": { ex: "Fortissimās cohortēs in aciē posuit.", en: "He placed the bravest cohorts in the line.", note: "accusative plural" },
  },
  tips: ["Superlative adverbs end in <i>-ē</i>: <i>fortissimē</i>, <i>facillimē</i>, <i>optimē</i>.", "<i>vel</i> + superlative = 'the very …': <i>vel maximus</i>; <i>longē</i> + superlative = 'by far'."],
  related: ["ADJ-COMP", "ADJ-1-2"]
};

PACKS["ADJ-INDECL"] = {
  id: "ADJ-INDECL", title: "Indeclinable adjectives (nēquam, frūgī, tot, quot)", pos: "ADJ",
  model: { hw: "nēquam", parts: "nēquam", gloss: "worthless, wicked" },
  modelEntry: { s: ["nequam"], p: "ADJ", c: [9, 9], k: "POS" },
  intro: "<p>A few adjectives never change: <i>nēquam</i> worthless (comp. <i>nēquior</i>, sup. <i>nēquissimus</i>), <i>frūgī</i> honest, thrifty (originally a dative), <i>tot</i> so many, <i>quot</i> how many, <i>aliquot</i> several, <i>mīlle</i> thousand (sg.), <i>necesse</i> necessary, and the cardinal numbers 4–100.</p>",
  formation: "<p>No endings; agreement is understood from the noun.</p>",
  rows: {
    "POS NOM S M": { ex: "Homō nēquam est.", en: "He is a worthless fellow.", note: "predicate" },
    "POS ACC S F": { ex: "Nēquam fēminam vītat.", en: "He avoids the wicked woman.", note: "same form in every case" },
    "POS GEN P M": { ex: "Facta hominum nēquam nārrat.", en: "He recounts the deeds of worthless men.", note: "indeclinable in the plural" },
  },
  tips: ["<i>tot … quot</i> = as many … as; <i>totidem</i> just as many."],
  related: ["ADJ-1-2", "NUM"]
};

PACKS["ADJ-PPL"] = {
  id: "ADJ-PPL", title: "Participles declined as adjectives (amāns; amātus)", pos: "ADJ",
  model: { hw: "amāns", parts: "amāns, amantis", gloss: "loving" },
  modelEntry: { s: ["amans", "amant"], p: "ADJ", c: [3, 1], k: "POS" },
  intro: "<p>Participles are verbal adjectives and decline like adjectives. The <b>present participle</b> (<i>amāns, amantis</i>) follows the one-termination 3rd declension (<i>fēlīx</i>); the <b>perfect</b> (<i>amātus, -a, -um</i>), <b>future</b> (<i>amātūrus</i>) and <b>gerundive</b> (<i>amandus</i>) follow <i>bonus</i>. As true participles they can take objects (<i>puer librum legēns</i>); as adjectives they can be compared (<i>amantior, amantissimus</i>).</p>",
  formation: "<p>Present participle: abl. sg. <i>-e</i> when used verbally or in the ablative absolute (<i>rēge regnante</i>), <i>-ī</i> when a pure adjective or noun (<i>ā sapientī</i>); gen. pl. <i>-ium</i>; n. pl. <i>-ia</i>.</p>",
  rows: {
    "POS NOM S M": { ex: "Puer librum legēns tacet.", en: "The boy, reading a book, is silent.", note: "participle with its own object" },
    "POS GEN S F": { ex: "Vōx mātris flentis audītur.", en: "The voice of the weeping mother is heard.", note: "genitive" },
    "POS DAT S M": { ex: "Amantī nihil difficile est.", en: "To a lover nothing is difficult.", note: "participle as noun" },
    "POS ACC S F": { ex: "Puellam cantantem audīvī.", en: "I heard the girl singing.", note: "accusative agreeing with object" },
    "POS ABL S M": { ex: "Rēge regnante pāx erat.", en: "While the king reigned there was peace.", note: "ablative absolute, abl. -e" },
    "POS NOM P M": { ex: "Amantēs saepe caecī sunt.", en: "Lovers are often blind.", note: "plural as noun" },
    "POS GEN P M": { ex: "Verba sapientium audī.", en: "Listen to the words of the wise.", note: "gen. pl. -ium" },
    "POS NOM P N": { ex: "Omnia mūtantia sunt.", en: "All things are changing.", note: "neuter plural -ia" },
  },
  tips: ["Perfect participles of deponents are active in meaning: <i>secūtus</i> having followed, <i>locūtus</i> having spoken.", "Many adjectives are old participles: <i>doctus</i> learned, <i>nōtus</i> known, <i>cautus</i> careful."],
  related: ["ADJ-3-1", "ADJ-1-2", "V-1"]
};

if (typeof module === 'object' && module.exports) module.exports = PACKS;
