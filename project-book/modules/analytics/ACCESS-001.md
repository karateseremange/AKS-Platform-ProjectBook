# ACCESS-001 — Rôles, capacités et affectations Analytics

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-001 |
| **Version** | 1.0.3 |
| **Statut** | Validé |
| **Nature** | Spécification fonctionnelle et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Ce document définit le modèle d’autorisation requis par l’interface de saisie des
présences d’AKS Analytics. Il fixe les identités, rôles, capacités, affectations aux
cours, règles de calcul des droits, exigences de configuration, contrôles serveur,
migration depuis l’accès administratif V1.2.0 et matrice de validation.

Il applique `SECURITY-001`, `CONFIG-001`, `LOG-001`, `AUDIT-001`,
`API-001` et `ANALYTICS-SAISIE-001`. Il précède toute écriture dans les
classeurs Analytics.

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
| `assignments` | Affectations explicites aux cours et capacités complémentaires |
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
| `ADMINISTRATEUR` | Administration globale, tous les cours et opérations sensibles |
| `PROFESSEUR` | Saisie et consultation des cours auxquels la personne est affectée |
| `ASSISTANT_AFA` | Saisie limitée aux cours explicitement affectés |
| `CONSULTATION` | Lecture seule sur le périmètre explicitement affecté |

Une personne peut cumuler plusieurs rôles. Les capacités effectives sont l’union
des capacités accordées par ses rôles actifs, limitée par ses affectations actives.
Le cumul ne permet jamais de dépasser le périmètre de cours autorisé, sauf pour
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
| `ANALYTICS_PREVIEW` | Prévisualiser les rapports |
| `ANALYTICS_PUBLISH` | Publier les rapports |
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
| `ANALYTICS_PREVIEW` | Globale | Non par défaut | Non | Selon affectation dédiée |
| `ANALYTICS_PUBLISH` | Globale | Non | Non | Non |
| `AUDIT_READ` | Globale | Non | Non | Non |

Une capacité complémentaire peut être accordée dans une affectation uniquement si
elle figure dans le catalogue et ne contredit pas une interdiction structurelle.
Dans le premier incrément, un assistant AFA ne reçoit ni `SESSION_CLOSE` ni
`ATTENDANCE_CORRECT_CLOSED`.

## 7. Affectations aux cours

Une affectation contient :

- le code stable du cours ;
- la saison ou `*` lorsque la portée est explicitement globale ;
- le statut `ACTIVE` ou `INACTIVE` ;
- les rôles applicables à cette affectation ;
- les capacités complémentaires éventuelles ;
- une période de validité facultative.

Les codes de cours doivent provenir du registre Analytics existant. Un libellé
affiché n’est jamais utilisé comme identifiant d’autorisation. Une affectation vers
un cours absent, désactivé ou hors saison ne donne aucun droit.

## 8. Calcul de l’autorisation effective

Pour chaque appel, le serveur exécute dans cet ordre :

1. lire et normaliser l’adresse Google active ;
2. charger le registre d’accès et vérifier sa version ;
3. trouver exactement un compte actif correspondant ;
4. vérifier sa période de validité ;
5. résoudre ses rôles connus ;
6. résoudre le cours et la saison depuis la configuration serveur ;
7. vérifier une affectation active, sauf périmètre administrateur global ;
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

Le futur service commun expose conceptuellement :

- `getCurrentIdentity()` ;
- `listAuthorizedCourses(capability)` ;
- `hasCapability(capability, courseCode, season)` ;
- `assertCapability(capability, courseCode, season)` ;
- `getEffectiveAccessContext()`.

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
- authentification multifacteur développée par AKS ;
- interface graphique d’administration des droits dans ce premier incrément.

## 17. Décisions validées

Le Product Owner valide le 28 juillet 2026 :

1. le catalogue des quatre rôles ;
2. la clôture d’un brouillon par un professeur sur ses cours ;
3. l’interdiction de clôture pour un assistant AFA dans le premier incrément ;
4. le registre central versionné plutôt qu’une configuration par classeur ;
5. la conservation temporaire de la liste administrateur embarquée comme
   mécanisme d’amorçage et de récupération ;
6. le report de l’administration graphique des droits à un incrément ultérieur.

## 18. État de l’implémentation

Le premier incrément du socle commun est fusionné sur la branche applicative
`develop` par la PR #51, commit `9d5a4e981840e313b11642dc951695b65f1d193d`.
Il comprend le registre central `access/1.0`, le calcul serveur des capacités,
l’amorçage sécurisé depuis la liste administrative embarquée, la protection du
dernier administrateur et 18 tests automatisés.

La validation Apps Script cumulative a été exécutée avec succès le 28 juillet 2026 : **309/309 tests réussis, 0 échec**. Le socle peut désormais être raccordé aux
routes de saisie. Aucun registre réel, aucune route utilisateur, aucun déploiement
Web et aucun classeur de production n’ont été modifiés.

## 19. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.3 | 2026-07-28 | Validation Apps Script cumulative réussie : 309/309 tests, 0 échec ; socle autorisé au raccordement fonctionnel, sans déploiement utilisateur |
| 1.0.2 | 2026-07-28 | Socle ACCESS-001 intégré sur `develop` par la PR #51 ; 18/18 tests locaux réussis ; validation Apps Script requise avant raccordement |
| 1.0.1 | 2026-07-28 | Validation par le Product Owner des rôles, droits de clôture, registre central, mécanisme de récupération et report de l’interface de gestion |
| 1.0.0 | 2026-07-28 | Première spécification soumise à validation du Product Owner |
