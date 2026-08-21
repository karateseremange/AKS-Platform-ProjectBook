| Propriété | Valeur |
|-----------|--------|
| **Document ID** | AUDIT-001 |
| **Titre** | Traçabilité et audit des actions sensibles |
| **Version** | 1.4.1 |
| **Statut** | Extension multi-environnement intégrée et validée en recette — production non configurée |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-21 |

---

# 1. Objet

Le présent document définit les principes de traçabilité et d’audit applicables aux actions sensibles réalisées dans AKS Platform.

L’audit fonctionnel complète la journalisation technique décrite dans `LOG-001`.

Il vise à permettre de répondre de manière fiable aux questions suivantes :

- qui a réalisé une action ;
- quelle action a été réalisée ;
- sur quelle ressource ;
- à quel moment ;
- avec quel résultat ;
- dans quel contexte fonctionnel.

---

# 2. Objectifs

Le dispositif d’audit doit permettre de :

- garantir la traçabilité des opérations administratives importantes ;
- faciliter les contrôles internes ;
- contribuer au diagnostic d’un incident fonctionnel ou de sécurité ;
- identifier les modifications ayant affecté une donnée ou un paramètre ;
- soutenir les obligations de responsabilité et de protection des données ;
- fournir une preuve exploitable sans exposer inutilement de données sensibles.

---

# 3. Distinction entre journalisation et audit

La journalisation et l’audit répondent à des finalités différentes.

## 3.1 Journalisation technique

La journalisation définie dans `LOG-001` concerne notamment :

- les erreurs techniques ;
- les avertissements ;
- les traitements exécutés ;
- les diagnostics applicatifs ;
- l’état des intégrations et services.

## 3.2 Audit fonctionnel

L’audit concerne les actions utilisateur ou système ayant un impact fonctionnel, administratif ou réglementaire.

Exemples :

- modification d’un paramètre ;
- changement de campagne active ;
- décision administrative ;
- génération ou suppression d’un document ;
- modification d’un droit d’accès ;
- lancement manuel d’un traitement sensible ;
- export de données ;
- correction d’une donnée métier.

Une même opération peut produire à la fois un événement de journalisation technique et une entrée d’audit fonctionnel.

---

# 4. Périmètre des actions auditées

Doivent être auditées en priorité les actions suivantes :

- modifications des paramètres centralisés définis dans `CONFIG-001` ;
- actions administratives exécutées depuis le tableau de bord défini dans `ADMIN-001` ;
- opérations touchant aux droits, autorisations ou accès ;
- décisions administratives prises dans les modules métier ;
- génération, téléchargement, export ou suppression de documents sensibles ;
- lancement, annulation ou relance d’un traitement manuel ;
- modifications de données à caractère personnel ;
- opérations de purge ou d’archivage ;
- actions de sécurité significatives ;
- échecs répétés d’opérations sensibles.

Les opérations purement consultatives ne sont auditées que lorsqu’un besoin fonctionnel, de sécurité ou de conformité le justifie.

---

# 5. Structure minimale d’une entrée d’audit

Chaque entrée d’audit doit contenir, lorsque l’information est disponible :

- un identifiant unique ;
- la date et l’heure ;
- l’environnement concerné ;
- l’identité ou l’identifiant de l’acteur ;
- le type d’acteur : utilisateur, administrateur, service ou traitement automatique ;
- l’action réalisée ;
- le module ou service concerné ;
- le type et l’identifiant de la ressource concernée ;
- le résultat : succès, refus, échec ou annulation ;
- un motif ou un contexte lorsque nécessaire ;
- un identifiant de corrélation permettant de relier l’action aux journaux techniques ;
- les métadonnées strictement nécessaires au contrôle.

L’entrée d’audit ne doit pas contenir de secret, de mot de passe, de jeton, de clé privée ou de réponse détaillée à un questionnaire sensible.

---

# 6. Traçabilité des modifications

Pour les modifications importantes, l’audit doit permettre d’identifier :

- la valeur précédente lorsque sa conservation est autorisée ;
- la nouvelle valeur ;
- l’auteur de la modification ;
- la date de prise d’effet ;
- le motif lorsque celui-ci est requis.

Les anciennes et nouvelles valeurs doivent être masquées ou omises lorsqu’elles contiennent des données sensibles ou des secrets techniques.

---

# 7. Intégrité des données d’audit

