# Guide d’installation et d’administration

## 1. Objet du guide

Ce document permet d’installer, configurer, sécuriser, mettre à jour et
dépanner **AKS Platform RC 0.7.0**.

La plateforme repose sur :

- Google Apps Script pour le moteur applicatif ;
- Google Sheets pour les données administratives ;
- Google Drive pour les attestations PDF privées ;
- Gmail pour les notifications ;
- WordPress pour l’interface publique ;
- l’extension `AKS Platform Connector` pour la passerelle sécurisée.

## 2. Architecture

Le navigateur communique uniquement avec WordPress. L’extension WordPress
signe les appels avec HMAC-SHA256 et les transmet à Apps Script. Le secret
partagé n’est jamais envoyé au navigateur.

Les réponses détaillées transitent uniquement en mémoire pendant le traitement.
Elles ne sont pas écrites dans Sheets, Drive, WordPress ou les journaux.

## 3. Prérequis

### 3.1 Comptes et accès

- compte Google propriétaire du classeur, du script et des fichiers Drive ;
- accès au dépôt `karateseremange/AKS-Platform` ;
- accès administrateur WordPress ;
- accès SFTP ou gestionnaire de fichiers OVH ;
- accès à `wp-config.php` ;
- accès à l’adresse `contact@karate-seremange.fr` ;
- gestionnaire de mots de passe pour les secrets.

### 3.2 Poste d’administration

- Git ;
- Node.js maintenu ;
- `clasp` ;
- PowerShell ;
- navigateur récent.

### 3.3 Environnement WordPress validé

- WordPress 7.0.1 ;
- PHP 8.3.23 ;
- OceanWP 4.2.1 ;
- Elementor 4.1.4 ;
- HTTPS actif.

Avant toute modification de PHP, WordPress ou de l’extension, sauvegarder les
fichiers et la base de données.

## 4. Récupération des sources

```powershell
git clone https://github.com/karateseremange/AKS-Platform.git
cd AKS-Platform
git switch develop
git pull --ff-only origin develop
git status
```

Pour une installation de production, utiliser le dernier tag RC validé et
vérifier sa signature logique dans le Project Book.

Ne jamais ajouter au dépôt :

- le secret du connecteur ;
- un identifiant de script privé dans un document ;
- des exports contenant des données personnelles ;
- des fichiers de configuration locaux non prévus par `.gitignore`.

## 5. Préparation Google Sheets et Apps Script

### 5.1 Classeur

Créer ou identifier le classeur Google Sheets destiné à AKS Platform. Le compte
Google d’exploitation doit en être propriétaire ou disposer des droits requis.

### 5.2 Liaison avec clasp

Se connecter avec le compte Google d’exploitation :

```powershell
clasp login
```

La configuration locale doit pointer vers le projet Apps Script associé au
classeur et utiliser `src` comme répertoire source. L’identifiant du script ne
doit pas être publié dans un guide ou un message public.

### 5.3 Déploiement des sources

Depuis le dépôt propre et positionné sur la version souhaitée :

```powershell
clasp push
```

Contrôler la liste des fichiers envoyés et refuser le déploiement si des
fichiers inconnus apparaissent.

### 5.4 Initialisation

Ouvrir le classeur, recharger la page puis utiliser :

```text
AKS Platform → Initialiser la plateforme
```

Accepter uniquement les autorisations Google nécessaires au fonctionnement.

L’initialisation crée ou contrôle les feuilles :

- `HQ_Campaigns` ;
- `HQ_Questionnaires` ;
- `HQ_Submissions`.

Ne pas renommer leurs colonnes et ne pas modifier manuellement leur structure.

## 6. Configuration réglementaire

Le questionnaire mineur est basé sur l’Annexe II-23, article A. 231-3 du code
du sport. Lors d’une nouvelle installation ou d’une évolution réglementaire,
exécuter la procédure de mise à niveau prévue par la version applicative.

