# INSCRIPTIONS-004 — Interfaces et accès privés d’AKS Platform

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-004 |
| **Version** | 1.0.1 |
| **Statut** | Validé |
| **Nature** | Interfaces métier et extension transverse des habilitations |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit les interfaces nécessaires au contrôle d’**AKS Inscriptions** et le cadre commun des accès privés d’AKS Platform.

Il complète `INSCRIPTIONS-001`, `INSCRIPTIONS-002` et `INSCRIPTIONS-003`. Il étend le socle `ACCESS-001` déjà utilisé par Présences, sans créer d’authentification, de registre ni de liste d’administrateurs propres au module Inscriptions.

Le document décrit une cible fonctionnelle. Il ne modifie pas le code, les habilitations réelles, les trois Google Forms, leurs feuilles de réponses ni les fichiers Analytics publiés.

## 2. Décision d’architecture

La gestion des accès privés appartient à **AKS Core**. Chaque module déclare les capacités dont il a besoin et demande au service central de les vérifier.

Les principes suivants s’appliquent :

1. Google authentifie la personne ; AKS Platform autorise l’action.
2. Le registre central `access/1.0`, ou sa future version migrée, reste l’unique source d’autorisation applicative.
3. Une personne peut cumuler plusieurs rôles et capacités.
4. La navigation est filtrée pour la lisibilité, mais le serveur contrôle chaque route et chaque commande.
5. L’absence, l’ambiguïté ou l’invalidité d’un droit entraîne un refus fermé.
6. Une habilitation à l’application ne donne pas automatiquement accès aux fichiers Google Drive sous-jacents.
7. Les changements d’habilitation sont validés, relus et audités.

## 3. Séparation des espaces

| Espace | Public | Contenu | Contrôle |
|---|---|---|---|
| Site WordPress | Oui | Présentation des services et liens publics | Règles WordPress existantes |
| Préinscriptions Google Forms | Oui | Karaté classique, Cours féminin, Body Karaté | Paramètres Google Forms transitoires |
| Espace privé AKS Platform | Non | Inscriptions, Analytics, Présences, administration | Identité Google et `ACCESS-001` |
| Ressources Google Drive | Non | Sources, rapports, exports et classeurs autorisés | Partage Drive cohérent avec les droits applicatifs |

Les trois Google Forms restent les interfaces publiques transitoires. Aucun dossier nominatif, rapport Analytics ou outil d’administration n’est exposé publiquement.

## 4. Point d’entrée privé

L’espace privé fournit un point d’entrée commun après identification Google. Il ne constitue pas un espace réservé aux seuls administrateurs.

Le contexte minimal retourné au navigateur comprend :

- l’identité affichable de la personne connectée ;
- les modules visibles ;
- les actions autorisées pour l’écran courant ;
- les saisons, sections ou cours accessibles lorsque le périmètre l’exige ;
- un identifiant de corrélation en cas de refus ou d’erreur.

Le registre complet, les droits des autres utilisateurs et les motifs techniques internes ne sont jamais envoyés au navigateur.

## 5. Navigation calculée

Chaque entrée de navigation déclare une capacité minimale. La valeur d’autorisation n’est jamais codée en dur.

| Entrée | Capacité minimale | Effet sans droit |
|---|---|---|
| Présences | `ATTENDANCE_READ` ou capacité d’écriture Présences | Entrée masquée et route refusée |
| Analytics | `ANALYTICS_READ` | Entrée masquée et route refusée |
| Inscriptions | `INSCRIPTIONS_READ` | Entrée masquée et route refusée |
| Habilitations | `ACCESS_MANAGE` | Entrée masquée et route refusée |
| Paramétrage et journaux | Capacité administrative correspondante | Entrée masquée et route refusée |

Une URL directe, un paramètre client falsifié ou un bouton reconstitué ne permet jamais de contourner le contrôle serveur.

## 6. Rôles et capacités

Les rôles existants décrivent des profils généraux : `ADMINISTRATEUR`, `PROFESSEUR`, `ASSISTANT_AFA` et `CONSULTATION`. Ils ne sont pas multipliés pour chaque module.

Les capacités décrivent les opérations autorisées. Elles sont cumulables et limitées par leur périmètre.

### 6.1 Analytics