Les données d’audit doivent être protégées contre :

- la modification non autorisée ;
- la suppression accidentelle ;
- l’altération par un module métier ;
- l’exposition à des utilisateurs non habilités.

Les modules doivent produire des événements d’audit via un service commun d’AKS Core lorsque ce service est disponible.

Ils ne doivent pas gérer chacun un mécanisme d’audit indépendant sans justification documentée.

---

# 8. Consultation

La consultation des données d’audit doit être réservée aux personnes autorisées.

L’interface d’administration doit permettre, selon les besoins :

- la consultation chronologique ;
- le filtrage par période ;
- le filtrage par acteur ;
- le filtrage par module ;
- le filtrage par type d’action ;
- le filtrage par résultat ;
- la recherche par identifiant de ressource ou de corrélation.

L’affichage doit rester compréhensible et ne pas exposer les données techniques inutiles.

---

# 9. Conservation

La durée de conservation des données d’audit doit être :

- proportionnée au besoin opérationnel ;
- compatible avec les obligations réglementaires ;
- cohérente avec la sensibilité des actions tracées ;
- configurable lorsqu’un besoin concret le justifie.

La conservation illimitée par défaut est exclue.

Les règles de purge doivent être documentées, contrôlées et elles-mêmes auditées.

---

# 10. Protection des données personnelles

Le dispositif d’audit applique les principes suivants :

- minimisation des données ;
- limitation des finalités ;
- accès restreint ;
- durée de conservation maîtrisée ;
- masquage des données sensibles ;
- absence de stockage des contenus non nécessaires à la preuve de l’action.

L’audit ne doit jamais devenir une copie parallèle complète des données métier.

---

# 11. Responsabilités

## 11.1 AKS Core

AKS Core fournit le mécanisme commun de production, de stockage et de consultation des événements d’audit.

## 11.2 Modules métier

Chaque module :

- identifie ses actions sensibles ;
- transmet les événements nécessaires au service commun ;
- ne stocke pas de secrets dans les métadonnées ;
- documente les événements spécifiques qu’il produit.

## 11.3 Administration

Le tableau de bord d’administration fournit un accès contrôlé aux informations d’audit utiles à l’exploitation.

## 11.4 Gouvernance produit

Le Product Owner valide les catégories d’actions devant obligatoirement être auditées.

---

# 12. Gestion des échecs

L’échec de l’écriture d’une entrée d’audit doit être journalisé techniquement.

Pour une action critique, l’application doit déterminer explicitement si :

- l’action doit être refusée en l’absence de traçabilité ;
- l’action peut être exécutée avec une alerte ;
- une reprise différée de l’écriture d’audit est possible.

Ce comportement doit être défini selon le niveau de criticité de l’action.

---

# 13. Éléments exclus

Sont exclus du périmètre de `AUDIT-001` :

- la définition détaillée des formats de journaux techniques ;
- la supervision d’infrastructures externes ;
- l’enregistrement exhaustif de toutes les consultations ;
- le stockage de copies complètes des données métier ;
- la conservation de secrets ou de réponses sensibles ;
- la mise en place immédiate d’un système complexe de conformité.

---

# 14. Critères d’acceptation

Le dispositif d’audit est considéré comme conforme lorsque :

- les actions sensibles sont identifiées ;
- chaque événement contient les informations minimales nécessaires ;
- l’acteur, l’action, la ressource, la date et le résultat sont traçables ;
- les événements peuvent être corrélés aux journaux techniques ;
- l’accès aux données d’audit est restreint ;
- les secrets et données sensibles ne sont pas exposés ;
- les règles de conservation sont définies ;
- les modules utilisent un mécanisme commun ;
- les opérations de purge sont contrôlées et tracées ;
- les fonctions disponibles sont documentées.

---

# 15. Dépendances

`AUDIT-001` dépend de :

- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — Services communs d’AKS Core ;
- `ADMIN-001` — Tableau de bord d’administration ;
- `CONFIG-001` — Paramétrage centralisé ;
- `LOG-001` — Journalisation technique ;
- `SECURITY-001` — Principes de sécurité ;
- `GOV-001` — Gouvernance produit.

Les modules métier complètent ce document en identifiant leurs propres actions sensibles.

---

# 16. Références

