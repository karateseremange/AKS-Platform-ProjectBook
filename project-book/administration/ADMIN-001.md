| Propriété | Valeur |
|-----------|--------|
| **Document ID** | ADMIN-001 |
| **Titre** | Tableau de bord d'administration d'AKS Platform |
| **Version** | 1.1.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-18 |

---

# 1. Objet

Le présent document définit le rôle, le périmètre et les responsabilités du tableau de bord d'administration d'AKS Platform.

Le tableau de bord d'administration constitue le point d'entrée centralisé pour les fonctions de gestion, de supervision et de configuration de la plateforme.

Il ne remplace pas les interfaces métier des modules.

---

# 2. Objectifs

Le tableau de bord d'administration doit permettre de :

- centraliser l'accès aux fonctions d'administration ;
- réduire la dispersion des outils de gestion ;
- améliorer la lisibilité de l'état de la plateforme ;
- faciliter l'exploitation courante ;
- préparer l'intégration des futurs modules ;
- fournir une expérience cohérente aux administrateurs.

---

# 3. Architecture fonctionnelle

Le tableau de bord d'administration s'appuie sur :

- AKS Core ;
- les services communs ;
- le système de paramétrage ;
- la journalisation ;
- les interfaces d'administration exposées par les modules.

Il ne contient pas directement la logique métier propre aux modules.

```text
Administrateur
      ↓
Tableau de bord d'administration
      ↓
Services communs et interfaces d'administration
      ↓
AKS Core et modules métier
```

---

# 4. Périmètre fonctionnel

Le tableau de bord d'administration doit fournir, selon les droits disponibles, un accès aux fonctions suivantes.

## 4.1 Vue d'ensemble

La vue d'ensemble doit présenter de manière synthétique :

- la version de la plateforme ;
- la saison active ;
- l'état général des principaux services ;
- les traitements récents ;
- les éventuelles erreurs ou alertes ;
- les raccourcis vers les fonctions les plus utilisées.

Cette vue doit rester synthétique et exploitable.

## 4.2 Paramétrage

Le tableau de bord doit donner accès aux paramètres centralisés définis dans `CONFIG-001`.

Il doit notamment permettre :

- de consulter les paramètres actifs ;
- de modifier les paramètres autorisés ;
- de distinguer les paramètres fonctionnels des paramètres techniques ;
- de contrôler la validité des valeurs ;
- de tracer les modifications importantes.

## 4.3 Journalisation

Le tableau de bord doit permettre de consulter les informations de journalisation définies dans `LOG-001`.

Il doit notamment fournir :

- la liste des événements récents ;
- les erreurs ;
- les avertissements ;
- les traitements exécutés ;
- les éléments utiles au diagnostic.

L'affichage doit éviter d'exposer des données sensibles non nécessaires.

## 4.4 Gestion des campagnes et traitements

Le tableau de bord doit permettre l'accès aux campagnes et traitements disponibles.

Pour la V1.1, cela peut notamment concerner :

- la consultation des campagnes existantes ;
- la sélection d'une campagne active ;
- le lancement d'un traitement autorisé ;
- la consultation de son résultat ;
- l'accès aux journaux associés.

Les règles métier restent définies dans les modules concernés.

## 4.5 Accès aux modules

Chaque module peut exposer une entrée d'administration.

Le tableau de bord doit pouvoir présenter ces entrées de manière cohérente sans intégrer leur logique interne.

Exemples :

- Questionnaire santé ;
- AKS Analytics ;
- AKS Calendar ;
- futurs modules.

## 4.6 Informations système

Le tableau de bord peut afficher les informations utiles à l'exploitation, notamment :

- version de l'application ;
- environnement actif ;
- identifiants des principales ressources ;
- état des intégrations externes ;
- date du dernier traitement réussi ;
- date de la dernière erreur connue.

Ces informations doivent rester compréhensibles et ne pas exposer de secret.

---

# 5. Utilisateurs concernés

Le tableau de bord d'administration s'adresse en priorité :

- aux administrateurs de la plateforme ;
- aux responsables autorisés du club ;
- aux personnes chargées de l'exploitation.

Les accès doivent être limités selon les responsabilités.

Les utilisateurs publics et les licenciés ne doivent pas accéder aux fonctions d'administration.

---

# 6. Gestion des droits

Le tableau de bord doit respecter les principes suivants :

