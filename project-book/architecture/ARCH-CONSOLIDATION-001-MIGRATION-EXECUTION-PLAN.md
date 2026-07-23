# ARCH-CONSOLIDATION-001 — M4.2

# Plan d’exécution des migrations documentaires

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M4.2 — Plan d’exécution des migrations documentaires |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Planification documentaire non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document poursuit le jalon M4 — Plan des migrations documentaires du chantier `ARCH-CONSOLIDATION-001`.

Il transforme le registre des candidats défini en M4.1 en un plan d’exécution ordonné.

Il définit :

- l’ordre de traitement des migrations ;
- les dépendances entre les documents ;
- les vagues d’exécution ;
- les critères d’entrée et de sortie ;
- les contrôles de cohérence ;
- les règles de validation ;
- les conditions de clôture du jalon M4.

Ce livrable ne réalise pas encore les migrations. Il prépare leur exécution contrôlée dans les documents de référence.

---

# 2. Principes d’exécution

Les migrations documentaires doivent respecter les principes suivants :

1. traiter d’abord les sources normatives avant leurs documents consommateurs ;
2. stabiliser les frontières de responsabilité avant de supprimer les doublons ;
3. ne jamais retirer une règle d’un document consommateur tant que sa source normative n’est pas complète et identifiable ;
4. conserver les rappels locaux utiles lorsqu’ils décrivent une application propre au composant ;
5. remplacer les doublons normatifs par des références explicites et stables ;
6. harmoniser le vocabulaire après stabilisation des responsabilités principales ;
7. effectuer une validation croisée après chaque vague ;
8. ne pas modifier simultanément plusieurs documents interdépendants sans plan de retour arrière ;
9. préserver la traçabilité entre chaque modification et son identifiant `MIG-xxx` ;
10. ne considérer une migration comme terminée qu’après vérification du document source et des documents consommateurs.

---

# 3. Préconditions

L’exécution des migrations peut commencer lorsque les conditions suivantes sont remplies :

- M3.3 — Matrice finale des responsabilités documentaires est validé ;
- M4.1 — Registre des candidats à migration documentaire est disponible ;
- chaque document concerné possède une version identifiable dans le dépôt ;
- aucune modification concurrente majeure n’est en cours sur le même périmètre ;
- les documents responsables sont accessibles sur la branche de travail ;
- un contrôle Git permet de revenir à l’état antérieur ;
- chaque migration est rattachée à un identifiant du registre M4.1.

---

# 4. Stratégie générale

Le plan est organisé en cinq vagues.

| Vague | Objectif | Résultat attendu |
|---|---|---|
| **Vague 1** | Stabiliser les frontières structurantes | Les documents d’architecture et les sources transverses possèdent des responsabilités explicites |
| **Vague 2** | Consolider les politiques transverses prioritaires | Les politiques communes ne sont plus redéfinies dans les documents consommateurs |
| **Vague 3** | Aligner les documents consommateurs | Les documents métier, techniques et administratifs appliquent les sources normatives |
| **Vague 4** | Harmoniser le vocabulaire et les références | Les termes et références croisées sont cohérents sur tout le périmètre |
| **Vague 5** | Nettoyer et valider globalement | Les doublons résiduels sont supprimés et la cohérence documentaire est confirmée |

Les vagues doivent être exécutées dans cet ordre.

Une vague ne peut être clôturée que lorsque ses critères de sortie sont satisfaits.

---

# 5. Ordre d’exécution détaillé

## 5.1 Vague 1 — Frontières structurantes

### Objectif

Stabiliser les responsabilités fondamentales avant toute migration de contenu détaillée.

### Migrations concernées

| Ordre | Migration | Documents principaux | Action dominante |
|---|---|---|---|
| 1 | MIG-024 | ADR-001 / ARCH-CONSOLIDATION-001 | Clarifier |
| 2 | MIG-001 | ARCH-001 / CORE-001 | Scinder et clarifier |
| 3 | MIG-002 | CORE-001 / CONFIG-001 | Déplacer ou référencer |
| 4 | MIG-003 | LOG-001 / AUDIT-001 | Scinder et harmoniser |
| 5 | MIG-004 | ERROR-001 / API-001 | Déplacer et référencer |
| 6 | MIG-005 | STORAGE-001 / DOCUMENT-001 | Scinder et clarifier |
| 7 | MIG-006 | STORAGE-001 / SECURITY-001 | Référencer et conserver les contraintes locales |

