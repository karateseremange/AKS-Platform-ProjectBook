# ARCH-CONSOLIDATION-001 — M4.1

# Registre des candidats à migration documentaire

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M4.1 — Registre des candidats à migration documentaire |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Planification documentaire non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-22 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document ouvre le jalon M4 — Plan des migrations documentaires du chantier `ARCH-CONSOLIDATION-001`.

Il transforme les responsabilités finales définies en M3.3 en un registre opérationnel des contenus à examiner et à migrer.

Le registre identifie les actions nécessaires pour :

- conserver les contenus déjà placés dans le bon document ;
- déplacer les contenus relevant d'un autre document responsable ;
- remplacer les doublons normatifs par une référence explicite ;
- harmoniser le vocabulaire et les notions communes ;
- supprimer les contenus devenus redondants ou contradictoires ;
- préserver les rappels locaux nécessaires à la compréhension d'un composant.

Ce livrable ne modifie encore aucun document de référence. L'ordre d'exécution, les dépendances et les critères de validation seront définis en M4.2.

---

# 2. Types d'action

| Action | Définition |
|---|---|
| **Conserver** | Maintenir le contenu dans son document actuel, car il relève bien de sa responsabilité. |
| **Déplacer** | Transférer le contenu vers le document responsable du domaine concerné. |
| **Remplacer par une référence** | Retirer une définition dupliquée et la remplacer par une citation explicite du document responsable. |
| **Harmoniser** | Aligner le vocabulaire, les concepts, les niveaux, les rôles ou les formulations sans changer la responsabilité documentaire. |
| **Scinder** | Séparer un contenu mixte entre plusieurs documents responsables. |
| **Supprimer** | Retirer un contenu redondant, obsolète ou contradictoire qui n'apporte aucune information locale utile. |
| **Clarifier** | Reformuler une frontière de responsabilité ou un rappel local afin d'éviter toute interprétation normative. |

---

# 3. Niveaux de priorité

| Priorité | Définition |
|---|---|
| **P1 — Critique** | Risque fort de contradiction, de double source normative ou de mauvaise implémentation. |
| **P2 — Haute** | Chevauchement significatif susceptible de provoquer une divergence lors d'une évolution. |
| **P3 — Normale** | Amélioration nécessaire de cohérence, de vocabulaire ou de traçabilité documentaire. |
| **P4 — Faible** | Nettoyage éditorial ou clarification sans impact direct sur l'architecture ou l'implémentation. |

---

# 4. Registre des candidats à migration

