# ACCESS-001 — Rôles, capacités et habilitations privées d’AKS Platform

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-001 |
| **Version** | 1.2.0 |
| **Statut** | Socle v1.1.0 validé en production — extension transverse en revue |
| **Nature** | Spécification fonctionnelle et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Ce document définit le modèle commun d’autorisation des espaces privés d’AKS
Platform. Son socle initial protège la saisie des présences d’AKS Analytics. Son
extension transverse couvre également Analytics en consultation, AKS Inscriptions,
le Centre de pilotage et les futurs modules privés, sans recréer de registre propre
à chaque module.

Il applique `SECURITY-001`, `CONFIG-001`, `LOG-001`, `AUDIT-001`,
`API-001`, `ANALYTICS-SAISIE-001` et `INSCRIPTIONS-004`. Il précède toute
nouvelle exposition de données privées ou écriture dans les référentiels métier.

## 2. Principes directeurs

- Google authentifie l’utilisateur ; AKS Platform autorise chaque opération.
- L’adresse fournie par `Session.getActiveUser().getEmail()` est la seule identité
  fonctionnelle retenue côté serveur.
- Une adresse reçue du navigateur n’est jamais une preuve d’identité.
- Tout accès est refusé si l’identité, le registre, le rôle, l’affectation ou la
  capacité requise est absent, inactif, invalide ou ambigu.
- L’autorisation est évaluée à chaque appel serveur, par capacité et par cours.
- Le client peut masquer une commande, mais le serveur reste seul décisionnaire.
- Les droits suivent le moindre privilège et aucune affectation n’est implicite.
- Une modification du registre d’accès est une action administrative auditée.

## 3. Identité et compte d’accès

Un compte d’accès contient au minimum :

| Champ | Règle |
|---|---|
| `email` | Adresse Google normalisée en minuscules, unique |
| `displayName` | Libellé d’administration facultatif |
| `status` | `ACTIVE` ou `INACTIVE` |
| `roles` | Ensemble non vide de rôles connus |
| `assignments` | Affectations explicites aux modules, saisons, sections, cours et capacités complémentaires |
| `validFrom` | Date facultative de début de validité |
| `validUntil` | Date facultative de fin de validité |
| `updatedAt` | Horodatage de la dernière modification |
| `updatedBy` | Adresse de l’administrateur auteur |
| `schemaVersion` | Version du contrat de registre |

Un compte inactif ou hors période de validité ne reçoit aucune permission. La
désactivation est préférée à la suppression afin de préserver la traçabilité.

## 4. Rôles

| Rôle | Finalité |
|---|---|
| `ADMINISTRATEUR` | Administration globale des modules et opérations sensibles |
| `PROFESSEUR` | Saisie et consultation des cours auxquels la personne est affectée |
| `ASSISTANT_AFA` | Saisie limitée aux cours explicitement affectés |
| `CONSULTATION` | Lecture seule sur le périmètre explicitement affecté |

Une personne peut cumuler plusieurs rôles. Les capacités effectives sont l’union
des capacités accordées par ses rôles actifs, limitée par ses affectations actives.
Le cumul ne permet jamais de dépasser le périmètre autorisé, sauf pour
l’administrateur dont le périmètre est global.

## 5. Catalogue des capacités

| Code | Description |
|---|---|
| `COURSE_LIST` | Voir les cours accessibles |
| `SESSION_LIST` | Voir les séances d’un cours |
| `ATTENDANCE_READ` | Consulter les présences |
| `SESSION_CREATE` | Créer la séance du jour |
| `ATTENDANCE_WRITE_DRAFT` | Créer ou modifier la saisie d’un brouillon |
| `SESSION_CLOSE` | Clôturer une séance complète |
| `ATTENDANCE_CORRECT_CLOSED` | Corriger une séance clôturée |
| `ACCESS_MANAGE` | Gérer comptes, rôles et affectations |
| `ANALYTICS_READ` | Consulter les rapports privés autorisés |
| `ANALYTICS_PREVIEW` | Prévisualiser les rapports |
| `ANALYTICS_PUBLISH` | Publier les rapports |
| `INSCRIPTIONS_READ` | Consulter les dossiers d’inscription autorisés |
| `INSCRIPTIONS_ANALYZE_IMPORT` | Analyser une source sans écriture métier |
| `INSCRIPTIONS_CONTROL` | Contrôler anomalies et correspondances |
| `INSCRIPTIONS_WRITE` | Corriger les données administratives autorisées |
| `INSCRIPTIONS_APPLY_IMPORT` | Appliquer un lot validé |
| `INSCRIPTIONS_ACTIVATE` | Activer un dossier vers les outils opérationnels |
| `AUDIT_READ` | Consulter les événements d’audit autorisés |

