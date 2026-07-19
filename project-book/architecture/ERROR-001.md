# ERROR-001

# Gestion transverse des erreurs

| Propriété | Valeur |
|-----------|--------|
| Document ID | ERROR-001 |
| Titre | Gestion transverse des erreurs |
| Version | 1.1.0 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-19 |
| Version du produit | V1.1 |

---

## 1. Objet

Le présent document définit les principes communs de gestion des erreurs dans AKS Platform.

Il complète notamment :

- `API-001` pour les réponses d’erreur exposées par les API ;
- `LOG-001` pour la journalisation technique ;
- `AUDIT-001` pour la traçabilité fonctionnelle des actions sensibles ;
- `SECURITY-001` pour la protection des informations sensibles ;
- `UX-001` pour la restitution des erreurs aux utilisateurs.

L’objectif est de garantir un comportement cohérent, compréhensible, exploitable et sécurisé dans l’ensemble de la plateforme.

## 2. Principes directeurs

La gestion des erreurs repose sur les principes suivants :

1. une erreur doit être détectée au plus près de sa source ;
2. elle doit être qualifiée selon une typologie commune ;
3. le message destiné à l’utilisateur doit rester clair et non technique ;
4. les détails techniques doivent être réservés aux journaux internes ;
5. aucune donnée sensible ne doit être révélée dans une réponse publique ;
6. toute erreur doit pouvoir être corrélée à une requête ou une opération ;
7. les erreurs attendues doivent être distinguées des incidents techniques ;
8. les traitements automatiques doivent prévoir les reprises lorsque cela est pertinent.

## 3. Typologie des erreurs

Les erreurs sont classées selon les catégories suivantes.

### 3.1 Erreurs de validation

Elles concernent les données absentes, mal formées, incohérentes ou hors périmètre.

Exemples :

- champ obligatoire manquant ;
- format de date invalide ;
- valeur non autorisée ;
- incohérence entre deux champs.

### 3.2 Erreurs d’authentification

Elles surviennent lorsqu’une identité ne peut pas être établie ou qu’un mécanisme d’authentification est invalide.

Exemples :

- session expirée ;
- signature de requête invalide ;
- jeton absent ou invalide.

### 3.3 Erreurs d’autorisation

Elles surviennent lorsqu’un utilisateur authentifié ne dispose pas des droits nécessaires.

Exemples :

- accès à une fonction réservée à l’administration ;
- tentative de consultation d’une ressource non autorisée.

### 3.4 Erreurs fonctionnelles

Elles correspondent à une règle métier non satisfaite.

Exemples :

- opération déjà réalisée ;
- ressource dans un état incompatible ;
- action interdite par une règle de gestion.

### 3.5 Erreurs techniques

Elles résultent d’un dysfonctionnement interne ou externe.

Exemples :

- indisponibilité d’un service tiers ;
- erreur d’accès au stockage ;
- échec de génération d’un document ;
- exception non prévue.

### 3.6 Erreurs temporaires

Elles sont susceptibles de disparaître sans correction fonctionnelle.

Exemples :

- délai dépassé ;
- quota temporairement atteint ;
- service externe momentanément indisponible.

## 4. Structure d’erreur commune

Les composants de la plateforme doivent utiliser une structure commune comprenant au minimum :

- un code d’erreur stable ;
- une catégorie ;
- un message utilisateur ;
- un identifiant de corrélation ;
- éventuellement les champs concernés ;
- éventuellement une indication permettant de savoir si une nouvelle tentative est possible.

Exemple conceptuel :

```json
{
  "error": {
    "code": "VALIDATION_REQUIRED_FIELD",
    "category": "validation",
    "message": "Une information obligatoire est manquante.",
    "fields": ["email"],
    "correlationId": "...",
    "retryable": false
  }
}
```

Les détails techniques, traces d’exécution et messages natifs des dépendances ne doivent jamais être exposés publiquement.

## 5. Codes d’erreur

Les codes d’erreur doivent être :

- stables dans le temps ;
- indépendants du texte affiché ;
- suffisamment explicites pour être recherchés dans les journaux ;
- documentés lorsqu’ils sont exposés à un autre composant.

Convention recommandée :

`DOMAINE_CAUSE`

Exemples :

- `VALIDATION_REQUIRED_FIELD` ;
- `AUTH_INVALID_SIGNATURE` ;
- `ACCESS_FORBIDDEN` ;
- `QUESTIONNAIRE_ALREADY_SUBMITTED` ;
- `DOCUMENT_GENERATION_FAILED` ;
- `NOTIFICATION_PROVIDER_UNAVAILABLE`.

## 6. Restitution utilisateur

Les messages visibles doivent :

- expliquer ce qui empêche l’action ;
- indiquer, lorsque possible, comment corriger la situation ;
- éviter le jargon technique ;
- ne pas afficher de trace, de nom de classe, de requête ou de secret ;
- rester cohérents sur l’ensemble de la plateforme.

Lorsqu’une erreur ne peut pas être résolue par l’utilisateur, le message doit fournir un identifiant de référence ou de corrélation utilisable par l’assistance.

## 7. Gestion dans les API

Les API appliquent les conventions de `API-001`.

En particulier :

