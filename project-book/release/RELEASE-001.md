# RELEASE-001
# Processus de publication d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| Document ID | RELEASE-001 |
| Titre | Processus de publication d'AKS Platform |
| Version | 1.1.1 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-19 |
| Version du produit | V1.1 |

---

# 1. Objet

Ce document définit le processus officiel de préparation, validation, publication et maintenance des versions d'AKS Platform.

Il garantit que chaque version publiée est documentée, testée et reproductible.

---

# 2. Objectifs

Le processus de publication doit :

- garantir la stabilité des versions publiées ;
- assurer la traçabilité des évolutions ;
- synchroniser le code et la documentation ;
- limiter les régressions ;
- faciliter les correctifs.

---

# 3. Branches de référence

## Dépôt applicatif

- `develop` : développement courant ;
- `main` : version stable et production.

## Dépôt Project Book

- `develop` : préparation et validation des évolutions documentaires ;
- `main` : documentation officielle validée et publiée.

Les modifications courantes sont réalisées sur `develop`. Elles sont fusionnées vers `main` uniquement après validation documentaire.

Toute publication documentaire suit les étapes suivantes :

1. mise à jour et revue sur `develop` ;
2. validation du Quality Gate documentaire ;
3. fusion de `develop` vers `main` ;
4. création et publication du tag documentaire correspondant.

Un correctif documentaire urgent peut exceptionnellement être appliqué sur `main` après validation explicite. Il doit ensuite être réintégré dans `develop` afin de maintenir la cohérence des branches.

Toute évolution de cette stratégie Git doit faire l'objet d'une décision de gouvernance documentée.

---

# 4. Cycle de publication

Chaque publication suit les étapes suivantes :

1. développement ;
2. tests ;
3. mise à jour de la documentation ;
4. revue fonctionnelle ;
5. validation ;
6. fusion vers les branches stables ;
7. création du tag ;
8. publication.

Aucune version ne doit être publiée sans documentation à jour.

---

# 5. Types de versions

Les versions peuvent être :

- développement ;
- Release Candidate (RC) ;
- version stable ;
- correctif (Hotfix).

Les correctifs ne doivent modifier que les éléments nécessaires à la résolution du problème identifié.

---

# 6. Critères de validation

Avant publication :

- les tests sont réalisés ;
- les documents concernés sont mis à jour ;
- les régressions connues sont analysées ;
- les dépendances sont vérifiées ;
- les anomalies bloquantes sont corrigées ;
- les branches applicatives et documentaires sont synchronisées.

---

# 7. Gestion des versions

Chaque version doit disposer :

- d'un numéro de version ;
- d'un historique des changements ;
- d'un tag Git correspondant ;
- d'une documentation associée.

---

# 8. Compatibilité

Les évolutions doivent préserver la compatibilité autant que possible.

Toute rupture doit être documentée et accompagnée d'une stratégie de migration.

---

# 9. Maintenance

Après publication :

- les anomalies sont suivies ;
- les correctifs sont priorisés ;
- la documentation est maintenue à jour ;
- les évolutions sont planifiées dans la feuille de route.

---

# 10. Critères d'acceptation

Le processus est conforme lorsque :

- chaque version est identifiable ;
- chaque publication possède sa documentation ;
- les tags Git sont cohérents ;
- les tests ont été réalisés ;
- les changements sont traçables ;
- `main` contient uniquement les éléments validés et publiés ;
- `develop` contient les évolutions en préparation.

---

# 11. Historique

| Version | Date | Évolution |
|---------|------|-----------|
| 1.1.1 | 2026-07-19 | Adoption des branches `main` et `develop` pour le dépôt Project Book et formalisation du cycle de publication documentaire |
| 1.1.0 | 2026-07-19 | Normalisation des métadonnées et clarification de la branche documentaire de référence |

---

# 12. Références

- INDEX-001
- ROADMAP-001
- GOV-001
- DECISIONS
- ARCH-001
- CORE-001
- ADMIN-001
- CONFIG-001
- LOG-001
- UX-001
- DOC-001

---

# 13. Conclusion

Le processus défini dans RELEASE-001 garantit des publications maîtrisées, documentées et reproductibles. Il constitue la référence pour toutes les futures versions d'AKS Platform.