| ID | Documents concernés | Domaine | Constat | Action cible | Document responsable ou destination | Priorité | Impact estimé | Critère de validation | Statut |
|---|---|---|---|---|---|---|---|---|---|
| MIG-001 | ARCH-001 / CORE-001 | Architecture fonctionnelle et socle commun | Les responsabilités globales de la plateforme et les responsabilités internes d'AKS Core peuvent être décrites dans les deux documents. | Scinder et clarifier | ARCH-001 pour la vue globale ; CORE-001 pour le détail du noyau | P1 | Fort | ARCH-001 ne décrit plus les mécanismes internes du noyau et CORE-001 référence explicitement ARCH-001 pour les frontières globales | À faire |
| MIG-002 | CORE-001 / CONFIG-001 | Paramétrage | CORE-001 peut contenir des règles générales sur les paramètres, leurs sources ou leur gouvernance. | Déplacer ou remplacer par une référence | CONFIG-001 | P1 | Fort | Toute règle générale de paramétrage possède une source unique dans CONFIG-001 ; CORE-001 ne conserve que l'usage local | À faire |
| MIG-003 | LOG-001 / AUDIT-001 | Journalisation et audit | Les notions d'événement, trace, preuve, consultation et conservation peuvent être mélangées. | Scinder, harmoniser et référencer | LOG-001 pour les journaux ; AUDIT-001 pour les actions sensibles et preuves | P1 | Fort | Chaque notion est définie une seule fois et les événements communs citent les deux finalités sans les confondre | À faire |
| MIG-004 | ERROR-001 / API-001 | Modèle et restitution des erreurs | Les codes, catégories, structures et statuts d'erreur peuvent être définis en parallèle. | Déplacer et remplacer par une référence | ERROR-001 pour le modèle ; API-001 pour la restitution contractuelle | P1 | Fort | Un modèle d'erreur unique est défini dans ERROR-001 et API-001 ne conserve que sa traduction dans les contrats d'interface | À faire |
| MIG-005 | STORAGE-001 / DOCUMENT-001 | Cycle de vie des documents générés | Le nommage, l'archivage, la conservation, l'accès et la suppression peuvent être répartis de façon ambiguë. | Scinder et clarifier | DOCUMENT-001 pour le cycle fonctionnel ; STORAGE-001 pour le stockage | P1 | Fort | Les règles fonctionnelles et techniques sont séparées et chaque document référence l'autre lorsqu'une dépendance existe | À faire |
| MIG-006 | STORAGE-001 / SECURITY-001 | Protection des données stockées | STORAGE-001 peut redéfinir des règles de confidentialité, d'autorisation ou d'intégrité. | Remplacer par une référence et conserver les contraintes locales | SECURITY-001 | P1 | Fort | SECURITY-001 porte les exigences générales ; STORAGE-001 décrit uniquement leur application aux mécanismes de stockage | À faire |
| MIG-007 | ADMIN-001 / CONFIG-001 | Paramétrage administratif | ADMIN-001 peut reprendre les règles de gouvernance, de validation ou d'accès aux paramètres. | Remplacer par une référence | CONFIG-001 | P2 | Moyen | ADMIN-001 décrit les écrans et actions d'administration sans créer une politique parallèle de paramétrage | À faire |
| MIG-008 | ADMIN-001 / SECURITY-001 | Accès administratifs | Les rôles, permissions et contrôles d'accès peuvent être définis dans les deux documents. | Scinder et référencer | SECURITY-001 pour les principes ; ADMIN-001 pour les restrictions fonctionnelles locales | P2 | Moyen | Les principes de contrôle sont uniques dans SECURITY-001 et ADMIN-001 ne décrit que leur application aux fonctions administratives | À faire |
| MIG-009 | ADMIN-001 / LOG-001 / AUDIT-001 | Traçabilité des actions d'administration | Les événements journalisés et les actions auditables du tableau de bord peuvent être décrits de manière redondante. | Harmoniser et référencer | LOG-001 et AUDIT-001 | P2 | Moyen | ADMIN-001 liste les actions locales concernées et renvoie aux modèles communs de journal et d'audit | À faire |
| MIG-010 | ADMIN-001 / UX-001 | Expérience utilisateur du tableau de bord | ADMIN-001 peut redéfinir des principes généraux de présentation, d'accessibilité ou de feedback. | Remplacer par une référence et conserver les parcours locaux | UX-001 | P3 | Moyen | ADMIN-001 décrit les écrans et parcours ; UX-001 reste la source des principes généraux | À faire |
| MIG-011 | ERROR-001 / LOG-001 | Journalisation des erreurs | ERROR-001 peut dupliquer les niveaux, structures ou formats de journalisation. | Remplacer par une référence | LOG-001 | P2 | Moyen | ERROR-001 décrit quand et pourquoi journaliser une erreur, tandis que LOG-001 définit comment l'événement est structuré | À faire |
| MIG-012 | ERROR-001 / AUDIT-001 | Erreurs sensibles | Les critères transformant une erreur en événement d'audit peuvent être implicites ou dupliqués. | Clarifier et référencer | AUDIT-001 | P2 | Moyen | Les conditions d'audit sont définies dans AUDIT-001 et ERROR-001 indique uniquement les cas locaux concernés | À faire |
| MIG-013 | ERROR-001 / UX-001 | Restitution des erreurs | Le ton, la structure et l'accessibilité des messages peuvent être définis dans ERROR-001. | Scinder et référencer | ERROR-001 pour le traitement ; UX-001 pour la présentation | P2 | Moyen | ERROR-001 décide du type de restitution et UX-001 définit les règles de présentation compréhensible | À faire |
| MIG-014 | API-001 / SECURITY-001 | Sécurité des interfaces | API-001 peut redéfinir les principes d'authentification, d'autorisation et de protection des échanges. | Remplacer par une référence et conserver les conventions API | SECURITY-001 | P2 | Moyen | API-001 applique les principes de SECURITY-001 sans créer de politique générale concurrente | À faire |
| MIG-015 | API-001 / LOG-001 / AUDIT-001 | Traçabilité des appels API | Les règles de journalisation et d'audit des appels peuvent être décrites directement dans API-001. | Harmoniser et référencer | LOG-001 et AUDIT-001 | P3 | Moyen | API-001 identifie les événements propres aux interfaces et consomme les modèles transverses | À faire |
| MIG-016 | NOTIF-001 / CONFIG-001 | Paramètres de notification | Les canaux, modèles, expéditeurs, destinataires techniques ou options d'envoi peuvent être définis dans les deux documents. | Déplacer ou remplacer par une référence | CONFIG-001 pour les paramètres ; NOTIF-001 pour leur usage | P2 | Moyen | Chaque paramètre possède une source unique et NOTIF-001 décrit uniquement son usage fonctionnel | À faire |
| MIG-017 | NOTIF-001 / LOG-001 | Journalisation des notifications | NOTIF-001 peut définir une structure de journal autonome pour les envois. | Remplacer par une référence | LOG-001 | P2 | Moyen | NOTIF-001 définit les événements métier du cycle d'envoi et LOG-001 leur format commun | À faire |
| MIG-018 | NOTIF-001 / AUDIT-001 | Notifications probantes ou sensibles | Les notifications pouvant servir de preuve ne sont pas toujours distinguées des simples envois opérationnels. | Clarifier et référencer | AUDIT-001 | P2 | Moyen | Les critères de preuve sont définis dans AUDIT-001 et NOTIF-001 identifie les envois concernés | À faire |
| MIG-019 | NOTIF-001 / SECURITY-001 | Données et destinataires des notifications | NOTIF-001 peut redéfinir des règles générales de confidentialité ou de protection des données. | Remplacer par une référence et conserver les contraintes d'envoi | SECURITY-001 | P3 | Moyen | Les exigences générales restent dans SECURITY-001 ; NOTIF-001 décrit leur application aux canaux et contenus | À faire |
| MIG-020 | STORAGE-001 / LOG-001 | Conservation des journaux | Les durées, emplacements et responsabilités de conservation peuvent être définis dans les deux documents. | Scinder et harmoniser | LOG-001 pour le cycle de vie métier des journaux ; STORAGE-001 pour le support | P2 | Moyen | Une seule durée de référence est définie et l'emplacement technique est documenté séparément | À faire |
| MIG-021 | STORAGE-001 / AUDIT-001 | Conservation des traces d'audit | Les exigences de preuve et les mécanismes de stockage peuvent être confondus. | Scinder et référencer | AUDIT-001 pour l'exigence ; STORAGE-001 pour le mécanisme | P2 | Moyen | AUDIT-001 définit la nécessité et la durée fonctionnelle ; STORAGE-001 décrit le stockage correspondant | À faire |
| MIG-022 | DOCUMENT-001 / SECURITY-001 | Protection des documents générés | DOCUMENT-001 peut reprendre des règles générales de confidentialité, d'accès ou de diffusion. | Remplacer par une référence et conserver les contraintes propres au document | SECURITY-001 | P3 | Moyen | Les règles générales sont uniques dans SECURITY-001 et DOCUMENT-001 ne conserve que les classifications et contraintes spécifiques | À faire |
| MIG-023 | DOCUMENT-001 / ERROR-001 | Échecs de génération documentaire | DOCUMENT-001 peut définir un traitement d'erreur parallèle. | Remplacer par une référence et conserver les cas spécifiques | ERROR-001 | P3 | Faible | Les erreurs de génération utilisent le modèle commun et DOCUMENT-001 ne documente que le contexte et les règles locales de reprise | À faire |
| MIG-024 | ADR-001 / ARCH-CONSOLIDATION-001 | Architecture documentaire et pilotage | Le document de consolidation pourrait être interprété comme une source permanente de règles documentaires. | Clarifier | ADR-001 | P4 | Faible | ARCH-CONSOLIDATION-001 reste explicitement non normatif et toutes les règles permanentes sont portées par ADR-001 | À faire |
| MIG-025 | Ensemble du périmètre | Vocabulaire commun | Les termes journal, trace, preuve, paramètre, configuration, document, stockage, erreur et notification peuvent varier selon les documents. | Harmoniser | Glossaire ou document responsable de chaque notion | P2 | Moyen | Chaque terme structurant possède une définition unique et les documents consommateurs utilisent la même terminologie | À faire |
| MIG-026 | Ensemble du périmètre | Références croisées | Certaines politiques consommées peuvent être rappelées sans citation explicite de leur source normative. | Ajouter ou corriger les références | Documents responsables identifiés en M3.3 | P2 | Moyen | Toute consommation d'une politique transverse comporte une référence explicite et stable | À faire |
| MIG-027 | Ensemble du périmètre | Doublons éditoriaux | Certains rappels peuvent reproduire des sections entières sans valeur locale. | Supprimer ou réduire | Document responsable du domaine | P3 | Faible | Les documents consommateurs conservent uniquement les rappels nécessaires à leur compréhension locale | À faire |

