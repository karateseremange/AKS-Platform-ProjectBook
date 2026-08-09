# ACCESS-002 — Administration des utilisateurs et habilitations

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002 |
| **Titre** | Administration des utilisateurs et habilitations privées |
| **Version** | 0.1.0 |
| **Statut** | Brouillon de cadrage |
| **Nature** | Spécification fonctionnelle et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

ACCESS-002 rend administrable le modèle d’autorisation transverse défini par `ACCESS-001`.

L’objectif est de permettre à un administrateur habilité de gérer depuis le Centre de pilotage les comptes Google autorisés, leurs rôles, leurs modules accessibles, leurs affectations et leurs capacités, sans modifier le code ni les Script Properties manuellement.

ACCESS-002 ne remplace pas le moteur d’autorisation existant. Il s’appuie sur le registre central `AKS_ACCESS_REGISTRY` et sur `AKS_createAccessService_()` comme sources de vérité côté serveur.

---

## 2. Décisions structurantes

Les décisions suivantes sont validées pour le cadrage :

1. Google authentifie l’utilisateur ; AKS Platform décide des autorisations.
2. Tout accès privé est refusé par défaut tant qu’une autorisation explicite n’existe pas.
3. Un rôle ne donne pas automatiquement accès à tous les modules.
4. Deux personnes ayant le même rôle peuvent avoir des droits différents.
5. Un professeur peut n’avoir aucun accès à Présences.
6. L’accès à Présences peut être limité à un ou plusieurs cours et à une saison.
7. L’accès à Analytics peut être accordé indépendamment de Présences.
8. L’accès à Inscriptions peut être accordé indépendamment d’Analytics et de Présences.
9. Le Centre de pilotage complet, la Configuration, les Journaux, l’Audit et la gestion des habilitations restent des fonctions administratives strictes.
10. Le serveur reste seul décisionnaire ; masquer un bouton n’est jamais un contrôle d’accès.
11. La suppression logique est privilégiée à la suppression physique : un compte est désactivé pour préserver la traçabilité.
12. Il doit rester au moins un administrateur actif capable de gérer les accès.

---

## 3. État de l’existant

### 3.1 Déjà opérationnel

Le socle `ACCESS-001` fournit déjà :

- l’identité Google active via `Session.getActiveUser().getEmail()` ;
- le registre persistant `AKS_ACCESS_REGISTRY` ;
- les rôles `ADMINISTRATEUR`, `PROFESSEUR`, `ASSISTANT_AFA`, `CONSULTATION` ;
- les affectations explicites par saison et cours ;
- les capacités Présences ;
- les capacités Analytics ;
- les capacités Inscriptions ;
- le refus fermé en cas de registre absent, invalide ou ambigu ;
- la compatibilité avec l’ancien mécanisme administrateur pour amorçage ;
- la protection contre la suppression du dernier administrateur ;
- la sauvegarde auditée du registre.

La saisie des présences est déjà raccordée à `ACCESS-001` côté serveur.

### 3.2 Raccordements encore historiques

Les écrans administratifs suivants utilisent encore `AKS.Admin.Access` et la liste historique d’administrateurs :

- Centre de pilotage ;
- Analytics administratif ;
- Configuration ;
- Journaux et écrans administratifs apparentés.

ACCESS-002 doit organiser leur migration vers le modèle de capacités sans réduire le niveau de sécurité existant.

---

## 4. Finalité fonctionnelle

ACCESS-002 doit fournir une nouvelle entrée du Centre de pilotage :

**Utilisateurs et habilitations**

Cette interface doit permettre de :

- consulter les comptes connus ;
- ajouter un compte Google ;
- modifier son nom d’affichage ;
- activer ou désactiver le compte ;
- attribuer ou retirer des rôles ;
- attribuer ou retirer l’accès à un module ;
- limiter un accès à une saison, une section ou un cours lorsqu’il est pertinent ;
- accorder des capacités compatibles avec le rôle et le module ;
- visualiser les droits effectifs avant enregistrement ;
- enregistrer de manière atomique le registre validé ;
- tracer l’auteur et la date de chaque modification.

---

## 5. Modèle d’autorisation cible

Le modèle cible suit la chaîne :

```text
Compte Google
    ↓
Compte d’accès AKS
    ↓
Rôle(s)
    ↓
Affectation(s) explicite(s)
    ↓
Module / saison / section / cours
    ↓
Capacité(s) effective(s)
    ↓
Autorisation serveur
```

Aucune étape ne doit être déduite du client.

---

## 6. Rôles

ACCESS-002 réutilise les rôles de `ACCESS-001` :

