# ANALYTICS-SAISIE-001 — Cadrage fonctionnel et UX de la saisie des présences

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-001 |
| **Version** | 1.0.0 |
| **Statut** | Validé |
| **Nature** | Cadrage fonctionnel et UX |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Ce document cadre l’interface de saisie des présences d’AKS Analytics avant son
développement. Il fixe le parcours utilisateur, les règles métier, les états
d’interface, les principes de sécurité et les critères d’acceptation.

Le chantier est prioritaire avant AKS Calendar. Il étend AKS Analytics et ne crée
pas, à ce stade, un module métier autonome « Présences ».

## 2. Périmètre

L’utilisateur autorisé peut :

1. s’identifier avec son compte Google ;
2. voir uniquement les cours auxquels il a accès ;
3. sélectionner une séance existante ou créer celle du jour ;
4. afficher les licenciés du cours ;
5. attribuer à chacun `PRESENT`, `ABSENT` ou `EXCUSE` ;
6. enregistrer la saisie complète ;
7. reprendre un brouillon selon ses droits ;
8. clôturer la séance ;
9. consulter une séance enregistrée.

Sont exclus du premier chantier : modification des licenciés, import depuis un
autre système, statistiques avancées, notifications automatiques et migration vers
le contrat cible d’`ANALYTICS-005`.

## 3. Utilisateurs et autorisations

| Capacité | Administrateur | Professeur | Assistant AFA | Consultation |
|---|---:|---:|---:|---:|
| Voir les cours autorisés | Tous | Affectés | Affectés explicitement | Affectés |
| Créer la séance du jour | Oui | Oui | Selon affectation | Non |
| Première saisie | Oui | Oui | Selon affectation | Non |
| Modifier un brouillon | Oui | Oui | Selon affectation | Non |
| Corriger après clôture | Oui | Non par défaut | Non | Non |
| Consulter l’historique | Oui | Cours affectés | Cours affectés | Périmètre autorisé |
| Gérer rôles et affectations | Oui | Non | Non | Non |

Une personne peut cumuler plusieurs rôles. L’autorisation effective est calculée
par capacité et par cours. Le client ne transmet jamais un rôle considéré comme
fiable.

## 4. Cycle de vie d’une séance

### 4.1 Brouillon

La séance peut être créée, complétée et corrigée par un utilisateur disposant du
droit de saisie sur le cours. Les données déjà enregistrées sont rechargées lors
de la reprise.

### 4.2 Clôturée

La saisie est considérée comme terminée. Elle reste consultable. Une correction
nécessite par défaut un administrateur et doit conserver la trace avant/après.

La création d’une même séance et l’enregistrement d’un même licencié doivent être
idempotents.

## 5. Parcours principal

### Écran 1 — Choix du cours

- identité de l’utilisateur affichée ;
- uniquement les cours autorisés ;
- état explicite si aucun cours n’est affecté ;
- saison active visible.

### Écran 2 — Choix de la séance

- séances récentes accessibles ;
- création rapide de la séance du jour ;
- impossibilité de dupliquer la même séance ;
- état `BROUILLON` ou `CLÔTURÉE` visible.

### Écran 3 — Saisie

- un licencié par ligne ;
- nom et prénom lisibles ;
- boutons `Présent`, `Absent`, `Excusé` d’au moins 44 px ;
- sélection identifiable par texte, icône et couleur ;
- action « Tout marquer présent » ;
- recherche locale rapide ;
- compteur renseignés/effectif ;
- action d’enregistrement toujours accessible ;
- avertissement avant sortie si des modifications ne sont pas enregistrées.

### Écran 4 — Confirmation

- résultat de l’enregistrement ;
- nombre de statuts enregistrés ;
- état courant de la séance ;
- possibilité de revenir au choix des séances ;
- aucun détail technique exposé en cas d’échec.

## 6. Contrat de données initial

Le premier service d’écriture cible exclusivement le contrat opérationnel V1.2.0 :

- `Configuration` ;
- `Licenciés` ;
- `Séances` ;
- `Présences`.

Les accents et libellés réels sont conservés. L’écart avec le contrat cible
d’`ANALYTICS-005` reste documenté par `ANALYTICS-009`. Aucune migration implicite
n’est autorisée dans ce chantier.

## 7. Contrôles serveur

Chaque opération reconstruit l’identité et les droits côté serveur, puis vérifie :

- l’utilisateur Google actif ;
- les rôles actifs et l’affectation au cours ;
- la saison active ;
- le classeur associé au cours ;
- l’existence ou la création autorisée de la séance ;
- l’appartenance du licencié au cours ;
- la validité du statut ;
- l’absence de doublon séance/licencié ;
- le droit de modification selon l’état ;
- la cohérence de la version relue avant écriture.

L’écriture d’une séance s’effectue par lot sous verrou Apps Script. En cas de
concurrence détectée, aucune écriture partielle ne doit être conservée et
l’utilisateur doit être invité à recharger.

## 8. Journalisation

Sont journalisés sans donnée sensible inutile :

- création de séance ;
- première saisie ;
- clôture ;
- tentative refusée ;
- correction après clôture ;
- identité de l’auteur, date, cours, séance et résultat ;
- valeurs avant/après pour une correction importante.

## 9. États UX obligatoires

L’interface prévoit les états : chargement, vide, prêt, modifications non
enregistrées, enregistrement en cours, succès, refus d’accès, conflit de
concurrence, erreur fonctionnelle et indisponibilité technique.

Les commandes sont désactivées pendant un traitement afin d’éviter les doubles
soumissions. Les messages sont annoncés de manière accessible.

## 10. Critères d’acceptation

Le cadrage sera respecté lorsque :

1. aucun cours non autorisé n’est retourné par le serveur ;
2. un assistant AFA ne peut saisir que sur affectation explicite ;
3. une séance du jour ne peut pas être créée deux fois ;
4. les trois statuts autorisés sont les seuls acceptés ;
5. un licencié extérieur au cours est rejeté ;
6. une saisie complète est enregistrée atomiquement ;
7. un conflit concurrent ne produit aucune écriture partielle ;
8. un professeur ne corrige pas une séance clôturée ;
9. un administrateur peut corriger avec traçabilité ;
10. l’interface reste utilisable sur téléphone et tablette Android ;
11. les données produites restent consommables par Analytics V1.2.0 ;
12. la suite cumulative demeure sans régression.

## 11. Découpage de réalisation

| Incrément | Résultat attendu |
|---|---|
| ACCESS-001 | Rôles, capacités, affectations et matrice de tests |
| ANALYTICS-SAISIE-002 | Contrat d’écriture, verrouillage, validation et journalisation |
| ANALYTICS-SAISIE-003 | Route, choix du cours et de la séance |
| ANALYTICS-SAISIE-004 | Saisie rapide mobile et sauvegarde |
| ANALYTICS-SAISIE-005 | Reprise, clôture, correction et concurrence |
| ANALYTICS-SAISIE-006 | Intégration, recette, déploiement et retour arrière |

ACCESS-001 précède toute écriture dans les classeurs.

## 12. Décisions validées

Le Product Owner valide le 28 juillet 2026 :

- la priorité d’ANALYTICS-SAISIE avant AKS Calendar ;
- le contrat opérationnel V1.2.0 comme première cible d’écriture ;
- les droits limités des assistants AFA ;
- les états `BROUILLON` et `CLÔTURÉE` ;
- la correction après clôture réservée par défaut à l’administrateur ;
- l’enregistrement par lot avec verrouillage.

## 13. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-28 | Cadrage fonctionnel et UX validé avant développement |