Aucune capacité inconnue n’est ignorée silencieusement : elle invalide l’entrée de
registre concernée et produit un refus fermé.

## 6. Matrice rôle–capacité

| Capacité | Administrateur | Professeur | Assistant AFA | Consultation |
|---|---:|---:|---:|---:|
| `COURSE_LIST` | Globale | Affectation | Affectation | Affectation |
| `SESSION_LIST` | Globale | Affectation | Affectation | Affectation |
| `ATTENDANCE_READ` | Globale | Affectation | Affectation | Affectation |
| `SESSION_CREATE` | Globale | Affectation | Affectation explicite | Non |
| `ATTENDANCE_WRITE_DRAFT` | Globale | Affectation | Affectation explicite | Non |
| `SESSION_CLOSE` | Globale | Affectation | Non par défaut | Non |
| `ATTENDANCE_CORRECT_CLOSED` | Globale | Non | Non | Non |
| `ACCESS_MANAGE` | Globale | Non | Non | Non |
| `ANALYTICS_READ` | Globale | Non par défaut | Non | Selon affectation dédiée |
| `ANALYTICS_PREVIEW` | Globale | Non par défaut | Non | Selon affectation dédiée |
| `ANALYTICS_PUBLISH` | Globale | Non | Non | Non |
| `AUDIT_READ` | Globale | Non | Non | Non |

Une capacité complémentaire peut être accordée dans une affectation uniquement si
elle figure dans le catalogue et ne contredit pas une interdiction structurelle.
Dans le premier incrément, un assistant AFA ne reçoit ni `SESSION_CLOSE` ni
`ATTENDANCE_CORRECT_CLOSED`.

Les capacités Inscriptions n’accordent aucun droit par défaut aux rôles
`PROFESSEUR`, `ASSISTANT_AFA` ou `CONSULTATION`. Elles nécessitent une
affectation explicite. L’administrateur conserve le périmètre global sous réserve
d’un registre valide.

## 7. Affectations et périmètres

Une affectation contient :

- le module concerné ;
- le code stable du cours ;
- la section lorsqu’elle est pertinente ;
- la saison ou `*` lorsque la portée est explicitement globale ;
- le statut `ACTIVE` ou `INACTIVE` ;
- les rôles applicables à cette affectation ;
- les capacités complémentaires éventuelles ;
- une période de validité facultative.

Le cours et la section peuvent être omis uniquement lorsque la capacité possède
explicitement un périmètre global ou par module. Une portée absente n’est jamais
interprétée comme globale. Les codes doivent provenir des catalogues applicatifs ;
un libellé affiché n’est jamais utilisé comme identifiant d’autorisation. Une
affectation vers un module, une section ou un cours absent, désactivé ou hors saison
ne donne aucun droit.

## 8. Calcul de l’autorisation effective

Pour chaque appel, le serveur exécute dans cet ordre :

1. lire et normaliser l’adresse Google active ;
2. charger le registre d’accès et vérifier sa version ;
3. trouver exactement un compte actif correspondant ;
4. vérifier sa période de validité ;
5. résoudre ses rôles connus ;
6. résoudre le module, la saison, la section et le cours pertinents depuis la configuration serveur ;
7. vérifier une affectation active et cohérente, sauf périmètre administrateur global ;
8. calculer les capacités effectives ;
9. vérifier la capacité demandée et l’état de la ressource ;
10. autoriser ou refuser, puis journaliser selon la sensibilité.

Une absence d’adresse, un doublon de compte, un registre illisible, une version non
supportée ou une configuration de cours incohérente entraîne un refus.

## 9. Registre et paramétrage

Le registre d’accès appartient au paramétrage centralisé d’AKS Core. Il ne doit pas
être dupliqué dans les cinq classeurs de cours.

