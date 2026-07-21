# ARCH-CONSOLIDATION-001 — M3.3

# Matrice finale des responsabilités documentaires

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M3.3 — Matrice finale des responsabilités documentaires |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Analyse documentaire non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-21 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document clôt le jalon M3 — Analyse des responsabilités du chantier `ARCH-CONSOLIDATION-001`.

Il consolide :

- la matrice initiale des responsabilités produite en M3.1 ;
- les chevauchements documentaires identifiés en M3.2 ;
- les règles de résolution retenues pour attribuer une source de référence unique à chaque domaine.

La matrice finale définit, pour chaque domaine documentaire :

- le document responsable ;
- les documents consommateurs ;
- les rappels autorisés ;
- les responsabilités exclues ;
- la résolution du chevauchement observé.

Ce livrable ne réalise encore aucune migration documentaire. Les modifications de contenu, déplacements, fusions ou suppressions relèvent du jalon M4.

---

# 2. Principes de responsabilité retenus

Les principes suivants s'appliquent à l'ensemble du périmètre :

1. une règle transverse possède une source normative unique ;
2. un document consommateur peut rappeler une règle uniquement pour expliquer son application locale ;
3. un rappel ne peut ni modifier, ni compléter de manière autonome, ni contredire la source normative ;
4. les détails propres à un composant restent dans le document responsable de ce composant ;
5. toute consommation d'une politique transverse doit citer explicitement le document responsable ;
6. les doublons normatifs doivent être remplacés par une référence documentaire ;
7. le vocabulaire commun doit être harmonisé entre les documents concernés ;
8. le document de pilotage `ARCH-CONSOLIDATION-001` reste non normatif.

---

# 3. Matrice finale des responsabilités

