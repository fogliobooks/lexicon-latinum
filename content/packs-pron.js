/* Pronoun, numeral and adverb paradigm packs. Curated tables (the engine's pronoun data is fragmentary). */
var PACKS = (typeof PACKS !== 'undefined') ? PACKS : {};

/* ---------- PERSONAL PRONOUNS ---------- */
PACKS["PRON-PERS"] = {
  id: "PRON-PERS",
  title: "Personal pronouns (ego, tū, nōs, vōs)",
  pos: "PRON",
  model: { hw: "ego", parts: "ego, meī; tū, tuī; nōs, nostrum/nostrī; vōs, vestrum/vestrī", gloss: "I, you, we, you (pl.)" },
  intro: "<p>Latin has personal pronouns only for the <b>first</b> and <b>second</b> persons. For the third person (<i>he, she, it, they</i>) classical Latin uses the demonstrative <b>is, ea, id</b> (or <i>ille</i>, <i>hic</i>), and for a reflexive third person the pronoun <b>suī</b>.</p><p>Because the verb ending already shows the person (<i>amō</i> = I love), the nominative <i>ego</i> and <i>tū</i> are used mainly for emphasis or contrast: <i>ego labōrō, tū dormīs</i> — I work, you sleep.</p>",
  formation: "<p>The forms are irregular and must be learned. Note the two genitive plurals: <b>nostrum / vestrum</b> are <i>partitive</i> (<i>ūnus nostrum</i>, one of us); <b>nostrī / vestrī</b> are <i>objective</i> (<i>memor nostrī</i>, mindful of us). Possession is <b>never</b> expressed by the genitive of these pronouns but by the possessive adjectives <i>meus, tuus, noster, vester</i>.</p><p>With the preposition <i>cum</i> the pronoun comes first and the preposition is attached: <b>mēcum, tēcum, nōbīscum, vōbīscum</b>. Emphatic forms: <i>egomet, tūte, tētē, mēmē, nōsmet</i>.</p>",
  table: {
    "ego": { "NOM S": { M: "ego" }, "GEN S": { M: "meī" }, "DAT S": { M: "mihi (mī)" }, "ACC S": { M: "mē" }, "ABL S": { M: "mē" } },
    "tū":  { "NOM S": { M: "tū" }, "GEN S": { M: "tuī" }, "DAT S": { M: "tibi" }, "ACC S": { M: "tē" }, "ABL S": { M: "tē" }, "VOC S": { M: "tū" } },
    "nōs": { "NOM P": { M: "nōs" }, "GEN P": { M: "nostrum / nostrī" }, "DAT P": { M: "nōbīs" }, "ACC P": { M: "nōs" }, "ABL P": { M: "nōbīs" } },
    "vōs": { "NOM P": { M: "vōs" }, "GEN P": { M: "vestrum / vestrī" }, "DAT P": { M: "vōbīs" }, "ACC P": { M: "vōs" }, "ABL P": { M: "vōbīs" }, "VOC P": { M: "vōs" } }
  },
  rows: {
    "ego NOM S": { ex: "Ego tē amō.", en: "I love you.", note: "emphatic subject" },
    "ego GEN S": { ex: "Miserēre meī!", en: "Have pity on me!", note: "objective genitive after a verb of pity" },
    "ego DAT S": { ex: "Dā mihi librum.", en: "Give me the book.", note: "indirect object" },
    "ego ACC S": { ex: "Amīcī mē vīdērunt.", en: "My friends saw me.", note: "direct object" },
    "ego ABL S": { ex: "Venī mēcum!", en: "Come with me!", note: "ablative of accompaniment, cum attached" },
    "tū NOM S": { ex: "Tū es amīcus meus.", en: "You are my friend.", note: "emphatic subject" },
    "tū GEN S": { ex: "Semper memor tuī sum.", en: "I am always mindful of you.", note: "objective genitive" },
    "tū DAT S": { ex: "Tibi grātiās agō.", en: "I thank you.", note: "dative with grātiās agere" },
    "tū ACC S": { ex: "Tē exspectāmus.", en: "We are waiting for you.", note: "direct object" },
    "tū ABL S": { ex: "Sine tē nihil possum.", en: "Without you I can do nothing.", note: "ablative after sine" },
    "nōs NOM P": { ex: "Nōs Rōmānī sumus.", en: "We are Romans.", note: "emphatic subject" },
    "nōs GEN P": { ex: "Ūnus nostrum abiit.", en: "One of us has gone away.", note: "partitive genitive nostrum" },
    "nōs DAT P": { ex: "Nōbīs placet lēgere.", en: "We like to read (it pleases us).", note: "dative with placet" },
    "nōs ACC P": { ex: "Magister nōs laudat.", en: "The teacher praises us.", note: "direct object" },
    "nōs ABL P": { ex: "Ā nōbīs dēfēnsa est urbs.", en: "The city was defended by us.", note: "ablative of agent" },
    "vōs NOM P": { ex: "Vōs tacēte!", en: "You be quiet!", note: "emphatic subject with imperative" },
    "vōs GEN P": { ex: "Quis vestrum id fēcit?", en: "Which of you did it?", note: "partitive genitive vestrum" },
    "vōs DAT P": { ex: "Vōbīs omnia dabō.", en: "I will give you everything.", note: "indirect object" },
    "vōs ACC P": { ex: "Vōs omnēs amāmus.", en: "We love you all.", note: "direct object" },
    "vōs ABL P": { ex: "Vōbīscum manēbimus.", en: "We will stay with you.", note: "ablative of accompaniment" }
  },
  tips: [
    "Do not say <i>domus meī</i> for 'my house' — possession uses the adjective: <i>domus mea</i>.",
    "<i>nostrum/vestrum</i> after numbers and quantity words (ūnus, multī, quis, nēmō); <i>nostrī/vestrī</i> after adjectives and verbs of remembering, pitying, etc.",
    "<i>mī</i> is a shortened dative of <i>mihi</i>; it is also the vocative of <i>meus</i> (<i>mī fīlī!</i>).",
    "<i>sē</i> and <i>suus</i>, not <i>is</i> and <i>eius</i>, refer back to the subject of the clause."
  ],
  related: ["PRON-REFL", "PRON-IS", "PRON-IPSE"]
};

