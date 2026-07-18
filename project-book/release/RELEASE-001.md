# RELEASE-001
# Processus de publication d'AKS Platform

Version : 1.0
Statut : Validé
Version du produit : V1.1

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
- `main` : production.

## Dépôt Project Book

La branche actuelle constitue la branche de référence tant qu'aucune évolution de stratégie Git n'est décidée.

---

# 4. Cycle de publication

Chaque publication suit les étapes suivantes :

1. développement ;
2. tests ;
3. mise à jour de la documentation ;
4. revue fonctionnelle ;
5. validation ;
6. création du tag ;
7. publication.

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
- les anomalies bloquantes sont corrigées.

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
- les changements sont traçables.

---

# 11. Références

- ROADMAP-001
- ARCH-001
- CORE-001
- ADMIN-001
- CONFIG-001
- LOG-001
- UX-001
- DOC-001

---

# 12. Conclusion

Le processus défini dans RELEASE-001 garantit des publications maîtrisées, documentées et reproductibles. Il constitue la référence pour toutes les futures versions d'AKS Platform.
