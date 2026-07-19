# ADMIN-001

# Tableau de bord d'administration d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | ADMIN-001 |
| **Titre** | Tableau de bord d'administration d'AKS Platform |
| **Version** | 1.1.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-19 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Le présent document définit le rôle, le périmètre, les responsabilités et les règles du tableau de bord d'administration d'AKS Platform.

Il constitue le point d'entrée central pour l'exploitation, le paramétrage, la supervision et le contrôle des services transverses et des modules métier de la plateforme.

---

# 2. Position dans le Project Book

ADMIN-001 complète notamment :

- ARCH-001 — Architecture fonctionnelle ;
- CORE-001 — Architecture d'AKS Core ;
- CONFIG-001 — Paramétrage centralisé ;
- LOG-001 — Journalisation ;
- AUDIT-001 — Journal d'audit ;
- SECURITY-001 — Sécurité ;
- ERROR-001 — Gestion des erreurs ;
- NOTIF-001 — Notifications ;
- DOCUMENT-001 — Gestion documentaire ;
- STORAGE-001 — Stratégie de stockage ;
- UX-001 — Expérience utilisateur.

ADMIN-001 ne remplace pas les règles métier propres aux modules. Il définit leur cadre commun d'administration.

---

# 3. Objectifs

Le tableau de bord doit permettre de :

- disposer d'une vue synthétique de l'état de la plateforme ;
- administrer les paramètres autorisés ;
- suivre les traitements, erreurs et notifications ;
- consulter les événements techniques et d'audit ;
- faciliter le diagnostic et l'exploitation ;
- limiter les interventions directes dans les supports de stockage ;
- centraliser les actions administratives sensibles ;
- préparer l'intégration progressive des futurs modules métier.

---

# 4. Principes directeurs

Le tableau de bord respecte les principes suivants :

- accès réservé aux personnes habilitées ;
- moindre privilège ;
- séparation entre consultation et modification ;
- confirmation des actions sensibles ;
- traçabilité des opérations administratives ;
- absence d'exposition des secrets ;
- cohérence avec UX-001 ;
- fonctionnement dégradé explicite ;
- aucune dépendance directe à la structure interne des données.

---

# 5. Périmètre fonctionnel

Le tableau de bord peut regrouper les domaines suivants :

- accueil et synthèse ;
- état des modules ;
- configuration ;
- journalisation ;
- audit ;
- erreurs et incidents ;
- notifications ;
- documents générés ;
- stockage et capacité ;
- opérations de maintenance ;
- informations de version et de déploiement.

Chaque fonction doit être activée uniquement lorsque le service correspondant existe et est documenté.

---

# 6. Accueil et synthèse

La page d'accueil présente une synthèse exploitable sans exposer de données sensibles.

Elle peut notamment afficher :

- version active de la plateforme ;
- environnement courant ;
- état général des services ;
- modules activés ;
- erreurs récentes significatives ;
- notifications en échec ;
- traitements nécessitant une action ;
- alertes de configuration ;
- capacité de stockage ;
- date des dernières opérations de maintenance.

Les indicateurs doivent être compréhensibles et orientés vers l'action.

---

# 7. Gestion des paramètres

L'administration des paramètres respecte CONFIG-001.

L'interface doit :

- distinguer les paramètres fonctionnels, techniques et sensibles ;
- afficher une description et la valeur effective ;
- valider les saisies avant enregistrement ;
- signaler les dépendances et impacts ;
- conserver l'historique des changements significatifs ;
- permettre une restauration maîtrisée lorsqu'elle est prévue ;
- masquer intégralement les secrets.

Un secret ne doit jamais être affiché en clair ni réinjecté dans un formulaire après son enregistrement.

---

# 8. Journalisation et audit

Les journaux techniques sont consultés conformément à LOG-001.

Le journal d'audit est consulté conformément à AUDIT-001.

L'interface doit permettre, selon les droits :

- filtrage par date, module, niveau, catégorie ou acteur ;
- recherche par identifiant de corrélation ;
- consultation des détails autorisés ;
- distinction entre événement technique et action administrative ;
- export limité et sécurisé lorsque nécessaire.

La suppression ou l'altération manuelle des journaux depuis l'interface est interdite, sauf procédure exceptionnelle documentée.

---

# 9. Gestion des erreurs

La supervision des erreurs respecte ERROR-001.

Elle doit permettre de :

- identifier les erreurs récentes ;
- distinguer erreurs temporaires et définitives ;
- consulter le code, le composant et l'identifiant de corrélation ;
- connaître l'impact fonctionnel ;
- suivre les nouvelles tentatives ;
- déclencher une reprise manuelle lorsqu'elle est autorisée ;
- éviter toute exposition d'information sensible.

Toute reprise manuelle doit être contrôlée, idempotente et auditée.

---

# 10. Gestion des notifications

La supervision des notifications respecte NOTIF-001.

Elle peut permettre de :

- consulter les états d'envoi ;
- filtrer par type, canal, module, période ou statut ;
- identifier les échecs ;
- relancer une notification éligible ;
- vérifier le modèle et sa version ;
- consulter les paramètres actifs sans afficher les secrets.

