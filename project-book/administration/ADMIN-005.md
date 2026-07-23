# ADMIN-005 — Validation et conformité du Centre de pilotage

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-005 |
| **Version** | 1.2.0 |
| **Statut** | Référence de développement |
| **Nature** | Référentiel de validation et de conformité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit exclusivement les exigences de validation permettant de démontrer qu’une implémentation du Centre de pilotage est conforme aux références d’AKS Platform.

Il constitue le référentiel d’acceptation du domaine `Administration` et complète :

- `ADMIN-001` — premier incrément livrable ;
- `ADMIN-002` — interface et navigation ;
- `ADMIN-003` — modèle fonctionnel ;
- `ADMIN-004` — contrat d’extension.

Il ne redéfinit pas les exigences fonctionnelles ou techniques de ces documents : il indique comment leur conformité doit être vérifiée et prouvée.

---

## 2. Références applicables

La validation s’appuie notamment sur :

- `GOV-001` — gouvernance ;
- `DOC-001` — règles documentaires ;
- `ARCH-001` — architecture ;
- `CORE-001` — services transverses ;
- `API-001` — conventions de contrats ;
- `SECURITY-001` — sécurité ;
- `CONFIG-001` — paramétrage ;
- `LOG-001` — journalisation ;
- `ERROR-001` — erreurs ;
- `UX-001` — expérience utilisateur ;
- `UI-001` — interface et accessibilité ;
- `ADMIN-001` à `ADMIN-004`.

Toute divergence doit être documentée, évaluée et approuvée avant livraison.

---

## 3. Périmètre de validation

La validation couvre :

- l’accès au Centre de pilotage ;
- la navigation ;
- la composition des zones et cartes ;
- le chargement des fournisseurs et widgets ;
- les autorisations ;
- les états d’interface ;
- la robustesse face aux erreurs partielles ;
- la journalisation ;
- la performance perçue ;
- l’accessibilité et le responsive ;
- la maintenabilité, la compatibilité et l’extensibilité ;
- la non-régression sur les fonctionnalités existantes.

La validation des règles métier propres à un module reste sous la responsabilité de ce module.

---

## 4. Principes de preuve

Une exigence n’est considérée comme validée que si une preuve identifiable existe.

Les preuves admises peuvent comprendre :

- résultat de test automatisé ;
- scénario de recette manuelle daté ;
- capture ou enregistrement de validation ;
- extrait de journal expurgé ;
- revue de code ou de dépendances ;
- contrôle dans l’environnement Apps Script réel ;
- validation explicite du Product Owner.

Une preuve doit indiquer au minimum :

- l’exigence couverte ;
- l’environnement ;
- la version ou le commit testé ;
- le résultat ;
- la date ;
- l’auteur ou le validateur.

Les preuves ne doivent contenir ni secret, ni donnée personnelle inutile.

---

## 5. Conformité fonctionnelle

Le Centre de pilotage doit :

- afficher uniquement les contenus autorisés ;
- respecter la navigation définie dans `ADMIN-002` ;
- respecter les zones, états et règles de composition d’`ADMIN-003` ;
- supporter zéro, un ou plusieurs fournisseurs ;
- présenter explicitement les états nominaux, vides, indisponibles, désactivés, en erreur et refusés ;
- préserver les autres fonctionnalités lorsqu’un widget ou fournisseur échoue ;
- n’afficher aucune capacité fictive ou destination inexistante.

Aucun widget ne doit devenir une dépendance obligatoire pour l’ouverture du Centre de pilotage.

---

## 6. Conformité architecturale

L’implémentation doit démontrer que :

- le Centre de pilotage orchestre sans devenir propriétaire des données ;
- les modules publient exclusivement via `ADMIN-004` ;
- aucune dépendance directe vers un module métier particulier n’est introduite ;
- aucune dépendance circulaire n’existe ;
- aucune logique métier n’est exécutée dans un widget ;
- les services communs relèvent d’AKS Core ;
- les paramètres utilisent `CONFIG-001` ;
- les événements significatifs utilisent `LOG-001` ;
- les erreurs suivent `ERROR-001` ;
- les contrats incompatibles ou invalides sont refusés explicitement ;
- l’échec d’un fournisseur reste isolé.

---

## 7. Conformité UX et UI

Les contrôles portent au minimum sur :

