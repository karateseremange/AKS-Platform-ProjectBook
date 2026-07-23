# DOCUMENT-001

# Gestion des documents générés

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | DOCUMENT-001 |
| **Titre** | Gestion des documents générés |
| **Version** | 1.2.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |
| **Caractère** | Normatif |

---

## 1. Objet

Ce document définit les règles communes applicables aux documents générés, stockés, transmis, consultés, archivés ou supprimés par AKS Platform.

Il couvre notamment les attestations, certificats, justificatifs, exports, rapports, relevés, convocations et tout autre document produit automatiquement ou semi-automatiquement par la plateforme.

`DOCUMENT-001` ne traite pas de la documentation officielle du Project Book. Les règles de création, d'organisation, de maintenance et de gouvernance des documents du Project Book relèvent exclusivement de `DOC-001`.

## 2. Position dans le Project Book

`DOCUMENT-001` complète notamment :

- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — Services transverses d'AKS Core ;
- `SECURITY-001` — Sécurité de la plateforme ;
- `STORAGE-001` — Stratégie de stockage ;
- `LOG-001` — Journalisation ;
- `AUDIT-001` — Journal d'audit ;
- `ERROR-001` — Gestion transverse des erreurs ;
- `NOTIF-001` — Notifications ;
- `CONFIG-001` — Paramétrage ;
- `DOC-001` — Gouvernance de la documentation du Project Book.

Le présent document fait autorité sur le cycle de vie technique et fonctionnel des documents générés par la plateforme.

## 3. Principes directeurs

La gestion documentaire repose sur les principes suivants :

- traçabilité de chaque génération et opération sensible ;
- séparation entre données métier, métadonnées documentaires et fichiers générés ;
- source de vérité clairement identifiée ;
- intégrité vérifiable des documents finalisés ;
- accès limité selon les rôles, le contexte métier et le niveau de confidentialité ;
- conservation maîtrisée ;
- absence de données sensibles inutiles ;
- génération reproductible lorsque le contexte le permet ;
- idempotence lorsque plusieurs demandes équivalentes peuvent être reçues ;
- compatibilité avec les exigences de sécurité, d'audit, de journalisation et de stockage de la plateforme ;
- réversibilité du stockage documentaire.

## 4. Périmètre fonctionnel

Le service documentaire peut être utilisé par tous les modules métier.

Exemples :

- attestation issue du questionnaire santé ;
- rapport statistique ;
- export administratif ;
- document individuel destiné à un licencié ;
- synthèse destinée au président ou à un administrateur ;
- document transmis par notification ;
- document généré à la clôture d'un processus métier.

Sont exclus du présent document :

- les documents du Project Book ;
- les fichiers sources de développement ;
- les pièces déposées manuellement sans traitement par la plateforme, sauf lorsqu'un module les intègre explicitement dans son propre cycle de vie documentaire ;
- les fichiers temporaires ne constituant pas un résultat fonctionnel.

## 5. Source de vérité

Pour chaque type de document, la source de vérité doit être explicitement définie.

Selon le cas, elle peut être :

- le fichier finalisé lui-même ;
- les données métier et le modèle permettant sa régénération ;
- les métadonnées documentaires associées ;
- un ensemble cohérent composé du fichier et de ses métadonnées.

Un cache, un export intermédiaire, une pièce jointe envoyée ou une copie locale ne constitue jamais la source de vérité par défaut.

Lorsqu'un document est reproductible, la plateforme doit conserver les références nécessaires à sa régénération sans supposer que toutes les données historiques resteront disponibles indéfiniment.

## 6. Cycle de vie d'un document

Un document suit au minimum les états suivants :

- `REQUESTED` : génération demandée ;
- `GENERATING` : génération en cours ;
- `AVAILABLE` : document disponible ;
- `FAILED` : génération échouée ;
- `EXPIRED` : document arrivé en fin de disponibilité ;
- `ARCHIVED` : document conservé hors usage courant ;
- `DELETED` : document supprimé selon la politique de conservation.