Le contrat logique est un document JSON versionné, validé intégralement avant
activation et stocké par le service de configuration. Il ne contient aucun mot de
passe, jeton ou secret. Pour l’effectif actuel du club, un registre unique reste
suffisant ; un changement de support exigera une migration documentée si la
volumétrie ou les limites Apps Script le justifient.

La mise à jour doit suivre le cycle :

1. validation syntaxique et sémantique complète ;
2. vérification qu’au moins un administrateur actif subsiste ;
3. écriture de la nouvelle version ;
4. relecture et contrôle ;
5. audit avant/après sans données inutiles ;
6. retour à la version précédente en cas d’échec.

## 10. Compatibilité avec l’administration V1.2.0

La V1.2.0 utilise `AKS.Admin.Access` et la liste
`CONFIG.ADMIN.AUTHORIZED_EMAILS`, embarquée dans le code.

La migration respecte les règles suivantes :

- cette liste reste le mécanisme d’amorçage tant que le nouveau registre n’est pas
  implémenté et validé ;
- les administrateurs existants conservent leurs accès pendant la transition ;
- le nouveau service d’autorisation doit pouvoir adapter l’ancien contrôle sans
  modifier les routes publiques ;
- aucune bascule n’est autorisée sans test d’un compte autorisé, d’un compte refusé
  et d’une configuration invalide ;
- après bascule, la liste embarquée reste une solution de récupération documentée
  jusqu’à validation d’une procédure d’administration fiable ;
- aucun déploiement ne doit rendre impossible la récupération d’un accès
  administrateur.

## 11. Frontière serveur

Le service commun expose ou devra exposer conceptuellement :

- `getCurrentIdentity()` ;
- `listAuthorizedCourses(capability)` ;
- `hasCapability(capability, courseCode, season)` ;
- `assertCapability(capability, courseCode, season)` ;
- `getEffectiveAccessContext()`.

Le contexte effectif comprend également les modules accessibles. Chaque entrée de
navigation déclare une capacité minimale et ne peut plus utiliser une valeur
`authorized: true` codée en dur.

Le contexte retourné au client est minimal : identité affichable, cours accessibles
et capacités utiles à l’écran courant. Le registre complet, les autres utilisateurs
et les motifs internes de refus ne sont jamais exposés.

## 12. Journalisation et audit

Doivent être audités :

- création, activation, désactivation ou modification d’un compte ;
- ajout ou retrait d’un rôle ou d’une affectation ;
- changement de période de validité ;
- refus d’une opération sensible ;
- correction d’une séance clôturée ;
- modification laissant un nombre insuffisant d’administrateurs.

Chaque événement comporte au minimum acteur, action, cible, cours/saison si
applicable, résultat, date et identifiant de corrélation. Les adresses peuvent être
conservées lorsqu’elles sont nécessaires à la preuve d’accès, sans copier le registre
complet dans les journaux.

## 13. Codes d’erreur fonctionnels

| Code | Signification publique |
|---|---|
| `ACCESS_AUTH_REQUIRED` | Compte Google non identifié |
| `ACCESS_DENIED` | Opération non autorisée |
| `ACCESS_REGISTRY_INVALID` | Configuration d’accès indisponible |
| `ACCESS_COURSE_DENIED` | Cours non autorisé |
| `ACCESS_CAPABILITY_DENIED` | Capacité non autorisée |
| `ACCESS_SCOPE_INVALID` | Saison ou cours incohérent |

Le message public reste générique. Les détails techniques sont réservés aux journaux
corrélés.

## 14. Matrice minimale de tests

| Cas | Résultat attendu |
|---|---|
| Adresse Google absente | Refus fermé |
| Adresse avec casse ou espaces | Normalisation puis décision correcte |
| Compte absent du registre | Refus |
| Compte inactif ou expiré | Refus |
| Doublon d’adresse | Registre invalide et refus |
| Rôle inconnu | Entrée invalide et refus |
| Professeur affecté au cours A | Accès au cours A uniquement |
| Professeur non affecté au cours B | Refus sur le cours B |
| Assistant explicitement affecté | Saisie du brouillon autorisée |
| Assistant sans affectation | Aucun cours retourné |
| Assistant demandant la clôture | Refus |
| Consultation demandant une écriture | Refus |
| Professeur corrigeant une séance clôturée | Refus |
| Administrateur corrigeant une séance clôturée | Autorisation et audit |
| Utilisateur cumulant professeur et consultation | Union limitée aux affectations |
| Affectation hors saison | Refus |
| Cours client falsifié | Refus serveur |
| Capacité client falsifiée | Ignorée, décision recalculée |
| Registre illisible ou version inconnue | Refus fermé |
| Retrait du dernier administrateur | Mise à jour rejetée |
| Ancien administrateur pendant migration | Accès conservé selon le plan de bascule |
| Compte non autorisé pendant migration | Refus maintenu |