| Rôle | Usage principal |
|---|---|
| `ADMINISTRATEUR` | Administration globale et opérations sensibles |
| `PROFESSEUR` | Fonctions pédagogiques explicitement affectées |
| `ASSISTANT_AFA` | Fonctions limitées explicitement affectées |
| `CONSULTATION` | Lecture seule explicitement affectée |

Le rôle décrit la nature générale de l’utilisateur, pas la liste automatique de ses modules.

Exemple : un utilisateur `PROFESSEUR` peut avoir :

- Présences sur `BABY` uniquement ;
- aucun accès Présences ;
- Analytics en lecture seule ;
- ou une combinaison explicitement configurée.

---

## 7. Modules et niveaux d’accès

### 7.1 Présences

L’accès doit pouvoir être attribué :

- par saison ;
- par cours ;
- avec les capacités autorisées par le rôle.

Un professeur sans affectation Présences ne voit aucun cours et ne peut ouvrir directement une route de saisie.

### 7.2 Analytics

Les capacités minimales sont :

- `ANALYTICS_READ` ;
- `ANALYTICS_PREVIEW` ;
- `ANALYTICS_PUBLISH`.

La lecture, la prévisualisation et la publication doivent être dissociées.

### 7.3 Inscriptions

ACCESS-002 doit exposer les capacités déjà définies par `ACCESS-001`, notamment :

- `INSCRIPTIONS_READ` ;
- `INSCRIPTIONS_ANALYZE_IMPORT` ;
- `INSCRIPTIONS_CONTROL` ;
- `INSCRIPTIONS_WRITE` ;
- `INSCRIPTIONS_APPLY_IMPORT` ;
- `INSCRIPTIONS_ACTIVATE`.

Le périmètre peut dépendre de la saison, de la section et, selon la capacité, du cours.

### 7.4 Administration générale

Les fonctions suivantes restent réservées aux administrateurs disposant des capacités correspondantes :

- Centre de pilotage complet ;
- gestion des habilitations (`ACCESS_MANAGE`) ;
- Configuration ;
- Journaux ;
- Audit ;
- publication Analytics lorsque la règle le prévoit ;
- opérations de maintenance sensibles.

---

## 8. Interface d’administration

### 8.1 Liste des utilisateurs

L’écran doit présenter au minimum :

- nom d’affichage ;
- adresse Google ;
- statut actif/inactif ;
- rôles ;
- modules accessibles ;
- période de validité éventuelle ;
- dernière modification.

Aucune donnée sensible inutile ne doit être exposée.

### 8.2 Fiche utilisateur

La fiche doit permettre :

- édition du nom d’affichage ;
- activation/désactivation ;
- rôles ;
- affectations ;
- capacités supplémentaires autorisées ;
- dates de validité ;
- aperçu des droits effectifs.

### 8.3 Ergonomie

L’interface doit privilégier les choix compréhensibles :

- modules présentés par leur nom fonctionnel ;
- cours présentés par leur libellé, mais enregistrés avec leur code stable ;
- capacités sensibles accompagnées d’un libellé explicite ;
- avertissement avant toute perte de droit administrateur ;
- confirmation avant désactivation d’un compte actif.

---

## 9. Sécurité

ACCESS-002 doit respecter les règles suivantes :

- l’écran lui-même exige `ACCESS_MANAGE` ;
- toute lecture du registre est protégée côté serveur ;
- toute écriture du registre est protégée côté serveur ;
- le registre complet n’est jamais fourni à un utilisateur non autorisé ;
- les valeurs reçues du navigateur sont revalidées intégralement côté serveur ;
- les rôles, capacités, saisons, sections et cours sont vérifiés contre les catalogues serveur ;
- aucun compte ne peut s’attribuer un droit par simple modification du client ;
- une modification invalide ne doit pas altérer le registre courant ;
- la perte du dernier administrateur actif est refusée ;
- une procédure de récupération administrateur doit rester disponible pendant la migration.

---

## 10. Audit et traçabilité

Doivent produire une preuve d’audit :

- création d’un compte ;
- activation ou désactivation ;
- modification d’un rôle ;
- ajout ou retrait d’une affectation ;
- ajout ou retrait d’une capacité ;
- changement de période de validité ;
- tentative de modification refusée ;
- tentative de suppression du dernier administrateur ;
- migration du mécanisme historique vers le registre persistant.

L’audit doit comporter au minimum : acteur, action, cible, résultat, date et identifiant de corrélation.

---

## 11. Migration des contrôles historiques

ACCESS-002 organise une migration progressive.

### Phase 1 — registre administrable

