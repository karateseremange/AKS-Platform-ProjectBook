# ARCH-CONSOLIDATION-001 — M3.2

# Identification des chevauchements documentaires

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M3.2 — Identification des chevauchements documentaires |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Analyse documentaire non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-21 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document identifie les zones de recouvrement entre les responsabilités documentaires définies dans le sous-jalon M3.1.

Un chevauchement désigne une situation dans laquelle plusieurs documents traitent d'un même sujet, d'une même règle ou d'un même mécanisme avec un niveau de détail susceptible de créer une ambiguïté sur la source de référence.

Le présent livrable ne décide d'aucune fusion, suppression, migration ou réécriture. Il qualifie les recouvrements afin de préparer la matrice finale des responsabilités du sous-jalon M3.3.

---

# 2. Niveaux de chevauchement

| Niveau | Définition |
|---|---|
| **Faible** | Mention de contexte ou rappel nécessaire, sans ambiguïté significative sur la source de référence. |
| **Modéré** | Sujet traité dans plusieurs documents avec un risque de répétition, d'écart futur ou de frontière insuffisamment explicite. |
| **Fort** | Responsabilités ou règles décrites dans plusieurs documents de manière potentiellement normative, avec risque d'incohérence ou de contradiction. |

---

# 3. Matrice des chevauchements identifiés

| Domaine partagé | Documents concernés | Niveau | Nature du chevauchement | Source de référence pressentie | Point à clarifier en M3.3 |
|---|---|---|---|---|---|
| Architecture fonctionnelle et socle commun | ARCH-001, CORE-001 | Fort | ARCH-001 décrit les composants et frontières de la plateforme tandis que CORE-001 décrit le socle commun ; certaines responsabilités centrales peuvent être présentées dans les deux documents. | ARCH-001 pour l'architecture globale ; CORE-001 pour les services internes du socle | Définir précisément la frontière entre vue d'ensemble et responsabilités détaillées d'AKS Core |
| Administration et services transverses | ADMIN-001, CONFIG-001, LOG-001, SECURITY-001, AUDIT-001, UX-001 | Modéré | ADMIN-001 consomme et peut rappeler les règles de plusieurs services transverses nécessaires au tableau de bord. | Chaque document transverse pour sa politique ; ADMIN-001 pour leur application dans l'interface d'administration | Limiter ADMIN-001 aux comportements et usages sans redéfinir les politiques transverses |
| Paramétrage du socle | CORE-001, CONFIG-001 | Fort | CORE-001 peut décrire les mécanismes de configuration du noyau tandis que CONFIG-001 définit la politique générale de paramétrage. | CONFIG-001 pour la politique ; CORE-001 pour l'implémentation ou la consommation dans le socle | Séparer les règles de gouvernance des paramètres des responsabilités techniques du noyau |
| Journalisation et audit | LOG-001, AUDIT-001 | Fort | Les deux documents traitent de traces, d'événements, de conservation et d'exploitation. | LOG-001 pour les journaux techniques et opérationnels ; AUDIT-001 pour les preuves et actions sensibles | Formaliser la distinction entre journal, trace d'audit et preuve exploitable |
| Journalisation des erreurs | LOG-001, ERROR-001 | Modéré | ERROR-001 définit la traçabilité des erreurs et LOG-001 définit la structure et les niveaux des journaux. | ERROR-001 pour le cycle de traitement de l'erreur ; LOG-001 pour son inscription dans les journaux | Éviter la duplication des structures de journal et des niveaux de sévérité |
| Audit des erreurs sensibles | ERROR-001, AUDIT-001 | Modéré | Certaines erreurs peuvent constituer des événements auditables ou déclencher une preuve de sécurité. | ERROR-001 pour l'erreur ; AUDIT-001 pour l'action sensible ou la preuve associée | Définir les critères qui transforment une erreur en événement d'audit |
| Sécurité et administration | SECURITY-001, ADMIN-001 | Modéré | ADMIN-001 décrit des fonctions protégées et peut reprendre des règles d'accès ou d'autorisation. | SECURITY-001 pour les principes de contrôle ; ADMIN-001 pour les restrictions propres aux fonctions administratives | Définir les responsabilités respectives sur les rôles, permissions et contrôles d'accès |
| Sécurité et API | SECURITY-001, API-001 | Modéré | API-001 traite de l'authentification, de l'autorisation et de la protection des échanges. | SECURITY-001 pour les principes ; API-001 pour leur application aux interfaces | Distinguer règle générale de sécurité et convention spécifique aux API |
| Gestion des erreurs des API | ERROR-001, API-001 | Fort | API-001 définit les réponses d'erreur exposées et ERROR-001 définit la typologie et le traitement transverse. | ERROR-001 pour le modèle d'erreur ; API-001 pour le contrat de restitution | Définir un modèle unique et empêcher la divergence des codes, statuts et messages |
| UX des erreurs | UX-001, ERROR-001 | Modéré | ERROR-001 traite de la restitution à l'utilisateur et UX-001 définit les principes d'affichage et de compréhension. | ERROR-001 pour la décision de traitement ; UX-001 pour la présentation | Clarifier qui définit les messages, leur ton, leur structure et leur accessibilité |
| Notifications et journalisation | NOTIF-001, LOG-001 | Modéré | NOTIF-001 traite de la traçabilité des envois tandis que LOG-001 définit la politique générale des journaux. | NOTIF-001 pour le cycle d'envoi ; LOG-001 pour la structure des événements journalisés | Définir les événements de notification à journaliser et éviter une politique parallèle |
| Notifications et audit | NOTIF-001, AUDIT-001 | Modéré | Certaines notifications peuvent constituer une preuve ou une action sensible. | NOTIF-001 pour l'envoi ; AUDIT-001 pour la preuve ou la traçabilité réglementaire | Définir quels envois relèvent de l'audit et quelles données doivent être conservées |
| Notifications et configuration | NOTIF-001, CONFIG-001 | Modéré | Les canaux, modèles, expéditeurs et paramètres d'envoi peuvent être décrits dans les deux documents. | CONFIG-001 pour les paramètres ; NOTIF-001 pour leur usage fonctionnel | Identifier une source unique pour chaque paramètre de notification |
| Stockage et sécurité | STORAGE-001, SECURITY-001 | Fort | Les deux documents traitent d'accès, de protection, de confidentialité et de conservation. | STORAGE-001 pour l'organisation et les emplacements ; SECURITY-001 pour les exigences de protection | Séparer les choix de stockage des contrôles de sécurité applicables |
| Stockage et audit | STORAGE-001, AUDIT-001 | Modéré | La conservation des traces d'audit et leur emplacement peuvent être décrits dans les deux documents. | AUDIT-001 pour les exigences de preuve ; STORAGE-001 pour la stratégie d'hébergement et de conservation | Distinguer exigence fonctionnelle de conservation et solution de stockage |
| Stockage et journalisation | STORAGE-001, LOG-001 | Modéré | LOG-001 peut définir la rétention et l'exploitation des journaux tandis que STORAGE-001 définit les emplacements et catégories de stockage. | LOG-001 pour le cycle de vie des journaux ; STORAGE-001 pour leur support de stockage | Définir une seule source pour les durées et responsabilités de conservation |
| Documents générés et stockage | DOCUMENT-001, STORAGE-001 | Fort | DOCUMENT-001 traite du cycle de vie des documents générés et STORAGE-001 de leur conservation et emplacement. | DOCUMENT-001 pour l'identité et le cycle de vie ; STORAGE-001 pour l'emplacement et les règles de stockage | Définir clairement les responsabilités sur nommage, archivage, suppression et accès |
| Documents générés et sécurité | DOCUMENT-001, SECURITY-001 | Modéré | Les documents produits peuvent contenir des données sensibles et nécessiter des contrôles d'accès. | DOCUMENT-001 pour les règles propres aux documents ; SECURITY-001 pour les contrôles généraux | Éviter la duplication des règles de confidentialité et d'autorisation |
| Erreurs de génération documentaire | DOCUMENT-001, ERROR-001 | Faible | DOCUMENT-001 peut décrire les échecs de génération et ERROR-001 le traitement transverse. | ERROR-001 pour la gestion de l'erreur ; DOCUMENT-001 pour le contexte métier de génération | Maintenir uniquement les cas spécifiques dans DOCUMENT-001 |
| Architecture documentaire et chantier de consolidation | ADR-001, ARCH-CONSOLIDATION-001 | Faible | Le document de pilotage analyse une famille organisée selon ADR-001. | ADR-001 pour les règles documentaires ; ARCH-CONSOLIDATION-001 pour le suivi du chantier | Maintenir le caractère non normatif du document de pilotage |

