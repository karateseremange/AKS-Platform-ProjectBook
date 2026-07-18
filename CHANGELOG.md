# Changelog

Toutes les évolutions importantes d'AKS Platform sont documentées dans ce fichier.

Ce document constitue l'historique officiel des versions publiées de la plateforme.

Les versions candidates (Release Candidates) correspondent aux phases de préparation d'une version officielle. Les versions publiées suivent le versionnement sémantique (`vX.Y.Z`).

---

## [1.0.0] - 2026-07-XX

### Première version officielle

Cette version constitue la première publication officielle d'AKS Platform.

Elle marque la stabilisation de l'architecture de la plateforme et la mise en production du premier module métier.

### Ajouts

- Publication officielle d'AKS Platform v1.0.0.
- Mise en place d'AKS Core.
- Intégration du module **Questionnaire Santé**.
- Intégration d'AKS Platform Connector 0.11.0.

### Confidentialité

- Mise en œuvre du principe **Privacy by Design**.
- Aucune conservation des réponses au questionnaire santé.
- Transmission limitée aux seules informations administratives nécessaires au traitement des licences.

### Documentation

- Publication du Project Book v1.
- Publication des guides d'installation, d'administration et d'utilisation.
- Qualification des guides opérationnels (DOC-001).
- Mise à disposition de la documentation officielle de la plateforme.

### Compatibilité validée

| Composant | Version |
|-----------|---------|
| AKS Platform Connector | 0.11.0 |
| WordPress | 7.0.1 |
| PHP | 8.3.23 |
| Google Apps Script | Runtime V8 |

---

## Historique des Release Candidates

Les Release Candidates correspondent aux différentes étapes ayant conduit à la publication de la première version officielle.

| Version | Description |
|----------|-------------|
| RC 0.8.0 | Dernière Release Candidate avant publication de la version 1.0.0. |
| RC 0.7.0 | Stabilisation fonctionnelle et documentaire. |
| RC 0.6.0 | Finalisation des fonctionnalités principales. |
| RC 0.5.0 | Consolidation de l'architecture. |
| RC 0.4.0 | Stabilisation d'AKS Core. |
| RC 0.3.0 | Première Release Candidate publique. |

---

## Politique de versionnement

AKS Platform utilise le versionnement sémantique.

- Les **Release Candidates** sont identifiées par le préfixe `RC`.
- Les **versions officielles** utilisent le format `vX.Y.Z`.

Chaque version officielle fait l'objet :

- d'une documentation mise à jour ;
- d'une validation documentaire ;
- d'une publication Git avec un tag correspondant.

---

## Références

Pour les informations détaillées relatives à chaque version, consulter :

- les notes de version ;
- le Project Book ;
- les guides officiels ;
- les décisions d'architecture (ADR) ;
- les décisions de gouvernance (DG).