| Domaine | Document responsable | Documents consommateurs principaux | Rappels autorisés | Responsabilités exclues | Résolution du chevauchement |
|---|---|---|---|---|---|
| Architecture documentaire | ADR-001 | ARCH-CONSOLIDATION-001 et l'ensemble du Project Book | Rappel des familles, statuts et règles de classement | Architecture fonctionnelle ou technique du produit | ADR-001 demeure la source unique pour l'organisation documentaire ; ARCH-CONSOLIDATION-001 ne porte que le pilotage du chantier |
| Architecture fonctionnelle globale | ARCH-001 | CORE-001, ADMIN-001, services transverses et documents de modules métier | Vue synthétique des composants, frontières et relations | Détail interne des services, politiques transverses et règles métier locales | ARCH-001 porte la vision globale ; les autres documents détaillent uniquement leur propre périmètre |
| Socle commun AKS Core | CORE-001 | ADMIN-001 et modules métier | Présentation des services communs réellement consommés | Politique globale de configuration, journalisation, sécurité, audit, erreurs ou UX | CORE-001 décrit les responsabilités internes du noyau et référence les politiques transverses sans les redéfinir |
| Administration | ADMIN-001 | Composants du tableau de bord et fonctions administratives | Application locale des règles de configuration, journalisation, sécurité, audit et UX | Définition autonome de ces politiques transverses | ADMIN-001 reste centré sur les écrans, usages, contrôles et parcours administratifs |
| Paramétrage | CONFIG-001 | CORE-001, ADMIN-001, services transverses et modules métier | Liste des paramètres consommés et contexte d'utilisation | Gouvernance locale concurrente, valeurs dupliquées ou règles d'accès divergentes | CONFIG-001 devient la source unique pour la politique et la gouvernance des paramètres |
| Journalisation | LOG-001 | CORE-001, ADMIN-001, API-001, ERROR-001, NOTIF-001, STORAGE-001 et modules métier | Événements spécifiques à un composant, avec référence au format commun | Définition d'un second modèle de journal, de niveaux ou de structure parallèle | LOG-001 porte la structure, les niveaux et les règles communes de journalisation |
| Audit | AUDIT-001 | ADMIN-001, ERROR-001, NOTIF-001, STORAGE-001, services transverses et modules sensibles | Identification des actions locales devant produire une trace d'audit | Journalisation technique générale ou simple suivi opérationnel | AUDIT-001 définit ce qui constitue une action sensible, une preuve et une trace d'audit |
| Gestion des erreurs | ERROR-001 | API-001, UX-001, services transverses et modules métier | Cas d'erreur spécifiques, contexte métier et règles locales de reprise | Modèles concurrents de codes, statuts, catégories ou structures d'erreur | ERROR-001 porte le modèle d'erreur unique et le cycle transverse de traitement |
| API | API-001 | Services et modules exposant une interface | Application aux contrats d'échange des politiques SECURITY-001, ERROR-001, LOG-001 et AUDIT-001 | Redéfinition de ces politiques générales | API-001 porte les conventions d'interface et la restitution contractuelle, notamment des erreurs |
| Sécurité | SECURITY-001 | Tous les composants, services et modules concernés | Contrôles propres à un contexte local, en citant les principes applicables | Politique de sécurité parallèle dans ADMIN-001, API-001, STORAGE-001 ou DOCUMENT-001 | SECURITY-001 demeure la source unique des exigences de protection, d'accès et de confidentialité |
| Expérience utilisateur | UX-001 | Interfaces publiques, administratives et métier | Déclinaison locale des composants et parcours | Redéfinition du ton, de l'accessibilité ou des principes généraux dans ERROR-001 ou ADMIN-001 | UX-001 définit les principes de présentation ; ERROR-001 décide du traitement, UX-001 de la restitution compréhensible |
| Notifications | NOTIF-001 | Modules métier et fonctions administratives déclenchant un envoi | Motif métier, destinataires et contenu fonctionnel propres au déclencheur | Politique autonome de journalisation, audit, sécurité ou configuration | NOTIF-001 porte le cycle d'envoi et consomme CONFIG-001, LOG-001, SECURITY-001 et AUDIT-001 |
| Documents générés | DOCUMENT-001 | Modules produisant attestations, rapports, exports ou justificatifs | Règles spécifiques au type de document produit | Stratégie générale de stockage ou politique globale de sécurité | DOCUMENT-001 porte l'identité, la génération et le cycle de vie fonctionnel des documents |
| Stockage | STORAGE-001 | Tous les services et modules conservant données, journaux, traces ou documents | Emplacement et mécanisme de stockage propres au composant | Définition du contenu métier, de la preuve d'audit, du modèle de document ou des exigences générales de sécurité | STORAGE-001 porte les emplacements, catégories et mécanismes de conservation ; les durées métier restent définies par les documents responsables |

---

# 4. Résolution des chevauchements prioritaires

## 4.1 ARCH-001 / CORE-001

- `ARCH-001` définit la structure globale, les frontières et les relations entre composants.
- `CORE-001` détaille uniquement les responsabilités internes et services communs d'AKS Core.
- Toute politique transverse consommée par AKS Core doit être référencée vers son document responsable.

**Chevauchement résolu :** la vue globale appartient à ARCH-001 ; le détail du noyau appartient à CORE-001.

## 4.2 CORE-001 / CONFIG-001

- `CONFIG-001` définit la gouvernance, les sources, la portée et les règles d'accès aux paramètres.
- `CORE-001` décrit uniquement comment AKS Core consomme ou expose ces paramètres.

**Chevauchement résolu :** la politique de paramétrage appartient à CONFIG-001 ; l'usage dans le socle appartient à CORE-001.

## 4.3 LOG-001 / AUDIT-001

- `LOG-001` définit les journaux techniques et opérationnels, leur structure et leurs niveaux.
- `AUDIT-001` définit les actions sensibles, la preuve, la consultation et les exigences d'audit.
- Un événement peut être à la fois journalisé et audité, mais chaque finalité reste définie dans son document responsable.