| Capacité | Autorise |
|---|---|
| `ANALYTICS_READ` | Consulter les rapports privés autorisés |
| `ANALYTICS_PREVIEW` | Générer ou consulter une prévisualisation avant publication |
| `ANALYTICS_PUBLISH` | Publier ou remplacer un rapport officiel |

La lecture est distincte de la prévisualisation et de la publication. Un membre du comité peut donc consulter Analytics sans pouvoir recalculer ou publier les rapports.

### 6.2 Inscriptions

| Capacité | Autorise |
|---|---|
| `INSCRIPTIONS_READ` | Consulter les dossiers autorisés |
| `INSCRIPTIONS_ANALYZE_IMPORT` | Analyser une source sans écriture métier |
| `INSCRIPTIONS_CONTROL` | Contrôler anomalies, doublons et correspondances |
| `INSCRIPTIONS_WRITE` | Corriger les données administratives autorisées |
| `INSCRIPTIONS_APPLY_IMPORT` | Appliquer un lot préalablement validé |
| `INSCRIPTIONS_ACTIVATE` | Activer un dossier vers les outils opérationnels |

La fusion de personnes, la décision de place, l’application d’un lot et l’activation sont des opérations sensibles. Elles exigent une capacité explicite et un audit fonctionnel.

### 6.3 Présences et administration

Les capacités Présences existantes restent inchangées. `ACCESS_MANAGE` reste la capacité de gestion du registre. Les futures capacités de paramétrage, journaux ou audit doivent être déclarées dans le même catalogue central avant usage.

## 7. Périmètres d’habilitation

Le registre doit évoluer au-delà d’un modèle centré uniquement sur les cours.

| Dimension | Exemples | Règle |
|---|---|---|
| Module | Inscriptions, Analytics, Présences | Explicite pour toute capacité métier |
| Saison | `2026-2027`, `*` | `*` réservé aux besoins globaux validés |
| Section | Karaté classique, Féminin, Body Karaté | Facultatif selon l’action |
| Cours | Baby, Enfant 1, Enfant 2, Ado/Adulte, Féminin, Body Karaté | Obligatoire pour les opérations liées à un cours |
| Période | Début et fin de validité | Aucune permission hors période |

Une portée absente n’est pas interprétée comme globale. Une capacité inconnue, un module inconnu ou un périmètre incohérent invalide l’entrée concernée.

## 8. Interface de contrôle Inscriptions

L’interface privée Inscriptions est organisée autour d’une file de travail et non d’un tableur exposé.

### 8.1 Tableau de bord

Le tableau de bord présente au minimum :

- dossiers reçus, à contrôler, confirmés, complets et abandonnés ;
- places à confirmer, listes d’attente et refus ;
- lots Google Forms à analyser, à valider, appliqués ou en anomalie ;
- formalités et règlements restant à contrôler ;
- anomalies SIKADA et numéros FFKDA restant à importer ;
- activations vers Analytics et Présences restant à effectuer.

Les nombres et raccourcis sont filtrés selon les capacités et périmètres de l’utilisateur.

### 8.2 Analyse d’un lot Google Forms

L’écran permet de :

1. sélectionner une source et un périmètre borné ;
2. lancer `ANALYSER_SOURCE_GOOGLE_FORMS` sans écriture métier ;
3. consulter le rapport agrégé ;
4. examiner séparément les cas `CERTAIN`, `PROBABLE`, `AMBIGU` et `ABSENT` ;
5. confirmer ou rejeter une correspondance avec motif ;
6. valider le lot lorsque tous les contrôles obligatoires sont levés ;
7. appliquer le lot dans une action distincte et confirmée.

Une analyse ne rend jamais le bouton d’application disponible si le lot ou l’utilisateur ne satisfait pas toutes les préconditions.

### 8.3 Dossier saisonnier

La fiche sépare clairement :

- l’identité stable du licencié ;
- les coordonnées et responsables légaux ;
- le dossier de la saison et la section ;
- l’affectation au cours et l’état de place ;
- les formalités, règlements et aides ;
- le traitement SIKADA et le numéro FFKDA ;
- l’activation opérationnelle ;
- l’historique des décisions et corrections autorisées.

Les quatre axes d’état définis dans `INSCRIPTIONS-002` ne sont jamais résumés par un statut unique trompeur.

## 9. Interface de gestion des habilitations