- `ARCH-001` — Architecture fonctionnelle d’AKS Platform
- `CORE-001` — AKS Core
- `ADMIN-001` — Tableau de bord d’administration
- `CONFIG-001` — Paramétrage centralisé
- `LOG-001` — Journalisation
- `SECURITY-001` — Principes de sécurité
- `GOV-001` — Gouvernance produit
- `AUDIT-001-RECETTE` — Procès-verbal de recette du socle persistant AUDIT-001

---

# 17. Conclusion

L’audit fournit une traçabilité fonctionnelle fiable des actions sensibles réalisées dans AKS Platform.

Il complète la journalisation technique sans la dupliquer, contribue à la sécurité et à la responsabilité des opérations, et doit rester centralisé, proportionné et respectueux des données personnelles.

---

# 18. Premier incrément persistant commun — implémenté et validé

Le premier incrément applicatif transverse matérialisant le service commun `AKS.Core.Audit` attendu par les modules sensibles est implémenté par la PR applicative AKS-Platform #90 sur la tête `11e36134ba291e22c92378c4610cdaf3265a68c8`.

Sa recette Google isolée est concluante : le support `AKS_Audit` a été créé sur le classeur dédié `AKS Audit RECETTE`, deux preuves distinctes et corrélées `INTENTION → REUSSI` ont été persistées et relues, la configuration temporaire a été restaurée et la suite cumulative a réussi **423/423 tests, 0 échec**. Le procès-verbal détaillé est `AUDIT-001-RECETTE`.

Ce résultat lève le prérequis d’existence et de persistance du port d’audit commun pour la reprise du raccordement d’`INSCRIPTIONS-010`. Il ne vaut ni activation en production, ni déploiement Web App, ni autorisation implicite de fusion ou de publication.

Le service d’audit s’appuie sur les composants communs d’AKS Core et réutilise les conventions de corrélation, de masquage et d’erreur de la plateforme. Il ne doit toutefois pas déléguer sa garantie de preuve au fournisseur de `LOG-001`, dont le contrat isole volontairement les pannes afin de préserver le traitement appelant.

## 18.1 Périmètre autorisé

Le premier incrément autorise uniquement :

1. un contrat public minimal `AKS.Core.Audit` ;
2. un modèle d’événement d’audit versionné et immuable ;
3. un support persistant commun distinct de `AKS_Logs` ;
4. une écriture append-only sous verrou ;
5. une relecture exacte après écriture ;
6. la résolution serveur de l’environnement, de l’acteur technique et de l’horodatage ;
7. la minimisation et le masquage avant persistance ;
8. la corrélation avec `LOG-001` et les commandes métier ;
9. un comportement d’échec fermé pour les actions déclarées critiques ;
10. des tests automatiques sur ports injectés, sans API Google ;
11. une recette Google explicite sur une ressource isolée et des données fictives ;
12. le raccordement ultérieur d’`INSCRIPTIONS-010` par injection du port commun.

Sont exclus de cet incrément : la production, une interface de consultation, l’export, la purge automatique, une reprise différée, la modification d’une preuve existante et tout audit autonome propre à un module.

## 18.2 Support physique

Le support Google porte le schéma `aks-audit/1.0` et utilise un onglet dédié `AKS_Audit`, distinct de `AKS_Logs`.

Cette séparation est obligatoire afin que :

- la purge à 90 jours de `LOG-001` ne puisse pas supprimer une preuve d’audit ;
- les droits et opérations propres à l’audit restent distinguables ;
- l’absence, l’incohérence ou l’altération du support soit détectée avant toute action critique ;
- un module métier ne puisse pas écrire directement dans la feuille.

Le support de recette doit se trouver dans une ressource explicitement marquée `RECETTE`. Aucune ressource de production n’est autorisée dans ce premier incrément.

L’identification du support ne repose jamais sur une valeur transmise par le client. Le service résout côté serveur, conformément à `CONFIG-001`, les clés `audit.environment`, `audit.spreadsheetId` et `audit.schemaVersion`, puis vérifie respectivement `RECETTE`, l’identifiant exact du classeur ouvert et `aks-audit/1.0` avant toute lecture ou écriture. Une clé absente, dupliquée, inconnue ou incohérente provoque un refus fermé.

### 18.2.1 Définitions `CONFIG-001`

Les trois clés sont inscrites au registre central de configuration. Elles ne disposent d’aucune valeur par défaut : leur absence doit rester visible et produire un refus fermé.

