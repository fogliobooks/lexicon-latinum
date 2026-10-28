/* Nexus: find four groups of four. Each puzzle has 16 Latin words in four categories, easiest (0) to hardest (3). Written for this app. */
var NEXUS = [
 { groups: [
  ['Parts of the body', 0, ['caput', 'manus', 'pēs', 'oculus']],
  ['The family', 1, ['māter', 'pater', 'frāter', 'soror']],
  ['Colours', 2, ['albus', 'niger', 'ruber', 'flāvus']],
  ['In the sky', 3, ['sōl', 'lūna', 'stēlla', 'nūbēs']]]},
 { groups: [
  ['Animals', 0, ['canis', 'equus', 'lupus', 'leō']],
  ['Magistrates', 1, ['cōnsul', 'praetor', 'quaestor', 'tribūnus']],
  ['Weapons and armour', 2, ['gladius', 'hasta', 'scūtum', 'pīlum']],
  ['Buildings of the Forum', 3, ['templum', 'cūria', 'basilica', 'rōstra']]]},
 { groups: [
  ['Verbs of speaking', 0, ['dīcō', 'āiō', 'inquam', 'nārrō']],
  ['Verbs of motion', 1, ['eō', 'veniō', 'currō', 'ambulō']],
  ['Deponent verbs', 2, ['sequor', 'patior', 'hortor', 'loquor']],
  ['Irregular verbs', 3, ['sum', 'ferō', 'volō', 'fīō']]]},
 { groups: [
  ['Prepositions with the ablative', 0, ['ā', 'cum', 'dē', 'sine']],
  ['Prepositions with the accusative', 1, ['ad', 'per', 'trāns', 'apud']],
  ['Conjunctions', 2, ['et', 'sed', 'aut', 'nec']],
  ['Adverbs of time', 3, ['nunc', 'mox', 'saepe', 'semper']]]},
 { groups: [
  ['Numbers', 0, ['ūnus', 'duo', 'trēs', 'decem']],
  ['Months', 1, ['Iānuārius', 'Aprīlis', 'Iūlius', 'December']],
  ['Gods', 2, ['Iuppiter', 'Venus', 'Minerva', 'Neptūnus']],
  ['Planets named for gods', 3, ['Mārs', 'Mercurius', 'Sāturnus', 'Iūnō']]]},
 { groups: [
  ['Virtues', 0, ['virtūs', 'pietās', 'fidēs', 'cōnstantia']],
  ['Vices', 1, ['superbia', 'avāritia', 'invidia', 'luxuria']],
  ['Feelings', 2, ['amor', 'timor', 'gaudium', 'dolor']],
  ['Abstract nouns in -tās', 3, ['lībertās', 'vēritās', 'aetās', 'cīvitās']]]},
 { groups: [
  ['First declension', 0, ['puella', 'aqua', 'terra', 'via']],
  ['Second declension', 1, ['servus', 'amīcus', 'bellum', 'hortus']],
  ['Third declension', 2, ['rēx', 'urbs', 'corpus', 'nōmen']],
  ['Fourth declension', 3, ['manus', 'exercitus', 'cornū', 'domus']]]},
 { groups: [
  ['Roman statesmen', 0, ['Caesar', 'Cicerō', 'Scīpiō', 'Catō']],
  ['Poets', 1, ['Vergilius', 'Horātius', 'Ovidius', 'Catullus']],
  ['Rivers', 2, ['Tiberis', 'Rhēnus', 'Padus', 'Nīlus']],
  ['Cities', 3, ['Rōma', 'Carthāgō', 'Athēnae', 'Alexandrīa']]]},
 { groups: [
  ['Food and drink', 0, ['pānis', 'vīnum', 'mel', 'cāseus']],
  ['Plants', 1, ['rosa', 'arbor', 'flōs', 'quercus']],
  ['Metals', 2, ['aurum', 'argentum', 'ferrum', 'aes']],
  ['Building materials', 3, ['lignum', 'lapis', 'marmor', 'later']]]},
 { groups: [
  ['Latin words used in English', 0, ['bonus', 'campus', 'villa', 'arēna']],
  ['Verbs of seeing', 1, ['videō', 'spectō', 'cernō', 'aspiciō']],
  ['Verbs of knowing', 2, ['sciō', 'nōscō', 'intellegō', 'cognōscō']],
  ['Verbs of fearing', 3, ['timeō', 'metuō', 'vereor', 'formīdō']]]},
 { groups: [
  ['Clothing', 0, ['toga', 'tunica', 'stola', 'pallium']],
  ['Rooms of a house', 1, ['ātrium', 'culīna', 'cubiculum', 'tablīnum']],
  ['Parts of a ship', 2, ['rēmus', 'vēlum', 'puppis', 'prōra']],
  ['On the road', 3, ['iter', 'pōns', 'porta', 'mīliārium']]]},
 { groups: [
  ['Soldiers', 0, ['centuriō', 'lēgātus', 'imperātor', 'mīles']],
  ['Military units', 1, ['legiō', 'cohors', 'manipulus', 'turma']],
  ['In the camp', 2, ['castra', 'vāllum', 'fossa', 'tabernāculum']],
  ['Enemies of Rome', 3, ['Hannibal', 'Pyrrhus', 'Vercingetorīx', 'Mithridātēs']]]},
 { groups: [
  ['The senses', 0, ['vīsus', 'audītus', 'gustus', 'tāctus']],
  ['The elements', 1, ['ignis', 'aqua', 'terra', 'āēr']],
  ['The seasons', 2, ['vēr', 'aestās', 'autumnus', 'hiems']],
  ['Directions', 3, ['oriēns', 'occidēns', 'septentriō', 'merīdiēs']]]},
 { groups: [
  ['Big', 0, ['magnus', 'ingēns', 'vāstus', 'amplus']],
  ['Small', 1, ['parvus', 'exiguus', 'minūtus', 'pusillus']],
  ['Good', 2, ['bonus', 'probus', 'benignus', 'ēgregius']],
  ['Bad', 3, ['malus', 'improbus', 'prāvus', 'nēquam']]]},
 { groups: [
  ['Friend', 0, ['amīcus', 'socius', 'comes', 'sodālis']],
  ['Enemy', 1, ['hostis', 'inimīcus', 'adversārius', 'perduellis']],
  ['Leader', 2, ['rēx', 'dux', 'prīnceps', 'rēctor']],
  ['Servant', 3, ['servus', 'famulus', 'minister', 'verna']]]},
 { groups: [
  ['The sea', 0, ['mare', 'pontus', 'aequor', 'pelagus']],
  ['Water', 1, ['aqua', 'unda', 'flūmen', 'fōns']],
  ['The earth', 2, ['terra', 'tellūs', 'humus', 'solum']],
  ['The sky', 3, ['caelum', 'aethēr', 'polus', 'Olympus']]]},
 { groups: [
  ['Time', 0, ['tempus', 'aetās', 'aevum', 'saeculum']],
  ['Times of day', 1, ['māne', 'merīdiēs', 'vesper', 'nox']],
  ['Stages of life', 2, ['īnfāns', 'puer', 'iuvenis', 'senex']],
  ['Units of time', 3, ['hōra', 'diēs', 'mēnsis', 'annus']]]},
 { groups: [
  ['Birds', 0, ['aquila', 'columba', 'corvus', 'cygnus']],
  ['Creatures of the sea', 1, ['piscis', 'delphīnus', 'polypus', 'ostrea']],
  ['Insects', 2, ['apis', 'fōrmīca', 'musca', 'pāpiliō']],
  ['Snakes and lizards', 3, ['serpēns', 'anguis', 'lacerta', 'vīpera']]]},
 { groups: [
  ['The Church', 0, ['ecclēsia', 'episcopus', 'baptisma', 'ēvangelium']],
  ['The law', 1, ['lēx', 'iūs', 'iūdex', 'testis']],
  ['Medicine', 2, ['medicus', 'morbus', 'febris', 'vulnus']],
  ['School', 3, ['magister', 'discipulus', 'schola', 'stilus']]]},
 { groups: [
  ['Masculine nouns of the first declension', 0, ['agricola', 'nauta', 'poēta', 'pīrāta']],
  ['Trades', 1, ['faber', 'pistor', 'mercātor', 'sūtor']],
  ['Feminine trees of the second declension', 2, ['pīnus', 'ulmus', 'fāgus', 'laurus']],
  ['Neuter nouns of the third declension', 3, ['opus', 'genus', 'carmen', 'lītus']]]},
 { groups: [
  ['Words from famous mottoes', 0, ['carpe', 'cōgitō', 'vēnī', 'ālea']],
  ['Greetings and farewells', 1, ['salvē', 'avē', 'valē', 'grātiās']],
  ['Question words', 2, ['quis', 'cūr', 'ubi', 'quandō']],
  ['Yes, no and so on', 3, ['ita', 'minimē', 'nōn', 'certē']]]},
 { groups: [
  ['Perfect tenses', 0, ['amāvī', 'vīdī', 'vīcī', 'fuī']],
  ['Imperatives', 1, ['dīc', 'dūc', 'fac', 'fer']],
  ['Present participles', 2, ['amāns', 'sapiēns', 'absēns', 'potēns']],
  ['Supines in -um', 3, ['dormītum', 'lūsum', 'cubitum', 'vīsum']]]},
 { groups: [
  ['Genitive singulars', 0, ['puellae', 'amīcī', 'rēgis', 'manūs']],
  ['Ablative singulars', 1, ['puellā', 'amīcō', 'rēge', 'manū']],
  ['Accusative plurals', 2, ['puellās', 'amīcōs', 'rēgēs', 'cornua']],
  ['Dative plurals', 3, ['puellīs', 'rēgibus', 'manibus', 'diēbus']]]},
 { groups: [
  ['Hair and head', 0, ['coma', 'capillus', 'frōns', 'auris']],
  ['Arms and hands', 1, ['bracchium', 'digitus', 'umerus', 'palma']],
  ['Legs and feet', 2, ['crūs', 'genū', 'tālus', 'planta']],
  ['Inside the body', 3, ['cor', 'iecur', 'pulmō', 'sanguis']]]},
 { groups: [
  ['Weather', 0, ['pluvia', 'nix', 'ventus', 'tonitrus']],
  ['Light', 1, ['lūx', 'lūmen', 'flamma', 'fulgor']],
  ['Darkness and cold', 2, ['tenebrae', 'umbra', 'frīgus', 'gelū']],
  ['Sounds', 3, ['vōx', 'sonus', 'clāmor', 'strepitus']]]},
 { groups: [
  ['Giving', 0, ['dō', 'dōnō', 'tribuō', 'praebeō']],
  ['Taking', 1, ['capiō', 'sūmō', 'rapiō', 'tollō']],
  ['Making', 2, ['faciō', 'creō', 'fingō', 'struō']],
  ['Breaking', 3, ['frangō', 'rumpō', 'scindō', 'dēleō']]]},
 { groups: [
  ['Vessels', 0, ['amphora', 'pōculum', 'urna', 'patera']],
  ['Writing', 1, ['liber', 'tabula', 'epistula', 'calamus']],
  ['Money', 2, ['dēnārius', 'sēstertius', 'as', 'aureus']],
  ['Entertainment', 3, ['lūdī', 'theātrum', 'circus', 'thermae']]]},
 { groups: [
  ['Said of a horse', 0, ['equus', 'iuba', 'frēnum', 'ungula']],
  ['Said of a tree', 1, ['rāmus', 'folium', 'rādīx', 'truncus']],
  ['Said of a river', 2, ['rīpa', 'vadum', 'alveus', 'ōstium']],
  ['Said of a mountain', 3, ['cacūmen', 'iugum', 'clīvus', 'saxum']]]}
];
if (typeof module === 'object' && module.exports) module.exports = NEXUS;
