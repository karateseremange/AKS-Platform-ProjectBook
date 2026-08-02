# INSCRIPTIONS-002 — Modèle métier d’AKS Inscriptions

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-002 |
| **Version** | 1.0.1 |
| **Statut** | Validé |
| **Nature** | Modèle métier du module |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit le modèle métier initial d’**AKS Inscriptions** : objets, identifiants, relations, états, invariants et frontières de responsabilité.

Il complète le cadrage validé dans `INSCRIPTIONS-001`. Il ne définit ni les services techniques, ni les interfaces, ni les formats détaillés des intégrations externes, qui relèvent respectivement d’`INSCRIPTIONS-003`, `INSCRIPTIONS-004` et `INSCRIPTIONS-005` conformément à `STD-001`.

Aucun développement applicatif n’est autorisé par ce seul document.

## 2. Principes structurants

1. Une personne possède un identifiant interne AKS stable, indépendant de la saison et de la FFKDA.
2. Une inscription est représentée par un dossier saisonnier distinct de la personne.
3. Une même personne peut pratiquer plusieurs sections pendant une même saison sans être dupliquée.
4. La section pratiquée et le cours opérationnel sont deux notions différentes.
5. L’identité normalisée utilisée par AKS ne doit pas effacer silencieusement la valeur reçue d’une source externe.
6. Les imports Google Forms et SIKADA sont relançables, traçables et sans création de doublons.
7. Le numéro de licence FFKDA est une donnée externe facultative ; il n’est jamais l’identifiant interne AKS.
8. Les états du dossier, de la place, du traitement fédéral et de l’activation sont suivis séparément.
9. Une donnée médicale détaillée ou bancaire n’entre jamais dans le modèle.
10. Les règles dépendant d’une saison sont versionnées et ne sont pas déduites d’une formule historique implicite.

## 3. Vue d’ensemble des objets

| Objet | Responsabilité métier | Identifiant proposé |
|---|---|---|
| `Licencie` | Représenter durablement une personne connue d’AKS | `LIC-xxxxxx` |
| `ResponsableLegal` | Représenter une personne responsable d’un ou plusieurs mineurs | `RSP-xxxxxx` |
| `LienResponsable` | Qualifier le lien entre un licencié et un responsable | Clé technique |
| `Saison` | Porter les dates, règles et état d’une saison sportive | `2026-2027` |
| `Section` | Identifier l’activité pratiquée | Code stable |
| `Cours` | Identifier un groupe ou créneau opérationnel d’une saison | Code stable + saison |
| `DossierSaisonnier` | Porter le parcours administratif d’une personne pour une section et une saison | `INS-AAAA-NNNNNN` |
| `AffectationCours` | Historiser l’entrée, la sortie ou le changement de cours | Clé technique |
| `Formalite` | Suivre une pièce, une attestation ou un contrôle attendu | Clé technique |
| `Reglement` | Suivre les montants, moyens, remises, aides et échéances | Clé technique |
| `LienExterne` | Relier le dossier aux sources Google Forms, Questionnaire santé et SIKADA | Clé composée par source |
| `LotImport` | Tracer l’analyse puis la validation d’un fichier ou ensemble de réponses | `IMP-AAAA-NNNNNN` |

## 4. Licencié

### 4.1 Identité interne

`Licencie` représente la personne de manière stable entre les saisons et les pratiques.

Son identifiant canonique suit le format `LIC-000001`.

- il est généré par AKS Platform ;
- il est non signifiant et ne contient ni année de naissance, ni cours, ni numéro fédéral ;
- il n’est jamais réutilisé après fusion, archivage ou suppression logique ;
- il ne change pas lors d’un renouvellement, d’un changement de cours ou d’une nouvelle section ;
- les détails d’allocation et de concurrence seront définis dans `INSCRIPTIONS-003`.

### 4.2 Attributs durables

Le référentiel porte uniquement les informations stables ou réutilisables :

- nom et prénoms normalisés ;
- nom d’usage lorsqu’il est nécessaire ;
- date et lieu de naissance ;
- sexe lorsque requis par le traitement administratif ;
- nationalité lorsque requise pour la demande fédérale ;
- coordonnées principales et adresse postale ;
- numéro de licence FFKDA lorsqu’il est connu ;
- état du référentiel : actif, fusionné, archivé ou à vérifier ;
- références d’audit des créations et corrections importantes.

