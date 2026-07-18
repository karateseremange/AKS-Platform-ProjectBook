# CONFIG-001
# Paramétrage centralisé d'AKS Platform

Version : 1.0  
Statut : Validé  
Version du produit : V1.1

---

# 1. Objet

Le présent document définit le rôle, le périmètre et les règles du système de paramétrage centralisé d'AKS Platform.

Le paramétrage centralisé doit permettre de gérer les valeurs nécessaires au fonctionnement de la plateforme sans les dupliquer dans plusieurs composants ni imposer une modification du code pour chaque changement opérationnel.

---

# 2. Objectifs

Le système de paramétrage doit permettre de :

- centraliser les valeurs utilisées par la plateforme ;
- réduire les valeurs codées en dur ;
- éviter les divergences entre modules ;
- distinguer les paramètres fonctionnels des paramètres techniques ;
- sécuriser les paramètres sensibles ;
- faciliter l'exploitation et la maintenance ;
- préparer l'intégration d'AKS Analytics et d'AKS Calendar.

---

# 3. Position dans l'architecture

Le paramétrage est un service commun d'AKS Core.

```text
Modules métier
      ↓
Service de paramétrage
      ↓
AKS Core
```

Les modules doivent consulter le service de paramétrage plutôt que maintenir leur propre copie d'une valeur commune.

Le tableau de bord d'administration constitue le point d'accès privilégié pour consulter ou modifier les paramètres autorisés.

---

# 4. Catégories de paramètres

## 4.1 Paramètres généraux

Les paramètres généraux décrivent le contexte commun de la plateforme.

Ils peuvent notamment inclure :

- nom du club ;
- coordonnées du club ;
- adresse de contact ;
- saison active ;
- fuseau horaire ;
- langue ou conventions d'affichage ;
- version fonctionnelle active.

## 4.2 Paramètres des notifications

Ils peuvent notamment inclure :

- nom de l'expéditeur ;
- adresse d'expédition ;
- adresse de réception du club ;
- activation ou désactivation d'une notification ;
- modèles ou références de modèles de messages.

Les règles métier déterminant quand une notification est envoyée restent dans le module concerné.

## 4.3 Paramètres des campagnes

Ils peuvent notamment inclure :

- campagne active ;
- saison associée ;
- date d'ouverture ;
- date de clôture ;
- état de la campagne ;
- identifiants des ressources associées.

Les règles de création et d'exploitation d'une campagne restent définies dans le module concerné.

## 4.4 Paramètres des intégrations externes

Ils peuvent notamment inclure :

- identifiants de ressources Google Workspace ;
- identifiants de calendriers ;
- URL ou références d'API ;
- identifiants de pages ou de points d'entrée WordPress ;
- paramètres d'activation d'une intégration.

Les secrets ne doivent pas être exposés dans les interfaces d'administration ni stockés dans un document du Project Book.

## 4.5 Paramètres des modules

Chaque module peut définir ses propres paramètres lorsqu'ils ne sont pas communs à la plateforme.

Ces paramètres doivent :

- être regroupés sous un espace de nommage explicite ;
- être documentés par le module ;
- ne pas dupliquer un paramètre commun ;
- respecter les règles de validation et de sécurité définies dans le présent document.

## 4.6 Paramètres techniques

Les paramètres techniques peuvent notamment inclure :

- identifiants de fichiers ou dossiers ;
- délais de traitement ;
- options de diagnostic ;
- limites fonctionnelles ;
- activation contrôlée de fonctions techniques.

Ils doivent être séparés des paramètres purement fonctionnels lorsque cette distinction améliore la lisibilité ou la sécurité.

---

# 5. Modèle logique d'un paramètre

Chaque paramètre doit pouvoir être décrit au minimum par :

- une clé unique ;
- un libellé ;
- une description ;
- une valeur ;
- un type ;
- une portée ;
- une valeur par défaut lorsqu'elle existe ;
- une règle de validation ;
- un indicateur de sensibilité ;
- une date de dernière modification ;
- l'origine ou l'auteur de la modification lorsque la traçabilité est requise.

Exemple conceptuel :

```text
Clé : club.contact.email
Type : adresse électronique
Portée : plateforme
Sensible : non
Obligatoire : oui
```

---

# 6. Convention de nommage

Les clés de paramètres doivent suivre une convention stable et explicite.

Format recommandé :

```text
<domaine>.<sous-domaine>.<nom>
```

Exemples :

```text
club.name
club.contact.email
platform.activeSeason
notification.sender.name
notification.sender.email
questionnaire.activeCampaign
calendar.sharedCalendarId
analytics.sourceFolderId
```

Les clés existantes ne doivent pas être renommées sans stratégie de migration.

---

# 7. Portée des paramètres

Un paramètre peut avoir une portée :

- plateforme ;
- module ;
- campagne ;
- saison ;
- environnement ;
- intégration externe.

La portée doit être explicite afin d'éviter qu'une valeur temporaire ou locale soit utilisée comme valeur globale.

---

# 8. Validation

Toute modification d'un paramètre doit être validée avant enregistrement.

La validation peut notamment porter sur :