| Clé | Type | Portée | Obligatoire | Défaut | Validation | Sensible | Administrable |
|---|---|---|---|---|---|---|---|
| `audit.environment` | Énumération | Environnement | Oui | Aucune | Valeur exacte `RECETTE` ; toute autre valeur est refusée dans cet incrément | Non | Non |
| `audit.spreadsheetId` | Identifiant Google Sheets sous forme de texte | Environnement | Oui | Aucune | Texte non vide au format d’identifiant Google ; doit correspondre exactement au classeur ouvert et marqué `RECETTE` | Oui — valeur technique restreinte et masquée dans les sorties publiques | Non |
| `audit.schemaVersion` | Version de schéma sous forme de texte | Environnement | Oui | Aucune | Valeur exacte `aks-audit/1.0` | Non | Non |

Ces valeurs sont configurées uniquement par le circuit technique contrôlé de recette. Elles ne sont ni héritées d’une portée plus générale, ni modifiables depuis l’interface d’administration, ni acceptées depuis une requête cliente. Toute évolution de type, portée, validation, sensibilité ou administrabilité exige une nouvelle version de ce contrat.

## 18.3 Schéma minimal `aks-audit/1.0`

Les colonnes sont figées dans l’ordre suivant :

`schema_version`, `audit_id`, `occurred_at`, `environment`, `actor_type`, `actor_id`, `action`, `module`, `target_type`, `target_id`, `result`, `reason_code`, `correlation_id`, `metadata_json`, `created_at`, `created_by`.

Les règles suivantes s’appliquent :

- `schema_version` vaut exactement `aks-audit/1.0` ;
- `audit_id` est unique, non réutilisable et résolu côté serveur ;
- `occurred_at` décrit l’événement et `created_at` la persistance de la preuve ;
- `environment` est résolu côté serveur et vaut `RECETTE` dans cet incrément ;
- `actor_type` appartient à un catalogue fermé : `USER`, `ADMIN`, `SERVICE` ou `SYSTEM` ;
- `actor_id` ne peut jamais être fourni librement par l’appelant : pour `USER` et `ADMIN`, il est résolu après autorisation depuis le contexte d’identité serveur ; pour `SERVICE` et `SYSTEM`, il provient d’une identité technique injectée côté serveur ; toute identité absente, non autorisée ou incohérente provoque un refus fermé ;
- `action`, `module`, `target_type`, `result` et `reason_code` appartiennent à des catalogues contrôlés ;
- `target_id` est omis ou pseudonymisé lorsque l’identifiant métier n’est pas nécessaire à la preuve ;
- `result` appartient à `INTENTION`, `REUSSI`, `ECHEC`, `REFUSE` ou `ANNULE` ;
- `correlation_id` est obligatoire et permet le rapprochement avec les journaux et commandes ;
- `metadata_json` contient uniquement des métadonnées minimisées, masquées et sérialisées de manière déterministe ;
- `created_by` est une identité technique injectée côté serveur et ne peut pas provenir de l’appelant.

### 18.3.1 Catalogues fermés

Le registre figé `AKS.Core.Audit.Catalogs` constitue l’emplacement applicatif unique des catalogues du schéma `aks-audit/1.0`. Après le raccordement d’`INSCRIPTIONS-010` et du quatrième lot d’`ACCESS-002-01`, les valeurs documentées sont :

| Champ | Valeurs autorisées |
|---|---|
| `action` | `DOSSIER_CREATE`, `DOSSIER_UPDATE`, `ACCESS_REGISTRY_UPDATE` |
| `module` | `INSCRIPTIONS`, `ACCESS` |
| `target_type` | `DOSSIER`, `ACCESS_REGISTRY` |
| `reason_code` | chaîne vide, `INSCRIPTIONS_COMMAND_FAILED`, `INSCRIPTIONS_CONTROL_FAILED`, `INSCRIPTIONS_ATTEMPTS_EXHAUSTED`, `INSCRIPTIONS_RECOVERY_ABSENT`, `INSCRIPTIONS_RECONCILIATION_AMBIGUOUS`, `ACCESS_CAPABILITY_DENIED`, `ACCESS_COMMAND_INVALID`, `ACCESS_REGISTRY_INVALID`, `ACCESS_REGISTRY_CONFLICT`, `ACCESS_REGISTRY_LOCK_UNAVAILABLE`, `ACCESS_LAST_MANAGER_REQUIRED`, `ACCESS_REGISTRY_WRITE_FAILED`, `ACCESS_REGISTRY_RESTORE_FAILED`, `ACCESS_AUDIT_REQUIRED`, `UNEXPECTED_ERROR` |