Les informations purement saisonnières, telles que le cours, le tarif, la formalité attendue ou l’état du règlement, n’appartiennent pas au licencié.

### 4.3 Numéro de licence FFKDA

Le numéro FFKDA :

- est créé uniquement dans SIKADA ;
- peut être absent pour un nouveau licencié ;
- est stocké comme texte afin de préserver les zéros initiaux et le suffixe ;
- reste unique lorsqu’il est renseigné ;
- ne remplace jamais `licencie_id`.

L’export SIKADA audité utilise le format courant `12345678A`. Le contrat connu est donc **huit chiffres suivis d’une lettre**, soit `^[0-9]{8}[A-Z]$` après normalisation en majuscules. Une valeur d’un autre format n’est pas détruite : elle est conservée comme valeur source et placée en anomalie pour contrôle.

L’exigence actuelle d’Analytics limitée à huit chiffres concerne bien `numero_licence`, et non `licencie_id`. Elle devra être corrigée dans un incrément d’intégration avant alimentation officielle par AKS Inscriptions.

### 4.4 Doublons et fusion

La ressemblance d’identité ne suffit pas à fusionner automatiquement deux personnes. Un doublon potentiel est évalué à partir du nom, des prénoms, de la date de naissance, du numéro FFKDA lorsqu’il existe et d’éléments de confirmation tels que le sexe, la ville, l’adresse électronique ou le téléphone.

Une fusion validée conserve l’identifiant AKS retenu, la référence de l’identifiant fusionné, tous les dossiers et liens externes, ainsi que l’auteur, la date et le motif de la décision.

## 5. Responsable légal

`ResponsableLegal` représente une personne distincte du licencié mineur. Un responsable peut être lié à plusieurs enfants et un enfant peut avoir plusieurs responsables.

Le lien précise au minimum la qualité déclarée, le caractère principal ou secondaire du contact, les coordonnées de notification, ses dates de validité, sa source et son état de contrôle.

Une personne majeure n’est pas automatiquement créée comme son propre responsable légal. Une adresse électronique commune n’établit pas à elle seule l’identité d’un responsable.

## 6. Saison

`Saison` représente une période sportive, par exemple `2026-2027`. Elle porte notamment :

- date de début et date de fin ;
- état : `PREPARATION`, `ACTIVE`, `CLOTUREE` ou `ARCHIVEE` ;
- période de priorité des licenciés actuels ;
- date de la journée principale d’inscription ;
- table d’affectation par année de naissance ;
- catalogue des sections et cours ouverts ;
- capacités et règles de liste d’attente ;
- règles de formalités, tarifs, remises et aides ;
- versions des modèles de notification applicables.

Une modification de règle saisonnière ne doit pas réécrire silencieusement les décisions déjà confirmées. Elle s’applique selon une date d’effet explicite.

## 7. Sections et cours

### 7.1 Sections

| Code | Libellé | Code fédéral connu |
|---|---|---|
| `KARATE_CLASSIQUE` | Karaté classique | `SHOT` |
| `FEMININ` | Cours féminin | `SHOT` à confirmer selon l’usage fédéral |
| `BODY_KARATE` | Body Karaté | `BODY` |

Le code fédéral ne fait pas partie de l’identité de la section. Il est une règle de préparation SIKADA versionnée.

### 7.2 Cours

| Section | Code cours |
|---|---|
| `KARATE_CLASSIQUE` | `BABY` |
| `KARATE_CLASSIQUE` | `ENFANT_1` |
| `KARATE_CLASSIQUE` | `ENFANT_2` |
| `KARATE_CLASSIQUE` | `ADO_ADULTE` |
| `FEMININ` | `FEMININ` |
| `BODY_KARATE` | `BODY_KARATE` |

Cette séparation permet d’ajouter plusieurs créneaux Body Karaté sans recréer une section ni changer l’identité de la personne.

Analytics et Présences ne connaissent actuellement que les cinq premiers codes. `BODY_KARATE` devra être ajouté à leurs catalogues, configurations, contrôles d’accès, sources et tests avant activation opérationnelle.

## 8. Dossier saisonnier

`DossierSaisonnier` représente le parcours d’inscription d’une personne pour une saison et une section.

### 8.1 Unicité

La combinaison `licencie_id + saison_id + section_code` est unique.

- Karaté classique et Body Karaté peuvent produire deux dossiers pour la même personne et la même saison ;
- deux réponses Google Forms pour la même section ne créent pas automatiquement deux dossiers ;
- une correction ou un nouvel envoi est rapproché du dossier existant ou placé en contrôle ;
- un changement de cours modifie l’affectation, pas l’identité du dossier.