Les transitions d'état doivent être contrôlées, cohérentes et journalisées.

Une transition vers `AVAILABLE` n'est autorisée que lorsque :

- la génération est complète ;
- le fichier est stocké ;
- les métadonnées minimales sont enregistrées ;
- l'empreinte d'intégrité est calculée lorsque le format le permet ;
- les contrôles de sécurité applicables sont satisfaits.

Un document `DELETED` ne doit plus être accessible ni réintroduit dans un usage actif par une restauration non contrôlée.

## 7. Métadonnées minimales

Chaque document doit être associé à des métadonnées indépendantes du fichier lui-même :

- identifiant technique unique ;
- type de document ;
- module source ;
- identifiant de l'objet métier concerné ;
- auteur ou processus générateur ;
- date et heure de génération ;
- version du modèle utilisé ;
- format du fichier ;
- nom logique du document ;
- taille ;
- empreinte d'intégrité ;
- statut ;
- durée de conservation ;
- niveau de confidentialité ;
- éventuelle date d'expiration ;
- référence de corrélation technique ;
- version du schéma documentaire lorsque nécessaire ;
- emplacement logique de stockage ou référence abstraite vers celui-ci.

Les données nominatives ne doivent pas être dupliquées dans les métadonnées lorsqu'un identifiant métier suffit.

Les métadonnées ne doivent contenir ni secret, ni contenu complet du document, ni donnée médicale détaillée.

## 8. Formats

Le format PDF est privilégié pour les documents finalisés destinés à l'impression, à l'archivage ou à la transmission.

Les formats tabulaires peuvent être utilisés pour les exports de données, notamment CSV ou XLSX selon le besoin.

Les formats doivent être explicitement déclarés, pris en charge et validés avant mise à disposition.

Les documents générés doivent rester lisibles sans dépendre de composants propriétaires inutiles.

Lorsqu'un format propriétaire est retenu, une justification fonctionnelle ou technique doit être documentée.

## 9. Modèles documentaires

Les modèles doivent être versionnés.

Toute génération doit conserver la référence exacte du modèle utilisé afin de permettre :

- l'audit ;
- la reproduction ;
- l'analyse d'un document ancien ;
- la gestion des évolutions réglementaires ou graphiques.

Une modification de modèle ne doit jamais altérer rétroactivement un document déjà finalisé.

Un modèle ne doit pas contenir de secret ni dépendre d'une ressource non versionnée sans référence explicite.

Lorsque des éléments graphiques ou réglementaires externes sont utilisés, leur origine et leur version doivent être identifiables.

## 10. Génération

La génération doit être déterministe autant que possible.

Le processus doit :

- valider les données d'entrée ;
- refuser les données incohérentes ;
- produire un document complet ou échouer explicitement ;
- éviter les doublons grâce à une clé d'idempotence lorsque nécessaire ;
- enregistrer le résultat et son statut ;
- générer une empreinte d'intégrité ;
- journaliser les étapes significatives ;
- remonter les erreurs selon `ERROR-001` ;
- ne pas exposer les données sources dans les messages d'erreur ou les journaux.

Une génération partielle ne doit jamais être présentée comme valide.

La régénération d'un document finalisé crée un nouveau document ou une nouvelle version identifiable. Elle ne modifie jamais silencieusement le fichier existant.

## 11. Nommage des fichiers

Le nom physique du fichier ne doit pas constituer une source d'autorisation ni une source de vérité métier.

Il doit rester :

- compréhensible ;
- compatible avec les systèmes courants ;
- sans caractère dangereux ;
- sans donnée sensible inutile ;
- distinct grâce à un identifiant ou un horodatage contrôlé.

Exemple de structure :

```text
<type>-<reference-metier>-<date>-<identifiant-court>.pdf
```