Les tests sont automatisés avec des identités et registres injectés ; ils ne doivent
pas dépendre du compte réel exécutant la suite.

## 15. Critères d’acceptation

`ACCESS-001` est prêt pour l’implémentation lorsque :

1. le catalogue des rôles et capacités est validé ;
2. les affectations sont définies par cours et saison ;
3. les assistants AFA ne disposent que des droits validés ;
4. le calcul serveur refuse toute information insuffisante ;
5. le registre central et sa validation sont définis ;
6. la compatibilité avec `AKS.Admin.Access` est garantie ;
7. le dernier administrateur ne peut pas être retiré ;
8. les actions sensibles sont auditables ;
9. la matrice de tests couvre les refus et cumuls de rôles ;
10. aucun classeur Analytics ne devient une source d’autorisation.

## 16. Hors périmètre

- annuaire complet des licenciés ;
- comptes ou mots de passe propres à AKS Platform ;
- délégation temporaire complexe ;
- rôles personnalisables librement ;
- gestion des groupes Google ;
- authentification multifacteur développée par AKS.

L’interface graphique d’administration, initialement reportée, est désormais cadrée
par `INSCRIPTIONS-004`. Elle reste hors du socle v1.1.0 effectivement publié tant
qu’un incrément applicatif et sa recette n’ont pas été validés.

## 17. Décisions validées

Le Product Owner valide le 28 juillet 2026 :

1. le catalogue des quatre rôles ;
2. la clôture d’un brouillon par un professeur sur ses cours ;
3. l’interdiction de clôture pour un assistant AFA dans le premier incrément ;
4. le registre central versionné plutôt qu’une configuration par classeur ;
5. la conservation temporaire de la liste administrateur embarquée comme
   mécanisme d’amorçage et de récupération ;
6. le report de l’administration graphique des droits à un incrément ultérieur.

Le Product Owner valide le 2 août 2026 pour l’extension transverse :

7. l’utilisation d’`ACCESS-001` par Inscriptions, Analytics, Présences et les futurs modules privés ;
8. la séparation entre rôles généraux et capacités propres aux modules ;
9. l’ajout d’`ANALYTICS_READ` distinct de la prévisualisation et de la publication ;
10. l’extension des périmètres aux modules, saisons, sections et cours ;
11. l’administration centralisée des habilitations selon `INSCRIPTIONS-004` ;
12. le maintien temporaire de la récupération administrateur historique jusqu’à recette complète.

## 18. État de l’implémentation

Le premier incrément du socle commun est fusionné sur la branche applicative
`develop` par la PR #51, commit `9d5a4e981840e313b11642dc951695b65f1d193d`.
Il comprend le registre central `access/1.0`, le calcul serveur des capacités,
l’amorçage sécurisé depuis la liste administrative embarquée, la protection du
dernier administrateur et 18 tests automatisés.

La validation Apps Script cumulative a été exécutée avec succès le 28 juillet 2026 : **309/309 tests réussis, 0 échec**.

Le raccordement au fournisseur de cours et au service d’écriture des présences est
intégré sur `develop` par la PR applicative #52, commit
`9375b1be609870848584a73e802a5d47502c5c8c`. Le registre central est composé
automatiquement côté serveur, le catalogue provient des classeurs Analytics
configurés et une identité non autorisée est refusée avant toute lecture Sheets.
Les 17 tests ciblés réussissent. La validation cumulative Apps Script exécutée le
28 juillet 2026 est également concluante : **311/311 tests réussis, 0 échec**.
Le raccordement est ainsi autorisé à poursuivre vers l’exposition serveur, sans
préjuger de la recette des futures routes utilisateur.

