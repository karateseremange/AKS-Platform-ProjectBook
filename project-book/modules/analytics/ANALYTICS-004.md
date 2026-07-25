# ANALYTICS-004 — Interfaces et restitutions d’AKS Analytics

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-004 |
| **Version** | 1.0.0 |
| **Statut** | Proposition soumise à validation |
| **Nature** | Interfaces, rapports et restitutions du module |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-26 |
| **Version du produit** | V1.2 |

---

## 1. Objet

Le présent document définit les interfaces et les restitutions attendues d’**AKS Analytics**. Il transforme les résultats publiés par la chaîne décrite dans `ANALYTICS-003` en vues compréhensibles, cohérentes et exploitables par les responsables autorisés de l’association.

Il formalise :

- la contribution synthétique d’Analytics au Centre de pilotage ;
- l’espace dédié AKS Analytics ;
- les quatre rapports de cours ;
- la synthèse globale ;
- les tableaux, graphiques, commentaires et états de qualité ;
- les principes de consultation, d’accessibilité et d’export.

Il ne définit ni les formats physiques des sources, ni les connecteurs d’import, ni la stratégie complète de validation. Ces sujets relèvent respectivement d’`ANALYTICS-005` et d’`ANALYTICS-006`.

---

## 2. Références applicables

Le présent document applique notamment :

- `ANALYTICS-001` — vision et architecture ;
- `ANALYTICS-002` — modèle métier ;
- `ANALYTICS-003` — services et règles d’orchestration ;
- `ADMIN-002` — interface utilisateur et navigation ;
- `ADMIN-003` — Centre de pilotage ;
- `ADMIN-004` — contrats `DashboardProvider` et `DashboardWidget` ;
- `UI-001` — contrat d’interface utilisateur ;
- `UX-001` — principes d’expérience utilisateur ;
- `SECURITY-001` — sécurité ;
- `DOCUMENT-001` — génération documentaire ;
- `CONFIG-001` — paramétrage ;
- `LOG-001` et `AUDIT-001` — journalisation et traçabilité ;
- `DOC-001` et `STD-001` — gouvernance documentaire.

Les interfaces consomment uniquement des modèles de restitution déjà calculés, contrôlés et publiés. Elles ne lisent jamais directement les sources de présence.

---

## 3. Principes directeurs

1. L’information essentielle doit être compréhensible sans expertise statistique.
2. Un graphique ne constitue jamais l’unique moyen d’accéder à une information.
3. Une valeur inconnue ou non calculable n’est jamais affichée comme zéro.
4. Chaque résultat présente sa période, sa fraîcheur, sa couverture et sa qualité.
5. Les commentaires automatiques décrivent des constats vérifiables sans diagnostic.
6. Les quatre rapports de cours précèdent toujours la synthèse globale.
7. Les restitutions agrégées sont privilégiées.
8. Les données nominatives ne sont pas exposées dans le Centre de pilotage.
9. Les mêmes indicateurs utilisent les mêmes libellés, unités, couleurs et règles d’arrondi.
10. Le dernier résultat valide reste identifiable lorsqu’un traitement plus récent échoue.
11. L’interface est utilisable sur ordinateur et tablette ; le mobile privilégie la synthèse.
12. Aucun calcul métier n’est exécuté pendant l’affichage.

---

## 4. Périmètre 2025-2026

Les restitutions détaillées concernent exclusivement :

- Baby ;
- Enfant 1 ;
- Enfant 2 ;
- Ado/Adulte.

Le cours féminin est exclu des calculs, comparaisons, rapports et agrégats 2025-2026 en raison de l’absence de suivi complet des présences. La synthèse globale affiche uniquement une mention méthodologique explicite de cette exclusion.

Son intégration pourra être étudiée à partir de 2026-2027 sous réserve d’un suivi homogène, complet et validé.

Le score AKS n’apparaît dans aucune interface tant que sa formule, son utilité et ses règles d’interprétation ne sont pas validées et versionnées.

---

## 5. Architecture de restitution

Trois niveaux complémentaires sont retenus :

1. **Centre de pilotage** : état synthétique et accès au module ;
2. **Espace AKS Analytics** : pilotage de la consultation et comparaison des cours ;
3. **Rapports** : analyse détaillée par cours puis synthèse globale.

