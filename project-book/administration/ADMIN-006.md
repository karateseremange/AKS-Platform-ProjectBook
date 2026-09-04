# ADMIN-006 — Administration multi-compte et accès aux supports privés

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-006 |
| **Titre** | Architecture d’exécution multi-compte pour les modules privés |
| **Version** | 0.42.0 |
| **Statut** | D4-C — test technique restauré, campagne navigateur préparée |
| **Nature** | Incident, cadrage fonctionnel, architecture et sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-09-04 |
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

## 10.3 Résultat d’ADMIN-006-03

Le résultat du lot A est consigné dans [ADMIN-006-03](ADMIN-006-03.md).

La PR applicative #140, fusionnée dans `develop` au commit `ea38f0759ec4b26ce73e112738075f3b501799da`, implémente les contrats purs `AKS-PRIVATE/1`, sans backend, secret, stockage anti-rejeu ou ressource Google. Les 18 tests dédiés réussissent dans le harnais local. La suite cumulative réelle contient 683 cas et réussit à **683/683** dans Apps Script RECETTE. La candidate a été relue à 263 fichiers puis RECETTE restaurée exactement à 261 fichiers, sans création de version ni modification de déploiement.

## 10.4 Cadrage d’ADMIN-006-04

Le cadrage détaillé du lot B est consigné dans [ADMIN-006-04](ADMIN-006-04.md).

Il retient un backend RECETTE fermé à `LOG_READ_RECENT_V1`, réutilisant les contrats du lot A, avec registre anti-rejeu partagé fondé sur `ScriptProperties + ScriptLock`, consommation avant lecture LOG, adaptateurs injectés, réponses minimisées et refus fermé. Le document définit les sous-lots B1 à B3, les tests, le retour arrière et les précontrôles requis.

Aucune implémentation, ressource Google, propriété, URL, habilitation, version ou déploiement n’est autorisé par ce cadrage.

## 10.5 Résultat d’ADMIN-006-05

Le résultat d’implémentation du lot B est consigné dans [ADMIN-006-05](ADMIN-006-05.md).

La PR applicative #141, fusionnée dans `develop` au commit `c064f0f027e3e8d6e3087ba71930866588a95d05`, ajoute le backend inactif, les adaptateurs injectables et le registre anti-rejeu sans endpoint, secret ou raccordement Google. Les 18 tests dédiés réussissent localement. La suite cumulative réelle réussit à **701/701** dans Apps Script RECETTE ; la candidate a été relue à 267 fichiers puis RECETTE restaurée exactement à 261 fichiers.

Aucun raccordement réel n’est autorisé.

## 10.6 Cadrage d’ADMIN-006-06

Le cadrage détaillé du lot C est consigné dans [ADMIN-006-06](ADMIN-006-06.md).

Il définit le client portail privé, le contrôle serveur de `LOG_READ`, la construction signée côté serveur, un transport injecté et inactif, la validation des réponses, ainsi que l’isolation du widget Journaux. Paramétrage et Journaux restent deux destinations et deux autorisations indépendantes.

Aucune implémentation, URL, secret, opération Google ou déploiement n’est autorisé par ce cadrage.

## 10.7 Résultat d’ADMIN-006-07

Le résultat d’implémentation et de validation du lot C est consigné dans [ADMIN-006-07](ADMIN-006-07.md).

La PR applicative #142, tête `ae28c735f89bdb1b3981093b39e16142e6f73090`, fournit C1 à C3 avec un transport inactif. Les 15 tests dédiés et les 716 tests cumulatifs ont réussi en RECETTE, puis le HEAD initial de 261 fichiers a été restauré exactement. La PR a été fusionnée dans `develop` au commit `d8ca2840659cad6b467772f2563ac61a834d6ada`.

La fusion applicative, le raccordement backend, les secrets et toute opération Google restent soumis à des décisions distinctes.

## 10.8 Cadrage d’ADMIN-006-08

Le raccordement réel du backend privé RECETTE et la recette multi-compte `LOG_READ` sont cadrés dans [ADMIN-006-08](ADMIN-006-08.md).

Le lot D sépare l’inventaire en lecture seule, la préparation des ressources, l’installation du secret, le déploiement backend, le raccordement du portail, la recette multi-compte et la clôture. Chaque sous-lot exige une autorisation et un retour arrière distincts.

Aucune ressource Google, aucun secret, aucun partage, aucun déploiement et aucune habilitation ACCESS ne sont autorisés par ce cadrage.

## 10.9 Résultat d’ADMIN-006-09

L’inventaire D0 est consigné dans [ADMIN-006-09](ADMIN-006-09.md).

Le portail RECETTE est confirmé. Le POC et la configuration Services sont refusés comme backend. Les deux onglets LOG existants cohabitent avec des données métier sensibles et sont refusés pour le backend privé au titre du moindre privilège.

D1 devra créer des ressources RECETTE dédiées sous autorisation distincte, sans secret, partage, déploiement ou raccordement dans le même sous-lot.

## 10.10 Résultat d’ADMIN-006-10

La préparation D1 est consignée dans [ADMIN-006-10](ADMIN-006-10.md).

Le projet `AKS Private Backend RECETTE` a été créé puis rendu vide par suppression confirmée du fichier automatique `Code.gs`. Le classeur `AKS LOG RECETTE` contient uniquement l’onglet `AKS_Logs`, les seize colonnes contractuelles et aucune donnée. Les deux ressources appartiennent uniquement au propriétaire observé et ne sont pas partagées.

Aucun code, secret, déploiement, raccordement au portail, droit ACCESS ou élément de production n’a été créé ou modifié.

## 10.11 Résultat d’ADMIN-006-11