---

# 5. Regroupement des migrations par document responsable

| Document responsable | Migrations principales associées |
|---|---|
| ADR-001 | MIG-024 |
| ARCH-001 | MIG-001 |
| CORE-001 | MIG-001, MIG-002 |
| ADMIN-001 | MIG-007, MIG-008, MIG-009, MIG-010 |
| CONFIG-001 | MIG-002, MIG-007, MIG-016 |
| LOG-001 | MIG-003, MIG-009, MIG-011, MIG-015, MIG-017, MIG-020 |
| UX-001 | MIG-010, MIG-013 |
| API-001 | MIG-004, MIG-014, MIG-015 |
| SECURITY-001 | MIG-006, MIG-008, MIG-014, MIG-019, MIG-022 |
| AUDIT-001 | MIG-003, MIG-009, MIG-012, MIG-015, MIG-018, MIG-021 |
| ERROR-001 | MIG-004, MIG-011, MIG-012, MIG-013, MIG-023 |
| NOTIF-001 | MIG-016, MIG-017, MIG-018, MIG-019 |
| DOCUMENT-001 | MIG-005, MIG-022, MIG-023 |
| STORAGE-001 | MIG-005, MIG-006, MIG-020, MIG-021 |
| Ensemble du périmètre | MIG-025, MIG-026, MIG-027 |

