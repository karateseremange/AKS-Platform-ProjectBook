# INSCRIPTIONS-008 — Deuxième incrément : accès et audit sans écriture métier

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-008 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Nature** | Autorisation d’un incrément applicatif borné |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit et borne le deuxième incrément applicatif d’AKS Inscriptions après la validation du premier socle sans écriture enregistrée dans `INSCRIPTIONS-006` et dans la note technique applicative `INSCRIPTIONS-007`.

L’incrément étend le service central `ACCESS-001` aux capacités Inscriptions et introduit un support de commande auditée entièrement injectable. Il ne lit ni n’écrit de donnée métier Google réelle.

## 2. Point de départ vérifié

Le socle existant fournit déjà :

- le registre central versionné `access/1.0` ;
- l’identification Google injectée côté serveur ;
- les rôles `ADMINISTRATEUR`, `PROFESSEUR`, `ASSISTANT_AFA` et `CONSULTATION` ;
- les capacités Présences et Analytics existantes ;
- le refus fermé avant lecture d’un dépôt Présences ;
- l’audit injecté des modifications du registre ;
- le premier moteur Inscriptions pur et ses seize jeux d’or ;
- une validation cumulative à **341/341 tests réussis, 0 échec**.

Le scénario `INS-GOLD-011` reste partiel parce que les capacités Inscriptions et leurs périmètres ne sont pas encore implémentés. `INS-GOLD-012` démontre déjà en mémoire qu’un échec d’audit interdit le commit, mais ce comportement doit devenir un contrat réutilisable du module.

## 3. Périmètre autorisé

Le deuxième incrément autorise uniquement :

1. l’ajout au catalogue central des capacités :
   - `INSCRIPTIONS_READ` ;
   - `INSCRIPTIONS_ANALYZE_IMPORT` ;
   - `INSCRIPTIONS_CONTROL` ;
   - `INSCRIPTIONS_WRITE` ;
   - `INSCRIPTIONS_APPLY_IMPORT` ;
   - `INSCRIPTIONS_ACTIVATE` ;
2. l’extension compatible du registre d’accès aux dimensions `module`, `season`, `section` et `courseCode` ;
3. la validation fermée des périmètres absents, inconnus, ambigus, expirés ou incohérents ;
4. un fournisseur de catalogue Inscriptions injecté et fictif pour les tests ;
5. une garde serveur vérifiée avant tout appel au dépôt injecté ;
6. une commande auditée en mémoire qui prépare, audite puis commit uniquement si l’audit obligatoire réussit ;
7. la minimisation de l’événement d’audit ;
8. les tests unitaires, de contrat et d’intégration correspondants ;
9. la mise à jour de `INS-GOLD-011` de `PARTIEL` à `REUSSI` si toutes les preuves sont obtenues ;
10. l’intégration des nouveaux tests dans `AKS_runValidationSuiteV11`.

## 4. Compatibilité du registre

L’évolution du registre doit être explicitement versionnée ou compatible avec `access/1.0`. Elle ne doit jamais interpréter silencieusement une portée absente comme une portée globale.

Les règles suivantes sont obligatoires :

- les capacités Présences existantes conservent leur comportement ;
- les comptes et affectations `access/1.0` existants restent lisibles ou font l’objet d’une migration pure et testée ;
- une capacité Inscriptions exige le module `INSCRIPTIONS` ;
- une saison doit respecter `AAAA-AAAA+1` ou `*` lorsque le contrat autorise explicitement une portée globale ;
- une section appartient à un catalogue injecté ;
- un cours, lorsqu’il est requis, appartient à la section et à la saison autorisées ;
- une valeur inconnue invalide l’affectation concernée ;
- l’administrateur conserve le comportement global existant sans élargir les droits des autres rôles ;
- aucune capacité sensible Inscriptions n’est accordée implicitement à `PROFESSEUR`, `ASSISTANT_AFA` ou `CONSULTATION`.

## 5. Matrice minimale d’autorisation

| Cas | Résultat attendu |
|---|---|
| Identité absente | `ACCESS_AUTH_REQUIRED`, aucun dépôt lu |
| Compte inconnu, inactif ou expiré | Refus fermé, aucun dépôt lu |
| Capacité Inscriptions absente | `ACCESS_CAPABILITY_DENIED`, aucun dépôt lu |
| Module différent d’`INSCRIPTIONS` | Refus fermé |
| Saison hors périmètre | Refus fermé |
| Section inconnue ou non autorisée | Refus fermé |
| Cours incohérent avec section ou saison | Refus fermé |
| `INSCRIPTIONS_READ` valide | Lecture du dépôt injecté autorisée |
| Analyse autorisée sans application | Analyse permise, application refusée |
| Paramètre client falsifié | Ignoré, droits recalculés côté serveur |
| Capacité inconnue dans le registre | Registre ou affectation refusé |
| Capacités Présences existantes | Comportement inchangé |

