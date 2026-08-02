# INSCRIPTIONS-006 — Jeux d’essai et stratégie de recette cumulative

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-006 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Nature** | Stratégie de validation, jeux d’or et recette cumulative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit la stratégie de validation cumulative d’**AKS Inscriptions**, les jeux d’essai de référence, les oracles attendus, les protections de l’environnement de recette et les preuves nécessaires avant toute écriture de production.

Il complète `INSCRIPTIONS-001` à `INSCRIPTIONS-005`. Il ne développe aucun composant, ne crée aucune ressource Google et n’autorise aucune écriture dans les données réelles.

## 2. Objectifs

La validation doit démontrer que le module :

- interprète correctement les trois sources Google Forms ;
- rapproche les personnes sans créer de doublon silencieux ;
- conserve les quatre axes d’état indépendants d’un dossier saisonnier ;
- attribue des identifiants uniques, durables et non réutilisables ;
- résiste aux relances, conflits et interruptions ;
- applique les contrôles d’accès et l’audit fonctionnel ;
- limite strictement les écritures vers Analytics, Présences et Questionnaire santé ;
- permet une sauvegarde, une restauration et une reprise contrôlées ;
- n’introduit aucune régression dans la suite cumulative d’AKS Platform.

## 3. Principes de validation

1. Un test ne cible jamais une ressource réelle par défaut.
2. Toute fonction utilisant Google réellement exige un lancement explicite et un environnement déclaré `RECETTE`.
3. Les données de test sont fictives, minimisées, immuables et versionnées.
4. Les oracles sont calculés indépendamment du code testé.
5. Une réussite ne peut pas masquer une écriture partielle, un audit absent ou une synchronisation non confirmée.
6. Chaque anomalie reproduite devient un cas de non-régression.
7. Les tests rapides et déterministes restent séparés des recettes réelles lentes ou concurrentes.
8. Une preuve de restauration est obligatoire avant toute autorisation d’écriture en production.

## 4. Niveaux de validation

| Niveau | Cible | Accès Google réel | Déclenchement |
|---|---|---|---|
| Tests unitaires | Normalisations, rapprochements, transitions, identifiants | Non | Suite cumulative |
| Tests de contrats | Schémas, adaptateurs Forms, SIKADA, Analytics et erreurs | Non | Suite cumulative |
| Tests d’intégration | Dépôts en mémoire, commandes, audit, reprise et concurrence simulée | Non | Suite cumulative |
| Intégration Apps Script | Classeur et dossiers de recette configurés | Oui, recette uniquement | Explicite |
| Recette fonctionnelle | Parcours administrateur complet sur données fictives | Oui, environnement isolé | Manuelle et tracée |
| Non-régression | Ensemble des tests automatisés AKS Platform | Non par défaut | À chaque incrément |

Les fonctions de recette réelle sont exclues de la suite cumulative automatisée. Leur nom, leur point d’entrée et leur confirmation doivent rendre impossible un lancement accidentel.

## 5. Organisation de la suite

La suite Inscriptions est organisée par couches indépendantes :

| Couche | Responsabilité |
|---|---|
| `fixtures` | Sources fictives, schémas, registres d’accès et états initiaux |
| `oracles` | Résultats attendus immuables et empreintes |
| `unit` | Fonctions pures et règles métier |
| `contracts` | Formats externes, versions et erreurs fermées |
| `integration` | Dépôts, commandes, idempotence et audit |
| `apps-script-recipe` | Ressources Google isolées et contrôles avant/après |
| `manual` | Scénarios, acteurs, preuves et procès-verbal |
| `regression` | Incidents corrigés et invariants transverses |

Chaque test possède un identifiant stable, une finalité, des préconditions, des données d’entrée, un oracle, un résultat et, lorsqu’il écrit en recette, une preuve avant/après.

## 6. Fixtures et oracles

Une fixture :