/* ---------- REFLEXIVE ---------- */
PACKS["PRON-REFL"] = {
  id: "PRON-REFL",
  title: "Reflexive pronoun of the third person (suī, sibi, sē)",
  pos: "PRON",
  model: { hw: "suī", parts: "— , suī, sibi, sē (sēsē), sē", gloss: "himself, herself, itself, themselves" },
  intro: "<p>The reflexive pronoun refers back to the <b>subject</b> of its clause: <i>Caesar sē dēfendit</i> — Caesar defends <i>himself</i>. It has <b>no nominative</b> (a subject cannot be reflexive) and the <b>same forms for singular and plural</b> and for all genders. The emphatic doubled form <b>sēsē</b> is common.</p><p>For the first and second persons the ordinary personal pronouns serve as reflexives (<i>mē laudō</i>, I praise myself). The corresponding possessive adjective is <b>suus, -a, -um</b> (his own, her own, their own).</p>",
  formation: "<p><i>Indirect reflexive</i>: in a subordinate clause expressing the thought of the main subject, <i>sē</i> can refer back to the main subject: <i>Dīxit sē venīre</i> — he said that he (himself) was coming. Contrast <i>Dīxit eum venīre</i> — he said that he (someone else) was coming. With <i>cum</i>: <b>sēcum</b>.</p>",
  table: {
    "GEN S": { M: "suī", F: "suī", N: "suī" }, "DAT S": { M: "sibi", F: "sibi", N: "sibi" },
    "ACC S": { M: "sē / sēsē", F: "sē / sēsē", N: "sē / sēsē" }, "ABL S": { M: "sē / sēsē", F: "sē / sēsē", N: "sē / sēsē" },
    "GEN P": { M: "suī", F: "suī", N: "suī" }, "DAT P": { M: "sibi", F: "sibi", N: "sibi" },
    "ACC P": { M: "sē / sēsē", F: "sē / sēsē", N: "sē / sēsē" }, "ABL P": { M: "sē / sēsē", F: "sē / sēsē", N: "sē / sēsē" }
  },
  rows: {
    "GEN S": { ex: "Amor suī omnibus innātus est.", en: "Love of self is innate in everyone.", note: "objective genitive" },
    "DAT S": { ex: "Rēx sibi domum aedificāvit.", en: "The king built a house for himself.", note: "dative of interest, reflexive" },
    "ACC S": { ex: "Mīles sē interfēcit.", en: "The soldier killed himself.", note: "direct object = subject" },
    "ABL S": { ex: "Puella librum sēcum portat.", en: "The girl carries the book with her.", note: "cum attached: sēcum" },
    "GEN P": { ex: "Hostēs suī oblītī sunt.", en: "The enemy forgot themselves.", note: "genitive with oblīvīscor" },
    "DAT P": { ex: "Cīvēs sibi lēgēs scrīpsērunt.", en: "The citizens wrote laws for themselves.", note: "plural, same form" },
    "ACC P": { ex: "Galli sē Caesarī dēdidērunt.", en: "The Gauls surrendered (themselves) to Caesar.", note: "direct object, plural" },
    "ABL P": { ex: "Inter sē pugnant.", en: "They fight among themselves.", note: "inter sē = each other" }
  },
  tips: [
    "<i>eius</i> = 'his' (someone else's); <i>suus</i> = 'his own' (the subject's). <i>Pater eius</i> — his (another man's) father; <i>pater suus</i> — his own father.",
    "<i>inter sē</i> expresses reciprocity: <i>inter sē amant</i> — they love one another.",
    "In indirect statement <i>sē</i> is the normal way of saying 'he/she/they' when referring to the speaker."
  ],
  related: ["PRON-PERS", "PRON-IS", "PRON-IPSE"]
};

/* ---------- DEMONSTRATIVES ---------- */
PACKS["PRON-HIC"] = {
  id: "PRON-HIC",
  title: "Demonstrative hic, haec, hoc (this)",
  pos: "PRON",
  model: { hw: "hic", parts: "hic, haec, hoc", gloss: "this; the latter" },
  intro: "<p><b>hic</b> points to what is <b>near the speaker</b> in place, time or thought: <i>this (here)</i>. In contrast with <i>ille</i> it means <i>the latter</i> (the one just mentioned). Like all demonstratives it is used both as an adjective (<i>hic vir</i>, this man) and as a pronoun (<i>hic</i>, this man / he).</p>",
  formation: "<p>The endings are those of the pronominal declension (gen. sg. <i>-ius</i>, dat. sg. <i>-ic</i> < <i>-ī</i> + <i>-ce</i>) with the deictic particle <i>-c(e)</i> fused to many forms: <i>hunc, hanc, hoc, hōc, hāc, hīc</i>. Note <b>haec</b> is both fem. nom. sg. and neut. nom./acc. pl. Emphatic <i>hice, haece, hocce</i> occur in comedy.</p>",
  table: {
    "NOM S": { M: "hic", F: "haec", N: "hoc" }, "GEN S": { M: "huius", F: "huius", N: "huius" }, "DAT S": { M: "huic", F: "huic", N: "huic" },
    "ACC S": { M: "hunc", F: "hanc", N: "hoc" }, "ABL S": { M: "hōc", F: "hāc", N: "hōc" },
    "NOM P": { M: "hī", F: "hae", N: "haec" }, "GEN P": { M: "hōrum", F: "hārum", N: "hōrum" }, "DAT P": { M: "hīs", F: "hīs", N: "hīs" },
    "ACC P": { M: "hōs", F: "hās", N: "haec" }, "ABL P": { M: "hīs", F: "hīs", N: "hīs" }
  },
  rows: {
    "NOM S": { ex: "Hic liber meus est.", en: "This book is mine.", note: "demonstrative adjective, subject" },
    "GEN S": { ex: "Huius urbis mūrī altī sunt.", en: "The walls of this city are high.", note: "possessive genitive" },
    "DAT S": { ex: "Huic puellae rosam dō.", en: "I give a rose to this girl.", note: "indirect object" },
    "ACC S": { ex: "Hoc nōn crēdō.", en: "I do not believe this.", note: "neuter pronoun as object" },
    "ABL S": { ex: "Hāc viā Rōmam venimus.", en: "By this road we came to Rome.", note: "ablative of route" },
    "NOM P": { ex: "Hī mīlitēs fortēs sunt.", en: "These soldiers are brave.", note: "plural subject" },
    "GEN P": { ex: "Hōrum nēmō fūgit.", en: "None of these fled.", note: "partitive genitive" },
    "DAT P": { ex: "Hīs cīvibus pecūniam dedit.", en: "He gave money to these citizens.", note: "indirect object" },
    "ACC P": { ex: "Haec omnia vīdī.", en: "I saw all these things.", note: "neuter plural = 'these things'" },
    "ABL P": { ex: "In hīs locīs habitāmus.", en: "We live in these places.", note: "ablative of place with in" }
  },
  tips: [
    "<i>hic ... ille</i>: 'the latter ... the former' (hic = the one nearer in the text, i.e. mentioned last).",
    "Neuter plural <i>haec</i> very often means 'these things', 'the following'.",
    "Don't confuse the pronoun <i>hīc</i> (abl.) with the adverb <i>hīc</i> 'here' and <i>hūc</i> 'to here', <i>hinc</i> 'from here'."
  ],
  related: ["PRON-ILLE", "PRON-ISTE", "PRON-IS"]
};

PACKS["PRON-ILLE"] = {
  id: "PRON-ILLE",
  title: "Demonstrative ille, illa, illud (that)",
  pos: "PRON",
  model: { hw: "ille", parts: "ille, illa, illud", gloss: "that; the former; the famous" },
  intro: "<p><b>ille</b> points to what is <b>distant</b> from the speaker: <i>that (there)</i>. It may mean <i>the former</i> (as opposed to <i>hic</i>, the latter), or <i>the well-known, the famous</i> (<i>Alexander ille</i>, the great Alexander). It is the ancestor of the Romance definite article and often serves simply for <i>he, she, it</i> with slight emphasis.</p>",
  formation: "<p>Regular pronominal declension: gen. sg. <b>illīus</b>, dat. sg. <b>illī</b> for all genders, neuter nom./acc. sg. <b>illud</b> (not <i>-um</i>). Otherwise like <i>bonus, -a, -um</i>. Old forms <i>ollus, olle</i> survive in poets.</p>",
  table: {
    "NOM S": { M: "ille", F: "illa", N: "illud" }, "GEN S": { M: "illīus", F: "illīus", N: "illīus" }, "DAT S": { M: "illī", F: "illī", N: "illī" },
    "ACC S": { M: "illum", F: "illam", N: "illud" }, "ABL S": { M: "illō", F: "illā", N: "illō" },
    "NOM P": { M: "illī", F: "illae", N: "illa" }, "GEN P": { M: "illōrum", F: "illārum", N: "illōrum" }, "DAT P": { M: "illīs", F: "illīs", N: "illīs" },
    "ACC P": { M: "illōs", F: "illās", N: "illa" }, "ABL P": { M: "illīs", F: "illīs", N: "illīs" }
  },
  rows: {
    "NOM S": { ex: "Ille vir sapiēns est.", en: "That man is wise.", note: "demonstrative adjective" },
    "GEN S": { ex: "Nōmen illīus fēminae nesciō.", en: "I do not know that woman's name.", note: "possessive genitive" },
    "DAT S": { ex: "Illī crēdere nōn possum.", en: "I cannot trust that man.", note: "dative with crēdō" },
    "ACC S": { ex: "Illud numquam dīxī.", en: "I never said that.", note: "neuter pronoun as object" },
    "ABL S": { ex: "Illō tempore bellum erat.", en: "At that time there was war.", note: "ablative of time" },
    "NOM P": { ex: "Illī Rōmānī, hī Graecī sunt.", en: "The former are Romans, the latter Greeks.", note: "ille ... hic contrast" },
    "GEN P": { ex: "Virtūs illōrum mīlitum magna erat.", en: "The courage of those soldiers was great.", note: "possessive genitive" },
    "DAT P": { ex: "Illīs omnia dedimus.", en: "We gave them everything.", note: "indirect object" },
    "ACC P": { ex: "Illōs montēs vidēs?", en: "Do you see those mountains?", note: "direct object" },
    "ABL P": { ex: "Cum illīs pugnāvimus.", en: "We fought with those men.", note: "ablative with cum" }
  },
  tips: [
    "<i>ille</i> after a name = 'the famous': <i>Sōcratēs ille</i>.",
    "<i>illud</i> often introduces a quotation or saying: <i>illud Catōnis</i>, that saying of Cato.",
    "Adverbs from the same stem: <i>illīc</i> there, <i>illūc</i> thither, <i>illinc</i> thence, <i>illā</i> that way."
  ],
  related: ["PRON-HIC", "PRON-ISTE", "PRON-IS"]
};