---

# 4. Zones de vigilance prioritaires

Les chevauchements les plus structurants pour la suite du chantier sont :

1. **ARCH-001 / CORE-001** — séparation entre architecture globale et responsabilités internes du socle ;
2. **CORE-001 / CONFIG-001** — séparation entre consommation technique et politique de paramétrage ;
3. **LOG-001 / AUDIT-001** — distinction entre journalisation et preuve d'audit ;
4. **API-001 / ERROR-001** — modèle d'erreur unique et contrat de restitution ;
5. **STORAGE-001 / DOCUMENT-001** — répartition du cycle de vie des documents générés ;
6. **STORAGE-001 / SECURITY-001** — distinction entre stratégie de stockage et exigences de protection.

Ces zones doivent être résolues dans la matrice finale des responsabilités avant toute décision de migration documentaire.

---

# 5. Règles de résolution proposées pour M3.3

Sans décider encore des migrations, l'analyse fait apparaître les principes de résolution suivants :

- une règle transverse doit avoir une source normative unique ;
- un document consommateur peut rappeler une règle uniquement pour expliquer son application locale ;
- un rappel ne doit pas introduire de variante, de valeur différente ou de définition autonome ;
- les détails d'implémentation doivent rester dans le document responsable du composant concerné ;
- les documents de référence doivent être cités explicitement lorsqu'une politique est consommée ;
- les notions communes doivent utiliser un vocabulaire harmonisé.

---

# 6. Résultat du sous-jalon M3.2

Les principaux chevauchements documentaires du périmètre ont été identifiés, qualifiés et associés à une source de référence pressentie.

Le sous-jalon suivant est :

**M3.3 — Matrice finale des responsabilités documentaires.**

Cette matrice devra confirmer pour chaque domaine :

- le document responsable ;
- les documents consommateurs ;
- les rappels autorisés ;
- les responsabilités exclues ;
- les chevauchements résolus.

Aucune migration documentaire n'est décidée dans le présent livrable.