- ne contient aucune donnée réelle ou réidentifiable ;
- précise sa source logique et sa version d’adaptateur ;
- conserve les valeurs brutes nécessaires à la reproduction ;
- encode explicitement les absences, inconnues et valeurs invalides ;
- possède une empreinte stable ;
- n’est modifiée qu’avec une justification documentée.

Un oracle :

- est produit indépendamment du chemin d’exécution testé ;
- décrit les objets créés, modifiés, refusés ou inchangés ;
- couvre les identifiants, états, versions et événements d’audit attendus ;
- distingue absence, valeur inconnue, valeur invalide et réponse négative ;
- inclut les ressources qui doivent impérativement rester inchangées.

Une mise à jour conjointe du code et de l’oracle exige une revue explicite : un résultat réel ne devient jamais automatiquement la nouvelle vérité attendue.

## 7. Catalogue minimal des jeux d’or

| ID | Scénario | Oracle essentiel |
|---|---|---|
| `INS-GOLD-001` | Import nominal Karaté classique | Dossier créé sans donnée inventée dans les états initiaux `RECUE`, `A_EVALUER`, `NON_PREPARE` et `INACTIF` |
| `INS-GOLD-002` | Formulaire féminin avec champs structurellement absents | Champs marqués `INCONNU`, jamais convertis en `NON` |
| `INS-GOLD-003` | Body Karaté synthétique | Réponses spécifiques présentes et contrôlées |
| `INS-GOLD-004` | Valeurs absentes, invalides et conversion `Africa/Ceuta` vers `Europe/Paris` | Normalisation déterministe et erreurs explicites |
| `INS-GOLD-005` | Réponse connue, déplacée, modifiée ou soumise deux fois | Localisation et empreinte détectent le cas sans doublon |
| `INS-GOLD-006` | Rapprochements `CERTAIN`, `PROBABLE`, `AMBIGU` et `ABSENT` | Aucune fusion automatique hors règles autorisées |
| `INS-GOLD-007` | Mineur, responsables multiples et responsable partagé | Liens distincts, aucune duplication silencieuse |
| `INS-GOLD-008` | Allocations concurrentes `LIC`, `RSP`, `INS` et `IMP` | Unicité, monotonie et numéros consommés non réutilisés |
| `INS-GOLD-009` | Relance idempotente, conflit de clé et interruption | Même résultat, conflit fermé ou reprise contrôlée |
| `INS-GOLD-010` | Transitions du lot et des quatre axes du dossier | Transitions interdites refusées sans état hybride |
| `INS-GOLD-011` | Refus d’accès, périmètres et URL directe | Refus serveur et journaux minimisés |
| `INS-GOLD-012` | Audit obligatoire indisponible | Aucune réussite métier annoncée |
| `INS-GOLD-013` | SIKADA Windows-1252, 12 colonnes et enveloppes `="..."` | Analyse sûre, contenu invalide ou hostile refusé |
| `INS-GOLD-014` | Liaison Questionnaire santé | Référence et résultat administratif uniquement |
| `INS-GOLD-015` | Synchronisation Analytics et Présences | Écriture bornée aux licenciés, numéro FFKDA textuel accepté |
| `INS-GOLD-016` | Sauvegarde, migration et restauration | État restauré conforme, preuve avant/après complète |

Ce catalogue est minimal. Les variantes de frontière, erreurs réelles et défauts corrigés l’étendent sans supprimer les cas antérieurs.

## 8. Trois sources Google Forms

Les tests de contrats couvrent séparément :

- Karaté classique ;
- Cours féminin ;
- Body Karaté.

Pour chaque source, ils vérifient les en-têtes attendus, les champs structurellement absents, le fuseau, les dates, les réponses multiples, les lignes déplacées et les changements de schéma.

Aucun test destructif ne lit ou n’écrit les trois formulaires ou feuilles de réponses réels. Les contrats utilisent des exports fictifs versionnés ; une lecture Google éventuelle cible exclusivement une copie de recette déclarée.

## 9. Rapprochement et modèle métier

Les jeux couvrent au minimum :

