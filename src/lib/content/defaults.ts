/**
 * Contenu initial, repris de l'ancien site. Tant qu'une section n'a pas été
 * enregistrée depuis l'admin, c'est ce contenu qui s'affiche.
 */

type Item<T> = T[];

const site = {
  nom: "La Sainte Trinité Honoré",
  sigle: "STH",
  logo: "",
  devise: "Amélioration continue : aujourd'hui, mieux qu'hier, et pire que demain",
  presentation: "Un établissement d'excellence au service de la jeunesse béninoise depuis 2011, de la maternelle à la terminale.",
  anneeScolaire: "2026-2027",
  inscriptionsOuvertes: true,
  telephones: [{ numero: "01 97 00 00 00" }, { numero: "01 97 00 00 01" }],
  whatsapp: "2290197000000",
  email: "contact@sth-ecole.bj",
  adresse: "Quartier Zongo, Cotonou, Bénin",
  boitePostale: "03 BP 1234",
  carte: "",
  horaires: [
    { jours: "Lundi – Vendredi", heures: "8h00 – 17h00" },
    { jours: "Samedi", heures: "8h00 – 12h00" },
  ],
  reseaux: { facebook: "", instagram: "", tiktok: "", youtube: "" },
  credit: "Développé par NOVATECH-BENIN",
};

const accueil = {
  hero: {
    surtitre: "Maternelle · Primaire · Collège · Lycée — Cotonou",
    titre: "Former les leaders de demain, dès aujourd'hui.",
    texte:
      "De la maternelle à la terminale, La Sainte Trinité Honoré offre un cadre éducatif rigoureux, bienveillant et épanouissant pour chaque enfant.",
    image: "",
    boutonPrincipal: "Inscrire mon enfant",
    boutonSecondaire: "Découvrir l'école",
  },
  chiffres: [
    { valeur: "+1 200", libelle: "élèves formés" },
    { valeur: "98 %", libelle: "de réussite au BEPC" },
    { valeur: "96 %", libelle: "de réussite au BAC" },
    { valeur: "30+", libelle: "enseignants qualifiés" },
  ],
  fondateur: {
    titre: "Un engagement total pour l'excellence scolaire",
    texte:
      "Fondée sur des valeurs profondes de discipline, de respect et d'épanouissement, La Sainte Trinité Honoré accueille chaque enfant comme un être unique, porteur d'un potentiel extraordinaire.",
    engagements: [
      { texte: "Encadrement pédagogique personnalisé" },
      { texte: "Environnement sécurisé et bienveillant" },
      { texte: "Activités extrascolaires enrichissantes" },
      { texte: "Suivi régulier des parents et tuteurs" },
    ],
    citation:
      "Lorsque j'ai fondé La Sainte Trinité Honoré, j'avais une conviction profonde : chaque enfant mérite un environnement où ses talents peuvent s'épanouir pleinement.",
    nom: "Mr ACAKPO Honoré Béranger",
    fonction: "Directeur Fondateur",
    photo: "",
  },
  avis: {
    titre: "Ce que disent nos familles",
    intro: "Parents et anciens élèves partagent leur expérience. Chaque témoignage est relu avant publication.",
  },
  etapes: [
    { titre: "Formulaire en ligne", texte: "Complétez le formulaire de pré-inscription." },
    { titre: "Retrait du dossier", texte: "Venez retirer le dossier au secrétariat." },
    { titre: "Dossier complet", texte: "Joignez les pièces requises." },
    { titre: "Finalisation", texte: "Règlement des frais et admission." },
  ],
};