La navigation suit un principe de divulgation progressive : le Centre de pilotage signale, l’espace Analytics synthétise et les rapports expliquent.

---

## 6. Centre de pilotage

### 6.1 Finalité

La contribution d’Analytics au Centre de pilotage fournit une vue opérationnelle courte. Elle ne remplace pas l’espace Analytics.

### 6.2 Informations minimales

Le fournisseur `AnalyticsDashboardProvider` expose au minimum :

- état du dernier traitement : succès, succès partiel, échec ou aucun changement ;
- saison et période couvertes ;
- date et heure de la dernière publication valide ;
- fraîcheur des résultats ;
- complétude globale ;
- liste ou nombre exact des cours couverts ;
- assiduité globale lorsque calculable ;
- nombre d’avertissements de qualité ;
- accès direct à l’espace AKS Analytics.

### 6.3 États

Le widget respecte les états standards d’`ADMIN-004` :

- chargement ;
- disponible ;
- attention ;
- indisponible ;
- non autorisé ;
- aucune donnée.

Un traitement échoué ne masque pas la dernière publication valide. L’interface distingue clairement la date du dernier traitement de celle du dernier résultat valide.

### 6.4 Exclusions

Le Centre de pilotage n’affiche pas :

- de liste nominative ;
- d’alertes individuelles ;
- de données sources ;
- de classement entre licenciés ;
- de score AKS ;
- de calcul déclenché au chargement ;
- de commande destructive.

---

## 7. Espace AKS Analytics

### 7.1 En-tête de contexte

L’en-tête affiche :

- saison sélectionnée ;
- période couverte ;
- état de publication ;
- date de génération ;
- fraîcheur ;
- couverture ;
- qualité globale ;
- éventuelles limites méthodologiques.

La saison active est sélectionnée par défaut. Une autre saison disponible peut être consultée sans modifier la configuration active.

### 7.2 Navigation

L’espace propose :

- Vue d’ensemble ;
- Baby ;
- Enfant 1 ;
- Enfant 2 ;
- Ado/Adulte ;
- Synthèse globale ;
- Qualité des données ;
- Exports, lorsque l’utilisateur possède le droit requis.

Les onglets ou entrées indisponibles expliquent leur état. Ils ne sont pas simulés par une valeur nulle.

### 7.3 Vue d’ensemble

La vue d’ensemble présente :

- quatre cartes de cours harmonisées ;
- couverture réelle de chaque cours ;
- assiduité moyenne et médiane ;
- évolution par rapport à la période précédente lorsqu’elle est comparable ;
- état de qualité ;
- accès au rapport détaillé ;
- avertissements transverses ;
- mention d’exclusion du cours féminin en 2025-2026.

La comparaison ne doit pas présenter une différence comme significative sans règle validée.

---

## 8. Structure commune des rapports de cours

Chaque rapport suit le même ordre :

1. contexte et qualité ;
2. chiffres clés ;
3. assiduité et profils ;
4. évolution temporelle ;
5. fréquentation des séances ;
6. régularité et signaux descriptifs ;
7. commentaires factuels ;
8. limites méthodologiques ;
9. export autorisé.

### 8.1 Contexte et qualité

Le rapport affiche :

- cours ;
- saison et période ;
- effectif analysé ;
- nombre de séances prévues, tenues, annulées et exploitables ;
- couverture réelle ;
- complétude des données ;
- date de dernière source lue ;
- date de publication ;
- exclusions ;
- avertissements et anomalies ayant un impact.

### 8.2 Chiffres clés

Lorsque calculables :

- assiduité moyenne ;
- assiduité médiane ;
- fidélité ;
- régularité ;
- stabilité ;
- participation ;
- effectif moyen par séance ;
- effectif maximal observé.

Chaque indicateur expose son unité et une aide courte. Une information « Non calculable » est accompagnée de sa raison.

### 8.3 Profils d’assiduité

La répartition utilise les catégories versionnées définies par le modèle métier :

- très réguliers ;
- réguliers ;
- irréguliers ;
- décrocheurs potentiels.

Les libellés restent descriptifs. La catégorie « décrocheur potentiel » constitue un signal de suivi et non un diagnostic ou une conclusion sur la personne.

### 8.4 Évolution mensuelle

La restitution montre :

