# NOTIF-001 — Service transversal de notifications

## 1. Statut du document

- **Référence** : NOTIF-001
- **Titre** : Service transversal de notifications
- **Version cible** : AKS Platform V1.1
- **Statut** : Référence d’architecture
- **Dépendances principales** : ARCH-001, CORE-001, CONFIG-001, LOG-001, SECURITY-001, AUDIT-001

## 2. Objet

Ce document définit les principes fonctionnels et techniques du service transversal de notifications d’AKS Platform.

Le service de notifications permet aux modules métier d’informer les utilisateurs, les responsables du club ou les systèmes externes sans dupliquer la logique d’envoi dans chaque module.

Il fournit un cadre commun pour :

- la préparation des messages ;
- la sélection des destinataires ;
- le choix du canal ;
- la personnalisation des modèles ;
- l’envoi et le suivi des notifications ;
- la gestion des erreurs et des nouvelles tentatives ;
- la traçabilité des opérations sensibles.

## 3. Principes directeurs

Le service respecte les principes suivants :

1. **Centralisation** : les règles communes d’envoi sont portées par un service transversal.
2. **Découplage** : les modules métier déclarent une intention de notification sans dépendre directement d’un fournisseur technique.
3. **Configuration** : les expéditeurs, canaux, modèles et comportements sont paramétrables conformément à CONFIG-001.
4. **Traçabilité** : chaque notification possède un identifiant technique et un état consultable.
5. **Sécurité** : aucune donnée sensible inutile ne doit être exposée dans le contenu, les journaux ou les métadonnées.
6. **Idempotence** : une même demande ne doit pas entraîner plusieurs envois involontaires.
7. **Résilience** : un échec temporaire d’un fournisseur ne doit pas bloquer l’opération métier principale.
8. **Sobriété** : seules les notifications utiles, attendues et proportionnées sont envoyées.

## 4. Périmètre

### 4.1 Inclus dans la V1.1

Le périmètre de référence couvre :

- les notifications par courrier électronique ;
- les messages administratifs adressés au club ;
- les confirmations adressées aux usagers ;
- les notifications déclenchées par un événement métier ;
- les modèles de messages versionnés ;
- le suivi des états d’envoi ;
- la journalisation technique et l’audit des actions sensibles ;
- la possibilité d’activer ou désactiver une catégorie de notification.

### 4.2 Hors périmètre initial

Sont hors périmètre de la V1.1, sauf décision ultérieure :

- les SMS ;
- les notifications mobiles natives ;
- les notifications instantanées de type messagerie ;
- les campagnes marketing ;
- les scénarios complexes d’automatisation commerciale ;
- la gestion avancée des préférences individuelles multicanales.

Ces capacités pourront être ajoutées ultérieurement sans remettre en cause le contrat défini dans ce document.

## 5. Responsabilités

### 5.1 Modules métier

Chaque module métier est responsable de :

- déterminer l’événement qui justifie une notification ;
- fournir le type de notification demandé ;
- fournir les données strictement nécessaires à la génération du message ;
- indiquer le ou les destinataires autorisés ;
- fournir une clé d’idempotence lorsqu’un doublon est possible ;
- ne pas intégrer directement les secrets ou paramètres d’un fournisseur.

### 5.2 Service de notifications

Le service transversal est responsable de :

- valider la demande ;
- sélectionner le modèle applicable ;
- produire le sujet et le contenu final ;
- résoudre l’identité de l’expéditeur ;
- appeler le fournisseur configuré ;
- enregistrer l’état de traitement ;
- appliquer les règles de nouvelle tentative ;
- produire les journaux techniques nécessaires ;
- produire les événements d’audit requis.

### 5.3 Administration

L’administration de la plateforme peut :

- consulter les notifications récentes selon ses droits ;
- filtrer les notifications par état, type ou période ;
- consulter le motif d’un échec technique ;
- relancer une notification relançable ;
- activer ou désactiver certaines catégories ;
- gérer les paramètres non secrets du service ;
- vérifier le modèle utilisé et sa version.

Les opérations de relance, d’annulation ou de modification de configuration sont auditées conformément à AUDIT-001.

## 6. Modèle fonctionnel d’une notification

Une notification comprend au minimum :

- un identifiant unique ;
- un type fonctionnel ;
- le module d’origine ;
- la date de création ;
- le canal demandé ;
- le destinataire ;
- l’expéditeur logique ;
- la référence du modèle ;
- la version du modèle ;
- les données de personnalisation ;
- la clé d’idempotence éventuelle ;
- l’état courant ;
- le nombre de tentatives ;
- la date du dernier traitement ;
- la référence technique retournée par le fournisseur, si disponible ;
- un code d’erreur normalisé en cas d’échec.

