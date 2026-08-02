# INSCRIPTIONS-005 — Contrats techniques, stockage et intégrations

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-005 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Nature** | Architecture technique et contrats d’intégration |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit les contrats techniques nécessaires à l’implémentation progressive d’**AKS Inscriptions** : stockage physique, schémas versionnés, allocation des identifiants, concurrence, idempotence, audit fonctionnel et intégrations externes.

Il complète `INSCRIPTIONS-001` à `INSCRIPTIONS-004`. Il ne constitue pas une autorisation de développer ou d’écrire dans les données réelles. La stratégie de recette cumulative relève d’`INSCRIPTIONS-006`.

## 2. Principes d’architecture

1. Les données nominatives métier sont séparées des paramètres, journaux techniques et fichiers sources.
2. Le domaine dépend de dépôts injectables et non directement des API Google.
3. Une analyse d’import ne modifie jamais le référentiel métier.
4. Toute écriture sensible est autorisée, idempotente, verrouillée, contrôlée et auditée.
5. Les identifiants AKS sont attribués par des séquences persistantes et ne sont jamais réutilisés.
6. La recette et la production utilisent des ressources physiques distinctes.
7. Les intégrations existantes sont adaptées progressivement, sans créer de seconde source de vérité.
8. Les dates métier utilisent `Europe/Paris` ; les valeurs et fuseaux sources restent traçables.

## 3. Répartition des supports

| Nature | Support cible | Contenu autorisé |
|---|---|---|
| Référentiel Inscriptions | Google Sheets privé dédié | Licenciés, responsables, dossiers saisonniers, formalités, règlements, lots et commandes |
| Configuration technique | `CONFIG-001` et `PropertiesService` | Identifiants de ressources, versions actives, options non nominatives |
| Sources et exports | Dossiers Google Drive privés | Fichiers importés, rapports bornés, exports temporaires et sauvegardes |
| Journal technique | `LOG-001` | Événements minimisés, codes d’erreur et corrélations sans contenu nominatif |
| Audit fonctionnel | Support persistant conforme à `AUDIT-001` | Acteur, action, cible technique, résultat, motif et horodatage |
| Cache | `CacheService` | Optimisation non autoritative, jamais preuve d’idempotence ou de réussite |

`PropertiesService` n’est pas un référentiel de personnes. Google Drive n’est pas une base métier. Le classeur Inscriptions reste la source de vérité initiale de la V1, derrière un contrat de dépôt permettant une évolution ultérieure.

## 4. Ressources physiques et environnements

Les paramètres suivants sont requis sans intégrer leurs valeurs au code :

| Clé logique | Rôle |
|---|---|
| `INSCRIPTIONS_ENVIRONMENT` | `RECETTE` ou `PRODUCTION` |
| `INSCRIPTIONS_SPREADSHEET_ID` | Classeur métier de l’environnement |
| `INSCRIPTIONS_IMPORT_FOLDER_ID` | Dépôt privé des sources importées |
| `INSCRIPTIONS_EXPORT_FOLDER_ID` | Dépôt privé des rapports et exports |
| `INSCRIPTIONS_BACKUP_FOLDER_ID` | Sauvegardes et archives contrôlées |
| `INSCRIPTIONS_SCHEMA_VERSION` | Version attendue du schéma |
| `INSCRIPTIONS_TIMEZONE` | Doit valoir `Europe/Paris` |

La recette possède ses propres identifiants, dossiers, partages et jeux de données. Une commande refuse de démarrer lorsque l’environnement déclaré ne correspond pas aux ressources attendues.

## 5. Schéma du classeur Inscriptions

Chaque onglet possède une ligne d’en-tête versionnée, des identifiants stables et les colonnes techniques minimales `created_at`, `created_by`, `updated_at`, `updated_by` et `row_version` lorsque l’objet est modifiable.

