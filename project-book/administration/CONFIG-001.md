# CONFIG-001
# Paramétrage centralisé d'AKS Platform

Version : 1.1  
Statut : Validé  
Version du produit : V1.1

---

# 1. Objet

Le présent document définit le rôle, le périmètre, le modèle et les règles du système de paramétrage centralisé d'AKS Platform.

Le paramétrage centralisé permet de gérer les valeurs nécessaires au fonctionnement de la plateforme sans les dupliquer dans plusieurs composants ni imposer une modification du code pour chaque changement opérationnel.

---

# 2. Objectifs

Le système de paramétrage doit permettre de :

- centraliser les valeurs utilisées par la plateforme ;
- réduire les valeurs codées en dur ;
- éviter les divergences entre modules ;
- distinguer les paramètres fonctionnels, techniques et sensibles ;
- sécuriser les paramètres et les secrets ;
- assurer la validation, la traçabilité et la réversibilité des changements ;
- faciliter l'exploitation et la maintenance ;
- préparer l'intégration d'AKS Analytics et d'AKS Calendar ;
- préserver la compatibilité avec les fonctionnalités de la V1.0.0.

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

Le tableau de bord d'administration constitue le point d'accès privilégié pour consulter ou modifier les paramètres administrables.

La structure interne de stockage ne doit pas être exposée aux modules consommateurs.

---

# 4. Principes directeurs

Le système de paramétrage doit respecter les principes suivants :

- une source de vérité unique pour chaque valeur commune ;
- des clés stables, explicites et documentées ;
- une séparation claire entre configuration, règles métier et secrets ;
- une validation avant enregistrement ;
- une lecture cohérente par tous les modules ;
- une traçabilité des changements significatifs ;
- un comportement explicite en cas de valeur absente ou invalide ;
- aucune dépendance directe des modules au support de stockage ;
- aucune donnée personnelle sans nécessité fonctionnelle démontrée.

---

# 5. Catégories de paramètres

## 5.1 Paramètres généraux

Ils décrivent le contexte commun de la plateforme et peuvent notamment inclure :

- nom du club ;
- coordonnées du club ;
- adresse de contact ;
- saison active ;
- fuseau horaire ;
- langue ou conventions d'affichage ;
- version fonctionnelle active.

## 5.2 Paramètres des notifications

Ils peuvent notamment inclure :

- nom de l'expéditeur ;
- adresse d'expédition ;
- adresse de réception du club ;
- activation ou désactivation d'une notification ;
- modèles ou références de modèles de messages.

Les règles métier déterminant quand une notification est envoyée restent dans le module concerné.

## 5.3 Paramètres des campagnes

Ils peuvent notamment inclure :

- campagne active ;
- saison associée ;
- date d'ouverture ;
- date de clôture ;
- état de la campagne ;
- identifiants des ressources associées.

Les règles de création et d'exploitation d'une campagne restent définies dans le module concerné.

## 5.4 Paramètres des intégrations externes

Ils peuvent notamment inclure :

- identifiants de ressources Google Workspace ;
- identifiants de calendriers ;
- URL ou références d'API ;
- identifiants de pages ou de points d'entrée WordPress ;
- paramètres d'activation d'une intégration.

Les secrets ne doivent pas être exposés dans les interfaces d'administration ni stockés dans le Project Book.

## 5.5 Paramètres des modules

Chaque module peut définir ses propres paramètres lorsqu'ils ne sont pas communs à la plateforme.

Ces paramètres doivent :

- être regroupés sous un espace de nommage explicite ;
- être documentés par le module ;
- ne pas dupliquer un paramètre commun ;
- respecter les règles de validation et de sécurité du présent document.

## 5.6 Paramètres techniques

Ils peuvent notamment inclure :

- identifiants de fichiers ou dossiers ;
- délais de traitement ;
- limites fonctionnelles ;
- options de diagnostic ;
- activation contrôlée de fonctions techniques.

Ils doivent être séparés des paramètres fonctionnels lorsque cette distinction améliore la lisibilité ou la sécurité.

---

# 6. Modèle logique d'un paramètre

Chaque paramètre doit pouvoir être décrit au minimum par :

- une clé unique ;
- un libellé ;
- une description ;
- une valeur ;
- un type ;
- une portée ;
- une valeur par défaut lorsqu'elle existe ;
- un caractère obligatoire ou facultatif ;
- une règle de validation ;
- un indicateur de sensibilité ;
- un indicateur de modification depuis l'administration ;
- une date de dernière modification ;
- l'origine ou l'auteur de la modification lorsque la traçabilité est requise ;
- un état de cycle de vie.