### Dépendances

- MIG-001 doit être terminée avant les migrations portant sur CORE-001.
- MIG-002 doit être terminée avant les migrations de paramétrage dans ADMIN-001 et NOTIF-001.
- MIG-003 doit être terminée avant les migrations de journalisation et d’audit dans les documents consommateurs.
- MIG-004 doit être terminée avant les migrations d’erreur dans DOCUMENT-001 et les interfaces.
- MIG-005 et MIG-006 doivent être terminées avant les migrations relatives à la conservation, à la protection et au cycle de vie des documents.

### Critères de sortie

- chaque domaine structurant possède un document responsable explicite ;
- les frontières ARCH-001 / CORE-001 sont non ambiguës ;
- CONFIG-001, LOG-001, AUDIT-001, ERROR-001, SECURITY-001, DOCUMENT-001 et STORAGE-001 sont confirmés comme sources de référence sur leur domaine ;
- aucun document de pilotage n’est présenté comme normatif ;
- les références minimales entre sources structurantes sont présentes.

---

## 5.2 Vague 2 — Politiques transverses prioritaires

### Objectif

Consolider les politiques communes avant la mise à jour de leurs consommateurs.

### Migrations concernées

| Ordre | Migration | Documents principaux | Action dominante |
|---|---|---|---|
| 1 | MIG-011 | ERROR-001 / LOG-001 | Référencer |
| 2 | MIG-012 | ERROR-001 / AUDIT-001 | Clarifier et référencer |
| 3 | MIG-013 | ERROR-001 / UX-001 | Scinder et référencer |
| 4 | MIG-020 | STORAGE-001 / LOG-001 | Scinder et harmoniser |
| 5 | MIG-021 | STORAGE-001 / AUDIT-001 | Scinder et référencer |
| 6 | MIG-022 | DOCUMENT-001 / SECURITY-001 | Référencer |
| 7 | MIG-023 | DOCUMENT-001 / ERROR-001 | Référencer |

### Dépendances

- MIG-011 et MIG-012 dépendent de MIG-003.
- MIG-013 dépend de MIG-004 et de la stabilité de UX-001.
- MIG-020 dépend de MIG-003 et de MIG-005.
- MIG-021 dépend de MIG-003, MIG-005 et MIG-006.
- MIG-022 dépend de MIG-005 et MIG-006.
- MIG-023 dépend de MIG-004 et MIG-005.

### Critères de sortie

- aucune politique transverse prioritaire n’est redéfinie dans un autre document ;
- les durées, preuves, journaux, erreurs et exigences de sécurité possèdent une source identifiable ;
- les documents concernés distinguent les règles générales de leurs contraintes locales ;
- les références croisées nécessaires sont présentes et stables.

---

## 5.3 Vague 3 — Documents consommateurs

### Objectif

Aligner les documents qui consomment les politiques transverses.

### Migrations concernées

| Ordre | Migration | Documents principaux | Action dominante |
|---|---|---|---|
| 1 | MIG-007 | ADMIN-001 / CONFIG-001 | Référencer |
| 2 | MIG-008 | ADMIN-001 / SECURITY-001 | Scinder et référencer |
| 3 | MIG-009 | ADMIN-001 / LOG-001 / AUDIT-001 | Harmoniser et référencer |
| 4 | MIG-010 | ADMIN-001 / UX-001 | Référencer |
| 5 | MIG-014 | API-001 / SECURITY-001 | Référencer |
| 6 | MIG-015 | API-001 / LOG-001 / AUDIT-001 | Harmoniser et référencer |
| 7 | MIG-016 | NOTIF-001 / CONFIG-001 | Déplacer ou référencer |
| 8 | MIG-017 | NOTIF-001 / LOG-001 | Référencer |
| 9 | MIG-018 | NOTIF-001 / AUDIT-001 | Clarifier et référencer |
| 10 | MIG-019 | NOTIF-001 / SECURITY-001 | Référencer |

### Dépendances