- homonymes ;
- accents, casse, espaces et traits d’union ;
- inversion nom/prénom ;
- dates de naissance invalides ou absentes ;
- coordonnées partagées ;
- mineurs et responsables légaux ;
- responsable commun à plusieurs enfants ;
- personne déjà connue sur une autre saison ;
- correspondance probable non confirmée ;
- ambiguïté non résolue.

Une correspondance `PROBABLE` ou `AMBIGU` ne déclenche jamais une fusion automatique. Les oracles vérifient l’absence de perte de données et la conservation de la décision administrative.

## 10. Identifiants, concurrence et idempotence

Les scénarios d’allocation utilisent plusieurs commandes concurrentes et couvrent les portées définies par `INSCRIPTIONS-005` :

- `LIC-000001` global ;
- `RSP-000001` global ;
- `INS-2026-000001` par année de début de saison ;
- `IMP-2026-000001` par année de début de saison, le type d’import appartenant à la portée de séquence.

Les tests démontrent :

- l’absence de doublon ;
- l’absence de calcul par maximum ou nombre de lignes ;
- la non-réutilisation d’un numéro consommé ;
- le refus d’une version concurrente ;
- le retour du résultat confirmé pour une relance identique ;
- le refus d’une même clé avec une empreinte différente ;
- la détection et la reprise explicite d’une commande interrompue.

La concurrence réelle Apps Script est testée dans une campagne dédiée et répétable ; elle ne rend pas la suite cumulative courante non déterministe.

## 11. Accès privés et audit

Les profils de test couvrent les capacités documentées dans `ACCESS-001` et `INSCRIPTIONS-004`, sans présumer qu’elles sont déjà implémentées.

Les scénarios vérifient :

- identité Google absente ;
- compte désactivé ou expiré ;
- capacité manquante ;
- module, saison, section ou cours hors périmètre ;
- URL directe et paramètres client falsifiés ;
- séparation lecture, analyse, contrôle, écriture, application et activation ;
- refus de retrait du dernier administrateur ;
- échec du support d’audit obligatoire ;
- minimisation des journaux et absence de donnée médicale.

Une écriture sensible réussie sans événement d’audit persistant conforme constitue un échec de recette.

## 12. Contrats externes

### 12.1 SIKADA

La fixture de référence devra être créée à partir d’un échantillon Windows-1252 anonymisé et sécurisé comportant les 12 en-têtes exacts observés. Elle devra couvrir les cellules tabulées, guillemets, enveloppes `="..."`, caractères accentués, lignes incomplètes, colonnes supplémentaires, formule hostile et contenu ne correspondant pas au format attendu.

Tant que cet échantillon n’est pas obtenu, anonymisé, sécurisé et versionné, la fixture n’existe pas et le contrat colonne par colonne reste un prérequis bloquant.

### 12.2 Questionnaire santé

Les tests n’utilisent que la référence `QS-AAAA-NNNNNN`, le résultat administratif autorisé, la date de contrôle et les éléments minimaux de rapprochement. Aucune réponse médicale détaillée ne figure dans les fixtures, oracles, journaux ou captures.

### 12.3 Analytics et Présences

Les tests prouvent que l’adaptateur transitoire :

- ne modifie que les feuilles `Licenciés` autorisées ;
- ne touche ni aux séances, ni aux présences, ni aux rapports historiques ;
- conserve l’identifiant AKS et le numéro FFKDA comme données distinctes ;
- accepte le numéro FFKDA réel au format `8 chiffres + 1 lettre` ;
- détecte une cible ou un schéma incompatible avant écriture.

## 13. Environnement de recette

La recette réelle exige :

- `INSCRIPTIONS_ENVIRONMENT=RECETTE` ;
- un classeur Inscriptions dédié ;
- des dossiers d’import, d’export et de sauvegarde dédiés ;
- des copies de recette des sources externes nécessaires ;
- des identifiants de ressources fournis par `CONFIG-001` ;
- un schéma, un fuseau et des partages attendus vérifiés côté serveur ;
- des comptes et données exclusivement fictifs.

