# ADMIN-006 — Administration multi-compte et accès aux supports privés

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-006 |
| **Titre** | Architecture d’exécution multi-compte pour les modules privés |
| **Version** | 0.3.0 |
| **Statut** | Cadrage détaillé du prototype terminé — implémentation non autorisée |
| **Nature** | Incident, cadrage fonctionnel, architecture et sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-28 |
| **Version observée** | AKS Platform V1.4.1 — Apps Script version 55 |
| **Priorité** | Bloquant transverse avant INSCRIPTIONS-011 et les futurs modules privés |

---

## 1. Objet

ADMIN-006 traite l’incompatibilité constatée entre l’administration multi-compte, le déploiement Apps Script exécuté sous l’identité de l’utilisateur et les supports Google privés nécessaires aux modules.

Le correctif ACCESS-002-07 rend l’habilitation `ADMINISTRATION` attribuable, mais l’activation de `CONFIG_READ`, `CONFIG_WRITE`, `CONFIG_RESET` et `LOG_READ` sur un compte secondaire révèle que les autorisations applicatives ne suffisent pas à garantir l’accès aux ressources Google utilisées par le code.

Ce chantier est un prérequis transverse. Développer de nouveaux modules privés sans résoudre ce contrat d’exécution reproduirait le même défaut sur leurs propres classeurs, fichiers ou calendriers.

## 2. Incident de production du 28 août 2026

Après publication de V1.4.1 en production :

- le HEAD a été poussé et relu à 261/261 fichiers sans différence ;
- la version Apps Script 55 a été créée ;
- le déploiement public `wgNc37` a été basculé de 54 vers 55 ;
- le portail, Analytics, Mes accès et le Questionnaire santé ont passé le contrôle fonctionnel ;
- l’habilitation « Configuration et journaux » a ensuite été attribuée à `aserridj@gmail.com` ;
- le compte secondaire a perdu l’accès utilisable à `?app=admin` ;
- le retrait de cette habilitation a restauré immédiatement l’accès au portail.

L’aller-retour d’habilitation constitue une mutation ACCESS réelle, suivie d’un retour fonctionnel à l’état antérieur. Aucun nouveau droit Administration ne doit être attribué avant résolution.

## 3. Diagnostic confirmé

### 3.1 Projection ACCESS

`AccessPortalProjectionService` expose :

- `Paramétrage` lorsqu’au moins une capacité `CONFIG_*` est effective ;
- `Journaux` lorsque `LOG_READ` est effectif.

L’attribution modifie donc non seulement l’affichage de la fiche utilisateur, mais aussi les services chargés par le portail.

### 3.2 Chargement anticipé des journaux

Lorsque la destination `admin.logs` est présente, `AdminDashboardController` tente de construire le modèle des cinq événements récents pendant le rendu du portail.

Le simple accès à `?app=admin` peut ainsi provoquer une lecture du support LOG avant que l’utilisateur ne choisisse explicitement « Journaux ».

### 3.3 Support LOG lié au classeur actif

`LogEventRepository` utilise `SpreadsheetApp.getActiveSpreadsheet()` et la feuille `AKS_Logs`.

Avec un déploiement `USER_ACCESSING`, la permission Google est évaluée avec l’identité du compte connecté. Un compte peut donc posséder `LOG_READ` dans ACCESS tout en étant refusé par Google Sheets.

### 3.4 Supports métier et AUDIT

Le contrôle sur l’URL sans paramètre a également montré qu’un compte sans permission directe sur le classeur Questionnaire santé ne peut pas exécuter le chemin public par défaut sous son identité.

Les écritures `CONFIG_WRITE` et `CONFIG_RESET` exigent en outre une preuve AUDIT persistante. Le support `AKS Audit PRODUCTION` est volontairement privé et limité à son propriétaire. La capacité applicative d’un compte secondaire ne démontre donc pas sa capacité Google à produire cette preuve.

## 4. Cause racine

Le modèle actuel confond deux niveaux d’autorisation indépendants :

