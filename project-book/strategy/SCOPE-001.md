# SCOPE-001

# Périmètre fonctionnel d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| Document ID | SCOPE-001 |
| Titre | Périmètre fonctionnel d'AKS Platform |
| Version | 1.1.0 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-19 |
| Version du produit | V1.1 |

---

# 1. Objet

Ce document définit le périmètre fonctionnel d'AKS Platform.

Il précise les domaines couverts par la plateforme, ceux qui pourront être intégrés ultérieurement et ceux qui ne relèvent pas du projet.

Son objectif est de garantir une compréhension commune du champ d'application de la plateforme et de limiter les dérives fonctionnelles.

---

# 2. Principe général

AKS Platform constitue la plateforme numérique de référence de l'Association Karaté Serémange.

Elle centralise les processus numériques nécessaires au fonctionnement de l'association et fournit un cadre commun pour le développement de nouveaux modules.

Toute nouvelle fonctionnalité doit s'inscrire dans ce périmètre ou faire l'objet d'une décision de gouvernance et, si nécessaire, d'une décision d'architecture.

---

# 3. Périmètre fonctionnel

La plateforme couvre progressivement les domaines suivants.

## 3.1. Administration

- gestion des licenciés ;
- gestion des inscriptions ;
- gestion des saisons sportives ;
- gestion des documents administratifs.

## 3.2. Pédagogie

- gestion des passages de grades ;
- suivi des résultats ;
- suivi pédagogique ;
- gestion des jurys.

## 3.3. Vie du club

- gestion des présences ;
- gestion des événements ;
- gestion des compétitions ;
- communication interne.

## 3.4. Pilotage

- tableaux de bord ;
- statistiques ;
- rapports ;
- indicateurs d'activité.

L'inclusion d'un domaine dans ce périmètre ne signifie pas qu'il est déjà livré. L'ordre de réalisation est défini par `ROADMAP-001` et chaque module doit disposer de sa propre documentation avant son développement.

---

# 4. Hors périmètre actuel

Les éléments suivants ne font pas partie du périmètre actuel :

- comptabilité de l'association ;
- gestion bancaire ;
- boutique en ligne ;
- site Internet public ;
- application mobile dédiée ;
- gestion directe des réseaux sociaux ;
- outils de visioconférence.

Ces domaines pourront être étudiés ultérieurement, mais ne constituent pas un objectif du projet à ce stade.

---

# 5. Éléments différés

Les fonctionnalités appartenant au périmètre général mais non engagées dans la version active sont considérées comme différées.

Elles ne doivent pas être présentées comme disponibles tant qu'elles ne figurent pas dans une version engagée de `ROADMAP-001` et qu'elles ne disposent pas d'un document de référence validé.

---

# 6. Évolution du périmètre

Le périmètre d'AKS Platform est amené à évoluer.

Toute extension doit respecter les principes définis dans le Project Book et préserver la cohérence de la plateforme.

L'ajout d'un nouveau domaine fonctionnel ne doit pas remettre en cause l'architecture existante sans décision explicite.

---

# 7. Critères d'intégration

Une fonctionnalité peut être intégrée à AKS Platform lorsqu'elle :

- répond à un besoin métier identifié ;
- apporte une valeur mesurable à l'association ;
- contribue aux objectifs définis dans `OBJECTIVES-001` ;
- s'intègre naturellement dans l'architecture existante ;
- respecte les standards du projet ;
- peut être maintenue dans le temps.

---

# 8. Limites

AKS Platform n'a pas vocation à remplacer l'ensemble des outils numériques utilisés par l'association.

La plateforme privilégie l'intégration avec les services existants lorsque cette approche est plus pertinente que leur remplacement.

Le projet recherche l'efficacité et la cohérence plutôt que la centralisation systématique.

L'environnement Proxmox personnel de l'utilisateur ne fait pas partie de l'infrastructure ni du périmètre d'AKS Platform.

---

# 9. Dépendances

Ce document dépend de :

- `VISION-001` ;
- `OBJECTIVES-001`.

Il encadre notamment :

- `ROADMAP-001` ;
- `ARCH-001` ;
- les documents des modules métier.

---

# 10. Exclusions documentaires

Ce document ne définit pas :

- les priorités et dates de réalisation, traitées dans `ROADMAP-001` ;
- les responsabilités de décision, traitées dans `GOV-001` ;
- l'architecture fonctionnelle, traitée dans `ARCH-001` ;
- les spécifications détaillées des modules métier.

---

# 11. Critères d'acceptation

Le document est conforme lorsque :

- les domaines inclus, exclus et différés sont explicitement distingués ;
- le périmètre contribue aux objectifs de `OBJECTIVES-001` ;
- la roadmap n'engage aucun domaine explicitement hors périmètre sans décision préalable ;
- chaque nouveau module peut être rattaché à un domaine fonctionnel identifié ;
- aucune fonctionnalité différée n'est présentée comme livrée.

---

# 12. Historique

| Version | Date | Évolution |
|---------|------|-----------|
| 1.1.0 | 2026-07-19 | Normalisation et validation du périmètre fonctionnel pour la V1.1 |
| 0.2.0 | 2026-07-18 | Version historique en revue |

---

# 13. Références

- `VISION-001` — Vision d'AKS Platform
- `OBJECTIVES-001` — Objectifs stratégiques
- `ROADMAP-001` — Feuille de route officielle
- `GOV-001` — Gouvernance produit
- `ARCH-001` — Architecture fonctionnelle
- `INDEX-001` — Catalogue du Project Book