Les catalogues `actor_type`, `result` et `criticality` restent ceux définis dans les sections 18.3 et 18.6. Une valeur inconnue n’est jamais persistée : une erreur technique non répertoriée est réduite à `UNEXPECTED_ERROR`, sans message libre ni détail sensible. Toute extension d’un catalogue exige une évolution documentée d’`AUDIT-001`, une mise à jour explicite du registre figé et des tests positifs et négatifs.

### 18.3.2 Métadonnées ACCESS minimisées

Pour `ACCESS_REGISTRY_UPDATE`, le schéma fermé de `metadata_json` autorise uniquement :

- `beforeRevision`, `proposedRevision` et `afterRevision` ;
- `changedAccountIds`, limité aux identités techniques normalisées des comptes modifiés ;
- `changedCount`, strictement cohérent avec la liste des comptes ciblés ;
- `selfModification`, indiquant une modification des propres droits de l’acteur ;
- `restored`, indiquant que l’état précédent a été restauré.

Ces métadonnées sont obligatoires pour l’action ACCESS, validées et sérialisées par le service commun. Le registre complet, les noms d’affichage, rôles, affectations, capacités, dates et commentaires libres ne sont pas recopiés dans la preuve persistante.

### 18.3.3 Représentation canonique des cellules

Les seize cellules sont comparées sous leur représentation canonique, sans conversion implicite par le support :

- toutes les cellules du schéma sont persistées comme textes ;
- `occurred_at` et `created_at` utilisent UTC au format ISO 8601 avec millisecondes, exactement `YYYY-MM-DDTHH:mm:ss.sssZ` ;
- les champs textuels obligatoires sont normalisés selon leur catalogue puis refusés s’ils sont vides ;
- un `target_id` ou un `reason_code` absent est représenté par la chaîne vide `""`, jamais par `null`, `undefined` ou une cellule physiquement absente ;
- `metadata_json` contient toujours un objet JSON compact ; l’absence de métadonnée vaut exactement `{}` ;
- les clés de chaque objet de `metadata_json` sont triées récursivement dans l’ordre lexicographique ; l’ordre des tableaux est conservé ; aucun espace non significatif n’est émis ;
- les booléens sont les littéraux JSON `true` ou `false`, les nombres utilisent leur écriture JSON finie sans format local, et les valeurs `NaN`, infinies, `undefined` ou fonctions sont refusées ;
- une date admise dans `metadata_json` est convertie au même format UTC ISO 8601 ; `null` n’est conservé que si le contrat de métadonnée l’autorise explicitement ;
- la comparaison après relecture porte sur les seize textes canoniques dans l’ordre figé des colonnes.

Aucun secret, jeton, contenu médical, coordonnée, règlement, payload métier complet ou valeur libre non contrôlée n’est autorisé.

## 18.4 Contrat du port commun

Le port commun expose conceptuellement une seule opération d’écriture :

```text
AKS.Core.Audit.record(event) -> persistedProof
```

L’appelant fournit uniquement les éléments fonctionnels autorisés. Le service commun :

1. valide le contrat et les catalogues ;
2. résout les métadonnées techniques côté serveur ;
3. minimise et masque les données ;
4. construit un événement immuable ;
5. obtient le verrou applicatif ;
6. vérifie le support et le schéma ;
7. ajoute une seule ligne ;
8. relit la ligne persistée ;
9. compare cellule par cellule la preuve attendue et la preuve relue ;
10. retourne une preuve immuable ou lève une erreur contrôlée.

Une réussite apparente du fournisseur, l’existence d’une ligne ou la seule égalité de l’identifiant ne suffisent pas. Toute divergence de contenu produit un échec d’audit.

## 18.5 Verrouillage et intégrité

- l’écriture utilise `LockService.getScriptLock()` derrière un port injecté ;
- l’attente est bornée et l’absence de verrou provoque un échec contrôlé ;
- le verrou est toujours libéré dans un bloc `finally` ;
- l’unicité de `audit_id` est vérifiée sous verrou avant ajout ;
- le support est append-only pour les consommateurs ;
- aucune API publique de modification ou suppression d’une preuve n’est exposée ;
- une ligne partiellement écrite ou relue avec divergence est considérée comme non probante ;
- l’échec est journalisé techniquement selon `LOG-001`, sans masquer l’échec fonctionnel retourné au service appelant.