L’écran Habilitations est réservé à `ACCESS_MANAGE`. Il permet de :

- rechercher, créer et modifier un compte par adresse Google ;
- activer ou désactiver le compte sans supprimer sa traçabilité ;
- attribuer plusieurs rôles et capacités ;
- limiter chaque droit par module, saison, section, cours et période ;
- afficher les droits bruts et les droits effectifs calculés ;
- prévisualiser l’impact avant enregistrement ;
- refuser le retrait ou la désactivation du dernier administrateur actif ;
- consigner un motif pour les modifications sensibles ;
- afficher la date, l’auteur et le résultat de la dernière modification.

L’interface ne permet pas de créer un rôle ou une capacité libre non déclaré dans le contrat applicatif.

## 10. Cycle de modification du registre

Toute modification suit ce cycle :

1. identification serveur de l’acteur ;
2. vérification de `ACCESS_MANAGE` ;
3. chargement de la version courante ;
4. validation complète de la proposition ;
5. contrôle de concurrence et du dernier administrateur ;
6. affichage de l’impact ;
7. confirmation explicite ;
8. écriture atomique de la nouvelle version ;
9. relecture et vérification ;
10. audit avant/après minimisé ;
11. restauration de la version précédente en cas d’échec.

Une procédure de récupération conserve temporairement la liste administrative embarquée tant qu’une bascule complète et une recette de récupération n’ont pas été validées.

## 11. Protection serveur

Chaque route, lecture et commande déclare :

- la capacité requise ;
- le module ;
- le périmètre éventuel ;
- le caractère sensible de l’action ;
- la politique d’audit.

Le serveur recalcule les droits à chaque appel sensible. La navigation, les champs désactivés et les confirmations client améliorent l’expérience utilisateur mais ne constituent jamais un contrôle de sécurité.

Les refus utilisent les codes `ACCESS-001` existants. Les erreurs publiques restent génériques et corrélables, sans révéler le registre ni l’existence d’un dossier nominatif.

## 12. Sécurisation d’Analytics et de Google Drive

Le raccordement d’Analytics exige trois niveaux distincts :

1. `ANALYTICS_READ` protège la route et l’écran de consultation ;
2. `ANALYTICS_PREVIEW` et `ANALYTICS_PUBLISH` protègent les commandes serveur ;
3. les droits de partage Google Drive protègent les fichiers générés ou publiés.

Une URL Drive ne doit pas devenir une voie de contournement. Les rapports nominatifs ne sont ni publics ni partagés par lien. Toute divergence entre droits applicatifs et partage Drive est une anomalie bloquante avant activation du parcours privé Analytics.

## 13. Audit et protection des données

Sont audités au minimum :

- création, modification, activation et désactivation d’un compte ;
- ajout ou retrait d’un rôle, d’une capacité ou d’un périmètre ;
- refus d’une action sensible ;
- validation et application d’un lot ;
- correction d’un dossier, décision de place et activation ;
- prévisualisation ou publication Analytics lorsqu’elle modifie une ressource.

Les journaux ne recopient ni le registre complet ni le contenu nominatif des dossiers. Ils conservent uniquement les éléments nécessaires à la preuve : acteur, action, cible technique, résultat, date, motif requis et identifiant de corrélation.

## 14. Accessibilité et ergonomie

Les interfaces respectent `UI-001` et `UX-001` :

- navigation clavier et focus visible ;
- cibles tactiles adaptées ;
- libellés explicites et états non transmis par la couleur seule ;
- confirmation des actions irréversibles ou à fort impact ;
- prévention des doubles soumissions ;
- message compréhensible et possibilité de reprise après erreur ;
- affichage mobile prioritaire pour Présences et adaptatif pour les autres écrans.

Les données nominatives ne sont jamais utilisées dans les notifications globales ou messages d’erreur publics.

## 15. Matrice minimale de validation

