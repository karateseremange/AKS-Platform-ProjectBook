# ANALYTICS-SAISIE-004 — Saisie rapide et brouillon reprenable

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-004 |
| **Version** | 1.1.0 |
| **Statut** | Publié sur `main` et validé en production |
| **Nature** | Spécification d’incrément et état d’implémentation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Cet incrément ajoute la saisie mobile rapide des statuts de présence et
l’enregistrement sécurisé d’un brouillon reprenable pour la date sélectionnée.

## 2. Périmètre livré

- roster limité aux licenciés éligibles à la date sélectionnée ;
- libellé utile et identifiant interne, sans donnée individuelle superflue ;
- statuts `PRESENT`, `ABSENT`, `EXCUSE` et `NON_RENSEIGNE` ;
- contrôles tactiles accessibles avec état sélectionné annoncé ;
- création d’un brouillon incomplet autorisée ;
- reprise du brouillon de la même date avec restauration des statuts ;
- contrôle optimiste par identifiant de séance et version ;
- clé de soumission distincte pour chaque enregistrement.

## 3. Sécurité

Le contrôle `ATTENDANCE_READ` reste exécuté avant toute lecture Sheets. La
sauvegarde passe exclusivement par `AKS_saveAttendanceBatch`, qui recompose
l’identité, les droits, le dépôt et le verrou côté serveur. Le navigateur ne
fournit ni rôle, ni autorisation, ni identifiant de classeur.

La réponse du serveur masque les adresses électroniques et les métadonnées
techniques de modification. Elle ne retourne que les informations nécessaires
à la saisie et à la reprise sûre du brouillon. Une séance clôturée reste explicitement en lecture seule.

## 4. Exclusions

Cet incrément ne clôture pas une séance, ne corrige pas une séance clôturée,
n’installe pas le registre réel et ne crée aucun déploiement utilisateur. La
clôture, la confirmation et la recette mobile relèvent de l’incrément suivant.

## 5. Validation technique

L’implémentation est fusionnée sur `develop` par les PR applicatives #59 et #60, commit final
`3a15d65e4b914ea684e5fcf15bf6e48203c77827`.

Les quatre tests ciblés réussissent. Ils contrôlent le roster nettoyé, la reprise
versionnée, les quatre statuts tactiles et la sauvegarde par l’API serveur. La
syntaxe JavaScript des fichiers modifiés est valide.

Dans Apps Script, la suite cumulative exécutée le 28 juillet 2026 est concluante :
**325/325 tests réussis, 0 échec**. Elle confirme l’incrément et l’absence de
régression sur `develop`.

Aucune publication sur `main`, aucun déploiement Web et aucune modification de
classeur réel ne sont réalisés à ce stade. La clôture mobile, sa confirmation et
sa recette fonctionnelle sont autorisées à poursuivre.

Le parcours complet a ensuite validé la création du brouillon, sa reprise
versionnée et la conservation des statuts dans la recette isolée. L’incrément a
été publié sur `main`, puis validé dans le déploiement de production avec la
suite cumulative **333/333 tests réussis, 0 échec**.

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.1.0 | 2026-07-29 | Brouillon et reprise versionnée inclus dans le parcours mobile publié et validé en production ; suite cumulative finale 333/333 réussie |
| 1.0.1 | 2026-07-28 | Validation Apps Script : suite cumulative 325/325 réussie, 0 échec ; clôture mobile autorisée à poursuivre |
| 1.0.0 | 2026-07-28 | Saisie rapide et brouillon reprenable intégrés sur `develop` ; 4/4 tests ciblés réussis ; validation cumulative 325/325 requise |