| Onglet logique | Responsabilité principale |
|---|---|
| `Metadata` | Version du schéma, environnement, fuseau et dates de migration |
| `Sequences` | Compteurs persistants par type et périmètre |
| `Licencies` | Identité stable de la personne et numéro FFKDA éventuel |
| `ResponsablesLegaux` | Personnes responsables distinctes des pratiquants |
| `LiensResponsables` | Relations entre licenciés, responsables et saisons |
| `DossiersSaisonniers` | Dossier par licencié, saison et section |
| `Affectations` | Section, cours, décision de place et historique utile |
| `Formalites` | Pièces et preuves administratives sans détail médical |
| `Reglements` | Montants, statuts, modes, remises et aides sans donnée bancaire |
| `LiensExternes` | Références Questionnaire santé, SIKADA et systèmes transitoires |
| `LotsImport` | Provenance, version d’adaptateur et état du lot |
| `LignesImport` | Localisation externe, valeurs sources nécessaires, empreinte et résultat d’analyse |
| `DecisionsImport` | Correspondances validées, rejets, motifs et acteurs |
| `Commandes` | Clés idempotentes, intention, état et résultat durable |

Les noms physiques définitifs sont figés avant implémentation dans une constante de schéma. Un changement de colonne exige une nouvelle version et une migration contrôlée ; aucun code ne crée ou réordonne silencieusement des colonnes en production.

## 6. Invariants du référentiel

- `licencie_id` est unique et permanent ;
- `numero_ffkda`, lorsqu’il est renseigné, est stocké comme texte et reste unique ;
- un seul dossier actif existe par `licencie_id + saison_id + section_code` ;
- un responsable légal est une entité distincte et peut être lié à plusieurs licenciés ;
- une référence externe n’est liée qu’après contrôle de son type et de sa provenance ;
- aucune réponse médicale détaillée ni donnée bancaire n’est conservée ;
- les états administratif, place, fédéral et activation restent indépendants ;
- toute ligne modifiable porte une version strictement croissante.

Le format actuellement observé du numéro FFKDA est `8 chiffres + 1 lettre`. La validation doit accepter ce format comme texte sans supprimer les zéros initiaux et sans convertir la valeur en nombre.

## 7. Service d’allocation des identifiants

| Type | Format | Portée de séquence |
|---|---|---|
| Licencié | `LIC-000001` | Globale et permanente |
| Dossier | `INS-2026-000001` | Année de début de saison |
| Lot d’import | `IMP-2026-000001` | Année de début de saison ; le type d’import reste un attribut distinct |

L’onglet `Sequences` conserve au minimum `sequence_type`, `scope_key`, `last_value`, `row_version`, `updated_at` et `updated_by`.

L’allocation suit obligatoirement ce cycle :

1. acquérir le verrou serveur commun ;
2. lire la séquence et sa version ;
3. calculer la valeur suivante ;
4. écrire la nouvelle valeur et incrémenter la version ;
5. relire et vérifier la valeur persistée ;
6. produire l’identifiant formaté ;
7. libérer le verrou dans tous les cas.

Un numéro consommé n’est jamais réattribué, même si la commande métier échoue ensuite. La recherche du plus grand identifiant existant et le comptage des lignes sont interdits comme mécanisme d’allocation.

## 8. Concurrence et versions optimistes

Les écritures métier utilisent un verrou à portée applicative et une version optimiste par objet.

Une commande reçoit les versions attendues des objets qu’elle modifie. Après acquisition du verrou, le service relit les objets. Toute divergence produit `INSCRIPTIONS_CONFLICT` sans écriture partielle silencieuse.

Les opérations multi-onglets sont groupées autant que possible. Comme Google Sheets ne fournit pas de transaction relationnelle, l’intention durable et l’état de la commande permettent de détecter puis reprendre une interruption.

## 9. Commandes idempotentes durables

Chaque commande sensible possède :

