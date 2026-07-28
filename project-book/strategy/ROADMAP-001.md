# ROADMAP-001
## Feuille de route officielle — AKS Platform

| Propriété | Valeur |
|---|---|
| **Document ID** | ROADMAP-001 |
| **Titre** | Feuille de route officielle d’AKS Platform |
| **Version** | 1.2.47 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |

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
Modules futurs priorisés selon la valeur métier
```

Cette séquence est la trajectoire de référence au 28 juillet 2026.

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

| Document | Domaine | État au 25 juillet 2026 |
|---|---|---|
| ROADMAP-001 | Feuille de route | Validé |
| GOV-001 | Gouvernance produit | Validé |
| ARCH-001 | Architecture fonctionnelle | Validé |
| CORE-001 | Services de plateforme | Published |
| CONFIG-001 | Paramétrage centralisé — registre, résolution, persistance, écriture contrôlée et interface d’administration validés (80/80 tests et validation manuelle) | Validé |
| LOG-001 | Journalisation — socle structuré, persistance durable dans `AKS_Logs`, conservation à 90 jours, purge contrôlée et consultation administrative en lecture seule validés (106/106 tests) ; chantier fonctionnellement terminé | Validé |
| UX-001 | Expérience utilisateur — fondations administratives communes, retours d’action du Paramétrage, consultation des Journaux et présentation compréhensible des événements validés (121/121 tests) ; chantier fonctionnellement terminé | Validé |
| SECURITY-001 | Sécurité | Validé |
| AUDIT-001 | Audit et traçabilité | Validé |
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

WEB-001 a été réalisé après la publication officielle de la V1.1 sur `main` et
avant le développement d’AKS Analytics.

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

**Clôture mobile intégrée sur `develop` — validation Apps Script requise**.

Le Product Owner a validé le 28 juillet 2026 la priorité de ce chantier avant
AKS Calendar.

## 10.2 Objectif

Permettre aux administrateurs, professeurs et assistants AFA explicitement
autorisés de saisir rapidement les présences depuis un téléphone ou une tablette,
avec contrôle systématique des droits côté serveur.

Le premier contrat d’écriture reste celui réellement consommé par la V1.2.0 :
`Configuration`, `Licenciés`, `Séances` et `Présences`.

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
le retour en lecture seule après succès. Les 4/4 tests ciblés réussissent. La
validation cumulative Apps Script attendue est de **329/329 tests réussis, 0
échec**.

Aucun déploiement utilisateur n’est réalisé à ce stade. La validation Apps
Script puis la recette mobile constituent la suite du chantier.

# 11. AKS Calendar — Module suivant

## 10.1 Statut

**Planifié**.

## 10.2 Objectif

AKS Calendar doit proposer un calendrier partagé pour les professeurs et responsables du club en s’appuyant prioritairement sur Google Calendar.

## 10.3 Périmètre prévisionnel

- intégration avec le compte Google du club ;
- calendrier partagé ;
- gestion des événements ;
- gestion des accès ;
- visibilité adaptée aux différents publics ;
- administration depuis AKS Platform lorsque cela apporte une valeur concrète ;
- journalisation des opérations importantes.

## 10.4 Principe d’implémentation

Google Calendar est retenu comme moteur initial afin de couvrir l’essentiel des besoins avec un effort maîtrisé.

Un développement interne complet ne pourra être envisagé que si des besoins non couverts justifient clairement son coût et sa maintenance.

---

# 12. Backlog produit après AKS Calendar

Les modules ou évolutions futures restent au statut **candidat** tant qu’ils ne sont pas cadrés et engagés.

Ils pourront notamment concerner :

- la gestion des licenciés ;
- les inscriptions ;
- les grades et passages de grade ;
- les documents associatifs ;
- les communications ;
- les tableaux de bord métier ;
- d’autres intégrations externes.

Leur ordre n’est pas fixé par le présent document.

Chaque candidat devra être évalué selon la valeur, les risques, les dépendances et l’effort de maintenance.

---

# 13. Jalons de version

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

# 14. Gestion des écarts

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

# 15. Indicateurs de pilotage

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

# 16. Règles de branches et de publication

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

# 17. Résultat attendu

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

La trajectoire officielle évolue : WEB-001 et AKS Analytics sont publiés ; la
V1.2.0 est la version stable et le prochain chantier fonctionnel est
ANALYTICS-SAISIE :

```text
AKS Platform v1.0.0
        ↓
AKS Platform v1.1.0 — Consolidation publiée
        ↓
WEB-001 — Point d’accès WordPress publié
        ↓
AKS Platform v1.2.0 — AKS Analytics publié
        ↓
ANALYTICS-SAISIE — contrat d’écriture publié
        ↓
AKS Calendar
```

Toute modification de cet ordre ou du périmètre engagé doit être validée et documentée selon les règles de gouvernance du Project Book.
