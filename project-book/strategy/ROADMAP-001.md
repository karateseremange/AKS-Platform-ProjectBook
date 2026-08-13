# ROADMAP-001
## Feuille de route officielle — AKS Platform

| Propriété | Valeur |
|---|---|
| **Document ID** | ROADMAP-001 |
| **Titre** | Feuille de route officielle d’AKS Platform |
| **Version** | 1.3.3 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-13 |

---

# 1. Objet

ROADMAP-001 définit l’ordre officiel des évolutions d’AKS Platform, le rôle de chaque étape, les dépendances entre versions et modules, ainsi que les règles de gouvernance permettant de faire évoluer cette feuille de route.

Le document distingue explicitement :

- la **vision produit**, qui décrit la direction générale ;
- la **roadmap**, qui fixe le séquencement validé ;
- le **périmètre d’une version**, qui définit les résultats attendus ;
- le **backlog**, qui regroupe les besoins non encore engagés ;
- les **livrables**, qui constituent les éléments réellement produits et vérifiables.

ROADMAP-001 ne constitue ni un planning détaillé, ni une promesse de date. Les dates éventuelles sont indicatives tant qu’elles ne sont pas validées dans un jalon de publication.

---

# 2. Position dans le Project Book

ROADMAP-001 est le document de référence pour le séquencement des versions et des modules d’AKS Platform.

Il s’appuie notamment sur :

- **VISION-001**, pour la direction produit ;
- **OBJECTIVES-001**, pour les objectifs prioritaires ;
- **SCOPE-001**, pour les limites fonctionnelles ;
- **ARCH-001**, pour l’architecture globale ;
- **CORE-001**, pour les services communs ;
- **RELEASE-001**, pour le processus de publication.

Toute évolution importante de l’ordre, du périmètre ou des dépendances décrites dans ce document doit faire l’objet d’une décision de gouvernance documentée.

---

# 3. Principes de gouvernance de la roadmap

## 3.1 Une roadmap orientée résultats

Chaque étape de la roadmap doit produire un résultat exploitable, testable et documenté.

Une étape ne peut pas être considérée comme terminée sur la seule base d’une intention, d’un prototype ou d’un document non appliqué.

## 3.2 Une évolution incrémentale

AKS Platform évolue par incréments maîtrisés.

Chaque version doit :

- préserver les fonctionnalités déjà publiées ;
- limiter les régressions ;
- réduire les dépendances implicites ;
- fournir des livrables intégrables ;
- maintenir la cohérence entre code, exploitation et documentation.

## 3.3 Une priorité fondée sur la valeur

La priorité d’un élément est déterminée selon :

1. la valeur pour l’association ;
2. le caractère obligatoire ou réglementaire ;
3. la réduction d’un risque ;
4. les dépendances nécessaires aux étapes suivantes ;
5. l’effort de réalisation et de maintenance ;
6. la capacité à préserver la stabilité du produit.

## 3.4 Distinction entre engagement et intention

Les éléments sont classés selon les statuts suivants :

| Statut | Signification |
|---|---|
| **Publié** | Disponible en production et faisant référence. |
| **Engagé** | Périmètre validé et réalisation autorisée. |
| **Planifié** | Ordre validé, cadrage détaillé restant à finaliser. |
| **Candidat** | Besoin identifié mais non engagé. |
| **Différé** | Élément volontairement reporté. |
| **Abandonné** | Élément retiré de la trajectoire produit. |

Seuls les éléments **engagés** peuvent alimenter directement une version en cours.

## 3.5 Règle de changement

Toute modification significative doit préciser :

- le besoin à l’origine du changement ;
- la valeur attendue ;
- les impacts sur les versions et modules ;
- les dépendances ajoutées ou supprimées ;
- les risques de régression ;
- la décision du Product Owner ;
- les documents à mettre à jour.

---

# 4. Trajectoire produit officielle

```text
AKS Platform v1.0.0 — Référence stable
        ↓
AKS Platform v1.1 — Consolidation du socle
        ↓
WEB-001 — Point d’accès WordPress à AKS Platform
        ↓
AKS Platform v1.2.0 — AKS Analytics
        ↓
ANALYTICS-SAISIE — Saisie des présences et contrôle d’accès
        ↓
AKS Calendar — Intégration Google Calendar
        ↓
AKS Inscriptions — Gestion des licenciés et des inscriptions
        ↓
ACCESS-002-01 — Socle d’administration
        ↓
ACCESS-002-02 — Amorçage et migration
        ↓
ACCESS-002-03 — Administration des utilisateurs
        ↓
ACCESS-002-04 — Fiche et habilitations
        ↓
ACCESS-002-05 — Portail privé et Mes accès
        ↓
ACCESS-002-06 — Migration définitive des modules
        ↓
INSCRIPTIONS-011 — prochain incrément métier après ACCESS-002
        ↓
Modules futurs priorisés selon la valeur métier
```

Cette séquence est la trajectoire de référence au 9 août 2026.

---

# 5. AKS Platform v1.0.0 — Référence stable

## 5.1 Statut

**Publié**.

La version 1.0.0 constitue la référence stable de production.

## 5.2 Périmètre publié

- AKS Core ;
- Questionnaire santé pour les licenciés mineurs ;
- saisie de l’identité et de la date de naissance ;
- décision administrative ;
- attestation PDF FFKDA conditionnelle ;
- QR code et identité documentaire ;
- notifications du représentant légal et du club ;
- intégration WordPress sécurisée ;
- accès public sans compte WordPress ou Google ;
- documentation opérationnelle associée.

## 5.3 Règle de stabilité

La V1.0.0 est figée.

Elle ne peut être modifiée que dans les cas suivants :

- correction d’un défaut ;
- correction de sécurité ;
- adaptation réglementaire obligatoire ;
- correction documentaire reflétant le fonctionnement réellement publié.

Les corrections applicatives sont traitées selon le processus de hotfix défini dans RELEASE-001.

---

# 6. AKS Platform v1.1 — Consolidation

## 6.1 Statut

**Publié**.

La V1.1.0 a été publiée le 25 juillet 2026. La branche applicative `main` et le
tag `v1.1.0` identifient le commit
`397d8aedbb73707a898d439e9ab7747f9e396f99`.

La publication est validée par la suite Apps Script V1.1 (**121/121 tests**) et
par les quatre contrôles de non-régression du Questionnaire santé et du
connecteur WordPress, sur ordinateur et mobile.

## 6.2 Objectif

La V1.1 constitue une version de consolidation.

Elle ne vise pas à ajouter un nouveau module métier, mais à renforcer la plateforme avant l’arrivée d’AKS Analytics et d’AKS Calendar.

Le résultat attendu est une plateforme :

- gouvernée ;
- modulaire ;
- administrable ;
- paramétrable ;
- journalisée ;
- cohérente sur le plan UX ;
- documentée ;
- prête à accueillir de nouveaux modules sans remettre en cause la V1.0.0.

## 6.3 Axes prioritaires validés

L’ordre de priorité de la V1.1 est le suivant :

1. gouvernance produit ;
2. consolidation de ROADMAP-001 ;
3. architecture fonctionnelle de la plateforme ;
4. tableau de bord d’administration ;
5. paramétrage centralisé ;
6. journalisation commune ;
7. améliorations UX ;
8. documentation.

## 6.4 Gouvernance produit

La V1.1 doit :

- formaliser les responsabilités produit ;
- homogénéiser les documents du Project Book ;
- normaliser les livrables et critères d’acceptation ;
- distinguer les décisions, spécifications et procédures ;
- définir les critères d’entrée et de sortie des versions ;
- clarifier le cycle de développement et de publication.

## 6.5 Architecture fonctionnelle

La V1.1 doit :

- clarifier les responsabilités des composants ;
- distinguer AKS Core des modules métier ;
- formaliser les services de plateforme ;
- réduire les dépendances implicites ;
- définir les contrats entre le socle et les modules ;
- préparer l’extension fonctionnelle sans surarchitecture.

Toute évolution d’architecture doit répondre à un besoin concret ou réduire un risque identifié.

## 6.6 Tableau de bord d’administration

Le tableau de bord doit fournir un point d’entrée centralisé vers :

- l’état général de la plateforme ;
- les campagnes et traitements disponibles ;
- les paramètres ;
- les journaux fonctionnels ;
- les outils d’administration ;
- les actions nécessitant une attention ;
- les futurs modules autorisés.