## 6. Contrat de commande auditée

Une commande sensible suit strictement l’ordre :

1. autoriser l’acteur et le périmètre ;
2. valider la commande ;
3. préparer les changements sans les publier ;
4. construire un événement d’audit minimisé ;
5. persister l’audit obligatoire ;
6. commit du dépôt injecté ;
7. retourner un résultat immuable et corrélable.

Si l’autorisation, la validation, la préparation ou l’audit échoue, le commit n’est jamais appelé.

L’événement d’audit contient uniquement :

- l’acteur technique ;
- l’action ;
- la cible technique minimisée ;
- le résultat ;
- la date ;
- le motif lorsqu’il est obligatoire ;
- l’identifiant de corrélation.

Il ne contient ni réponses médicales, ni dossier complet, ni coordonnées nominatives, ni registre d’accès complet.

## 7. Tests obligatoires

Les tests automatisés doivent au minimum démontrer :

- le catalogue exact des six capacités ;
- la compatibilité des capacités Présences existantes ;
- le refus avant toute lecture du dépôt ;
- la séparation lecture, analyse, contrôle, écriture, application et activation ;
- les limites par module, saison, section et cours ;
- le refus des paramètres client falsifiés ;
- l’absence d’octroi implicite aux rôles non administrateurs ;
- la réussite d’une lecture Inscriptions autorisée avec dépôt injecté ;
- l’absence de commit si l’audit échoue ;
- l’ordre `prepare → audit → commit` lorsque la commande réussit ;
- la minimisation de l’audit ;
- l’absence d’API Google dans le nouveau chemin exécutable testé ;
- la mise à jour contrôlée de l’oracle `INS-GOLD-011` ;
- la réussite de la suite cumulative Apps Script.

Le total cumulatif exact sera déterminé par le nombre réel de tests ajoutés. Il ne doit pas être annoncé avant enregistrement final de la suite.

## 8. Éléments explicitement interdits

Cet incrément n’autorise pas :

- l’écriture ou la lecture d’un registre réel ;
- la modification de comptes ou d’habilitations réels ;
- l’utilisation d’un classeur, formulaire, dossier Drive ou source Google réelle ;
- l’analyse réelle des trois Google Forms ;
- l’application d’un lot d’inscriptions ;
- la création du référentiel physique Inscriptions ;
- une interface privée ou une nouvelle route exposée ;
- la synchronisation vers Analytics ou Présences ;
- la levée artificielle des blocages SIKADA ou `BODY_KARATE` ;
- une restauration Google ;
- un déploiement de production.

## 9. Effet attendu sur les jeux d’or

Après implémentation et validation :

- `INS-GOLD-011` peut passer de `PARTIEL` à `REUSSI` ;
- `INS-GOLD-012` reste `REUSSI` et doit être renforcé par le support réutilisable ;
- `INS-GOLD-016` reste `PARTIEL` ;
- `INS-GOLD-013` et `INS-GOLD-015` restent `BLOQUE`.

Le bilan cible devient donc au mieux **13 réussis, 1 partiel, 2 bloqués, 0 échec**, sous réserve de l’exécution réelle des tests. Cette cible n’est pas une preuve anticipée.

## 10. Critères d’acceptation

L’incrément sera validable lorsque :

- le diff reste limité au catalogue ACCESS, au support d’autorisation/audit, aux fixtures et aux tests ;
- aucune régression des parcours Présences n’est observée ;
- les six capacités et leurs périmètres sont testés ;
- le refus précède tout accès au dépôt ;
- aucun commit n’est possible sans audit obligatoire réussi ;
- les événements d’audit sont minimisés ;
- aucune API Google réelle n’est appelée par les nouveaux tests ;
- `INS-GOLD-011` ne devient réussi qu’après preuve ;
- la suite cumulative Apps Script réussit sans échec ;
- aucun déploiement n’est créé.

## 11. Prochaines étapes après validation

La validation de ce document autorisera une branche applicative dédiée et une PR brouillon vers `develop`.

Les travaux SIKADA, Analytics/`BODY_KARATE`, stockage Google, restauration réelle et interfaces demeureront des incréments séparés soumis à leurs propres prérequis et preuves.

## 12. Décisions structurantes

1. `ACCESS-001` reste l’unique autorité d’accès privé.
2. Les capacités Inscriptions sont explicites et ne créent aucun nouveau rôle.
3. Une portée absente n’est jamais globale.
4. L’autorisation précède tout accès au dépôt.
5. L’audit obligatoire précède le commit métier.
6. Le deuxième incrément reste sans donnée ni ressource Google réelle.
7. Un statut de jeu d’or ne change qu’après exécution probante.

## 13. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-02 | Création du contrat bornant le deuxième incrément applicatif aux capacités Inscriptions d’ACCESS-001 et au support d’audit obligatoire sans écriture métier |
