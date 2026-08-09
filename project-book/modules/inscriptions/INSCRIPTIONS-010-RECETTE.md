| Propriété | Valeur |
|-----------|--------|
| **Document ID** | INSCRIPTIONS-010-RECETTE |
| **Titre** | Procès-verbal de recette de la persistance technique INSCRIPTIONS-010 |
| **Version** | 1.1.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3 |

---

# 1. Objet

Ce document consigne la recette réelle du quatrième incrément `INSCRIPTIONS-010`, dédié à la première persistance technique Google Sheets du module Inscriptions dans un environnement strictement isolé de recette.

La campagne vérifie le schéma physique minimal, le raccordement au port commun `AKS.Core.Audit`, la persistance et la relecture d’une séquence et d’une commande techniques fictives, ainsi que la non-régression cumulative.

Aucune donnée nominative, aucun licencié réel, aucun responsable, aucun dossier saisonnier réel, aucune application de lot et aucune ressource de production ne sont utilisés.

# 2. Références applicatives

- dépôt : `karateseremange/AKS-Platform` ;
- branche de réalisation : `agent/inscriptions-010-recipe-persistence` ;
- PR : `#89` — `Implémenter la persistance de recette Inscriptions` ;
- tête finale exécutée : `0da406b0796dc4d96e1c403fe90dc4ab76d4cc06` ;
- cible : `develop` ;
- état final : PR #89 fusionnée dans `develop` le 9 août 2026 ;
- commit de fusion : `ed03cc428f8a8b055400b59aec7ba2e0a005629f` ;
- prérequis transverse `AUDIT-001` : intégré dans `develop` avant la fusion d’INSCRIPTIONS-010.

# 3. Synchronisation Apps Script et non-régression

La branche a été synchronisée dans le projet Apps Script existant avec `clasp push`.

Résultat observé après correction finale : **224 fichiers synchronisés**, sans erreur affichée.

La suite cumulative `AKS_runValidationSuiteV11` a ensuite été exécutée.

Résultat final : **455/455 tests réussis, 0 échec**.

Ce résultat confirme l’absence de régression cumulative après raccordement d’INSCRIPTIONS-010 avec le socle persistant `AUDIT-001` et après correction de l’adaptateur Google Sheets.

# 4. Ressource de recette

Classeur Google Sheets dédié :

`[RECETTE] AKS Inscriptions`

Identifiant technique :

`12Y7GOVrOqpeMP8Kr8PvuP5CJ3wY1Ou4QUZ3UbgKyeLM`

Avant initialisation, le classeur était neuf et ne contenait qu’un onglet vide.

Les paramètres de script utilisés pour la campagne sont strictement techniques :

- `inscriptions.environment = RECETTE` ;
- `inscriptions.spreadsheetId = 12Y7GOVrOqpeMP8Kr8PvuP5CJ3wY1Ou4QUZ3UbgKyeLM` ;
- `inscriptions.schemaVersion = inscriptions-recipe-tech/1.0` par valeur contrôlée ;
- `inscriptions.timezone = Europe/Paris` par valeur contrôlée ;
- `inscriptions.lockTimeoutMs = 5000` par valeur contrôlée.

# 5. Initialisation du schéma

La fonction protégée `AKS_recipeInscriptions010_initializeSchema` a été exécutée au moyen d’un runner temporaire editor-only avec confirmation explicite :

- `confirmed: true` ;
- `action: INITIALIZE_SCHEMA` ;
- `token: INSCRIPTIONS-010-RECETTE`.

Résultat :

- `status: VALIDE` ;
- `schemaVersion: inscriptions-recipe-tech/1.0` ;
- `environment: RECETTE` ;
- ressource reconnue : le classeur de recette attendu ;
- fuseau physique du classeur : `Europe/Paris`.

La vérification directe du classeur confirme les trois onglets autorisés :

1. `Metadata` ;
2. `Sequences` ;
3. `Commandes`.

L’onglet `Metadata` contient les sept métadonnées attendues en plus de l’en-tête, notamment `resource_kind=AKS_INSCRIPTIONS_RECIPE` et l’identifiant exact du classeur.

# 6. Première tentative de persistance et anomalie réelle

La première tentative d’allocation de la séquence `DOSSIER / 2026` a échoué avec :

`INSCRIPTIONS_SEQUENCE_CONFLICT` — `Séquence Inscriptions non vérifiée.`

L’inspection directe du classeur a montré que l’écriture avait bien eu lieu, mais que Google Sheets avait converti automatiquement la chaîne `scope_key = "2026"` en nombre `2026`.

Le contrôle de relecture stricte a donc correctement détecté que le type persistant ne correspondait pas au type attendu.

Cette anomalie démontre l’intérêt de la vérification post-écriture imposée par `INSCRIPTIONS-010` : une mutation physiquement acceptée par Sheets n’est pas considérée comme validée tant que la valeur relue n’est pas strictement conforme.

# 7. Correction appliquée

La correction est portée par le commit applicatif :