Une discordance d’environnement, de propriétaire, de dossier, de partage, de schéma ou de fuseau provoque un refus avant toute écriture.

## 14. Remise à zéro et restauration

La recette possède une procédure reproductible qui :

1. vérifie l’environnement ;
2. archive les preuves de la campagne précédente ;
3. restaure une image initiale versionnée ;
4. contrôle les onglets, en-têtes, séquences et empreintes ;
5. charge les fixtures ;
6. exécute la campagne ;
7. compare l’état final aux oracles ;
8. restaure l’état initial ;
9. prouve que les ressources hors périmètre n’ont pas changé.

La remise à zéro ne doit jamais accepter un identifiant de production, une racine Drive trop large ou une ressource non marquée comme recette.

## 15. Preuves de recette

Chaque campagne conserve au minimum :

- version du code et des documents ;
- environnement, schéma et fuseau ;
- identifiants techniques minimisés des ressources de recette ;
- acteur et capacités testées ;
- liste des scénarios exécutés ;
- état initial et final par empreinte ;
- commandes, résultats et identifiants de corrélation ;
- événements d’audit attendus et observés ;
- anomalies, décisions et relances ;
- preuve de restauration ;
- confirmation des ressources restées inchangées.

Les captures d’écran complètent les preuves mais ne remplacent ni les oracles ni les contrôles automatisés.

## 16. Non-régression cumulative

La suite Inscriptions est intégrée à la suite cumulative AKS Platform dès le premier incrément applicatif. Par défaut, cette suite :

- n’accède à aucune ressource Google réelle ;
- reste déterministe et relançable ;
- couvre les contrats transverses affectés ;
- échoue sur toute régression d’un jeu d’or ;
- publie un bilan par couche et un total global.

Les recettes réelles Analytics, Présences, Calendar ou Inscriptions restent hors de cette exécution automatique. Leur déclenchement explicite et leur procès-verbal sont requis lorsqu’un incrément touche leurs intégrations.

## 17. Campagnes fonctionnelles minimales

Avant toute activation de production, les campagnes suivantes sont réussies :

1. analyse sans écriture des trois sources ;
2. contrôle et décision sur les quatre classes de rapprochement ;
3. application d’un lot nominal en recette ;
4. relance idempotente du même lot ;
5. reprise d’une interruption simulée ;
6. conflit concurrent et absence de perte silencieuse ;
7. parcours multi-profils et refus par URL directe ;
8. échec d’audit obligatoire ;
9. activation bornée vers copies Analytics et Présences ;
10. sauvegarde, migration, restauration et nouvelle exécution identique.

Chaque campagne fait l’objet d’un procès-verbal daté et reproductible.

## 18. Codes de validation

| Code | Signification |
|---|---|
| `INSCRIPTIONS_TEST_FIXTURE_INVALID` | Fixture absente, modifiée ou non conforme |
| `INSCRIPTIONS_TEST_ORACLE_MISMATCH` | Résultat différent de l’oracle |
| `INSCRIPTIONS_TEST_REAL_TARGET_FORBIDDEN` | Ressource réelle ou non identifiée comme recette |
| `INSCRIPTIONS_TEST_RESET_FAILED` | Remise à zéro non confirmée |
| `INSCRIPTIONS_TEST_RESTORE_FAILED` | Restauration ou contrôle après restauration en échec |
| `INSCRIPTIONS_TEST_PROOF_INCOMPLETE` | Preuve de campagne insuffisante |
| `INSCRIPTIONS_TEST_EXTERNAL_SIDE_EFFECT` | Ressource hors périmètre modifiée |
| `INSCRIPTIONS_TEST_CONCURRENCY_INCONCLUSIVE` | Campagne concurrente non déterminante |

Ces codes complètent les erreurs métier d’`INSCRIPTIONS-005` sans exposer de donnée nominative.

## 19. Prérequis bloquants

