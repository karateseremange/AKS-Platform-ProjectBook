# DOCUMENT-001 — Gestion des documents générés

## 1. Objet

Ce document définit les règles communes applicables aux documents générés, stockés, transmis ou archivés par AKS Platform.

Il couvre notamment les attestations, certificats, justificatifs, exports, rapports, relevés, convocations et tout autre document produit automatiquement ou semi-automatiquement par la plateforme.

## 2. Principes directeurs

La gestion documentaire repose sur les principes suivants :

- traçabilité complète de chaque génération ;
- séparation entre données métier et fichiers générés ;
- intégrité vérifiable des documents ;
- accès limité selon les rôles et le besoin métier ;
- conservation maîtrisée ;
- absence de données sensibles inutiles ;
- génération reproductible lorsque le contexte le permet ;
- compatibilité avec les exigences de sécurité, d’audit et de journalisation de la plateforme.

## 3. Périmètre fonctionnel

Le service documentaire peut être utilisé par tous les modules métier.

Exemples :

- attestation issue du questionnaire santé ;
- rapport statistique ;
- export administratif ;
- document individuel destiné à un licencié ;
- synthèse destinée au président ou à un administrateur ;
- document transmis par notification ;
- document généré à la clôture d’un processus métier.

## 4. Cycle de vie d’un document

Un document suit au minimum les états suivants :

- `REQUESTED` : génération demandée ;
- `GENERATING` : génération en cours ;
- `AVAILABLE` : document disponible ;
- `FAILED` : génération échouée ;
- `EXPIRED` : document arrivé en fin de disponibilité ;
- `ARCHIVED` : document conservé hors usage courant ;
- `DELETED` : document supprimé selon la politique de conservation.

Les transitions d’état doivent être contrôlées et journalisées.

## 5. Métadonnées minimales

Chaque document doit être associé à des métadonnées indépendantes du fichier lui-même :

- identifiant technique unique ;
- type de document ;
- module source ;
- identifiant de l’objet métier concerné ;
- auteur ou processus générateur ;
- date et heure de génération ;
- version du modèle utilisé ;
- format du fichier ;
- nom logique du document ;
- taille ;
- empreinte d’intégrité ;
- statut ;
- durée de conservation ;
- niveau de confidentialité ;
- éventuelle date d’expiration ;
- référence de corrélation technique.

Les données nominatives ne doivent pas être dupliquées dans les métadonnées lorsqu’un identifiant métier suffit.

## 6. Formats

Le format PDF est privilégié pour les documents finalisés destinés à l’impression, à l’archivage ou à la transmission.

Les formats tabulaires peuvent être utilisés pour les exports de données, notamment CSV ou XLSX selon le besoin.

Les formats doivent être explicitement déclarés et validés avant mise à disposition.

Les documents générés doivent rester lisibles sans dépendre de composants propriétaires inutiles.

## 7. Modèles documentaires

Les modèles doivent être versionnés.

Toute génération doit conserver la référence exacte du modèle utilisé afin de permettre :

- l’audit ;
- la reproduction ;
- l’analyse d’un document ancien ;
- la gestion des évolutions réglementaires ou graphiques.

Une modification de modèle ne doit jamais altérer rétroactivement un document déjà finalisé.

## 8. Génération

La génération doit être déterministe autant que possible.

Le processus doit :

- valider les données d’entrée ;
- refuser les données incohérentes ;
- produire un document complet ou échouer explicitement ;
- éviter les doublons grâce à une clé d’idempotence lorsque nécessaire ;
- enregistrer le résultat et son statut ;
- générer une empreinte d’intégrité ;
- remonter les erreurs selon ERROR-001.

Une génération partielle ne doit jamais être présentée comme valide.

## 9. Nommage des fichiers

Le nom physique du fichier ne doit pas constituer une source d’autorisation ni une source de vérité métier.

Il doit rester :

- compréhensible ;
- compatible avec les systèmes courants ;
- sans caractère dangereux ;
- sans donnée sensible inutile ;
- distinct grâce à un identifiant ou un horodatage contrôlé.

Exemple de structure :

`<type>-<reference-metier>-<date>-<identifiant-court>.pdf`

## 10. Intégrité

Chaque document finalisé doit posséder une empreinte cryptographique calculée au moment de sa création.