Le précontrôle D2 et son protocole sont consignés dans [ADMIN-006-11](ADMIN-006-11.md).

Drive et `clasp` n’exposent pas les propriétés d’exécution Apps Script. Leurs noms et empreintes ne peuvent donc pas être certifiés sans un inspecteur temporaire explicitement autorisé. Le protocole d’installation HMAC, la vérification croisée et le retour arrière sont définis, mais aucun secret n’a été créé ou installé.

L’inspection réversible a ensuite été exécutée et est consignée dans [ADMIN-006-12](ADMIN-006-12.md).

## 10.12 Résultat D2-A et cadrage D2-B

Le résultat de D2-A et le plan fermé de D2-B sont consignés dans [ADMIN-006-12](ADMIN-006-12.md).

Le portail RECETTE contient six propriétés ACCESS/AUDIT historiques et aucune clé `AKS_PRIVATE_`. Le backend privé contient zéro propriété. Après retrait manuel des inspecteurs temporaires, les deux HEAD ont été relus et restaurés exactement : 261 fichiers portail, un manifeste backend, zéro différence.

D2-B est limité à `AKS_PRIVATE_HMAC_CURRENT` et `AKS_PRIVATE_SECRET_VERSION`, installés d’abord sur le backend puis sur le portail avec transport désactivé. `AKS_PRIVATE_HMAC_PREVIOUS` doit rester absente. Aucun autre paramètre, endpoint, version, déploiement, partage ou droit ACCESS n’est inclus.

D2-B a ensuite été exécuté et validé. Le secret n’a jamais été affiché ni conservé dans les rapports.

## 10.13 Résultat D2-B

Le résultat D2-B est consigné dans [ADMIN-006-12](ADMIN-006-12.md).

Le portail et le backend portent le même secret courant par empreinte et la même version non secrète `RECETTE-20260830-192805`. Le backend contient exactement deux propriétés ; le portail huit, dont les six propriétés ACCESS/AUDIT antérieures inchangées. `AKS_PRIVATE_HMAC_PREVIOUS` est absente.

Les inspecteurs temporaires ont été supprimés et les deux HEAD ont été restaurés exactement. Le transport reste désactivé. Aucun endpoint, version, déploiement, partage ou droit ACCESS n’a été créé ou modifié.

D3 reste soumis à une autorisation séparée et ne doit pas raccorder le portail.

## 10.14 Résultat du précontrôle D3

Le précontrôle détaillé D3 est consigné dans [ADMIN-006-13](ADMIN-006-13.md).

Le code intégré dans `develop` fournit les contrats `AKS-PRIVATE/1`, la commande fermée `LOG_READ_RECENT_V1`, le backend injecté, le registre anti-rejeu et le client portail inactif. Il manque encore les éléments indispensables à un backend Apps Script autonome : `doPost`, configuration réelle par propriétés, accès explicite au support LOG dédié, preuve persistante et package backend avec manifeste propre.

L'identité d'exécution, l'audience Web App et le support de preuve doivent être décidés explicitement. Aucun code applicatif, projet Apps Script, support Google, propriété, secret, version, déploiement, partage ou droit ACCESS n'a été modifié pendant ce précontrôle.

La prochaine étape est D3-A sur branche applicative dédiée, avec backend inactif et tests complets. Les opérations Google et le raccordement du portail restent exclus et soumis à des autorisations ultérieures distinctes.

## 10.15 Résultat D3-A

Le résultat détaillé est consigné dans [ADMIN-006-13](ADMIN-006-13.md).

La PR applicative #143 a ajouté le runtime backend fermé, les adaptateurs Apps Script contrôlés, le lecteur LOG dédié, l’écrivain de preuve relu, le point d’entrée backend séparé et le constructeur de package à liste blanche. Les 13 tests dédiés réussissent localement.

La tête `e2d21b492167a2a0571035dcff66230819a0d7c1` a été validée à **729/729** dans Apps Script RECETTE. La candidate de 271 fichiers a été relue, puis le HEAD initial de 261 fichiers restauré exactement. L’archive de sauvegarde porte l’empreinte `26BB92891E32FA839C55ED2E360835188A74CE94C0C2B6AA80C7955660A4D2F3`.

La PR a été fusionnée dans `develop` au commit `bc8b3be19c3860079db0228769d8cb1d80f302dc`. Aucun backend, support Google, secret, propriété, version, déploiement, partage ou droit ACCESS n’a été modifié. D3-B reste requis avant tout push backend.

## 10.16 Résultat D3-B

Le résultat D3-B est consigné dans [ADMIN-006-13](ADMIN-006-13.md).

Le support `AKS PRIVATE PROOFS RECETTE` a été créé sans partage, avec un onglet vide et les dix colonnes contractuelles. Le backend privé RECETTE contient exactement onze propriétés : les deux propriétés secrètes D2-B inchangées et les neuf propriétés non secrètes D3-B. `AKS_PRIVATE_ENABLED` reste exactement à `false` et `AKS_PRIVATE_HMAC_PREVIOUS` reste absente.

L’installateur temporaire a dû être supprimé manuellement, car `clasp push --force` n’a pas retiré le fichier distant supplémentaire. La relecture finale confirme un manifeste unique identique à la sauvegarde et aucun installateur résiduel.

Aucune valeur secrète, version, déploiement, audience, partage, habilitation ACCESS, ressource de production ou opération INSCRIPTIONS-011 n’a été créé ou modifié. D3-C peut désormais être autorisé séparément pour une validation réversible du package backend, sans version ni déploiement.

## 10.17 Résultat D3-C

Le résultat D3-C est consigné dans [ADMIN-006-13](ADMIN-006-13.md).