Le nom de fichier ne doit pas contenir de secret, de réponse médicale détaillée ou de donnée personnelle non nécessaire.

## 12. Intégrité

Chaque document finalisé doit posséder une empreinte cryptographique calculée au moment de sa création lorsque le format et le support le permettent.

Toute modification du fichier impose la création d'une nouvelle version ou d'un nouveau document.

Un document finalisé ne doit pas être modifié en place.

L'intégrité doit pouvoir être vérifiée lors :

- de la consultation ;
- du téléchargement ;
- de l'archivage ;
- de la restauration ;
- d'une migration ;
- d'un contrôle administratif ou technique.

Une incohérence d'intégrité doit rendre le document indisponible jusqu'à analyse.

## 13. Confidentialité et autorisations

L'accès à un document dépend :

- du rôle de l'utilisateur ;
- du module concerné ;
- du lien avec l'objet métier ;
- du niveau de confidentialité ;
- de la durée de disponibilité ;
- du contexte d'accès.

Les liens publics permanents sont interdits pour les documents contenant des données personnelles.

Lorsqu'un lien temporaire est utilisé, il doit être :

- limité dans le temps ;
- non prédictible ;
- associé au document concerné ;
- révocable lorsque le support le permet ;
- transmis par un canal adapté au niveau de sensibilité ;
- inutilisable après expiration.

Les contrôles d'accès sont appliqués côté serveur, conformément à `SECURITY-001` et `CORE-001`.

La connaissance d'un identifiant, d'un nom de fichier ou d'une URL ne constitue jamais une autorisation.

## 14. Transmission

La transmission d'un document par notification doit respecter `NOTIF-001`.

Selon le niveau de sensibilité, le document peut être :

- joint directement ;
- rendu accessible par un lien temporaire sécurisé ;
- réservé à un espace authentifié.

Le choix du mode de transmission doit limiter l'exposition des données personnelles.

Une copie transmise par courrier électronique ou téléchargée par l'utilisateur ne remplace pas la source de vérité documentaire de la plateforme.

Les transmissions sensibles doivent être traçables sans journaliser le contenu complet du document.

## 15. Conservation, archivage et suppression

Chaque type de document doit disposer d'une politique de conservation explicite.

Cette politique précise :

- la durée de disponibilité opérationnelle ;
- la durée d'archivage éventuelle ;
- les conditions de passage à l'état `EXPIRED` ;
- les conditions de suppression ;
- les éventuelles obligations légales ou administratives ;
- le responsable fonctionnel de la règle ;
- le traitement des métadonnées après suppression du fichier ;
- les règles applicables aux sauvegardes.

La suppression doit concerner le fichier et, lorsque prévu, les métadonnées associées.

Une trace d'audit de la suppression peut être conservée sans conserver le contenu supprimé.

Une restauration ne doit pas remettre en circulation un document arrivé à expiration ou supprimé. Les règles de conservation doivent être réappliquées après toute restauration.

La conservation illimitée est interdite par défaut.

## 16. Journalisation et audit

Les événements suivants doivent être journalisés ou audités selon leur nature :

- demande de génération ;
- succès ou échec ;
- téléchargement sensible ;
- transmission ;
- expiration ;
- archivage ;
- suppression ;
- régénération ;
- changement de statut administratif ;
- anomalie d'intégrité ;
- restauration ;
- modification d'une politique de conservation ;
- accès administratif direct au stockage documentaire.

Les journaux ne doivent pas contenir le contenu complet des documents ni les données sources détaillées.

La journalisation suit `LOG-001`. Les événements nécessitant une preuve durable ou une traçabilité administrative renforcée suivent `AUDIT-001`.

## 17. Erreurs et reprise

Les erreurs documentaires suivent `ERROR-001`.

Les erreurs doivent distinguer au minimum :