const ecole = {
  titre: "Notre école",
  intro: "Histoire, valeurs et infrastructures d'un établissement au service de l'excellence depuis 2011.",
  presentation: {
    titre: "Un établissement au service de l'excellence",
    texte:
      "Fondée en octobre 2011, La Sainte Trinité Honoré est un établissement privé d'enseignement général qui accueille des élèves de la maternelle à la terminale dans un cadre éducatif exemplaire.\n\nNotre école est reconnue pour la rigueur de son enseignement, la qualité de son corps enseignant et ses excellents résultats aux examens nationaux.\n\nLa Sainte Trinité Honoré, c'est bien plus qu'une école : c'est une communauté où la discipline, la bienveillance et l'excellence coexistent harmonieusement.",
    image: "",
  },
  valeurs: [
    { titre: "Excellence", texte: "Nous visons les meilleurs résultats pour chaque élève." },
    { titre: "Discipline", texte: "Un cadre structuré et bienveillant." },
    { titre: "Épanouissement", texte: "Chaque enfant est unique, nous cultivons ses talents." },
    { titre: "Respect", texte: "Le respect mutuel entre tous." },
    { titre: "Chrétienté", texte: "Nous croyons en Dieu et le mettons au centre." },
    { titre: "Citoyenneté", texte: "Former de bons citoyens béninois." },
  ],
  histoire: [
    { annee: "2011", titre: "Fondation", texte: "Ouverture de la maternelle et du primaire." },
    { annee: "2014", titre: "Ouverture du collège", texte: "Classes de la 6ème à la 3ème." },
    { annee: "2017", titre: "Extension au lycée", texte: "Ouverture des séries littéraires et scientifiques." },
    { annee: "2026", titre: "Aujourd'hui", texte: "Plus de 1 500 élèves formés." },
  ],
  infrastructures: [
    { titre: "Salles de classe", texte: "Spacieuses et bien éclairées.", image: "" },
    { titre: "Bibliothèque", texte: "Un riche fonds documentaire.", image: "" },
    { titre: "Salle informatique", texte: "Des ordinateurs modernes.", image: "" },
    { titre: "Cour et terrains", texte: "Des espaces de récréation et de sport.", image: "" },
    { titre: "Réfectoire", texte: "Des repas équilibrés.", image: "" },
    { titre: "Laboratoire de sciences", texte: "Des équipements complets.", image: "" },
  ],
};

const cycles = {
  titre: "Nos cycles",
  intro: "De la maternelle à la terminale, un parcours d'excellence structuré et bienveillant.",
  cycles: [
    {
      nom: "Maternelle",
      couleur: "safran",
      niveaux: "Maternelle 1, Maternelle 2",
      accroche: "L'éveil par le jeu et la créativité",
      description:
        "La section maternelle est un espace chaleureux et sécurisant où les tout-petits découvrent le monde à travers des activités ludiques et éducatives.",
      horaires: [{ label: "Journée complète", valeur: "8h00 – 15h00" }],
      points: [
        { texte: "Activités d'éveil sensoriel et moteur" },
        { texte: "Initiation à la lecture et aux chiffres" },
        { texte: "Ateliers artistiques et créatifs" },
      ],
      image: "",
    },
    {
      nom: "Primaire",
      couleur: "sauge",
      niveaux: "CI, CP, CE1, CE2, CM1, CM2",
      accroche: "Les fondations de l'excellence académique",
      description:
        "Le cycle primaire pose les bases solides d'un parcours scolaire réussi. Nos élèves du CI au CM2 bénéficient d'une pédagogie active et rigoureuse.",
      horaires: [{ label: "Journée complète", valeur: "8h00 – 15h00" }],
      points: [{ texte: "Cours de soutien et de révision" }, { texte: "Préparation au CEP dès le CM1" }],
      image: "",
    },
    {
      nom: "Collège",
      couleur: "terracotta",
      niveaux: "6ème, 5ème, 4ème, 3ème",
      accroche: "L'approfondissement et la découverte",
      description: "Le premier cycle accueille les élèves de la 6ème à la 3ème dans un cadre sérieux et structuré.",
      horaires: [
        { label: "Matin", valeur: "8h00 – 12h00" },
        { label: "Pause", valeur: "12h00 – 15h00" },
        { label: "Après-midi", valeur: "15h00 – 18h00" },
      ],
      points: [{ texte: "Cours de soutien inclus" }, { texte: "Préparation au BEPC" }],
      image: "",
    },
    {
      nom: "Lycée",
      couleur: "encre",
      niveaux: "2nde, 1ère, Terminale — séries A, C, D, G",
      accroche: "Vers le baccalauréat et l'avenir",
      description: "Le second cycle propose les séries scientifiques et littéraires en 2nde, 1ère et Terminale.",
      horaires: [
        { label: "Matin", valeur: "7h00 – 12h00" },
        { label: "Pause", valeur: "12h00 – 15h00" },
        { label: "Après-midi", valeur: "15h00 – 18h00" },
      ],
      points: [{ texte: "Séries A, C, D et G" }, { texte: "Cours de révision intensifs avant le BAC" }],
      image: "",
    },
  ],
};