Pour RC 0.7.0, vérifier que le questionnaire actif comporte les questions et
la version réglementaire attendues avant d’ouvrir une campagne.

## 7. Configuration des e-mails

Le compte Google exécutant la Web App doit être autorisé à envoyer avec :

```text
Adresse : contact@karate-seremange.fr
Nom : Association Karaté Serémange
```

Dans Gmail, contrôler **Comptes et importation → Envoyer des e-mails en tant
que**. L’adresse doit être une adresse principale ou un alias validé. Réaliser
un envoi de contrôle avant l’ouverture d’une campagne.

## 8. Configuration de la passerelle sécurisée

### 8.1 Génération du secret

Générer un secret aléatoire d’au moins 32 caractères et le stocker dans le
gestionnaire de mots de passe. Ne jamais l’afficher dans une capture d’écran.

Exemple PowerShell ne l’affichant pas :

```powershell
$bytes = New-Object byte[] 48
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$secret = [Convert]::ToBase64String($bytes)
Set-Clipboard -Value $secret
```

### 8.2 Propriété Apps Script

Dans **Paramètres du projet → Propriétés du script**, ajouter :

```text
AKS_WORDPRESS_CONNECTOR_SECRET
```

Coller le secret comme valeur, puis enregistrer.

La campagne active est enregistrée dans la propriété :

```text
AKS_HEALTH_QUESTIONNAIRE_ACTIVE_CAMPAIGN_ID
```

Elle doit normalement être administrée depuis le menu AKS Platform, et non
modifiée manuellement.

### 8.3 Déploiement Web App

Dans Apps Script :

1. ouvrir **Déployer → Gérer les déploiements** ;
2. créer ou modifier un déploiement de type **Application Web** ;
3. exécuter en tant que propriétaire du projet ;
4. autoriser l’accès à **Tout le monde** ;
5. conserver l’URL se terminant par `/exec` ;
6. créer une nouvelle version à chaque mise à jour applicative.

Le lien direct Apps Script reste une solution de secours administrative. Le
public doit utiliser la page WordPress.

## 9. Installation WordPress

### 9.1 Extension

Téléverser l’archive validée de `AKS Platform Connector`, puis activer
l’extension. La version correspondant à RC 0.7.0 est `0.10.1`.

### 9.2 wp-config.php

Ajouter avant :

```php
require_once ABSPATH . 'wp-settings.php';
```

les constantes suivantes :

```php
define('AKS_PLATFORM_API_URL', 'https://script.google.com/macros/s/DEPLOIEMENT/exec');
define('AKS_PLATFORM_CONNECTOR_SECRET', 'SECRET_CONSERVE_HORS_DU_DEPOT');
```

Le secret doit être strictement identique à celui de la propriété Apps Script.

### 9.3 Page publique

Créer une page sans barre latérale contenant le shortcode :

```text
[aks_health_questionnaire]
```

URL validée :

```text
https://karate-seremange.fr/questionnaire-mineur/
```

Désactiver les commentaires. Exclure cette page de tout cache HTML longue
durée afin d’éviter la diffusion d’un nonce WordPress expiré.

Ne pas activer d’outil enregistrant les frappes, champs ou sessions sur cette
page.

## 10. Création d’une campagne

Dans le classeur :

```text
AKS Platform → Créer une campagne santé
```

1. saisir la saison au format `2026-2027` ;
2. saisir le nom ou laisser le champ vide pour le nom proposé ;
3. confirmer le message indiquant que la campagne est créée, ouverte et active.

Pour changer de campagne active :

```text
AKS Platform → Sélectionner la campagne active
```

Saisir le numéro affiché, jamais l’identifiant technique à la main.

Une seule campagne doit être présentée au public comme campagne active.

## 11. Tests avant ouverture

### 11.1 Tests Apps Script

Exécuter au minimum :