## 18.6 Criticité et échec fermé

Chaque appel indique une criticité issue d’un catalogue contrôlé : `CRITICAL` ou `STANDARD`.

Pour `CRITICAL` :

- l’absence du service, du support, du verrou ou de la preuve persistée interdit de confirmer l’action ;
- le code appelant reçoit une erreur contrôlée ;
- aucune réussite métier ne peut être retournée sans preuve d’audit complète ;
- la reprise éventuelle doit être explicitement conçue dans un incrément ultérieur.

Pour `STANDARD`, le comportement ne peut être dégradé silencieusement : toute poursuite malgré l’échec doit être autorisée par un contrat métier documenté. Aucun cas `STANDARD` dégradé n’est autorisé par le présent incrément.

## 18.7 Cycle corrélé

Une action critique peut produire plusieurs preuves partageant le même `correlation_id` :

- `INTENTION` avant la mutation ;
- `REUSSI` après confirmation de la mutation ;
- `ECHEC`, `REFUSE` ou `ANNULE` lorsque l’action n’aboutit pas.

Le document métier définit les étapes obligatoires de son cycle. Pour `INSCRIPTIONS-010`, les événements `INTENTION`, `REUSSI` et `ECHEC` restent ceux déjà imposés. Le port commun n’invente pas la décision métier et ne modifie pas le journal de commandes.

Pour `ACCESS-002-01`, `INTENTION` doit être persisté avant toute mutation du registre. Une fin normale produit `REUSSI`. Un refus produit `REFUSE` sans écriture. Un échec produit `ECHEC`. Si la preuve finale échoue après sauvegarde, la commande restaure et vérifie l’état précédent avant de retourner une erreur contrôlée ; aucune réussite ne peut être confirmée sans preuve finale persistée.

## 18.8 Conservation

Le premier incrément ne met en œuvre aucune purge automatique des preuves d’audit.

Avant toute ouverture en production, une durée de conservation, une procédure d’archivage et une purge auditée devront être validées. Elles devront respecter `STORAGE-001`, empêcher toute action du mécanisme de purge de `LOG-001` sur `AKS_Audit` et fournir une preuve avant/après.

En recette, le nettoyage est une opération explicite, limitée aux données fictives créées par la campagne, exécutée sous verrou et vérifiée par empreinte. Il ne constitue pas une politique de conservation de production.

## 18.9 Validation automatique

Les tests automatiques doivent démontrer au minimum :

- validation stricte du schéma et des catalogues ;
- résolution serveur des identités et horodatages techniques ;
- minimisation et masquage avant appel du dépôt ;
- immutabilité de l’événement et de la preuve retournée ;
- unicité de l’identifiant ;
- obtention et libération du verrou ;
- relecture exacte après écriture ;
- refus d’une écriture volontairement altérée mais structurellement valide ;
- propagation de l’échec pour une action critique ;
- corrélation identique entre les preuves d’un même cycle ;
- absence d’appel à `SpreadsheetApp`, `DriveApp` ou `LockService` dans les tests de domaine ;
- absence de dépendance à un service d’audit propre à Inscriptions.

Les nouveaux cas sont raccordés à `AKS_runValidationSuiteV11`. Aucun total n’est inscrit dans ce document avant exécution probante dans Apps Script.

## 18.10 Recette Google isolée

La recette réelle doit démontrer :

1. le refus d’un environnement ou d’un support non marqué `RECETTE` ;
2. le refus d’un schéma ou d’un en-tête incohérent ;
3. l’écriture unique sous concurrence ;
4. la relecture exacte de toutes les colonnes ;
5. le refus d’une preuve altérée ;
6. l’échec fermé d’une action critique lorsque le support est indisponible ;
7. la corrélation d’un cycle `INTENTION` puis `REUSSI` ou `ECHEC` ;
8. l’absence de modification d’`AKS_Logs` et de toute donnée métier ;
9. la remise du support de recette dans son état initial ;
10. une preuve avant/après par en-têtes, nombre de lignes et empreinte.

Les fonctions de recette sont nommées explicitement, exclues de la suite cumulative, inaccessibles depuis les routes publiques et administratives, et exigent une confirmation technique avant mutation.