### 8.2 Attributs principaux

Le dossier porte notamment :

- référence `INS-AAAA-NNNNNN` ;
- saison, section et licencié ;
- type de parcours : nouveau, renouvellement ou à déterminer ;
- pratique antérieure et ceinture déclarée pour un nouvel inscrit ;
- états métier distincts définis au chapitre 10 ;
- cours proposé et cours confirmé ;
- dates de réception, contrôle, confirmation et finalisation ;
- formalités, règlements et liens externes ;
- observations administratives nécessaires et non sensibles ;
- auteurs et dates des décisions importantes.

La ceinture déclarée reste informative et ne vaut pas reconnaissance automatique d’un grade.

## 9. Affectation au cours

`AffectationCours` historise le rattachement opérationnel : cours proposé, origine de la proposition, cours confirmé, dates d’effet, motif d’une dérogation et acteur de la décision.

Pour le karaté classique 2026–2027 :

| Année de naissance | Cours proposé |
|---|---|
| 2021 à 2023 | `BABY` |
| 2017 à 2020 | `ENFANT_1` |
| 2013 à 2016 | `ENFANT_2` |
| 2012 et avant | `ADO_ADULTE` |

La règle produit une proposition contrôlable. Une dérogation reste possible avec motif et traçabilité.

## 10. États métier indépendants

Un statut unique ne permet pas de représenter correctement le parcours. Quatre axes sont obligatoires.

### 10.1 État administratif du dossier

| État | Signification |
|---|---|
| `RECUE` | Préinscription enregistrée ou importée |
| `A_CONTROLER` | Vérification ou correction nécessaire |
| `CORRIGEE` | Données administratives contrôlées |
| `CONFIRMEE` | Modalités confirmées au demandeur |
| `INSCRIPTION_EN_COURS` | Finalisation engagée au dojo |
| `DOSSIER_COMPLET` | Formalités et règlement conformes |
| `ABANDONNEE` | Demande non poursuivie |
| `ANNULEE` | Dossier annulé après création |
| `REFUSEE` | Dossier refusé avec motif traçable |

### 10.2 État de la place

| État | Signification |
|---|---|
| `A_EVALUER` | Capacité non encore contrôlée |
| `A_CONFIRMER` | Place probable nécessitant une décision |
| `CONFIRMEE` | Place réservée ou attribuée |
| `LISTE_ATTENTE` | Aucune place confirmée à ce stade |
| `REFUSEE` | Place non accordée |
| `LIBEREE` | Place précédemment attribuée puis libérée |

### 10.3 État fédéral

| État | Signification |
|---|---|
| `NON_PREPARE` | Aucun traitement SIKADA engagé |
| `A_SAISIR` | Dossier prêt pour la saisie fédérale |
| `SAISI_SIKADA` | Saisie déclarée comme effectuée |
| `LICENCE_IMPORTEE` | Numéro FFKDA rapproché et validé |
| `ANOMALIE` | Écart fédéral à contrôler |

### 10.4 État d’activation opérationnelle

| État | Signification |
|---|---|
| `INACTIF` | Non exposé aux outils opérationnels |
| `ACTIF` | Éligible aux cours, listes et présences autorisés |
| `SUSPENDU` | Activation temporairement interrompue |
| `SORTI` | Fin d’éligibilité pour le dossier concerné |

Un dossier peut être `DOSSIER_COMPLET` et `ACTIF` alors que son état fédéral est encore `SAISI_SIKADA`, dans l’attente de l’import du numéro FFKDA.

Chaque transition sensible est datée, attribuée à un acteur et accompagnée d’un motif lorsque nécessaire. Les commandes et transitions seront détaillées dans `INSCRIPTIONS-003`.

## 11. Formalités

`Formalite` représente une exigence administrative : demande de licence, certificat médical, Questionnaire santé ou attestation, photo, autorisation d’image, t-shirt ou autre pièce validée.

Chaque formalité porte son type, sa règle d’applicabilité, son état (`NON_APPLICABLE`, `A_FOURNIR`, `RECUE`, `CONTROLEE`, `REFUSEE` ou `EXPIREE`), les dates, l’acteur du contrôle et une référence documentaire éventuelle.