```javascript
AKS_runHQ009Tests()
AKS_runHQ008Tests()
AKS_runHQ007Tests()
AKS_runHQ006Tests()
AKS_runHQ0052Sprint43Tests()
```

Résultats de référence : HQ-009.1 `5/5`, HQ-008 `3/3`, HQ-007 `7/7`,
HQ-006 `4/4` et HQ-005.2 Sprint 4.3 `7/7`.

### 11.2 Test WordPress

```powershell
node .\integrations\wordpress\tests\connector-contract.test.js
```

Résultat de référence : HQ-009.2 `14/14`.

### 11.3 Tests réels

- navigation privée sur ordinateur et Android ;
- aucune demande de connexion Google ;
- date impossible, date de majeur et champs incomplets refusés ;
- parcours toutes réponses « Non » : PDF envoyé au représentant ;
- parcours avec au moins un « Oui » : aucun PDF ;
- notification du club sans réponse détaillée ni pièce jointe ;
- absence de doublon après double clic ou attente réseau.

## 12. Mise à jour

1. sauvegarder WordPress, la base, Sheets et les configurations ;
2. vérifier que la branche de référence est propre ;
3. déployer les sources avec `clasp push` ;
4. créer une nouvelle version du déploiement Apps Script existant ;
5. mettre à jour l’extension WordPress si nécessaire ;
6. vider uniquement les caches autorisés ;
7. exécuter les tests automatisés et réels ;
8. documenter la version et le retour arrière possible.

Ne jamais remplacer l’URL de déploiement dans `wp-config.php` sans contrôler
le connecteur réel `context` puis `prepare`.

## 13. Sauvegarde et restauration

Sauvegarder régulièrement :

- le dépôt Git et ses tags ;
- le Project Book ;
- le classeur Google Sheets ;
- le dossier Drive des attestations ;
- les fichiers et la base WordPress ;
- les noms des propriétés nécessaires, sans exporter les secrets en clair.

Après restauration, contrôler les droits Drive, l’alias Gmail, les propriétés
du script, l’URL `/exec`, les constantes WordPress et la campagne active.

## 14. Rotation du secret

1. mettre temporairement la page en maintenance ;
2. générer un nouveau secret ;
3. mettre à jour `AKS_WORDPRESS_CONNECTOR_SECRET` dans Apps Script ;
4. mettre immédiatement à jour `AKS_PLATFORM_CONNECTOR_SECRET` dans
   `wp-config.php` ;
5. tester `context` et `prepare` ;
6. rouvrir la page ;
7. supprimer l’ancienne valeur du gestionnaire de mots de passe.

## 15. Diagnostic rapide

| Symptôme | Contrôles |
|---|---|
| Questionnaire indisponible | Campagne active, statut `OPEN`, déploiement Apps Script |
| `aks_connector_not_configured` | Constantes `wp-config.php`, emplacement avant `wp-settings.php`, longueur du secret |
| `aks_upstream_invalid` | Version de l’extension, redirection ContentService, déploiement `doPost` |
| Signature invalide | Même secret des deux côtés, horloge serveur, absence d’espace ajouté |
| Session expirée | Cache de page, nonce WordPress, rafraîchissement complet |
| E-mail absent | Spam, quota Gmail, alias autorisé, horodatage dans `HQ_Submissions` |
| PDF absent avec toutes réponses « Non » | droits Drive, générateur PDF, statut de la soumission |
| Plusieurs soumissions | `requestId`, version du JavaScript, cache navigateur |

## 16. Règles de sécurité

- accès administrateur limité aux personnes autorisées ;
- authentification à deux facteurs activée ;
- secrets stockés dans un gestionnaire de mots de passe ;
- aucun partage public des fichiers Drive ;
- aucune réponse médicale demandée par e-mail au club ;
- aucune copie des réponses dans une note, un tableur ou un outil WordPress ;
- toute anomalie de confidentialité impose la fermeture temporaire du formulaire.