PACKS["PRON-ISTE"] = {
  id: "PRON-ISTE",
  title: "Demonstrative iste, ista, istud (that of yours)",
  pos: "PRON",
  model: { hw: "iste", parts: "iste, ista, istud", gloss: "that (of yours); that (contemptuous)" },
  intro: "<p><b>iste</b> is the demonstrative of the <b>second person</b>: <i>that of yours, that near you, that you mention</i>. In the law-courts, where the speaker refers to the opponent, it acquired a <b>contemptuous</b> tone: <i>iste</i> = 'that fellow', 'that wretch'. It declines exactly like <i>ille</i>.</p>",
  formation: "<p>Gen. sg. <b>istīus</b>, dat. sg. <b>istī</b>, neuter <b>istud</b>; otherwise first/second declension endings. Related adverbs: <i>istīc</i> (there by you), <i>istūc</i>, <i>istinc</i>.</p>",
  table: {
    "NOM S": { M: "iste", F: "ista", N: "istud" }, "GEN S": { M: "istīus", F: "istīus", N: "istīus" }, "DAT S": { M: "istī", F: "istī", N: "istī" },
    "ACC S": { M: "istum", F: "istam", N: "istud" }, "ABL S": { M: "istō", F: "istā", N: "istō" },
    "NOM P": { M: "istī", F: "istae", N: "ista" }, "GEN P": { M: "istōrum", F: "istārum", N: "istōrum" }, "DAT P": { M: "istīs", F: "istīs", N: "istīs" },
    "ACC P": { M: "istōs", F: "istās", N: "ista" }, "ABL P": { M: "istīs", F: "istīs", N: "istīs" }
  },
  rows: {
    "NOM S": { ex: "Iste homō mentītur.", en: "That fellow is lying.", note: "contemptuous demonstrative" },
    "GEN S": { ex: "Istīus audācia incrēdibilis est.", en: "That man's audacity is incredible.", note: "possessive genitive (Cicero's tone)" },
    "DAT S": { ex: "Istī nihil dēbeō.", en: "I owe that man of yours nothing.", note: "dative with dēbeō" },
    "ACC S": { ex: "Istud cōnsilium nōn probō.", en: "I do not approve of that plan of yours.", note: "neuter adjective, object" },
    "ABL S": { ex: "Quid istā rē vīs?", en: "What do you want with that business of yours?", note: "ablative" },
    "NOM P": { ex: "Istī sunt amīcī tuī?", en: "Are those your friends?", note: "near the person addressed" },
    "GEN P": { ex: "Istōrum verba nōn audiō.", en: "I do not listen to the words of those people.", note: "possessive genitive" },
    "DAT P": { ex: "Istīs numquam crēdam.", en: "I will never trust those men.", note: "dative with crēdō" },
    "ACC P": { ex: "Istōs librōs mihi dā.", en: "Give me those books of yours.", note: "direct object" },
    "ABL P": { ex: "Ab istīs nihil exspectō.", en: "I expect nothing from those people.", note: "ablative with ab" }
  },
  tips: [
    "Think of <i>iste</i> as 'that of yours' first; the sneer is a secondary development.",
    "In Cicero's speeches <i>iste</i> usually means the defendant or the opponent.",
    "Later Latin uses <i>iste</i> simply as 'this', like <i>hic</i>."
  ],
  related: ["PRON-HIC", "PRON-ILLE"]
};

PACKS["PRON-IS"] = {
  id: "PRON-IS",
  title: "Pronoun is, ea, id (he, she, it; that)",
  pos: "PRON",
  model: { hw: "is", parts: "is, ea, id", gloss: "he, she, it; this, that" },
  intro: "<p><b>is, ea, id</b> is the weak demonstrative and the ordinary <b>third-person pronoun</b>: <i>he, she, it, they</i>. As an adjective it means <i>that, this</i> without emphasis, and very often it anticipates a relative clause: <i>is quī</i> — the man who; <i>id quod</i> — that which. Its genitive <b>eius, eōrum, eārum</b> supplies the non-reflexive possessive 'his, her, its, their'.</p>",
  formation: "<p>Stem <i>e-</i>/<i>i-</i>: gen. sg. <b>eius</b>, dat. sg. <b>eī</b>, nom. pl. masc. <b>eī</b> or <b>iī</b> (also <i>ī</i>), dat./abl. pl. <b>eīs</b> or <b>iīs</b> (also <i>īs</i>). Neuter nom./acc. sg. <b>id</b>.</p>",
  table: {
    "NOM S": { M: "is", F: "ea", N: "id" }, "GEN S": { M: "eius", F: "eius", N: "eius" }, "DAT S": { M: "eī", F: "eī", N: "eī" },
    "ACC S": { M: "eum", F: "eam", N: "id" }, "ABL S": { M: "eō", F: "eā", N: "eō" },
    "NOM P": { M: "eī / iī", F: "eae", N: "ea" }, "GEN P": { M: "eōrum", F: "eārum", N: "eōrum" }, "DAT P": { M: "eīs / iīs", F: "eīs / iīs", N: "eīs / iīs" },
    "ACC P": { M: "eōs", F: "eās", N: "ea" }, "ABL P": { M: "eīs / iīs", F: "eīs / iīs", N: "eīs / iīs" }
  },
  rows: {
    "NOM S": { ex: "Is est quī tē servāvit.", en: "He is the one who saved you.", note: "antecedent of a relative" },
    "GEN S": { ex: "Pater eius mīles erat.", en: "His father was a soldier.", note: "non-reflexive possessive 'his'" },
    "DAT S": { ex: "Eī pecūniam dedī.", en: "I gave him the money.", note: "indirect object" },
    "ACC S": { ex: "Id nōn intellegō.", en: "I do not understand that.", note: "neuter object" },
    "ABL S": { ex: "Eō tempore Rōmae eram.", en: "At that time I was in Rome.", note: "ablative of time" },
    "NOM P": { ex: "Eī quī labōrant laudantur.", en: "Those who work are praised.", note: "plural antecedent" },
    "GEN P": { ex: "Domūs eōrum dēlētae sunt.", en: "Their houses were destroyed.", note: "possessive genitive 'their'" },
    "DAT P": { ex: "Eīs nōn crēdimus.", en: "We do not believe them.", note: "dative with crēdō" },
    "ACC P": { ex: "Eōs in forō vīdī.", en: "I saw them in the forum.", note: "direct object" },
    "ABL P": { ex: "Cum eīs locūtus sum.", en: "I spoke with them.", note: "ablative with cum" }
  },
  tips: [
    "<i>eius</i> (his/her — someone else's) vs <i>suus</i> (his/her own — the subject's).",
    "<i>is</i> is weak: for a stressed 'he' use <i>ille</i> or <i>hic</i>.",
    "<i>id est</i> (i.e.) = 'that is'; <i>eō ... quō</i> = 'the more ... the more'; <i>eā rē, ideō</i> = for that reason."
  ],
  related: ["PRON-IDEM", "PRON-IPSE", "PRON-REFL", "PRON-HIC"]
};

