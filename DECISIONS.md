# DECISIONS
# Registre des décisions d'architecture et de gouvernance

| Propriété | Valeur |
|-----------|--------|
| Document ID | DECISIONS |
| Titre | Registre des décisions d'architecture et de gouvernance |
| Version | 1.1.1 |
| Statut | Actif |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-19 |
| Version du produit | V1.1 |

---

# Objet

Ce document conserve l'historique des décisions structurantes prises pour AKS Platform.

Il constitue un registre des décisions d'architecture et de gouvernance afin d'expliquer **ce qui a été décidé, pourquoi et quelles en sont les conséquences**.

Les décisions validées ne doivent être remises en cause qu'en présence d'un nouvel élément technique, fonctionnel ou réglementaire.

---

# Format d'une décision

Chaque décision utilise le modèle suivant :

- Identifiant
- Date
- Statut
- Contexte
- Décision
- Justification
- Conséquences

---

# DEC-001

**Date** : 2026-07-18

**Statut** : Validée

## Contexte

AKS Platform v1.0.0 est publiée. Une phase de consolidation est nécessaire avant l'ajout de nouveaux modules métier.

## Décision

Créer une version V1.1 dédiée à la consolidation de la plateforme.

## Justification

Stabiliser l'architecture, la gouvernance, la documentation et les services communs avant d'étendre le périmètre fonctionnel.

## Conséquences

- création d'un socle documentaire transverse ;
- préparation des futurs modules ;
- réduction de la dette documentaire.

---

# DEC-002

**Date** : 2026-07-18

**Statut** : Validée

## Contexte

La documentation historique était organisée sous la forme de documents `PB-*`.

## Décision

Adopter une nomenclature fonctionnelle (`ARCH-001`, `CORE-001`, etc.) et une organisation par domaines.

## Justification

Améliorer la lisibilité, la maintenance et l'évolutivité du Project Book.

## Conséquences

Migration progressive des anciens documents `PB-*` vers la nouvelle structure.

---

# DEC-003

**Date** : 2026-07-18

**Statut** : Validée

## Contexte

Le premier développement après la V1.1 devait être identifié.

## Décision

Développer le module **AKS Analytics** avant **AKS Calendar**.

## Justification

Le besoin métier lié aux statistiques est prioritaire.

## Conséquences

Les services communs sont conçus pour être réutilisés par AKS Analytics dès la fin de la V1.1.

---

# DEC-004

**Date** : 2026-07-18

**Statut** : Validée

## Contexte

Une solution de calendrier partagé devait être retenue.

## Décision

S'appuyer dans un premier temps sur Google Calendar plutôt que développer un calendrier interne.

## Justification

Répondre rapidement à la majorité des besoins avec un effort de développement limité.

## Conséquences

Le futur module AKS Calendar sera une couche d'intégration avant d'envisager un développement spécifique.

---

# DEC-005

**Date** : 2026-07-19

**Statut** : Validée

## Contexte

Le dépôt Project Book utilisait historiquement une branche stable `master` sans branche documentaire dédiée aux évolutions en préparation. Le dépôt applicatif utilise déjà les branches `main` et `develop`.

## Décision

Renommer la branche stable du dépôt `AKS-Platform-ProjectBook` en `main` et créer une branche `develop` dédiée aux évolutions documentaires.

La branche `main` contient la documentation officielle validée et publiée. La branche `develop` contient les évolutions documentaires en préparation.

## Justification

- harmoniser la gouvernance Git entre les dépôts applicatif et documentaire ;
- protéger la documentation officielle contre les modifications non validées ;
- permettre la préparation d'une future version sans modifier la référence stable ;
- simplifier les procédures de fusion, de publication et de maintenance.

## Conséquences

- les évolutions documentaires courantes sont réalisées sur `develop` ;
- les publications documentaires nécessitent une validation, une fusion vers `main` et la création d'un tag ;
- les correctifs urgents appliqués exceptionnellement sur `main` doivent être réintégrés dans `develop` ;
- les documents faisant référence à `master` doivent être mis à jour ;
- les deux dépôts AKS Platform utilisent désormais la convention `develop` / `main`.

---

# Règles de gestion

- Les décisions sont numérotées chronologiquement.
- Une décision validée n'est pas modifiée ; une nouvelle décision vient la compléter ou la remplacer.
- Les décisions obsolètes restent dans l'historique avec leur statut mis à jour.
- Les décisions doivent être référencées dans les documents concernés lorsque cela est pertinent.

---

# Historique

| Version | Date | Évolution |
|---------|------|-----------|
| 1.1.1 | 2026-07-19 | Ajout de DEC-005 relative à la stratégie de branches du Project Book |
| 1.1.0 | 2026-07-19 | Normalisation des métadonnées du registre sans modification des décisions validées |

---

# Références

- INDEX-001
- GOV-001
- ROADMAP-001
- ARCH-001
- DOC-001
- RELEASE-001

---

# Conclusion

Ce registre constitue la mémoire décisionnelle d'AKS Platform et complète le Project Book en documentant les choix structurants du projet.