| Cas | Résultat attendu |
|---|---|
| Identité Google absente | Refus fermé de l’espace privé |
| Compte actif sans capacité du module | Module masqué et route refusée |
| URL Analytics directe sans `ANALYTICS_READ` | Refus serveur |
| Consultation avec `ANALYTICS_READ` | Lecture autorisée, publication refusée |
| Présences seule | Présences visible, Inscriptions et Analytics masqués |
| Analyse Inscriptions sans droit d’application | Rapport autorisé, application refusée |
| Lot ambigu non contrôlé | Application indisponible et refus serveur |
| Paramètre de capacité falsifié par le client | Ignoré et droits recalculés |
| Périmètre de saison ou cours non autorisé | Refus |
| Compte ou capacité inconnue | Entrée invalide et refus fermé |
| Retrait du dernier administrateur | Mise à jour rejetée |
| Écriture concurrente du registre | Conflit détecté, aucune perte silencieuse |
| Modification d’habilitation réussie | Relecture conforme et audit créé |
| Droit applicatif Analytics sans accès Drive requis | Anomalie bloquante signalée |
| Compte désactivé ou expiré | Aucun module privé accessible |

Les tests automatisés utilisent des identités, registres et ressources injectés. La recette réelle emploie des comptes et fichiers de recette bornés avant toute bascule de production.

## 16. Stratégie de migration

La migration est incrémentale :

1. étendre et tester le catalogue `ACCESS-001` ;
2. introduire `ANALYTICS_READ` et les capacités Inscriptions sans changer les droits existants ;
3. remplacer les indicateurs `authorized: true` de navigation par le contexte réel ;
4. protéger les routes Analytics et le Centre de pilotage par le service central ;
5. livrer l’interface Habilitations avec récupération administrateur testée ;
6. livrer l’interface de contrôle Inscriptions ;
7. aligner les partages Drive et réaliser la recette multi-profils ;
8. retirer l’ancien contrôle `AKS.Admin.Access` uniquement après validation complète.

Aucune étape ne doit interrompre l’accès des administrateurs existants ni élargir silencieusement les droits des utilisateurs de Présences.

## 17. Limites et dépendances

Le présent document ne :

- développe pas les interfaces ;
- modifie pas le registre ou les comptes réels ;
- remplace pas encore `AKS.Admin.Access` ;
- détermine pas le stockage physique d’AKS Inscriptions ;
- définit pas les contrats détaillés SIKADA, Questionnaire santé, Analytics et Présences ;
- ajoute pas encore `BODY_KARATE` aux catalogues applicatifs ;
- modifie pas les partages Google Drive ;
- crée pas un espace licencié ni un compte propre à AKS Platform.

Les contrats techniques et intégrations relèvent d’`INSCRIPTIONS-005`. La recette cumulative, notamment multi-profils et récupération administrateur, relève d’`INSCRIPTIONS-006`.

## 18. Critères d’acceptation

`INSCRIPTIONS-004` est validable lorsque :

- le caractère transverse d’`ACCESS-001` est confirmé ;
- les espaces publics et privés sont séparés ;
- les capacités Analytics, Inscriptions et Présences sont distinctes et cumulables ;
- `ANALYTICS_READ` est distinct de la prévisualisation et de la publication ;
- la navigation et chaque route reposent sur les capacités réelles ;
- l’interface de contrôle sépare analyse, validation et application ;
- l’interface Habilitations protège le dernier administrateur et la concurrence ;
- les périmètres module, saison, section et cours sont définis ;
- la protection des fichiers Drive complète la protection applicative ;
- la migration conserve les accès existants et la récupération administrateur ;
- aucun code, compte, formulaire, classeur ou partage réel n’est modifié.

## 19. Décisions structurantes

1. `ACCESS-001` devient le socle commun de tous les accès privés d’AKS Platform.
2. Les rôles décrivent les profils ; les capacités décrivent les actions par module.
3. La lecture Analytics possède sa capacité propre `ANALYTICS_READ`.
4. L’espace privé est accessible à tout compte autorisé, pas uniquement aux administrateurs.
5. La navigation est calculée, tandis que le serveur reste l’autorité de sécurité.
6. Les interfaces d’analyse et d’application des imports restent séparées.
7. L’administration des habilitations exige `ACCESS_MANAGE`, une confirmation, une relecture et un audit.
8. Les partages Google Drive doivent être cohérents avec les droits applicatifs.
9. La liste administrative embarquée reste temporairement un mécanisme de récupération.

## 20. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-08-02 | Validation du contrat d’interface et ouverture d’INSCRIPTIONS-005 consacré aux contrats techniques, au stockage et aux intégrations |
| 1.0.0 | 2026-08-02 | Création du contrat d’interface Inscriptions et du cadrage transverse des accès privés Analytics, Présences et administration |