Le package backend de sept fichiers, construit depuis `develop@bc8b3be19c3860079db0228769d8cb1d80f302dc`, a été poussé temporairement puis relu sans aucune différence. Le fonctionnement fermé a été confirmé avec `AKS_PRIVATE_ENABLED=false`, onze propriétés inchangées, secret inchangé et clé précédente absente.

Après suppression visible des fichiers temporaires, le backend a été relu et correspond exactement à son manifeste initial. L’archive de sauvegarde porte l’empreinte `0F94658D368B1EF3824D34A9577513CCD00255DFF20EA095C4DFD2218D7ED5C0`. Les inventaires de versions et de déploiements sont inchangés.

D3-D reste soumis à une autorisation distincte. Le portail demeure non raccordé et aucun élément de production ou INSCRIPTIONS-011 n’a été engagé.

## 10.18 Cadrage D3-D

Le cadrage du premier déploiement backend est consigné dans [ADMIN-006-14](ADMIN-006-14.md).

La cible RECETTE retenue est une Web App exécutée sous l’identité du déployeur (`USER_DEPLOYING`) et accessible sans authentification Google (`ANYONE_ANONYMOUS`) afin de permettre l’appel serveur à serveur du portail. Cette audience n’est admissible qu’avec le protocole signé, l’anti-rejeu, la commande unique, les réponses minimisées et le refus fermé déjà implémentés.

D3-D est séparé en quatre sous-lots : modification applicative revue du manifeste, validation réversible, publication inactive, puis preuve signée contrôlée. La prochaine étape est exclusivement D3-D1 sur branche applicative. Aucune opération Google n’est autorisée par ce cadrage.

## 10.19 Résultat D3-D4 et plan D4

Le résultat technique D3-D4 est consigné dans [ADMIN-006-14](ADMIN-006-14.md), §14 : preuve signée et refus anti-rejeu conformes, code et propriétés restaurés, backend publié mais inactif. Cette preuve éditeur ne constitue pas une recette navigateur multi-compte.

Le précontrôle du code applicatif `064ca709a754915a87451e829c24088ec878fdde` confirme que le client portail reste inerte et que la route Journaux conserve le dépôt Google direct. Le [plan D4 dans ADMIN-006-08](ADMIN-006-08.md), §20, propose un runtime RECETTE gardé, un chargement asynchrone, une vue minimisée sans pagination, les tests et un retour arrière préservant D2/D3.

À ce précontrôle, D4-A restait à autoriser après revue documentaire ; l'autorisation ultérieure et le résultat sont consignés au §10.20. Aucun raccordement, activation, modification Google ou attribution ACCESS n'a été effectué par ce précontrôle ; D5 et INSCRIPTIONS-011 restent non engagés.

## 10.20 Résultat D4-A applicatif

Après intégration du plan documentaire #224, le Product Owner a autorisé D4-A : implémentation inactive, tests locaux et PR vers `develop`. Le résultat détaillé et les rapports sont consignés dans [ADMIN-006-08](ADMIN-006-08.md), §21.