Le contenu intégral d'un message n'est visible que lorsque cela est nécessaire et autorisé.

---

# 11. Gestion documentaire

La gestion des documents respecte DOCUMENT-001 et STORAGE-001.

L'administration peut permettre de :

- consulter les métadonnées ;
- vérifier le statut d'une génération ;
- contrôler l'intégrité ;
- identifier les documents expirés ;
- relancer une génération autorisée ;
- déclencher une suppression conforme à la politique de conservation.

L'accès au contenu reste soumis aux autorisations et au niveau de confidentialité.

---

# 12. Administration des modules

Chaque module métier expose uniquement les fonctions administratives nécessaires à son périmètre.

Un module doit fournir :

- son état d'activation ;
- sa version ;
- ses paramètres administrables ;
- ses indicateurs utiles ;
- ses erreurs et actions de reprise ;
- ses règles d'autorisation ;
- sa documentation de référence.

Le tableau de bord ne doit pas reproduire la logique métier du module.

---

# 13. Rôles et autorisations

Les autorisations sont appliquées côté serveur conformément à SECURITY-001.

Les profils peuvent notamment distinguer :

- consultation ;
- exploitation ;
- administration fonctionnelle ;
- administration technique ;
- accès aux données sensibles ;
- gestion des utilisateurs et des rôles lorsqu'elle sera disponible.

Aucun contrôle d'accès ne doit reposer uniquement sur le masquage d'un élément d'interface.

---

# 14. Actions sensibles

Sont notamment considérées comme sensibles :

- modification d'un paramètre critique ;
- activation ou désactivation d'un module ;
- relance d'un traitement ;
- suppression d'un document ou d'une donnée ;
- changement d'une règle de conservation ;
- modification d'un modèle actif ;
- consultation ou export de données sensibles.

Ces actions nécessitent selon le cas :

- une confirmation explicite ;
- une justification ;
- une autorisation renforcée ;
- une trace d'audit ;
- un mécanisme de réversibilité.

---

# 15. Expérience utilisateur

L'interface respecte UX-001.

Elle doit notamment :

- être utilisable sur ordinateur et tablette ;
- présenter une navigation stable ;
- afficher clairement les droits insuffisants ;
- distinguer informations, avertissements et erreurs ;
- fournir un retour immédiat après une action ;
- prévenir les doubles soumissions ;
- conserver un vocabulaire homogène ;
- rester accessible aux utilisateurs non techniques.

---

# 16. Sécurité

Le tableau de bord respecte SECURITY-001.

Il doit notamment appliquer :

- authentification obligatoire ;
- contrôle d'autorisation pour chaque action ;
- protection contre les requêtes forgées ;
- validation côté serveur ;
- expiration des sessions ;
- absence de secrets dans le navigateur et les journaux ;
- journalisation des événements de sécurité ;
- protection des exports et téléchargements.

---

# 17. Disponibilité et mode dégradé

Une indisponibilité partielle doit être signalée sans rendre toute l'administration inutilisable lorsque cela est évitable.

L'interface doit distinguer :

- service opérationnel ;
- service dégradé ;
- service indisponible ;
- fonction désactivée ;
- configuration incomplète.

Une erreur technique ne doit pas être présentée comme un succès.

---

# 18. Journalisation des actions administratives

Toute action administrative significative doit produire :

- un identifiant de corrélation ;
- l'identité de l'acteur ;
- la date et l'heure ;
- l'action réalisée ;
- la ressource concernée ;
- le résultat ;
- les valeurs avant et après lorsque cela est autorisé ;
- la justification éventuelle.

Les secrets et données personnelles non nécessaires sont exclus.

---

# 19. Tests

Les tests doivent couvrir au minimum :

- authentification et autorisations ;
- affichage selon les rôles ;
- validation des paramètres ;
- confirmation des actions sensibles ;
- journalisation et audit ;
- recherche par corrélation ;
- gestion des erreurs ;
- prévention des doubles actions ;
- comportement en mode dégradé ;
- absence de secrets dans les réponses et l'interface.

---

# 20. Critères d'acceptation

Le tableau de bord est conforme lorsque :

- il centralise les fonctions administratives disponibles ;
- chaque action est protégée côté serveur ;
- les paramètres respectent CONFIG-001 ;
- les événements respectent LOG-001 et AUDIT-001 ;
- les erreurs respectent ERROR-001 ;
- les notifications respectent NOTIF-001 ;
- les documents respectent DOCUMENT-001 et STORAGE-001 ;
- les actions sensibles sont confirmées et tracées ;
- aucun secret n'est exposé ;
- l'interface respecte UX-001.

---

# 21. Évolutions prévues

Le tableau de bord évoluera progressivement avec :

- les nouveaux modules métier ;
- la gestion avancée des rôles ;
- les indicateurs d'AKS Analytics ;
- la supervision d'AKS Calendar ;
- les opérations de maintenance automatisées ;
- les alertes et tableaux de bord avancés.

Toute évolution doit préserver les principes de sécurité, de traçabilité, de modularité et de simplicité définis dans le Project Book.