- MIG-007 dépend de MIG-002.
- MIG-008 dépend de MIG-006.
- MIG-009 dépend de MIG-003.
- MIG-010 dépend de MIG-013.
- MIG-014 dépend de MIG-004 et MIG-006.
- MIG-015 dépend de MIG-003 et MIG-004.
- MIG-016 dépend de MIG-002.
- MIG-017 et MIG-018 dépendent de MIG-003.
- MIG-019 dépend de MIG-006.

### Critères de sortie

- ADMIN-001 reste centré sur les écrans, parcours et contrôles locaux ;
- API-001 reste centré sur les contrats d’interface ;
- NOTIF-001 reste centré sur le cycle fonctionnel des notifications ;
- les politiques communes sont référencées et non dupliquées ;
- les contraintes propres à chaque composant sont conservées ;
- aucune référence ne pointe vers un document non stabilisé.

---

## 5.4 Vague 4 — Harmonisation transversale

### Objectif

Uniformiser les termes, références et rappels après stabilisation des responsabilités.

### Migrations concernées

| Ordre | Migration | Périmètre | Action dominante |
|---|---|---|---|
| 1 | MIG-025 | Ensemble du périmètre | Harmoniser le vocabulaire |
| 2 | MIG-026 | Ensemble du périmètre | Ajouter ou corriger les références |
| 3 | MIG-027 | Ensemble du périmètre | Réduire ou supprimer les doublons éditoriaux |

### Dépendances

- MIG-025 commence uniquement après clôture des vagues 1 à 3.
- MIG-026 dépend de la stabilité des chemins, noms et responsabilités documentaires.
- MIG-027 doit être exécutée après MIG-025 et MIG-026 afin d’éviter la suppression prématurée d’un contenu encore nécessaire.

### Critères de sortie

- les termes structurants possèdent une définition unique ;
- les documents consommateurs utilisent la même terminologie ;
- chaque politique consommée cite sa source normative ;
- les rappels locaux sont courts, utiles et clairement non normatifs ;
- les doublons éditoriaux sans valeur locale sont retirés.

---

## 5.5 Vague 5 — Validation globale et nettoyage final

### Objectif

Confirmer la cohérence de l’ensemble du périmètre et clôturer les migrations.

### Contrôles à réaliser

- relire toutes les migrations `MIG-001` à `MIG-027` ;
- vérifier le statut de chaque entrée du registre ;
- rechercher les doublons normatifs résiduels ;
- vérifier les références croisées ;
- contrôler les chemins de fichiers et les identifiants documentaires ;
- vérifier qu’aucun contenu métier ou technique utile n’a été perdu ;
- confirmer que les documents consommateurs n’introduisent pas de politiques concurrentes ;
- vérifier que le document responsable contient bien la règle retirée ailleurs ;
- effectuer une relecture éditoriale globale ;
- produire le bilan de clôture du jalon M4.

### Critères de sortie

- toutes les migrations sont marquées `Terminé`, `Écart accepté` ou `Reporté avec justification` ;
- aucun candidat P1 ou P2 ne reste sans décision ;
- aucune contradiction majeure n’est détectée ;
- les références croisées sont valides ;
- les documents normatifs et non normatifs sont clairement identifiables ;
- le bilan final est publié dans le Project Book.

---

# 6. Matrice des dépendances principales

| Migration | Dépend de | Bloque principalement |
|---|---|---|
| MIG-024 | Aucune | Clarification du statut du chantier |
| MIG-001 | MIG-024 | Migrations portant sur CORE-001 |
| MIG-002 | MIG-001 | MIG-007, MIG-016 |
| MIG-003 | MIG-001 | MIG-009, MIG-011, MIG-012, MIG-015, MIG-017, MIG-018, MIG-020, MIG-021 |
| MIG-004 | MIG-001 | MIG-013, MIG-014, MIG-015, MIG-023 |
| MIG-005 | MIG-001 | MIG-020, MIG-021, MIG-022, MIG-023 |
| MIG-006 | MIG-005 | MIG-008, MIG-014, MIG-019, MIG-021, MIG-022 |
| MIG-013 | MIG-004 | MIG-010 |
| MIG-025 | Vagues 1 à 3 | MIG-026, MIG-027 |
| MIG-026 | MIG-025 | MIG-027 |
| MIG-027 | MIG-025, MIG-026 | Clôture M4 |

---

# 7. Règles de traitement d’une migration

Chaque migration doit suivre les étapes suivantes :