Exemple conceptuel :

```text
Clé : club.contact.email
Type : adresse électronique
Portée : plateforme
Sensible : non
Obligatoire : oui
Administrable : oui
État : actif
```

---

# 7. Convention de nommage

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

Les clés doivent utiliser des termes fonctionnels compréhensibles et éviter les abréviations ambiguës.

Une clé existante ne doit pas être renommée sans stratégie de migration.

---

# 8. Portée et résolution des valeurs

Un paramètre peut avoir une portée :

- plateforme ;
- module ;
- campagne ;
- saison ;
- environnement ;
- intégration externe.

La portée doit être explicite afin d'éviter qu'une valeur temporaire ou locale soit utilisée comme valeur globale.

Lorsqu'une valeur peut être définie à plusieurs niveaux, l'ordre de résolution doit être documenté et déterministe.

Ordre recommandé, du plus spécifique au plus général :

```text
campagne ou saison
      ↓
module
      ↓
plateforme
      ↓
valeur par défaut documentée
```

Une valeur héritée doit pouvoir être distinguée d'une valeur explicitement définie.

---

# 9. Validation

Toute modification d'un paramètre doit être validée avant enregistrement.

La validation peut notamment porter sur :

- le type de valeur ;
- le format ;
- la présence d'une valeur obligatoire ;
- les valeurs autorisées ;
- les limites minimales ou maximales ;
- la cohérence avec d'autres paramètres ;
- l'existence d'une ressource référencée ;
- les droits de la personne effectuant la modification.

Une valeur invalide doit être refusée avec un message compréhensible.

La validation côté interface ne remplace jamais la validation du service de paramétrage.

---

# 10. Valeurs par défaut et paramètres obligatoires

Un paramètre peut :

- disposer d'une valeur par défaut ;
- être obligatoire ;
- être facultatif ;
- être calculé ou résolu automatiquement.

L'absence d'un paramètre obligatoire doit produire une erreur explicite et journalisée.

Une valeur par défaut ne doit pas masquer une configuration indispensable à l'exploitation.

Les valeurs par défaut doivent être documentées et testées.

---

# 11. Cycle de vie

Un paramètre peut être dans l'un des états suivants :

- projet ;
- actif ;
- obsolète ;
- retiré.

Un paramètre obsolète reste temporairement lisible afin de permettre la migration, mais ne doit plus être utilisé pour de nouveaux développements.

Le retrait d'un paramètre nécessite :

- la vérification de son absence d'utilisation ;
- la migration des modules dépendants ;
- la mise à jour de la documentation ;
- la suppression ou l'archivage contrôlé de sa valeur.

---

# 12. Sécurité et secrets

Le système de paramétrage doit respecter les règles suivantes :

- ne pas exposer les secrets dans l'interface utilisateur ;
- limiter les modifications aux personnes autorisées ;
- appliquer le principe du moindre privilège ;
- tracer les changements importants ;
- ne jamais stocker de mot de passe, de clé privée ou de jeton dans le Project Book ;
- séparer les paramètres visibles des secrets techniques ;
- éviter l'inclusion de données personnelles non nécessaires ;
- masquer toute valeur sensible dans les journaux et messages d'erreur.

Les secrets doivent utiliser les mécanismes sécurisés disponibles dans l'environnement d'exécution.

Une référence vers un secret peut être paramétrée, mais jamais sa valeur en clair dans une interface ou une documentation générale.

---

# 13. Lecture, cache et cohérence

Les modules doivent lire les paramètres via un mécanisme commun.

Un mécanisme de cache peut être utilisé pour limiter les accès répétés, à condition que :

- sa durée soit maîtrisée ;
- son invalidation soit définie ;
- une modification importante puisse être prise en compte sans redéploiement ;
- les modules ne conservent pas durablement une copie divergente ;
- les erreurs de lecture soient explicites et journalisées.

La cohérence fonctionnelle prime sur l'optimisation prématurée.

---

# 14. Traçabilité

Les modifications importantes doivent pouvoir être retracées conformément à `LOG-001`.

La journalisation doit permettre d'identifier, lorsque cela est nécessaire :

- le paramètre modifié ;
- la date de modification ;
- l'ancienne valeur, sauf si elle est sensible ;
- la nouvelle valeur, sauf si elle est sensible ;
- l'utilisateur ou le traitement à l'origine du changement ;
- le résultat de l'opération ;
- l'identifiant de corrélation lorsque la modification appartient à un traitement plus large.

