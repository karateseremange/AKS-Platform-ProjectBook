# CONFIG-001

# Paramétrage centralisé d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | CONFIG-001 |
| **Titre** | Paramétrage centralisé d'AKS Platform |
| **Version** | 1.2.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Le présent document définit le rôle, le périmètre, le modèle et les règles du système de paramétrage centralisé d'AKS Platform.

Le paramétrage centralisé permet de gérer les valeurs nécessaires au fonctionnement de la plateforme sans les dupliquer dans plusieurs composants ni imposer une modification du code pour chaque changement opérationnel.

`CONFIG-001` constitue le document de référence pour toute valeur configurable consommée par AKS Core, les modules métier, les interfaces d'administration et les intégrations externes.

---

# 2. Position dans le Project Book

`CONFIG-001` applique les principes définis dans :

- `ADR-001` — décisions d'architecture ;
- `ARCH-001` — architecture fonctionnelle de la plateforme ;
- `CORE-001` — responsabilités d'AKS Core ;
- `SECURITY-001` — sécurité, secrets et moindre privilège ;
- `GOV-DOC-001` — gouvernance documentaire ;
- `DOC-001` — système documentaire ;
- `STD-001` — structure documentaire des modules.

Il complète notamment :

- `ADMIN-001` pour l'administration des paramètres ;
- `LOG-001` pour leur traçabilité ;
- `STORAGE-001` pour leur persistance ;
- les documents propres aux modules pour leurs paramètres spécifiques.

En cas de divergence, `ARCH-001` fait autorité sur l'architecture globale, `CORE-001` sur les responsabilités du service commun et `SECURITY-001` sur la protection des secrets.

---

# 3. Objectifs

Le système de paramétrage doit permettre de :

- centraliser les valeurs utilisées par la plateforme ;
- réduire les valeurs codées en dur ;
- éviter les divergences entre modules ;
- distinguer les paramètres fonctionnels, techniques et sensibles ;
- séparer strictement les paramètres ordinaires des valeurs réelles des secrets ;
- assurer la validation, la traçabilité et la réversibilité des changements ;
- faciliter l'exploitation et la maintenance ;
- préparer l'intégration d'AKS Analytics et d'AKS Calendar ;
- préserver la compatibilité avec les fonctionnalités validées de la V1.0.0.

---

# 4. Position dans l'architecture

Le paramétrage est un service commun d'AKS Core.

```text
Modules métier et administration
              ↓
     Contrat de paramétrage
              ↓
 Service de paramétrage AKS Core
              ↓
   Support de stockage encapsulé
```

Les modules doivent consulter le service de paramétrage plutôt que maintenir leur propre copie d'une valeur commune.

Le tableau de bord d'administration constitue le point d'accès privilégié pour consulter ou modifier les paramètres administrables.

La structure interne de stockage ne doit pas être exposée aux modules consommateurs.

AKS Core ne doit pas interpréter les règles métier d'un module. Il fournit uniquement les mécanismes de définition, validation, résolution, lecture, modification contrôlée et traçabilité des paramètres.

---

# 5. Principes directeurs

Le système de paramétrage doit respecter les principes suivants :

- une source de vérité unique pour chaque valeur commune ;
- des clés stables, explicites et documentées ;
- une séparation claire entre configuration, règles métier et secrets ;
- une validation avant enregistrement ;
- une lecture cohérente par tous les modules ;
- une traçabilité des changements significatifs ;
- un comportement explicite en cas de valeur absente ou invalide ;
- aucune dépendance directe des modules au support de stockage ;
- aucune donnée personnelle sans nécessité fonctionnelle démontrée ;
- aucune modification silencieuse d'une valeur héritée ou calculée ;
- aucune rupture de compatibilité sans stratégie de migration documentée.

---

# 6. Catégories de paramètres

## 6.1 Paramètres généraux

Ils décrivent le contexte commun de la plateforme et peuvent notamment inclure :

- nom du club ;
- coordonnées du club ;
- adresse de contact ;
- saison active ;
- fuseau horaire ;
- langue ou conventions d'affichage ;
- version fonctionnelle active.

## 6.2 Paramètres des notifications

Ils peuvent notamment inclure :

- nom de l'expéditeur ;
- adresse d'expédition ;
- adresse de réception du club ;
- activation ou désactivation d'une notification ;
- modèles ou références de modèles de messages.

Les règles métier déterminant quand une notification est envoyée restent dans le module concerné.

