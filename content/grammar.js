/* Grammar section chapters. Each chapter: { id, title, group, html, packs } */
var GRAMMAR = [

/* ===================== NOUNS ===================== */
{
  id: "nouns-overview", title: "The five declensions", group: "Nouns",
  packs: ["N-1-F", "N-2-M", "N-2-N", "N-3-M", "N-3-N", "N-3-I", "N-4-M", "N-5-F"],
  html: `
<p>A Latin noun changes its ending to show its <b>case</b> (its job in the sentence), its <b>number</b> (singular or plural) and, fixed for each noun, its <b>gender</b> (masculine, feminine or neuter). The set of endings a noun uses is its <b>declension</b>. There are five.</p>
<p>A dictionary entry gives the nominative singular, the genitive singular ending and the gender: <i>amīcus, -ī, m.</i> The <b>genitive singular</b> tells you the declension, and removing its ending gives the <b>stem</b> to which all other endings attach:</p>
<ul>
<li><b>1st</b> gen. <b>-ae</b>: <i>puella, -ae</i> (mostly feminine; <i>nauta, poēta, agricola</i> masculine).</li>
<li><b>2nd</b> gen. <b>-ī</b>: <i>amīcus, -ī</i> m.; <i>puer, puerī</i> and <i>ager, agrī</i> m.; <i>bellum, -ī</i> n.</li>
<li><b>3rd</b> gen. <b>-is</b>: <i>rēx, rēgis</i> m.; <i>vōx, vōcis</i> f.; <i>corpus, corporis</i> n.; i-stems <i>cīvis, -is</i>, <i>mare, -is</i>, <i>animal, -ālis</i>. All three genders; the nominative is unpredictable, so learn the genitive.</li>
<li><b>4th</b> gen. <b>-ūs</b>: <i>frūctus, -ūs</i> m.; <i>manus, -ūs</i> f.; <i>cornū, -ūs</i> n.</li>
<li><b>5th</b> gen. <b>-eī / -ēī</b>: <i>rēs, reī</i> f.; <i>diēs, diēī</i> m.</li>
</ul>
<p>Some rules hold across all declensions: neuters have identical nominative, accusative and vocative, and in the plural these end in <b>-a</b>; the dative and ablative plural are always identical; the vocative equals the nominative except in the 2nd declension singular in <i>-us</i> (<i>amīce</i>).</p>
<p class="ex"><i>Amīcus puellae rosam dat.</i><br>The friend gives a rose to the girl. (nom. – gen./dat. – acc.)</p>
<p class="ex"><i>Rēgēs cīvium corpora in mare iēcērunt.</i><br>The kings threw the bodies of the citizens into the sea.</p>
<p>Below are the model tables for each declension. Tap any case label for its uses and an example of the same kind.</p>`
},
{
  id: "cases-overview", title: "The cases and what they do", group: "Nouns",
  packs: [],
  html: `
<p>Latin marks the function of a noun by its ending rather than by word order or prepositions. The six cases (seven with the rare locative):</p>
<ul>
<li><b>Nominative</b> — the subject, and the complement after <i>sum</i> and similar verbs: <i>Puella cantat. Marcus est cōnsul.</i></li>
<li><b>Genitive</b> — 'of': possession (<i>domus patris</i>), the whole of which a part is taken (<i>pars urbis</i>), description (<i>vir magnae virtūtis</i>), the object of a feeling (<i>amor patriae</i>), value (<i>magnī</i>), and after certain verbs and adjectives (<i>memor mortis, oblīvīscor iniūriae</i>).</li>
<li><b>Dative</b> — 'to/for': indirect object (<i>librum puerō dō</i>), possessor with <i>sum</i> (<i>mihi est liber</i>), the person interested (<i>tibi hoc faciō</i>), purpose (<i>auxiliō venīre</i>), agent with the gerundive (<i>mihi faciendum est</i>), and the object of verbs like <i>crēdō, pāreō, placeō, noceō, imperō, ignōscō</i> and of compound verbs.</li>
<li><b>Accusative</b> — direct object (<i>amīcum videō</i>), extent of space and time (<i>trēs diēs, decem pedēs</i>), motion towards with <i>ad, in</i> and with names of towns (<i>Rōmam īre</i>), subject of an infinitive in indirect statement, exclamation (<i>mē miserum!</i>).</li>
<li><b>Ablative</b> — 'by, with, from, in': separation and origin with <i>ā/ab, ē/ex, dē</i> (<i>ex urbe</i>), agent with <i>ā/ab</i> (<i>ā mīlite</i>), means or instrument without a preposition (<i>gladiō</i>), manner (<i>cum cūrā / magnā cūrā</i>), accompaniment with <i>cum</i>, time when (<i>eō diē</i>), place where with <i>in</i>, comparison (<i>mel dulcius vīnō</i>), degree of difference (<i>multō</i>), description, respect (<i>nōmine</i>), and the ablative absolute.</li>
<li><b>Vocative</b> — direct address: <i>Marce! amīcī!</i></li>
<li><b>Locative</b> — 'at', used only with names of towns and small islands and a few nouns (<i>Rōmae, Athēnīs, domī, rūrī, humī</i>).</li>
</ul>
<p class="ex"><i>Caesar mīlitibus gladiīs pugnāre imperāvit.</i><br>Caesar ordered the soldiers (dat.) to fight with swords (abl. of means).</p>
<p class="ex"><i>Multī cīvēs Rōmae trēs annōs mānsērunt.</i><br>Many citizens stayed at Rome (loc.) for three years (acc. of extent).</p>
<p class="ex"><i>Liber ā magistrō puerō datus est.</i><br>The book was given to the boy by the teacher.</p>
<p>The detailed uses of each case, with examples matched to each declension, appear in the (i) notes beside every table in the dictionary.</p>`
},

/* ===================== ADJECTIVES ===================== */
{
  id: "adj-overview", title: "Adjectives and their comparison", group: "Adjectives & Adverbs",
  packs: ["ADJ-1-2", "ADJ-3-2", "ADJ-3-1", "ADJ-COMP", "ADJ-PRONOMINAL", "ADV"],
  html: `
<p>An adjective <b>agrees</b> with its noun in gender, number and case — not necessarily in ending, since noun and adjective may belong to different declensions: <i>nauta bonus</i>, <i>rēx bonus</i>, <i>manus magna</i>.</p>
<p>Adjectives fall into two groups, recognizable from the dictionary entry:</p>
<ul>
<li><b>1st/2nd declension</b>: three endings <i>bonus, -a, -um</i>; <i>pulcher, pulchra, pulchrum</i>; <i>līber, lībera, līberum</i>. Masculine and neuter follow the 2nd declension, feminine the 1st.</li>
<li><b>3rd declension</b> (i-stems): <i>three terminations</i> <i>ācer, ācris, ācre</i>; <i>two</i> <i>fortis, forte</i>; <i>one</i> <i>fēlīx (gen. fēlīcis)</i>, <i>ingēns, ingentis</i>. Their ablative singular is <i>-ī</i>, genitive plural <i>-ium</i>, neuter plural <i>-ia</i>.</li>
</ul>
<p>Nine adjectives (<i>ūnus, sōlus, tōtus, ūllus, nūllus, alius, alter, uter, neuter</i>) take the <b>pronominal</b> genitive <i>-īus</i> and dative <i>-ī</i>.</p>
<p><b>Comparison.</b> Comparative: stem + <b>-ior</b> (m./f.), <b>-ius</b> (n.), declined as a 3rd declension consonant stem (abl. <i>-e</i>, gen. pl. <i>-um</i>). Superlative: stem + <b>-issimus, -a, -um</b>; adjectives in <i>-er</i> use <b>-errimus</b> (<i>pulcherrimus</i>); six in <i>-ilis</i> use <b>-illimus</b> (<i>facillimus, difficillimus, similis, dissimilis, gracilis, humilis</i>). Adjectives in <i>-eus, -ius</i> compare with <i>magis / maximē</i>.</p>
<p>Irregular: <i>bonus, melior, optimus</i>; <i>malus, peior, pessimus</i>; <i>magnus, maior, maximus</i>; <i>parvus, minor, minimus</i>; <i>multus, plūs, plūrimus</i>; <i>superus, superior, suprēmus/summus</i>.</p>
<p class="ex"><i>Nihil est amābilius virtūte.</i><br>Nothing is more lovable than virtue. (ablative of comparison)</p>
<p class="ex"><i>Haec via brevior est quam illa.</i><br>This road is shorter than that one. (quam + same case)</p>
<p class="ex"><i>Cicerō ōrātōrum Rōmānōrum ēloquentissimus fuit.</i><br>Cicero was the most eloquent of the Roman orators.</p>
<p>The comparative alone may mean 'rather, too' (<i>senior</i>, rather old), the superlative 'very' (<i>fortissimus</i>, very brave). <i>Quam</i> + superlative = 'as ... as possible'. Adverbs are formed from adjectives and compared in parallel: see the adverb table.</p>`
},

/* ===================== PRONOUNS ===================== */
{
  id: "pron-overview", title: "Pronouns", group: "Pronouns",
  packs: ["PRON-PERS", "PRON-REFL", "PRON-HIC", "PRON-ILLE", "PRON-IS", "PRON-IPSE", "PRON-IDEM", "PRON-QUI", "PRON-QUIS", "PRON-INDEF"],
  html: `
<p>Pronouns stand in for nouns. Most Latin pronouns can also be used as adjectives (<i>hic vir</i> this man / <i>hic</i> this one), and they share a distinctive <b>pronominal declension</b>: genitive singular in <b>-ius</b> (<i>huius, illīus, cuius</i>), dative singular in <b>-ī / -ic / -ui</b> (<i>illī, huic, cui</i>), neuter nominative/accusative singular in <b>-d</b> (<i>id, illud, quod, quid</i>).</p>
<ul>
<li><b>Personal</b>: <i>ego, tū, nōs, vōs</i>; the third person is supplied by <i>is, ea, id</i>.</li>
<li><b>Reflexive</b>: <i>suī, sibi, sē</i> (and <i>mē, tē</i> for the 1st and 2nd persons) — referring back to the subject.</li>
<li><b>Possessive adjectives</b>: <i>meus, tuus, suus, noster, vester</i>; <i>eius, eōrum, eārum</i> for a non-reflexive 'his, their'.</li>
<li><b>Demonstrative</b>: <i>hic</i> (this, near me), <i>iste</i> (that of yours), <i>ille</i> (that, yonder), <i>is</i> (that, he), <i>īdem</i> (the same), <i>ipse</i> (self, the very).</li>
<li><b>Relative</b>: <i>quī, quae, quod</i>.</li>
<li><b>Interrogative</b>: <i>quis, quid</i> (pronoun), <i>quī, quae, quod</i> (adjective), <i>uter</i> (which of two).</li>
<li><b>Indefinite</b>: <i>aliquis, quīdam, quisque, quisquam, quīvīs, quīlibet, quisquis, quīcumque</i>.</li>
</ul>
<p class="ex"><i>Is mihi dīxit sē eum vīdisse.</i><br>He told me that he (himself) had seen him (the other man).</p>
<p class="ex"><i>Hic liber est meus, ille tuus.</i><br>This book is mine, that one yours.</p>
<p class="ex"><i>Quis est quī hoc nesciat?</i><br>Who is there who does not know this?</p>
<p>Full tables for each pronoun follow.</p>`
},

/* ===================== VERBS ===================== */
{
  id: "verbs-overview", title: "The four conjugations and the principal parts", group: "Verbs",
  packs: ["V-1", "V-2", "V-3", "V-3IO", "V-4", "V-SUM"],
  html: `
<p>A Latin verb form tells you its <b>person</b> (1st, 2nd, 3rd), <b>number</b>, <b>tense</b> (present, imperfect, future, perfect, pluperfect, future perfect), <b>mood</b> (indicative, subjunctive, imperative) and <b>voice</b> (active, passive). Regular verbs belong to one of four <b>conjugations</b>, identified by the <b>present infinitive</b>:</p>
<ul>
<li><b>1st</b> <i>-āre</i>: <i>amō, amāre, amāvī, amātum</i> (love)</li>
<li><b>2nd</b> <i>-ēre</i>: <i>moneō, monēre, monuī, monitum</i> (warn)</li>
<li><b>3rd</b> <i>-ere</i> (short e): <i>regō, regere, rēxī, rēctum</i> (rule); <b>3rd -iō</b>: <i>capiō, capere, cēpī, captum</i> (take)</li>
<li><b>4th</b> <i>-īre</i>: <i>audiō, audīre, audīvī, audītum</i> (hear)</li>
</ul>
<p>The dictionary gives four <b>principal parts</b>, from which every form is built:</p>
<ol>
<li>1st sg. present indicative (<i>amō</i>) — gives the <b>present stem</b> with 2.</li>
<li>Present infinitive (<i>amāre</i>) — present stem <i>amā-</i>: present, imperfect, future, present and imperfect subjunctive, imperatives, present participle, gerund, gerundive.</li>
<li>1st sg. perfect indicative (<i>amāvī</i>) — <b>perfect stem</b> <i>amāv-</i>: perfect, pluperfect, future perfect active (indicative and subjunctive), perfect infinitive.</li>
<li>Supine or perfect passive participle (<i>amātum / amātus</i>) — <b>participial stem</b> <i>amāt-</i>: perfect passive system (with <i>sum</i>), future active participle (<i>amātūrus</i>), supine.</li>
</ol>
<p>Personal endings are the same for all conjugations: active <i>-ō/-m, -s, -t, -mus, -tis, -nt</i>; passive <i>-r, -ris, -tur, -mur, -minī, -ntur</i>; perfect active <i>-ī, -istī, -it, -imus, -istis, -ērunt</i>.</p>
<p class="ex"><i>Amō, amās, amat, amāmus, amātis, amant.</i><br>I love, you love, he/she loves, we love, you love, they love.</p>
<p class="ex"><i>Rēxī, rēxistī, rēxit, rēximus, rēxistis, rēxērunt.</i><br>I ruled, you ruled, he ruled, we ruled, you ruled, they ruled.</p>
<p class="ex"><i>Amātus sum; amātī erant.</i><br>I was (have been) loved; they had been loved.</p>
<p>Irregular verbs (<i>sum, possum, eō, ferō, volō, nōlō, mālō, fīō, dō, edō</i>), <b>deponents</b> (passive in form, active in meaning: <i>hortor, sequor</i>) and <b>semi-deponents</b> (<i>audeō, ausus sum</i>) have their own tables.</p>`
},
{
  id: "tenses-moods", title: "Tenses and moods: meaning and formation", group: "Verbs",
  packs: [],
  html: `
<p><b>Indicative</b> states facts. Its six tenses:</p>
<ul>
<li><b>Present</b> (<i>amō</i>): I love, am loving, do love. Formed on the present stem.</li>
<li><b>Imperfect</b> (<i>amābam</i>): I was loving, used to love, began to love — continuing or repeated past action. Present stem + <i>-ba-</i> (<i>-ēba-</i> in 3rd/4th).</li>
<li><b>Future</b> (<i>amābō</i>): I shall love. 1st/2nd conj. present stem + <i>-b-</i> (<i>-bō, -bis, -bit</i>...); 3rd/4th conj. <i>-am, -ēs, -et, -ēmus, -ētis, -ent</i>.</li>
<li><b>Perfect</b> (<i>amāvī</i>): I loved (simple past) or I have loved (present result). Perfect stem + <i>-ī, -istī, -it, -imus, -istis, -ērunt/-ēre</i>.</li>
<li><b>Pluperfect</b> (<i>amāveram</i>): I had loved — before another past event. Perfect stem + <i>-eram</i>.</li>
<li><b>Future perfect</b> (<i>amāverō</i>): I shall have loved — before another future event; frequent in Latin where English uses a simple future. Perfect stem + <i>-erō, -eris, -erit, -erimus, -eritis, -erint</i>.</li>
</ul>
<p><b>Subjunctive</b> expresses will, wish, possibility and appears in most subordinate clauses. Four tenses: present (<i>amem, moneam, regam, audiam</i> — vowel change: 'we beat a liar'), imperfect (= present infinitive + personal endings: <i>amārem</i>), perfect (<i>amāverim</i>), pluperfect (= perfect infinitive + endings: <i>amāvissem</i>). Translation depends on the clause type.</p>
<p><b>Imperative</b> gives commands: <i>amā! amāte!</i>; future imperative <i>amātō, amātōte</i> (laws, precepts). Negative commands use <i>nōlī / nōlīte</i> + infinitive or <i>nē</i> + perfect subjunctive.</p>
<p><b>Infinitive</b>: present <i>amāre / amārī</i>, perfect <i>amāvisse / amātus esse</i>, future <i>amātūrus esse / amātum īrī</i>. Used as a noun (subject or object) and in indirect statement.</p>
<p><b>Passive</b> voice: the present system adds passive endings (<i>amor, amāris, amātur</i>...); the perfect system is <b>compound</b>: perfect participle + <i>sum</i> (<i>amātus sum</i> I was loved; <i>amātus eram</i> I had been loved; <i>amātus erō</i>).</p>
<p class="ex"><i>Dum Rōmae eram, cotīdiē ad forum ībam.</i><br>While I was in Rome, I used to go to the forum every day. (imperfects)</p>
<p class="ex"><i>Cum vēnerō, omnia tibi dīcam.</i><br>When I come (shall have come), I will tell you everything. (future perfect + future)</p>
<p class="ex"><i>Urbs ā Gallīs capta erat.</i><br>The city had been captured by the Gauls. (compound pluperfect passive)</p>
<p class="ex"><i>Utinam vīveret!</i><br>If only he were alive! (imperfect subjunctive, unfulfilled wish)</p>`
},

/* ===================== SYNTAX ===================== */
{
  id: "word-order", title: "Word order and agreement", group: "Syntax",
  html: `
<p>Because the endings carry the grammar, Latin word order is free and is used for <b>emphasis</b> and <b>rhythm</b> rather than meaning. The neutral order of a prose sentence is <b>Subject – Object – Verb</b>, with the verb last: <i>Caesar Gallōs vīcit</i>. Adjectives of quality usually follow their noun (<i>vir bonus</i>), demonstratives and numerals precede (<i>hic vir, trēs virī</i>); a genitive may stand on either side. Whatever is placed first or last in the sentence is stressed.</p>
<p>Two words that belong together may be separated by other words (<i>magnā cum laude</i>; <i>summā ... vī</i>): read by endings, not by position.</p>
<p><b>Agreement</b>:</p>
<ul>
<li>A verb agrees with its subject in <b>person and number</b>; a compound subject takes a plural verb.</li>
<li>An adjective or participle agrees with its noun in <b>gender, number and case</b>. With nouns of different gender, an adjective referring to persons is masculine, to things usually neuter: <i>pater et māter mortuī sunt</i>; <i>labor voluptāsque sunt dissimillima</i>.</li>
<li>A predicate noun agrees in case with the subject: <i>Cicerō cōnsul creātus est</i>.</li>
<li>A relative pronoun agrees with its antecedent in gender and number, taking case from its own clause.</li>
<li>An appositive stands in the same case: <i>urbs Rōma</i>, <i>Cicerō ōrātor</i>.</li>
</ul>
<p class="ex"><i>Puer puellam amat.</i> / <i>Puellam puer amat.</i> / <i>Amat puer puellam.</i><br>All mean 'The boy loves the girl'; emphasis shifts to the first word.</p>
<p class="ex"><i>Et pater et fīlius aderant.</i><br>Both father and son were present.</p>
<p class="ex"><i>Hominēs quōs vīdistī sunt amīcī meī.</i><br>The men whom you saw are my friends.</p>
<p class="ex"><i>Rōma, caput mundī, septem collēs habet.</i><br>Rome, the capital of the world, has seven hills.</p>`
},
{
  id: "case-uses", title: "Uses of the cases: summary table", group: "Syntax",
  html: `
<p>The quickest way to translate is to ask of every noun: <b>what case is this, and what does that case do here?</b></p>
<table class="abbr">
<tr><td><b>Nominative</b></td><td>subject; predicate after <i>sum, fīō, videor</i>, passive verbs of naming</td></tr>
<tr><td><b>Genitive</b></td><td>possession; part of a whole (<i>pars mīlitum, nihil novī</i>); quality (<i>vir summae virtūtis</i>); objective (<i>amor patriae</i>); subjective; value (<i>parvī</i>); with <i>memor, cupidus, plēnus, perītus</i>; with <i>oblīvīscor, meminī, misereor</i>; charge (<i>accūsāre fūrtī</i>)</td></tr>
<tr><td><b>Dative</b></td><td>indirect object; possession with <i>sum</i>; interest/advantage; reference; purpose (<i>auxiliō, praesidiō</i>); double dative (<i>auxiliō mittere alicui</i>); agent with gerundive; with <i>crēdō, faveō, noceō, pāreō, placeō, imperō, parcō, persuādeō, studeō, ignōscō, invideō</i>; with compounds (<i>ad-, ante-, con-, in-, inter-, ob-, prae-, sub-</i>); with adjectives <i>similis, ūtilis, grātus, cārus, amīcus</i></td></tr>
<tr><td><b>Accusative</b></td><td>direct object; extent of time/space; motion towards (<i>ad, in</i>; towns without preposition; <i>domum, rūs</i>); subject of infinitive; two accusatives with <i>doceō, rogō, pōscō</i> and verbs of making/naming; exclamation; adverbial (<i>multum, nihil</i>)</td></tr>
<tr><td><b>Ablative</b></td><td><i>from</i>: separation, origin, agent with <i>ā/ab</i>, comparison; <i>with</i>: means, manner, accompaniment (<i>cum</i>), description, respect, degree of difference, price, cause; <i>in/at</i>: place where (<i>in</i>), time when and within which; ablative absolute; with <i>ūtor, fruor, fungor, potior, vēscor</i>; with <i>dignus, contentus, frētus</i></td></tr>
<tr><td><b>Vocative</b></td><td>address</td></tr>
<tr><td><b>Locative</b></td><td>place where for towns, small islands, <i>domī, rūrī, humī, bellī, mīlitiae</i></td></tr>
</table>
<p class="ex"><i>Magister puerōs grammaticam docet.</i><br>The teacher teaches the boys grammar. (two accusatives)</p>
<p class="ex"><i>Mihi est liber.</i> — <i>Liber est mihi cārus.</i><br>I have a book (dative of possession). — The book is dear to me.</p>
<p class="ex"><i>Caesar legiōnem praesidiō castrīs relīquit.</i><br>Caesar left a legion as a guard for the camp. (double dative)</p>
<p class="ex"><i>Hostēs gladiīs ā mīlitibus victī sunt.</i><br>The enemy were conquered by the soldiers (agent) with swords (means).</p>
<p class="ex"><i>Puer decem annōs nātus est.</i><br>The boy is ten years old. (accusative of extent)</p>`
},
{
  id: "abl-abs", title: "The ablative absolute", group: "Syntax",
  html: `
<p>An <b>ablative absolute</b> is a noun (or pronoun) in the ablative together with a participle, adjective or another noun agreeing with it, forming a self-contained phrase that sets the circumstances of the main action: time, cause, condition, concession or attendant circumstance. It is 'absolute' (<i>absolūtus</i>, set free) because its noun has no grammatical connection with the rest of the sentence — it is neither the subject nor the object of the main verb.</p>
<p>The three types:</p>
<ul>
<li><b>Noun + perfect participle</b> (the commonest, since Latin has no perfect active participle): <i>urbe captā</i>, the city having been captured → when/after the city was captured.</li>
<li><b>Noun + present participle</b>: <i>Caesare duce</i>... no — <i>Caesare veniente</i>, as Caesar was coming.</li>
<li><b>Noun + noun/adjective</b> (the participle of <i>sum</i> being missing): <i>Caesare duce</i>, with Caesar as leader; <i>mē invītō</i>, against my will; <i>Cicerōne cōnsule</i>, in the consulship of Cicero.</li>
</ul>
<p>Translate first literally ('with X having been Y-ed'), then recast as an English clause with <i>when, after, since, although, if</i> as the sense requires. Because the participle is passive and the noun is not the subject, English often needs an active rephrasing: <i>hīs rēbus gestīs</i>, 'having done these things'.</p>
<p class="ex"><i>Urbe captā, hostēs discessērunt.</i><br>When the city had been captured, the enemy departed.</p>
<p class="ex"><i>Sōle oriente, mīlitēs prōcessērunt.</i><br>As the sun was rising, the soldiers advanced.</p>
<p class="ex"><i>Hannibale vīvō, Rōmānī numquam sēcūrī erant.</i><br>While Hannibal was alive, the Romans were never free from care.</p>
<p class="ex"><i>Hīs rēbus cognitīs, Caesar cōpiās ēdūxit.</i><br>Having learned these things, Caesar led out his forces.</p>
<p class="ex"><i>Mē cōnsule, rēs pūblica servāta est.</i><br>In my consulship the state was saved.</p>
<p class="ex"><i>Omnibus rēbus parātīs, profectī sunt.</i><br>Everything being ready, they set out.</p>
<p>Note: if the noun would be the subject or object of the main verb, Latin uses an agreeing participle instead: <i>mīlitēs urbem captam incendērunt</i>, the soldiers burned the captured city.</p>`
},
{
  id: "indirect-statement", title: "Indirect statement (accusative and infinitive)", group: "Syntax",
  html: `
<p>After verbs of <b>saying, thinking, knowing, perceiving</b> (<i>dīcō, negō, putō, crēdō, sciō, audiō, videō, sentiō, spērō, prōmittō</i>...) Latin does not use a 'that'-clause. The subject of the reported statement goes into the <b>accusative</b> and its verb into the <b>infinitive</b>: <i>Dīcit Caesarem venīre</i> — he says that Caesar is coming (literally 'he says Caesar to be coming').</p>
<p>The <b>tense of the infinitive is relative to the main verb</b>:</p>
<ul>
<li><b>Present infinitive</b> — same time as the main verb: <i>dīcit eum venīre</i> (he says he is coming); <i>dīxit eum venīre</i> (he said he <i>was</i> coming).</li>
<li><b>Perfect infinitive</b> — earlier: <i>dīcit eum vēnisse</i> (he says he came / has come); <i>dīxit eum vēnisse</i> (he said he <i>had</i> come).</li>
<li><b>Future infinitive</b> — later: <i>dīcit eum ventūrum esse</i> (he says he will come); <i>dīxit eum ventūrum esse</i> (he said he <i>would</i> come).</li>
</ul>
<p>The future participle in <i>-ūrus</i> and the perfect participle in a passive infinitive agree with the accusative subject in gender and number: <i>dīcit puellās ventūrās esse</i>. <i>Esse</i> is often omitted. When the subject of the infinitive is the same as the speaker, the reflexive <b>sē</b> is used: <i>Dīxit sē venīre</i>, he said that he (himself) was coming. 'Say that ... not' is <b>negō</b>: <i>negat sē venīre</i>.</p>
<p><i>Spērō</i> (hope), <i>prōmittō</i> (promise), <i>iūrō</i> (swear) take the future infinitive where English uses the present: <i>spērō tē ventūrum esse</i>, I hope you will come.</p>
<p class="ex"><i>Putō eum sapientem esse.</i><br>I think that he is wise.</p>
<p class="ex"><i>Audīvimus urbem captam esse.</i><br>We heard that the city had been captured.</p>
<p class="ex"><i>Caesar dīxit sē Gallōs victūrum esse.</i><br>Caesar said that he would conquer the Gauls.</p>
<p class="ex"><i>Negāvit sē id fēcisse.</i><br>He said that he had not done it.</p>
<p class="ex"><i>Scīmus Rōmam ā Rōmulō conditam esse.</i><br>We know that Rome was founded by Romulus.</p>
<p class="ex"><i>Crēdō vōs mē audīre.</i><br>I believe that you hear me.</p>`
},
{
  id: "purpose-result", title: "Purpose and result clauses", group: "Syntax",
  html: `
<p>Both clause types use <b>ut</b> and the <b>subjunctive</b>; they differ in meaning, in their negative, and in the signal words in the main clause.</p>
<p><b>Purpose</b> ('in order that, so that ... may'): <b>ut</b> + subjunctive, negative <b>nē</b>. Tense follows the sequence: present subjunctive after a primary main verb, imperfect after a historic one. Other ways of expressing purpose: a relative clause with the subjunctive (<i>mīsit lēgātōs quī pācem peterent</i>); <i>quō</i> + comparative (<i>quō facilius</i>); <i>ad</i> + gerund/gerundive (<i>ad pācem petendam</i>); <i>causā / grātiā</i> + genitive of the gerundive (<i>pācis petendae causā</i>); the supine after verbs of motion (<i>vēnērunt pācem petītum</i>). The infinitive is <b>not</b> used for purpose in classical prose.</p>
<p><b>Result</b> ('so that, with the result that'): <b>ut</b> + subjunctive, negative <b>ut nōn</b>. The main clause usually contains a signal word: <i>tam, ita, sīc, tantus, tālis, tot, adeō</i> (so, such, so many). The tense is the one the sense demands; the perfect subjunctive may follow a past main verb to stress the actual result.</p>
<p class="ex"><i>Venit ut amīcum videat.</i><br>He comes (in order) to see his friend. (purpose, primary)</p>
<p class="ex"><i>Vēnit ut amīcum vidēret.</i><br>He came to see his friend. (purpose, historic)</p>
<p class="ex"><i>Fūgit nē caperētur.</i><br>He fled so that he would not be captured. (negative purpose)</p>
<p class="ex"><i>Tam fortiter pugnāvit ut hostēs fugerent.</i><br>He fought so bravely that the enemy fled. (result)</p>
<p class="ex"><i>Tanta erat tempestās ut nāvēs nōn nāvigārent.</i><br>So great was the storm that the ships did not sail. (negative result: ut nōn)</p>
<p class="ex"><i>Lēgātōs mīsērunt quī pācem peterent.</i><br>They sent envoys to ask for peace. (relative clause of purpose)</p>
<p class="ex"><i>Ad urbem dēfendendam vēnērunt.</i><br>They came to defend the city. (ad + gerundive)</p>
<p>Verbs of fearing reverse the particles: <i>timeō nē veniat</i>, I fear that he will come; <i>timeō ut veniat</i>, I fear that he will not come.</p>`
},
{
  id: "cum-clauses", title: "Cum clauses", group: "Syntax",
  html: `
<p>The conjunction <b>cum</b> (not the preposition <i>cum</i> 'with') introduces four kinds of clause, distinguished by meaning and by mood:</p>
<ul>
<li><b>Temporal</b> (purely 'when, at the time when'): <b>indicative</b>, any tense. Common with a present or future main verb, or when <i>cum</i> merely dates the main action: <i>cum Caesar in Galliam vēnit</i>, (at the time) when Caesar came to Gaul.</li>
<li><b>Circumstantial</b> ('when', describing the circumstances leading to the main event, in past narrative): <b>imperfect or pluperfect subjunctive</b>: <i>cum Caesar in Galliam vēnisset, Helvētiī...</i>, when Caesar had come to Gaul, the Helvetii...</li>
<li><b>Causal</b> ('since, because'): <b>subjunctive</b>, any tense: <i>cum sīs mortālis</i>, since you are mortal.</li>
<li><b>Concessive</b> ('although'): <b>subjunctive</b>, often with <i>tamen</i> in the main clause: <i>cum dīves esset, tamen avārus erat</i>.</li>
</ul>
<p>Rule of thumb for past narrative: <i>cum</i> + subjunctive = 'when/since/although'; <i>cum</i> + indicative = 'at the exact time when' or 'whenever' (<i>cum</i> iterative, with indicative perfect/pluperfect: <i>cum rosam vīderat, vēr incipere arbitrābātur</i>). <i>Cum ... tum</i> = 'both ... and', 'not only ... but also'. 'Inverted' <i>cum</i> with indicative introduces the main event after a time clause: <i>iam advesperāscēbat cum hostēs appāruērunt</i>.</p>
<p class="ex"><i>Cum tacent, clāmant.</i><br>When they are silent, they shout (their silence speaks). (temporal, indicative)</p>
<p class="ex"><i>Cum hostēs appropinquārent, cīvēs portās clausērunt.</i><br>When the enemy were approaching, the citizens shut the gates. (circumstantial)</p>
<p class="ex"><i>Cum id scīret, nihil dīxit.</i><br>Although he knew it, he said nothing. (concessive)</p>
<p class="ex"><i>Cum aeger essem, domī mānsī.</i><br>Since I was ill, I stayed at home. (causal)</p>
<p class="ex"><i>Cum Rōmam vēnerō, tē vīsam.</i><br>When I come to Rome, I shall visit you. (temporal, future perfect indicative)</p>
<p class="ex"><i>Cum Caesar in Galliā erat, Cicerō Rōmae manēbat.</i><br>At the time when Caesar was in Gaul, Cicero stayed in Rome. (pure temporal)</p>`
},
{
  id: "indirect-questions", title: "Indirect questions and the sequence of tenses", group: "Syntax",
  html: `
<p>A question reported after a verb of asking, knowing, telling or wondering (<i>rogō, quaerō, sciō, nesciō, dīcō, dubitō, mīror</i>) is an <b>indirect question</b>. It keeps its interrogative word (<i>quis, quid, cūr, ubi, quandō, quōmodo, num, -ne, utrum ... an</i>) and puts its verb in the <b>subjunctive</b>: <i>Rogō quid faciās</i>, I ask what you are doing. 'Whether' is <i>num</i> or <i>-ne</i>; 'whether ... or' is <i>utrum ... an</i>; 'or not' is <i>annōn</i> (direct) / <i>necne</i> (indirect).</p>
<p>The tense of the subjunctive follows the <b>sequence of tenses</b>, which governs most subordinate subjunctives (purpose, indirect question, indirect command, cum clauses):</p>
<table class="abbr">
<tr><td><b>Main verb</b></td><td><b>Same time or later</b></td><td><b>Earlier</b></td></tr>
<tr><td>Primary (present, future, future perfect, perfect = 'have')</td><td>present subjunctive</td><td>perfect subjunctive</td></tr>
<tr><td>Historic (imperfect, perfect = simple past, pluperfect)</td><td>imperfect subjunctive</td><td>pluperfect subjunctive</td></tr>
</table>
<p>Future time in an indirect question is expressed by the future participle + <i>sim / essem</i>: <i>rogō quid factūrus sīs</i>, I ask what you will do.</p>
<p class="ex"><i>Rogō quis sīs.</i><br>I ask who you are. (primary, same time)</p>
<p class="ex"><i>Rogāvī quis essēs.</i><br>I asked who you were. (historic, same time)</p>
<p class="ex"><i>Sciō quid fēcerīs.</i><br>I know what you did. (primary, earlier)</p>
<p class="ex"><i>Nesciēbam cūr abiisset.</i><br>I did not know why he had left. (historic, earlier)</p>
<p class="ex"><i>Quaerit num Caesar vēnerit.</i><br>He asks whether Caesar has come.</p>
<p class="ex"><i>Dubitō utrum maneam an discēdam.</i><br>I am in doubt whether to stay or leave.</p>
<p class="ex"><i>Dīc mihi ubi habitēs.</i><br>Tell me where you live.</p>
<p>Contrast the direct question <i>Quid facis?</i> (indicative) with the indirect <i>Rogō quid faciās</i>. Verbs like <i>sciō</i> can also take indirect statement (<i>sciō tē venīre</i>) — the difference is whether a question word is present.</p>`
},
{
  id: "conditions", title: "Conditional sentences", group: "Syntax",
  html: `
<p>A condition has an <i>if</i>-clause (the <b>protasis</b>, introduced by <b>sī</b>, negative <b>nisi</b> 'unless' or <b>sī nōn</b>) and a main clause (the <b>apodosis</b>). The mood and tense show how real the speaker thinks the condition is.</p>
<ul>
<li><b>Simple / factual</b> (open): <b>indicative</b> in both clauses, any tense. <i>Sī hoc dīcis, errās</i> — if you say this, you are wrong. Latin is precise about time: <i>sī vēnerit, gaudēbō</i> (future perfect + future), if he comes, I shall rejoice.</li>
<li><b>Future less vivid</b> ('should ... would'): <b>present subjunctive</b> in both. <i>Sī hoc dīcās, errēs</i> — if you were to say this, you would be wrong.</li>
<li><b>Contrary to fact, present</b>: <b>imperfect subjunctive</b> in both. <i>Sī hoc dīcerēs, errārēs</i> — if you were (now) saying this, you would be wrong (but you are not).</li>
<li><b>Contrary to fact, past</b>: <b>pluperfect subjunctive</b> in both. <i>Sī hoc dīxissēs, errāvissēs</i> — if you had said this, you would have been wrong.</li>
</ul>
<p>Mixed conditions combine types as the sense requires (<i>sī hoc fēcissēs, nunc beātus essēs</i>: if you had done this, you would now be happy). <i>Sī quis, sī quid</i> = 'if anyone, if anything'. <i>Sīve ... sīve</i> = 'whether ... or'. <i>Dum, modo, dummodo</i> + subjunctive = 'provided that'. In indirect statement the apodosis becomes an infinitive (future participle + <i>fuisse</i> for the past unreal).</p>
<p class="ex"><i>Sī pluit, domī maneō.</i><br>If it rains, I stay at home. (open, present)</p>
<p class="ex"><i>Sī id fēceris, poenās dabis.</i><br>If you do that, you will be punished. (future perfect + future)</p>
<p class="ex"><i>Sī veniās, laetus sim.</i><br>If you were to come, I would be glad. (future less vivid)</p>
<p class="ex"><i>Sī dīves essem, multōs librōs emerem.</i><br>If I were rich, I would buy many books. (present contrary to fact)</p>
<p class="ex"><i>Sī hoc scīvissem, nōn vēnissem.</i><br>If I had known this, I would not have come. (past contrary to fact)</p>
<p class="ex"><i>Nisi Caesar adfuisset, castra capta essent.</i><br>Had Caesar not been present, the camp would have been taken.</p>`
},
{
  id: "relative-clauses", title: "Relative clauses", group: "Syntax",
  html: `
<p>A relative clause is introduced by <b>quī, quae, quod</b> (or a relative adverb <i>ubi, unde, quō</i>) and describes an <b>antecedent</b> in the main clause. The relative agrees with its antecedent in <b>gender and number</b>, but its <b>case</b> depends on its role inside the relative clause. The antecedent is often <i>is, ea, id</i>, and may be omitted altogether: <i>quī tacet, cōnsentit</i>, (he) who is silent consents.</p>
<p>A relative clause with the <b>indicative</b> simply states a fact about the antecedent. With the <b>subjunctive</b> it acquires an extra meaning:</p>
<ul>
<li><b>Purpose</b>: <i>mīsit mīlitēs quī urbem dēfenderent</i> — he sent soldiers to defend the city.</li>
<li><b>Characteristic / generic</b> (the kind of person who): <i>sunt quī dīcant</i>, there are people who say; <i>nēmō est quī nesciat</i>, there is no one who does not know; <i>dignus quī laudētur</i>, worthy to be praised.</li>
<li><b>Cause</b> (often with <i>quippe</i> or <i>ut</i>): <i>mē miserum, quī hoc fēcerim</i> — wretched me, who did this.</li>
<li><b>Result</b> after <i>tam, tālis, tantus</i>: <i>nōn is sum quī terrear</i>, I am not the kind of man to be frightened.</li>
<li>Any subordinate clause inside indirect statement or another subjunctive clause.</li>
</ul>
<p>The <b>connecting relative</b> begins a sentence and refers to the previous one, equivalent to <i>et is</i>: <i>Quod cum audīvisset...</i>, and when he had heard this... <b>Quīcumque, quisquis</b> = whoever; <b>ubi, unde, quō</b> = where, whence, whither.</p>
<p class="ex"><i>Vir quem vīdistī est frāter meus.</i><br>The man whom you saw is my brother. (indicative; acc. object of vīdistī)</p>
<p class="ex"><i>Fēmina cuius fīlius abest trīstis est.</i><br>The woman whose son is away is sad.</p>
<p class="ex"><i>Lēgātōs mīsit quī pācem peterent.</i><br>He sent envoys who were to ask for peace. (purpose)</p>
<p class="ex"><i>Nihil est quod timeās.</i><br>There is nothing (of the sort) that you should fear. (characteristic)</p>
<p class="ex"><i>Quae cum ita sint, discēdam.</i><br>Since these things are so, I shall depart. (connecting relative)</p>
<p class="ex"><i>Urbs in quā habitō antīqua est.</i><br>The city in which I live is ancient.</p>`
},
{
  id: "gerund-gerundive", title: "Gerund, gerundive and the passive periphrastic", group: "Syntax",
  html: `
<p>The <b>gerund</b> is a <b>verbal noun</b>, neuter, found only in the genitive, dative, accusative (after a preposition) and ablative singular: <i>amandī, amandō, (ad) amandum, amandō</i> — 'loving'. The nominative (and accusative as object) is supplied by the infinitive: <i>amāre dulce est</i>. It is active in sense and may take an object, though Latin prefers the gerundive construction.</p>
<p>The <b>gerundive</b> is a <b>verbal adjective</b>, <i>amandus, -a, -um</i>, passive in meaning: 'to be loved', 'needing to be loved'. It agrees with a noun and is used:</p>
<ul>
<li>Instead of gerund + object: <i>ad pācem petendam</i> (rather than <i>ad petendum pācem</i>), for seeking peace; <i>lībertātis recuperandae causā</i>, for the sake of recovering freedom.</li>
<li>In the <b>passive periphrastic</b>: gerundive + <i>sum</i> expresses <b>obligation or necessity</b>: <i>Carthāgō dēlenda est</i>, Carthage must be destroyed. The person who must act goes in the <b>dative of agent</b>: <i>mihi</i>, by me. Intransitive verbs are used impersonally: <i>mihi eundum est</i>, I must go; <i>pārendum est lēgibus</i>, the laws must be obeyed.</li>
<li>After <i>cūrō, dō, trādō</i> to express purpose: <i>pontem faciendum cūrāvit</i>, he had a bridge built.</li>
</ul>
<p>Forms: present stem + <i>-nd-</i>: <i>ama-ndus, mone-ndus, reg-endus, capi-endus, audi-endus</i>; deponents also have them (<i>sequendus</i>).</p>
<p class="ex"><i>Ars scrībendī difficilis est.</i><br>The art of writing is difficult. (gerund, genitive)</p>
<p class="ex"><i>Legendō discimus.</i><br>We learn by reading. (gerund, ablative of means)</p>
<p class="ex"><i>Ad urbem dēfendendam vēnērunt.</i><br>They came to defend the city. (ad + gerundive)</p>
<p class="ex"><i>Liber mihi legendus est.</i><br>The book must be read by me = I must read the book. (passive periphrastic)</p>
<p class="ex"><i>Omnibus moriendum est.</i><br>Everyone must die. (impersonal periphrastic)</p>
<p class="ex"><i>Caesar pontem in Rhēnō faciendum cūrāvit.</i><br>Caesar had a bridge built over the Rhine.</p>
<p class="ex"><i>Haec erant dīcenda.</i><br>These things had to be said.</p>`
},
{
  id: "participles", title: "Participles", group: "Syntax",
  html: `
<p>A participle is a <b>verbal adjective</b>: it agrees with a noun like an adjective but keeps the verb's ideas of time and voice. Latin has three (four with the gerundive):</p>
<ul>
<li><b>Present active</b> <i>amāns, amantis</i> ('loving'): present stem + <i>-ns</i>; declined as a one-termination 3rd declension adjective (abl. <i>-e</i> when used as a true participle, <i>-ī</i> as an adjective). Time: <b>same</b> as the main verb.</li>
<li><b>Perfect passive</b> <i>amātus, -a, -um</i> ('having been loved', 'loved'): fourth principal part, declined like <i>bonus</i>. Time: <b>before</b> the main verb. For deponents it is active in sense: <i>secūtus</i>, having followed — the only Latin perfect <i>active</i> participle.</li>
<li><b>Future active</b> <i>amātūrus, -a, -um</i> ('about to love', 'intending to love'): participial stem + <i>-ūrus</i>. Time: <b>after</b> the main verb. With <i>sum</i> it forms the active periphrastic: <i>ventūrus est</i>, he is going to come.</li>
<li><b>Future passive</b> = gerundive <i>amandus</i> ('to be loved'): see the gerundive chapter.</li>
</ul>
<p>Participles are used far more than in English. A participle agreeing with a noun in the sentence often replaces an English subordinate clause: temporal, causal, concessive, conditional, or relative. Translate with 'when, since, although, if, who' as the context suggests, keeping the relative time. When its noun is not part of the main clause, the participle appears in the ablative absolute.</p>
<p class="ex"><i>Mīlitēs pugnantēs vīdimus.</i><br>We saw the soldiers (while they were) fighting.</p>
<p class="ex"><i>Urbem captam incendērunt.</i><br>They burned the city after capturing it (lit. the captured city).</p>
<p class="ex"><i>Puer, ā magistrō laudātus, gaudēbat.</i><br>The boy, because he had been praised by the teacher, was glad.</p>
<p class="ex"><i>Moritūrī tē salūtant.</i><br>Those about to die salute you.</p>
<p class="ex"><i>Hostēs secūtī, in castra pervēnimus.</i><br>Having followed the enemy, we reached the camp. (deponent perfect participle, active)</p>
<p class="ex"><i>Timēns nē caperētur, fūgit.</i><br>Fearing that he would be captured, he fled.</p>
<p class="ex"><i>Caesar, haec dicēns, mīlitēs hortātus est.</i><br>Caesar, saying these things, encouraged the soldiers.</p>`
},
{
  id: "deponents", title: "Deponent and semi-deponent verbs", group: "Syntax",
  html: `
<p>A <b>deponent</b> verb has <b>passive forms but active meanings</b>: <i>hortor</i>, I urge (not 'I am urged'); <i>sequor</i>, I follow. The name comes from <i>dēpōnere</i>, to lay aside — they have 'laid aside' their active forms. They occur in every conjugation and are recognized in the dictionary by the principal parts, which are all passive in shape: <i>hortor, hortārī, hortātus sum</i> (1st); <i>vereor, verērī, veritus sum</i> (2nd); <i>sequor, sequī, secūtus sum</i> (3rd); <i>patior, patī, passus sum</i> (3rd -iō); <i>potior, potīrī, potītus sum</i> (4th).</p>
<p>Points to remember:</p>
<ul>
<li>The forms are exactly those of the passive of a regular verb: <i>sequor, sequeris, sequitur ... secūtus sum, secūtus eram</i>.</li>
<li>Four forms are <b>active in shape</b> but kept: the present participle (<i>sequēns</i>), future participle (<i>secūtūrus</i>), future infinitive (<i>secūtūrus esse</i>) and gerund (<i>sequendī</i>). The gerundive (<i>sequendus</i>) is passive in meaning as usual.</li>
<li>The <b>perfect participle</b> is <b>active</b> in meaning: <i>secūtus</i>, having followed — a resource regular verbs lack.</li>
<li>The imperative: <i>sequere!</i> follow! (looks like an active infinitive); plural <i>sequiminī!</i></li>
<li>Deponents cannot form a passive; a few can be used passively in the gerundive only.</li>
</ul>
<p><b>Semi-deponents</b> are active in the present system but deponent in the perfect system: <i>audeō, audēre, ausus sum</i> (dare); <i>gaudeō, gaudēre, gāvīsus sum</i> (rejoice); <i>soleō, solēre, solitus sum</i> (be accustomed); <i>fīdō, fīdere, fīsus sum</i> (trust) and its compounds <i>cōnfīdō, diffīdō</i>. <i>Revertor</i> is the reverse: deponent in the present system, active in the perfect (<i>revertī</i>).</p>
<p>Five deponents govern the <b>ablative</b>: <i>ūtor</i> (use), <i>fruor</i> (enjoy), <i>fungor</i> (perform), <i>potior</i> (gain possession of), <i>vēscor</i> (feed on).</p>
<p class="ex"><i>Mīlitēs ducem secūtī sunt.</i><br>The soldiers followed their leader.</p>
<p class="ex"><i>Hortātur nōs ut maneāmus.</i><br>He urges us to stay.</p>
<p class="ex"><i>Multa passus, tandem rediit.</i><br>Having suffered much, he at last returned.</p>
<p class="ex"><i>Nōn ausus est loquī.</i><br>He did not dare to speak. (semi-deponent)</p>
<p class="ex"><i>Gladiō ūtitur.</i><br>He uses a sword. (ablative with ūtor)</p>
<p class="ex"><i>Sequere mē!</i><br>Follow me!</p>`
},
{
  id: "impersonal-verbs", title: "Impersonal verbs", group: "Syntax",
  html: `
<p>An <b>impersonal</b> verb is used only in the <b>3rd person singular</b> (and the infinitive), with no personal subject — English supplies 'it'. The main groups:</p>
<ul>
<li><b>Weather</b>: <i>pluit</i> it rains, <i>ningit</i> it snows, <i>tonat</i> it thunders, <i>lūcēscit</i> it grows light.</li>
<li><b>Feeling</b>, with <b>accusative of the person</b> and <b>genitive of the cause</b>: <i>mē paenitet</i> I repent, <i>mē pudet</i> I am ashamed, <i>mē miseret</i> I pity, <i>mē taedet</i> I am tired of, <i>mē piget</i> it irks me. <i>Mē pudet factī</i>, I am ashamed of the deed.</li>
<li><b>Permission, obligation, happening</b>, with <b>dative of the person</b>: <i>licet</i> it is allowed, <i>libet</i> it pleases, <i>placet</i> it is decided, <i>accidit, contingit, ēvenit</i> it happens, <i>expedit</i> it is expedient. <i>Licet mihi īre</i>, I may go.</li>
<li><b>With accusative + infinitive</b>: <i>oportet</i> it is right/one ought, <i>decet</i> it is fitting, <i>dēdecet</i>, <i>iuvat</i> it delights, <i>necesse est</i>. <i>Oportet mē īre</i>, I ought to go.</li>
<li><b>Interest</b>: <i>interest, rēfert</i> it concerns — the person in the <b>genitive</b> (or the ablative feminine of the possessive: <i>meā, tuā, nostrā interest</i>), the thing as an infinitive or <i>ut</i>-clause.</li>
<li><b>Passive of intransitive verbs</b>: <i>pugnātur</i> there is fighting, <i>itur</i> one goes, <i>mihi crēditur</i> I am believed, <i>ventum est</i> they came, <i>mihi persuāsum est</i> I was persuaded. The passive periphrastic of intransitives is also impersonal: <i>eundum est</i>.</li>
</ul>
<p>In the dictionary, impersonal verbs are entered under the 3rd singular (<i>licet, licēre, licuit</i>) and their tables show only the 3rd person.</p>
<p class="ex"><i>Tōtā nocte pluit.</i><br>It rained all night.</p>
<p class="ex"><i>Mē paenitet stultitiae meae.</i><br>I regret my foolishness.</p>
<p class="ex"><i>Licet tibi abīre.</i><br>You may leave.</p>
<p class="ex"><i>Oportet nōs lēgibus pārēre.</i><br>We ought to obey the laws.</p>
<p class="ex"><i>Omnium interest rem pūblicam salvam esse.</i><br>It is in everyone's interest that the state be safe.</p>
<p class="ex"><i>Ācriter ab utrīsque pugnātum est.</i><br>There was fierce fighting on both sides.</p>`
},
{
  id: "questions", title: "Questions", group: "Syntax",
  html: `
<p>Latin marks a direct yes/no question with a <b>particle</b>, since there is no change of word order and no question mark in ancient texts:</p>
<ul>
<li><b>-ne</b> attached to the first (emphasized) word: a neutral question, no answer expected. <i>Vidēsne?</i> Do you see? <i>Tūne hoc fēcistī?</i> Did <i>you</i> do this?</li>
<li><b>nōnne</b>: expects the answer 'yes'. <i>Nōnne vidēs?</i> Surely you see? / Don't you see?</li>
<li><b>num</b>: expects the answer 'no'. <i>Num vidēs?</i> You don't see, do you?</li>
<li>No particle at all, with questioning tone, is common in conversation: <i>Vīs?</i> You want to?</li>
</ul>
<p><b>Alternative questions</b>: <i>utrum ... an</i>, <i>-ne ... an</i>, or just <i>... an</i>: <i>Utrum manēs an abīs?</i> Are you staying or leaving? 'Or not' at the end is <i>annōn</i>. <b>Question words</b> ask for information: <i>quis, quid</i> (who, what), <i>cūr, quārē</i> (why), <i>ubi</i> (where), <i>quō</i> (whither), <i>unde</i> (whence), <i>quandō</i> (when), <i>quōmodo</i> (how), <i>quam</i> (how + adj.), <i>quot</i> (how many), <i>quotiēns</i> (how often), <i>quālis</i> (of what kind), <i>quantus</i> (how great), <i>uter</i> (which of two).</p>
<p>Latin has no word for 'yes' or 'no'. Answers repeat the verb (<i>Vidēs? — Videō / Nōn videō</i>) or use <i>ita, etiam, sānē, vērō, certē</i> (yes) and <i>nōn, minimē, nūllō modō</i> (no).</p>
<p><b>Deliberative questions</b> ('what am I to do?') take the subjunctive: <i>Quid faciam?</i> <b>Indirect questions</b> take the subjunctive and use <i>num</i> or <i>-ne</i> for 'whether', <i>necne</i> for 'or not': see that chapter.</p>
<p class="ex"><i>Venitne frāter tuus?</i><br>Is your brother coming?</p>
<p class="ex"><i>Nōnne Rōma pulchra est?</i><br>Isn't Rome beautiful? (expects yes)</p>
<p class="ex"><i>Num hoc crēdis?</i><br>You don't believe this, do you? (expects no)</p>
<p class="ex"><i>Utrum pācem an bellum vultis?</i><br>Do you want peace or war?</p>
<p class="ex"><i>Quid agis? — Bene.</i><br>How are you? — Well.</p>
<p class="ex"><i>Quid faciāmus?</i><br>What are we to do? (deliberative subjunctive)</p>`
},
{
  id: "commands", title: "Commands, prohibitions and wishes", group: "Syntax",
  html: `
<p><b>Positive commands</b> to 'you' use the <b>imperative</b>: singular <i>amā, monē, rege, cape, audī</i>; plural <i>amāte, monēte, regite, capite, audīte</i>. Four 3rd conjugation verbs drop the final <i>-e</i>: <b>dīc, dūc, fac, fer</b>. Deponents: <i>sequere, sequiminī</i>. The <b>future imperative</b> (<i>amātō, amātōte; amantō</i>) is used in laws, maxims and for commands referring to the future: <i>Salūs populī suprēma lēx estō</i>.</p>
<p><b>Prohibitions</b> (negative commands) to 'you' are not expressed by <i>nōn</i> + imperative in classical prose. Instead:</p>
<ul>
<li><b>nōlī / nōlīte</b> + infinitive: <i>Nōlī timēre!</i> Don't be afraid! (literally 'be unwilling to fear').</li>
<li><b>nē</b> + <b>perfect subjunctive</b>: <i>Nē timuerīs!</i> Don't fear!</li>
<li><b>cavē (nē)</b> + subjunctive: <i>Cavē cadās!</i> Mind you don't fall!</li>
<li>Poetry allows <i>nē</i> + imperative: <i>nē crēde</i>.</li>
</ul>
<p>Commands to the 1st or 3rd person use the <b>jussive / hortatory subjunctive</b> (present), negative <b>nē</b>: <i>Eāmus!</i> Let us go! <i>Nē veniat!</i> Let him not come! <i>Vīvāmus, mea Lesbia, atque amēmus.</i></p>
<p><b>Indirect commands</b> after verbs of ordering, asking, persuading (<i>imperō, rogō, ōrō, moneō, persuādeō, hortor, petō</i>): <b>ut</b> / <b>nē</b> + subjunctive: <i>Imperāvit mīlitibus ut pugnārent</i>. But <i>iubeō</i> (order) and <i>vetō</i> (forbid) take the accusative and infinitive: <i>Iussit mīlitēs pugnāre</i>.</p>
<p><b>Wishes</b> use the subjunctive, usually with <b>utinam</b>: present for the future ('may it be'), imperfect for the present unfulfilled, pluperfect for the past unfulfilled; negative <i>nē</i>.</p>
<p class="ex"><i>Dā mihi bāsia mīlle.</i><br>Give me a thousand kisses.</p>
<p class="ex"><i>Dīc mihi vērum.</i><br>Tell me the truth.</p>
<p class="ex"><i>Nōlīte discēdere!</i><br>Do not leave! (plural)</p>
<p class="ex"><i>Nē hoc fēceris.</i><br>Don't do this.</p>
<p class="ex"><i>Caesar mīlitibus imperāvit nē fugerent.</i><br>Caesar ordered the soldiers not to flee.</p>
<p class="ex"><i>Utinam venīret!</i><br>If only he were coming!</p>
<p class="ex"><i>Utinam nē id dīxissem!</i><br>If only I had not said that!</p>`
},
{
  id: "time-place", title: "Expressions of time, place and space", group: "Syntax",
  html: `
<p><b>Time</b></p>
<ul>
<li><b>Time when</b> or <b>within which</b>: <b>ablative</b>, no preposition: <i>eō diē</i> on that day; <i>hieme</i> in winter; <i>tribus diēbus</i> within three days; <i>paucīs annīs</i> in a few years.</li>
<li><b>Duration</b> (how long): <b>accusative</b>: <i>trēs annōs</i> for three years; <i>tōtam noctem</i> all night; <i>multōs annōs</i> for many years. Also <i>per</i> + acc. for emphasis.</li>
<li><b>Age</b>: <i>decem annōs nātus</i>, ten years old. <b>Ago</b>: <i>abhinc trēs annōs</i>. <b>Before/after</b>: <i>tribus ante annīs / paucīs post diēbus</i> (ablative of degree of difference), or <i>ante/post</i> + accusative.</li>
</ul>
<p><b>Place</b> — with most nouns a preposition is required:</p>
<ul>
<li><b>Place where</b>: <i>in</i> + ablative (<i>in urbe</i>); <i>sub, prō</i> + abl.</li>
<li><b>Place to which</b>: <i>ad</i> or <i>in</i> + accusative (<i>ad urbem, in Italiam</i>).</li>
<li><b>Place from which</b>: <i>ā/ab, ē/ex, dē</i> + ablative (<i>ex urbe</i>).</li>
</ul>
<p>With <b>names of towns and small islands</b>, and with <b>domus</b> (home) and <b>rūs</b> (country), no preposition is used: place to which = accusative (<i>Rōmam, domum, rūs</i>); place from which = ablative (<i>Rōmā, domō, rūre</i>); place where = <b>locative</b>, which looks like the genitive in the 1st and 2nd declension singular (<i>Rōmae, Corinthī</i>) and like the ablative elsewhere (<i>Athēnīs, Carthāgine</i>); <i>domī</i>, <i>rūrī</i>, <i>humī</i> (on the ground).</p>
<p><b>Space</b>: extent (how far, how long/wide/high) in the <b>accusative</b>: <i>decem pedēs altus</i>, ten feet high; <i>mīlia passuum tria</i>, three miles. Distance may also be ablative: <i>tribus mīlibus passuum</i>.</p>
<p class="ex"><i>Prīmā lūce profectī sunt.</i><br>They set out at dawn. (time when)</p>
<p class="ex"><i>Multōs annōs in Galliā mānsit.</i><br>He stayed in Gaul for many years. (duration; place where)</p>
<p class="ex"><i>Rōmā Athēnās nāvigāvit.</i><br>He sailed from Rome to Athens. (towns: no preposition)</p>
<p class="ex"><i>Domī sum; domum eō; domō exeō.</i><br>I am at home; I go home; I leave home.</p>
<p class="ex"><i>Mūrus vīgintī pedēs altus erat.</i><br>The wall was twenty feet high.</p>
<p class="ex"><i>Castra tria mīlia passuum ab urbe aberant.</i><br>The camp was three miles from the city.</p>`
},
{
  id: "numbers-dates", title: "Numbers and dates: the Roman calendar", group: "Syntax",
  html: `
<p>Cardinal and ordinal numbers are listed in the numeral table (Pronouns section). Dates use <b>ordinals</b> and three fixed days in each month:</p>
<ul>
<li><b>Kalendae</b> (Kal.), the Kalends — the <b>1st</b> of every month.</li>
<li><b>Nōnae</b> (Non.), the Nones — the <b>5th</b>, but the <b>7th</b> in March, May, July and October.</li>
<li><b>Īdūs</b> (Id.), the Ides — the <b>13th</b>, but the <b>15th</b> in March, May, July and October ('In March, July, October, May, the Ides fall on the fifteenth day').</li>
</ul>
<p>These are feminine plural nouns (<i>Kalendae, -ārum</i>; <i>Nōnae, -ārum</i>; <i>Īdūs, -uum</i>, 4th declension). The month is an adjective agreeing with them: <i>Kalendīs Iānuāriīs</i>, on 1 January; <i>Īdibus Mārtiīs</i>, on 15 March.</p>
<p>Other days are counted <b>backwards</b> from the next fixed day, <b>inclusively</b> (counting both the day itself and the fixed day): the day before is <i>prīdiē</i> + accusative (<i>prīdiē Kalendās Iānuāriās</i>, 31 Dec.); earlier days use <i>ante diem</i> (a. d.) + ordinal + accusative: <i>ante diem tertium Kalendās Iānuāriās</i> (a. d. III Kal. Ian.) = 30 December. The formula: (day of fixed point + 1) − (date) for the Kalends use (days in month + 2) − date.</p>
<p>The <b>months</b>: <i>Iānuārius, Februārius, Mārtius, Aprīlis, Maius, Iūnius, Quīntīlis (Iūlius), Sextīlis (Augustus), September, Octōber, November, December</i>. The <b>year</b> was named by its consuls in the ablative absolute (<i>M. Tulliō Cicerōne C. Antōniō cōnsulibus</i> = 63 BC) or counted <i>ab urbe conditā</i> (a. u. c.) from 753 BC.</p>
<p><b>Hours</b> were counted from sunrise: <i>hōra prīma</i> ≈ 6–7 a.m., <i>hōra sexta</i> = midday. <b>Money</b>: <i>sēstertius</i> (HS), <i>dēnārius</i>; sums with <i>mīlia</i> + genitive (<i>decem mīlia sēstertium</i>).</p>
<p class="ex"><i>Kalendīs Mārtiīs nātus est.</i><br>He was born on 1 March.</p>
<p class="ex"><i>Caesar Īdibus Mārtiīs occīsus est.</i><br>Caesar was killed on the Ides (15th) of March.</p>
<p class="ex"><i>Prīdiē Nōnās Aprīlēs Rōmam vēnit.</i><br>He came to Rome on 4 April (the day before the Nones, the 5th).</p>
<p class="ex"><i>Ante diem quīntum Kalendās Decembrēs scrīpsī.</i><br>I wrote on 27 November (five days inclusive before 1 Dec.).</p>
<p class="ex"><i>Annō ab urbe conditā septingentēsimō.</i><br>In the 700th year from the founding of the city (= 54 BC).</p>
<p class="ex"><i>Hōrā sextā cibum capimus.</i><br>We eat at the sixth hour (midday).</p>`
},

/* ===================== REFERENCE ===================== */
{
  id: "reading-entry", title: "How to read an entry", group: "Reference",
  html: `
<p>Each dictionary page combines two sources. The main text is <b>Lewis &amp; Short, <i>A Latin Dictionary</i></b> (Oxford, 1879), still the fullest Latin–English dictionary in the public domain. Beneath it the line from <b>Whitaker's Words</b> supplies the grammatical code from which this app generates the complete table of forms.</p>
<p><b>A Lewis &amp; Short entry</b> runs like this: <i>ămīcus, i, m. [amo] ... I. A friend ... II. ...</i></p>
<ul>
<li><b>Headword</b> with <b>vowel quantities</b>: a macron (ā) marks a long vowel, a breve (ă) a short one; this app keeps the macrons and drops the breves (an unmarked vowel is short). A superscript number (<i>amīcus 1, amīcus 2</i>) separates homonyms — here the adjective and the noun.</li>
<li><b>Inflection</b>: for nouns the genitive ending and the <b>gender</b> (<i>m., f., n., comm.</i>); for adjectives the feminine and neuter endings (<i>a, um</i>) or the genitive (<i>īcis</i>); for verbs the perfect and supine endings and the conjugation number (<i>āvi, ātum, 1</i>) and the kind: <i>v. a.</i> = active (transitive) verb, <i>v. n.</i> = neuter (intransitive) verb, <i>v. dep.</i> = deponent, <i>v. inch.</i> = inchoative (-scō), <i>v. freq.</i> = frequentative, <i>v. impers.</i>, <i>P. a.</i> = participial adjective.</li>
<li><b>Etymology</b> in square brackets or after the inflection: the root, a Greek cognate (<i>kindr. with</i> = kindred with), or the parts of a compound.</li>
<li><b>Senses</b> in a hierarchy: <b>I., II.</b> main divisions; <b>A., B.</b> and <b>1., 2.</b> and <b>a., b.</b> subdivisions. <b>Lit.</b> = literal meaning; <b>Trop.</b> (tropically) or <b>Transf.</b> = figurative or transferred meaning; <b>In gen.</b> / <b>In partic.</b> = general / particular; <b>Absol.</b> = used absolutely, without the usual complement; <b>Meton.</b> = by metonymy; <b>Esp.</b> = especially; <b>Pregn.</b> = in a pregnant (fuller) sense.</li>
<li><b>Citations</b>: a Latin quotation in italics, then the author and work in abbreviated form with book, chapter and section (<i>Cic. Am. 21, 80</i> = Cicero, <i>Dē Amīcitiā</i> 21.80). <i>id.</i> = the same author as the previous citation; <i>ib.</i> = the same work; <i>ap.</i> = quoted in (<i>Enn. ap. Cic.</i> = Ennius as quoted by Cicero); <i>al.</i> = and others; <i>saep.</i> = often; <i>freq.</i> = frequently; <i>v. h. v.</i> = see this word; <i>q. v.</i> = which see; <i>cf.</i> = compare; <i>sc.</i> = scīlicet, namely, supply.</li>
<li><b>Period labels</b>: <i>ante-class.</i> (before Cicero), <i>class.</i>, <i>post-Aug.</i> (after Augustus), <i>late Lat.</i>, <i>eccl. Lat.</i> (Church Latin), <i>poet.</i> (poetic), <i>rare</i>, <i>dub.</i> (doubtful reading).</li>
</ul>
<p><b>The Whitaker's Words line</b> gives the stems, part of speech, declension or conjugation code, gender, and a compact gloss, plus flags for age (archaic, classical, late, medieval) and frequency. From these the app builds the full paradigm, chooses the matching model word and example set, and analyses any inflected form you type. Rare, archaic or poetic endings are shown only when you turn on 'all forms'.</p>
<p>Use the <b>(i)</b> buttons beside case and tense labels to see what that form does, with an example from a word of the same declension or conjugation and the corresponding form of the word you are looking at.</p>`
},
{
  id: "abbreviations", title: "Abbreviations in Lewis & Short", group: "Reference",
  html: `
<p><b>Authors and works</b> (the commonest; a work abbreviation follows the author).</p>
<table class="abbr">
<tr><td>Cic.</td><td>Cicero (106–43 BC). Works: <b>Att.</b> Letters to Atticus; <b>Fam.</b> Letters to his friends (ad Familiārēs); <b>Q. Fr.</b> Letters to his brother Quintus; <b>Off.</b> Dē Officiīs; <b>Tusc.</b> Tusculan Disputations; <b>Fin.</b> Dē Fīnibus; <b>N. D.</b> Dē Nātūrā Deōrum; <b>Div.</b> Dē Dīvīnātiōne; <b>Rep.</b> Dē Rē Pūblicā; <b>Leg.</b> Dē Lēgibus; <b>Lael.</b> or <b>Am.</b> Laelius dē Amīcitiā; <b>Sen.</b> Catō Maior dē Senectūte; <b>de Or.</b> Dē Ōrātōre; <b>Or.</b> Ōrātor; <b>Brut.</b> Brūtus; <b>Inv.</b> Dē Inventiōne; <b>Ac.</b> Acadēmica; <b>Par.</b> Paradoxa. Speeches: <b>Verr.</b> against Verres; <b>Cat.</b> against Catiline; <b>Phil.</b> Philippics; <b>Mil.</b> for Milo; <b>Mur.</b> for Murena; <b>Sest.</b> for Sestius; <b>Arch.</b> for Archias; <b>Rosc. Am.</b> for Roscius of Ameria; <b>Caecin.</b>, <b>Clu.</b> (Cluentius), <b>Deiot.</b>, <b>Dom.</b>, <b>Fl.</b> (Flaccus), <b>Font.</b>, <b>Har. Resp.</b>, <b>Lig.</b>, <b>Marcell.</b>, <b>Pis.</b>, <b>Planc.</b>, <b>Quint.</b> (for Quinctius), <b>Rab.</b>, <b>Sull.</b>, <b>Vatin.</b>, <b>Agr.</b> (dē Lēge Agrāriā), <b>Imp. Pomp.</b> / <b>Manil.</b> (dē Imperiō Cn. Pompeī)</td></tr>
<tr><td>Caes.</td><td>Caesar. <b>B. G.</b> Bellum Gallicum (Gallic War); <b>B. C.</b> Bellum Cīvīle</td></tr>
<tr><td>Verg.</td><td>Virgil. <b>A.</b> Aeneid; <b>E.</b> Eclogues; <b>G.</b> Georgics; <b>Cul.</b> Culex, <b>Cir.</b> Ciris (Appendix)</td></tr>
<tr><td>Hor.</td><td>Horace. <b>C.</b> Carmina (Odes); <b>S.</b> Satires (Sermōnēs); <b>Ep.</b> Epistles; <b>Epod.</b> Epodes; <b>A. P.</b> Ars Poētica; <b>C. S.</b> Carmen Saeculāre</td></tr>
<tr><td>Ov.</td><td>Ovid. <b>M.</b> Metamorphoses; <b>F.</b> Fastī; <b>H.</b> Hērōides; <b>Am.</b> Amōrēs; <b>A. A.</b> Ars Amātōria; <b>R. Am.</b> Remedia Amōris; <b>Tr.</b> Trīstia; <b>P.</b> Epistulae ex Pontō; <b>Hal.</b> Halieutica; <b>Ib.</b> Ībis</td></tr>
<tr><td>Liv.</td><td>Livy, Ab Urbe Conditā (book, chapter, section)</td></tr>
<tr><td>Plaut.</td><td>Plautus. Plays: <b>Am.</b> Amphitruō; <b>As.</b> Asināria; <b>Aul.</b> Aululāria; <b>Bacch.</b> Bacchidēs; <b>Capt.</b> Captīvī; <b>Cas.</b> Casina; <b>Cist.</b> Cistellāria; <b>Curc.</b> Curculiō; <b>Ep.</b> Epidicus; <b>Men.</b> Menaechmī; <b>Merc.</b> Mercātor; <b>Mil.</b> Mīles Glōriōsus; <b>Most.</b> Mostellāria; <b>Pers.</b> Persa; <b>Poen.</b> Poenulus; <b>Ps.</b> Pseudolus; <b>Rud.</b> Rudēns; <b>Stich.</b> Stichus; <b>Trin.</b> Trinummus; <b>Truc.</b> Truculentus</td></tr>
<tr><td>Ter.</td><td>Terence. <b>And.</b> Andria; <b>Heaut.</b> Heautontīmōrūmenos; <b>Eun.</b> Eunūchus; <b>Phorm.</b> Phormiō; <b>Hec.</b> Hecyra; <b>Ad.</b> Adelphoe</td></tr>
<tr><td>Tac.</td><td>Tacitus. <b>A.</b> Annals; <b>H.</b> Histories; <b>G.</b> Germānia; <b>Agr.</b> Agricola; <b>Or.</b> / <b>Dial.</b> Dialogus dē Ōrātōribus</td></tr>
<tr><td>Sall.</td><td>Sallust. <b>C.</b> Catilīna; <b>J.</b> Jugurtha; <b>H.</b> Histories (fragments)</td></tr>
<tr><td>Quint.</td><td>Quintilian, Īnstitūtiō Ōrātōria; <b>Decl.</b> Dēclāmātiōnēs</td></tr>
<tr><td>Sen.</td><td>Seneca the Younger. <b>Ep.</b> Epistles; <b>Ben.</b> Dē Beneficiīs; <b>Clem.</b> Dē Clēmentiā; <b>Ira</b>; <b>Brev. Vit.</b>; <b>Const.</b>; <b>Prov.</b>; <b>Tranq.</b>; <b>Vit. Beat.</b>; <b>Q. N.</b> Quaestiōnēs Nātūrālēs; tragedies <b>Med.</b>, <b>Herc. Fur.</b>, <b>Phaedr.</b>, <b>Thyest.</b>, <b>Troad.</b>, <b>Oedip.</b>, <b>Agam.</b>, <b>Herc. Oet.</b>, <b>Octav.</b>. <b>Sen. Rhet.</b> or <b>Sen. Contr.</b> = Seneca the Elder</td></tr>
<tr><td>Plin.</td><td>Pliny the Elder, <b>N. H.</b> Nātūrālis Historia (or simply Plin. + book, chapter, §)</td></tr>
<tr><td>Plin. Ep. / Plin. Pan.</td><td>Pliny the Younger, Letters; Panēgyricus</td></tr>
<tr><td>Mart.</td><td>Martial, Epigrams</td></tr>
<tr><td>Juv.</td><td>Juvenal, Satires</td></tr>
<tr><td>Cat.</td><td>Catullus (Catull.)</td></tr>
<tr><td>Tib.</td><td>Tibullus</td></tr>
<tr><td>Prop.</td><td>Propertius</td></tr>
<tr><td>Lucr.</td><td>Lucretius, Dē Rērum Nātūrā</td></tr>
<tr><td>Nep.</td><td>Cornelius Nepos (Lives: <b>Att.</b>, <b>Hann.</b>, <b>Them.</b>, <b>Alcib.</b> etc.)</td></tr>
<tr><td>Curt.</td><td>Curtius Rufus, History of Alexander</td></tr>
<tr><td>Gell.</td><td>Aulus Gellius, Noctēs Atticae</td></tr>
<tr><td>Suet.</td><td>Suetonius, Lives of the Caesars (<b>Caes., Aug., Tib., Calig., Claud., Ner., Galb., Oth., Vit., Vesp., Tit., Dom.</b>); <b>Gram.</b>, <b>Rhet.</b></td></tr>
<tr><td>Vulg.</td><td>Vulgate Bible (book, chapter, verse)</td></tr>
<tr><td>Varr.</td><td>Varro. <b>L. L.</b> Dē Linguā Latīnā; <b>R. R.</b> Dē Rē Rūsticā</td></tr>
<tr><td>Col.</td><td>Columella, Dē Rē Rūsticā</td></tr>
<tr><td>Vitr.</td><td>Vitruvius, Dē Architectūrā</td></tr>
<tr><td>Cels.</td><td>Celsus, Dē Medicīnā</td></tr>
<tr><td>Petr.</td><td>Petronius, Satyricon</td></tr>
<tr><td>Pers.</td><td>Persius, Satires</td></tr>
<tr><td>Luc.</td><td>Lucan, Bellum Cīvīle (Pharsalia)</td></tr>
<tr><td>Stat.</td><td>Statius. <b>Th.</b> Thēbais; <b>S.</b> Silvae; <b>Ach.</b> Achillēis</td></tr>
<tr><td>Val. Fl.</td><td>Valerius Flaccus, Argonautica</td></tr>
<tr><td>Sil.</td><td>Silius Italicus, Pūnica</td></tr>
<tr><td>Val. Max.</td><td>Valerius Maximus</td></tr>
<tr><td>Vell.</td><td>Velleius Paterculus</td></tr>
<tr><td>Flor.</td><td>Florus</td></tr>
<tr><td>Just.</td><td>Justinus</td></tr>
<tr><td>Amm.</td><td>Ammianus Marcellinus</td></tr>
<tr><td>Aus.</td><td>Ausonius</td></tr>
<tr><td>Claud.</td><td>Claudian</td></tr>
<tr><td>Prud.</td><td>Prudentius</td></tr>
<tr><td>Hier.</td><td>Jerome (Hieronymus)</td></tr>
<tr><td>Aug.</td><td>Augustine (<b>Civ. Dei</b>, <b>Conf.</b>)</td></tr>
<tr><td>Tert.</td><td>Tertullian</td></tr>
<tr><td>Lact.</td><td>Lactantius</td></tr>
<tr><td>Ambros.</td><td>Ambrose</td></tr>
<tr><td>Enn.</td><td>Ennius (fragments, often <i>ap.</i> Cicero)</td></tr>
<tr><td>Cato</td><td>Cato the Elder, <b>R. R.</b> Dē Agrī Cultūrā; <b>Orig.</b></td></tr>
<tr><td>Lucil.</td><td>Lucilius (fragments)</td></tr>
<tr><td>Pac. / Att. / Naev. / Caecil.</td><td>Pacuvius, Accius, Naevius, Caecilius (early dramatists, fragments)</td></tr>
<tr><td>Phaedr.</td><td>Phaedrus, Fables</td></tr>
<tr><td>Hirt.</td><td>Hirtius (B. G. 8, B. Alex., B. Afr., B. Hisp.)</td></tr>
<tr><td>Front.</td><td>Frontinus (Strat., Aquaed.)</td></tr>
<tr><td>Dig.</td><td>Digesta (Justinian's Digest); <b>Cod.</b> Codex; <b>Inst.</b> Institutes; <b>Gai.</b> Gaius; <b>Ulp.</b> Ulpian; <b>Paul.</b> Paulus; <b>Pap.</b> Papinian</td></tr>
<tr><td>Inscr.</td><td>inscriptions (<b>Orell.</b>, <b>Grut.</b>, <b>Fabr.</b> = collections)</td></tr>
<tr><td>Fest. / Paul. ex Fest.</td><td>Festus, Dē Verbōrum Significātū (and Paulus' epitome)</td></tr>
<tr><td>Non.</td><td>Nonius Marcellus</td></tr>
<tr><td>Prisc. / Charis. / Diom. / Don. / Serv.</td><td>the grammarians Priscian, Charisius, Diomedes, Donatus; Servius' commentary on Virgil</td></tr>
<tr><td>Isid.</td><td>Isidore of Seville, Orīginēs</td></tr>
<tr><td>Macr.</td><td>Macrobius, Saturnālia</td></tr>
<tr><td>Fragm.</td><td>fragments</td></tr>
</table>
<p><b>Citation and reference abbreviations</b></p>
<table class="abbr">
<tr><td>ap.</td><td><i>apud</i>, 'in (the work of)': a fragment quoted by a later author</td></tr>
<tr><td>id.</td><td><i>idem</i>, the same author as the preceding citation</td></tr>
<tr><td>ib.</td><td><i>ibidem</i>, the same work (and often passage)</td></tr>
<tr><td>al.</td><td><i>aliī / alibi</i>, others / elsewhere</td></tr>
<tr><td>cf.</td><td>compare</td></tr>
<tr><td>v.</td><td><i>vidē</i>, see; <b>v. h. v.</b> see this word; <b>v. infra / supra</b></td></tr>
<tr><td>q. v.</td><td><i>quod vidē</i>, which see</td></tr>
<tr><td>i. q.</td><td><i>idem quod</i>, the same as</td></tr>
<tr><td>sc.</td><td><i>scīlicet</i>, namely, understand (a word to be supplied)</td></tr>
<tr><td>i. e.</td><td>that is</td></tr>
<tr><td>saep. / saepiss.</td><td>often / very often</td></tr>
<tr><td>freq.</td><td>frequently; or frequentative verb</td></tr>
<tr><td>fin. / init. / med.</td><td>at the end / beginning / middle (of the passage)</td></tr>
<tr><td>sq. / sqq.</td><td>and the following (line/s)</td></tr>
<tr><td>dub.</td><td>doubtful (reading)</td></tr>
<tr><td>Fragm. / fr.</td><td>fragment</td></tr>
<tr><td>Müll., Lachm., Rib., Halm, Orell., Baiter, Jahn, Ritschl, Fleck.</td><td>names of editors whose text or edition is cited</td></tr>
</table>
<p><b>Grammatical and usage abbreviations</b></p>
<table class="abbr">
<tr><td>v. a.</td><td><i>verbum āctīvum</i>, transitive verb</td></tr>
<tr><td>v. n.</td><td><i>verbum neutrum</i>, intransitive verb</td></tr>
<tr><td>v. dep.</td><td>deponent verb (v. dep. a. / n. = transitive / intransitive deponent)</td></tr>
<tr><td>v. inch.</td><td>inchoative verb (-scō, 'begin to')</td></tr>
<tr><td>v. freq. / v. intens.</td><td>frequentative / intensive verb (-tō, -sō, -itō)</td></tr>
<tr><td>v. impers.</td><td>impersonal verb</td></tr>
<tr><td>P. a.</td><td>participial adjective (participle used as an adjective)</td></tr>
<tr><td>Part. / P. pres., P. perf., P. fut.</td><td>participle (present, perfect, future)</td></tr>
<tr><td>adj. / subst. / adv. / prep. / conj. / interj. / pron. / num.</td><td>adjective / substantive (noun) / adverb / preposition / conjunction / interjection / pronoun / numeral</td></tr>
<tr><td>m. / f. / n. / comm. / c.</td><td>masculine / feminine / neuter / common gender</td></tr>
<tr><td>sing. / plur. / sc.</td><td>singular / plural</td></tr>
<tr><td>nom. / gen. / dat. / acc. / voc. / abl. / loc.</td><td>the cases</td></tr>
<tr><td>indic. / subj. / imper. / inf. / sup. / ger.</td><td>indicative / subjunctive / imperative / infinitive / supine / gerund (gerundive)</td></tr>
<tr><td>pres. / imperf. / fut. / perf. / plusqpf. / fut. perf.</td><td>the tenses</td></tr>
<tr><td>act. / pass. / dep.</td><td>active / passive / deponent</td></tr>
<tr><td>comp. / sup.</td><td>comparative / superlative</td></tr>
<tr><td>dim.</td><td>diminutive</td></tr>
<tr><td>absol.</td><td>absolutely (without an object or complement)</td></tr>
<tr><td>constr.</td><td>construction</td></tr>
<tr><td>c. / cum</td><td>with (c. acc. = with the accusative)</td></tr>
<tr><td>lit.</td><td>literally, in the literal sense</td></tr>
<tr><td>trop.</td><td>tropically, figuratively</td></tr>
<tr><td>transf.</td><td>in a transferred sense</td></tr>
<tr><td>meton.</td><td>by metonymy</td></tr>
<tr><td>in gen. / in partic.</td><td>in general / in particular</td></tr>
<tr><td>esp.</td><td>especially</td></tr>
<tr><td>pregn.</td><td>pregnantly, in a fuller sense</td></tr>
<tr><td>prop.</td><td>properly</td></tr>
<tr><td>poet.</td><td>poetical</td></tr>
<tr><td>ante-class.</td><td>ante-classical (before Cicero)</td></tr>
<tr><td>class.</td><td>classical (Cicero to Livy)</td></tr>
<tr><td>post-Aug.</td><td>post-Augustan</td></tr>
<tr><td>late Lat.</td><td>late Latin</td></tr>
<tr><td>eccl. Lat.</td><td>ecclesiastical (Church) Latin</td></tr>
<tr><td>jurid. / medic. / milit. / mercant. / rhet. / philos. / gram.</td><td>juridical, medical, military, mercantile, rhetorical, philosophical, grammatical usage</td></tr>
<tr><td>Gr. / Sanscr. / Germ. / Engl.</td><td>Greek, Sanskrit, German, English (in etymologies)</td></tr>
<tr><td>kindr.</td><td>kindred with, cognate</td></tr>
<tr><td>contr.</td><td>contracted</td></tr>
<tr><td>syncop.</td><td>syncopated (shortened) form</td></tr>
<tr><td>orthogr.</td><td>orthography, spelling</td></tr>
<tr><td>dub. lect.</td><td>doubtful reading</td></tr>
<tr><td>al. leg.</td><td><i>aliī legunt</i>, others read (a textual variant)</td></tr>
<tr><td>opp.</td><td>opposed to</td></tr>
<tr><td>sc.</td><td>namely, supply</td></tr>
</table>`
}
];

if (typeof module === 'object' && module.exports) module.exports = GRAMMAR;