Le contenu complet du message ne doit être conservé que si cela est nécessaire et autorisé. Lorsque cela suffit, la plateforme conserve uniquement les métadonnées, la référence du modèle et les données minimales de traçabilité.

## 7. Types de notifications

Les types de notification sont des identifiants stables et indépendants du canal technique.

Exemples :

- `health_questionnaire.confirmation` ;
- `health_questionnaire.club_alert` ;
- `document.generated` ;
- `administration.action_required` ;
- `system.delivery_failure`.

Chaque type définit :

- son objectif ;
- son public autorisé ;
- son niveau de sensibilité ;
- son modèle par défaut ;
- son caractère obligatoire ou désactivable ;
- sa politique de nouvelle tentative ;
- sa durée de conservation.

## 8. Canaux

Le canal de référence de la V1.1 est le courrier électronique.

Le contrat du service doit néanmoins rester indépendant du fournisseur et permettre l’ajout futur d’autres canaux.

Chaque canal implémente au minimum :

- la validation des coordonnées du destinataire ;
- la préparation du format attendu ;
- l’envoi ;
- la traduction des réponses du fournisseur en états normalisés ;
- la remontée d’un identifiant technique lorsque le fournisseur en retourne un.

## 9. Modèles de messages

### 9.1 Principes

Les modèles sont séparés du code métier.

Chaque modèle possède :

- une référence stable ;
- une version ;
- un canal ;
- une langue ;
- un sujet ;
- un contenu texte ou HTML ;
- une liste de variables autorisées ;
- un statut actif ou inactif.

### 9.2 Variables

Les variables doivent :

- être explicitement déclarées ;
- être validées avant utilisation ;
- être échappées selon le format de sortie ;
- ne contenir aucun secret ;
- ne pas permettre l’injection de contenu actif non maîtrisé.

Une variable manquante indispensable entraîne le rejet de la demande avant l’appel au fournisseur.

### 9.3 Versionnement

Une modification significative d’un modèle entraîne une nouvelle version.

La notification conserve la référence de la version utilisée afin de permettre la compréhension ultérieure du message envoyé.

## 10. Cycle de vie

Les états normalisés sont :

- `PENDING` : demande enregistrée ;
- `PROCESSING` : traitement en cours ;
- `SENT` : demande acceptée par le fournisseur ;
- `DELIVERED` : livraison confirmée, lorsque l’information est disponible ;
- `FAILED_RETRYABLE` : échec temporaire pouvant faire l’objet d’une nouvelle tentative ;
- `FAILED_FINAL` : échec définitif ;
- `CANCELLED` : demande annulée avant l’envoi ;
- `DUPLICATE` : demande non envoyée car déjà traitée.

Le passage d’un état à un autre doit être cohérent, daté et traçable.

## 11. Idempotence et prévention des doublons

Lorsqu’un événement métier peut être soumis plusieurs fois, le module fournit une clé d’idempotence stable.

Le service vérifie si une notification équivalente a déjà été acceptée ou envoyée.

En cas de doublon :

- aucun nouvel envoi n’est réalisé ;
- la demande est marquée `DUPLICATE` ou rattachée à la notification existante ;
- l’appelant reçoit une réponse fonctionnelle non bloquante.

La clé d’idempotence ne doit pas contenir directement de donnée personnelle sensible.

## 12. Gestion des erreurs

Les erreurs sont classées au minimum en :

- erreur de validation ;
- modèle introuvable ou invalide ;
- destinataire invalide ;
- configuration indisponible ;
- erreur d’authentification auprès du fournisseur ;
- indisponibilité temporaire du fournisseur ;
- rejet définitif du fournisseur ;
- erreur interne de traitement.

Les messages d’erreur exposés à l’utilisateur restent compréhensibles et ne révèlent aucun secret ni détail technique sensible.

Les détails techniques sont journalisés conformément à LOG-001 et aux règles définies dans ERROR-001.

## 13. Nouvelles tentatives

Les erreurs temporaires peuvent déclencher une nouvelle tentative automatique.

La politique de relance définit :

- le nombre maximal de tentatives ;
- le délai entre les tentatives ;
- l’augmentation éventuelle du délai ;
- les codes d’erreur relançables ;
- le moment où l’échec devient définitif.

Une relance manuelle depuis l’administration :

- vérifie que la notification est relançable ;
- crée une trace d’audit ;
- ne modifie pas rétroactivement l’historique des tentatives précédentes.

## 14. Sécurité et protection des données

Le service applique SECURITY-001.

En particulier :