- `request_id`, fourni ou généré avant l’appel ;
- `command_type` ;
- `actor_id` ;
- empreinte normalisée de la demande ;
- état `INTENTION`, `EN_COURS`, `CONFIRMEE`, `ECHEC_RECUPERABLE` ou `ECHEC_FINAL` ;
- résultat technique minimal et identifiant de corrélation ;
- dates de création et de dernière tentative.

Pour une même clé :

- même type et même empreinte : le résultat déjà confirmé est retourné ;
- contenu différent : refus `INSCRIPTIONS_IDEMPOTENCY_CONFLICT` ;
- état interrompu : reprise selon une procédure explicite, jamais nouvelle application aveugle.

`CacheService` peut accélérer une vérification, mais seule la table persistante `Commandes` fait autorité.

## 10. Cycle obligatoire d’une écriture sensible

1. identifier l’acteur Google et recalculer ses capacités via `ACCESS-001` ;
2. valider la commande, son périmètre et sa clé idempotente ;
3. acquérir le verrou ;
4. relire les objets et vérifier les versions attendues ;
5. persister l’intention de commande ;
6. allouer les identifiants nécessaires ;
7. effectuer les écritures groupées ;
8. relire et contrôler les invariants ;
9. persister l’audit fonctionnel obligatoire ;
10. confirmer la commande et rendre un résultat corrélable.

Si l’audit fonctionnel requis ne peut pas être persisté, l’opération n’est pas déclarée réussie. Le traitement doit empêcher l’activation ou signaler un état récupérable selon le point d’interruption.

## 11. Contrats de dépôts injectables

Le domaine dépend au minimum des ports suivants :

| Port | Responsabilité |
|---|---|
| `LicencieRepository` | Rechercher, créer et mettre à jour un licencié |
| `DossierRepository` | Lire et persister un dossier saisonnier versionné |
| `ImportBatchRepository` | Conserver lots, lignes, empreintes et décisions |
| `CommandRepository` | Garantir l’idempotence durable et la reprise |
| `SequenceRepository` | Allouer les séquences sous verrou |
| `AuditRepository` | Persister la preuve fonctionnelle obligatoire |
| `ExternalSourceReader` | Lire une source sans écrire dans le domaine |

Les tests emploient des doubles en mémoire. Les adaptateurs Apps Script implémentent les mêmes ports pour Sheets, Drive, Forms et les services transverses.

## 12. Intégration Google Forms

Les trois feuilles sont lues uniquement par des identifiants configurés et selon les adaptateurs versionnés d’`INSCRIPTIONS-003`.

L’import conserve : source logique, classeur, onglet, localisation externe, horodatage reçu, valeur brute nécessaire, fuseau source, version d’adaptateur et empreinte. Une colonne absente reste `INCONNU` et ne devient pas `NON`.

Le moteur sépare trois opérations :

1. analyse sans écriture métier ;
2. décisions administratives sur les correspondances ;
3. application explicite d’un lot validé.

Le Body Karaté, dont la source ne contenait aucune réponse lors de l’audit, exige un jeu de recette avant toute première application réelle.

## 13. Intégration Questionnaire santé

AKS Inscriptions ne lit ni ne conserve les réponses médicales détaillées. Le lien externe contient uniquement :

- la référence `QS-AAAA-NNNNNN` ;
- le résultat administratif strictement nécessaire ;
- la date de contrôle ;
- les éléments minimaux ayant permis de vérifier l’identité ;
- la provenance et l’acteur du rapprochement.

Un rapprochement ambigu est refusé. L’absence de référence ne doit pas être interprétée comme une formalité satisfaite.

## 14. Intégration SIKADA

L’intégration initiale est un import manuel analysé puis appliqué séparément. L’échantillon audité est un texte tabulé Windows-1252 portant l’extension `.xls`, avec certaines valeurs enveloppées sous la forme `="..."`.

Le lecteur doit :

