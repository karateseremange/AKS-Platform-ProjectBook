# ADMIN-001 — Tableau de bord d’administration

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-001 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-19 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le Dashboard est la page d’accueil de l’espace d’administration d’AKS Platform.

Le présent document décrit exclusivement le Dashboard. L’architecture générale de l’espace d’administration fera l’objet d’une documentation spécifique lorsqu’elle sera nécessaire.

Cette spécification constitue la référence de développement d’ADMIN-001. Elle ne doit être ajustée que si l’implémentation met en évidence un point qui ne pouvait pas être identifié lors de la conception.

---

## 2. Finalité fonctionnelle

Le Dashboard permet à un administrateur de :

- identifier immédiatement la version exécutée ;
- accéder rapidement aux fonctionnalités administratives effectivement disponibles ;
- disposer progressivement d’une vue synthétique de la plateforme au fur et à mesure de son évolution.

Le Dashboard n’est pas une console de supervision technique.

---

## 3. Principes d’architecture

### 3.1 Consommateur de services

Le Dashboard consomme uniquement des informations fournies par des services identifiés d’AKS Core ou par des modules existants. Il ne constitue jamais une source de données.

### 3.2 Absence de logique métier

Le Dashboard ne réalise aucun calcul, aucune décision administrative, aucune interprétation métier et aucune déduction sur l’état de la plateforme.

### 3.3 Architecture déclarative

Le Dashboard est entièrement déclaratif. Il affiche des informations déjà déterminées par leurs services sources et des actions de navigation vers des fonctionnalités existantes.

### 3.4 Absence de création de dépendance

ADMIN-001 ne provoque pas la création de services uniquement pour alimenter le Dashboard. Une abstraction n’est introduite que lorsqu’elle possède une responsabilité réelle.

Le premier incrément ne contient donc ni `DashboardService`, ni `DashboardFacade`, ni enregistrement supplémentaire dans le Container.

### 3.5 Traçabilité des sources

Chaque information affichée possède une source identifiée. Aucune information ne doit être dupliquée, simulée ou déduite à partir d’indicateurs incomplets.

### 3.6 Séparation avec la supervision

Les notions d’uptime, d’état d’un conteneur, de mémoire, de serveur ou de disponibilité d’infrastructure sont exclues tant qu’un véritable service de diagnostic ne les fournit pas.

---

## 4. Périmètre du premier incrément

Le premier incrément d’ADMIN-001 est complet avec les deux cartes suivantes.

### 4.1 Carte « Informations plateforme »

**Objectif**

Présenter l’identité de la version d’AKS Platform actuellement exécutée.

**Informations affichées**

- nom de la plateforme ;
- numéro de version ;
- nom de code.

**Source**

```javascript
AKS.Version.getReleaseInfo()
```

La version et le nom de code proviennent exclusivement du service transversal de version.

### 4.2 Carte « Actions rapides »

**Objectif**

Donner au Dashboard son rôle de page d’accueil de l’espace d’administration.

Les Actions rapides correspondent uniquement aux fonctionnalités administratives effectivement disponibles dans la version exécutée.

Une action rapide :

- réalise uniquement une navigation ;
- ne contient aucune logique métier ;
- ne déclenche aucun traitement administratif directement depuis le Dashboard ;
- n’est affichée que si sa destination existe ;
- respecte les règles d’autorisation de l’écran ciblé.

Lorsque aucune autre fonctionnalité administrative Web n’est disponible, la carte reste présente et affiche un état vide explicite.

---

## 5. Architecture du premier incrément

```text
Contrôleur administratif
        ↓
Contrôle d’autorisation Google côté serveur
        ↓
AKS.Version
        ↓
Vue Dashboard
```

Le contrôleur possède uniquement des responsabilités d’interface :

- contrôler l’autorisation ;
- obtenir les informations de version ;
- préparer le modèle de présentation ;
- rendre la vue.

Une future façade de lecture pourra être introduite lorsque plusieurs services devront être agrégés et qu’une responsabilité d’orchestration réelle apparaîtra.

---

## 6. Vision d’évolution du Dashboard

Les éléments suivants ne font pas partie du premier incrément et ne conditionnent pas sa livraison.

### 6.1 Campagne active