- les erreurs de validation utilisent un statut client approprié ;
- les erreurs d’authentification et d’autorisation sont distinctes ;
- les erreurs fonctionnelles ne doivent pas être transformées en erreurs techniques génériques ;
- les erreurs internes renvoient un message neutre et un identifiant de corrélation ;
- les réponses conservent une structure homogène.

## 8. Journalisation

Toute erreur technique significative doit être journalisée conformément à `LOG-001` avec, lorsque disponible :

- l’horodatage ;
- le composant ;
- le code d’erreur ;
- le niveau de gravité ;
- l’identifiant de corrélation ;
- le contexte utile ;
- la cause initiale ;
- la pile technique, uniquement dans les journaux internes.

Les données personnelles et secrets doivent être masqués ou exclus.

## 9. Corrélation

Chaque requête ou opération significative doit pouvoir disposer d’un identifiant de corrélation.

Cet identifiant permet de relier :

- la requête entrante ;
- les traitements internes ;
- les appels vers des services externes ;
- les événements de journalisation ;
- les notifications éventuelles ;
- la réponse retournée à l’utilisateur.

L’identifiant de corrélation ne doit contenir aucune donnée métier ou personnelle.

## 10. Reprise et nouvelles tentatives

Une nouvelle tentative automatique n’est autorisée que pour les erreurs identifiées comme temporaires.

Elle doit respecter :

- un nombre maximal de tentatives ;
- un délai croissant entre les tentatives lorsque pertinent ;
- l’idempotence de l’opération ;
- la prévention des doublons ;
- la journalisation des échecs successifs.

Les erreurs fonctionnelles, de validation ou d’autorisation ne doivent pas déclencher de reprise automatique.

## 11. Erreurs des services externes

Les erreurs issues de services tiers doivent être traduites dans la typologie interne.

La plateforme ne doit pas dépendre directement des messages ou codes natifs d’un fournisseur pour sa logique métier.

Les informations du fournisseur peuvent être conservées dans les journaux internes, sous réserve des règles de sécurité et de confidentialité.

## 12. Erreurs dans les traitements asynchrones

Pour les traitements différés ou planifiés :

- l’état d’échec doit être conservé ;
- le nombre de tentatives doit être suivi ;
- une reprise manuelle doit être possible lorsque nécessaire ;
- les échecs définitifs doivent être visibles dans l’administration ;
- les incidents critiques doivent pouvoir générer une alerte.

## 13. Niveaux de gravité

Les erreurs techniques sont qualifiées au minimum selon les niveaux suivants :

- `INFO` : événement attendu sans impact ;
- `WARNING` : anomalie maîtrisée ou dégradation limitée ;
- `ERROR` : opération échouée nécessitant une investigation ;
- `CRITICAL` : indisponibilité, perte potentielle de données ou risque de sécurité.

La gravité technique ne doit pas être confondue avec l’importance métier d’une opération.

## 14. Sécurité

La gestion des erreurs doit respecter `SECURITY-001`.

Il est notamment interdit d’exposer :

- les secrets ou jetons ;
- les chemins internes ;
- les requêtes complètes contenant des données sensibles ;
- les détails de configuration ;
- les informations facilitant une attaque ;
- les données d’un autre utilisateur.

## 15. Supervision et administration

Le tableau de bord d’administration doit permettre, selon les besoins de la version :

- d’identifier les erreurs récentes ;
- de filtrer par composant, code, gravité ou période ;
- de rechercher par identifiant de corrélation ;
- de distinguer les erreurs temporaires des échecs définitifs ;
- de suivre les reprises ;
- de consulter les détails autorisés.

L’accès à ces informations est réservé aux profils habilités.

## 16. Responsabilités

### AKS Core

AKS Core fournit les conventions communes, les composants de corrélation, les structures d’erreur et les mécanismes transversaux.

### Modules métier

Chaque module :

- définit ses codes d’erreur fonctionnels ;
- valide ses données ;
- traduit les erreurs techniques vers le modèle commun ;
- ne divulgue aucune information sensible.

### Administration

L’administration facilite la consultation, le diagnostic et, lorsque prévu, la reprise des opérations en échec.

## 17. Tests

Les tests doivent couvrir au minimum :

- les erreurs de validation ;
- les refus d’accès ;
- les erreurs fonctionnelles ;
- les indisponibilités externes ;
- les erreurs inattendues ;
- la présence de l’identifiant de corrélation ;
- l’absence de données sensibles dans les réponses ;
- le comportement des reprises automatiques.

## 18. Critères d’acceptation

La gestion des erreurs est considérée conforme lorsque :

- les structures d’erreur sont homogènes ;
- les codes sont stables et documentés ;
- les messages utilisateurs sont compréhensibles ;
- les détails techniques restent internes ;
- les événements sont corrélables ;
- les erreurs temporaires sont distinguées des erreurs définitives ;
- les reprises ne créent pas de doublons ;
- les exigences de sécurité et de journalisation sont respectées.

## 19. Évolutions

Ce document pourra évoluer avec :

- l’ajout de nouveaux modules métier ;
- l’introduction de nouveaux canaux ou services externes ;
- l’amélioration de la supervision ;
- l’ajout d’alertes automatiques ;
- la formalisation d’un catalogue centralisé des codes d’erreur.