Avant toute application réelle d’un lot, les éléments suivants sont obligatoires :

- manifeste Apps Script aligné sur `Europe/Paris` ;
- ressources Google Forms de recette et règles de conversion des fuseaux validées ;
- support persistant d’audit fonctionnel opérationnel ;
- capacités Inscriptions et `ANALYTICS_READ` implémentées et testées ;
- fixture SIKADA anonymisée avec ses 12 en-têtes exacts ;
- `BODY_KARATE` ajouté aux catalogues, paramètres, contrôles d’accès et fournisseurs Analytics ;
- format textuel réel du numéro FFKDA pris en charge ;
- durées de conservation, archivage et purge validées ;
- pont vers les cinq classeurs Analytics validé sur copies de recette ;
- sauvegarde et restauration démontrées ;
- campagne multi-profils et récupération administrateur réussies.

Ces prérequis restent des écarts ouverts tant qu’une preuve contrôlable n’est pas jointe.

## 20. Autorisation des incréments applicatifs

La validation documentaire d’`INSCRIPTIONS-006` autorise uniquement le premier incrément applicatif chargé de matérialiser les fixtures et oracles versionnés, les tests sans écriture et le minimum de constantes, modèles purs, normalisations, adaptateurs et dépôts en mémoire nécessaire à leur exécution.

Cette validation documentaire ne constitue pas une preuve d’exécution. La réussite automatisée future des jeux sans écriture devra être enregistrée séparément avant d’autoriser un incrément dépassant ce périmètre initial.

Elle n’autorise pas :

- la création ou l’utilisation d’un référentiel de production ;
- l’application réelle d’un lot ;
- une migration de données réelles ;
- la synchronisation vers Analytics ou Présences réels ;
- la modification des accès ou partages réels ;
- un déploiement présenté comme opérationnel.

Chaque extension d’autorisation exige les preuves correspondant à son niveau de risque.

## 21. Critères d’acceptation

`INSCRIPTIONS-006` est validable lorsque :

- les six niveaux de validation sont séparés ;
- les fixtures et oracles sont fictifs, immuables, versionnés et vérifiables ;
- les seize jeux d’or minimaux sont définis ;
- la suite cumulative n’utilise aucune cible Google réelle par défaut ;
- les recettes Apps Script exigent un environnement explicite et isolé ;
- concurrence, idempotence, interruption et audit sont couverts ;
- les contrats Forms, SIKADA, Questionnaire santé, Analytics et Présences sont testables ;
- la remise à zéro et la restauration sont reproductibles ;
- les preuves avant/après et les ressources inchangées sont exigées ;
- les prérequis bloquants sont clairement distingués des éléments déjà disponibles ;
- l’autorisation documentaire du premier incrément reste bornée à la matérialisation et à l’exécution future des jeux sans écriture, sans présenter ces jeux comme déjà réussis ;
- aucun code, classeur, dossier, compte, accès ou déploiement réel n’est modifié.

## 22. Décisions structurantes

1. Les tests purs et les recettes Google réelles restent séparés.
2. Aucune cible réelle n’est implicite.
3. Les oracles ne sont pas dérivés automatiquement du résultat du code.
4. Les fonctions de recette réelle sont exclues de la suite cumulative par défaut.
5. Les données et comptes de recette sont exclusivement fictifs.
6. La concurrence réelle est orchestrée dans une campagne dédiée.
7. L’audit fonctionnel persistant fait partie du résultat attendu.
8. La restauration est une preuve obligatoire et non une simple procédure déclarée.
9. La validation documentaire autorise un premier incrément applicatif borné à la matérialisation et à l’exécution des jeux sans écriture ; leur réussite automatisée constituera une preuve ultérieure distincte.
10. Aucune application de lot réel n’est autorisée avant la levée de tous les prérequis bloquants.

## 23. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-02 | Création de la stratégie de validation cumulative, des seize jeux d’or, des protections de recette et des critères d’autorisation progressive |