La campagne du 9 août 2026 a validé la persistance réelle sur la ressource isolée, la corrélation du cycle, la restauration de la configuration temporaire et la non-régression cumulative. Les preuves détaillées sont consignées dans `AUDIT-001-RECETTE`.

## 18.11 Codes d’erreur minimaux

| Code | Signification |
|---|---|
| `AUDIT_REQUIRED` | Port commun absent pour une action qui l’exige |
| `AUDIT_EVENT_INVALID` | Événement ou catalogue non conforme |
| `AUDIT_RECIPE_REQUIRED` | Environnement différent de `RECETTE` |
| `AUDIT_SCHEMA_MISMATCH` | Support, version ou en-tête incompatible |
| `AUDIT_LOCK_TIMEOUT` | Verrou non obtenu dans le délai autorisé |
| `AUDIT_DUPLICATE` | Identifiant d’audit déjà présent |
| `AUDIT_PERSISTENCE_FAILED` | Écriture ou relecture impossible |
| `AUDIT_PROOF_MISMATCH` | Preuve relue différente de la preuve attendue |
| `AUDIT_RECIPE_PROOF_INCOMPLETE` | État initial non restauré ou preuve avant/après insuffisante |

Les messages publics restent génériques et corrélables. Les détails techniques sont confiés à `LOG-001` après masquage.

## 18.12 Critères d’acceptation de l’incrément

L’implémentation est déclarée conforme pour le périmètre de recette isolée décrit ici :

- `AKS.Core.Audit` est le seul point d’entrée commun ;
- le support `AKS_Audit` est distinct de `AKS_Logs` et conforme à `aks-audit/1.0` ;
- les écritures sont verrouillées, append-only et intégralement relues ;
- une altération persistée est détectée ;
- les identités fonctionnelles et techniques sont résolues ou injectées côté serveur après autorisation et aucune valeur libre de l’appelant ne peut alimenter `actor_id` ou `created_by` ;
- les données sont minimisées et masquées avant persistance ;
- une action critique échoue fermée sans preuve ;
- les tests ciblés et la suite cumulative réussissent sans échec ;
- la recette Google isolée réussit et restaure sa configuration temporaire ;
- aucune donnée réelle, route, interface, production, export ou purge automatique n’est introduite ;
- `INSCRIPTIONS-010` doit maintenant consommer ce port par injection sans créer de service parallèle.

## 18.13 Preuves de validation du 9 août 2026

- PR applicative : `AKS-Platform #90` ;
- tête exécutée : `11e36134ba291e22c92378c4610cdaf3265a68c8` ;
- AUDIT-001 ciblé : **43/43** ;
- CONFIG-001 : **29/29** ;
- syntaxe : **188/188 fichiers `.gs`** ;
- sonde concurrente : **3/3** ;
- `clasp push` : **221 fichiers synchronisés** sans erreur affichée ;
- préparation : onglet `AKS_Audit`, **16 en-têtes**, `existingAuditCount: 0` ;
- exécution : **2 preuves persistantes corrélées**, `configurationRestored: true` ;
- contrôle visuel : **3 lignes** ;
- suite cumulative après recette : **423/423 réussis, 0 échec**.

## 18.14 Extension ACCESS-002-01 — état de validation