## 6.7 Paramétrage centralisé

Le système de paramétrage doit notamment couvrir :

- la saison active ;
- l’identité et les coordonnées du club ;
- les adresses utilisées pour les notifications ;
- les options applicatives ;
- les identifiants des ressources ;
- les paramètres des modules ;
- les intégrations externes ;
- les valeurs sensibles selon des mécanismes adaptés.

Un paramètre ne doit pas être dupliqué dans plusieurs composants.

## 6.8 Journalisation

La journalisation commune doit permettre :

- le suivi des traitements ;
- le diagnostic des erreurs ;
- la traçabilité des opérations importantes ;
- l’audit fonctionnel ;
- la supervision depuis l’administration ;
- l’exploitation future par les modules.

Elle ne doit pas conserver de données sensibles inutiles.

## 6.9 Expérience utilisateur

Les améliorations UX doivent porter en priorité sur :

- la cohérence des interfaces ;
- la clarté des messages ;
- la navigation ;
- l’accessibilité ;
- la gestion des erreurs ;
- la lisibilité des états et résultats ;
- la compatibilité mobile lorsque nécessaire.

La V1.1 ne prévoit pas de refonte graphique complète.

Le premier incrément livré fournit un socle CSS commun au Centre de pilotage, au Paramétrage et aux Journaux. Il harmonise le focus clavier, les zones d'action d'au moins 44 px, les états désactivés et la réduction des animations, tout en préservant les styles propres à chaque écran. Cet incrément est validé par la suite Apps Script V1.1 (**111/111 tests**).

Le deuxième incrément sécurise les actions asynchrones du Paramétrage : prévention des doubles soumissions, verrouillage pendant le traitement, annonces accessibles, réactivation après échec et messages publics sans détail technique. Cet incrément est validé par la suite Apps Script V1.1 (**115/115 tests**).

Le troisième incrément améliore la lisibilité de la consultation des Journaux : nombre de résultats, indication des filtres actifs, réinitialisation directe et état vide contextualisé. Il ne modifie ni les données journalisées ni les droits d’accès. Cet incrément est validé par la suite Apps Script V1.1 (**118/118 tests**).

Le quatrième et dernier incrément harmonise la présentation des événements entre Journaux et Centre de pilotage : dates et heures au format français dans le fuseau `Europe/Paris`, niveaux compréhensibles et conservation des valeurs techniques originales. Cet incrément est validé par la suite Apps Script V1.1 (**121/121 tests**). Le chantier `UX-001` est fonctionnellement terminé.

## 6.10 Documentation

Tous les composants, paramètres, traitements et procédures réellement ajoutés ou modifiés doivent être documentés avant publication.

La documentation doit correspondre au comportement effectif de la version publiée.

## 6.11 Éléments exclus

Sont explicitement exclus de la V1.1 :

- le développement d’AKS Analytics ;
- le développement d’AKS Calendar ;
- l’ajout d’un nouveau module métier ;
- la refonte graphique complète ;
- la réécriture du Questionnaire santé ;
- la modification d’une fonctionnalité V1.0.0 sans besoin validé ;
- l’introduction d’une infrastructure sans valeur produit démontrée ;
- toute dépendance envers l’environnement Proxmox personnel ;
- tout livrable non directement exploitable.

## 6.12 Critères d’entrée

La réalisation d’un élément V1.1 peut commencer lorsque :

- le besoin est décrit ;
- le périmètre est défini ;
- les dépendances sont identifiées ;
- les risques principaux sont connus ;
- le livrable attendu est explicite ;
- les critères d’acceptation sont définis ;
- les impacts sur la V1.0.0 ont été évalués.

## 6.13 Critères de sortie

La V1.1 pourra être publiée lorsque :

- la gouvernance produit est documentée et validée ;
- ROADMAP-001 est consolidé ;
- ARCH-001 et CORE-001 sont cohérents ;
- le tableau de bord d’administration est opérationnel ;
- le paramétrage centralisé est opérationnel ;
- la journalisation commune est opérationnelle ;
- les améliorations UX engagées sont intégrées ;
- les procédures d’exploitation sont documentées ;
- les tests de non-régression V1.0.0 sont concluants ;
- aucun défaut bloquant ou critique connu ne subsiste ;
- la branche `develop` est stabilisée ;
- le code et la documentation sont synchronisés ;
- la version est prête à être fusionnée dans `main` ;
- le tag de publication peut être créé selon RELEASE-001.

## 6.14 Ordre d’exécution documentaire de la consolidation

L’ordre de consolidation documentaire retenu pour la V1.1 est le suivant :

1. ROADMAP-001 — feuille de route et pilotage ;
2. GOV-001 — gouvernance produit ;
3. ADMIN-001 — tableau de bord d’administration ;
4. SECURITY-001 — sécurité de la plateforme ;
5. AUDIT-001 — audit et traçabilité ;
6. NOTIF-001 — notifications ;
7. API-001 — interfaces et contrats internes ;
8. ERROR-001 — gestion des erreurs ;
9. DOCUMENT-001 — génération documentaire ;
10. STORAGE-001 — stockage et conservation ;
11. DOC-001 — revue finale de la gouvernance documentaire et de la cohérence du Project Book.

Les documents ARCH-001, CORE-001, CONFIG-001, LOG-001 et UX-001 ont été consolidés avant la formalisation de cet ordre. Ils restent des dépendances de référence et doivent être réexaminés uniquement si une consolidation ultérieure introduit une contradiction ou une dépendance nouvelle.

## 6.15 État documentaire de la V1.1

| Document | Domaine | État au 9 août 2026 |
|---|---|---|
| ROADMAP-001 | Feuille de route | Validé |
| GOV-001 | Gouvernance produit | Validé |
| ARCH-001 | Architecture fonctionnelle | Validé |
| CORE-001 | Services de plateforme | Published |
| CONFIG-001 | Paramétrage centralisé — registre, résolution, persistance, écriture contrôlée et interface d’administration validés (80/80 tests et validation manuelle) | Validé |
| LOG-001 | Journalisation — socle structuré, persistance durable dans `AKS_Logs`, conservation à 90 jours, purge contrôlée et consultation administrative en lecture seule validés (106/106 tests) ; chantier fonctionnellement terminé | Validé |
| UX-001 | Expérience utilisateur — fondations administratives communes, retours d’action du Paramétrage, consultation des Journaux et présentation compréhensible des événements validés (121/121 tests) ; chantier fonctionnellement terminé | Validé |
| SECURITY-001 | Sécurité | Validé |
| AUDIT-001 | Audit et traçabilité — premier incrément persistant commun intégré dans `develop` par la PR #90 au commit `ad3b5cea26063c73b22f155a85ed4fbfa855ba69`, recette Google isolée concluante et suite cumulative 423/423 | Validé |
| NOTIF-001 | Notifications | Validé |
| API-001 | Interfaces internes | Validé |
| ERROR-001 | Gestion des erreurs | Validé |
| DOCUMENT-001 | Génération documentaire | Validé |
| STORAGE-001 | Stockage et conservation | Validé |
| DOC-001 | Gouvernance documentaire | Validé |
| ADMIN-001 | Dashboard — premier incrément | Validé |
| ADMIN-002 | Interface utilisateur et navigation | Validé |
| ADMIN-005 | Centre de pilotage — validation et conformité | Validé |
| ADMIN-003 | Composition du Centre de pilotage | Validé |
| ADMIN-004 | Contrats DashboardProvider et DashboardWidget | Validé |
| ARCH-002 | Architecture logique transverse — livrables M1.1 à M1.7 | Validé — chantier terminé |
| ANALYTICS-001 | AKS Analytics — vision et architecture | Référence de développement |
| ANALYTICS-002 | AKS Analytics — modèle métier | Référence de développement |
| ANALYTICS-003 | AKS Analytics — services et orchestration | Référence de développement |
| ANALYTICS-004 | AKS Analytics — interfaces et restitutions | Référence de développement |
| ANALYTICS-005 | AKS Analytics — contrats externes et formats des sources | Référence de développement |
| ANALYTICS-006 | AKS Analytics — stratégie de validation, jeux d’essai et recette | Référence de développement |

Les états de ce tableau reprennent le statut réel des documents ou, pour les chantiers composites, leur niveau de clôture. Le statut documentaire ne signifie pas automatiquement que toutes les fonctionnalités décrites sont déjà implémentées dans le dépôt applicatif.