- la cohérence des composants ;
- la hiérarchie visuelle ;
- la lisibilité des titres, états, indicateurs et actions ;
- la cohérence des libellés ;
- la visibilité du focus ;
- la navigation au clavier ;
- la compréhension sans dépendre uniquement de la couleur ;
- l’adaptation mobile, tablette et ordinateur ;
- la stabilité de la mise en page pendant le chargement ;
- les retours utilisateur explicites ;
- l’ordre logique de lecture ;
- l’absence de rupture introduite par un module.

---

## 8. Sécurité et confidentialité

La validation doit démontrer que :

- l’authentification et l’autorisation sont appliquées côté serveur ;
- aucun widget non autorisé n’est transmis au client ;
- aucune donnée protégée n’est chargée avant autorisation ;
- les actions réappliquent les contrôles à destination ;
- les modèles ne contiennent ni secret ni donnée personnelle inutile ;
- les erreurs ne révèlent aucun détail sensible ;
- les journaux respectent `LOG-001` ;
- les liens externes et documents respectent leurs règles propres ;
- la visibilité d’un composant n’est jamais considérée comme une autorisation.

---

## 9. Robustesse et dégradation maîtrisée

Les règles obligatoires sont :

- une erreur de widget ne masque pas les autres ;
- une erreur de fournisseur ne bloque pas le chargement global ;
- un fournisseur lent ne bloque pas l’enveloppe et la navigation ;
- une erreur technique est journalisée sans détail sensible ;
- l’utilisateur reçoit un message compréhensible ;
- l’absence de données est distinguée d’une erreur ;
- un fournisseur désactivé n’est pas présenté comme défaillant ;
- une version de contrat non supportée est refusée explicitement ;
- une cause temporaire peut être reprise sans redéploiement lorsqu’une reprise sûre existe.

---

## 10. Performance

La validation doit vérifier que :

- l’enveloppe et la navigation s’affichent indépendamment des widgets ;
- les widgets peuvent être chargés progressivement ;
- un délai maximal ou mécanisme d’abandon protège chaque fournisseur ;
- les actualisations indépendantes ne provoquent pas inutilement un rechargement complet ;
- les traitements lourds restent dans leurs services propriétaires ;
- les appels redondants sont évités lorsque leur réutilisation est sûre ;
- une donnée ancienne est signalée lorsqu’elle ne peut plus être considérée comme actuelle.

Les seuils chiffrés sont définis dans le livrable ou l’incrément concerné et doivent être mesurables.

---

## 11. Journalisation et observabilité

Les événements significatifs comprennent notamment :

- ouverture du Centre de pilotage en erreur ;
- refus d’accès anormal ;
- échec d’enregistrement d’un fournisseur ;
- fournisseur incompatible, invalide, lent ou en erreur ;
- widget invalide ou en erreur ;
- doublon d’identifiant ;
- action administrative sensible ;
- dégradation répétée ou dépassement d’un seuil.

Les journaux doivent permettre d’identifier :

- le fournisseur ;
- le widget lorsque pertinent ;
- le type d’événement ;
- l’horodatage ;
- le niveau ;
- le code d’erreur ;
- l’identifiant de corrélation lorsqu’il existe.

Ils ne doivent pas reproduire le contenu complet des widgets ni contenir de données sensibles inutiles.

---

## 12. Tests obligatoires

### 12.1 Tests fonctionnels

- accès autorisé et refusé ;
- affichage avec zéro, un et plusieurs fournisseurs ;
- affichage avec zéro, un et plusieurs widgets ;
- navigation et retour vers le Centre de pilotage ;
- actions autorisées ;
- tous les états définis dans `ADMIN-003` ;
- absence de destination inexistante.

### 12.2 Tests de contrat

- fournisseur valide ;
- propriétés obligatoires absentes ;
- widget invalide ;
- type ou zone non supporté ;
- contrat incompatible ;
- doublon de `providerId` ;
- doublon de `widgetId` ;
- contenu non sérialisable ;
- action invalide.

### 12.3 Tests d’isolation

- widget en erreur ;
- fournisseur en erreur ;
- fournisseur lent ;
- fournisseur désactivé ;
- données vides ;
- réponse partielle ;
- erreur de configuration.

### 12.4 Tests UX et accessibilité

- navigation complète au clavier ;
- ordre de tabulation ;
- focus visible ;
- lecture des libellés ;
- mobile, tablette et ordinateur ;
- compréhension sans dépendance exclusive à la couleur ;
- messages d’état et d’erreur.