## 6.3 Paramètres des campagnes

Ils peuvent notamment inclure :

- campagne active ;
- saison associée ;
- date d'ouverture ;
- date de clôture ;
- état de la campagne ;
- identifiants des ressources associées.

Les règles de création et d'exploitation d'une campagne restent définies dans le module concerné.

## 6.4 Paramètres des intégrations externes

Ils peuvent notamment inclure :

- identifiants de ressources Google Workspace ;
- identifiants de calendriers ;
- URL ou références d'API ;
- identifiants de pages ou de points d'entrée WordPress ;
- paramètres d'activation d'une intégration ;
- références vers des secrets gérés séparément.

Les secrets ne doivent pas être exposés dans les interfaces d'administration ni stockés dans le Project Book.

## 6.5 Paramètres des modules

Chaque module peut définir ses propres paramètres lorsqu'ils ne sont pas communs à la plateforme.

Ces paramètres doivent :

- être regroupés sous un espace de nommage explicite ;
- être documentés par le module ;
- ne pas dupliquer un paramètre commun ;
- respecter les règles de validation et de sécurité du présent document ;
- rester sous la responsabilité fonctionnelle du module propriétaire.

## 6.6 Paramètres techniques

Ils peuvent notamment inclure :

- identifiants de fichiers ou dossiers ;
- délais de traitement ;
- limites fonctionnelles ;
- options de diagnostic ;
- activation contrôlée de fonctions techniques.

Ils doivent être séparés des paramètres fonctionnels lorsque cette distinction améliore la lisibilité ou la sécurité.

## 6.7 Secrets

Une valeur réelle de secret n'est pas un paramètre ordinaire.

Le système de paramétrage peut conserver :

- une référence logique vers un secret ;
- son état de disponibilité ;
- sa date de rotation ;
- ses métadonnées non sensibles.

Il ne doit pas exposer sa valeur en clair aux modules, aux interfaces, aux journaux ou à la documentation.

---

# 7. Modèle logique d'un paramètre

Chaque paramètre doit pouvoir être décrit au minimum par :

- une clé unique ;
- un libellé ;
- une description ;
- une valeur ou une référence de résolution ;
- un type ;
- une portée ;
- une valeur par défaut lorsqu'elle existe ;
- un caractère obligatoire ou facultatif ;
- une règle de validation ;
- un indicateur de sensibilité ;
- un indicateur de modification depuis l'administration ;
- une date de dernière modification ;
- l'origine ou l'auteur de la modification lorsque la traçabilité est requise ;
- un état de cycle de vie ;
- une version de schéma ou de définition lorsque nécessaire.

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

# 8. Convention de nommage

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

Une nouvelle clé ne doit pas reprendre le sens d'une clé obsolète avec une sémantique différente.

---

# 9. Portée et résolution des valeurs

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

La portée `environnement` ne doit pas modifier silencieusement une règle fonctionnelle. Elle sert principalement à adapter une dépendance, une ressource ou un comportement technique au contexte d'exécution.

Une valeur héritée doit pouvoir être distinguée d'une valeur explicitement définie.

La résolution doit retourner, lorsque nécessaire :

- la valeur effective ;
- sa source ;
- sa portée ;
- son caractère explicite, hérité ou par défaut ;
- son état de validité.

---

# 10. Validation

Toute modification d'un paramètre doit être validée avant enregistrement.

La validation peut notamment porter sur :

- le type de valeur ;
- le format ;
- la présence d'une valeur obligatoire ;
- les valeurs autorisées ;
- les limites minimales ou maximales ;
- la cohérence avec d'autres paramètres ;
- l'existence d'une ressource référencée ;
- les droits de la personne effectuant la modification ;
- la compatibilité avec les consommateurs existants.

Une valeur invalide doit être refusée avec un message compréhensible.

La validation côté interface ne remplace jamais la validation du service de paramétrage.

La validation d'une référence externe ne doit pas provoquer d'effet de bord métier.

---

# 11. Valeurs par défaut et paramètres obligatoires

Un paramètre peut :

- disposer d'une valeur par défaut ;
- être obligatoire ;
- être facultatif ;
- être calculé ou résolu automatiquement.

L'absence d'un paramètre obligatoire doit produire une erreur explicite et journalisée.

Une valeur par défaut ne doit pas masquer une configuration indispensable à l'exploitation.

Les valeurs par défaut doivent être documentées et testées.

Une valeur calculée doit préciser sa source et ne doit pas être modifiable comme une valeur ordinaire.

