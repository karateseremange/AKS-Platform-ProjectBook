# PB-04 — Périmètre

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | PB-04 |
| **Titre** | Périmètre |
| **Version** | 0.2.0 |
| **Statut** | Review |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-10 |

---

# Objet du document

Ce document définit le périmètre fonctionnel d'AKS Platform.

Il précise les domaines couverts par la plateforme, ceux qui pourront être intégrés ultérieurement et ceux qui ne relèvent pas du projet.

Son objectif est de garantir une compréhension commune du champ d'application de la plateforme et de limiter les dérives fonctionnelles.

---

# Principe général

AKS Platform constitue la plateforme numérique de référence de l'Association Karaté Serémange.

Elle centralise les processus numériques nécessaires au fonctionnement de l'association et fournit un cadre commun pour le développement de nouveaux modules.

Toute nouvelle fonctionnalité doit s'inscrire dans ce périmètre ou faire l'objet d'une décision d'architecture.

---

# Périmètre actuel

La plateforme couvre progressivement les domaines suivants :

## Administration

- Gestion des licenciés
- Gestion des inscriptions
- Gestion des saisons sportives
- Gestion des documents administratifs

## Pédagogie

- Gestion des passages de grades
- Suivi des résultats
- Suivi pédagogique
- Gestion des jurys

## Vie du club

- Gestion des présences
- Gestion des événements
- Gestion des compétitions
- Communication interne

## Pilotage

- Tableaux de bord
- Statistiques
- Rapports
- Indicateurs d'activité

---

# Hors périmètre

Les éléments suivants ne font pas partie du périmètre actuel :

- Comptabilité de l'association
- Gestion bancaire
- Boutique en ligne
- Site Internet public
- Application mobile dédiée
- Gestion des réseaux sociaux
- Outils de visioconférence

Ces domaines pourront être étudiés ultérieurement, mais ne constituent pas un objectif du projet à ce stade.

---

# Évolution du périmètre

Le périmètre d'AKS Platform est amené à évoluer.

Toute extension doit respecter les principes définis dans le Project Book et préserver la cohérence de la plateforme.

L'ajout d'un nouveau domaine fonctionnel ne doit pas remettre en cause l'architecture existante.

---

# Critères d'intégration

Une fonctionnalité peut être intégrée à AKS Platform lorsqu'elle répond aux critères suivants :

- répond à un besoin métier identifié ;
- apporte une valeur mesurable à l'association ;
- s'intègre naturellement dans l'architecture existante ;
- respecte les standards du projet ;
- peut être maintenue dans le temps.

---

# Limites

AKS Platform n'a pas vocation à remplacer l'ensemble des outils numériques utilisés par l'association.

La plateforme privilégie l'intégration avec les services existants lorsque cette approche est plus pertinente que leur remplacement.

Le projet recherche l'efficacité et la cohérence plutôt que la centralisation systématique.

---

# Références

- PB-01 — Vision
- PB-02 — Philosophie
- PB-03 — Objectifs
- PB-05 — Vue d'ensemble
- ADR-0004 — Generic by Design *(à rédiger)*