- taux d’assiduité par mois ;
- effectif moyen par séance ;
- nombre de séances exploitables ;
- rupture ou absence de comparabilité ;
- évolution par rapport au mois précédent lorsque les périodes sont comparables.

Les mois sans données exploitables restent visibles comme non disponibles et ne sont pas reliés artificiellement à zéro.

### 8.5 Fréquentation des séances

Le rapport présente :

- effectif moyen et maximal ;
- distribution des effectifs ;
- séances fortement fréquentées ;
- séances faiblement fréquentées ;
- seuils appliqués et leur version ;
- séances annulées séparément.

### 8.6 Régularité et signaux descriptifs

La version initiale peut présenter sous forme agrégée :

- nombre de séquences d’absences consécutives au-delà du seuil validé ;
- proportion de licenciés concernés ;
- progressions ou baisses entre périodes comparables ;
- stabilité de la participation.

Les listes nominatives et actions individuelles relèvent d’un futur périmètre sécurisé. Elles ne sont pas nécessaires au premier incrément.

---

## 9. Rapport Baby

Le rapport Baby applique la structure commune sans introduire de comparaison pédagogique ou de jugement sur les enfants.

Les commentaires doivent tenir compte :

- du format et de la durée propres aux séances ;
- du caractère évolutif du groupe ;
- des séances annulées ou adaptées ;
- des limites de comparabilité avec les autres cours.

Aucune comparaison directe de performance avec les cours plus âgés n’est affichée.

---

## 10. Rapport Enfant 1

Le rapport Enfant 1 applique la structure commune et met particulièrement en évidence :

- la régularité sur la saison ;
- les périodes de baisse ou de reprise ;
- l’effectif moyen par séance ;
- la couverture réelle des données.

Les commentaires ne déduisent ni niveau technique ni progression de grade à partir des seules présences.

---

## 11. Rapport Enfant 2

Le rapport Enfant 2 applique la structure commune. Les comparaisons temporelles restent limitées aux périodes ayant une couverture suffisante.

Une variation de fréquentation peut être signalée comme constat, sans lui attribuer automatiquement une cause.

---

## 12. Rapport Ado/Adulte

Le rapport Ado/Adulte applique la structure commune et distingue clairement :

- participation ;
- assiduité ;
- régularité ;
- éventuelles différences de couverture selon les périodes.

La présence ne permet pas d’inférer la motivation, la performance sportive ou la progression technique.

---

## 13. Synthèse globale

### 13.1 Construction

La synthèse globale est produite uniquement après les quatre rapports de cours. Elle agrège les numérateurs et dénominateurs compatibles conformément à `ANALYTICS-002` et `ANALYTICS-003`.

Elle ne calcule jamais une moyenne simple des moyennes lorsque les populations ou dénominateurs diffèrent.

### 13.2 Contenu

La synthèse présente :

- cours inclus et exclus ;
- effectif total réellement analysé ;
- couverture globale ;
- assiduité moyenne et médiane globales lorsqu’elles sont calculables ;
- distribution agrégée des profils ;
- évolution mensuelle globale ;
- fréquentation moyenne et maximale ;
- comparaison descriptive des quatre cours ;
- principaux constats factuels ;
- qualité, fraîcheur et limites ;
- mention explicite de l’exclusion du cours féminin.

### 13.3 Résultat partiel

Si un cours ne peut pas être inclus, la synthèse :

- indique « Résultat partiel » ;
- nomme exactement les cours couverts ;
- explique le motif de l’exclusion ;
- recalcule uniquement les agrégats autorisés ;
- ne remplace pas le cours absent par zéro ;
- conserve l’accès au dernier rapport valide du cours lorsque cela est permis.

---

## 14. Graphiques

### 14.1 Catalogue initial

| Besoin | Graphique recommandé | Alternative textuelle obligatoire |
|---|---|---|
| Assiduité moyenne et médiane | Cartes de valeurs et repères | Valeurs, unités et période |
| Profils d’assiduité | Barres horizontales | Tableau des effectifs et pourcentages |
| Évolution mensuelle | Courbe | Tableau mensuel |
| Effectif par séance | Barres ou distribution | Tableau des séances ou résumé statistique |
| Comparaison des cours | Barres groupées | Tableau comparatif |
| Complétude | Barre de progression | Pourcentage, numérateur et dénominateur |

### 14.2 Règles