- contrôler le type réel du fichier et son encodage ;
- normaliser les fins de ligne et séparateurs ;
- retirer les enveloppes `="..."` sans exécuter de formule ;
- rejeter les colonnes inattendues ou obligatoires manquantes ;
- traiter toutes les valeurs comme des données non fiables ;
- rapprocher sans application automatique des cas ambigus ;
- conserver l’empreinte et la provenance du fichier.

Les 12 en-têtes exacts ne deviennent un contrat qu’après conservation d’un échantillon technique anonymisé dans la recette. L’échantillon actuel couvre `SHOTOKAN` et `LIC`, mais pas encore le produit ou style Body Karaté.

## 15. Intégration Analytics et Présences

Après activation explicite, Inscriptions devient le producteur des licenciés actifs de la saison.

La transition initiale conserve les cinq classeurs Analytics existants. Un adaptateur borné peut mettre à jour uniquement leurs feuilles `Licenciés` : il ne modifie ni séances, ni présences, ni rapports historiques.

Chaque synchronisation :

- est déclenchée après une commande métier confirmée ;
- utilise l’identifiant interne AKS comme clé cible dès que le schéma le permet ;
- conserve le numéro FFKDA comme donnée fédérale distincte ;
- produit un rapport d’écarts avant publication ;
- peut être rejouée sans doublon ;
- n’active pas un cours absent des catalogues.

`BODY_KARATE` doit être ajouté aux catalogues, paramètres, contrôles d’accès, fournisseurs Analytics et tests avant toute activation. Le schéma cible ne remplace les cinq classeurs existants qu’après migration et recette explicites.

## 16. Fuseaux et horodatages

Le fuseau officiel d’AKS Platform est `Europe/Paris`.

Avant implémentation, le manifeste Apps Script doit être corrigé depuis `America/New_York`. Les sources Google Forms actuellement en `Africa/Ceuta` sont lues avec leur fuseau d’origine, puis normalisées sans perdre la valeur source.

Les horodatages techniques sont persistés dans un format non ambigu. Les dates métier sont affichées selon `Europe/Paris`. Aucun calcul de saison ou de date limite ne dépend du fuseau par défaut d’un classeur.

## 17. Sécurité, confidentialité et conservation

- tous les classeurs, dossiers, rapports et sauvegardes sont privés par défaut ;
- les droits Drive complètent les contrôles `ACCESS-001` ;
- les rapports nominatifs ne sont jamais partagés par lien ;
- `LOG-001` ne reçoit ni identité complète, ni détail médical, ni contenu de règlement ;
- les exports temporaires possèdent une finalité, un propriétaire et une échéance ;
- les sauvegardes sont protégées au même niveau que la source ;
- suppression et restauration sont des commandes auditées.

Les durées précises de conservation des dossiers, lots, sources, exports, sauvegardes et dossiers abandonnés doivent être validées avant la production. Tant qu’elles ne le sont pas, aucune purge automatique n’est activée.

## 18. Sauvegarde, restauration et migrations

Avant toute migration de schéma ou import massif :

1. vérifier la version et l’environnement ;
2. produire une sauvegarde horodatée dans le dossier dédié ;
3. vérifier que la sauvegarde est lisible et privée ;
4. appliquer la migration sous verrou ;
5. relire le schéma et les invariants ;
6. produire un rapport et un audit ;
7. conserver une procédure de retour documentée.

Une restauration est toujours testée en recette avant d’être utilisable en production. Elle ne réattribue jamais un identifiant déjà consommé.

## 19. Codes d’erreur minimaux