- données d'entrée invalides ;
- modèle indisponible ;
- moteur de génération indisponible ;
- erreur de stockage ;
- erreur d'autorisation ;
- document introuvable ;
- document expiré ;
- intégrité invalide ;
- quota dépassé ;
- lien temporaire invalide ou expiré ;
- restauration incohérente.

Les reprises automatiques ne sont autorisées que pour les erreurs techniques transitoires et lorsque l'opération est idempotente.

Une reprise ne doit jamais créer silencieusement plusieurs documents équivalents.

## 18. Stockage

Les fichiers ne doivent pas être stockés directement dans le code source ni dans le Project Book.

Le stockage documentaire doit être abstrait du module métier et conforme à `STORAGE-001`.

La base de données conserve les références et métadonnées nécessaires, pas le contenu binaire sauf justification technique explicite.

Le module métier ne doit pas dépendre d'un chemin physique, d'un identifiant propre à un fournisseur ou d'une URL permanente.

Les copies temporaires doivent être supprimées automatiquement selon une règle explicite.

## 19. Environnements et données de test

Les environnements de développement et de test ne doivent pas utiliser de documents réels contenant des données personnelles, sauf procédure exceptionnelle encadrée.

Les documents de test doivent être clairement identifiables et séparés des documents de production.

Un environnement non productif ne doit pas pouvoir publier, modifier ou supprimer un document de production.

Les modèles peuvent être communs entre environnements uniquement lorsqu'ils sont versionnés et qu'aucune donnée sensible n'y est intégrée.

## 20. Sauvegarde et restauration

Les documents et métadonnées nécessaires doivent être couverts par la politique de sauvegarde définie dans `STORAGE-001`.

Toute restauration documentaire doit :

- vérifier l'intégrité du fichier ;
- vérifier la cohérence des métadonnées ;
- respecter les droits d'accès ;
- réappliquer les règles de conservation et d'expiration ;
- éviter d'écraser silencieusement une version plus récente ;
- produire une trace d'audit ;
- confirmer que les documents supprimés ou expirés ne sont pas réintroduits dans l'usage actif.

## 21. Migration et réversibilité

Le stockage documentaire doit permettre l'export des fichiers et de leurs métadonnées dans un format documenté.

Une migration doit prévoir :

- l'inventaire des types de documents ;
- la reprise des identifiants logiques ;
- la reprise des métadonnées ;
- la vérification des empreintes ;
- la reprise des droits ;
- la reprise des politiques de conservation ;
- la validation des liens entre documents et objets métier ;
- un plan de retour arrière ;
- une validation fonctionnelle.

Aucune migration ne doit transformer implicitement une copie technique en source de vérité.

## 22. Responsabilités

### 22.1 Modules métier

Le module métier est responsable :

- des données fournies ;
- du déclenchement de la génération ;
- du type de document demandé ;
- des règles métier et de conservation propres au document ;
- de la légitimité de l'accès fonctionnel au document ;
- de la gestion de la référence entre le document et l'objet métier.

### 22.2 Service documentaire d'AKS Core

Le service documentaire est responsable :

- de la génération technique ;
- du versionnement des modèles ;
- de l'intégrité ;
- du stockage logique ;
- de la mise à disposition ;
- de la gestion technique du cycle de vie ;
- de l'application des règles communes de sécurité ;
- de la remontée des erreurs techniques ;
- de la compatibilité avec `STORAGE-001`, `LOG-001` et `SECURITY-001`.

### 22.3 Administration

Les administrateurs autorisés sont responsables :

- de l'utilisation appropriée des fonctions de consultation, archivage, régénération ou suppression ;
- du respect de la confidentialité ;
- de l'analyse des erreurs documentaires ;
- de la vérification des opérations sensibles ;
- de l'application des procédures validées.

### 22.4 Product Owner

Le Product Owner est responsable :

- de la validation des types de documents ;
- de la validation des règles fonctionnelles de conservation ;
- de l'arbitrage des exceptions ;
- de la cohérence avec le Project Book ;
- de la décision de faire évoluer le service documentaire commun.