Toute modification du fichier impose la création d’une nouvelle version ou d’un nouveau document.

Un document finalisé ne doit pas être modifié en place.

## 11. Confidentialité et autorisations

L’accès à un document dépend :

- du rôle de l’utilisateur ;
- du module concerné ;
- du lien avec l’objet métier ;
- du niveau de confidentialité ;
- de la durée de disponibilité.

Les liens publics permanents sont interdits pour les documents contenant des données personnelles.

Lorsqu’un lien temporaire est utilisé, il doit être limité dans le temps et non prédictible.

Les contrôles d’accès sont appliqués côté serveur, conformément à SECURITY-001 et CORE-001.

## 12. Transmission

La transmission d’un document par notification doit respecter NOTIF-001.

Selon le niveau de sensibilité, le document peut être :

- joint directement ;
- rendu accessible par un lien temporaire sécurisé ;
- réservé à un espace authentifié.

Le choix du mode de transmission doit limiter l’exposition des données personnelles.

## 13. Conservation et suppression

Chaque type de document doit disposer d’une politique de conservation explicite.

Cette politique précise :

- la durée de disponibilité opérationnelle ;
- la durée d’archivage éventuelle ;
- les conditions de suppression ;
- les éventuelles obligations légales ou administratives ;
- le responsable fonctionnel de la règle.

La suppression doit concerner le fichier et, lorsque prévu, les métadonnées associées.

Une trace d’audit de la suppression peut être conservée sans conserver le contenu supprimé.

## 14. Journalisation et audit

Les événements suivants doivent être journalisés selon LOG-001 et AUDIT-001 :

- demande de génération ;
- succès ou échec ;
- téléchargement sensible ;
- transmission ;
- expiration ;
- archivage ;
- suppression ;
- régénération ;
- changement de statut administratif.

Les journaux ne doivent pas contenir le contenu complet des documents.

## 15. Erreurs et reprise

Les erreurs documentaires suivent ERROR-001.

Les erreurs doivent distinguer au minimum :

- données d’entrée invalides ;
- modèle indisponible ;
- moteur de génération indisponible ;
- erreur de stockage ;
- erreur d’autorisation ;
- document introuvable ;
- document expiré ;
- intégrité invalide.

Les reprises automatiques ne sont autorisées que pour les erreurs techniques transitoires.

## 16. Stockage

Les fichiers ne doivent pas être stockés directement dans le code source ni dans le Project Book.

Le stockage documentaire doit être abstrait du module métier et conforme à STORAGE-001.

La base de données conserve les références et métadonnées nécessaires, pas le contenu binaire sauf justification technique explicite.

## 17. Environnements et données de test

Les environnements de développement et de test ne doivent pas utiliser de documents réels contenant des données personnelles, sauf procédure exceptionnelle encadrée.

Les documents de test doivent être clairement identifiables et séparés des documents de production.

## 18. Responsabilités

Le module métier est responsable :

- des données fournies ;
- du déclenchement de la génération ;
- des règles métier et de conservation propres au document.

Le service documentaire est responsable :

- de la génération technique ;
- du versionnement des modèles ;
- de l’intégrité ;
- du stockage logique ;
- de la mise à disposition ;
- de la remontée des erreurs techniques.

## 19. Critères d’acceptation

Un usage du service documentaire est conforme lorsque :

- le type de document est déclaré ;
- le modèle est versionné ;
- les données d’entrée sont validées ;
- le document possède un identifiant unique ;
- les métadonnées minimales sont présentes ;
- l’accès est contrôlé côté serveur ;
- l’intégrité est vérifiable ;
- les événements importants sont journalisés ;
- la durée de conservation est définie ;
- les erreurs respectent ERROR-001 ;
- le stockage respecte STORAGE-001.

## 20. Références

- ARCH-001 — Architecture générale
- CORE-001 — Services transverses
- SECURITY-001 — Sécurité de la plateforme
- API-001 — Conventions des API
- ERROR-001 — Gestion transverse des erreurs
- LOG-001 — Journalisation technique
- AUDIT-001 — Journal d’audit
- NOTIF-001 — Service de notifications
- CONFIG-001 — Paramétrage
- STORAGE-001 — Stratégie de stockage