PACKS["PRON-IDEM"] = {
  id: "PRON-IDEM",
  title: "Pronoun īdem, eadem, idem (the same)",
  pos: "PRON",
  model: { hw: "īdem", parts: "īdem, eadem, idem", gloss: "the same" },
  intro: "<p><b>īdem</b> is simply <i>is, ea, id</i> with the indeclinable suffix <b>-dem</b> attached. It means <i>the same</i>, and in narrative often <i>also, likewise, at the same time</i>: <i>Cicerō ōrātor īdemque philosophus</i> — Cicero, an orator and also a philosopher.</p>",
  formation: "<p>Masc. nom. sg. <b>īdem</b> (from <i>is-dem</i>, with lengthening), neuter <b>idem</b> (short i). Before <i>-dem</i> a final <i>-m</i> becomes <i>-n</i>: <b>eundem, eandem, eōrundem, eārundem</b>. Plural masc. nom. <i>eīdem</i> / <i>iīdem</i> / <i>īdem</i>; dat./abl. pl. <i>eīsdem</i> / <i>iīsdem</i> / <i>īsdem</i>.</p>",
  table: {
    "NOM S": { M: "īdem", F: "eadem", N: "idem" }, "GEN S": { M: "eiusdem", F: "eiusdem", N: "eiusdem" }, "DAT S": { M: "eīdem", F: "eīdem", N: "eīdem" },
    "ACC S": { M: "eundem", F: "eandem", N: "idem" }, "ABL S": { M: "eōdem", F: "eādem", N: "eōdem" },
    "NOM P": { M: "eīdem / iīdem", F: "eaedem", N: "eadem" }, "GEN P": { M: "eōrundem", F: "eārundem", N: "eōrundem" }, "DAT P": { M: "eīsdem / iīsdem", F: "eīsdem / iīsdem", N: "eīsdem / iīsdem" },
    "ACC P": { M: "eōsdem", F: "eāsdem", N: "eadem" }, "ABL P": { M: "eīsdem / iīsdem", F: "eīsdem / iīsdem", N: "eīsdem / iīsdem" }
  },
  rows: {
    "NOM S": { ex: "Īdem homō semper venit.", en: "The same man always comes.", note: "adjective, subject" },
    "GEN S": { ex: "Eiusdem patris fīliī sunt.", en: "They are sons of the same father.", note: "possessive genitive" },
    "DAT S": { ex: "Eīdem puellae librum dedī.", en: "I gave the book to the same girl.", note: "indirect object" },
    "ACC S": { ex: "Eundem errōrem fēcistī.", en: "You made the same mistake.", note: "m → n before -dem" },
    "ABL S": { ex: "Eōdem diē discessit.", en: "He left on the same day.", note: "ablative of time" },
    "NOM P": { ex: "Eīdem mīlitēs redierunt.", en: "The same soldiers returned.", note: "plural subject" },
    "GEN P": { ex: "Eōrundem cīvium domūs ārsērunt.", en: "The houses of the same citizens burned.", note: "genitive plural -rundem" },
    "DAT P": { ex: "Eīsdem lēgibus pārēmus.", en: "We obey the same laws.", note: "dative with pāreō" },
    "ACC P": { ex: "Eāsdem fābulās audīvimus.", en: "We heard the same stories.", note: "direct object" },
    "ABL P": { ex: "In eīsdem locīs mānsērunt.", en: "They stayed in the same places.", note: "ablative of place" }
  },
  tips: [
    "<i>īdem ... quī / ac / atque / ut</i> = 'the same as': <i>īdem sum quī fuī</i> — I am the same as I was.",
    "<i>īdem</i> joined to another word often = 'also, at the same time'.",
    "Watch the <i>n</i>: <i>eundem</i>, never <i>eumdem</i> in classical spelling."
  ],
  related: ["PRON-IS", "PRON-IPSE"]
};

PACKS["PRON-IPSE"] = {
  id: "PRON-IPSE",
  title: "Intensive pronoun ipse, ipsa, ipsum (himself, the very)",
  pos: "PRON",
  model: { hw: "ipse", parts: "ipse, ipsa, ipsum", gloss: "himself, herself, itself; the very; in person" },
  intro: "<p><b>ipse</b> is the <b>intensive</b> pronoun: it emphasizes a noun or pronoun — <i>Caesar ipse</i>, Caesar <i>himself</i> (in person); <i>eō ipsō diē</i>, on that <i>very</i> day. It is <b>not reflexive</b>: 'he killed himself' is <i>sē interfēcit</i>, not <i>ipsum interfēcit</i>. Standing alone it often means 'the master', 'the man himself' (<i>ipse dīxit</i>).</p>",
  formation: "<p>Pronominal declension: gen. sg. <b>ipsīus</b>, dat. sg. <b>ipsī</b>; but the neuter is <b>ipsum</b> (not <i>-ud</i>). Otherwise like <i>bonus</i>. Old form <i>ipsus</i> in Plautus.</p>",
  table: {
    "NOM S": { M: "ipse", F: "ipsa", N: "ipsum" }, "GEN S": { M: "ipsīus", F: "ipsīus", N: "ipsīus" }, "DAT S": { M: "ipsī", F: "ipsī", N: "ipsī" },
    "ACC S": { M: "ipsum", F: "ipsam", N: "ipsum" }, "ABL S": { M: "ipsō", F: "ipsā", N: "ipsō" },
    "NOM P": { M: "ipsī", F: "ipsae", N: "ipsa" }, "GEN P": { M: "ipsōrum", F: "ipsārum", N: "ipsōrum" }, "DAT P": { M: "ipsīs", F: "ipsīs", N: "ipsīs" },
    "ACC P": { M: "ipsōs", F: "ipsās", N: "ipsa" }, "ABL P": { M: "ipsīs", F: "ipsīs", N: "ipsīs" }
  },
  rows: {
    "NOM S": { ex: "Rēx ipse vēnit.", en: "The king himself came.", note: "intensive with subject" },
    "GEN S": { ex: "Verba ipsīus poētae legimus.", en: "We read the words of the poet himself.", note: "genitive" },
    "DAT S": { ex: "Ipsī Caesarī epistulam mīsī.", en: "I sent a letter to Caesar himself.", note: "dative, emphatic" },
    "ACC S": { ex: "Ipsum cōnsulem vīdimus.", en: "We saw the consul himself.", note: "direct object" },
    "ABL S": { ex: "Eō ipsō tempore advēnit.", en: "At that very moment he arrived.", note: "'the very' with a noun" },
    "NOM P": { ex: "Ipsī hoc fēcimus.", en: "We ourselves did this.", note: "intensive with implied subject" },
    "GEN P": { ex: "Ipsōrum deōrum voluntās est.", en: "It is the will of the gods themselves.", note: "genitive plural" },
    "DAT P": { ex: "Ipsīs mīlitibus praemia dedit.", en: "He gave rewards to the soldiers themselves.", note: "indirect object" },
    "ACC P": { ex: "Ipsōs hostēs nōn timēmus.", en: "We do not fear the enemy themselves.", note: "direct object" },
    "ABL P": { ex: "Ab ipsīs cīvibus accūsātus est.", en: "He was accused by the citizens themselves.", note: "ablative of agent" }
  },
  tips: [
    "<i>ipse</i> agrees with the word it stresses; in English it is often 'very', 'in person', 'actually', 'exactly'.",
    "<i>sē ipsum</i> (reflexive + intensive) = 'his very self'.",
    "<i>ipsō factō</i>, by the fact itself; <i>ipsissima verba</i>, the very words."
  ],
  related: ["PRON-IS", "PRON-IDEM", "PRON-REFL"]
};