const frais = {
  titre: "Frais de scolarité",
  intro: "Des tarifs clairs pour chaque cycle, à régler en une fois ou par trimestre.",
  periode: "2025-2026",
  devise: "Tous les montants sont en francs CFA.",
  groupes: [
    {
      cycle: "Maternelle",
      lignes: [
        { classe: "Petite section", serie: "", inscription: "150 000", scolarite: "450 000", trimestre: "150 000" },
        { classe: "Moyenne section", serie: "", inscription: "150 000", scolarite: "450 000", trimestre: "150 000" },
        { classe: "Grande section", serie: "", inscription: "150 000", scolarite: "450 000", trimestre: "150 000" },
      ],
      note: "Frais de cantine en supplément : renseignez-vous au secrétariat.",
    },
    {
      cycle: "Primaire",
      lignes: [
        { classe: "CI", serie: "", inscription: "150 000", scolarite: "500 000", trimestre: "166 667" },
        { classe: "CP à CM2", serie: "", inscription: "150 000", scolarite: "500 000", trimestre: "166 667" },
      ],
      note: "Frais d'inscription au CEP à la charge des parents.",
    },
    {
      cycle: "Collège",
      lignes: [{ classe: "6ème à 3ème", serie: "", inscription: "200 000", scolarite: "600 000", trimestre: "200 000" }],
      note: "Cours de soutien et préparation au BEPC inclus.",
    },
    {
      cycle: "Lycée",
      lignes: [
        { classe: "2nde", serie: "Toutes séries", inscription: "250 000", scolarite: "750 000", trimestre: "250 000" },
        { classe: "1ère", serie: "A, C, D, G", inscription: "250 000", scolarite: "800 000", trimestre: "266 667" },
        { classe: "Terminale", serie: "A, C, D, G", inscription: "250 000", scolarite: "800 000", trimestre: "266 667" },
      ],
      note: "Frais d'inscription au baccalauréat fixés par l'État.",
    },
  ],
  modalites: [{ texte: "Paiement par trimestre" }, { texte: "Paiement annuel avec remise" }, { texte: "Mobile Money accepté" }],
  reductions: [{ texte: "Réduction fratrie : -10 %" }, { texte: "Bourse d'excellence" }],
};

const resultats = {
  titre: "Résultats",
  intro: "Des années d'excellence, reflétées dans nos résultats aux examens nationaux.",
  chiffres: [
    { valeur: 98, suffixe: "%", libelle: "de réussite au BEPC", periode: "2024-2025" },
    { valeur: 96, suffixe: "%", libelle: "de réussite au BAC", periode: "2024-2025" },
    { valeur: 100, suffixe: "%", libelle: "de réussite au CEP", periode: "2022-2025" },
    { valeur: 8, suffixe: "", libelle: "prix d'excellence nationaux", periode: "5 dernières années" },
  ],
  evolutions: [
    {
      examen: "BAC",
      annees: [
        { annee: "2020-2021", taux: 85 },
        { annee: "2021-2022", taux: 88 },
        { annee: "2022-2023", taux: 91 },
        { annee: "2023-2024", taux: 94 },
        { annee: "2024-2025", taux: 96 },
      ],
    },
    {
      examen: "BEPC",
      annees: [
        { annee: "2020-2021", taux: 87 },
        { annee: "2021-2022", taux: 90 },
        { annee: "2022-2023", taux: 92 },
        { annee: "2023-2024", taux: 95 },
        { annee: "2024-2025", taux: 98 },
      ],
    },
  ],
  palmares: {
    titre: "Nos meilleurs élèves — BAC 2025",
    eleves: [
      { rang: "1er", nom: "ADJOVI Esaïe", filiere: "Série D", mention: "Très bien", moyenne: "17,85" },
      { rang: "2ème", nom: "HOUNKPONOU Merveille", filiere: "Série C", mention: "Très bien", moyenne: "17,42" },
      { rang: "3ème", nom: "METCHIHOUN Sarah", filiere: "Série A", mention: "Bien", moyenne: "16,18" },
      { rang: "4ème", nom: "BOKO Ulrich", filiere: "Série D", mention: "Bien", moyenne: "15,90" },
      { rang: "5ème", nom: "GBAGUIDI Rachel", filiere: "Série A", mention: "Assez bien", moyenne: "14,75" },
    ],
  },
};