## 6.16 Règle de mise à jour du suivi

Après chaque consolidation documentaire :

- le document concerné est mis à jour dans le dépôt Project Book ;
- le commit constitue la preuve de la consolidation ;
- le tableau de suivi de la présente section est actualisé lorsque nécessaire ;
- les contradictions détectées avec un document déjà consolidé doivent être résolues avant de poursuivre ;
- aucune fonctionnalité ne doit être déclarée opérationnelle sur la seule base de sa documentation.

---

# 7. Dépendances de la V1.1

## 7.1 Dépendances internes

La V1.1 doit assurer la cohérence entre :

- ROADMAP-001 ;
- GOV-001 ;
- ARCH-001 ;
- CORE-001 ;
- ADMIN-001 ;
- CONFIG-001 ;
- LOG-001 ;
- UX-001 ;
- SECURITY-001 ;
- AUDIT-001 ;
- NOTIF-001 ;
- API-001 ;
- ERROR-001 ;
- DOCUMENT-001 ;
- STORAGE-001 ;
- DOC-001 ;
- RELEASE-001.

Aucun de ces documents ne doit définir un comportement contradictoire avec les autres.

L’absence temporaire d’un document dédié n’autorise pas l’implémentation implicite de son domaine. Le besoin doit d’abord être cadré dans le Project Book ou rattaché explicitement à un document existant.

## 7.2 Dépendances avec AKS Analytics

La V1.1 doit fournir à AKS Analytics :

- une architecture modulaire ;
- des services communs stables ;
- un paramétrage centralisé ;
- une journalisation exploitable ;
- un tableau de bord extensible ;
- des conventions documentaires et de publication stabilisées ;
- des mécanismes de stockage et d’export réutilisables lorsque nécessaires.

AKS Analytics ne devra pas modifier le fonctionnement du Questionnaire santé.

## 7.3 Dépendances avec AKS Calendar

La V1.1 doit fournir à AKS Calendar :

- le paramétrage des intégrations externes ;
- la journalisation ;
- le tableau de bord ;
- les règles de sécurité ;
- les conventions d’accès et d’autorisation ;
- les services d’intégration communs.

La première implémentation reposera sur Google Calendar et le compte du club, afin de couvrir rapidement les besoins sans développer un moteur de calendrier interne.

---

# 8. WEB-001 — Point d’accès WordPress à AKS Platform

## 8.1 Statut

**Publié — chantier terminé**.

WEB-001 a été validé le 25 juillet 2026 après mise en place du menu « Services en ligne » et réussite des cinq contrôles fonctionnels sur ordinateur, mobile, Questionnaire santé et administration autorisée ou refusée.

## 8.2 Positionnement

WEB-001 a été réalisé après la publication officielle de la V1.1 sur `main` et avant le développement d’AKS Analytics.

Son inscription dans la roadmap ne modifie pas le périmètre fonctionnel de la V1.1 et ne bloque pas sa publication.

## 8.3 Objectif

WEB-001 doit fournir depuis le site WordPress du club un point d’entrée clair vers les services d’AKS Platform, sans créer à ce stade un portail applicatif supplémentaire.

Le libellé recommandé pour le menu public est **« Services en ligne »**.

## 8.4 Séparation des accès

Le point d’entrée doit distinguer clairement :

- les services publics, notamment le Questionnaire santé des mineurs et les futurs services destinés aux licenciés ;
- l’accès **« Administration AKS »**, réservé aux responsables autorisés et orienté vers le Web App administratif distinct.

Le Questionnaire santé reste accessible sans compte WordPress ni compte Google.

L’administration conserve son authentification Google, son autorisation minimale contrôlée côté serveur et sa séparation complète du Web App public.

## 8.5 Périmètre initial

Le premier incrément de WEB-001 est limité à :

- la création ou l’adaptation du menu WordPress ;
- la mise à disposition des liens vers les services réellement disponibles ;
- la distinction visuelle et fonctionnelle entre accès public et accès réservé ;
- la vérification des liens sur ordinateur et mobile ;
- la documentation de maintenance du menu.

Les entrées correspondant à des modules futurs ne doivent pas être affichées comme disponibles avant leur publication.

## 8.6 Éléments exclus

Sont exclus du premier incrément :

- le développement d’un portail spécifique ;
- la création d’un système de comptes ou de rôles propre à WordPress ;
- la fusion des Web Apps public et administratif ;
- la modification du Questionnaire santé ;
- le développement anticipé d’AKS Analytics ou d’AKS Calendar ;
- l’affichage de services simulés ou non publiés.

## 8.7 Critères d’acceptation prévisionnels

WEB-001 pourra être considéré comme terminé lorsque :

- le menu est accessible et compréhensible sur ordinateur et mobile ;
- le Questionnaire santé est joignable depuis l’espace public ;
- l’administration est identifiée comme un accès réservé ;
- le lien administratif cible le Web App administratif distinct ;
- les contrôles d’accès serveur restent inchangés et efficaces ;
- aucune entrée ne présente comme disponible un module non publié ;
- la procédure de maintenance des liens est documentée ;
- les parcours publics et administratifs sont testés sans régression.

---

# 9. AKS Platform V1.2.0 — AKS Analytics

## 9.1 Statut

**Publié — version V1.2.0**.

Le module AKS Analytics est implémenté et sa recette est concluante. Le corpus `ANALYTICS-001` à `ANALYTICS-008` constitue la référence documentaire du périmètre livré. La suite cumulative atteint **273/273 tests réussis, 0 échec** ; la prévisualisation et la publication contrôlée des six rapports de recette ont été validées, puis les identifiants officiels ont été restaurés.

La V1.2.0 a été publiée le 28 juillet 2026 par la PR applicative #41. Le commit de publication est `47bb3ca83eb902bc9db0867c8d41affffd3ceb47` et le tag de référence est `v1.2.0`.

## 9.2 Objectif

AKS Analytics doit fournir des indicateurs, analyses et rapports exploitables par l’association.

## 9.3 Périmètre validé

- import et contrôle des données de présence ;
- analyse par cours ;
- rapports séparés Baby, Enfant 1, Enfant 2 et Ado/Adulte ;
- exclusion explicite du cours féminin des analyses 2025-2026 faute de données de présence complètes ;
- préparation de son intégration à partir de 2026-2027, sous réserve d’un suivi homogène et validé ;
- synthèse globale ;
- graphiques ;
- commentaires automatiques ou assistés ;
- exports pour bilans et assemblées générales ;
- préparation automatique des ressources d’une nouvelle saison ;
- journal de contrôle des opérations de préparation.

Le modèle métier, l’orchestration, les interfaces, les contrats de sources, la stratégie de validation, les règles de calcul et le procès-verbal de recette sont validés dans `ANALYTICS-001` à `ANALYTICS-008`. Les rapports officiels seront exploitables lorsque les sources réelles contiendront des présences conformes ; l’absence actuelle de données réelles n’est pas un défaut de publication.

## 9.4 Critères de sortie validés

- V1.1.0 publiée et socle transverse stable ;
- contrats et formats de sources validés ;
- règles de calcul formalisées dans `ANALYTICS-007` ;
- diagnostic saisonnier à quatre ou cinq cours validé ;
- cinq rapports de cours et une synthèse globale prévisualisés ;
- six PDF de recette publiés et accessibles dans Google Drive ;
- suite cumulative **273/273** réussie ;
- aucun défaut bloquant ou critique ouvert ;
- bilan d’implémentation et procès-verbal de recette consignés dans `ANALYTICS-008` ;
- code applicatif publié sur `main` et documentation de clôture présente sur `develop`.

---

# 10. ANALYTICS-SAISIE — Interface de saisie des présences

## 10.1 Statut

**Publié — chantier terminé**.

Le Product Owner a validé le 28 juillet 2026 la priorité de ce chantier avant
AKS Calendar.

## 10.2 Objectif

Permettre aux administrateurs, professeurs et assistants AFA explicitement
autorisés de saisir rapidement les présences depuis un téléphone ou une tablette,
avec contrôle systématique des droits côté serveur.

Le premier contrat d’écriture reste celui réellement consommé par la V1.2.0 : `Configuration`, `Licenciés`, `Séances` et `Présences`.

## 10.3 Décisions structurantes

