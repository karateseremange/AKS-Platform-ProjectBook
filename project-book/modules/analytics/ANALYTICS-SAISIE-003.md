# ANALYTICS-SAISIE-003 — Route et navigation mobile des présences

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-003 |
| **Version** | 1.0.0 |
| **Statut** | Implémentation intégrée sur `develop` — validation Apps Script requise |
| **Nature** | Spécification d’incrément et état d’implémentation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Cet incrément fournit le premier parcours mobile de saisie des présences sans
encore permettre la modification des statuts. Il couvre la route dédiée, le compte
Google actif, le choix d’un cours autorisé, la date et la consultation des séances
récentes.

## 2. Périmètre livré

- route Web `?app=attendance` ;
- identité du compte Google actif affichée ;
- liste limitée aux cours autorisés par `ACCESS-001` ;
- choix d’une date de séance ;
- effectif éligible à la date sélectionnée ;
- vingt séances récentes avec date et état `BROUILLON` ou `CLOTUREE` ;
- interface adaptée au téléphone et à la tablette ;
- états de chargement, vide, refus et indisponibilité annoncés de manière accessible.

## 3. Sécurité

La capacité `ATTENDANCE_READ` est contrôlée côté serveur avant toute ouverture
du classeur. Le navigateur ne fournit ni identité fiable, ni rôle, ni autorisation,
ni identifiant de classeur. La réponse exclut le classeur, les dépendances
techniques et l’auteur des modifications.

## 4. Exclusions

Cet incrément ne crée, ne modifie et ne clôture aucune séance. Il ne saisit aucun
statut de présence, n’installe aucun registre réel et ne crée aucun déploiement.
Ces fonctions relèvent des incréments `ANALYTICS-SAISIE-004` et
`ANALYTICS-SAISIE-005`.

## 5. Validation technique

L’implémentation est fusionnée sur `develop` par la PR applicative #58, commit
`c7adbe52a8b30a55804b8f1867842f4e22ec2d9d`.

Les six tests ciblés réussissent localement. Ils contrôlent le refus avant lecture,
le périmètre, le nettoyage de la réponse, le parcours cours/séance, les retours
accessibles et les cibles mobiles. La syntaxe Apps Script des fichiers modifiés
est valide.

La suite cumulative Apps Script attendue est **321/321 tests réussis, 0 échec**.
Aucune publication sur `main` ni aucun déploiement utilisateur ne sont autorisés
avant cette validation.

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-28 | Route et navigation mobile intégrées sur `develop` ; 6/6 tests ciblés réussis ; validation cumulative 321/321 requise |
