# ACCESS-002-04 — Fiche et habilitations

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-04 |
| **Titre** | Fiche utilisateur, rôles multiples et habilitations explicites |
| **Version** | 0.5.0 |
| **Statut** | Lot 4A implémenté — PR applicative #108 en validation |
| **Nature** | Spécification d’incrément fonctionnel et technique |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-13 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-04` rend administrables les rôles multiples et les habilitations explicites depuis une fiche individuelle protégée par `ACCESS_MANAGE`.

L’incrément maintient une séparation stricte entre la fonction de la personne, décrite par ses rôles, et ses droits réels, matérialisés par des habilitations explicites. Aucun rôle, même `ADMINISTRATEUR`, n’accorde automatiquement une capacité ou l’accès à un module.

## 2. Point de départ

`ACCESS-002-03` est validé en version `1.0.0`. La liste, la recherche, les filtres, la projection effective, la création inactive, l’activation et la désactivation sont intégrés et validés à **542/542 tests**. Sa recette réversible a restauré exactement le registre et la configuration AUDIT.

Le registre `access/1.0` supporte déjà plusieurs rôles et des affectations explicites. Il conserve toutefois une représentation historique de Présences sans nom de module et ne permet pas de représenter Analytics comme un module réellement autonome. `ACCESS-002-04` doit résoudre cet écart sans migration automatique des données réelles.

## 3. Résultat fonctionnel attendu

La ligne d’un compte dans « Comptes et accès » ouvre une fiche individuelle comprenant :

1. identité, statut et métadonnées serveur ;
2. rôles descriptifs multiples ;
3. cartes d’habilitations Présences, Analytics, Inscriptions et Administration ACCESS ;
4. périodes de validité facultatives ;
5. synthèse des ajouts, retraits et droits effectifs avant enregistrement ;
6. commentaire facultatif ;
7. confirmation renforcée pour les modifications sensibles ;
8. historique fonctionnel issu des preuves AUDIT.

L’adresse Google reste immuable. Un changement d’adresse demeure un nouveau compte distinct, sans copie automatique des droits.

## 4. Rôles multiples

Les rôles autorisés restent :

- `ADMINISTRATEUR` ;
- `PROFESSEUR` ;
- `ASSISTANT_AFA` ;
- `CONSULTATION`.

Une fiche possède au moins un rôle et peut en cumuler plusieurs. Les doublons et valeurs inconnues sont refusés côté serveur. Modifier les rôles n’ajoute ni ne retire implicitement une capacité. Une affectation ne peut référencer qu’un rôle effectivement détenu par le compte après modification.

## 5. Cartes d’habilitations

### 5.1 Présences

Présences reste attribué par saison et cours explicites. L’interface peut sélectionner tous les cours actuellement connus d’une section, mais enregistre chaque cours individuellement. Aucun futur cours n’est ajouté automatiquement.

Les capacités effectives restent déterminées par les rôles portés par l’affectation et les capacités complémentaires admises par le socle. Un professeur peut n’avoir aucun accès Présences.

### 5.2 Analytics

Analytics devient indépendant de Présences et expose explicitement :

- `ANALYTICS_READ` ;
- `ANALYTICS_PREVIEW` ;
- `ANALYTICS_PUBLISH`.

Ces capacités sont enregistrées dans une affectation de module `ANALYTICS`, sans dépendance à un cours Présences. Le serveur refuse les combinaisons inconnues ou incohérentes.

### 5.3 Inscriptions

Inscriptions conserve ses capacités fines :

- `INSCRIPTIONS_READ` ;
- `INSCRIPTIONS_ANALYZE_IMPORT` ;
- `INSCRIPTIONS_CONTROL` ;
- `INSCRIPTIONS_WRITE` ;
- `INSCRIPTIONS_APPLY_IMPORT` ;
- `INSCRIPTIONS_ACTIVATE`.

Le périmètre est contrôlé côté serveur selon la capacité : saison, section et, lorsque requis ou autorisé, cours. Les catalogues serveur sont la seule source des valeurs sélectionnables.

### 5.4 Administration ACCESS

`ACCESS_MANAGE` reste une capacité transverse portée par le module `ACCESS`, la saison `*` et aucun périmètre de section ou cours.

Son ajout ou son retrait exige une confirmation renforcée. Toute auto-modification est autorisée selon la décision de confiance validée, mais identifiée explicitement dans l’audit. Le serveur refuse toute opération laissant zéro gestionnaire effectif.

## 6. Temporalité

Chaque habilitation accepte facultativement une date de début et une date de fin au format `YYYY-MM-DD`. La date de début ne peut être postérieure à la date de fin.

Une habilitation future ou expirée reste enregistrée mais n’accorde aucun droit hors de sa période. Aucun renouvellement automatique ni copie inter-saison n’est introduit.

## 7. Compte inactif

La fiche d’un compte inactif reste consultable pour l’historique. Ses rôles, anciennes affectations et preuves sont visibles, mais les habilitations ne sont pas modifiables tant que le compte n’a pas été réactivé selon le cycle sécurisé d’ACCESS-002-03.

## 8. Contrat serveur

Le navigateur ne reçoit jamais le registre complet et ne soumet pas une nouvelle version globale. Le service dédié expose au minimum :

1. `getAccountDetail(accountId)` — projection minimisée de la fiche et catalogues autorisés ;
2. `previewAccountAccess(command)` — validation pure et synthèse avant/après sans écriture ;
3. `saveAccountAccess(command)` — remplacement atomique des rôles et habilitations de la cible ;
4. `getAccountHistory(accountId, cursor)` — historique fonctionnel paginé et minimisé.

La commande d’enregistrement contient l’identité cible, la révision attendue, un identifiant de requête, les rôles proposés, les habilitations proposées, le commentaire facultatif et la confirmation sensible lorsque requise.

Le serveur relit le registre courant sous verrou, reconstruit uniquement le compte ciblé, valide l’ensemble du registre, protège le dernier gestionnaire, exige l’audit persistant, écrit atomiquement, relit la preuve et retourne une projection minimisée.

## 9. Évolution de schéma

Le schéma cible est `access/1.1`.

Le lecteur accepte `access/1.0` et le normalise en mémoire sans écriture. Aucune migration automatique n’est déclenchée par une lecture, un affichage ou un précontrôle. La première écriture explicitement autorisée sur un registre `access/1.0` produit une représentation canonique `access/1.1` après sauvegarde, validation et audit.

La compatibilité inclut :

- lecture des affectations Présences historiques dont le champ `module` est vide ;
- conservation de leur sens métier ;
- nouvelle représentation explicite du module `ANALYTICS` ;
- maintien des modules `ACCESS` et `INSCRIPTIONS` ;
- refus fermé des versions inconnues.

La migration réelle d’un registre reste une opération de recette puis de production séparément autorisée. ACCESS-002-04 n’autorise pas à lui seul une migration permanente.

Le lot 1 ajoute une protection supplémentaire : une ancienne affectation Présences portant une capacité Analytics reste lisible en `access/1.0`, mais ne peut pas être réenregistrée telle quelle sous l’étiquette `access/1.1`. L’écriture est refusée sans mutation jusqu’à ce qu’une migration explicitement autorisée produise une affectation autonome `ANALYTICS`. Cette règle évite toute extension implicite d’un droit historiquement limité à un cours.

## 10. Synthèse et confirmation

Avant toute écriture, l’interface affiche :

- rôles ajoutés et retirés ;
- habilitations ajoutées, modifiées et retirées ;
- capacités effectives résultantes ;
- habilitations futures, expirées ou devenues inactives ;
- auto-modification éventuelle ;
- ajout ou retrait d’`ACCESS_MANAGE` ;
- effet éventuel sur le dernier gestionnaire.

Un commentaire facultatif peut accompagner l’opération. La confirmation renforcée est obligatoire pour `ACCESS_MANAGE`, une auto-modification ou tout retrait pouvant affecter la continuité administrative.

## 11. Historique fonctionnel

L’historique visible provient des preuves persistantes AUDIT. Il expose uniquement : date, acteur masqué ou libellé autorisé, nature du changement, synthèse des rôles/habilitations ajoutés ou retirés, commentaire et résultat.

Les métadonnées techniques complètes, sérialisations et détails internes restent réservés à AUDIT/Journaux et ne sont pas recopiés dans la fiche.

## 12. Sécurité

- route, lecture de fiche, prévisualisation, historique et écriture exigent `ACCESS_MANAGE` ;
- chaque appel réautorise l’identité active côté serveur ;
- les catalogues et périmètres reçus du navigateur sont revalidés ;
- une révision obsolète impose le rechargement ;
- un compte inactif est non modifiable ;
- aucune confirmation client ne lève un refus serveur ;
- les doubles soumissions sont bornées par l’identifiant de requête ;
- un échec de validation, d’audit ou de vérification laisse ou restaure le registre initial.

## 13. Hors périmètre

Sont exclus :

- « Mes accès » et le portail personnalisé, réservés à `ACCESS-002-05` ;
- migration définitive de toutes les routes, réservée à `ACCESS-002-06` ;
- notifications e-mail ;
- duplication inter-saison ;
- modèles ou profils d’habilitations ;
- modifications groupées ;
- import, export et reporting ;
- suppression physique ;
- création de comptes Google ;
- production, `main` et migration permanente sans autorisation distincte.

## 14. Scénarios minimaux

| ID | Scénario | Résultat attendu |
|---|---|---|
| A04-01 | Fiche avec `ACCESS_MANAGE` | Projection minimisée et catalogues serveur |
| A04-02 | Fiche sans `ACCESS_MANAGE` | Refus avant lecture |
| A04-03 | Ajout et retrait de rôles | Multi-rôle sans capacité implicite |
| A04-04 | Rôle d’affectation non détenu | Refus sans écriture |
| A04-05 | Présences sur plusieurs cours | Cours explicites uniquement |
| A04-06 | Analytics sans Présences | Capacités Analytics effectives indépendantes |
| A04-07 | Inscriptions avec périmètre conforme | Capacités et portée exactes |
| A04-08 | Habilitation future ou expirée | Enregistrée mais non effective hors période |
| A04-09 | Compte inactif | Consultation autorisée, modification refusée |
| A04-10 | Prévisualisation | Synthèse exacte sans écriture |
| A04-11 | Révision concurrente | Conflit sans écriture |
| A04-12 | Double soumission | Une mutation au plus |
| A04-13 | Attribution d’`ACCESS_MANAGE` | Confirmation renforcée et audit |
| A04-14 | Retrait du dernier gestionnaire | Refus persistant sans écriture |
| A04-15 | Auto-modification | Autorisée, confirmée et auditée explicitement |
| A04-16 | Lecture `access/1.0` | Compatibilité sans écriture |
| A04-17 | Écriture autorisée vers `access/1.1` | Canonisation sauvegardée et auditée |
| A04-18 | Historique fonctionnel | Vue minimisée issue d’AUDIT |
| A04-19 | Échec d’audit final | Restauration exacte, réussite non confirmée |
| A04-20 | Suite cumulative et recette isolée | Non-régression et restauration concluantes |

## 15. Stratégie de réalisation

La réalisation est découpée en cinq lots :

1. **schéma et catalogues — validé** — PR applicative #105 fusionnée dans `develop` au commit `58ef718`, 242 fichiers synchronisés dans Apps Script et suite cumulative validée à **552/552** ;
2. **projection et prévisualisation — validé** — PR applicative #106 fusionnée dans `develop` au commit `a3a175a`, 244 fichiers synchronisés dans Apps Script et suite cumulative validée à **562/562** ;
3. **commande atomique — validé** — PR applicative #107 fusionnée dans `develop` au commit `68abc2b`, 244 fichiers synchronisés dans Apps Script et suite cumulative validée à **568/568** ;
4. **interface et historique** — sous-lot 4A implémenté dans la PR #108 : fiche intégrée à la liste, quatre cartes, dates, commentaire, prévisualisation, synthèse, lecture seule des comptes inactifs et confirmation ; sous-lot 4B historique AUDIT restant ;
5. **recette réversible et clôture** — campagne cumulative, profils représentatifs, restauration exacte et documentation finale.

Aucune donnée réelle n’est modifiée pendant les quatre premiers lots. Chaque mutation de recette ou migration de schéma exige une autorisation explicite distincte.

## 16. Critères d’acceptation

`ACCESS-002-04` est terminé lorsque :

1. la fiche et chaque appel sont protégés par `ACCESS_MANAGE` ;
2. rôles et habilitations restent séparés ;
3. le multi-rôle fonctionne sans droit implicite ;
4. Présences, Analytics, Inscriptions et ACCESS sont indépendants ;
5. dates et catalogues sont validés côté serveur ;
6. la synthèse avant écriture est exacte et sans mutation ;
7. l’enregistrement est atomique, audité et protégé par révision ;
8. le dernier gestionnaire et les comptes inactifs sont protégés ;
9. l’historique fonctionnel est minimisé ;
10. `access/1.0` reste lisible sans écriture et `access/1.1` est canonique ;
11. la recette isolée et la suite cumulative sont concluantes ;
12. aucune fonctionnalité d’ACCESS-002-05/06, production ou `main` n’est modifiée ;
13. le Project Book reflète le comportement livré.

## 17. Décisions validées

Le Product Owner a validé le 13 août 2026 les quinze décisions suivantes : fiche depuis la liste, rôles multiples sans droit implicite, quatre cartes de modules, cours Présences explicites, Analytics autonome, capacités Inscriptions fines, `ACCESS_MANAGE` transverse et sensible, dates facultatives, remplacement atomique sous révision, synthèse et commentaire, protection du dernier gestionnaire, compte inactif consultable mais non modifiable, historique issu d’AUDIT, compatibilité `access/1.0` vers `access/1.1` et report de « Mes accès » à ACCESS-002-05.

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.5.0 | 2026-08-13 | Sous-lot 4A implémenté dans la PR applicative #108 : interface de fiche, rôles multiples, quatre cartes, dates, commentaire, synthèse et confirmation, avec cinq scénarios cumulatifs ; historique réservé à 4B et aucune donnée réelle modifiée |
| 0.4.1 | 2026-08-13 | Lot 3 validé par le Product Owner : PR #107 fusionnée au commit `68abc2b`, 244 fichiers synchronisés et suite cumulative Apps Script réussie à **568/568**, sans modification de données réelles |
| 0.4.0 | 2026-08-13 | Lot 3 implémenté dans la PR applicative #107 : commande ciblée atomique, contexte AUDIT, confirmations renforcées, refus sans changement, double soumission bornée et cinq nouveaux scénarios cumulatifs ; aucune donnée réelle modifiée |
| 0.3.1 | 2026-08-13 | Lot 2 validé par le Product Owner : PR #106 fusionnée au commit `a3a175a`, 244 fichiers synchronisés et suite cumulative Apps Script réussie à **562/562**, sans modification de données réelles |
| 0.3.0 | 2026-08-13 | Lot 2 implémenté dans la PR applicative #106 : fiche minimisée, catalogues fermés, prévisualisation pure réutilisant le validateur central, protection des comptes inactifs, synthèse des écarts et dix scénarios ciblés ; aucune donnée réelle modifiée |
| 0.2.1 | 2026-08-13 | Lot 1 validé par le Product Owner : PR #105 fusionnée au commit `58ef718`, 242 fichiers synchronisés et suite cumulative Apps Script réussie à **552/552**, sans modification de données réelles |
| 0.2.0 | 2026-08-13 | Lot 1 implémenté dans la PR applicative #105 : schéma canonique `access/1.1`, lecture compatible `access/1.0`, catalogue fermé et immuable, Analytics autonome, refus des écritures historiques non migrées et dix tests ciblés ; aucune donnée réelle modifiée |
| 0.1.0 | 2026-08-13 | Cadrage initial validé : fiche individuelle, multi-rôle, quatre cartes d’habilitations, temporalité, synthèse/commentaire, historique AUDIT, protections et évolution compatible `access/1.0` vers `access/1.1`, sans implémentation ni donnée réelle |