---

# 12. Cycle de vie

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
- la suppression ou l'archivage contrôlé de sa valeur ;
- la vérification de l'absence de rupture sur les environnements concernés.

---

# 13. Sécurité et secrets

Le système de paramétrage doit respecter les règles suivantes :

- ne pas exposer les secrets dans l'interface utilisateur ;
- limiter les modifications aux personnes autorisées ;
- appliquer le principe du moindre privilège ;
- tracer les changements importants ;
- ne jamais stocker de mot de passe, de clé privée ou de jeton dans le Project Book ;
- séparer les paramètres visibles des secrets techniques ;
- éviter l'inclusion de données personnelles non nécessaires ;
- masquer toute valeur sensible dans les journaux et messages d'erreur ;
- permettre la révocation et la rotation des secrets référencés ;
- ne jamais retourner un secret réel par une API générale de lecture de configuration.

Les secrets doivent utiliser les mécanismes sécurisés disponibles dans l'environnement d'exécution.

Une référence vers un secret peut être paramétrée, mais jamais sa valeur en clair dans une interface ou une documentation générale.

Les règles détaillées relèvent de `SECURITY-001`.

---

# 14. Lecture, cache et cohérence

Les modules doivent lire les paramètres via un mécanisme commun.

Un mécanisme de cache peut être utilisé pour limiter les accès répétés, à condition que :

- sa durée soit maîtrisée ;
- son invalidation soit définie ;
- une modification importante puisse être prise en compte sans redéploiement ;
- les modules ne conservent pas durablement une copie divergente ;
- les erreurs de lecture soient explicites et journalisées ;
- la source de vérité reste le service de paramétrage.

La cohérence fonctionnelle prime sur l'optimisation prématurée.

Un module doit définir son comportement lorsque le service est temporairement indisponible : refus, valeur en cache encore valide ou mode dégradé explicitement autorisé.

---

# 15. Traçabilité

Les modifications importantes doivent pouvoir être retracées conformément à `LOG-001` et, pour les actions administratives sensibles, à `AUDIT-001`.

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

# 16. Administration

Le tableau de bord d'administration doit permettre, selon les droits disponibles :

- de consulter les paramètres ;
- de filtrer les paramètres par domaine, portée ou module ;
- de distinguer les valeurs explicites des valeurs héritées ;
- de modifier les paramètres autorisés ;
- d'identifier les paramètres sensibles ;
- de vérifier la validité des valeurs ;
- d'afficher la date et l'origine de la dernière modification ;
- de signaler les paramètres obligatoires absents ou invalides ;
- de connaître l'impact attendu d'une modification importante.

Les paramètres non modifiables depuis l'interface doivent être identifiés comme tels.

Une action de modification doit demander une confirmation lorsque son impact est important ou immédiat.

Aucune interface générale ne doit permettre l'affichage ou la copie d'un secret réel.

---

# 17. Utilisation par les modules

Les modules doivent :

- consulter les paramètres via le service commun ;
- éviter les valeurs codées en dur ;
- documenter leurs paramètres spécifiques ;
- fournir un comportement explicite en cas de paramètre absent ou invalide ;
- ne pas modifier un paramètre commun sans autorisation ;
- ne pas dépendre de la structure interne de stockage ;
- ne pas créer leur propre source de vérité pour une valeur déjà gérée par le service commun ;
- déclarer les paramètres qu'ils consomment et les contraintes associées.

Une règle métier ne doit pas être déplacée dans le paramétrage uniquement pour éviter une évolution de code.

Le paramétrage peut sélectionner ou activer un comportement prévu et documenté ; il ne doit pas devenir un moteur de règles métier implicite.

---

# 18. Gestion des changements

Toute évolution significative du paramétrage doit préciser :

- le besoin fonctionnel ;
- la clé créée, modifiée ou retirée ;
- la portée ;
- la valeur par défaut ;
- les règles de validation ;
- les consommateurs concernés ;
- les impacts de sécurité ;
- les tests nécessaires ;
- les conditions de retour arrière.

Un changement de paramètre ne doit pas introduire de rupture silencieuse.

Une modification de sémantique exige une nouvelle clé ou une migration explicitement documentée.

---

# 19. Migration et compatibilité

Toute évolution du modèle de paramétrage doit :