Dépend du futur service de configuration. Le Dashboard ne calculera jamais lui-même l’état d’une campagne.

### 6.2 Modules installés

Dépend du registre des modules. Le Dashboard ne maintiendra pas sa propre liste de modules.

### 6.3 Journal récent

Dépend du futur service transversal de journalisation. Le Dashboard ne lira pas directement des journaux techniques bruts.

### 6.4 État de la plateforme

Dépend d’un véritable service de diagnostic. Aucun indicateur artificiel ou supposé ne sera affiché.

---

## 7. Dépendances nécessaires pour terminer ADMIN-001

| Dépendance | Usage | État |
|---|---|---|
| Service transversal de version | Carte « Informations plateforme » | Disponible |
| Authentification Google | Identification de l’utilisateur | Disponible |
| Autorisation administrative côté serveur | Protection du Dashboard | Incluse dans ADMIN-001 |
| Rendu HtmlService | Affichage du Dashboard | Disponible |

Les futurs services de configuration, registre des modules, journalisation et diagnostic ne sont pas bloquants.

---

## 8. Hors périmètre

ADMIN-001 ne comprend pas :

- l’architecture générale de l’espace d’administration ;
- le service de configuration ;
- le registre des modules ;
- le service de journalisation ;
- le service de diagnostic ;
- la supervision système ;
- les métriques de performance ;
- l’administration des modules ;
- la gestion des utilisateurs ;
- le paramétrage métier ;
- les statistiques métier ;
- les opérations de maintenance ;
- les traitements du questionnaire santé ;
- AKS Analytics ;
- AKS Calendar.

---

## 9. Comportement attendu

Lorsqu’un administrateur autorisé accède au Dashboard :

1. l’autorisation est vérifiée côté serveur ;
2. la carte « Informations plateforme » reçoit ses données de `AKS.Version` ;
3. la carte « Actions rapides » affiche uniquement les destinations existantes ou un état vide explicite ;
4. aucune carte future n’est simulée ;
5. aucune information de supervision fictive n’est affichée ;
6. aucune logique métier n’est exécutée par l’interface.

Le Dashboard reste pleinement fonctionnel lorsque les services prévus pour ses évolutions futures ne sont pas disponibles.

---

## 10. Critères d’acceptation

### 10.1 Accès

- l’accès nécessite un compte Google authentifié ;
- chaque accès administratif est autorisé côté serveur ;
- un utilisateur non autorisé reçoit le code `ADMIN001_ACCESS_DENIED` ;
- aucune donnée administrative n’est fournie avant autorisation.

### 10.2 Informations plateforme

- la carte est présente ;
- la version et le nom de code proviennent exclusivement de `AKS.Version.getReleaseInfo()` ;
- aucune version n’est dupliquée dans l’interface ;
- les informations correspondent au runtime déployé.

### 10.3 Actions rapides

- la carte est présente ;
- seules les destinations réellement disponibles sont affichées ;
- chaque action réalise uniquement une navigation ;
- l’absence d’action disponible n’empêche pas le fonctionnement du Dashboard.

### 10.4 Architecture

- le Dashboard reste déclaratif ;
- aucune logique métier n’est intégrée ;
- aucun service artificiel n’est créé pour relayer `AKS.Version` ;
- aucune dépendance future n’est nécessaire au premier incrément ;
- aucune supervision fictive n’est affichée ;
- le Dashboard fonctionne sans les futurs services de configuration, registre, journalisation ou diagnostic.

### 10.5 Validation

- les tests automatisés ADMIN-001 sont validés ;
- les tests du service transversal de version restent valides ;
- l’affichage est vérifié dans l’environnement Apps Script réel ;
- l’accès autorisé et le refus d’accès sont vérifiés ;
- aucune régression n’est introduite sur le questionnaire public.

---

## 11. Définition de terminé

ADMIN-001 est terminé lorsque le premier incrément est livré, testé et documenté avec :

- la page d’accueil du Dashboard ;
- la carte « Informations plateforme » ;
- la carte « Actions rapides » ;
- le contrôle d’autorisation côté serveur ;
- les tests automatisés ;
- la validation réelle Apps Script ;
- la documentation des évolutions futures non bloquantes.
