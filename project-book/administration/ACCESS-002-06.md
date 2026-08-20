# ACCESS-002-06 — Migration définitive des modules

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-06 |
| **Titre** | Migration définitive des modules vers les capacités ACCESS explicites |
| **Version** | 0.5.0 |
| **Statut** | Implémentation engagée — lots 1 à 4 clôturés, lot 5 à engager |
| **Nature** | Spécification d’incrément fonctionnel, technique et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-20 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-06` migre progressivement les routes, contrôleurs et API encore protégés par le mécanisme historique `AKS.Admin.Access` vers des capacités ACCESS explicites. L’incrément complète le Portail AKS livré par `ACCESS-002-05`, maintient la compatibilité en lecture de `access/1.1` et prépare une réduction contrôlée du filet historique.

Cette étape ne modifie aucun compte ni aucune donnée réelle pendant l’implémentation. Elle ne réalise aucune récupération réelle. Toute recette de récupération est temporaire, réversible et se termine obligatoirement par la restauration exacte du registre initial, y compris lorsque celui-ci est en `access/1.1`.

## 2. Point de départ vérifié

`ACCESS-002-05` est clôturé en version `1.0.0` au commit applicatif `9af21d7`. La campagne cumulative de référence réussit à **614/614 tests, 0 échec**. Le registre ACCESS et la configuration AUDIT ont été restaurés exactement après la recette multi-profils ; propriétés et sauvegardes temporaires ont été supprimées.

L’architecture actuelle combine encore deux mécanismes :

- ACCESS autorise déjà Présences, Analytics, Inscriptions et la gestion des comptes ;
- `AKS.Admin.Access` protège encore Paramétrage, Journaux, le contrôleur Analytics administratif, certaines API historiques du Dashboard et une partie de l’autorisation AUDIT ;
- le portail projette encore Paramétrage, Journaux et Questionnaire santé comme destinations historiques ;
- `AUDIT_READ` existe dans le catalogue mais n’est pas attribuable dans le registre actuel ;
- aucun module autonome Maintenance n’est actuellement cadré.

## 3. Principes permanents

1. Google authentifie ; le registre ACCESS autorise.
2. Un rôle reste descriptif et n’accorde aucune capacité implicite.
3. Chaque capacité nécessaire est inscrite explicitement dans l’affectation.
4. Une carte visible ne constitue jamais une autorisation.
5. Chaque route et chaque appel serveur réautorise l’identité Google active.
6. Une ancienne affectation incohérente n’est jamais complétée automatiquement.
7. La lecture d’un registre ne provoque aucune réécriture.
8. Une opération réelle, un compte réel, Apps Script, `main`, la production ou un déploiement exigent une autorisation distincte.

## 4. Décisions validées

Le Product Owner a validé le 14 août 2026 les décisions D1 à D13 suivantes.

### D1 — Migration progressive

Chaque contrôleur et chaque API serveur est migré séparément. Une fonction migrée ne s’appuie plus sur `AKS.Admin.Access` pour son fonctionnement normal. Le mécanisme historique reste temporairement disponible pour l’amorçage et la récupération jusqu’à validation de la procédure définie en D12.

### D2 — Module transverse ADMINISTRATION

Le schéma cible introduit un module `ADMINISTRATION`, sans saison, section ni cours. Ses seules capacités dans cet incrément sont :

- `CONFIG_READ` ;
- `CONFIG_WRITE` ;
- `CONFIG_RESET` ;
- `LOG_READ`.

`MAINTENANCE_EXECUTE` est exclue. Aucune capacité Maintenance n’est créée tant qu’une fonctionnalité Maintenance autonome n’est pas cadrée.

### D3 — Séparation des droits ACCESS et AUDIT

`ACCESS_MANAGE` reste exclusivement attaché au module `ACCESS`. Il protège la liste globale, les fiches individuelles, les modifications de rôles et habilitations, les opérations de cycle de vie et l’historique fonctionnel ciblé d’un compte.

`AUDIT_READ` est réservé à une future consultation globale des preuves AUDIT. Il n’est pas rendu attribuable par `ACCESS-002-06`, ne protège pas l’historique ciblé des comptes et ne justifie pas la création anticipée d’un écran Audit.

### D4 — Capacités du Paramétrage

| Opération | Capacité exigée |
|---|---|
| Ouvrir et consulter le Paramétrage | `CONFIG_READ` |
| Enregistrer une valeur | `CONFIG_WRITE` |
| Réinitialiser une valeur | `CONFIG_RESET` |

Aucune capacité n’en accorde implicitement une autre. Les nouvelles écritures du registre respectent les combinaisons suivantes :

| Capacité attribuée | Capacités devant également être inscrites |
|---|---|
| `CONFIG_READ` | aucune |
| `CONFIG_WRITE` | `CONFIG_READ` |
| `CONFIG_RESET` | `CONFIG_READ` et `CONFIG_WRITE` |

Une personne autorisée à réinitialiser possède donc explicitement les trois capacités. Cette exigence est une règle de cohérence contrôlée à l’enregistrement, pas un héritage calculé. Les restrictions existantes sur les paramètres sensibles restent applicables.

### D5 — Cohérence des capacités Analytics

Les capacités restent indépendantes :

- `ANALYTICS_READ` : diagnostic et consultation ;
- `ANALYTICS_PREVIEW` : génération d’un aperçu complet ;
- `ANALYTICS_PUBLISH` : publication confirmée sur Drive.

Les nouvelles écritures respectent les combinaisons explicites suivantes :

| Capacité attribuée | Capacités devant également être inscrites |
|---|---|
| `ANALYTICS_READ` | aucune |
| `ANALYTICS_PREVIEW` | `ANALYTICS_READ` |
| `ANALYTICS_PUBLISH` | `ANALYTICS_READ` et `ANALYTICS_PREVIEW` |

Une ancienne affectation `access/1.1` incomplète reste lisible sans ajout automatique. Les actions non explicitement et techniquement autorisées restent indisponibles. Une future modification doit rétablir une combinaison cohérente avant enregistrement.

### D6 — Visibilité et actions Analytics

La carte Analytics est visible dès qu’au moins une capacité Analytics effective est présente. L’écran adapte ses actions aux capacités réellement inscrites :

| Capacités effectives | Actions proposées |
|---|---|
| `ANALYTICS_READ` | consultation et diagnostic |
| `ANALYTICS_READ` + `ANALYTICS_PREVIEW` | diagnostic et aperçu |
| Les trois capacités | diagnostic, aperçu et publication |
| Affectation historique incohérente | actions correspondant aux capacités explicitement présentes et techniquement utilisables |

Chaque API réautorise séparément : diagnostic avec `ANALYTICS_READ`, aperçu avec `ANALYTICS_PREVIEW`, publication avec `ANALYTICS_PUBLISH`. La publication conserve la confirmation explicite et le jeton d’aperçu valide.

### D7 — Visibilité et actions du Paramétrage

La carte Paramétrage est visible lorsqu’au moins une capacité `CONFIG_*` effective est présente. L’interface applique les combinaisons suivantes :

- `CONFIG_READ` permet la consultation ;
- `CONFIG_READ` et `CONFIG_WRITE` permettent la consultation et l’enregistrement ;
- `CONFIG_READ`, `CONFIG_WRITE` et `CONFIG_RESET` permettent aussi la réinitialisation.

Une ancienne affectation incohérente reste lisible sans ajout automatique. Seules les actions correspondant à une combinaison complète et utilisable sont proposées. Chaque fonction serveur exige les capacités nécessaires : consultation avec `CONFIG_READ`, enregistrement avec `CONFIG_READ` et `CONFIG_WRITE`, réinitialisation avec les trois capacités.

### D8 — Journaux techniques

`LOG_READ` protège la route `?app=logs`, la lecture filtrée des journaux et l’éventuel aperçu récent dans le Portail AKS. Cette capacité ne donne accès ni à la gestion des comptes, ni à leur historique ciblé, ni à une future consultation globale AUDIT.

### D9 — Portail piloté par ACCESS

Après migration, les destinations suivent les capacités effectives :

| Destination | Condition de visibilité |
|---|---|
| Comptes et accès | `ACCESS_MANAGE` |
| Paramétrage | au moins une capacité `CONFIG_*` |
| Journaux | `LOG_READ` |
| Analytics | au moins une capacité `ANALYTICS_*` |
| Présences | capacités Présences effectives |
| Mes accès | compte ACCESS actif et reconnu |

Lorsque le registre existe, la liste historique des administrateurs ne décide plus de ces destinations.

### D10 — Questionnaire santé

Seule la destination « Questionnaire santé » déclarée dans le Portail AKS comme destination historique est retirée. Le questionnaire public, sa route par défaut, le formulaire, la soumission, les attestations PDF et QR, les notifications, la persistance et la publication WordPress ne sont pas modifiés.

### D11 — Compatibilité access/1.1 vers access/1.2

Le service accepte en lecture `access/1.1` et `access/1.2`. Un registre `access/1.1` est normalisé en mémoire vers le modèle `access/1.2` pour les contrôles et projections, sans :

- réécriture automatique ;
- attribution de capacité ;
- création implicite d’affectation administrative ;
- changement de version ou de révision persistée lors d’une consultation.

Le passage persistant à `access/1.2` intervient uniquement lors d’une commande explicitement confirmée, après prévisualisation, contrôle de cohérence, vérification de révision, audit avant/après, protection du dernier gestionnaire et disponibilité d’une restauration exacte.

### D12 — Procédure de récupération et recette réversible

`AKS.Admin.Access` n’est réduit définitivement qu’après documentation d’une procédure de récupération et validation de sa recette réversible. La procédure couvre :

1. les situations exceptionnelles autorisant son utilisation ;
2. un registre absent, invalide ou inaccessible ;
3. l’absence de tout gestionnaire ACCESS effectif ;
4. l’identité technique autorisée à l’engager ;
5. un précontrôle sans écriture ;
6. une sauvegarde exacte du registre existant ;
7. une opération minimale de rétablissement ;
8. une preuve AUDIT persistante ;
9. la vérification de la reconnexion ;
10. la gestion des sauvegardes et propriétés temporaires ;
11. la confirmation renforcée nécessaire à toute conservation ;
12. la preuve qu’un administrateur historique ne peut pas utiliser ce mécanisme en fonctionnement normal.

Deux usages sont strictement distingués.

#### Recette de récupération dans ACCESS-002-06

- environnement et identités explicitement contrôlés ;
- mutation temporaire minimale ;
- vérification du rétablissement temporaire d’un gestionnaire ;
- restauration exacte et obligatoire du registre initial, y compris en `access/1.1` ;
- suppression des sauvegardes et propriétés temporaires ;
- conservation des seules preuves d’audit prévues ;
- aucun état de récupération conservé.

#### Récupération réelle exceptionnelle

- déclenchée uniquement face à une perte réelle d’administration ;
- hors exécution d’ACCESS-002-06 ;
- autorisation renforcée distincte ;
- sauvegarde préalable obligatoire ;
- opération minimale auditée ;
- vérification fonctionnelle du registre obtenu ;
- confirmation finale explicite avant conservation ;
- restauration possible tant que cette confirmation n’est pas donnée.

ACCESS-002-06 documente cette procédure et teste uniquement sa recette réversible. Il n’exécute aucune récupération réelle et ne conserve aucun résultat de récupération.

### D13 — Aucune attribution ni récupération réelle pendant l’implémentation

L’ajout du modèle et des contrôles ne modifie aucun compte réel. Toute future attribution de `CONFIG_READ`, `CONFIG_WRITE`, `CONFIG_RESET` ou `LOG_READ` exige une prévisualisation, un protocole réversible, une autorisation distincte, une vérification et la conclusion prévue par le protocole validé.

La recette de récupération reste temporaire et se termine obligatoirement par la restauration exacte du registre initial. Aucune récupération réelle exceptionnelle n’est exécutée pendant `ACCESS-002-06` ; seule sa procédure est documentée et rendue testable.

## 5. Découpage en six lots

### Lot 1 — Modèle ACCESS 1.2

- module `ADMINISTRATION` ;
- capacités `CONFIG_READ`, `CONFIG_WRITE`, `CONFIG_RESET` et `LOG_READ` ;
- règles de cohérence Config et Analytics ;
- maintien d’`AUDIT_READ` hors attribution ;
- lecture compatible de `access/1.1` ;
- normalisation interne sans écriture ;
- tests de schéma, registre et non-régression.

#### État du lot 1 — clôturé le 20 août 2026

Le lot 1 est intégré dans `develop` par la [PR applicative #119](https://github.com/karateseremange/AKS-Platform/pull/119), au commit de fusion [`31ba2d1`](https://github.com/karateseremange/AKS-Platform/commit/31ba2d12ef4fd971b6978beaccb1390dec4fe93f).

L’implémentation introduit le modèle `access/1.2`, le module `ADMINISTRATION`, les quatre capacités Config/Logs et les règles de cohérence explicites Config et Analytics. La lecture de `access/1.0` et `access/1.1` reste compatible ; la normalisation vers `access/1.2` est effectuée en mémoire sans réécriture automatique. `AUDIT_READ` reste non attribuable.

La tête applicative `25a8a33` a été synchronisée avec **259 fichiers** dans l’environnement Apps Script de recette. La suite ciblée a réussi à **10/10** et la campagne cumulative à **624/624**, sans échec. Aucun compte ni registre réel n’a été modifié, aucune capacité réelle n’a été attribuée et aucune récupération réelle n’a été exécutée.

### Lot 2 — Migration Analytics

- contrôle fin des trois API serveur ;
- visibilité de la carte et adaptation des actions ;
- traitement sûr des anciennes combinaisons incohérentes ;
- tests des appels directs et non-régressions.

#### État du lot 2 — clôturé le 20 août 2026

Le lot 2 est intégré dans `develop` par la [PR applicative #120](https://github.com/karateseremange/AKS-Platform/pull/120), au commit de fusion [`d8e7d7d`](https://github.com/karateseremange/AKS-Platform/commit/d8e7d7daaf55ac58a01e4007c990754c1000f813).

Le contrôleur Analytics ne dépend plus d’`AKS.Admin.Access` en fonctionnement normal. La route est visible dès qu’une capacité Analytics effective existe ; le diagnostic, l’aperçu et la publication réautorisent respectivement `ANALYTICS_READ`, `ANALYTICS_PREVIEW` et `ANALYTICS_PUBLISH`. La vue adapte ses actions aux droits explicites et masque une publication techniquement inutilisable lorsqu’aucun aperçu autorisé ne peut fournir le jeton requis. Le bootstrap historique reste borné au registre absent.

La première exécution a obtenu **13/16** : les treize contrôles fonctionnels avaient réussi, mais trois tests structurels utilisaient un lecteur HTML incompatible avec les scriptlets conditionnels. Le correctif `b91052f` a remplacé cette lecture par la source brute du template, sans modifier la vue ni la logique fonctionnelle. Après resynchronisation, les campagnes ont réussi à **16/16** pour Analytics, **9/9** pour la projection du portail et **630/630** pour la suite cumulative.

Aucune fonction métier Analytics n’a été appelée directement, aucune publication Drive n’a été exécutée et aucun compte, registre ou droit réel n’a été modifié.

### Lot 3 — Migration du Paramétrage

- protection séparée de la lecture, de l’écriture et de la réinitialisation ;
- adaptation des actions visibles ;
- conservation des restrictions sur les paramètres sensibles ;
- tests des combinaisons et appels directs.

#### État du lot 3 — clôturé le 20 août 2026

Le lot 3 est intégré dans `develop` par la [PR applicative #121](https://github.com/karateseremange/AKS-Platform/pull/121), au commit de fusion [`d7d3698`](https://github.com/karateseremange/AKS-Platform/commit/d7d3698658a789aa5a2b59c034fae14ee054babd).

Le contrôleur Paramétrage ne dépend plus d’`AKS.Admin.Access` en fonctionnement normal. La consultation exige `CONFIG_READ`, l’enregistrement réautorise explicitement `CONFIG_READ` et `CONFIG_WRITE`, et la réinitialisation exige les trois capacités `CONFIG_READ`, `CONFIG_WRITE` et `CONFIG_RESET`. Aucun héritage n’est calculé. La vue n’expose aucune valeur sans droit de lecture, adapte les formulaires aux combinaisons complètes et conserve les restrictions sur les paramètres sensibles. La carte Paramétrage est projetée avec toute capacité `CONFIG_*` effective ; son accès historique est borné au seul bootstrap sans registre.

Les premières campagnes ont réussi à **13/13** pour le Paramétrage et **11/11** pour la projection du portail. La suite cumulative a obtenu **636/637** : l’unique échec provenait de l’ancienne fixture UX du socle administratif, qui ne fournissait pas le nouveau bloc `permissions`. Le correctif `e250b4a` a uniquement adapté cette fixture, sans changement fonctionnel. Après resynchronisation, la campagne cumulative a réussi à **637/637**, sans échec.

Aucune fonction de modification métier n’a été appelée directement. Aucun compte, droit, registre, paramètre ou donnée réelle n’a été modifié.

### Lot 4 — Migration des Journaux

- protection de la route et des lectures par `LOG_READ` ;
- adaptation de l’aperçu du portail ;
- séparation avec AUDIT et l’historique ACCESS.

#### État du lot 4 — clôturé le 20 août 2026

Le lot 4 est intégré dans `develop` par la [PR applicative #122](https://github.com/karateseremange/AKS-Platform/pull/122), au commit de fusion [`ca691f2`](https://github.com/karateseremange/AKS-Platform/commit/ca691f2808fef55d75b09be951c0edcb50b9237d).

Le contrôleur Journaux ne dépend plus d’`AKS.Admin.Access`. La route `?app=logs`, la lecture filtrée et l’aperçu récent réautorisent `LOG_READ` avant tout accès au stockage. Un refus ACCESS reste un refus et n’est pas transformé en indisponibilité technique. La carte Journaux est projetée par `LOG_READ` ; son accès historique est borné au bootstrap sans registre. L’aperçu récent du Portail est chargé uniquement lorsque la destination `admin.logs` est effectivement projetée.

Cette consultation reste strictement séparée des preuves AUDIT et de l’historique ciblé ACCESS : ni `AUDIT_READ` ni `ACCESS_MANAGE` ne donnent accès aux journaux techniques.

Après synchronisation de la tête `5e4c012`, les campagnes Apps Script ont réussi à **32/32** pour LOGGER-001, **13/13** pour la projection du portail et **641/641** pour la suite cumulative, sans échec. Aucune fonction d’écriture LOG n’a été appelée directement, aucune preuve AUDIT n’a été consultée et aucun compte, droit, registre ou donnée réelle n’a été modifié.

### Lot 5 — Portail et réduction du mécanisme historique

- projection pilotée par ACCESS ;
- retrait de la seule destination privée Questionnaire santé ;
- aucune modification du service public ;
- suppression des dépendances historiques des contrôleurs migrés ;
- maintien borné du mécanisme de récupération.

### Lot 6 — Procédure de récupération, recette réversible et clôture

- documentation de la récupération exceptionnelle ;
- séparation entre recette temporaire et récupération réelle ;
- précontrôle sans écriture ;
- test réversible d’une récupération minimale ;
- vérification du rétablissement temporaire d’un gestionnaire ;
- restauration exacte et obligatoire du registre initial, y compris en `access/1.1` ;
- suppression des sauvegardes et propriétés temporaires ;
- profils différenciés Analytics, Config, Logs et ACCESS ;
- appels serveur directs autorisés et refusés ;
- compatibilité en lecture de `access/1.1` ;
- normalisation interne vers `access/1.2` sans réécriture automatique ;
- passage persistant contrôlé à `access/1.2` uniquement dans le protocole autorisé ;
- aucune récupération réelle exécutée ;
- décision documentée sur le maintien résiduel ou le retrait futur d’`AKS.Admin.Access`.

Chaque lot part du dernier `develop` intégré, ajoute ses tests ciblés, conserve la suite cumulative et fait l’objet de preuves documentaires séparées.

## 6. Sécurité et contrôles serveur

- les contrôleurs reçoivent une façade d’autorisation ACCESS injectée ;
- chaque fonction appelée depuis le navigateur contrôle l’identité active ;
- les objets client ne transportent aucune identité d’autorisation ;
- une incohérence de capacités est refusée lors d’une nouvelle écriture ;
- une version inconnue du registre est refusée fermée ;
- les messages utilisateur restent génériques ;
- les preuves techniques sont minimisées selon leur audience ;
- les opérations de publication Analytics conservent confirmation et jeton ;
- la protection du dernier gestionnaire reste obligatoire.

## 7. Scénarios minimaux

| ID | Scénario | Résultat attendu |
|---|---|---|
| A06-01 | Lecture `access/1.1` | Normalisation interne sans écriture ni changement de révision |
| A06-02 | Lecture `access/1.2` | Capacités et modules projetés normalement |
| A06-03 | `CONFIG_READ` seul | Consultation sans écriture ni réinitialisation |
| A06-04 | `CONFIG_WRITE` sans lecture | Nouvelle écriture de registre refusée comme incohérente |
| A06-05 | `CONFIG_RESET` incomplet | Nouvelle écriture refusée |
| A06-06 | Trois capacités Config | Consultation, écriture et réinitialisation disponibles |
| A06-07 | Analytics lecture | Diagnostic uniquement |
| A06-08 | Analytics aperçu cohérent | Diagnostic et aperçu, sans publication |
| A06-09 | Analytics publication cohérente | Publication confirmée avec jeton valide |
| A06-10 | Analytics historique incohérent | Aucun droit ajouté ; actions limitées |
| A06-11 | `LOG_READ` | Journaux visibles sans AUDIT ni ACCESS |
| A06-12 | Appel direct non autorisé | Refus serveur malgré URL ou fonction connue |
| A06-13 | Portail | Destinations calculées depuis ACCESS uniquement |
| A06-14 | Questionnaire santé public | Fonctionnement public inchangé |
| A06-15 | Recette de récupération | Rétablissement temporaire puis restauration exacte |
| A06-16 | Registre initial `access/1.1` | Restauration exacte en `access/1.1` |
| A06-17 | Administrateur historique en fonctionnement normal | Aucun contournement des capacités ACCESS |
| A06-18 | Récupération réelle | Non exécutée ; procédure seulement documentée |
| A06-19 | Suite cumulative | Référence portée à 641/641 après le lot 4 |

## 8. Hors périmètre

Sont exclus :

- `MAINTENANCE_EXECUTE` et toute fonctionnalité Maintenance autonome ;
- interface globale de consultation AUDIT ;
- attribution de `AUDIT_READ` ;
- création d’un écran Audit ;
- modification du Questionnaire santé public ;
- attribution réelle pendant l’implémentation ;
- récupération réelle exceptionnelle ;
- réécriture automatique d’un registre `access/1.1` ;
- modification implicite des capacités historiques ;
- production, `main`, tag, release ou déploiement ;
- notifications, exports, modifications groupées et modèles d’habilitations.

## 9. Critères d’acceptation

`ACCESS-002-06` pourra être clôturé lorsque :

1. les décisions D1 à D13 sont implémentées sans attribution réelle implicite ;
2. `access/1.1` reste lisible sans réécriture automatique ;
3. les nouvelles écritures `access/1.2` contrôlent les cohérences Config et Analytics ;
4. Analytics, Paramétrage et Journaux réautorisent leurs routes et API côté serveur ;
5. les cartes et actions reflètent exactement les capacités effectives ;
6. l’historique ciblé reste sous `ACCESS_MANAGE` ;
7. `AUDIT_READ` reste hors attribution ;
8. le Questionnaire santé public reste inchangé ;
9. le portail ne dépend plus de l’ancien administrateur pour les fonctions migrées ;
10. la procédure de récupération est documentée et sa recette réversible réussit ;
11. le registre initial est restauré exactement, y compris s’il est en `access/1.1` ;
12. aucune récupération réelle n’est exécutée ;
13. le maintien ou le retrait futur d’`AKS.Admin.Access` est décidé et documenté ;
14. les tests ciblés et la suite cumulative sont concluants ;
15. le Project Book contient les preuves et incidents utiles à la reprise.

## 10. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.5.0 | 2026-08-20 | Lot 4 clôturé : Journaux migrés vers `LOG_READ` par la PR applicative #122 au commit `ca691f2`, route et aperçu du portail réautorisés avant stockage, séparation AUDIT/ACCESS confirmée, validations **32/32**, **13/13** et **641/641**, sans mutation réelle |
| 0.4.0 | 2026-08-20 | Lot 3 clôturé : Paramétrage migré vers ACCESS par la PR applicative #121 au commit `d7d3698` ; contrôles explicites READ/WRITE/RESET, carte pilotée par `CONFIG_*`, incident de fixture UX corrigé par `e250b4a`, campagnes finales **13/13**, **11/11** et **637/637**, sans mutation réelle |
| 0.3.0 | 2026-08-20 | Lot 2 clôturé : Analytics migré vers ACCESS par la PR applicative #120 au commit `d8e7d7d` ; incident de lecteur de template corrigé par `b91052f`, campagnes finales **16/16**, **9/9** et **630/630**, sans publication Drive ni mutation réelle |
| 0.2.0 | 2026-08-20 | Lot 1 clôturé : modèle `access/1.2` et module ADMINISTRATION intégrés par la PR applicative #119 au commit `31ba2d1`, 259 fichiers synchronisés, suite ciblée **10/10** et campagne cumulative **624/624**, sans attribution, réécriture automatique ni récupération réelle |
| 0.1.0 | 2026-08-14 | Cadrage validé : décisions D1 à D13, six lots, module ADMINISTRATION, capacités Config et Logs, cohérences explicites Config/Analytics, lecture `access/1.1` sans réécriture, portail piloté par ACCESS, retrait de la seule destination privée Questionnaire santé, procédure de récupération distinguant recette réversible et récupération réelle hors périmètre |