Le sac est exclu du suivi classique. AKS Inscriptions ne stocke jamais les réponses médicales détaillées. Pour le Questionnaire santé mineur, seul le résultat administratif et la référence `QS-AAAA-NNNNNN` peuvent être liés au dossier.

## 12. Règlements

`Reglement` sépare le montant attendu des mouvements réellement reçus. Il permet de représenter la cotisation, les remises, aides, échéances, moyens de règlement et une référence externe facultative comme HelloAsso.

États : `NON_CALCULE`, `A_REGLER`, `PARTIEL`, `REGLE`, `EXONERE`, `ANNULE` ou `ANOMALIE`.

Aucune donnée bancaire, numéro de carte ou secret de paiement n’est stocké. Le paiement en ligne reste hors périmètre.

## 13. Liens externes et imports

### 13.1 Lien externe

`LienExterne` associe une source à un licencié ou un dossier sans en faire la source de vérité métier. Il contient le type de source, son identifiant, l’identifiant stable de réponse ou d’enregistrement, la date, l’état de rapprochement et le lot d’import.

La clé `type_source + identifiant_source + identifiant_reponse` est unique.

### 13.2 Lot d’import

`LotImport` sépare obligatoirement l’analyse de l’écriture validée. Ses états minimaux sont `RECU`, `ANALYSE`, `A_VALIDER`, `VALIDE`, `APPLIQUE`, `PARTIEL`, `REJETE` et `ANNULE`.

Le lot conserve la source, le nom logique du fichier ou formulaire, la date, l’acteur, les totaux agrégés et les anomalies. Le contenu nominatif détaillé n’est pas copié dans les journaux techniques.

## 14. Reprise Google Forms

Les trois Google Forms restent opérationnels jusqu’à la bascule vers AKS Platform. L’import doit :

1. conserver la réponse source et sa date ;
2. normaliser sans altérer la source ;
3. détecter une réponse déjà traitée grâce à sa clé externe ;
4. rechercher un licencié puis un dossier existants ;
5. classer le rapprochement comme certain, probable, ambigu ou absent ;
6. exiger une décision manuelle pour les cas ambigus ;
7. créer ou compléter sans écraser une correction validée plus récente ;
8. produire un rapport avant activation ;
9. permettre une relance sans duplication.

Un nouvel envoi peut être une correction, un doublon ou une nouvelle demande de section. Le formulaire seul ne suffit pas à le décider automatiquement.

## 15. Import SIKADA

SIKADA reste la source de vérité du numéro de licence FFKDA. Le rapprochement utilise prioritairement le nom, le prénom et la date de naissance normalisés, puis le numéro existant, le sexe et la ville comme éléments de confirmation.

La combinaison `Nom + Prénom + Date de naissance` est unique dans l’échantillon audité de 136 lignes, sans constituer une garantie permanente.

Les résultats distinguent les correspondances certaines, à vérifier, absentes, identiques, contradictoires et les doublons de numéro. Aucune correspondance ambiguë ou contradictoire n’est appliquée automatiquement.

Le format détaillé du fichier texte tabulé Windows-1252 et son nettoyage seront définis dans `INSCRIPTIONS-005`.

## 16. Intégration avec Analytics et Présences

AKS Inscriptions devient la source d’alimentation du référentiel opérationnel. Le contrat doit fournir au minimum `licencie_id`, `numero_licence` facultatif, saison, code cours, dates d’entrée et de sortie, et état d’activation.

Deux écarts doivent être corrigés avant l’intégration :

1. `AnalyticsNormalizer.gs` valide actuellement `numero_licence` avec huit chiffres seulement ;
2. les catalogues Analytics, Présences et contrôle d’accès ne contiennent pas encore `BODY_KARATE`.

Ces corrections relèvent d’un incrément applicatif ultérieur avec tests de non-régression. Elles ne sont pas réalisées dans `INSCRIPTIONS-002`.

## 17. Source de vérité et historisation

| Donnée | Source de vérité |
|---|---|
| Identité AKS contrôlée | Référentiel `Licencie` |
| Réponse brute de préinscription | Google Forms ou formulaire AKS conservé comme origine |
| Décision de place | `DossierSaisonnier` et historique d’état |
| Affectation au cours | `AffectationCours` |
| Formalités et contrôles | `Formalite` |
| Situation financière interne | `Reglement` |
| Numéro de licence fédéral | SIKADA, importé dans `Licencie` |
| Réponses médicales détaillées | Jamais stockées dans AKS Inscriptions |
| Présences | Référentiel Analytics/Présences |