- une séance possède les états `BROUILLON` et `CLÔTURÉE` ;
- les assistants AFA saisissent uniquement les cours explicitement autorisés ;
- un professeur peut corriger avant clôture ;
- après clôture, la correction est réservée par défaut à l’administrateur ;
- la saisie est enregistrée par lot avec verrouillage contre les écritures
  concurrentes ;
- les rôles et affectations sont toujours contrôlés côté serveur.

Le cadrage détaillé est défini dans `ANALYTICS-SAISIE-001`.

La spécification `ACCESS-001` formalise les rôles, capacités, affectations par cours et saison, le refus fermé côté serveur et la migration compatible depuis la liste administrative V1.2.0. Ses six décisions structurantes ont été validées par le Product Owner le 28 juillet 2026. Son premier socle est intégré sur `develop` par la PR applicative #51 : registre central, capacités serveur, amorçage historique sécurisé et 18 tests locaux réussis. La validation cumulative Apps Script du 28 juillet 2026 est concluante : **309/309 tests réussis, 0 échec**. Le raccordement au catalogue Analytics et au service d’écriture est intégré par la PR applicative #52, commit `9375b1be609870848584a73e802a5d47502c5c8c` ; 17/17 tests ciblés réussissent. La validation cumulative Apps Script du raccordement est concluante : **311/311 tests réussis, 0 échec**. L’exposition serveur sécurisée est intégrée sur `develop` par la PR applicative #53, commit `d67bc1c241d6dccc2c94b74c29759752aab6e4b0` : contexte autorisé minimal, écriture déléguée au contrat validé, composition exclusivement serveur et erreurs internes masquées. Quatre tests ciblés sont ajoutés. La validation cumulative Apps Script du 28 juillet 2026 est concluante : **315/315 tests réussis, 0 échec**. La recette fonctionnelle serveur est également concluante sur la copie `[RECETTE] Analytics Baby 2026-2027` : identité `karate.seremange@gmail.com`, refus d’écriture non autorisée avec `ACCESS_DENIED`, périmètre limité à un cours, séance `SEA-3B8F53F4970F` clôturée en version 2 et deux présences enregistrées. L’exposition serveur est autorisée à être publiée, sans déploiement utilisateur à ce stade.

`ANALYTICS-SAISIE-002` spécifie le contrat d’écriture sécurisé des séances et présences. Ses huit décisions structurantes ont été validées par le Product Owner le 28 juillet 2026. Le contrat est la référence de développement : séparation des états, écriture par lot, brouillons exclus des rapports, contrôle de version, idempotence, verrouillage, motif de correction après clôture et limitation initiale à une séance par cours et par date.

L’implémentation du contrat a été fusionnée sur `develop` par la PR applicative #46, puis son correctif de normalisation des dates Europe/Paris par la PR #48. La suite cumulative exécutée dans Apps Script le 28 juillet 2026 est concluante : 291/291 tests réussis, 0 échec.

La recette d’écriture sur la copie `[RECETTE] Analytics Baby 2026-2027` est également concluante : le brouillon est exclu des rapports, la séance `SEA-96ADF8B7FE53` est clôturée en version 2 et les deux présences sont relues par Analytics. Le contrat d’écriture est publié sur `main` par la PR applicative #49, commit `6cfec0ca1378226223a48464dc6971a685b4cfb5`.

`ANALYTICS-SAISIE-003` est intégré sur `develop` par la PR applicative #58, commit `c7adbe52a8b30a55804b8f1867842f4e22ec2d9d`. Il ajoute la route `?app=attendance`, l’identité active, les cours autorisés, le choix de date, l’effectif éligible et les séances récentes. Les 6/6 tests ciblés réussissent. La validation cumulative Apps Script du 28 juillet 2026 est également concluante : **321/321 tests réussis, 0 échec**. La saisie rapide des statuts est autorisée à poursuivre sur `develop`.

`ANALYTICS-SAISIE-004` est intégré sur `develop` par les PR applicatives #59 et #60,
commit final `3a15d65e4b914ea684e5fcf15bf6e48203c77827`. Il ajoute le roster éligible
nettoyé, les quatre statuts tactiles, la création d’un brouillon et sa reprise
avec contrôle de version. Une séance clôturée reste en lecture seule. Les 4/4 tests ciblés réussissent. La validation
cumulative Apps Script du 28 juillet 2026 est concluante : **325/325 tests réussis,
0 échec**. La clôture mobile, sa confirmation et sa recette sont autorisées à poursuivre.

`ANALYTICS-SAISIE-005` est intégré sur `develop` par la PR applicative #61,
commit `6c67719b870a91bb25798e5b6334e7f4b076ee33`. Il ajoute le blocage d’une
clôture incomplète, la confirmation explicite, la commande serveur versionnée et
le retour en lecture seule après succès. Les 4/4 tests ciblés réussissent. La validation cumulative Apps Script du 28 juillet 2026 est concluante : **329/329 tests réussis, 0 échec**. Le correctif de l’assertion de test obsolète est intégré par la PR applicative #62, commit `e49047c9`, sans modification du comportement applicatif.

`ANALYTICS-SAISIE-006` est intégré sur `develop` par la PR applicative #63,
commit `0c78284cdf492ca8275b60aa317618c09087042b`. Il ajoute une route de
recette distincte, une composition serveur dédiée et des verrous cumulatifs sur
l’identité `karate.seremange@gmail.com`, le cours `BABY`, la saison
`2026-2027`, une date réservée et le classeur
`[RECETTE] Analytics Baby 2026-2027`. Quatre tests cumulatifs portent la suite
à **333/333 réussis, 0 échec**.

La date réservée a ensuite été déplacée au `2026-09-26` afin de documenter un
nouveau cycle complet sans altérer les preuves précédentes. Cette adaptation,
publiée par les PR applicatives #82 et #83, conserve une suite cumulative
concluante à **333/333 tests réussis, 0 échec**. Le contrôle navigateur a validé
l’ouverture, la saisie, le brouillon, sa reprise, la clôture et la lecture seule
avec `TEST Alpha` et `TEST Beta`.

La publication sur `main` a ensuite été réalisée. Le bouton de retour de la page
Présences utilise désormais l’URL absolue du déploiement vers `?app=admin`,
fournie par `viewModel.navigation.homeTarget`, et reprend le rendu visuel des
autres modules administratifs. La composition serveur de recette reste distincte
de celle de production. Les PR applicatives #79 et #81 ont été validées sur
`main` par **333/333 tests réussis, 0 échec**. Le déploiement Web de production a
été mis à jour et le contrôle navigateur final est concluant sur mobile :
affichage du bouton et retour vers le Centre de pilotage conformes.

Le guide utilisateur illustré `GUIDE-SAISIE-PRESENCES.md` documente l’accès
depuis la rubrique **Modules**, la préparation d’une séance, la saisie, le
brouillon, la reprise, la clôture et la lecture seule. Les données de recette y
sont explicitement identifiées comme fictives.

# 11. AKS Calendar — Socle opérationnel

## 11.1 Statut

**Socle Google Calendar, publication publique et accès internes WordPress validés — chantier terminé**.

Le Product Owner a validé `CALENDAR-001` le 30 juillet 2026. La configuration et la recette `CALENDAR-002` ont été achevées le 31 juillet 2026 : quatre calendriers officiels sont opérationnels, les droits internes ont été contrôlés, le circuit Propositions vers Public a été testé et les données temporaires ont été supprimées. `CALENDAR-003` a ensuite publié `AKS - Public` sur WordPress à l’adresse https://karate-seremange.fr/calendrier-aks/, validé l’affichage sur ordinateur et mobile, les abonnements Google Agenda et iCal, l’entrée du menu Services en ligne et le guide utilisateur. `CALENDAR-004` complète le dispositif le 1er août 2026 avec une page WordPress protégée donnant accès aux trois calendriers internes ; la recette confirme le filtre WordPress, la connexion Google et le contrôle effectif des droits par Google Calendar. Le socle AKS Calendar est désormais complètement terminé. Les mécanismes avancés restent différés.

## 11.2 Objectif

AKS Calendar doit proposer un calendrier partagé pour les professeurs et responsables du club en s’appuyant prioritairement sur Google Calendar.

## 11.3 Périmètre prévisionnel