- palette cohérente et compatible avec les contrastes requis ;
- aucune signification portée uniquement par la couleur ;
- légendes et unités explicites ;
- échelles non trompeuses ;
- valeurs accessibles au clavier et aux technologies d’assistance ;
- densité adaptée à la taille de l’écran ;
- absence d’animation non essentielle ;
- indication des données manquantes ou non comparables.

Les graphiques sont générés à partir des mêmes jeux de données que les tableaux afin d’éviter toute divergence.

---

## 15. Commentaires automatiques

### 15.1 Nature

Un commentaire automatique est une phrase factuelle produite par une règle versionnée à partir d’un résultat publié.

Exemples autorisés :

- « L’assiduité médiane est supérieure à l’assiduité moyenne sur la période. »
- « La fréquentation moyenne baisse sur les deux derniers mois comparables. »
- « Deux séances dépassent le seuil de forte fréquentation défini pour ce cours. »
- « La complétude est insuffisante pour calculer cet indicateur. »

### 15.2 Interdictions

Les commentaires ne doivent pas :

- attribuer une cause non démontrée ;
- porter un jugement sur une personne ou un groupe ;
- présenter une corrélation comme causalité ;
- employer un diagnostic médical, psychologique ou social ;
- masquer une limitation de qualité ;
- recommander automatiquement une sanction ou une décision individuelle ;
- qualifier une variation de significative sans règle statistique validée.

### 15.3 Explicabilité

Chaque commentaire conserve :

- identifiant de règle ;
- version ;
- indicateurs sources ;
- période ;
- périmètre ;
- état de qualité.

---

## 16. Qualité, fraîcheur et méthodologie

### 16.1 États de qualité

Les interfaces utilisent des états compréhensibles correspondant aux niveaux techniques :

| État affiché | Sens |
|---|---|
| Conforme | Résultat exploitable sans limite majeure connue |
| Avec réserves | Résultat exploitable avec avertissement visible |
| Partiel | Une partie du périmètre est exclue |
| Non calculable | Préconditions insuffisantes |
| Indisponible | Aucun résultat publié utilisable |

### 16.2 Fraîcheur

La fraîcheur repose sur :

- date de dernière lecture des sources ;
- date de dernière publication ;
- période couverte ;
- seuil de fraîcheur configuré.

Une donnée ancienne n’est pas nécessairement invalide, mais son ancienneté doit être visible.

### 16.3 Valeurs absentes

Les libellés standards sont :

- « Non collecté » ;
- « Inconnu » ;
- « Non applicable » ;
- « Non calculable » ;
- « Donnée invalide » ;
- « Séance annulée ».

Ils ne sont jamais remplacés par `0`, un tiret ambigu ou une cellule vide sans explication.

---

## 17. Exports

### 17.1 Finalités initiales

Les exports servent prioritairement :

- au bilan de saison ;
- à la préparation de l’assemblée générale ;
- à l’archivage d’un rapport validé ;
- au partage interne autorisé.

### 17.2 Contenu minimal

Un export contient :

- titre et saison ;
- date de génération ;
- périmètre couvert ;
- indicateurs et graphiques retenus ;
- commentaires factuels ;
- qualité et fraîcheur ;
- exclusions et limites méthodologiques ;
- version des règles ;
- référence du traitement publié.

### 17.3 Contraintes

- l’export est généré depuis un résultat publié ;
- le format technique sera précisé après les contrats de sources et les besoins de validation ;
- les restitutions agrégées sont privilégiées ;
- tout export nominatif futur exige une autorisation et une traçabilité spécifiques ;
- un export n’intègre jamais le score AKS tant qu’il est désactivé.

---

## 18. Responsive et accessibilité

### 18.1 Ordinateur

L’ordinateur fournit la vue complète, les comparaisons, les tableaux détaillés et les exports.

### 18.2 Tablette

La tablette conserve toutes les fonctions de consultation, avec réorganisation verticale des cartes et graphiques.

### 18.3 Mobile

Le mobile privilégie :

- état du traitement ;
- chiffres clés ;
- qualité ;
- constats principaux ;
- navigation vers un rapport ;
- tableaux simplifiés ou défilables sans perte d’information.

La consultation mobile ne doit pas imposer un graphique illisible ou un tableau débordant sans solution accessible.

### 18.4 Accessibilité