const m = (nom: string, fonction: string, matiere = "", diplome = "") => ({ nom, fonction, matiere, diplome, photo: "" });

const equipe = {
  titre: "Notre équipe",
  intro: "Des enseignants passionnés, qualifiés et dévoués à la réussite de vos enfants.",
  chiffres: [
    { valeur: "30+", libelle: "enseignants qualifiés" },
    { valeur: "8 ans", libelle: "d'expérience en moyenne" },
    { valeur: "100 %", libelle: "diplômés" },
  ],
  groupes: [
    {
      titre: "Direction",
      membres: [
        m("Mr ACAKPO Honoré B.", "Fondateur et Directeur général", "Pilotage stratégique", "Sciences de l'éducation"),
        m("Mr KOUASSI Jean", "DAAC", "Suivi disciplinaire", "Administration scolaire"),
        m("Mme DOSSOU Afi", "Directrice des études", "Supervision pédagogique", "CAPES"),
      ],
    },
    {
      titre: "Maternelle",
      membres: [
        m("Mme AGBO Clarisse", "Petite section", "Éveil, langage, psychomotricité"),
        m("Mme ADJOVI Rose", "Grande section", "Pré-lecture, pré-calcul"),
      ],
    },
    {
      titre: "Primaire",
      membres: [
        m("Mr HOUNKPATIN Paul", "Maître du CI", "Français, maths, éveil"),
        m("Mme BOKO Lucie", "Maîtresse du CP", "Français, maths"),
        m("Mr TOKPONOU Marc", "Maître du CE1", "Français, maths, sciences"),
        m("Mme GBAGUIDI Rachel", "Maîtresse du CM1", "Préparation au CEP"),
        m("Mr MEDECIN Joseph", "Maître du CM2", "Préparation au CEP"),
      ],
    },
    {
      titre: "Collège et lycée",
      membres: [
        m("Mme HOUNKPONOU Martine", "Professeure de français", "Français et littérature", "Maîtrise de lettres"),
        m("Mr JOHNSON Eric", "Professeur d'anglais", "Anglais LV1", "Licence d'anglais"),
        m("Mr DOSSOU Anges", "Professeur de mathématiques", "Mathématiques", "CAPES de maths"),
        m("Mme YAKOUBU Fatima", "Professeure de SVT", "Sciences de la vie et de la Terre"),
        m("Mr KPATCHAVI David", "Professeur de PC", "Physique-chimie"),
        m("Mme ADJADJI Christine", "Professeure d'histoire-géographie", "Histoire-géographie"),
        m("Mr HOUNKPONOU Bienvenu", "Professeur de philosophie", "Philosophie"),
        m("Mr ADJOVI Martial", "Professeur d'EPS", "Sport"),
      ],
    },
  ],
};

const galerie = {
  titre: "Galerie",
  intro: "Des moments de vie capturés au cœur de notre établissement.",
  categories: [
    { nom: "Maternelle" },
    { nom: "Primaire" },
    { nom: "Secondaire" },
    { nom: "Enseignants" },
    { nom: "Infrastructures" },
    { nom: "Activités" },
  ],
  photos: [] as Item<{ image: string; legende: string; categorie: string }>,
};