- intégration avec le compte Google du club ;
- calendrier partagé ;
- gestion des événements ;
- gestion des accès ;
- visibilité adaptée aux différents publics ;
- administration depuis AKS Platform lorsque cela apporte une valeur concrète ;
- journalisation des opérations importantes.

## 11.4 Principe d’implémentation

Google Calendar est retenu comme moteur initial afin de couvrir l’essentiel des besoins avec un effort maîtrisé.

Un développement interne complet ne pourra être envisagé que si des besoins non couverts justifient clairement son coût et sa maintenance.

L’ordre de réalisation a été achevé : `CALENDAR-001` pour le cadrage, `CALENDAR-002` pour la mise en place et la recette Google Calendar, `CALENDAR-003` pour la publication du calendrier Public sur WordPress et le guide utilisateur, puis `CALENDAR-004` pour l’accès protégé aux trois calendriers internes depuis le site. Aucun développement applicatif n’a été nécessaire.

---

# 12. Publication AKS Platform V1.3.0 — AKS Calendar

## 12.1 Statut

**Publiée le 1er août 2026**.

La V1.3.0 regroupe le socle AKS Calendar opérationnel et documenté dans `CALENDAR-001` à `CALENDAR-004`. Elle n’introduit aucun nouveau code applicatif : la valeur livrée repose sur Google Calendar et WordPress. Le tag documentaire `v1.3.0` pointe sur le commit de publication `647ae45a501bf14c1f3463fbca480945993bc515`.

## 12.2 Critères de sortie validés

- quatre calendriers Google officiels configurés et testés ;
- droits de consultation et de modification contrôlés ;
- circuit Propositions vers Public validé ;
- calendrier public publié sur WordPress et testé sur ordinateur et mobile ;
- abonnement Google Agenda et téléchargement iCal validés ;
- page protégée donnant accès aux trois calendriers internes ;
- double contrôle d’accès WordPress et Google Agenda validé ;
- guide utilisateur et procès-verbaux de recette documentés ;
- aucun changement applicatif requis ;
- branches applicatives réalignées avant publication.

La fusion documentaire vers `main` et la création du tag `v1.3.0` ont été vérifiées. La V1.3.0 est clôturée.

---

# 13. AKS Inscriptions — Chantier engagé

## 13.1 Statut

**Engagé — quatrième incrément INSCRIPTIONS-010 clôturé et intégré dans `develop` ; ACCESS-002 engagé comme prérequis transverse avant INSCRIPTIONS-011**.

Le Product Owner a validé le lancement d’un module unique AKS Inscriptions alimenté par trois parcours publics distincts : Karaté classique, Cours féminin et Body Karaté. `INSCRIPTIONS-001` constitue le cadrage fonctionnel validé, `INSCRIPTIONS-002` le modèle métier validé, `INSCRIPTIONS-003` les services, transitions et contrats de reprise transitoire validés, `INSCRIPTIONS-004` l’interface de contrôle ainsi que l’extension documentaire d’`ACCESS-001` aux futurs modules privés, et `INSCRIPTIONS-005` les contrats techniques de stockage, d’identifiants, d’idempotence, d’audit et d’intégration validés. `INSCRIPTIONS-006` définit et valide les jeux d’essai ainsi que la recette cumulative. Son premier incrément applicatif sans écriture est intégré sur `develop` par la PR #85, commit `d09c85c3e125f8944b3f6aa47ba222fdf3a73b32`, avec **341/341 tests réussis**. Le deuxième incrément défini par `INSCRIPTIONS-008` est intégré par la PR applicative [#87](https://github.com/karateseremange/AKS-Platform/pull/87), commit de fusion `ceda8b322715f77399bf8e7eda80c8e2b046daaa`. Après `clasp push` contrôlé, la suite Apps Script exécutée le 2 août 2026 atteint **360/360 tests réussis, 0 échec** ; les seize jeux produisent **13 réussites, 1 résultat partiel et 2 blocages attendus**. Aucun déploiement, registre réel ou accès à une donnée métier Google n’a été introduit.