- navigation clavier ;
- ordre de lecture logique ;
- titres hiérarchisés ;
- libellés explicites ;
- focus visible ;
- contrastes conformes au socle UX ;
- alternatives textuelles aux graphiques ;
- annonces accessibles pour chargements et erreurs ;
- tailles de cibles conformes aux règles existantes.

---

## 19. Sécurité et confidentialité

- l’accès à l’espace Analytics est contrôlé côté serveur ;
- les widgets respectent le contexte d’autorisation ;
- les résultats nominatifs ne sont pas exposés par défaut ;
- les exports sensibles sont limités et audités ;
- les erreurs publiques ne révèlent ni données personnelles ni détails techniques ;
- les liens directs ne contournent aucune autorisation ;
- les réponses détaillées au Questionnaire santé restent hors périmètre ;
- le Centre de pilotage ne contient aucune donnée individuelle.

---

## 20. États d’interface et erreurs

Chaque écran prévoit :

- chargement ;
- aucune donnée ;
- résultat disponible ;
- résultat partiel ;
- données trop anciennes ;
- traitement en cours ;
- dernier traitement échoué avec dernier résultat valide ;
- non calculable ;
- non autorisé ;
- erreur maîtrisée.

Une erreur locale sur un graphique n’empêche pas l’affichage des autres éléments fiables. Le message précise ce qui reste disponible.

---

## 21. Performance

Les interfaces :

- lisent des modèles publiés ;
- chargent les vues détaillées à la demande ;
- évitent les recalculs et lectures de sources ;
- limitent le volume initial ;
- réutilisent les résultats mis en cache selon les règles transverses ;
- n’invalident que le périmètre concerné ;
- restent consultables lorsque le dernier résultat valide est disponible.

---

## 22. Critères d’acceptation

`ANALYTICS-004` est accepté lorsque :

- les trois niveaux de restitution sont définis ;
- les quatre rapports et la synthèse globale possèdent une structure harmonisée ;
- tous les indicateurs retenus ont une représentation prévue ;
- les valeurs absentes ne peuvent pas être confondues avec zéro ;
- qualité, fraîcheur, couverture et exclusions sont visibles ;
- les commentaires restent factuels, explicables et non diagnostiques ;
- chaque graphique possède une alternative textuelle ;
- le Centre de pilotage ne calcule et n’expose aucune donnée nominative ;
- les résultats partiels identifient exactement leur couverture ;
- le cours féminin est uniquement mentionné comme exclu en 2025-2026 ;
- le score AKS est absent ;
- les principes ordinateur, tablette, mobile et accessibilité sont définis ;
- les exports initiaux sont cadrés sans anticiper leur format technique ;
- les interfaces consomment uniquement des résultats publiés.

---

## 23. Décisions structurantes

1. Le Centre de pilotage reste une synthèse et un point d’accès.
2. L’espace Analytics porte la consultation métier complète.
3. Les rapports sont séparés par cours avant toute synthèse globale.
4. Les interfaces n’accèdent jamais aux sources brutes.
5. Toute valeur non calculable est explicitement qualifiée.
6. Les commentaires décrivent sans diagnostiquer.
7. Les graphiques possèdent toujours une alternative textuelle.
8. La qualité et la fraîcheur font partie du résultat, pas d’une annexe.
9. La première version privilégie les agrégats.
10. Les alertes individuelles restent hors du Centre de pilotage.
11. Le cours féminin est exclu des restitutions 2025-2026.
12. Le score AKS reste absent.
13. Les exports initiaux ciblent le bilan et l’assemblée générale.
14. L’ordinateur et la tablette portent l’analyse complète ; le mobile privilégie la synthèse.

---

## 24. Livrables suivants

Après validation des interfaces :

- `ANALYTICS-005` définira les contrats externes et formats des sources ;
- `ANALYTICS-006` définira la stratégie de validation et les preuves attendues.

Le développement applicatif commencera uniquement lorsque les prérequis documentaires décidés par la gouvernance seront validés.

---

## 25. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-26 | Création du contrat des interfaces, rapports, graphiques, commentaires, états de qualité et exports d’AKS Analytics |

---

## 26. Conclusion

Ce document établit une restitution Analytics sobre, explicable et cohérente. Il permet de consulter les résultats sans déplacer les calculs vers l’interface, rend visibles les limites des données et prépare des rapports fiables pour le pilotage du club et l’assemblée générale.