---

# 6. Règles d'exécution à respecter en M4.2

Le plan d'exécution devra respecter les règles suivantes :

1. traiter en premier les migrations P1 afin de stabiliser les sources normatives ;
2. modifier le document responsable avant les documents consommateurs ;
3. ne supprimer un doublon qu'après confirmation que la règle existe dans sa destination ;
4. préserver les informations locales utiles lors du remplacement par une référence ;
5. mettre à jour les références croisées dans la même séquence de migration ;
6. contrôler le vocabulaire après chaque lot de documents ;
7. conserver une traçabilité des contenus déplacés, supprimés ou reformulés ;
8. vérifier qu'aucune responsabilité exclue en M3.3 n'est réintroduite ;
9. ne pas modifier les décisions fonctionnelles validées de la V1.0 ;
10. exécuter les migrations de manière cumulative sans rendre un document temporairement incohérent.

---

# 7. Critères de clôture de M4.1

M4.1 est considéré comme produit lorsque :

- tous les chevauchements forts et modérés identifiés en M3.2 sont associés à au moins une migration ;
- les responsabilités finales définies en M3.3 sont traduites en actions vérifiables ;
- chaque migration possède un identifiant, une action, une destination, une priorité et un critère de validation ;
- aucune migration n'est encore exécutée dans les documents normatifs ;
- le registre peut être utilisé pour construire l'ordre d'exécution de M4.2.

---

# 8. Résultat du sous-jalon M4.1

Le registre recense les candidats à migration nécessaires pour appliquer la matrice finale des responsabilités documentaires.

Il identifie les opérations de conservation, déplacement, remplacement par référence, harmonisation, scission, clarification ou suppression à planifier.

Le sous-jalon suivant est :

**M4.2 — Plan d'exécution des migrations documentaires.**

Ce plan devra ordonner les migrations, expliciter leurs dépendances, constituer des lots cohérents et définir les contrôles à effectuer après chaque étape.