### 12.5 Tests de sécurité

- absence de widget non autorisé ;
- absence de donnée non autorisée ;
- refus d’action côté serveur ;
- absence de secret ou détail sensible ;
- respect des contrôles du module propriétaire ;
- contrôle des liens et documents.

### 12.6 Tests de journalisation

- présence des événements attendus ;
- niveau approprié ;
- identification correcte de la source ;
- corrélation lorsque prévue ;
- absence de données sensibles.

### 12.7 Tests de non-régression

- fonctionnement des modules existants ;
- stabilité de la navigation ;
- compatibilité avec les fournisseurs déjà validés ;
- stabilité des composants UI partagés ;
- absence de régression sur le questionnaire public.

---

## 13. Critères d’acceptation

Une implémentation est acceptée lorsque :

- toutes les exigences applicables d’`ADMIN-001` à `ADMIN-004` sont tracées ;
- les tests obligatoires sont validés ;
- aucun défaut bloquant ou critique n’est ouvert ;
- les erreurs partielles sont isolées ;
- les autorisations sont appliquées côté serveur ;
- les états sont conformes ;
- la journalisation est conforme ;
- les performances respectent les seuils de l’incrément ;
- les preuves de test sont conservées dans le support prévu ;
- la documentation est synchronisée avec le code livré ;
- le Product Owner valide la recette fonctionnelle.

Un écart mineur ne peut être accepté que s’il est documenté, évalué, assorti d’une décision et d’un plan de traitement lorsque nécessaire.

---

## 14. Matrice minimale de traçabilité

| Domaine | Référence principale | Preuve attendue |
|---|---|---|
| Premier incrément | `ADMIN-001` | Scénarios réels Apps Script |
| Navigation | `ADMIN-002` | Recette des parcours |
| Zones, cartes et états | `ADMIN-003` | Tests de composition |
| Fournisseurs et widgets | `ADMIN-004` | Tests de contrat et isolation |
| Architecture | `ARCH-001`, `CORE-001` | Revue de dépendances |
| Sécurité | `SECURITY-001` | Tests d’accès et confidentialité |
| Paramétrage | `CONFIG-001` | Tests de configuration |
| Journalisation | `LOG-001` | Journaux de test expurgés |
| Erreurs | `ERROR-001` | Scénarios d’échec |
| UX et accessibilité | `UX-001`, `UI-001` | Recette multi-support |
| Non-régression | Modules existants | Résultats de tests |

---

## 15. Gouvernance des écarts

Tout écart doit indiquer :

- l’exigence concernée ;
- la justification ;
- le niveau de risque ;
- l’impact utilisateur, sécurité et maintenance ;
- la mesure compensatoire ;
- le responsable ;
- l’échéance éventuelle ;
- la décision du Product Owner.

Un écart de sécurité critique ou une absence d’autorisation côté serveur ne peut pas être accepté comme écart mineur.

---

## 16. Definition of Done

Une évolution du Centre de pilotage est terminée lorsque :

- son périmètre et ses dépendances sont documentés ;
- elle respecte le contrat d’extension ;
- les contrôles d’accès sont implémentés et testés ;
- les états nominaux, vides et d’erreur sont gérés ;
- les événements significatifs sont journalisés ;
- les tests requis sont validés ;
- les preuves sont conservées ;
- aucune régression n’est détectée ;
- la documentation correspond au code livré ;
- le livrable est intégré selon la gouvernance Git ;
- la recette est approuvée.

---

## 17. Clôture documentaire du domaine

L’ensemble suivant définit le domaine `Administration` pour AKS Platform V1.1 :

- `ADMIN-001` — premier incrément ;
- `ADMIN-002` — interface et navigation ;
- `ADMIN-003` — modèle fonctionnel ;
- `ADMIN-004` — contrat d’extension ;
- `ADMIN-005` — validation et conformité.

Cette clôture documentaire autorise le passage à l’implémentation progressive. Elle ne signifie pas que toutes les fonctionnalités cibles sont déjà développées.

Toute évolution incompatible avec ces responsabilités nécessite une décision d’architecture et une mise à jour coordonnée des documents concernés.

---

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.0 | 2026-07-23 | Recentrage sur la validation, ajout des principes de preuve, tests de contrat, gouvernance des écarts et clarification de la clôture documentaire |
| 1.1.0 | 2026-07-23 | Première définition du référentiel de validation du Centre de pilotage |