L’extension et son correctif de compatibilité ont été fusionnés dans `develop` par la [PR applicative #93](https://github.com/karateseremange/AKS-Platform/pull/93), au commit de fusion [`91ba7e3`](https://github.com/karateseremange/AKS-Platform/commit/91ba7e37972ce3ab1d96aa74bbdf4fc1bc4d38e8), après les commits [`4647478`](https://github.com/karateseremange/AKS-Platform/commit/4647478bac0b9cbeff77687d24677338b64429dd) et [`84ea68f`](https://github.com/karateseremange/AKS-Platform/commit/84ea68f09b889b3caa2331122ef64d662f890c15).

Le correctif utilise un seul verrou partagé par ACCESS et AUDIT. La voie « verrou déjà détenu » exige `hasLock()`, n’acquiert pas un second verrou et ne libère jamais celui de la commande appelante. L’autorisation d’audit accepte les gestionnaires reconnus par la compatibilité transitoire `access/1.0` ou `AKS.Admin.Access` ; un appelant refusé ne peut persister que l’événement ACCESS `USER/REFUSE` strictement borné.

Les contrôles locaux réussissent à **46/46 pour la suite complète AUDIT-001**, dont la persistance d’une preuve ACCESS minimisée, le refus de métadonnées incohérentes et le cycle complet ACCESS avec le même verrou injecté. ACCESS-002-01 atteint parallèlement **19/19** et la syntaxe **193/193 fichiers `.gs`**. Après synchronisation de 226 fichiers de la tête `84ea68f` dans le projet Apps Script isolé de recette, la suite cumulative réelle réussit à **477/477 tests, 0 échec**. Le recomptage confirme 477 fonctions uniques ; la valeur préparatoire 478 était erronée.

Aucune preuve n’a été écrite dans une ressource Google réelle pour ce lot, aucun registre ou compte réel n’a été modifié et aucun déploiement n’a été effectué.

---

# 19. Extension de production

Le cadrage [AUDIT-001-PRODUCTION](AUDIT-001-PRODUCTION.md) définit l’extension multi-environnement nécessaire à ACCESS : supports strictement séparés, liaison au projet Apps Script, contrôle persistant générique, fermeture avant configuration, conservation initiale de 1 095 jours, purge différée et double niveau d’autorisation.

Cette extension est intégrée dans `develop` par la [PR applicative #125](https://github.com/karateseremange/AKS-Platform/pull/125), au commit [`ab52dc6`](https://github.com/karateseremange/AKS-Platform/commit/ab52dc6200ca5e138883d182cfcd700352276dad). La validation Apps Script de recette réussit à **62/62** pour AUDIT-001 et **660/660** pour la suite cumulative. Aucun support, paramètre, précontrôle, test d’écriture ou autre opération réelle de production n’a été exécuté.

---

# 20. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.4.1 | 2026-08-21 | Extension AUDIT multi-environnement intégrée par la PR #125 au commit `ab52dc6` et validée en recette à **62/62** et **660/660**, sans opération réelle de production |
| 1.4.0 | 2026-08-20 | Extension AUDIT de production cadrée dans AUDIT-001-PRODUCTION : P1.1 à P1.12 validés, rétention initiale 1 095 jours, aucune purge ni opération réelle autorisée |
| 1.3.4 | 2026-08-09 | Extension ACCESS-002-01 intégrée dans `develop` par la PR applicative #93 au commit de fusion `91ba7e3` ; validation 477/477 conservée et aucune donnée réelle modifiée |
| 1.3.3 | 2026-08-09 | Recette cumulative réelle de l’extension ACCESS consignée sur la tête `84ea68f` : 226 fichiers synchronisés dans Apps Script isolé, 477/477 tests réussis sans échec et inventaire préparatoire 478 corrigé |
| 1.3.2 | 2026-08-09 | Correctif ACCESS documenté : verrou ACCESS/AUDIT partagé sans acquisition imbriquée, autorisation alignée sur la compatibilité transitoire, refus `USER/REFUSE` bornés et suite AUDIT complète raccordée ; validations locales 46/46 et syntaxe 193/193, sans preuve Google réelle |
| 1.3.1 | 2026-08-09 | Extension documentée du catalogue persistant pour ACCESS-002-01 : action, module, cible, codes motif et métadonnées fermées ; preuves corrélées obligatoires avant/après, restauration sur échec final et validation locale ciblée 9/9 sans donnée réelle |
| 1.3.0 | 2026-08-09 | Validation de l’implémentation et de la recette isolée du premier socle persistant commun : PR #90, deux preuves corrélées persistées, configuration restaurée et suite cumulative 423/423 ; prérequis audit d’INSCRIPTIONS-010 levé |
| 1.2.1 | 2026-08-08 | Précision du contrat implémentable : provenance serveur obligatoire d’`actor_id`, catalogues fermés initiaux, représentation canonique des seize cellules et définitions complètes des trois clés `CONFIG-001` |
| 1.2.0 | 2026-08-08 | Proposition du premier incrément persistant commun : `AKS.Core.Audit`, support `AKS_Audit` distinct d’`AKS_Logs`, schéma `aks-audit/1.0`, écriture verrouillée append-only, relecture exacte, échec fermé, minimisation, corrélation et recette isolée, sans production, consultation, export ni purge automatique |
| 1.1.1 | 2026-07-24 | Normalisation du statut documentaire vers le statut officiel Validé |
| 1.1.0 | 2026-07-19 | Consolidation des principes transverses d’audit et de traçabilité des actions sensibles |