Le troisième incrément défini par `INSCRIPTIONS-009` est intégré par la PR applicative [#88](https://github.com/karateseremange/AKS-Platform/pull/88), commit de fusion `b870d6f425e52c1ec63f1bb5ce1b5214296c8465`. Ses **20 tests ciblés** réussissent. Après synchronisation contrôlée de la tête `0ee4bb7b7d37a6f84dea38dc57edccf732053782`, la suite Apps Script exécutée le 3 août 2026 atteint **380/380 tests réussis, 0 échec**. Le bilan des jeux d’or reste **13 réussis, 1 partiel et 2 bloqués**. Aucun adaptateur Google, stockage métier réel, interface ou déploiement n’a été introduit.

Le quatrième incrément défini par `INSCRIPTIONS-010 1.1.1` réalise une persistance Google exclusivement technique et isolée en recette : garde d’environnement, schéma `Metadata`/`Sequences`/`Commandes`, verrou réel, journal et séquences persistants, avec audit commun AKS Core. Il interdit toute donnée nominative, tout objet métier réel, toute application de lot, interface, ressource de production ou déploiement. La PR applicative [#89](https://github.com/karateseremange/AKS-Platform/pull/89) a été fusionnée dans `develop` le 9 août 2026 au commit `ed03cc428f8a8b055400b59aec7ba2e0a005629f`; la tête finale recettée avant fusion est `0da406b0796dc4d96e1c403fe90dc4ab76d4cc06`.

Le prérequis transverse `AUDIT-001` a été intégré dans `develop` par la PR applicative #90 au commit `ad3b5cea26063c73b22f155a85ed4fbfa855ba69`. La branche #89 a ensuite été réalignée sur ce socle, puis synchronisée dans Apps Script. La suite cumulative finale atteint **455/455 tests réussis, 0 échec**.

La recette Google Sheets isolée du 9 août 2026 sur `[RECETTE] AKS Inscriptions` est concluante pour le périmètre réellement exécuté. Le schéma `inscriptions-recipe-tech/1.0` a été créé avec `Metadata`, `Sequences` et `Commandes` dans le fuseau `Europe/Paris`. Une première allocation a révélé que Sheets convertissait automatiquement la chaîne `scope_key = "2026"` en valeur numérique ; la relecture stricte a refusé cette altération. La correction du commit `0da406b` force désormais les valeurs chaîne au format texte lors des écritures contrôlées. Après correction, la séquence `INS-2026-000001` et la commande fictive `CMD-RECETTE-010-001` ont été persistées et relues conformément au contrat.

La campagne ne doit pas être interprétée comme une preuve Google réelle de tous les scénarios de concurrence et de reprise du cadrage initial. Les collisions simultanées, conflits de version provoqués réellement dans Sheets, interruptions et réconciliations restent couverts par les tests injectés lorsqu’ils existent et nécessiteraient une campagne dédiée pour constituer une preuve réelle distincte. Le détail est consigné dans `INSCRIPTIONS-010-RECETTE`.

## 13.2 Objectif

AKS Inscriptions doit remplacer progressivement les recopies et suivis répartis entre formulaires Google, classeurs Excel et documents de travail par un référentiel commun des licenciés et des dossiers saisonniers.

Le parcours couvre la préinscription ouverte toute la saison, le contrôle des données, l’affectation au cours, les capacités et listes d’attente, la confirmation, l’inscription physique, les pièces, règlements et aides, la préparation SIKADA, l’import des numéros FFK puis l’activation vers Analytics et Présences.

## 13.3 Principes validés

- trois formulaires publics alimentent un seul module ;
- la personne possède un identifiant interne stable et un dossier par saison ;
- le numéro FFK est renseigné après création dans SIKADA et n’est pas l’identifiant interne ;
- le numéro FFKDA est stocké comme texte selon le format actuel observé `8 chiffres + 1 lettre` ;
- les états administratif, de place, fédéral et d’activation sont suivis séparément ;
- la préinscription reste obligatoire pour toute nouvelle inscription et ouverte toute la saison ;
- les places restent limitées par cours et une liste d’attente est prévue ;
- le paiement en ligne et l’espace licencié sont exclus du périmètre initial ;
- aucun code n’est écrit avant validation du cadrage fonctionnel ;
- Google authentifie les utilisateurs privés et AKS Platform autorise chaque module et chaque action ;
- les rôles généraux et les capacités propres aux modules sont distincts et cumulables ;
- l’accès privé à Analytics est contrôlé côté serveur et complété par les partages Google Drive ;
- les trois Google Forms restent les interfaces publiques transitoires.

## 13.4 Prochain jalon

INSCRIPTIONS-010 est clôturé pour son périmètre autorisé. Avant d’ouvrir le cinquième incrément métier `INSCRIPTIONS-011`, le chantier transverse `ACCESS-002 — Administration des utilisateurs et habilitations` reste prioritaire. `ACCESS-002-01` est clôturé après fusion de la [PR applicative #93](https://github.com/karateseremange/AKS-Platform/pull/93) dans `develop`, au commit [`91ba7e3`](https://github.com/karateseremange/AKS-Platform/commit/91ba7e37972ce3ab1d96aa74bbdf4fc1bc4d38e8). Le prérequis explicite d'`ACCESS-002-02` est intégré par la [PR applicative #94](https://github.com/karateseremange/AKS-Platform/pull/94), au commit [`e800bdb`](https://github.com/karateseremange/AKS-Platform/commit/e800bdbc38a7618921a12358bdfee1f28ec865e8), sans amorçage réel.

Les cinq lots publiés ajoutent `ANALYTICS_READ` comme capacité indépendante tout en préservant `access/1.0`, introduisent une façade administrative de lecture protégée et immuable, établissent une écriture administrative strictement validée avec révision optimiste, verrou, relecture et restauration vérifiée, imposent un audit persistant corrélé avant/après, puis corrigent l’usage du verrou partagé ACCESS/AUDIT, l’autorisation d’audit et le raccordement des suites. Les refus et restaurations sont tracés, et un échec de preuve finale déclenche la restauration de l’état précédent. Le bootstrap historique reste temporairement accepté lorsque le registre est absent ; dès qu'un registre existe, `ADMINISTRATEUR` est descriptif et ne confère aucune capacité implicite. Aucun compte réel, registre, mécanisme `AKS.Admin.Access`, environnement de production ou branche `main` n’est modifié.

Les validations locales réussissent à 193/193 pour la syntaxe des fichiers `.gs`, 18/18 pour ACCESS-001, 19/19 pour ACCESS-002-01, 46/46 pour AUDIT-001 et 9/9 pour Inscriptions ciblés. La tête `84ea68f` a été synchronisée dans le projet Apps Script isolé de recette avec 226 fichiers, puis la suite cumulative réelle a réussi à **477/477 tests, 0 échec**. Le recomptage confirme 477 fonctions uniques ; la valeur préparatoire 478 provenait d’un inventaire statique erroné.

Le modèle intégré ajoute une affectation transverse `ACCESS` compatible avec `access/1.0` et rend `ACCESS_MANAGE` explicitement attribuable. Le protocole interne de précontrôle, application sous verrou et restauration exacte est intégré par la [PR applicative #95](https://github.com/karateseremange/AKS-Platform/pull/95), au commit [`bbedf0a`](https://github.com/karateseremange/AKS-Platform/commit/bbedf0a02c39e1680917013deda8840269964e28). La tête `be7323a` a été synchronisée avec 229 fichiers dans le projet Apps Script isolé, puis la campagne cumulative a réussi à **495/495 tests, 0 échec**. Le précontrôle en lecture seule a ensuite réussi et confirmé un registre absent sans écriture. Le rôle initial cible est `ADMINISTRATEUR`, avec la seule habilitation ajoutée `ACCESS_MANAGE`.

La première tête `395de24` de la [PR applicative #96](https://github.com/karateseremange/AKS-Platform/pull/96) a été synchronisée avec **229 fichiers** et validée à **496/496 tests, 0 échec**, mais la revue finale a détecté que le moteur accordait encore des capacités implicites au rôle. La fusion a été bloquée avant toute mutation. Le correctif fonctionnel `7dacc7b`, publié sur la tête `747c9a3`, retire ces raccourcis et conserve le bootstrap uniquement lorsque le registre est absent. Cette tête a été synchronisée avec **229 fichiers**, puis validée dans Apps Script à **497/497 tests, 0 échec**. L'application, la restauration et l'amorçage réel restent des décisions distinctes soumises à leurs propres autorisations.

La réalisation est officiellement découpée en six incréments :

1. `ACCESS-002-01` — socle d’administration : API serveur sécurisée, validation, modification atomique du registre, temporalité, normalisation et audit avant/après ;
2. `ACCESS-002-02` — amorçage et migration : premier gestionnaire `aserridj@gmail.com`, recette réelle d’accès/refus/audit et maintien temporaire du filet historique ;
3. `ACCESS-002-03` — administration des utilisateurs : liste, recherche, filtres, création, activation/désactivation et vue « Qui a accès à quoi ? » ;
4. `ACCESS-002-04` — fiche et habilitations : multi-rôle, modules, cours, capacités, périodes de validité, synthèse et historique ;
5. `ACCESS-002-05` — portail privé et « Mes accès » ;
6. `ACCESS-002-06` — migration définitive des modules et retrait contrôlé de l’ancien mécanisme.

La règle produit reste explicite : un rôle ne donne pas automatiquement accès à un module. En particulier, un professeur peut n’avoir aucun accès à Présences ; Analytics, Présences et Inscriptions peuvent être attribués indépendamment selon les besoins.

La recette réversible d’`ACCESS-002-02` est validée : campagne 507/507, accès et refus attendus, preuves persistantes corrélées, restauration exacte du registre puis de la configuration AUDIT. Le premier lot d’`ACCESS-002-03` est intégré et validé à 518/518. Le deuxième lot de commandes minimales est publié dans la [PR applicative brouillon #102](https://github.com/karateseremange/AKS-Platform/pull/102), puis corrigé en revue pour auditer les refus métier et imposer la révision courante avant tout retour idempotent. Les validations locales réussissent à 13/13 pour le cycle de vie et 20/20 pour le socle ACCESS ; 532 références cumulatives sont préparées, sans Apps Script ni donnée réelle à ce stade. La fiche détaillée reste réservée à `ACCESS-002-04`. La migration définitive des modules n’intervient qu’après disponibilité de l’administration complète des habilitations. Les tests cumulés et de non-régression sont requis à chaque incrément.

INSCRIPTIONS-011 ne sera cadré qu’après validation d’ACCESS-002 ou décision explicite du Product Owner modifiant cet ordre.

INSCRIPTIONS-010 reste strictement interne et editor-only : aucun déploiement Web App de test n’a été requis pour cet incrément. Si une fonctionnalité observable via le Web App est introduite dans un incrément ultérieur, elle devra faire l’objet d’un déploiement Web App de test et d’une recette utilisateur avant validation finale et fusion dans `develop`.

Le volet SIKADA demeure bloqué tant que l’échantillon anonymisé Windows-1252 à 12 colonnes prévu par `INSCRIPTIONS-006` n’est pas disponible, sécurisé et versionné. Analytics/`BODY_KARATE`, données nominatives, référentiel métier complet, restauration complète, interfaces, application de lot, production et déploiement demeurent séparés du quatrième incrément et nécessitent leur propre cadrage/autorisation.

## 13.5 Backlog restant

Les évolutions ACCESS-002 suivantes sont identifiées mais **différées** et non engagées :

- notifications e-mail lors d’un changement d’habilitations ;
- duplication assistée des habilitations d’une saison vers la suivante ;
- modifications groupées de plusieurs utilisateurs ;
- exports et reporting des habilitations ;
- modèles d’aide à l’attribution de droits, uniquement comme aides de saisie sans héritage implicite.

Elles ne reçoivent pas de version cible tant que leur valeur n’est pas confirmée par l’usage.

Les autres modules ou évolutions restent au statut **candidat** tant qu’ils ne sont pas cadrés et engagés. Ils pourront notamment concerner les grades et passages de grade, les documents associatifs, les communications, les tableaux de bord métier et d’autres intégrations externes.

---

# 14. Jalons de version

Chaque version suit au minimum les jalons suivants :

| Jalon | Résultat attendu |
|---|---|
| **Cadrage** | Objectifs, périmètre, exclusions et dépendances validés. |
| **Spécification** | Livrables et critères d’acceptation documentés. |
| **Développement** | Implémentation réalisée sur `develop`. |
| **Validation** | Tests fonctionnels, techniques et de non-régression concluants. |
| **Prépublication** | Documentation et exploitation synchronisées. |
| **Publication** | Fusion dans `main`, tag et version de référence créés. |
| **Clôture** | Bilan, défauts résiduels et suites documentés. |

Le passage d’un jalon au suivant dépend de la validation des résultats attendus, et non du temps écoulé.

---

# 15. Gestion des écarts

Un écart à la roadmap doit être documenté lorsqu’il concerne :

- l’ajout ou le retrait d’un livrable engagé ;
- le changement d’ordre entre modules ;
- une nouvelle dépendance structurante ;
- une rupture de compatibilité ;
- un report significatif ;
- l’introduction d’un nouveau risque ;
- une modification du périmètre publié.

La décision doit indiquer si l’écart est :

- accepté ;
- corrigé dans la version en cours ;
- reporté ;
- traité par hotfix ;
- transféré au backlog ;
- abandonné.

---

# 16. Indicateurs de pilotage

Le suivi de la roadmap repose au minimum sur :

- le nombre de livrables engagés, terminés et reportés ;
- l’état des critères de sortie ;
- les défauts bloquants ou critiques ;
- les dépendances non résolues ;
- l’état de synchronisation du code et de la documentation ;
- les régressions détectées ;
- les décisions de gouvernance ouvertes ;
- l’état de consolidation des documents structurants de la V1.1.

Ces indicateurs servent au pilotage et ne remplacent pas la validation fonctionnelle des livrables.

---

# 17. Règles de branches et de publication

Pour le dépôt applicatif :

- `main` représente la production ;
- `develop` représente l’intégration des évolutions ;
- les correctifs de production suivent le processus de hotfix ;
- les versions publiées sont identifiées par un tag.

Pour le Project Book :

- `develop` porte les évolutions documentaires en préparation ;
- `main` constitue la branche documentaire officielle validée et publiée ;
- la documentation doit être mise à jour avec les évolutions qu’elle décrit ;
- un document validé ne doit pas annoncer comme opérationnel un élément qui ne l’est pas.

---

# 18. Résultat attendu

ROADMAP-001 doit permettre de répondre sans ambiguïté aux questions suivantes :

- quelle est la version stable ?
- quelle étape est engagée ?
- quels résultats sont attendus ?
- quels éléments sont exclus ?
- quelles dépendances doivent être satisfaites ?
- quels critères permettent de publier ?
- quel module vient ensuite ?
- quels éléments restent de simples candidats ?
- comment une modification de trajectoire est-elle décidée ?
- quel est l’état de consolidation documentaire de la V1.1 ?

La trajectoire officielle est à jour : WEB-001, AKS Analytics, le parcours de
saisie des présences et le socle AKS Calendar sont publiés ou opérationnels ;
la V1.2.0 reste la version applicative stable. AKS Inscriptions est le chantier
métier engagé après la publication documentaire de la V1.3.0. Après la clôture
d’INSCRIPTIONS-010, ACCESS-002 devient le chantier transverse prioritaire avant
la reprise du cinquième incrément métier :

```text
AKS Platform v1.0.0
        ↓
AKS Platform v1.1.0 — Consolidation publiée
        ↓
WEB-001 — Point d’accès WordPress publié
        ↓
AKS Platform v1.2.0 — AKS Analytics publié
        ↓
ANALYTICS-SAISIE — parcours Présences publié et documenté
        ↓
AKS Calendar — socle Google Calendar, publication publique et accès internes WordPress opérationnels
        ↓
AKS Inscriptions — INSCRIPTIONS-010 clôturé sur `develop` à 455/455
        ↓
ACCESS-002-01 — Socle d’administration
        ↓
ACCESS-002-02 — Amorçage et migration
        ↓
ACCESS-002-03 — Administration des utilisateurs
        ↓
ACCESS-002-04 — Fiche et habilitations
        ↓
ACCESS-002-05 — Portail privé et Mes accès
        ↓
ACCESS-002-06 — Migration définitive des modules
        ↓
INSCRIPTIONS-011 — cinquième incrément à cadrer après ACCESS-002
```

Toute modification de cet ordre ou du périmètre engagé doit être validée et documentée selon les règles de gouvernance du Project Book.

---

# 19. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.3.3 | 2026-08-13 | ACCESS-002-03 lot 2 corrigé après revue dans la PR applicative brouillon #102 : refus métier audités et révision courante exigée pour l’idempotence ; cycle de vie 13/13, socle ACCESS 20/20 et suite cumulative préparée à 532 références uniques, sans Apps Script ni donnée réelle |
| 1.3.2 | 2026-08-13 | ACCESS-002-03 lot 1 intégré par la PR applicative #101 au commit `b41787d`, synchronisé avec 231 fichiers puis validé dans Apps Script à 518/518 sans échec ni mutation de donnée réelle |
| 1.3.1 | 2026-08-13 | ACCESS-002-03 engagé par la PR applicative brouillon #101 : projection corrigée après revue pour ne déduire les modules que des capacités effectives, validée localement à 11/11, syntaxe 198/198 et inventaire cumulatif préparé à 518 références uniques, sans recette Apps Script ni donnée réelle |
| 1.3.0 | 2026-08-13 | Cadrage ACCESS-002-03 validé : sept décisions fonctionnelles approuvées, séparation d’ACCESS-002-04 confirmée et implémentation maintenue non engagée avant intégration documentaire |
| 1.2.99 | 2026-08-13 | ACCESS-002-03 ouvert au cadrage : liste/recherche/filtres, création inactive sans habilitation, activation/désactivation, synthèse des accès effectifs et séparation d’ACCESS-002-04 proposées avant toute implémentation |
| 1.2.98 | 2026-08-13 | ACCESS-002-02 clôturé après synchronisation de `a1181ed`, campagne 507/507 et recette réversible complète avec preuves persistantes, restauration exacte d’ACCESS puis d’AUDIT ; ACCESS-002-03 devient le prochain incrément à cadrer |
| 1.2.97 | 2026-08-12 | ACCESS-002-02 maintenu prioritaire : campagne 502/502 validée, garde-fou audit réel confirmé par refus attendu, raccordement persistant réversible avec reprise des états partiels préparé et prochaine campagne attendue à 507 tests |
| 1.2.96 | 2026-08-12 | ACCESS-002-02 maintenu prioritaire : corpus antérieur validé à 498/498 après synchronisation de `555ddd3`, mais trois nouveaux tests omis de la suite cumulative ; correction et garde structurel préparés, prochaine campagne attendue à 502 tests |
| 1.2.95 | 2026-08-12 | ACCESS-002-02 maintenu prioritaire : `ff0431f` synchronisé et 498/498 validés, mais faux positif du précontrôle d’audit confirmé ; second correctif de validation réelle préparé, application et restauration toujours interdites |
| 1.2.94 | 2026-08-11 | ACCESS-002-02 maintenu prioritaire : application arrêtée avant mutation faute d’audit persistant de recette ; correctif du précontrôle préparé et nouvelle application interdite jusqu’à validation |
| 1.2.93 | 2026-08-09 | Tête corrigée `747c9a3` de la PR #96 synchronisée avec 229 fichiers et validée à 497/497 ; retrait des capacités implicites de `ADMINISTRATEUR` confirmé, sans application, restauration ni mutation du registre |
| 1.2.92 | 2026-08-09 | Première tête de la PR #96 bloquée malgré 496/496 ; correctif fonctionnel `7dacc7b` préparé pour supprimer les capacités implicites de `ADMINISTRATEUR`, limiter le bootstrap au registre absent et porter la suite à 497 tests uniques avant nouvelle recette Apps Script |
| 1.2.91 | 2026-08-09 | Correctif ACCESS-002-02 de la PR applicative #96 synchronisé sur la tête `395de24` avec 229 fichiers et validé à 496/496, sans application, restauration ni mutation du registre |
| 1.2.90 | 2026-08-09 | Précontrôle ACCESS-002-02 réussi sans écriture ; modèle initial `ADMINISTRATEUR + ACCESS_MANAGE` confirmé, correctif applicatif en revue et mutation toujours non autorisée |
| 1.2.89 | 2026-08-09 | Protocole réversible ACCESS-002-02 intégré par la PR applicative #95 au commit `bbedf0a`, tête `be7323a` synchronisée avec 229 fichiers et campagne isolée 495/495, sans exécution des fonctions de recette ni mutation réelle |
| 1.2.88 | 2026-08-09 | Prérequis explicite d’ACCESS-002-02 intégré par la PR applicative #94 au commit `e800bdb`, tête `c4998c2` validée en recette à 484/484 et protocole du prochain lot réversible préparé, sans registre, compte ou donnée réelle |
| 1.2.87 | 2026-08-09 | ACCESS-002-02 cadré en version 0.1.0 : écart entre rôle historique et habilitation explicite identifié, affectation transverse `ACCESS` proposée et séquence implémentation/recette/amorçage bornée, sans modification réelle |
| 1.2.86 | 2026-08-09 | ACCESS-002-01 clôturé après fusion de la PR applicative #93 dans `develop` au commit `91ba7e3` ; version finale 1.0.0, campagne 477/477 conservée et ACCESS-002-02 identifié comme prochain incrément à préparer |
| 1.2.85 | 2026-08-09 | Recette Apps Script isolée du cinquième lot ACCESS-002-01 consignée sur la tête `84ea68f` : 226 fichiers synchronisés, suite cumulative réelle 477/477 sans échec et correction de l’inventaire préparatoire 478 |
| 1.2.84 | 2026-08-09 | Cinquième lot correctif ACCESS-002-01 publié dans la PR applicative brouillon #93 : verrou ACCESS/AUDIT partagé sans acquisition imbriquée, autorisation d’audit alignée et suites nettoyées ; validations locales 193/193, 19/19 et AUDIT-001 46/46, inventaire cumulatif préparé à 478 fonctions uniques sans nouvelle exécution Apps Script |
| 1.2.83 | 2026-08-09 | Quatrième lot ACCESS-002-01 publié dans la PR applicative brouillon #93 : audit persistant obligatoire avant mutation, preuves corrélées avant/après, refus et restaurations tracés, restauration sur échec final et catalogue AUDIT-001 étendu ; tests locaux 19/19 et AUDIT-001 ciblé 9/9, référence cumulative maintenue à 455/455 |
| 1.2.82 | 2026-08-09 | Troisième lot ACCESS-002-01 publié dans la PR applicative brouillon #93 : validation stricte et écriture atomique protégée avec révision, verrou, relecture, restauration et protection du dernier gestionnaire ; tests locaux portés à 15/15 sans mutation réelle, référence cumulative maintenue à 455/455 |
| 1.2.81 | 2026-08-09 | ACCESS-002-01 engagé dans la PR applicative brouillon #93 : catalogue `ANALYTICS_READ` compatible et API administrative de lecture protégée publiés ; tests locaux ciblés documentés sans remplacer la référence cumulative réelle 455/455 ; aucune migration, donnée réelle, production ou `main` touchée |
| 1.2.80 | 2026-08-09 | Finalisation du cadrage ACCESS-002 0.3.0 : découpage officiel en six incréments ACCESS-002-01 à ACCESS-002-06, amorçage de `aserridj@gmail.com` comme premier gestionnaire sans rôle SUPER_ADMIN, règles de séquencement et backlog ACCESS différé consignés avant INSCRIPTIONS-011 |
| 1.2.79 | 2026-08-09 | Engagement du cadrage ACCESS-002 comme chantier transverse prioritaire avant INSCRIPTIONS-011 : administration des comptes Google, rôles, modules, cours et capacités ; confirmation qu’un rôle n’accorde aucun module implicitement et qu’un professeur peut n’avoir aucun accès Présences ; correction de la trajectoire après clôture d’INSCRIPTIONS-010 |
| 1.2.78 | 2026-08-09 | Clôture d’INSCRIPTIONS-010 après validation et fusion de la PR applicative #89 dans `develop` au commit `ed03cc428f8a8b055400b59aec7ba2e0a005629f` ; suite finale 455/455 et recette Google isolée conservées ; prochain incrément à cadrer séparément, SIKADA restant bloqué faute de fixture anonymisée validée |
| 1.2.77 | 2026-08-09 | INSCRIPTIONS-010 réaligné sur AUDIT-001 intégré : tête applicative `0da406b`, suite finale 455/455, recette Google isolée concluante pour le schéma, une séquence et une commande fictive ; anomalie de typage Sheets détectée puis corrigée ; limites des scénarios Google de concurrence/interruption conservées, PR #89 toujours en brouillon avant validation documentaire #103 et revue |
| 1.2.76 | 2026-08-09 | Validation du premier socle persistant commun AUDIT-001 : PR applicative #90 sur `11e36134`, recette Google isolée concluante, deux preuves corrélées persistées, configuration restaurée et suite cumulative 423/423 ; prérequis audit d’INSCRIPTIONS-010 levé, raccordement et recette de la PR #89 deviennent le prochain jalon après intégration de #90 |
| 1.2.75 | 2026-08-08 | Précision du cadrage d’AUDIT-001 après revue : identités résolues côté serveur, catalogues fermés initiaux, cellules canoniques et paramètres CONFIG-001 complets ; aucune implémentation ni recette réalisée |
| 1.2.74 | 2026-08-08 | Proposition du premier incrément persistant d’AUDIT-001 comme prérequis à la recette d’INSCRIPTIONS-010 ; la PR applicative #89 reste en brouillon après 412/412, sans recette Google, production ni déploiement |
| 1.2.73 | 2026-08-08 | Validation documentaire d’INSCRIPTIONS-010 et autorisation de son implémentation bornée ; référence maintenue à 380/380 et bilan 13/1/2 jusqu’aux futures preuves, sans donnée nominative, application de lot, production ni déploiement |
| 1.2.72 | 2026-08-03 | Ouverture d’INSCRIPTIONS-010 : quatrième incrément proposé pour la persistance technique du journal et des séquences dans une recette Google isolée, avec garde d’environnement et audit commun, sans donnée nominative, application de lot ni déploiement |
| 1.2.71 | 2026-08-03 | Validation d’INSCRIPTIONS-009 : PR applicative #88 fusionnée, 20/20 tests ciblés et suite Apps Script 380/380, bilan des jeux d’or inchangé à 13 réussis, 1 partiel et 2 bloqués, sans adaptateur Google ni déploiement |
| 1.2.70 | 2026-08-03 | Ouverture d’INSCRIPTIONS-009 : troisième incrément proposé pour journaliser, rejouer et reprendre les commandes avec dépendances injectées, sans API Google ni changement des jeux d’or |
| 1.2.69 | 2026-08-02 | Validation d’INSCRIPTIONS-008 : PR applicative #87 fusionnée, suite Apps Script 360/360, 13 jeux d’or réussis, 1 partiel et 2 bloqués, sans déploiement ni donnée Google réelle ; prochain incrément à cadrer |
| 1.2.68 | 2026-08-02 | Ouverture d’INSCRIPTIONS-008 : second incrément borné aux capacités Inscriptions d’ACCESS-001, à une matrice de périmètres fermée et à un cycle d’audit en deux temps sans écriture métier |
| 1.2.67 | 2026-08-02 | Validation d’INSCRIPTIONS-006 et du premier socle sans écriture : PR applicative #85 fusionnée, 341/341 tests réussis, 12 jeux réussis, 2 partiels et 2 bloqués |
| 1.2.66 | 2026-08-02 | Validation d’INSCRIPTIONS-005 et ouverture d’INSCRIPTIONS-006 : jeux d’or, niveaux de validation, recette isolée, concurrence, restauration et preuves cumulatives |
| 1.2.65 | 2026-08-02 | Validation d’INSCRIPTIONS-004 et ouverture d’INSCRIPTIONS-005 : stockage, schéma, identifiants, concurrence, idempotence durable et intégrations externes |
| 1.2.64 | 2026-08-02 | Validation d’INSCRIPTIONS-003 et ouverture d’INSCRIPTIONS-004 : interface de contrôle, habilitations centralisées et accès privé Analytics via ACCESS-001 |
| 1.2.63 | 2026-08-02 | Validation d’INSCRIPTIONS-002 et ouverture d’INSCRIPTIONS-003 : services, transitions et reprise contrôlée des trois Google Forms officiels 2026–2027 |
| 1.2.62 | 2026-08-02 | Validation d’INSCRIPTIONS-001 et ouverture d’INSCRIPTIONS-002 : modèle métier, distinction identifiant AKS/numéro FFKDA, états indépendants et intégrations Google Forms, SIKADA, Analytics et Body Karaté |
| 1.2.61 | 2026-08-02 | Publication V1.3.0 alignée sur l’état réel et engagement d’AKS Inscriptions avec INSCRIPTIONS-001 comme premier incrément documentaire |