`0da406b0796dc4d96e1c403fe90dc4ab76d4cc06`

L’adaptateur Google Sheets n’utilise plus `appendRow()` pour ces écritures contrôlées. Il écrit via une plage explicite et applique un format texte aux valeurs chaîne avant `setValues`, tout en conservant les compteurs numériques comme nombres.

L’état technique laissé par la tentative échouée a été remis à zéro dans le seul classeur de recette avant le nouvel essai.

Après synchronisation de la correction, la suite cumulative a de nouveau réussi : **455/455, 0 échec**.

# 8. Preuve finale de persistance

La campagne finale a alloué la séquence :

- type : `DOSSIER` ;
- portée : `2026` conservée comme texte ;
- identifiant : `INS-2026-000001` ;
- valeur : `1` ;
- version : `1`.

Une commande technique fictive a ensuite été réservée :

- `commandId` : `CMD-RECETTE-010-001` ;
- `idempotencyKey` : `idem-recette-010-001` ;
- `payloadFingerprint` : `fp-recette-010-001` ;
- `actor` fictif : `recipe@aks.local` ;
- `action` : `DOSSIER_CREATE` ;
- cible : `DOSSIER / INS-2026-000001` ;
- module : `INSCRIPTIONS` ;
- saison : `2026-2027` ;
- section : `KARATE` ;
- corrélation : `corr-recette-010-001` ;
- statut : `INTENTION` ;
- version : `1`.

La relecture par `journal.load("idem-recette-010-001")` a retourné exactement la même projection technique.

Le classeur a ensuite été contrôlé directement :

- `Sequences` contient une seule ligne technique `DOSSIER / "2026" / 1 / 1` ;
- `Commandes` contient une seule commande `CMD-RECETTE-010-001` visant `INS-2026-000001` ;
- `created_by` et `updated_by` portent l’identité serveur de l’exécutant ;
- aucune seconde commande ni donnée métier réelle n’est présente.

# 9. Conclusion de recette

La recette technique de persistance `INSCRIPTIONS-010` est **concluante** pour le périmètre effectivement exécuté.

Elle apporte les preuves suivantes :

- schéma physique `inscriptions-recipe-tech/1.0` créé et relu sur une ressource isolée ;
- garde d’environnement et de ressource opérationnelle ;
- raccordement obligatoire au port commun persistant `AKS.Core.Audit` ;
- allocation réelle d’une séquence sous verrou ;
- conservation stricte du type texte de `scope_key` après correction ;
- persistance réelle d’une commande technique fictive ;
- relecture stricte identique de cette commande ;
- absence de régression cumulative avec **455/455 tests réussis**.

La campagne a également permis de détecter et corriger une anomalie d’interprétation automatique des types par Google Sheets avant toute fusion dans `develop`.

# 10. Limites et éléments non démontrés par cette campagne

Cette campagne ne vaut pas preuve d’exécution de toutes les situations de concurrence et de reprise listées dans le cadrage initial d’`INSCRIPTIONS-010`.

Elle ne démontre notamment pas, par exécution Google réelle distincte :

- une collision concurrente simultanée entre deux exécutions Apps Script ;
- un conflit de version optimiste provoqué réellement dans Sheets ;
- une reprise après interruption entre mutation externe et commit ;
- une réconciliation après interruption simulée ;
- une application de lot ou une mutation métier réelle.

Ces points restent couverts par les tests automatiques injectés lorsqu’ils existent, mais ne doivent pas être présentés comme des preuves Google réelles tant qu’une campagne dédiée ne les a pas exécutés.

# 11. Règle Web App

INSCRIPTIONS-010 est, dans cet incrément, strictement interne et editor-only : aucune route ou interface Web App n’expose les fonctions de recette.

Conformément à la règle actée lors d’AUDIT-001, aucun déploiement Web App de test n’est nécessaire pour valider ce socle technique interne. Toute évolution ultérieure observable depuis le Web App devra en revanche être recettée sur un déploiement de test avant validation finale et fusion dans `develop`.

# 12. Clôture

Le cycle INSCRIPTIONS-010 est clôturé pour le périmètre autorisé :

1. la recette Google isolée est concluante pour les preuves réellement exécutées ;
2. la suite cumulative finale est **455/455 réussis, 0 échec** ;
3. l’anomalie de typage Sheets est corrigée et documentée ;
4. la PR documentaire #103 a été fusionnée dans `develop` du Project Book au commit `a4fdcb5c9f9ccae25deeabc8d0811f7cee212899` ;
5. la PR applicative #89 a été fusionnée dans `develop` au commit `ed03cc428f8a8b055400b59aec7ba2e0a005629f` ;
6. aucun tag, aucune fusion vers `main` et aucun déploiement n’ont été créés dans ce cycle.

Le prochain incrément AKS Inscriptions doit faire l’objet d’un cadrage séparé. La fixture SIKADA demeure bloquée tant que l’échantillon anonymisé, sécurisé et versionné prévu par `INSCRIPTIONS-006` n’est pas disponible.