L’exposition serveur sécurisée est intégrée sur `develop` par la PR applicative #53,
commit `d67bc1c241d6dccc2c94b74c29759752aab6e4b0`. Elle expose uniquement le
contexte autorisé et l’enregistrement par lot, compose toutes les dépendances côté
serveur et masque les erreurs internes. Quatre tests ciblés sont ajoutés à la suite
cumulative. Leur validation Apps Script exécutée le 28 juillet 2026 est concluante :
**315/315 tests réussis, 0 échec**. L’exposition serveur est ainsi autorisée à
poursuivre vers sa recette fonctionnelle, sans déploiement utilisateur.

La recette fonctionnelle serveur a été exécutée avec succès le 28 juillet 2026 sur
le classeur isolé `[RECETTE] Analytics Baby 2026-2027` (identifiant
`1iU9Q98uGtlmrEq8-ip5sO6HmW_uThbBYOwacw8iVOH4`). Elle confirme l’identité
serveur `karate.seremange@gmail.com`, le refus réel d’une écriture non autorisée
avec `ACCESS_DENIED`, un périmètre limité au seul cours autorisé et le cycle
complet de la séance `SEA-3B8F53F4970F` du 12 septembre 2026 : clôture en
version 2, deux licenciés éligibles et deux présences enregistrées. Le banc de
recette est intégré par les PR applicatives #54 et #55, commit final
`33c6c068`. Aucun classeur de production n’a été modifié.

Aucun registre réel, aucune interface utilisateur, aucun déploiement Web et aucun
classeur de production n’ont été modifiés.

Le modèle d’autorisation a ensuite été publié avec le parcours mobile de saisie
des présences. La validation finale sur `main` est concluante à **333/333 tests
réussis, 0 échec**. Le déploiement de production a confirmé l’accès au parcours
autorisé et le retour fonctionnel vers le Centre de pilotage.

L’extension transverse v1.2.0 est uniquement cadrée dans la documentation. Les
capacités Analytics et Inscriptions ajoutées au contrat, la navigation calculée et
l’interface Habilitations ne sont pas encore implémentées ni déployées.

## 19. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.0 | 2026-08-02 | Extension transverse cadrée pour Analytics, Inscriptions, Présences et administration ; ajout d’ANALYTICS_READ, des capacités Inscriptions et des périmètres par module |
| 1.1.0 | 2026-07-29 | Modèle d’autorisation publié avec le parcours Présences et validé en production ; suite cumulative finale 333/333 réussie |
| 1.0.8 | 2026-07-28 | Recette fonctionnelle serveur ACCESS-001 réussie : refus d’écriture non autorisée, identité serveur, périmètre BABY unique et séance clôturée avec 2 présences ; publication sur `main` autorisée |
| 1.0.7 | 2026-07-28 | Validation Apps Script de l’exposition serveur : suite cumulative 315/315 réussie, 0 échec ; recette fonctionnelle autorisée à poursuivre sans déploiement utilisateur |
| 1.0.6 | 2026-07-28 | Exposition serveur sécurisée intégrée sur `develop` par la PR #53 ; composition côté serveur, erreurs nettoyées et quatre tests ajoutés ; validation Apps Script requise |
| 1.0.5 | 2026-07-28 | Validation Apps Script du raccordement fonctionnel : suite cumulative 311/311 réussie, 0 échec ; exposition serveur autorisée à poursuivre sans déploiement utilisateur |
| 1.0.4 | 2026-07-28 | Raccordement au catalogue Analytics et au service d’écriture intégré sur `develop` par la PR #52 ; refus avant lecture Sheets et 17/17 tests ciblés réussis ; validation Apps Script requise |
| 1.0.3 | 2026-07-28 | Validation Apps Script cumulative réussie : 309/309 tests, 0 échec ; socle autorisé au raccordement fonctionnel, sans déploiement utilisateur |
| 1.0.2 | 2026-07-28 | Socle ACCESS-001 intégré sur `develop` par la PR #51 ; 18/18 tests locaux réussis ; validation Apps Script requise avant raccordement |
| 1.0.1 | 2026-07-28 | Validation par le Product Owner des rôles, droits de clôture, registre central, mécanisme de récupération et report de l’interface de gestion |
| 1.0.0 | 2026-07-28 | Première spécification soumise à validation du Product Owner |