## 23. Gouvernance des exceptions

Toute exception aux règles du présent document doit être :

- justifiée ;
- documentée ;
- limitée dans le temps ou dans son périmètre ;
- approuvée par le Product Owner ;
- évaluée au regard de la sécurité, de la confidentialité, de l'intégrité et de la réversibilité ;
- réexaminée lors d'une évolution majeure du module concerné.

Une contrainte propre à un fournisseur ne constitue pas, à elle seule, une justification suffisante pour contourner les principes communs.

## 24. Tests minimaux

Les tests doivent couvrir au minimum :

- génération réussie ;
- échec explicite sur données invalides ;
- idempotence ;
- présence des métadonnées obligatoires ;
- vérification de l'empreinte ;
- contrôle d'accès ;
- expiration d'un lien temporaire ;
- archivage et suppression ;
- absence de contenu documentaire dans les journaux ;
- restauration sans réintroduction d'un document expiré ou supprimé ;
- séparation entre environnements ;
- migration des fichiers et métadonnées.

## 25. Critères d'acceptation

Un usage du service documentaire est conforme lorsque :

- le type de document est déclaré ;
- sa source de vérité est identifiée ;
- le modèle est versionné ;
- les données d'entrée sont validées ;
- le document possède un identifiant unique ;
- les métadonnées minimales sont présentes ;
- l'accès est contrôlé côté serveur ;
- l'intégrité est vérifiable ;
- les liens temporaires expirent effectivement ;
- les événements importants sont journalisés ou audités ;
- la durée de conservation est définie ;
- la suppression ne laisse pas de copie active accessible ;
- une restauration ne réintroduit pas un document expiré ou supprimé ;
- les erreurs respectent `ERROR-001` ;
- le stockage respecte `STORAGE-001` ;
- le document ne dépend pas d'un chemin physique ou d'un fournisseur particulier ;
- la séparation avec la documentation du Project Book définie dans `DOC-001` est respectée.

## 26. Références

- `DOC-001` — Règles de documentation d'AKS Platform ;
- `ARCH-001` — Architecture générale ;
- `CORE-001` — Services transverses ;
- `SECURITY-001` — Sécurité de la plateforme ;
- `API-001` — Conventions des API ;
- `ERROR-001` — Gestion transverse des erreurs ;
- `LOG-001` — Journalisation ;
- `AUDIT-001` — Journal d'audit ;
- `NOTIF-001` — Service de notifications ;
- `CONFIG-001` — Paramétrage ;
- `STORAGE-001` — Stratégie de stockage.

## 27. Hors périmètre d'infrastructure

Le présent document ne décrit aucune infrastructure personnelle.

L'environnement Proxmox personnel de l'utilisateur ne fait pas partie d'AKS Platform et ne constitue ni un support de stockage, ni un environnement de sauvegarde, ni une cible de déploiement de référence pour le service documentaire.

## 28. Historique

| Version | Date | Évolution |
|---------|------|-----------|
| 1.2.0 | 2026-07-23 | Consolidation normative, séparation explicite avec DOC-001, clarification de la source de vérité, renforcement de l'intégrité, des liens temporaires, de la conservation, de la restauration, de la réversibilité, des responsabilités et des critères d'acceptation |
| 1.1.0 | 2026-07-19 | Structuration du cycle de vie, des métadonnées, de l'intégrité, de la sécurité, du stockage et des responsabilités |
| 1.0 | Initiale | Création des règles communes de gestion des documents générés |

## 29. Conclusion

`DOCUMENT-001` constitue la référence commune pour le cycle de vie des documents générés par AKS Platform.

Il garantit que chaque document produit par la plateforme reste identifiable, intègre, sécurisé, traçable, correctement conservé et indépendant du support technique utilisé.

Il ne se substitue pas à `DOC-001`, qui demeure la référence exclusive pour la gouvernance et la maintenance de la documentation du Project Book.