1. l’autorisation fonctionnelle, portée par ACCESS ;
2. l’autorisation technique Google Drive, Sheets ou Calendar, portée par l’identité d’exécution Apps Script.

Le système ne possède pas encore de contrat garantissant qu’un utilisateur autorisé par ACCESS puisse appeler un module sans recevoir directement des permissions sur ses supports internes.

## 5. Pourquoi le contournement par partage est exclu

Le partage systématique des supports avec chaque administrateur n’est pas retenu comme solution par défaut :

- le classeur Questionnaire santé peut contenir des données sensibles ;
- le support AUDIT doit préserver son intégrité et son accès restreint ;
- les futurs modules multiplieraient les partages manuels ;
- le retrait d’un droit ACCESS ne retirerait pas automatiquement les permissions Drive ;
- ACCESS ne serait plus la source d’autorité effective ;
- les risques d’erreur, de dérive et de fuite augmenteraient avec chaque module.

Tout partage exceptionnel devra être explicite, minimisé, réversible et documenté. Il ne peut pas constituer l’architecture générale.

## 6. Invariants du correctif

Le futur correctif doit garantir simultanément :

- ACCESS reste la source d’autorisation fonctionnelle ;
- aucun module n’accorde implicitement un accès Drive direct ;
- un compte sans capacité reste refusé côté serveur ;
- un compte autorisé peut utiliser le module sans partager les supports métier sous-jacents ;
- l’identité fonctionnelle de l’acteur reste fiable et auditable ;
- les écritures critiques produisent une preuve AUDIT persistante ;
- le Questionnaire santé reste accessible selon son contrat public ;
- le support AUDIT reste privé ;
- les journaux ne bloquent jamais le portail global ;
- une panne d’un module est isolée et présentée sans détail sensible ;
- le retrait d’une habilitation prend effet sans nettoyage manuel de permissions Google ;
- RECETTE et PRODUCTION restent strictement séparées.

## 7. Options à instruire

### Option A — Exécution générale en tant que propriétaire

À évaluer, sans décision à ce stade.

Avantage : accès centralisé aux supports privés.

Risques : disponibilité de l’identité de l’utilisateur, changement de surface de sécurité, impact sur les routes publiques et tous les modules existants.

### Option B — Front-end utilisateur et backend privé séparés

À étudier prioritairement.

Le portail conserve l’identité et l’autorisation de l’utilisateur. Les opérations nécessitant un support privé sont confiées à un composant serveur dédié, exécuté sous une identité technique et protégé par un contrat signé, borné et audité.

Cette option limite l’exposition des supports, mais introduit un protocole interne à sécuriser et exploiter.

### Option C — Stockages dédiés partagés au cas par cas

Non retenue comme cible générale. Elle peut seulement servir de mesure temporaire sur un support non sensible après analyse et autorisation spécifique.

### Option D — Stockage sans dépendance Drive utilisateur

À étudier selon les volumes, la confidentialité, les quotas et la réversibilité. Aucune migration de données n’est autorisée dans le cadrage.

## 8. Décisions différées

Le cadrage ne décide pas encore :

- de modifier `executeAs` ;
- de créer un second déploiement ;
- de partager un classeur ;
- de migrer `AKS_Logs` ;
- de modifier le support AUDIT ;
- de créer une identité technique supplémentaire ;
- de changer les droits d’un compte ;
- de publier une V1.4.2.

Ces décisions exigent une comparaison documentée, une revue de sécurité et une autorisation distincte.

## 9. Recette obligatoire

La recette du correctif devra utiliser au minimum :

- un propriétaire des supports ;
- un administrateur secondaire autorisé dans ACCESS mais sans permission Drive directe ;
- un compte authentifié sans habilitation Administration ;
- un compte externe pour le Questionnaire santé public.

Scénarios minimaux :

1. portail sans Administration ;
2. portail avec `CONFIG_READ` seul ;
3. portail avec `LOG_READ` seul ;
4. lecture de Paramétrage ;
5. écriture et réinitialisation avec audit persistant ;
6. lecture des journaux ;
7. retrait immédiat des capacités ;
8. refus d’un compte non autorisé ;
9. indisponibilité simulée de chaque support sans chute du portail ;
10. non-régression Analytics, Mes accès, Comptes et accès et Questionnaire santé ;
11. vérification qu’aucun support n’a été partagé au compte secondaire ;
12. restauration exacte de RECETTE.