1. identifier précisément le contenu concerné ;
2. confirmer le document responsable à partir de M3.3 ;
3. vérifier que la source normative cible est suffisante ;
4. modifier d’abord le document responsable si nécessaire ;
5. modifier ensuite les documents consommateurs ;
6. remplacer les doublons par une référence explicite ;
7. conserver les contraintes et exemples locaux utiles ;
8. vérifier les liens et les identifiants ;
9. effectuer une relecture croisée ;
10. mettre à jour le statut de la migration dans le registre ;
11. associer le ou les commits Git à l’identifiant `MIG-xxx`.

---

# 8. Statuts de suivi

| Statut | Signification |
|---|---|
| **À faire** | Migration identifiée mais non commencée |
| **Prête** | Préconditions satisfaites et dépendances levées |
| **En cours** | Modification documentaire en cours |
| **À valider** | Modification terminée, relecture requise |
| **Terminé** | Critères de validation satisfaits |
| **Bloqué** | Dépendance ou information manquante |
| **Écart accepté** | Chevauchement conservé avec justification explicite |
| **Reporté** | Migration déplacée vers un jalon ultérieur avec justification |

---

# 9. Critères de validation par migration

Une migration est validée lorsque :

- le contenu cible est clairement identifié ;
- le document responsable contient la règle de référence ;
- les documents consommateurs ne portent plus de définition concurrente ;
- les rappels locaux nécessaires sont conservés ;
- les références croisées sont explicites ;
- le vocabulaire est cohérent ;
- aucun contenu utile n’a été perdu ;
- les critères spécifiques de M4.1 sont satisfaits ;
- la modification est relue ;
- le commit Git est traçable ;
- le statut du registre est mis à jour.

---

# 10. Gestion des écarts

Un écart peut être accepté uniquement lorsqu’un contenu doit rester présent dans plusieurs documents pour des raisons de compréhension ou d’exploitation locale.

L’écart doit alors préciser :

- le contenu conservé ;
- la raison de sa conservation ;
- le document responsable ;
- la nature non normative du rappel ;
- la référence vers la source ;
- le risque de divergence ;
- le mécanisme de contrôle lors des futures évolutions.

Un écart accepté ne doit pas créer une seconde source normative.

---

# 11. Gestion des risques

| Risque | Mesure de maîtrise |
|---|---|
| Suppression prématurée d’une règle | Compléter et valider la source normative avant modification des consommateurs |
| Perte d’une contrainte locale | Distinguer systématiquement règle générale et application locale |
| Référence cassée | Vérifier le chemin et l’identifiant après chaque modification |
| Migration partielle | Traiter le document responsable et tous ses consommateurs dans la même vague |
| Divergence terminologique | Exécuter MIG-025 après stabilisation des responsabilités |
| Modifications concurrentes | Travailler sur une branche dédiée ou synchroniser avant chaque commit |
| Difficulté de retour arrière | Produire des commits atomiques et identifiés par migration |
| Mélange normatif et pilotage | Maintenir ARCH-CONSOLIDATION-001 et ses livrables comme documents non normatifs |

---

# 12. Organisation des commits

Les migrations doivent être publiées avec des commits aussi atomiques que possible.

Format recommandé :

```text
docs(architecture): execute MIG-xxx <description courte>
```

Exemples :

```text
docs(architecture): execute MIG-001 clarify ARCH and CORE boundaries
docs(configuration): execute MIG-002 centralize parameter governance
docs(logging): execute MIG-003 separate logging and audit responsibilities
```

Un commit peut couvrir plusieurs migrations uniquement lorsqu’elles sont techniquement indissociables. Dans ce cas, tous les identifiants doivent apparaître dans le message ou la description du commit.

---

# 13. Résultat attendu du jalon M4

À l’issue de l’exécution de ce plan :

- chaque domaine documentaire possède une source de référence unique ;
- les responsabilités documentaires sont lisibles ;
- les doublons normatifs sont supprimés ou remplacés par des références ;
- les applications locales restent documentées ;
- le vocabulaire est harmonisé ;
- les références croisées sont explicites ;
- les migrations sont traçables ;
- le Project Book est prêt pour la validation finale de consolidation.

Le prochain sous-jalon attendu est :

**M4.3 — Bilan et critères de clôture des migrations documentaires.**