- le type de valeur ;
- le format ;
- la présence d'une valeur obligatoire ;
- les valeurs autorisées ;
- la cohérence avec d'autres paramètres ;
- l'existence d'une ressource référencée ;
- les droits de la personne effectuant la modification.

Une valeur invalide doit être refusée avec un message compréhensible.

---

# 9. Valeurs par défaut et valeurs obligatoires

Un paramètre peut :

- disposer d'une valeur par défaut ;
- être obligatoire ;
- être facultatif ;
- être calculé ou résolu automatiquement.

L'absence d'un paramètre obligatoire doit produire une erreur explicite et journalisée.

Une valeur par défaut ne doit pas masquer une configuration indispensable à l'exploitation.

---

# 10. Sécurité

Le système de paramétrage doit respecter les règles suivantes :

- ne pas exposer les secrets dans l'interface utilisateur ;
- limiter les modifications aux personnes autorisées ;
- appliquer le principe du moindre privilège ;
- tracer les changements importants ;
- ne jamais stocker de mot de passe ou de jeton dans le Project Book ;
- séparer, lorsque nécessaire, les paramètres visibles des secrets techniques ;
- éviter l'inclusion de données personnelles non nécessaires.

Les secrets doivent utiliser les mécanismes sécurisés disponibles dans l'environnement d'exécution.

---

# 11. Traçabilité

Les modifications importantes doivent pouvoir être retracées.

La journalisation doit permettre d'identifier, lorsque cela est nécessaire :

- le paramètre modifié ;
- la date de modification ;
- l'ancienne valeur, sauf si elle est sensible ;
- la nouvelle valeur, sauf si elle est sensible ;
- l'utilisateur ou le traitement à l'origine du changement ;
- le résultat de l'opération.

La journalisation est définie dans `LOG-001`.

---

# 12. Administration

Le tableau de bord d'administration doit permettre, selon les droits disponibles :

- de consulter les paramètres ;
- de filtrer les paramètres par domaine ou module ;
- de modifier les paramètres autorisés ;
- de distinguer les paramètres sensibles ;
- de vérifier la validité des valeurs ;
- d'afficher les informations utiles à l'exploitation.

Les paramètres non modifiables depuis l'interface doivent être identifiés comme tels.

---

# 13. Utilisation par les modules

Les modules doivent :

- consulter les paramètres via un mécanisme commun ;
- éviter les valeurs codées en dur ;
- documenter leurs paramètres spécifiques ;
- fournir un comportement explicite en cas de paramètre absent ou invalide ;
- ne pas modifier un paramètre commun sans autorisation ;
- ne pas dépendre de la structure interne de stockage des paramètres.

Un module ne doit pas créer sa propre source de vérité pour une valeur déjà gérée par le service commun.

---

# 14. Migration et compatibilité

Toute évolution du modèle de paramétrage doit :

- préserver les clés existantes lorsque cela est possible ;
- documenter les changements ;
- fournir une valeur de remplacement ou une migration ;
- éviter la perte de paramètres ;
- être testée avec les modules existants ;
- préserver le fonctionnement de la V1.0.0 pendant la consolidation.

La suppression d'un paramètre ne peut intervenir qu'après vérification de son absence d'utilisation.

---

# 15. Éléments exclus

Les éléments suivants sont exclus du périmètre de `CONFIG-001` :

- les règles métier propres aux modules ;
- les secrets détaillés ou leurs valeurs ;
- les procédures spécifiques d'un fournisseur externe ;
- un moteur complexe de gestion de configuration sans besoin concret ;
- la réplication automatique entre environnements non définis ;
- la gestion d'une infrastructure personnelle extérieure à AKS Platform.

---

# 16. Critères d'acceptation

Le système de paramétrage sera considéré comme conforme lorsque :

- les paramètres communs disposent d'une source de vérité unique ;
- les clés respectent une convention stable ;
- les paramètres sont validés avant enregistrement ;
- les paramètres sensibles sont protégés ;
- les modifications importantes sont traçables ;
- les modules peuvent lire les paramètres sans dépendre de leur stockage interne ;
- les valeurs codées en dur identifiées comme paramètres sont réduites ou justifiées ;
- le tableau de bord peut présenter les paramètres administrables ;
- aucune fonctionnalité existante n'est cassée ;
- les besoins d'AKS Analytics et d'AKS Calendar peuvent être ajoutés sans dupliquer le mécanisme.

---

# 17. Références

- `ROADMAP-001` — Feuille de route officielle d'AKS Platform v1.1
- `ARCH-001` — Architecture fonctionnelle
- `CORE-001` — AKS Core
- `ADMIN-001` — Tableau de bord d'administration
- `LOG-001` — Journalisation, à produire
- `ANALYTICS-001` — Module AKS Analytics, futur
- `CALENDAR-001` — Module AKS Calendar, futur

---

# 18. Conclusion

Le paramétrage centralisé constitue une capacité transverse d'AKS Platform.

Il fournit une source de vérité commune, réduit les valeurs codées en dur et permet aux modules actuels et futurs d'évoluer sans multiplier les configurations locales ou contradictoires.