La [PR applicative #145](https://github.com/karateseremange/AKS-Platform/pull/145) propose la candidate `688c81bb64e6aa09f9955743b783fca989369ae2`, depuis `064ca709a754915a87451e829c24088ec878fdde`. Elle apporte le runtime RECETTE gardé, l'autorisation LOG_READ effective avec refus du bootstrap, la RPC asynchrone, le widget et la page Journaux minimisés. La fenêtre des 500 dernières lignes est explicitée, y compris à vide ; le backend et les manifestes sont inchangés.

Validation hors ligne : **761/761 tests cumulatifs uniques**, dont **32 D4-A**, et **8/8 tests du client avec DOM simulé** ; base 729/729 avec le même harnais. Le diff a été vérifié et les 14 fichiers applicatifs relus à l'identique sur GitHub. Ces résultats Node ne sont ni une validation Apps Script, ni une recette navigateur multi-compte.

La PR est ouverte, non fusionnée. Aucune opération Google, activation, publication ou attribution ACCESS n'a été effectuée. Revue conjointe du code et du compte rendu, puis préparation de D4-B réversible ; son exécution et les fusions nécessitent des autorisations distinctes. D4-C, D5 et la résolution d'ADMIN-006 restent à démontrer ; INSCRIPTIONS-011 reste non engagé.

## 10.21 Revue D4-A et préparation D4-B

La revue conjointe de la candidate applicative #145 `688c81bb64e6aa09f9955743b783fca989369ae2` et du compte rendu #225 n'a identifié aucun défaut bloquant statique ou local. La simulation du projet RECETTE et le chargement complémentaire des six `.js` serveur conservent chacun 761/761 tests réussis. Les limites Apps Script et navigateur restent ouvertes.

Le protocole détaillé relève d'[ADMIN-006-08](ADMIN-006-08.md), §22 : package complet de 277 fichiers avec manifeste initial RECETTE conservé exactement, B0 en lecture seule pour sauvegarder et expliquer le diff réel, puis B1 distinctement autorisé pour push temporaire, relecture, suite Apps Script et restauration contrôlée. Le nombre de fichiers réellement présent sur Google reste à observer.

Les deux PR restent ouvertes sans fusion ; seul le Project Book est complété. Aucun précontrôle ni test Google n'a été exécuté. Prochaine étape : préparer l'outillage B0 compatible PowerShell 5.1 ; son exécution en lecture seule sera soumise à autorisation, puis le résultat concret permettra de décider B1.

## 10.22 Préparation B0 et contrôle local Windows, avant collecte Google

[ADMIN-006-08](ADMIN-006-08.md), §23, référence le lanceur PowerShell 5.1, le moteur Node B0-r2 et leurs 14 tests synthétiques réussis. Les versions Windows transmises sont compatibles ; clasp 3.3.0 est accepté après revue de son interface, sans mise à jour du poste. Le rapport consigne sa version effective. L'extraction réelle des objets Git retrouve les 277 fichiers et leur empreinte attendue. Le code applicatif reste à la tête #145 déjà revue.

Le contrôle local Windows est désormais rapporté conforme : 14/14 tests et statut `LOCAL_CHECK_ONLY`, dans le run `2026-09-01T13-37-35-830Z-57aefd` ; le bloc vérifie les empreintes et la syntaxe PowerShell avant le lanceur. La preuve et ses limites figurent dans ADMIN-006-08 §23.4. Le mode local n'appelle pas Google. Le mode de lecture Google exige une autorisation distincte et conserve un statut à revoir : propriétés et coupe-circuits restent à vérifier par l'opérateur, et le diff complet doit être expliqué avant B1. Les outils ne savent ni pousser, ni exécuter une fonction Apps Script, ni modifier une propriété ou un déploiement. Aucune fusion ni opération Google n'a été réalisée.

## 10.23 B0 conforme et préparation B1

Le précontrôle B0 a été autorisé puis exécuté en lecture seule par l'opérateur. Sa conformité est validée après revue du rapport, des 204 écarts SHA (178 fins de ligne, six correctifs V1.4.1, quatre raccordements ADMIN-006 et 16 ajouts), et confirmation du portail désactivé, de l'URL temporaire absente et du backend désactivé. Aucun écart inexpliqué, aucune suppression, aucune écriture Google B0. Les empreintes et limites de preuve font autorité dans [ADMIN-006-08](ADMIN-006-08.md), §24 ; les archives restent locales.

Le Product Owner autorise ensuite la préparation de l'outillage B1-r1, décrite au §25 du même document : défaut local seul, autorisation liée au package, relectures exactes, test manuel dans l'éditeur et restauration en `finally` avec reprise indépendante. Les 39 tests B1 et 14 tests B0 réussissent hors Google. Le contrôle Windows sur les archives réelles reste à réaliser. B1, les fusions, l'activation, le parcours navigateur et tout changement de production restent non autorisés ; la candidate applicative #145 est inchangée.

## 10.24 B1 autorisé après contrôle Windows

Le contrôle local Windows est rapporté conforme : 39/39 tests et `B1_LOCAL_CHECK_ONLY`, sans écriture Google. Le Product Owner autorise distinctement le push temporaire du portail RECETTE, la relecture, la seule suite `AKS_runValidationSuiteV11` puis la restauration exacte, y compris sa reprise après interruption. Le périmètre figé, les exclusions et les preuves attendues font autorité dans [ADMIN-006-08](ADMIN-006-08.md), §25.4. Les outils sont inchangés depuis `b7bcf1cc948e59fdbdc269c340f450259eef7a9f`. Aucun résultat Google B1 n'est encore rapporté ; aucune activation, propriété, opération backend/production ou fusion n'est autorisée.

## 10.25 Échec B1 restauré et correction des tests

La campagne `b1-2YMQP2` a échoué sur deux tests D4-A ; le rapport indique `TEST_NOT_PASSED`, `restoredExact: true` et `propertiesOperatorConfirmed: true`. Le diagnostic local reproduit exactement ces deux erreurs lorsque l'URL Web App est vide ou nulle. B1 n'est pas conforme, mais la restauration est rapportée réussie ; aucune relance n'est demandée.

La correction ciblée autorisée dans #145 ne change que la fixture de tests, le harnais et une preuve locale. La nouvelle candidate `c39cded9f8d17493780a03cc66e408158ebb5d2d` passe six scénarios URL/projet à 761/761, plus les 8 tests DOM. Le code fonctionnel et Google ne sont pas modifiés par cette correction. Le résultat, l'explication, les limites et les nouvelles étapes de préparation font autorité dans [ADMIN-006-08](ADMIN-006-08.md), §26. Un nouveau package et une nouvelle autorisation B1 sont requis ; les outils et preuves initiaux restent conservés, sans fusion.

## 10.26 Reconstruction locale C2 préparée

La préparation locale du nouveau package est livrée pour `c39cded9f8d17493780a03cc66e408158ebb5d2d` : extraction Git exacte, conservation du manifeste sauvegardé et vérification des preuves locales de restauration B1. Le flux ne contacte pas Google et n'autorise aucun B1. Les 17 tests dédiés passent, ainsi que les 53 tests des outils initiaux. [ADMIN-006-08](ADMIN-006-08.md), §27, définit les entrées, empreintes d'outillage et résultats attendus. Le contrôle Windows avec les archives réelles reste à effectuer ; les empreintes du package adapté ne sont pas encore rapportées. Les anciens outils/preuves restent intacts, sans nouvelle opération Google ni fusion.

## 10.27 C2 reconstruit et précontrôle lecture seule autorisé

L'opérateur rapporte 17/17 tests et une reconstruction locale C2 conforme, avec un seul fichier de tests différent du précédent package, manifeste inchangé et aucune opération Google. Les empreintes et le résultat font autorité dans [ADMIN-006-08](ADMIN-006-08.md), §27.4.

Le contrôle Windows des trois nouveaux outils est rapporté conforme : 20/20 tests, `C2_READONLY_LOCAL_CHECK_ONLY`, aucune lecture/écriture Google et aucune autorisation B1. Le précontrôle distant en lecture seule déjà autorisé peut maintenant être exécuté. Le §28 définit les deux lectures, le refus indépendant des écritures et la revue manuelle actuelle des propriétés. Aucun nouveau B1, backend/production, activation ou fusion n'est autorisé.

## 10.28 Précontrôle C2 conforme et B1-C2 préparé

Les deux lectures distantes sont rapportées exactes, avec les mêmes empreintes que la sauvegarde B0 et des inventaires inchangés. Les deux propriétés privées du portail sont confirmées absentes ; le backend reste à false. Le précontrôle C2 est conforme après revue, sans écriture Google. Les preuves et la séparation entre rapport machine et confirmation humaine figurent dans [ADMIN-006-08](ADMIN-006-08.md), §28.4.

La préparation B1-C2 seule est autorisée et livrée : 25/25 tests dédiés, 84/84 avec les dépendances réutilisées, aucune opération Google. Le §29 définit les liaisons au package C2 et à la session de lecture, le cycle de restauration et les empreintes des six fichiers. Prochaine étape : contrôle Windows LocalCheck avec les archives réelles. Aucune nouvelle exécution B1 ni fusion n'est autorisée.

## 10.29 B1-C2 autorisé après contrôle Windows

Le contrôle Windows est rapporté conforme : 25/25 tests, `B1_C2_LOCAL_CHECK_ONLY`, preuves C2 relues localement et aucune opération Google. Le Product Owner autorise distinctement le push temporaire de la candidate C2 sur le seul portail RECETTE, sa relecture, la suite manuelle `AKS_runValidationSuiteV11` puis la restauration exacte, y compris après échec ou interruption. Le périmètre figé et les exclusions font autorité dans [ADMIN-006-08](ADMIN-006-08.md), §29.4. Les outils ne changent pas. Résultats Google encore attendus ; aucune activation, propriété, opération backend/production ou fusion n'est autorisée.

## 10.30 D4-B conforme après B1-C2

La suite Apps Script est rapportée à 761/761, zéro échec. Le rapport de session `b1-c2-vglRNl` indique `testPassed: true`, `restoredExact: true` et `propertiesOperatorConfirmed: true`. D4-B est conforme sur la base des preuves opérateur revues ; [ADMIN-006-08](ADMIN-006-08.md), §30, fait autorité sur le résultat et ses limites. Aucune relance de test ou restauration n'est requise.

Le HEAD du portail est revenu à la sauvegarde, les propriétés restent fermées et les PR ne sont pas fusionnées. Prochaine étape : revue finale de #145/#225 avant décisions séparées de fusion, puis cadrage D4-C. Navigateur et multi-compte D5 restent à démontrer ; ADMIN-006 demeure ouvert et INSCRIPTIONS-011 non engagé.

## 10.31 Revue finale terminée avant décisions de fusion

La revue en lecture seule des PR #145 et #225 n'identifie pas de défaut fonctionnel bloquant dans son périmètre. Les six scénarios locaux à 761/761, les huit tests DOM et les 115 tests d'outillage passent ; l'empreinte source correspond à la candidate testée. Le seul écart documentaire relevé, la description de #145 encore antérieure au succès B1-C2, est corrigé sous autorisation distincte. Le compte rendu fait autorité dans [ADMIN-006-08](ADMIN-006-08.md), §30.3.

Aucun code ou outil n'est modifié. Les fusions restent à autoriser séparément, avec recontrôle des têtes ; D4-C, D5, activation et production ne sont pas engagés.

## 10.32 D4-A intégré dans develop

La PR applicative #145 est fusionnée sous autorisation distincte au commit `f600560edb941bbfb63c7d75e881d7d5de836bd0`. Sa tête `c39cded9f8d17493780a03cc66e408158ebb5d2d` a été recontrôlée et imposée à la fusion ; l'arbre obtenu est identique à celui de la candidate testée. [ADMIN-006-08](ADMIN-006-08.md), §30.4, conserve les références et limites.

Aucune opération Google n'accompagne cette intégration Git. La PR documentaire #225 reste ouverte, sans autorisation de fusion ; la présente mise à jour consigne seulement la fusion applicative. D4-C, D5, activation, production et INSCRIPTIONS-011 restent non engagés.

## 10.33 Fusion documentaire et préparation D4-C

La PR #225 est fusionnée sous autorisation distincte dans develop au commit `fdddfa281e1fb280404db721d5fc17c2b99670fc`, sans opération Google. Le cadrage D4-C a ensuite été lu et la préparation locale autorisée, sans collecte distante ni activation.

[ADMIN-006-08](ADMIN-006-08.md), §31, définit les étapes C0 à C4, l'inventaire futur des deux projets RECETTE, les décisions de déploiement/compte et le retour arrière. C0 vérifie les preuves B1-C2 locales et produit un plan non exécutable ; 16/16 tests dédiés passent, 131/131 avec l'outillage existant. Contrôle PowerShell/archives réelles requis sur le poste. La vérification des propriétés secrètes ne peut pas être déduite de clasp ou des anciennes empreintes ; aucun inspecteur n'est installé.

La nouvelle PR documentaire reste à revoir, sans fusion. Collecte Google, raccordement navigateur, activation et D5 restent à autoriser séparément. Aucune habilitation ACCESS ni ressource de production n'est modifiée.

## 10.34 Résultat C0 et préparation du collecteur C1

C0 est conforme sur le rapport opérateur du 2026-09-02 : 16/16 tests, chaîne B1-C2 vérifiée localement, aucun appel Google. [ADMIN-006-08](ADMIN-006-08.md), §31.7–31.8, consigne la campagne et les empreintes, puis le collecteur C1 préparé sous autorisation distincte : 23/23 tests simulés, 154/154 cumulés. Contrôle Windows local requis avant toute demande de lecture Google.

Le collecteur futur sera limité aux snapshots et inventaires des deux projets RECETTE ; ni propriétés, secrets, droits ni déploiement navigateur ne sont validés par ces lectures. Le backend restera à rapprocher des preuves D3 protégées. Aucune exécution Google, activation, attribution ACCESS, production ou fusion de #226 n'est autorisée à ce stade.

## 10.35 Collecte C1 et essai gestionnaire restauré

[ADMIN-006-08](ADMIN-006-08.md), §31.9–31.12, consigne la collecte C1 autorisée (23/23 sur le poste, deux lectures identiques par projet), les contrôles opérateur des flags et déploiements, puis l'essai ACCESS/AUDIT distinctement autorisé. Le registre RECETTE était absent : le bootstrap, et non une habilitation attribuée, expliquait les accès historiques. Les procédures existantes ont été réutilisées, sans nouveau mécanisme ni nouvelle version.

Le gestionnaire configuré a reçu temporairement ACCESS_MANAGE ; les captures confirment son menu et un compte actif avec une habilitation effective. Les fonctions ont ensuite rapporté la restauration exacte du registre absent et de la configuration AUDIT, avec suppression des sauvegardes temporaires ; les preuves AUDIT sont conservées. Ces constats reposent sur les rapports et captures opérateur, pas sur une nouvelle lecture indépendante de Google.

Le parcours privé LOG_READ, la revue C1 restante et D5 ne sont pas validés. Aucun compte de test habilité LOG_READ ne subsiste ; la préparation ultérieure distinctement autorisée est décrite au §10.36, sans exécution Google. #226 reste ouverte, sans fusion ; cette consignation historique v0.37.0 n'a modifié ni code, outil, Google ni production.

## 10.36 Préparation réversible LOG_READ en PR

La [PR applicative #146](https://github.com/karateseremange/AKS-Platform/pull/146), candidate `1645734f3b81219bfd80569da21edc5d054ff223`, prépare une variante de la recette ACCESS/AUDIT existante. Son contrat, ses trois fonctions, les prérequis et les limites de récupération figurent dans [ADMIN-006-08](ADMIN-006-08.md), §31.13.

L'amorçage est limité au registre RECETTE absent et accorde au gestionnaire configuré ACCESS_MANAGE + LOG_READ, sans CONFIG. Il ne constitue pas le scénario D5 LOG_READ seul. Vingt tests supplémentaires sont intégrés : 781/781 dans six scénarios locaux, 8/8 client. Le diff reste limité aux recettes/tests ; services métier et backend inchangés.

L'autorisation couvre cette préparation et la documentation, pas l'installation ou l'exécution Google, les activations, les publications ou la fusion. Le package historique D4-B reste intact ; nouvelle candidate, nouveau package et précontrôles distincts requis. Les preuves antérieures et les validations D3-D4 ne sont pas remises en cause ; D4-C navigateur et D5 restent ouverts.

---

## 10.37 Contrôle Windows LOG_READ et revue locale conformes

[ADMIN-006-08](ADMIN-006-08.md), §31.14, consigne les preuves opérateur de la candidate #146 : commit exact, worktree propre en HEAD détachée, 781/781 dans six scénarios et 8/8 client sous Node Windows v24.18.0. L'écart de SHA-256 provenait des fins de ligne CRLF ; la normalisation en mémoire retrouve l'empreinte LF de référence, sans modifier les fichiers.

La revue des deux PR n'a identifié aucun défaut bloquant dans le périmètre local ; les limites et la récupération sur incident restent celles du §31.13. Aucune fusion ni opération Google. La préparation locale du nouveau package et du protocole a ensuite été autorisée (§10.38) ; le contrôle local ne valide pas D4-C navigateur ni D5.

---

## 10.38 Outillage de reconstruction LOG_READ et protocole préparés

[ADMIN-006-08](ADMIN-006-08.md), §31.15, détaille le nouveau lanceur local, ses dépendances existantes et le protocole de test/restauration non exécutable. Les objets Git figés fournissent la source LF ; les deux snapshots C1 protégés fournissent le manifeste et la référence historique, sans nouvelle lecture Google. Vingt tests locaux de l'outillage passent.

La reconstruction effective doit être exécutée sur le poste opérateur ; son rapport et ses nouvelles empreintes restent attendus. Aucun package réel issu de ces archives n'est présumé disponible. L'autorisation ne couvre ni les contrôles Google, ni l'exécuteur de test réversible, ni l'installation, l'habilitation, l'activation, la publication ou la fusion. Les validations antérieures restent historiques et D4-C navigateur/D5 non validés.

---

## 10.39 Package LOG_READ reconstruit et précontrôle lié préparé

Le rapport opérateur du 3 septembre confirme la reconstruction locale : 20/20 tests, 279 fichiers, package `cd635f54e1c8c6cc5d7a43053a4a1bd37c866d728abb3a89dd04c0e91620689b`, manifeste historique exact et delta borné. [ADMIN-006-08](ADMIN-006-08.md), §31.16, conserve les empreintes et les limites de cette preuve déclarée.

Un nouveau précontrôle lié à ce package est préparé, avec 48/48 tests hors ligne. Son mode LocalCheck vérifie les preuves locales sans Google. Le mode ReadOnly exige une autorisation séparée et compare deux lectures de chaque cible aux références C1 historiques ; il ne valide ni propriétés/secrets/permissions ni la référence backend D3 complète. Aucun appel Google effectué, aucune modification applicative ou des helpers historiques. Contrôle local Windows encore attendu ; D4-C navigateur et D5 non validés.

---

## 10.40 Clôture C1 et préparation de l'exécuteur LOG_READ

[ADMIN-006-08](ADMIN-006-08.md), §31.17, consigne les deux lectures indépendantes des deux projets, les propriétés et secrets vérifiés sans divulgation, les propriétaires/partages, supports, scopes, déploiements et comptes de recette. C1 est clôturé sur cette chaîne de preuves ; le rapprochement backend conserve sa limite opérateur vis-à-vis de l'archive D3 protégée.

Le nouvel exécuteur est lié au package LOG_READ et à la session C1. Ses 68/68 tests hors ligne valident installation simulée, relecture, suite attendue à 781/781, restauration systématique, récupération séparée et refus des changements concurrents. Aucun appel Google, changement applicatif, exécution, activation ou fusion. L'exécution technique, puis ACCESS/AUDIT et la recette navigateur exigent des autorisations séparées ; D4-C navigateur et D5 restent non validés.

---

## 10.41 Test technique restauré et campagne navigateur préparée

Le test technique lié au package LOG_READ a été rapporté réussi dans la session protégée `logread-executor-WunNuE`, avec restauration exacte du code et propriétés privées revenues à l'état fermé : cinq propriétés portail absentes et backend à `false`. [ADMIN-006-08](ADMIN-006-08.md), §31.18, conserve les références et limites de cette preuve opérateur.

La campagne navigateur réversible est préparée sans exécution : 84/84 tests hors ligne, dont 16 nouveaux. Elle séquence AUDIT, ACCESS `ACCESS_MANAGE + LOG_READ`, activation privée, consentement et contrôles des deux profils, puis fermeture privée, restauration ACCESS, déconnexion AUDIT et restauration finale du code. Les intentions sont persistées avant les mutations manuelles afin de guider une reprise. Aucune nouvelle opération Google, activation, publication ou fusion n'est autorisée ; un contrôle Windows puis une autorisation distincte restent requis. D5 « LOG_READ seul » n'est pas couvert.

---

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

Dernier état de production rapporté, sans nouvelle interrogation de production lors du cadrage D4 :

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
| 0.42.0 | 2026-09-04 | Test technique LOG_READ réussi et restauré exactement ; campagne navigateur réversible préparée et 84 tests hors ligne, sans nouvelle opération Google ni fusion |
| 0.41.0 | 2026-09-04 | C1 LOG_READ clôturé ; exécuteur réversible lié préparé et 68 tests hors ligne, sans exécution Google ni fusion |
| 0.40.0 | 2026-09-03 | Package LOG_READ reconstruit sur Windows ; précontrôle lié préparé, 48 tests hors ligne, contrôle local opérateur attendu, sans Google ni fusion |
| 0.39.0 | 2026-09-03 | Outillage de reconstruction locale LOG_READ et protocole préparés, 20 tests ; contrôle Windows et rapport réel attendus, sans Google ni fusion |
| 0.38.1 | 2026-09-03 | Contrôle Windows LOG_READ conforme et revue locale des PR consignés ; écart CRLF/LF expliqué, aucune fusion ni opération Google |
| 0.38.0 | 2026-09-03 | Recette LOG_READ préparée en PR #146, réutilisation ACCESS/AUDIT, 781/781 local dans six scénarios et 8/8 client ; installation/exécution Google et fusion non autorisées |
| 0.37.0 | 2026-09-03 | Collecte C1, contrôles manuels et essai gestionnaire ACCESS/AUDIT consignés ; restaurations exactes rapportées, preuves conservées, parcours privé LOG_READ et D5 à valider |
| 0.36.0 | 2026-09-02 | C0 conforme sur preuve opérateur ; collecteur C1 préparé, 23/23 tests simulés et contrôle Windows requis avant autorisation Google lecture seule |
| 0.35.0 | 2026-09-02 | Fusion #225 à fdddfa28 consignée ; protocole D4-C et C0 local préparés, 16/16 tests dédiés, contrôle Windows requis sans appel Google |
| 0.34.0 | 2026-09-02 | PR applicative #145 fusionnée dans develop à f600560e ; #225 toujours ouverte, consignation sans opération Google |
| 0.33.1 | 2026-09-02 | Revue finale terminée et description #145 actualisée ; aucun défaut fonctionnel bloquant identifié, décisions de fusion séparées encore requises |
| 0.33.0 | 2026-09-02 | D4-B conforme sur preuves opérateur : 761/761, restauration exacte et propriétés confirmées ; revue avant fusion et cadrage D4-C encore requis |
| 0.32.1 | 2026-09-02 | Contrôle Windows B1-C2 rapporté conforme à 25/25 ; test RECETTE réversible et restauration autorisés distinctement, résultats attendus |
| 0.32.0 | 2026-09-02 | Précontrôle C2 conforme et propriétés confirmées ; préparation B1-C2 autorisée et testée à 25/25, contrôle Windows requis sans autorisation de push |
| 0.31.1 | 2026-09-02 | Contrôle Windows C2-readonly-r1 rapporté conforme à 20/20, sans Google ; précontrôle distant lecture seule à exécuter, nouveau B1 non autorisé |
| 0.31.0 | 2026-09-01 | Reconstruction C2 conforme selon le retour opérateur ; précontrôle lecture seule autorisé et préparé, 20 tests Windows requis avant lecture Google, nouveau B1 non autorisé |
| 0.30.0 | 2026-09-01 | Reconstruction locale C2 préparée et testée sans Google ; contrôle opérateur et nouvelles empreintes attendus avant revalidation distante et nouvelle autorisation B1 |
| 0.29.0 | 2026-09-01 | B1 en échec sur deux tests, restauration exacte rapportée ; correction ciblée des tests/harnais publiée et revalidée localement, nouveau package et nouvelle autorisation requis |
| 0.28.1 | 2026-09-01 | Contrôle Windows B1-r1 conforme selon le retour opérateur ; B1 et restauration autorisés sur le périmètre figé, résultats Google encore attendus |
| 0.28.0 | 2026-09-01 | B0 déclaré conforme après revue et confirmation opérateur ; outillage B1-r1 préparé, 39/39 tests locaux, contrôle Windows requis et aucune autorisation d'exécution B1 |
| 0.27.2 | 2026-09-01 | Contrôle local Windows B0-r2 conforme selon le retour opérateur, 14/14 et LOCAL_CHECK_ONLY ; lecture Google à autoriser, aucune fusion |
| 0.27.1 | 2026-09-01 | B0-r2 prend en charge clasp 3.3.0 du poste après revue ; 14/14 tests Node, validation PowerShell et lecture Google encore à réaliser |
| 0.27.0 | 2026-09-01 | Outillage B0-r1 préparé et tests Node 13/13 ; contrôle PowerShell/Windows et lectures Google restent à exécuter, sans changement de candidate applicative |
| 0.26.0 | 2026-09-01 | Revue D4-A et protocole D4-B préparés dans ADMIN-006-08 §22 ; B0 lecture seule puis B1 réversible, aucune fusion ni opération Google |
| 0.25.0 | 2026-09-01 | D4-A proposé dans la PR applicative #145 : runtime inactif, 761/761 tests locaux et 8/8 client simulé ; revue et D4-B requis, aucune opération Google |
| 0.24.0 | 2026-09-01 | D3-D4 technique terminé ; plan D4 proposé dans ADMIN-006-08, sans implémentation ni opération Google |
| 0.23.0 | 2026-08-31 | ADMIN-006-14 : D3-D cadré avec identité USER_DEPLOYING, audience ANYONE_ANONYMOUS et quatre sous-lots séparés sans mise en œuvre |
| 0.22.0 | 2026-08-30 | D3-C conforme : package backend validé réversiblement, configuration fermée, restauration exacte et inventaires externes inchangés |
| 0.21.0 | 2026-08-30 | D3-B conforme : support de preuve dédié, onze propriétés backend avec activation à false, secret inchangé et restauration exacte |
| 0.20.0 | 2026-08-30 | D3-A intégré par la PR #143, validé à 729/729 et restauré exactement ; D3-B requis avant push backend |
| 0.19.0 | 2026-08-30 | ADMIN-006-13 : précontrôle D3 terminé, lacunes de déploiement identifiées et D3-A applicatif requis sans mutation externe |
| 0.18.0 | 2026-08-30 | D2-B conforme : secret courant et version concordants, clé précédente absente, code restauré et transport désactivé |
| 0.17.0 | 2026-08-30 | ADMIN-006-12 : D2-A conforme, propriétés inventoriées et restaurations exactes ; D2-B cadré sans installation |
| 0.16.0 | 2026-08-30 | ADMIN-006-11 : précontrôle D2 terminé, propriétés non observables sans inspecteur contrôlé, protocole HMAC réversible défini sans création de secret |
| 0.15.0 | 2026-08-30 | ADMIN-006-10 : D1 terminé, backend privé vide et support LOG dédié créés sans partage, secret, déploiement ni raccordement |
| 0.14.0 | 2026-08-30 | ADMIN-006-09 : D0 terminé, aucun backend existant admissible, backend et support LOG RECETTE dédiés requis |
| 0.13.0 | 2026-08-30 | ADMIN-006-08 : lot D raccordement privé RECETTE, secret, anti-rejeu et recette multi-compte cadrés sans opération Google |
| 0.12.0 | 2026-08-30 | Lot C intégré dans `develop` par la PR #142 au commit `d8ca2840659cad6b467772f2563ac61a834d6ada` |
| 0.11.0 | 2026-08-30 | ADMIN-006-07 : lot C validé à 15/15 puis 716/716 en RECETTE, restauration exacte, fusion applicative attendue |
| 0.10.0 | 2026-08-30 | ADMIN-006-06 : lot C client portail et isolation Journaux cadré, sans implémentation, secret, raccordement ou déploiement |
| 0.9.0 | 2026-08-29 | Lot B intégré dans `develop` par la PR #141 au commit `c064f0f027e3e8d6e3087ba71930866588a95d05` |
| 0.8.0 | 2026-08-29 | ADMIN-006-05 : lot B validé à 18/18 localement et 701/701 en RECETTE, restauration exacte, fusion applicative attendue |
| 0.7.0 | 2026-08-29 | ADMIN-006-04 : lot B backend RECETTE et stockage anti-rejeu cadré, sans implémentation, secret, ressource Google ni déploiement |
| 0.6.0 | 2026-08-29 | Lot A intégré dans `develop` par la PR applicative #140 au commit `ea38f0759ec4b26ce73e112738075f3b501799da`, sans opération Google ni production |
| 0.5.0 | 2026-08-29 | ADMIN-006-03 : lot A validé en RECETTE à 683/683, candidate relue intégralement et HEAD restauré exactement sans modification de déploiement |
| 0.4.0 | 2026-08-28 | ADMIN-006-03 : lot A implémenté dans la PR applicative #140, 18/18 tests isolés réussis, aucune opération Google ; validation et fusion attendues |
| 0.3.0 | 2026-08-28 | ADMIN-006-02 : protocole du prototype LOG_READ RECETTE, anti-rejeu, résilience, tests et retour arrière cadrés ; implémentation non autorisée |
| 0.2.0 | 2026-08-28 | ADMIN-006-01 : inventaire des routes et supports terminé, matrice multi-compte établie et option backend privé signé recommandée pour prototype, sans implémentation |
| 0.1.0 | 2026-08-28 | Création du cadrage après reproduction en production du blocage multi-compte, retrait réversible de l’habilitation et analyse en lecture seule du code V1.4.1 |