- préserver les clés existantes lorsque cela est possible ;
- documenter les changements ;
- fournir une valeur de remplacement ou une migration ;
- éviter la perte de paramètres ;
- être testée avec les modules existants ;
- préserver le fonctionnement des fonctionnalités déjà validées ;
- prévoir un retour arrière lorsque le risque le justifie.

La suppression d'un paramètre ne peut intervenir qu'après vérification de son absence d'utilisation.

Une migration doit être idempotente lorsqu'elle peut être rejouée.

---

# 20. Gouvernance et exceptions

Toute nouvelle capacité de paramétrage doit être justifiée par un besoin réel.

Une exception aux conventions de ce document doit être :

- justifiée ;
- limitée dans son périmètre ;
- documentée ;
- validée ;
- accompagnée d'une stratégie de régularisation lorsque nécessaire.

Une exception ne devient jamais automatiquement une règle générale.

---

# 21. Éléments exclus

Les éléments suivants sont exclus du périmètre de `CONFIG-001` :

- les règles métier propres aux modules ;
- les valeurs réelles des secrets ;
- les procédures spécifiques d'un fournisseur externe ;
- un moteur complexe de gestion de configuration sans besoin concret ;
- la réplication automatique entre environnements non définis ;
- la gestion d'une infrastructure personnelle extérieure à AKS Platform.

L'environnement Proxmox personnel du Product Owner ne fait pas partie de l'infrastructure AKS Platform.

---

# 22. Critères d'acceptation

Le système de paramétrage est conforme lorsque :

- [ ] Les paramètres communs disposent d'une source de vérité unique.
- [ ] Les clés respectent une convention stable.
- [ ] La portée et l'ordre de résolution sont explicites.
- [ ] La source de chaque valeur effective peut être identifiée.
- [ ] Les paramètres sont validés côté service avant enregistrement.
- [ ] Les paramètres sensibles et les secrets sont séparés et protégés.
- [ ] Aucun secret réel n'est exposé par l'administration, les API ou les journaux.
- [ ] Les modifications importantes sont traçables.
- [ ] Les modules lisent les paramètres sans dépendre du stockage interne.
- [ ] Les valeurs héritées, explicites et par défaut peuvent être distinguées.
- [ ] Les valeurs codées en dur identifiées comme paramètres sont réduites ou justifiées.
- [ ] Le tableau de bord présente les paramètres administrables selon les droits.
- [ ] Les paramètres obligatoires absents ou invalides sont détectés.
- [ ] Les changements disposent d'une stratégie de migration lorsque nécessaire.
- [ ] Les migrations critiques disposent d'une stratégie de retour arrière.
- [ ] Aucune fonctionnalité existante n'est cassée.
- [ ] AKS Analytics et AKS Calendar peuvent ajouter leurs paramètres sans dupliquer le mécanisme.
- [ ] La documentation des modules référence les paramètres qu'ils consomment.

---

# 23. Références

| Document | Rôle |
|----------|------|
| `ADR-001` | Décisions d'architecture |
| `ARCH-001` | Architecture fonctionnelle |
| `CORE-001` | Responsabilités d'AKS Core |
| `SECURITY-001` | Sécurité et gestion des secrets |
| `ADMIN-001` | Tableau de bord d'administration |
| `LOG-001` | Journalisation |
| `AUDIT-001` | Audit des actions sensibles |
| `STORAGE-001` | Stockage et conservation |
| `DOC-001` | Système documentaire |
| `STD-001` | Structure documentaire des modules |
| `ANALYTICS-001` | Module AKS Analytics |
| `CALENDAR-001` | Module AKS Calendar |

---

# 24. Historique des versions

| Version | Date | Évolution |
|---------|------|-----------|
| 1.0 | 2026-07-18 | Définition initiale du paramétrage centralisé |
| 1.1 | 2026-07-18 | Consolidation fonctionnelle pour AKS Platform V1.1 |
| 1.2.0 | 2026-07-23 | Alignement architectural, séparation paramètres/secrets, résolution, migration et gouvernance documentaire |

---

# 25. Conclusion

Le paramétrage centralisé constitue une capacité transverse d'AKS Platform.

Il fournit une source de vérité commune, réduit les valeurs codées en dur, sécurise les changements opérationnels et permet aux modules actuels et futurs d'évoluer sans multiplier les configurations locales ou contradictoires.

Il doit rester simple, explicite, testable et indépendant du support de stockage. Son rôle n'est pas de déplacer les règles métier dans la configuration, mais de fournir aux composants de la plateforme des valeurs maîtrisées, validées et compatibles.