/* ---------- RELATIVE ---------- */
PACKS["PRON-QUI"] = {
  id: "PRON-QUI",
  title: "Relative pronoun quī, quae, quod (who, which)",
  pos: "PRON",
  model: { hw: "quī", parts: "quī, quae, quod", gloss: "who, which, that" },
  intro: "<p>The relative pronoun introduces a clause describing its <b>antecedent</b>. It agrees with the antecedent in <b>gender and number</b>, but takes its <b>case</b> from its function in its own clause: <i>puella <b>quam</b> vidēs</i> — the girl <i>whom</i> you see (acc., object of <i>vidēs</i>). A relative at the beginning of a sentence (<i>quō factō</i>, <i>quae cum ita sint</i>) connects it to the previous one: 'and this...', 'and when this...'.</p>",
  formation: "<p>Pronominal endings: gen. sg. <b>cuius</b>, dat. sg. <b>cui</b> (one syllable), abl. pl. <b>quibus</b> (poetic <b>quīs</b>). Neuter <b>quod</b>. The archaic ablative <b>quī</b> survives in <b>quīcum</b> = <i>quōcum</i>, with whom. The same forms serve as the interrogative adjective (<i>quī vir?</i> which man?) and as the indefinite 'any' after <i>sī, nisi, nē, num</i>.</p>",
  table: {
    "NOM S": { M: "quī", F: "quae", N: "quod" }, "GEN S": { M: "cuius", F: "cuius", N: "cuius" }, "DAT S": { M: "cui", F: "cui", N: "cui" },
    "ACC S": { M: "quem", F: "quam", N: "quod" }, "ABL S": { M: "quō (quī)", F: "quā", N: "quō" },
    "NOM P": { M: "quī", F: "quae", N: "quae" }, "GEN P": { M: "quōrum", F: "quārum", N: "quōrum" }, "DAT P": { M: "quibus (quīs)", F: "quibus (quīs)", N: "quibus (quīs)" },
    "ACC P": { M: "quōs", F: "quās", N: "quae" }, "ABL P": { M: "quibus (quīs)", F: "quibus (quīs)", N: "quibus (quīs)" }
  },
  rows: {
    "NOM S": { ex: "Vir quī venit frāter meus est.", en: "The man who is coming is my brother.", note: "subject of its clause" },
    "GEN S": { ex: "Puella cuius pater abest trīstis est.", en: "The girl whose father is away is sad.", note: "possessive genitive" },
    "DAT S": { ex: "Amīcus cui librum dedī Rōmae habitat.", en: "The friend to whom I gave the book lives in Rome.", note: "indirect object" },
    "ACC S": { ex: "Templum quod vidēs antīquum est.", en: "The temple which you see is ancient.", note: "object in relative clause" },
    "ABL S": { ex: "Gladius quō pugnābat fractus est.", en: "The sword with which he was fighting was broken.", note: "ablative of means" },
    "NOM P": { ex: "Mīlitēs quī fūgērunt pūnītī sunt.", en: "The soldiers who fled were punished.", note: "plural subject" },
    "GEN P": { ex: "Hominēs quōrum domūs ārsērunt auxilium petunt.", en: "The people whose houses burned seek help.", note: "genitive plural" },
    "DAT P": { ex: "Cīvēs quibus lēgēs placent pārent.", en: "Citizens who like the laws obey them.", note: "dative with placeō" },
    "ACC P": { ex: "Librōs quōs lēgistī mihi dā.", en: "Give me the books you read.", note: "direct object" },
    "ABL P": { ex: "Amīcī cum quibus veniēbam tacēbant.", en: "The friends with whom I was coming were silent.", note: "ablative with cum (quibuscum also)" }
  },
  tips: [
    "Case comes from the relative clause, gender and number from the antecedent.",
    "<i>cum</i> may follow: <i>quōcum, quācum, quibuscum</i>.",
    "A relative clause with the <b>subjunctive</b> expresses purpose (<i>mīsit quī dīceret</i>, he sent men to say), characteristic (<i>sunt quī dīcant</i>), cause or result.",
    "Connecting relative: <i>Quae cum ita sint</i> — Since these things are so."
  ],
  related: ["PRON-QUIS", "PRON-INDEF", "PRON-IS"]
};

/* ---------- INTERROGATIVE ---------- */
PACKS["PRON-QUIS"] = {
  id: "PRON-QUIS",
  title: "Interrogative pronoun quis, quid (who? what?)",
  pos: "PRON",
  model: { hw: "quis", parts: "quis, quid; adj. quī, quae, quod", gloss: "who? what? which?" },
  intro: "<p>The interrogative <b>pronoun</b> <i>quis</i> (who?) and <i>quid</i> (what?) differ from the relative only in the nominative singular (<i>quis</i> for masc. and fem., <i>quid</i> for neuter) and the neuter accusative <i>quid</i>. The interrogative <b>adjective</b> (<i>which ...? what ...?</i>) is identical to the relative: <b>quī, quae, quod</b> — <i>quī vir?</i> which man? <i>quod nōmen?</i> what name? The plural of both is that of the relative.</p>",
  formation: "<p>Singular pronoun: <b>quis, cuius, cui, quem, quō</b> (m./f.) and <b>quid, cuius, cui, quid, quō</b> (n.). The genitive <i>cuius</i> also has an adjective form <i>cuius, -a, -um</i> ('whose?'). Interrogative adverbs: <i>cūr, quārē, quōmodo, quandō, ubi, quō, unde, quam, quot, quotiēns</i>. <i>quid</i> alone = 'why?'.</p>",
  table: {
    "NOM S": { M: "quis", F: "quis (quae)", N: "quid" }, "GEN S": { M: "cuius", F: "cuius", N: "cuius" }, "DAT S": { M: "cui", F: "cui", N: "cui" },
    "ACC S": { M: "quem", F: "quam (quem)", N: "quid" }, "ABL S": { M: "quō", F: "quā (quō)", N: "quō" },
    "NOM P": { M: "quī", F: "quae", N: "quae" }, "GEN P": { M: "quōrum", F: "quārum", N: "quōrum" }, "DAT P": { M: "quibus", F: "quibus", N: "quibus" },
    "ACC P": { M: "quōs", F: "quās", N: "quae" }, "ABL P": { M: "quibus", F: "quibus", N: "quibus" }
  },
  rows: {
    "NOM S": { ex: "Quis es tū?", en: "Who are you?", note: "interrogative pronoun" },
    "GEN S": { ex: "Cuius est hic liber?", en: "Whose is this book?", note: "possessive genitive" },
    "DAT S": { ex: "Cui dōnum dabis?", en: "To whom will you give the gift?", note: "indirect object" },
    "ACC S": { ex: "Quid dīcis?", en: "What are you saying?", note: "neuter object" },
    "ABL S": { ex: "Quō cōnsiliō vēnistī?", en: "With what plan did you come?", note: "adjective, ablative" },
    "NOM P": { ex: "Quī sunt illī hominēs?", en: "Who are those men?", note: "plural = relative forms" },
    "GEN P": { ex: "Quōrum ducum nōmina scīs?", en: "Which leaders' names do you know?", note: "adjective, genitive" },
    "DAT P": { ex: "Quibus pecūniam dedistī?", en: "To whom (pl.) did you give the money?", note: "dative plural" },
    "ACC P": { ex: "Quōs librōs lēgistī?", en: "Which books did you read?", note: "adjective, accusative" },
    "ABL P": { ex: "Ā quibus urbs capta est?", en: "By whom was the city captured?", note: "ablative of agent" }
  },
  tips: [
    "Pronoun <i>quis</i> 'who?' vs adjective <i>quī</i> 'which?': <i>Quis vēnit?</i> / <i>Quī homō vēnit?</i>",
    "<i>quid</i> + genitive: <i>quid novī?</i> what news? (partitive genitive).",
    "Interrogatives in indirect questions take the subjunctive: <i>rogō quis sīs</i>.",
    "Doubled <i>quisquis, quidquid</i> = 'whoever, whatever'."
  ],
  related: ["PRON-QUI", "PRON-INDEF"]
};