Les tests unitaires avec dépôts en mémoire ne suffisent pas. Une recette réelle des permissions Google est obligatoire.

## 10. Plan de travail proposé

1. inventaire des identités d’exécution et des supports par route ;
2. matrice ACCESS / identité Apps Script / permission Google ;
3. comparaison de sécurité des options A à D ;
4. décision d’architecture formelle ;
5. spécification du contrat d’appel privé ;
6. prototype isolé en RECETTE ;
7. tests multi-comptes réels ;
8. implémentation sur branche applicative dédiée ;
9. campagne cumulative et restauration exacte ;
10. publication corrective séparée ;
11. documentation et contrôle post-production.

## 10.1 Résultat d’ADMIN-006-01

L’inventaire détaillé est consigné dans [ADMIN-006-01](ADMIN-006-01.md).

Il confirme que les routes privées combinent des autorisations ACCESS avec des dépendances Google évaluées sous l’identité `USER_ACCESSING`. L’option « portail utilisateur + backend privé signé » est recommandée pour un prototype limité à la lecture LOG en RECETTE. Cette recommandation ne constitue pas encore une autorisation d’implémenter.

## 10.2 Résultat d’ADMIN-006-02

Le plan détaillé est consigné dans [ADMIN-006-02](ADMIN-006-02.md).

Il ferme le périmètre du premier prototype à `LOG_READ` en RECETTE et définit le protocole signé HMAC, la stratégie anti-rejeu, l’isolation des erreurs LOG, les tests multi-compte et le retour arrière. Aucun code, projet Apps Script, secret, support Google ou droit ACCESS n’a été modifié.

La prochaine étape proposée est exclusivement le lot A : contrats purs et tests unitaires dans le dépôt applicatif, après une nouvelle autorisation explicite.

## 11. Critères d’acceptation du cadrage

Le cadrage est prêt pour décision lorsque :

- chaque route et chaque support sont inventoriés ;
- l’identité effective de lecture et d’écriture est démontrée ;
- les écarts RECETTE / PRODUCTION sont expliqués ;
- les options sont comparées sur sécurité, coût, maintenabilité et réversibilité ;
- une option cible et un retour arrière sont proposés ;
- les scénarios multi-comptes réels sont définis ;
- aucune permission Drive supplémentaire n’est supposée implicitement.

## 12. État et restrictions

À la date du présent cadrage :

- V1.4.1 reste active en production sur la version Apps Script 55 ;
- le compte secondaire a retrouvé son accès après retrait de l’habilitation Administration ;
- l’activation de Configuration et Journaux sur un compte secondaire est déclarée KO ;
- aucune nouvelle attribution ne doit être réalisée ;
- aucune modification de production n’est autorisée par ce document ;
- INSCRIPTIONS-011 et les nouveaux modules privés restent suspendus sur ce prérequis transverse.

## 13. Références

- ACCESS-002 et ACCESS-002-07 ;
- ACCESS-002-PRODUCTION ;
- ADMIN-001 à ADMIN-005 ;
- CONFIG-001 ;
- LOG-001 ;
- AUDIT-001-PRODUCTION ;
- SECURITY-001 ;
- STORAGE-001 ;
- V1.4.1.

## 14. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.3.0 | 2026-08-28 | ADMIN-006-02 : protocole du prototype LOG_READ RECETTE, anti-rejeu, résilience, tests et retour arrière cadrés ; implémentation non autorisée |
| 0.2.0 | 2026-08-28 | ADMIN-006-01 : inventaire des routes et supports terminé, matrice multi-compte établie et option backend privé signé recommandée pour prototype, sans implémentation |
| 0.1.0 | 2026-08-28 | Création du cadrage après reproduction en production du blocage multi-compte, retrait réversible de l’habilitation et analyse en lecture seule du code V1.4.1 |