- accès réservé aux personnes autorisées ;
- principe du moindre privilège ;
- séparation entre consultation et modification lorsque nécessaire ;
- traçabilité des actions sensibles ;
- absence d'exposition des secrets techniques ;
- refus explicite des opérations non autorisées.

La V1.1 ne doit pas introduire un système complexe de rôles sans besoin concret.

Une gestion simple et explicite des droits est privilégiée.

---

# 7. Navigation et expérience utilisateur

Le tableau de bord doit proposer une navigation :

- simple ;
- cohérente ;
- prévisible ;
- adaptée aux usages récurrents ;
- compatible avec les règles définies dans `UX-001`.

Les fonctions critiques doivent être clairement identifiées.

Les actions irréversibles doivent demander une confirmation explicite.

Les messages d'erreur doivent être compréhensibles et orienter l'administrateur vers une action possible.

---

# 8. Principes de conception

Le tableau de bord doit respecter les principes suivants :

- ne pas dupliquer la logique métier ;
- réutiliser les services communs ;
- centraliser uniquement les fonctions transversales ;
- rester extensible pour les futurs modules ;
- afficher uniquement les informations utiles ;
- préserver les fonctionnalités existantes ;
- ne pas dépendre directement d'un module particulier ;
- rester cohérent avec `ARCH-001` et `CORE-001`.

Les principes décrits dans ce chapitre complètent ceux définis dans ARCH-001 et CORE-001.

---

# 9. Éléments exclus

Les éléments suivants sont exclus du périmètre de `ADMIN-001` :

- la définition détaillée du système de paramétrage ;
- la définition détaillée de la journalisation ;
- la gestion métier interne des modules ;
- une refonte complète de toutes les interfaces ;
- la création d'un portail public ;
- la création d'un système complexe d'identité ou de rôles ;
- la supervision d'infrastructures externes sans lien direct avec AKS Platform.

---

# 10. Dépendances

Le tableau de bord dépend de :

- `ARCH-001` pour les règles d'architecture ;
- `CORE-001` pour les services communs ;
- `PARAM-001` pour le paramétrage ;
- `LOG-001` pour la journalisation ;
- `UX-001` pour les règles d'expérience utilisateur ;
- des interfaces d'administration exposées par les modules.

Les modules ne doivent pas dépendre du tableau de bord pour exécuter leur logique métier.

---

# 11. Critères d'acceptation

Le tableau de bord d'administration sera considéré comme conforme lorsque :

- il fournit un point d'entrée unique vers les fonctions d'administration ;
- il affiche une vue synthétique de l'état de la plateforme ;
- il permet l'accès au paramétrage ;
- il permet l'accès à la journalisation ;
- il peut intégrer les entrées d'administration des modules ;
- il respecte les droits d'accès ;
- il ne duplique pas la logique métier ;
- il ne casse aucune fonctionnalité existante ;
- il reste extensible pour AKS Analytics et AKS Calendar ;
- les fonctions réellement disponibles sont documentées.

---

# 12. Références

- `ROADMAP-001` — Feuille de route officielle d'AKS Platform v1.1
- `ARCH-001` — Architecture fonctionnelle
- `CORE-001` — AKS Core
- `PARAM-001` — Paramétrage centralisé, à produire
- `LOG-001` — Journalisation, à produire
- `UX-001` — Principes UX, à produire

---

# 13. Position dans le Project Book

ADMIN-001 décrit l'organisation fonctionnelle de l'administration d'AKS Platform.

Il constitue le document de référence pour toutes les fonctionnalités réservées aux administrateurs de la plateforme.

Il s'appuie sur les principes définis dans :

- **ARCH-001** — Architecture fonctionnelle d'AKS Platform ;
- **CORE-001** — Architecture d'AKS Core.

Les futurs documents spécialisés, notamment ceux relatifs au paramétrage, à la journalisation ou aux modules métier, viendront préciser certaines fonctionnalités du tableau de bord sans remettre en cause son organisation générale.

Toute évolution des fonctionnalités d'administration devra respecter les principes établis dans le présent document.

---

# 14. Conclusion

le tableau de bord est l'unique point d'entrée des fonctions d'administration, en cohérence avec l'architecture définie dans ARCH-001.

Il centralise l'accès aux fonctions transversales, améliore la supervision de la plateforme et prépare l'intégration des futurs modules sans introduire de dépendance métier supplémentaire.