- rendre le registre consultable et modifiable par l’interface ;
- conserver l’ancien mécanisme comme filet de récupération ;
- valider au moins un administrateur dans le registre persistant.

### Phase 2 — Présences

- conserver le raccordement existant à ACCESS-001 ;
- vérifier la non-régression avec plusieurs profils réels de recette.

### Phase 3 — Analytics

- remplacer le contrôle administrateur générique par les capacités Analytics ;
- permettre la lecture sans donner les droits d’administration globale.

### Phase 4 — Centre de pilotage et administration

- distinguer les entrées réservées aux administrateurs des modules privés délégables ;
- migrer Configuration, Journaux et Audit vers les capacités adéquates.

### Phase 5 — Inscriptions

- utiliser directement les capacités ACCESS-001 lors des futurs écrans et opérations métier.

Aucune phase ne doit supprimer le mécanisme de récupération tant qu’un test réel d’accès administrateur et de refus n’a pas été validé.

---

## 12. Hors périmètre

ACCESS-002 ne comprend pas :

- l’authentification par mot de passe propre à AKS Platform ;
- la création de comptes Google ;
- un annuaire RH ;
- un espace licencié public ;
- la délégation automatique de droits selon le titre ou la fonction associative ;
- l’ouverture automatique de tous les modules aux professeurs ;
- la suppression physique systématique des anciens comptes ;
- le développement fonctionnel d’INSCRIPTIONS-011 ;
- une refonte complète du Centre de pilotage.

---

## 13. Critères d’acceptation

ACCESS-002 sera considéré comme fonctionnel lorsque les critères suivants seront satisfaits :

1. un administrateur autorisé peut ouvrir l’interface Utilisateurs et habilitations ;
2. un utilisateur non autorisé ne peut ni lire ni modifier le registre ;
3. un compte Google peut être ajouté, modifié, activé ou désactivé ;
4. les rôles sont modifiables sans créer d’accès implicite à tous les modules ;
5. un professeur peut être configuré sans aucun accès Présences ;
6. un professeur peut être limité à un cours Présences ;
7. Analytics peut être accordé indépendamment de Présences ;
8. les droits Inscriptions sont configurables sans donner l’administration globale ;
9. une URL directe vers un module non autorisé est refusée côté serveur ;
10. une tentative de suppression du dernier administrateur est refusée ;
11. chaque modification du registre est auditée ;
12. une écriture invalide laisse le registre précédent intact ;
13. le mécanisme de récupération administrateur est testé ;
14. les tests ACCESS-001 restent valides ;
15. aucune régression n’est introduite dans Présences, Analytics ou les écrans administratifs existants.

---

## 14. Stratégie de recette

La recette devra utiliser plusieurs comptes Google réels ou profils de recette représentant au minimum :

- administrateur principal ;
- professeur avec Présences sur un seul cours ;
- professeur sans Présences mais avec Analytics en lecture ;
- assistant AFA avec saisie limitée ;
- utilisateur Consultation ;
- compte inactif ;
- compte inconnu.

Les contrôles doivent porter sur l’affichage mais surtout sur les appels serveur directs.

---

## 15. Dépendances

ACCESS-002 dépend notamment de :

- `ACCESS-001` ;
- `ADMIN-001` à `ADMIN-005` ;
- `SECURITY-001` ;
- `AUDIT-001` ;
- `CONFIG-001` ;
- `LOG-001` ;
- `ANALYTICS-SAISIE-001` ;
- `INSCRIPTIONS-004` ;
- des catalogues serveur de saisons, sections et cours.

---

## 16. Ordre produit retenu

Le séquencement proposé est :

```text
INSCRIPTIONS-010 — clôturé
        ↓
ACCESS-002 — administration transverse des habilitations
        ↓
INSCRIPTIONS-011 — premier incrément métier Inscriptions
```

ACCESS-002 devient donc un préalable au développement du prochain écran privé sensible d’AKS Inscriptions.

---

## 17. Définition de terminé

ACCESS-002 est terminé lorsque :

- le registre est administrable depuis le Centre de pilotage ;
- les droits restent contrôlés côté serveur ;
- Présences conserve son fonctionnement avec affectations explicites ;
- Analytics utilise ses capacités propres ;
- les écrans administratifs sont distingués des modules privés délégables ;
- la protection du dernier administrateur est effective ;
- la récupération administrateur est documentée et testée ;
- les changements sont audités ;
- la recette multi-profils est concluante ;
- le Project Book reflète le comportement réellement livré.

---

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-09 | Premier cadrage d’ACCESS-002 après audit d’ACCESS-001 et décision de traiter l’administration des habilitations avant INSCRIPTIONS-011 |