- les secrets du fournisseur ne sont jamais stockés dans les modèles ni les journaux ;
- les adresses des destinataires ne sont accessibles qu’aux personnes autorisées ;
- les contenus sensibles sont minimisés ;
- les journaux masquent les données inutiles ;
- les liens inclus dans les messages ne doivent pas exposer directement des identifiants prévisibles ;
- les pièces jointes sensibles utilisent un mécanisme sécurisé ou une durée de disponibilité limitée ;
- les modèles HTML interdisent les contenus actifs non maîtrisés.

## 15. Journalisation et audit

### 15.1 Journalisation technique

Sont journalisés conformément à LOG-001 :

- l’identifiant de notification ;
- le type ;
- le canal ;
- l’état ;
- le numéro de tentative ;
- la durée du traitement ;
- le code de retour normalisé ;
- l’identifiant de corrélation.

Le corps complet du message et les secrets ne doivent pas apparaître dans les journaux.

### 15.2 Audit fonctionnel

Sont auditées conformément à AUDIT-001 :

- la relance manuelle ;
- l’annulation manuelle ;
- la modification d’une configuration de notification ;
- l’activation ou la désactivation d’un type ;
- la modification d’un modèle actif ;
- la consultation d’un contenu sensible, lorsqu’elle est autorisée.

## 16. Configuration

Les paramètres relèvent de CONFIG-001.

Ils comprennent notamment :

- l’activation globale du service ;
- le fournisseur utilisé ;
- l’identité de l’expéditeur ;
- l’adresse de réponse ;
- les catégories activées ;
- les limites de nouvelles tentatives ;
- les délais de traitement ;
- les durées de conservation ;
- le mode de test ou de simulation.

Les secrets sont gérés séparément des paramètres fonctionnels visibles dans l’administration.

## 17. Mode de test

Un mode de test doit permettre de vérifier les scénarios sans contacter les destinataires réels.

Selon la configuration, il peut :

- neutraliser l’envoi ;
- rediriger tous les messages vers une adresse de test autorisée ;
- enregistrer un aperçu du message ;
- ajouter une mention explicite indiquant qu’il s’agit d’un test.

Le mode de test ne doit jamais être activé silencieusement en production.

## 18. Contrat d’intégration

Un module métier soumet une demande contenant au minimum :

- le type de notification ;
- le canal ;
- le destinataire ;
- les variables du modèle ;
- l’identifiant de corrélation ;
- la clé d’idempotence éventuelle.

Le service retourne :

- l’identifiant de notification ;
- l’état initial ;
- l’indication de prise en charge ;
- un code d’erreur fonctionnel en cas de rejet immédiat.

Le traitement peut être synchrone pour la validation et asynchrone pour l’envoi effectif.

## 19. Administration et supervision

L’interface d’administration associée doit permettre, selon les droits :

- de consulter le volume de notifications ;
- d’identifier les échecs récents ;
- de filtrer par type, module, état et période ;
- de visualiser le nombre de tentatives ;
- de relancer une notification éligible ;
- d’identifier une dégradation du fournisseur ;
- de vérifier les paramètres actifs sans afficher les secrets.

Les indicateurs ne doivent pas constituer un outil de profilage des licenciés ou des représentants légaux.

## 20. Conservation

Les durées de conservation sont définies selon :

- la finalité de la notification ;
- la nécessité de preuve ;
- la sensibilité des données ;
- les obligations applicables ;
- les règles générales de stockage de la plateforme.

À expiration :

- les contenus éventuels sont supprimés ou anonymisés ;
- les métadonnées strictement nécessaires peuvent être conservées selon la politique applicable ;
- les suppressions automatiques sont journalisées de manière agrégée ou technique.

## 21. Critères d’acceptation

Le service est conforme à NOTIF-001 lorsque :

- un module peut demander une notification sans connaître le fournisseur ;
- les modèles sont séparés du code métier et versionnés ;
- les doublons peuvent être évités ;
- chaque demande possède un état consultable ;
- les erreurs temporaires et définitives sont distinguées ;
- les relances sont contrôlées et tracées ;
- les secrets et contenus sensibles ne figurent pas dans les journaux ;
- les opérations administratives sensibles sont auditées ;
- le service peut être désactivé ou utilisé en mode test ;
- l’échec d’une notification ne compromet pas l’intégrité de l’opération métier principale.

## 22. Évolutions prévues

Les évolutions possibles comprennent :

- l’ajout de nouveaux canaux ;
- la gestion des préférences individuelles ;
- les accusés de livraison avancés ;
- la planification différée ;
- les notifications groupées ;
- les tableaux de bord statistiques ;
- la traduction automatique ou multilingue des modèles ;
- les webhooks de retour des fournisseurs.

Ces évolutions devront préserver les principes de découplage, de sécurité, de traçabilité et d’idempotence définis dans ce document.