Une correction métier validée n’est jamais écrasée silencieusement par un nouvel import. L’écart est présenté pour décision.

## 18. Protection des données

Le modèle applique `SECURITY-001`, `STORAGE-001`, `LOG-001` et `AUDIT-001` : minimisation, moindre privilège, traçabilité des actions sensibles, séparation des données et journaux, absence de données médicales détaillées et bancaires, confidentialité des exports et durées de conservation définies avant production.

## 19. Invariants métier

1. Un `licencie_id` identifie au plus une personne active.
2. Un numéro FFKDA connu ne peut être associé qu’à un seul licencié actif.
3. Un seul dossier actif existe par licencié, saison et section.
4. Un dossier référence une saison existante et une section connue.
5. Une affectation active utilise un cours appartenant à la section et à la saison du dossier.
6. Une place confirmée ne rend pas automatiquement le dossier complet.
7. Un dossier complet ne signifie pas que le numéro FFKDA a été importé.
8. Une activation exige une place confirmée, une affectation active et les contrôles définis par la saison.
9. Une réponse Google Forms déjà importée ne crée pas de nouveau dossier lors d’une relance.
10. Une valeur externe n’écrase jamais silencieusement une donnée contrôlée plus récente.
11. Aucune réponse médicale détaillée ni donnée bancaire n’est enregistrée.

## 20. Points restant à définir

- règles exactes de génération concurrente des identifiants ;
- commandes, transitions et règles de réouverture ;
- champs détaillés des trois formulaires ;
- rôles nominatifs et périmètres de modification ;
- tarifs, capacités, formalités et horaires Body Karaté ;
- règle médicale des renouvellements ;
- politique de conservation, archivage et suppression ;
- seuils de rapprochement et écrans de décision ;
- traitement d’un export SIKADA contenant Body Karaté ;
- formats physiques de stockage et contrats de service.

## 21. Critères d’acceptation

`INSCRIPTIONS-002` est validable lorsque :

- les objets métier et leurs responsabilités sont distingués ;
- l’unicité d’un dossier par personne, saison et section est définie ;
- l’identifiant AKS et le numéro FFKDA sont clairement séparés ;
- le format réel connu du numéro FFKDA est consigné comme texte `8 chiffres + 1 lettre` ;
- les sections sont séparées des cours opérationnels ;
- les quatre axes d’état sont définis ;
- les formalités, règlements, affectations et liens externes sont modélisés ;
- la reprise Google Forms est idempotente et traçable ;
- l’import SIKADA impose une validation des ambiguïtés ;
- les dépendances Analytics et `BODY_KARATE` sont explicites ;
- les invariants et limites sont documentés ;
- aucun code applicatif ni aucune donnée réelle n’est modifié.

## 22. Livrables suivants

- `INSCRIPTIONS-003` définira les services, commandes et transitions ;
- `INSCRIPTIONS-004` définira les interfaces publiques et administratives ;
- `INSCRIPTIONS-005` définira les contrats Google Forms, Questionnaire santé, SIKADA, Analytics et Présences ;
- `INSCRIPTIONS-006` définira la stratégie de validation et la recette cumulative.

## 23. Décisions structurantes

1. `LIC-xxxxxx` est l’identifiant interne stable de la personne.
2. Le numéro FFKDA est externe, facultatif, unique lorsqu’il est connu et stocké comme texte.
3. Le format SIKADA actuel observé est `8 chiffres + 1 lettre` ; la validation Analytics à huit chiffres devra être corrigée.
4. Une personne peut avoir plusieurs dossiers pendant une saison, mais un seul par section.
5. Section, cours et affectation sont trois notions distinctes.
6. Les états administratif, de place, fédéral et d’activation sont indépendants.
7. Les imports Google Forms et SIKADA sont analysés avant application et relançables sans doublon.
8. `BODY_KARATE` doit être ajouté aux référentiels Analytics et Présences avant activation.
9. Les réponses médicales détaillées et données bancaires sont exclues du modèle.

## 24. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-08-02 | Validation formelle du modèle métier après fusion de la PR #90 dans `develop` et ouverture des services et contrats de reprise `INSCRIPTIONS-003` |
| 1.0.0 | 2026-08-02 | Création du modèle métier : référentiel stable, dossiers saisonniers, états indépendants, imports Google Forms et SIKADA, format FFKDA réel et dépendances Analytics/Body Karaté |