const inscription = {
  titre: "Pré-inscription en ligne",
  intro: "Remplissez ce formulaire : notre secrétariat vous recontacte pour finaliser l'inscription de votre enfant.",
  confirmation:
    "Votre demande de pré-inscription est bien enregistrée. Notre secrétariat vous appellera dans les 48 heures ouvrées pour la suite du dossier.",
  fermees:
    "Les pré-inscriptions en ligne sont fermées pour le moment. Contactez le secrétariat par téléphone ou WhatsApp.",
  classes: [
    { nom: "Maternelle 1", cycle: "maternelle", serieRequise: false },
    { nom: "Maternelle 2", cycle: "maternelle", serieRequise: false },
    { nom: "CI", cycle: "primaire", serieRequise: false },
    { nom: "CP", cycle: "primaire", serieRequise: false },
    { nom: "CE1", cycle: "primaire", serieRequise: false },
    { nom: "CE2", cycle: "primaire", serieRequise: false },
    { nom: "CM1", cycle: "primaire", serieRequise: false },
    { nom: "CM2", cycle: "primaire", serieRequise: false },
    { nom: "6ème", cycle: "college", serieRequise: false },
    { nom: "5ème", cycle: "college", serieRequise: false },
    { nom: "4ème", cycle: "college", serieRequise: false },
    { nom: "3ème", cycle: "college", serieRequise: false },
    { nom: "2nde", cycle: "lycee", serieRequise: true },
    { nom: "1ère", cycle: "lycee", serieRequise: true },
    { nom: "Terminale", cycle: "lycee", serieRequise: true },
  ],
  series: [
    { code: "A", libelle: "Lettres, langues et sciences humaines" },
    { code: "B", libelle: "Économie et sciences sociales" },
    { code: "C", libelle: "Mathématiques et sciences physiques" },
    { code: "D", libelle: "Sciences de la vie et de la Terre" },
    { code: "G", libelle: "Techniques commerciales et de gestion" },
  ],
  etapes: [
    { titre: "Confirmation", texte: "Le secrétariat vous appelle pour confirmer la demande." },
    { titre: "Dossier", texte: "Vous déposez les pièces demandées au secrétariat." },
    { titre: "Admission", texte: "Règlement des frais et confirmation de la place." },
  ],
  pieces: [] as Item<{ texte: string }>,
};

const contact = {
  titre: "Nous contacter",
  intro: "Notre équipe répond à toutes vos questions sur les inscriptions, les frais et la vie de l'école.",
  sujets: [
    { texte: "Inscription" },
    { texte: "Frais de scolarité" },
    { texte: "Résultats scolaires" },
    { texte: "Rendez-vous avec la direction" },
    { texte: "Autre" },
  ],
};

const mentions = {
  titre: "Mentions légales",
  texte: `## Éditeur du site
Ce site est édité par La Sainte Trinité Honoré, établissement privé d'enseignement général situé à Cotonou (Bénin).

## Hébergement
Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis. Les données sont stockées par Neon (base de données) et Vercel (photos) dans des centres de données situés en Europe.

## Données personnelles
Les informations saisies dans les formulaires de pré-inscription, de contact et de témoignage sont utilisées uniquement par l'établissement pour traiter votre demande. Elles ne sont ni vendues ni transmises à des tiers.

Les demandes de pré-inscription sont conservées pendant l'année scolaire concernée, puis supprimées si l'élève n'est pas inscrit.

Conformément au Code du numérique de la République du Bénin, vous pouvez demander l'accès, la rectification ou la suppression de vos données en contactant le secrétariat de l'établissement. Vous pouvez également saisir l'Autorité de Protection des Données à caractère Personnel (APDP).

## Témoignages
Les témoignages sont relus par l'établissement avant publication. Seuls le prénom et le nom indiqués, la qualité (parent ou ancien élève), la note et le texte sont publiés.`,
};

export const defaults = { site, accueil, ecole, cycles, frais, resultats, equipe, galerie, inscription, contact, mentions };

export type Content = typeof defaults;
export type ContentKey = keyof Content;