/* ---------- INDEFINITES ---------- */
PACKS["PRON-INDEF"] = {
  id: "PRON-INDEF",
  title: "Indefinite pronouns (aliquis, quīdam, quisque, quisquam, quīvīs)",
  pos: "PRON",
  model: { hw: "aliquis", parts: "aliquis, aliquid; adj. aliquī, aliqua, aliquod", gloss: "someone, something; some" },
  intro: "<p>Indefinites are built on <i>quis/quī</i> with prefixes or suffixes that do not decline. The commonest:</p><ul><li><b>aliquis, aliquid</b> — someone, something (positive 'some'); adjective <i>aliquī, aliqua, aliquod</i>.</li><li><b>quīdam, quaedam, quiddam/quoddam</b> — a certain (one), someone definite but unnamed.</li><li><b>quisque, quaeque, quidque/quodque</b> — each, every (one).</li><li><b>quisquam, quidquam (quicquam)</b> — anyone at all (in negative or quasi-negative contexts); adjective <i>ūllus</i>.</li><li><b>quīvīs / quīlibet</b> — anyone you like, any whatever.</li><li><b>quis, quid</b> after <i>sī, nisi, nē, num</i> — anyone, anything (<i>sī quis</i>, if anyone).</li></ul>",
  formation: "<p><i>aliquis</i>: the <i>ali-</i> is fixed, <i>quis</i> declines; note fem. nom. sg. and neut. pl. <b>aliqua</b> (not <i>aliquae</i>). <i>quīdam</i>: <i>quī</i> declines, <i>-dam</i> is fixed; <i>m</i> → <i>n</i> before it: <b>quendam, quandam, quōrundam, quārundam</b>. <i>quisque</i> declines like <i>quis</i> + <i>-que</i>; <i>quisquam</i> has no plural and no feminine in classical prose.</p>",
  table: {
    "NOM S": { M: "aliquis", F: "aliqua", N: "aliquid / aliquod" }, "GEN S": { M: "alicuius", F: "alicuius", N: "alicuius" }, "DAT S": { M: "alicui", F: "alicui", N: "alicui" },
    "ACC S": { M: "aliquem", F: "aliquam", N: "aliquid / aliquod" }, "ABL S": { M: "aliquō", F: "aliquā", N: "aliquō" },
    "NOM P": { M: "aliquī", F: "aliquae", N: "aliqua" }, "GEN P": { M: "aliquōrum", F: "aliquārum", N: "aliquōrum" }, "DAT P": { M: "aliquibus", F: "aliquibus", N: "aliquibus" },
    "ACC P": { M: "aliquōs", F: "aliquās", N: "aliqua" }, "ABL P": { M: "aliquibus", F: "aliquibus", N: "aliquibus" }
  },
  table2: {
    title: "quīdam, quaedam, quiddam (quoddam) — a certain",
    "NOM S": { M: "quīdam", F: "quaedam", N: "quiddam / quoddam" }, "GEN S": { M: "cuiusdam", F: "cuiusdam", N: "cuiusdam" }, "DAT S": { M: "cuidam", F: "cuidam", N: "cuidam" },
    "ACC S": { M: "quendam", F: "quandam", N: "quiddam / quoddam" }, "ABL S": { M: "quōdam", F: "quādam", N: "quōdam" },
    "NOM P": { M: "quīdam", F: "quaedam", N: "quaedam" }, "GEN P": { M: "quōrundam", F: "quārundam", N: "quōrundam" }, "DAT P": { M: "quibusdam", F: "quibusdam", N: "quibusdam" },
    "ACC P": { M: "quōsdam", F: "quāsdam", N: "quaedam" }, "ABL P": { M: "quibusdam", F: "quibusdam", N: "quibusdam" }
  },
  rows: {
    "NOM S": { ex: "Aliquis ad portam stat.", en: "Someone is standing at the gate.", note: "indefinite subject" },
    "GEN S": { ex: "Alicuius auxilium petimus.", en: "We seek someone's help.", note: "possessive genitive" },
    "DAT S": { ex: "Alicui hoc dīcere dēbēs.", en: "You ought to tell this to someone.", note: "indirect object" },
    "ACC S": { ex: "Aliquid novī audīvī.", en: "I heard something new.", note: "aliquid + partitive genitive" },
    "ABL S": { ex: "Aliquō modō effugiēmus.", en: "Somehow or other we shall escape.", note: "adjective, ablative of manner" },
    "NOM P": { ex: "Aliquī mīlitēs fūgērunt.", en: "Some soldiers fled.", note: "adjective, plural" },
    "GEN P": { ex: "Aliquōrum cīvium domūs dēlētae sunt.", en: "The houses of some citizens were destroyed.", note: "genitive plural" },
    "DAT P": { ex: "Aliquibus praemia data sunt.", en: "Rewards were given to some.", note: "dative plural" },
    "ACC P": { ex: "Aliquōs amīcōs in forō vīdī.", en: "I saw some friends in the forum.", note: "direct object" },
    "ABL P": { ex: "Cum aliquibus locūtus est.", en: "He spoke with some people.", note: "ablative with cum" }
  },
  tips: [
    "After <i>sī, nisi, nē, num</i> the <i>ali-</i> falls away: <i>sī quis</i>, not <i>sī aliquis</i>.",
    "<i>quisquam</i> is used with negatives: <i>neque quisquam</i>, and no one; positive 'anyone' is <i>aliquis</i>; 'anyone you like' is <i>quīvīs</i>.",
    "<i>quisque</i> with superlatives: <i>optimus quisque</i> — all the best men; with ordinals: <i>quīntō quōque annō</i> — every fifth year. It usually follows a reflexive: <i>suum cuique</i> — to each his own.",
    "<i>quīdam</i> = a certain person the speaker could name; <i>aliquis</i> = someone or other."
  ],
  related: ["PRON-QUIS", "PRON-QUI", "ADJ-PRONOMINAL"]
};