**Chevauchement résolu :** le journal décrit l'événement ; l'audit qualifie et conserve la preuve d'une action sensible.

## 4.4 API-001 / ERROR-001

- `ERROR-001` définit le modèle d'erreur, ses catégories et son cycle de traitement.
- `API-001` définit la traduction de ce modèle dans le contrat d'interface : statut, structure de réponse et exposition contrôlée.

**Chevauchement résolu :** le modèle d'erreur appartient à ERROR-001 ; sa restitution dans une API appartient à API-001.

## 4.5 STORAGE-001 / DOCUMENT-001

- `DOCUMENT-001` définit l'identité, le nommage, la génération et le cycle de vie fonctionnel des documents produits.
- `STORAGE-001` définit leur emplacement, leur mécanisme de conservation et les responsabilités techniques de stockage.

**Chevauchement résolu :** la gestion fonctionnelle du document appartient à DOCUMENT-001 ; son stockage appartient à STORAGE-001.

## 4.6 STORAGE-001 / SECURITY-001

- `STORAGE-001` décrit où et comment les données et documents sont conservés.
- `SECURITY-001` définit les exigences de confidentialité, d'autorisation, d'intégrité et de protection applicables.

**Chevauchement résolu :** la stratégie de stockage appartient à STORAGE-001 ; les exigences de sécurité appartiennent à SECURITY-001.

---

# 5. Règles de rappel documentaire

Un rappel dans un document consommateur est autorisé uniquement lorsqu'il respecte les conditions suivantes :

- il est nécessaire à la compréhension du périmètre local ;
- il cite explicitement le document responsable ;
- il ne reproduit pas une politique complète ;
- il ne contient pas de valeur, durée, niveau, rôle ou règle différente ;
- il indique clairement qu'il s'agit d'une application locale ;
- il est supprimé ou corrigé si la source normative évolue.

Un rappel qui ne respecte pas ces conditions devient un candidat à migration au jalon M4.

---

# 6. Responsabilités exclues par document

| Document | Ne doit pas devenir la source de référence pour |
|---|---|
| ADR-001 | Architecture fonctionnelle, services techniques ou règles métier |
| ARCH-001 | Détail interne des services transverses et des modules |
| CORE-001 | Politiques de configuration, journalisation, audit, sécurité, erreurs ou UX |
| ADMIN-001 | Politiques transverses consommées par l'administration |
| CONFIG-001 | Interfaces administratives détaillées ou règles métier des modules |
| LOG-001 | Preuve d'audit, logique métier ou stratégie générale de stockage |
| UX-001 | Modèle d'erreur, règles de sécurité ou logique métier |
| API-001 | Politiques générales de sécurité, erreurs, audit ou journalisation |
| SECURITY-001 | Organisation fonctionnelle des écrans, documents ou stockages |
| AUDIT-001 | Ensemble des journaux techniques et opérationnels |
| ERROR-001 | Conventions complètes d'API ou principes généraux d'UX |
| NOTIF-001 | Règles métier déclenchant les notifications |
| DOCUMENT-001 | Stratégie générale de stockage et exigences générales de sécurité |
| STORAGE-001 | Contenu métier, modèle documentaire, règles d'audit ou exigences générales de sécurité |
| ARCH-CONSOLIDATION-001 | Toute norme produit ou règle d'architecture permanente |

---

# 7. Résultat du jalon M3

La matrice finale attribue une source de référence unique à chaque domaine et résout les principaux chevauchements identifiés au sous-jalon M3.2.

Le jalon **M3 — Analyse des responsabilités** est produit.

Les résultats de M3 permettent d'ouvrir le jalon suivant :

**M4 — Plan des migrations documentaires.**

Le premier sous-jalon attendu est :

**M4.1 — Registre des candidats à migration.**

Ce registre devra identifier précisément les contenus à conserver, déplacer, remplacer par une référence, harmoniser ou supprimer, sans exécuter encore les migrations.