Pour un paramètre sensible, seules les métadonnées du changement doivent être enregistrées.

---

# 15. Administration

Le tableau de bord d'administration doit permettre, selon les droits disponibles :

- de consulter les paramètres ;
- de filtrer les paramètres par domaine, portée ou module ;
- de distinguer les valeurs explicites des valeurs héritées ;
- de modifier les paramètres autorisés ;
- d'identifier les paramètres sensibles ;
- de vérifier la validité des valeurs ;
- d'afficher la date et l'origine de la dernière modification ;
- de signaler les paramètres obligatoires absents ou invalides.

Les paramètres non modifiables depuis l'interface doivent être identifiés comme tels.

Une action de modification doit demander une confirmation lorsque son impact est important ou immédiat.

---

# 16. Utilisation par les modules

Les modules doivent :

- consulter les paramètres via le service commun ;
- éviter les valeurs codées en dur ;
- documenter leurs paramètres spécifiques ;
- fournir un comportement explicite en cas de paramètre absent ou invalide ;
- ne pas modifier un paramètre commun sans autorisation ;
- ne pas dépendre de la structure interne de stockage ;
- ne pas créer leur propre source de vérité pour une valeur déjà gérée par le service commun.

Une règle métier ne doit pas être déplacée dans le paramétrage uniquement pour éviter une évolution de code.

---

# 17. Gestion des changements

Toute évolution significative du paramétrage doit préciser :

- le besoin fonctionnel ;
- la clé créée, modifiée ou retirée ;
- la portée ;
- la valeur par défaut ;
- les règles de validation ;
- l'impact sur les modules ;
- la stratégie de migration ;
- les tests nécessaires ;
- les conditions de retour arrière.

Un changement de paramètre ne doit pas introduire de rupture silencieuse.

---

# 18. Migration et compatibilité

Toute évolution du modèle de paramétrage doit :

- préserver les clés existantes lorsque cela est possible ;
- documenter les changements ;
- fournir une valeur de remplacement ou une migration ;
- éviter la perte de paramètres ;
- être testée avec les modules existants ;
- préserver le fonctionnement de la V1.0.0 pendant la consolidation V1.1.

La suppression d'un paramètre ne peut intervenir qu'après vérification de son absence d'utilisation.

---

# 19. Éléments exclus

Les éléments suivants sont exclus du périmètre de `CONFIG-001` :

- les règles métier propres aux modules ;
- les valeurs réelles des secrets ;
- les procédures spécifiques d'un fournisseur externe ;
- un moteur complexe de gestion de configuration sans besoin concret ;
- la réplication automatique entre environnements non définis ;
- la gestion d'une infrastructure personnelle extérieure à AKS Platform.

---

# 20. Critères d'acceptation

Le système de paramétrage est conforme lorsque :

- les paramètres communs disposent d'une source de vérité unique ;
- les clés respectent une convention stable ;
- la portée et l'ordre de résolution sont explicites ;
- les paramètres sont validés avant enregistrement ;
- les paramètres sensibles et les secrets sont protégés ;
- les modifications importantes sont traçables ;
- les modules lisent les paramètres sans dépendre du stockage interne ;
- les valeurs héritées et explicites peuvent être distinguées ;
- les valeurs codées en dur identifiées comme paramètres sont réduites ou justifiées ;
- le tableau de bord présente les paramètres administrables ;
- les paramètres obligatoires absents ou invalides sont détectés ;
- les changements disposent d'une stratégie de migration lorsque nécessaire ;
- aucune fonctionnalité existante n'est cassée ;
- AKS Analytics et AKS Calendar peuvent ajouter leurs paramètres sans dupliquer le mécanisme.

---

# 21. Références

- `ROADMAP-001` — Feuille de route officielle d'AKS Platform V1.1
- `ARCH-001` — Architecture fonctionnelle
- `CORE-001` — AKS Core
- `ADMIN-001` — Tableau de bord d'administration
- `LOG-001` — Journalisation d'AKS Platform
- `ANALYTICS-001` — Module AKS Analytics, futur
- `CALENDAR-001` — Module AKS Calendar, futur

---

# 22. Conclusion

Le paramétrage centralisé constitue une capacité transverse d'AKS Platform.

Il fournit une source de vérité commune, réduit les valeurs codées en dur, sécurise les changements opérationnels et permet aux modules actuels et futurs d'évoluer sans multiplier les configurations locales ou contradictoires.