/* ---------- NUMERALS ---------- */
PACKS["NUM"] = {
  id: "NUM",
  title: "Numerals: cardinals, ordinals, distributives and adverbs",
  pos: "NUM",
  model: { hw: "ūnus", parts: "ūnus, ūna, ūnum; duo, duae, duo; trēs, tria; mīlle", gloss: "one, two, three, a thousand" },
  intro: "<p>Latin has four series of numerals: <b>cardinals</b> (<i>ūnus, duo, trēs</i> — one, two, three), <b>ordinals</b> (<i>prīmus, secundus, tertius</i> — first, second, third; declined like <i>bonus</i>), <b>distributives</b> (<i>singulī, bīnī, ternī</i> — one each, two each; plural adjectives like <i>bonī</i>) and <b>numeral adverbs</b> (<i>semel, bis, ter</i> — once, twice, three times).</p><p>Of the cardinals only <b>ūnus, duo, trēs</b>, the hundreds from <b>ducentī</b> on, and the plural <b>mīlia</b> decline; <i>quattuor</i> to <i>centum</i> and <i>mīlle</i> are indeclinable adjectives.</p>",
  formation: "<p><b>ūnus</b> follows the pronominal declension (gen. <i>ūnīus</i>, dat. <i>ūnī</i>); its plural is used with plural-only nouns (<i>ūna castra</i>, one camp). <b>duo</b> and <b>ambō</b> (both) keep the old dual ending <i>-ō</i>. <b>trēs</b> is a third-declension i-stem plural. <b>mīlle</b> (sg.) is an indeclinable adjective: <i>mīlle mīlitēs</i>; <b>mīlia</b> (pl.) is a neuter noun followed by the genitive: <i>duo mīlia mīlitum</i>, two thousand (of) soldiers.</p><p>Compound numbers 21–99: either <i>vīgintī ūnus</i> or <i>ūnus et vīgintī</i>; 18, 19, 28, 29 etc. are formed by subtraction: <i>duodēvīgintī</i> (18), <i>ūndēvīgintī</i> (19).</p><p><b>Roman numerals</b>: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000; a smaller numeral before a larger is subtracted (IV = 4, XC = 90).</p>",
  table: {
    "ūnus": {
      "NOM S": { M: "ūnus", F: "ūna", N: "ūnum" }, "GEN S": { M: "ūnīus", F: "ūnīus", N: "ūnīus" }, "DAT S": { M: "ūnī", F: "ūnī", N: "ūnī" },
      "ACC S": { M: "ūnum", F: "ūnam", N: "ūnum" }, "ABL S": { M: "ūnō", F: "ūnā", N: "ūnō" }, "VOC S": { M: "ūne", F: "ūna", N: "ūnum" }
    },
    "duo": {
      "NOM P": { M: "duo", F: "duae", N: "duo" }, "GEN P": { M: "duōrum (duum)", F: "duārum", N: "duōrum (duum)" }, "DAT P": { M: "duōbus", F: "duābus", N: "duōbus" },
      "ACC P": { M: "duōs / duo", F: "duās", N: "duo" }, "ABL P": { M: "duōbus", F: "duābus", N: "duōbus" }
    },
    "trēs": {
      "NOM P": { M: "trēs", F: "trēs", N: "tria" }, "GEN P": { M: "trium", F: "trium", N: "trium" }, "DAT P": { M: "tribus", F: "tribus", N: "tribus" },
      "ACC P": { M: "trēs (trīs)", F: "trēs (trīs)", N: "tria" }, "ABL P": { M: "tribus", F: "tribus", N: "tribus" }
    },
    "mīlle": {
      "NOM S": { M: "mīlle (indecl.)", F: "mīlle", N: "mīlle" }, "NOM P": { M: "mīlia", F: "mīlia", N: "mīlia" }, "GEN P": { M: "mīlium", F: "mīlium", N: "mīlium" },
      "DAT P": { M: "mīlibus", F: "mīlibus", N: "mīlibus" }, "ACC P": { M: "mīlia", F: "mīlia", N: "mīlia" }, "ABL P": { M: "mīlibus", F: "mīlibus", N: "mīlibus" }
    }
  },
  numerals: [
    { n: 1, roman: "I", card: "ūnus, ūna, ūnum", ord: "prīmus, -a, -um", dist: "singulī, -ae, -a", adv: "semel" },
    { n: 2, roman: "II", card: "duo, duae, duo", ord: "secundus (alter)", dist: "bīnī", adv: "bis" },
    { n: 3, roman: "III", card: "trēs, tria", ord: "tertius", dist: "ternī (trīnī)", adv: "ter" },
    { n: 4, roman: "IV", card: "quattuor", ord: "quārtus", dist: "quaternī", adv: "quater" },
    { n: 5, roman: "V", card: "quīnque", ord: "quīntus", dist: "quīnī", adv: "quīnquiēs" },
    { n: 6, roman: "VI", card: "sex", ord: "sextus", dist: "sēnī", adv: "sexiēs" },
    { n: 7, roman: "VII", card: "septem", ord: "septimus", dist: "septēnī", adv: "septiēs" },
    { n: 8, roman: "VIII", card: "octō", ord: "octāvus", dist: "octōnī", adv: "octiēs" },
    { n: 9, roman: "IX", card: "novem", ord: "nōnus", dist: "novēnī", adv: "noviēs" },
    { n: 10, roman: "X", card: "decem", ord: "decimus", dist: "dēnī", adv: "deciēs" },
    { n: 11, roman: "XI", card: "ūndecim", ord: "ūndecimus", dist: "ūndēnī", adv: "ūndeciēs" },
    { n: 12, roman: "XII", card: "duodecim", ord: "duodecimus", dist: "duodēnī", adv: "duodeciēs" },
    { n: 13, roman: "XIII", card: "tredecim", ord: "tertius decimus", dist: "ternī dēnī", adv: "terdeciēs" },
    { n: 14, roman: "XIV", card: "quattuordecim", ord: "quārtus decimus", dist: "quaternī dēnī", adv: "quaterdeciēs" },
    { n: 15, roman: "XV", card: "quīndecim", ord: "quīntus decimus", dist: "quīnī dēnī", adv: "quīndeciēs" },
    { n: 16, roman: "XVI", card: "sēdecim", ord: "sextus decimus", dist: "sēnī dēnī", adv: "sēdeciēs" },
    { n: 17, roman: "XVII", card: "septendecim", ord: "septimus decimus", dist: "septēnī dēnī", adv: "septiēs deciēs" },
    { n: 18, roman: "XVIII", card: "duodēvīgintī", ord: "duodēvīcēsimus", dist: "duodēvīcēnī", adv: "duodēvīciēs" },
    { n: 19, roman: "XIX", card: "ūndēvīgintī", ord: "ūndēvīcēsimus", dist: "ūndēvīcēnī", adv: "ūndēvīciēs" },
    { n: 20, roman: "XX", card: "vīgintī", ord: "vīcēsimus", dist: "vīcēnī", adv: "vīciēs" },
    { n: 21, roman: "XXI", card: "vīgintī ūnus / ūnus et vīgintī", ord: "vīcēsimus prīmus", dist: "vīcēnī singulī", adv: "vīciēs semel" },
    { n: 30, roman: "XXX", card: "trīgintā", ord: "trīcēsimus", dist: "trīcēnī", adv: "trīciēs" },
    { n: 40, roman: "XL", card: "quadrāgintā", ord: "quadrāgēsimus", dist: "quadrāgēnī", adv: "quadrāgiēs" },
    { n: 50, roman: "L", card: "quīnquāgintā", ord: "quīnquāgēsimus", dist: "quīnquāgēnī", adv: "quīnquāgiēs" },
    { n: 60, roman: "LX", card: "sexāgintā", ord: "sexāgēsimus", dist: "sexāgēnī", adv: "sexāgiēs" },
    { n: 70, roman: "LXX", card: "septuāgintā", ord: "septuāgēsimus", dist: "septuāgēnī", adv: "septuāgiēs" },
    { n: 80, roman: "LXXX", card: "octōgintā", ord: "octōgēsimus", dist: "octōgēnī", adv: "octōgiēs" },
    { n: 90, roman: "XC", card: "nōnāgintā", ord: "nōnāgēsimus", dist: "nōnāgēnī", adv: "nōnāgiēs" },
    { n: 100, roman: "C", card: "centum", ord: "centēsimus", dist: "centēnī", adv: "centiēs" },
    { n: 200, roman: "CC", card: "ducentī, -ae, -a", ord: "ducentēsimus", dist: "ducēnī", adv: "ducentiēs" },
    { n: 300, roman: "CCC", card: "trecentī", ord: "trecentēsimus", dist: "trecēnī", adv: "trecentiēs" },
    { n: 400, roman: "CD", card: "quadringentī", ord: "quadringentēsimus", dist: "quadringēnī", adv: "quadringentiēs" },
    { n: 500, roman: "D", card: "quīngentī", ord: "quīngentēsimus", dist: "quīngēnī", adv: "quīngentiēs" },
    { n: 600, roman: "DC", card: "sescentī", ord: "sescentēsimus", dist: "sescēnī", adv: "sescentiēs" },
    { n: 700, roman: "DCC", card: "septingentī", ord: "septingentēsimus", dist: "septingēnī", adv: "septingentiēs" },
    { n: 800, roman: "DCCC", card: "octingentī", ord: "octingentēsimus", dist: "octingēnī", adv: "octingentiēs" },
    { n: 900, roman: "CM", card: "nōngentī", ord: "nōngentēsimus", dist: "nōngēnī", adv: "nōngentiēs" },
    { n: 1000, roman: "M", card: "mīlle", ord: "mīllēsimus", dist: "singula mīlia", adv: "mīliēs" },
    { n: 2000, roman: "MM", card: "duo mīlia", ord: "bis mīllēsimus", dist: "bīna mīlia", adv: "bis mīliēs" }
  ],
  rows: {
    "NOM S": { ex: "Ūnus vir urbem servāvit.", en: "One man saved the city.", note: "ūnus as adjective" },
    "GEN S": { ex: "Ūnīus hōrae spatium dedit.", en: "He gave the space of a single hour.", note: "pronominal genitive -īus" },
    "DAT S": { ex: "Ūnī puerō praemium dedit.", en: "He gave a prize to one boy.", note: "pronominal dative -ī" },
    "ACC S": { ex: "Ūnam fīliam habet.", en: "He has one daughter.", note: "direct object" },
    "ABL S": { ex: "Ūnō annō omnia mūtāta sunt.", en: "In one year everything changed.", note: "ablative of time within which" },
    "NOM P": { ex: "Duo cōnsulēs et trēs tribūnī aderant.", en: "Two consuls and three tribunes were present.", note: "duo, trēs decline" },
    "GEN P": { ex: "Trium mēnsium cibus superest.", en: "Food for three months remains.", note: "genitive plural trium" },
    "DAT P": { ex: "Duōbus fīliīs omnia relīquit.", en: "He left everything to his two sons.", note: "dative plural duōbus" },
    "ACC P": { ex: "Caesar duo mīlia mīlitum mīsit.", en: "Caesar sent two thousand soldiers.", note: "mīlia + genitive" },
    "ABL P": { ex: "Cum tribus amīcīs vēnit.", en: "He came with three friends.", note: "ablative plural tribus" }
  },
  tips: [
    "<i>mīlle mīlitēs</i> (adjective) but <i>duo mīlia mīlitum</i> (noun + genitive).",
    "'Second' is <i>secundus</i> when counting in a series, <i>alter</i> when there are only two.",
    "Distributives are required with plural-only nouns: <i>bīnae litterae</i> = two letters (<i>duae litterae</i> would mean two letters of the alphabet).",
    "Ordinals, not cardinals, express the hour and the year: <i>hōrā sextā</i>, at the sixth hour; <i>annō vīcēsimō</i>, in the twentieth year."
  ],
  related: ["ADJ-PRONOMINAL", "ADJ-1-2", "N-3-I"]
};