| Code | Signification |
|---|---|
| `INSCRIPTIONS_SCHEMA_MISMATCH` | Version ou en-têtes incompatibles |
| `INSCRIPTIONS_ENVIRONMENT_MISMATCH` | Ressource de recette/production incohérente |
| `INSCRIPTIONS_LOCK_TIMEOUT` | Verrou non obtenu dans le délai prévu |
| `INSCRIPTIONS_CONFLICT` | Version concurrente détectée |
| `INSCRIPTIONS_IDEMPOTENCY_CONFLICT` | Même clé, demande différente |
| `INSCRIPTIONS_INVARIANT_FAILED` | Relecture métier non conforme |
| `INSCRIPTIONS_AUDIT_REQUIRED` | Audit fonctionnel obligatoire indisponible |
| `INSCRIPTIONS_SOURCE_UNSUPPORTED` | Source ou version d’adaptateur inconnue |
| `INSCRIPTIONS_IMPORT_AMBIGUOUS` | Correspondance administrative non résolue |
| `INSCRIPTIONS_EXTERNAL_SYNC_FAILED` | Synchronisation externe non confirmée |

Les messages utilisateur restent génériques, actionnables et corrélables. Les détails techniques restent dans les journaux autorisés sans exposer de donnée nominative.

## 20. Stratégie d’implémentation

L’ordre technique recommandé est :

1. schéma, constantes et dépôts en mémoire ;
2. modèle canonique et trois adaptateurs Google Forms ;
3. moteur pur d’analyse et rapport anonymisé ;
4. séquences, commandes idempotentes et audit persistant en recette ;
5. persistance des lots analysés sans création de licencié ;
6. interface de contrôle et décisions administratives ;
7. application explicite des lots validés ;
8. pont Analytics/Présences et activation bornée ;
9. import SIKADA après validation de l’échantillon anonymisé ;
10. bascule éventuelle des formulaires publics après reprise complète.

Chaque incrément conserve la suite cumulative et ne rend pas opérationnelle une capacité uniquement documentée.

## 21. Prérequis bloquants avant écriture réelle

- schéma physique et version initiale validés ;
- classeur et dossiers de recette créés avec leurs partages contrôlés ;
- support persistant d’audit fonctionnel opérationnel ;
- capacités Inscriptions et `ANALYTICS_READ` réellement implémentées ;
- manifeste Apps Script aligné sur `Europe/Paris` ;
- durées de conservation et procédure d’exercice des droits validées ;
- jeu SIKADA anonymisé couvrant les 12 en-têtes exacts ;
- `BODY_KARATE` ajouté aux catalogues et testé ;
- numéro FFKDA accepté comme texte au format observé ;
- pont vers les cinq classeurs Analytics validé en recette ;
- sauvegarde et restauration testées.

## 22. Critères d’acceptation

`INSCRIPTIONS-005` est validable lorsque :

- le support de chaque type de donnée est explicite ;
- les onglets et invariants du référentiel sont définis ;
- les formats et portées des trois identifiants sont fixés ;
- l’allocation concurrente n’utilise ni maximum ni nombre de lignes ;
- l’idempotence repose sur une preuve persistante ;
- une interruption reste détectable et récupérable ;
- l’audit fonctionnel est obligatoire pour les écritures sensibles ;
- les contrats Forms, Questionnaire santé, SIKADA, Analytics et Présences sont bornés ;
- recette et production sont physiquement séparées ;
- les écarts de fuseau, Body Karaté et numéro FFKDA sont bloquants avant activation ;
- aucun code, classeur, dossier, accès ou déploiement réel n’est modifié.

## 23. Décisions structurantes

1. La V1 utilise un classeur Google Sheets privé dédié comme référentiel Inscriptions.
2. Le domaine accède aux données par des dépôts injectables.
3. `PropertiesService` ne stocke aucune donnée nominative métier.
4. Les séquences persistantes attribuent des identifiants non réutilisables.
5. L’idempotence durable ne dépend jamais uniquement de `CacheService`.
6. Une écriture sensible n’est confirmée qu’après relecture, invariants et audit.
7. Les imports restent séparés entre analyse, décision et application.
8. Les intégrations Analytics existantes évoluent par adaptateur transitoire borné.
9. La recette utilise des ressources distinctes de la production.
10. Les contrats non confirmés restent des prérequis et ne sont pas inventés.

## 24. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-02 | Création des contrats techniques : stockage, schéma, séquences, concurrence, idempotence, audit et intégrations externes |