/* ---------- ADVERBS ---------- */
PACKS["ADV"] = {
  id: "ADV",
  title: "Adverbs: formation and comparison",
  pos: "ADV",
  model: { hw: "fortiter", parts: "fortiter, fortius, fortissimē", gloss: "bravely, more bravely, most bravely" },
  intro: "<p>Adverbs are indeclinable; most are formed from adjectives and modify verbs, adjectives or other adverbs. Many adverbs of place, time and manner are independent words (<i>hīc, nunc, saepe, iam, tamen</i>), and some neuter accusatives serve as adverbs (<i>multum, facile, prīmum</i>).</p>",
  formation: "<p><b>From 1st/2nd declension adjectives</b>: stem + <b>-ē</b>: <i>lātus → lātē</i> (widely), <i>pulcher → pulchrē</i>, <i>līber → līberē</i>. A few use <i>-ō</i>: <i>subitō, falsō, crēbrō, rārō, tūtō</i>.</p><p><b>From 3rd declension adjectives</b>: stem + <b>-iter</b>: <i>fortis → fortiter</i>, <i>ācer → ācriter</i>, <i>fēlīx → fēlīciter</i>; stems in <i>-nt-</i> take <b>-er</b>: <i>prūdēns → prūdenter</i>, <i>sapiēns → sapienter</i>.</p><p><b>Comparative</b> = the neuter accusative singular of the comparative adjective: <b>-ius</b>: <i>lātius, fortius, prūdentius</i>.</p><p><b>Superlative</b> = superlative adjective stem + <b>-ē</b>: <b>-issimē / -errimē / -illimē</b>: <i>lātissimē, fortissimē, pulcherrimē, facillimē</i>.</p>",
  table: {
    "bene": { "POS": { M: "bene (well)" }, "COMP": { M: "melius" }, "SUPER": { M: "optimē" } },
    "male": { "POS": { M: "male (badly)" }, "COMP": { M: "peius" }, "SUPER": { M: "pessimē" } },
    "magnopere": { "POS": { M: "magnopere (greatly)" }, "COMP": { M: "magis" }, "SUPER": { M: "maximē" } },
    "parum": { "POS": { M: "parum (too little)" }, "COMP": { M: "minus" }, "SUPER": { M: "minimē" } },
    "multum": { "POS": { M: "multum (much)" }, "COMP": { M: "plūs" }, "SUPER": { M: "plūrimum" } },
    "diū": { "POS": { M: "diū (for a long time)" }, "COMP": { M: "diūtius" }, "SUPER": { M: "diūtissimē" } },
    "saepe": { "POS": { M: "saepe (often)" }, "COMP": { M: "saepius" }, "SUPER": { M: "saepissimē" } },
    "prope": { "POS": { M: "prope (near)" }, "COMP": { M: "propius" }, "SUPER": { M: "proximē" } },
    "facile": { "POS": { M: "facile (easily)" }, "COMP": { M: "facilius" }, "SUPER": { M: "facillimē" } },
    "fortiter": { "POS": { M: "fortiter (bravely)" }, "COMP": { M: "fortius" }, "SUPER": { M: "fortissimē" } },
    "lātē": { "POS": { M: "lātē (widely)" }, "COMP": { M: "lātius" }, "SUPER": { M: "lātissimē" } }
  },
  rows: {
    "POS": { ex: "Mīlitēs fortiter pugnāvērunt.", en: "The soldiers fought bravely.", note: "positive, from fortis" },
    "COMP": { ex: "Rōmānī fortius quam hostēs pugnāvērunt.", en: "The Romans fought more bravely than the enemy.", note: "comparative + quam" },
    "SUPER": { ex: "Omnium fortissimē pugnāvit.", en: "He fought most bravely of all.", note: "superlative + genitive" }
  },
  tips: [
    "<i>-ē</i> for 1st/2nd declension adjectives, <i>-iter</i> for 3rd: <i>lātē</i> but <i>fortiter</i>.",
    "The comparative adverb is identical to the neuter comparative adjective (<i>fortius</i>): context decides.",
    "<i>quam</i> + superlative = 'as ... as possible': <i>quam celerrimē</i>, as quickly as possible.",
    "Some positive adverbs look like neuter adjectives: <i>multum, facile, cēterum, prīmum</i>; <i>bene</i> and <i>male</i> have a short final e."
  ],
  related: ["ADJ-COMP", "ADJ-SUPER", "ADJ-1-2", "ADJ-3-2"]
};

if (typeof module === 'object' && module.exports) module.exports = PACKS;
