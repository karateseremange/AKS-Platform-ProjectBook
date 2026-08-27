# ACCESS-002-07 — Attribution des habilitations Administration

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-07 |
| **Titre** | Attribution des habilitations Configuration et Journaux |
| **Version** | 0.3.2 |
| **Statut** | Finalisation V1.4.1 intégrée dans le `develop` applicatif par la PR #136 — PR documentaire #195 en revue |
| **Nature** | Correctif fonctionnel et de sécurité post-V1.4.0 |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-27 |
| **Version du produit** | V1.4.1 en préparation |

---

## 1. Contexte

V1.4.0 a publié le registre ACCESS `access/1.2`, le module transverse
`ADMINISTRATION` et les capacités explicites `CONFIG_READ`,
`CONFIG_WRITE`, `CONFIG_RESET` et `LOG_READ`. Les contrôleurs
Paramétrage et Journaux ainsi que la projection du Portail réautorisent déjà
ces capacités côté serveur.

Après l’amorçage réel du registre, la validation multi-compte a toutefois
montré que la fiche « Gérer les habilitations » n’expose que Présences,
Analytics, Inscriptions et Administration ACCESS. Elle ne permet donc pas à
un détenteur de `ACCESS_MANAGE` d’attribuer les capacités du module
`ADMINISTRATION` depuis l’interface normale.

Les refus actuels « Paramétrage non autorisé » et « Administration non
autorisée » sont conformes au registre de production, dans lequel les deux
gestionnaires ne possèdent que `ACCESS_MANAGE`. Le correctif ne contourne
pas ces refus : il complète l’interface d’attribution prévue par le modèle.

## 2. Décision Product Owner

Le 26 août 2026, le Product Owner a retenu une évolution applicative plutôt
qu’une modification technique directe du registre de production.

Le correctif doit permettre l’attribution normale, prévisualisée, confirmée
et auditée des capacités Configuration et Journaux depuis la fiche
utilisateur. Une attribution réelle en production reste une opération
distincte, interdite par le présent incrément.

## 3. Périmètre fonctionnel

La fiche utilisateur ajoute une carte « Configuration et journaux » rattachée
au module technique `ADMINISTRATION`.

Elle expose exactement :

- `CONFIG_READ` ;
- `CONFIG_WRITE` ;
- `CONFIG_RESET` ;
- `LOG_READ`.

Le filtre global des comptes ajoute également le module
`ADMINISTRATION`.

L’affectation est globale :

- `season: "*"` ;
- aucune section ;
- aucun cours.

Les rôles restent descriptifs et doivent être détenus par le compte. Aucun
rôle, y compris `ADMINISTRATEUR`, n’accorde implicitement l’une de ces
capacités.

## 4. Règles de cohérence conservées

| Action | Capacités effectives nécessaires |
|---|---|
| Ouvrir et consulter le Paramétrage | `CONFIG_READ` |
| Enregistrer une valeur | `CONFIG_READ` et `CONFIG_WRITE` |
| Réinitialiser une valeur | `CONFIG_READ`, `CONFIG_WRITE` et `CONFIG_RESET` |
| Consulter les Journaux | `LOG_READ` |

Une nouvelle affectation incohérente reste refusée côté serveur :

- `CONFIG_WRITE` sans `CONFIG_READ` ;
- `CONFIG_RESET` sans `CONFIG_READ` et `CONFIG_WRITE` ;
- capacité extérieure au module `ADMINISTRATION` ;
- saison différente de `*` ;
- section ou cours renseigné.

`LOG_READ` reste indépendant des capacités Configuration. Il ne donne accès
ni à AUDIT, ni à ACCESS, ni au Paramétrage.

## 5. Sécurité et audit

Toute lecture globale et toute modification du registre restent protégées par
`ACCESS_MANAGE`.

Le correctif conserve :

1. la prévisualisation serveur ;
2. la révision optimiste ;
3. le verrou du registre ;
4. la validation du catalogue serveur ;
5. la confirmation explicite avant enregistrement ;
6. l’écriture atomique ;
7. les preuves AUDIT corrélées `INTENTION` et `REUSSI` ;
8. la restauration en cas d’échec de preuve finale ;
9. la protection du dernier gestionnaire ACCESS.

Le correctif n’ajoute aucun droit implicite, aucune exception d’adresse et
aucun rôle `SUPER_ADMIN`.

## 6. Modifications applicatives

Le périmètre applicatif est limité à :

- `src/ui/admin/AccessAccounts.html` ;
- `src/ui/admin/AccessAccountsClient.html` ;
- `src/tests/access/Access002AdminUiTest.gs`.

Les changements attendus sont :

- ajout du filtre `ADMINISTRATION` ;
- ajout de la cinquième carte d’habilitations ;
- initialisation de la portée globale `season: "*"` ;
- maintien de l’unicité de l’affectation ACCESS ;
- extension des contrôles structurels de l’interface.

Le moteur ACCESS, les contrôleurs Paramétrage et Journaux et la projection du
Portail ne nécessitent aucune modification : ils prennent déjà en charge les
capacités concernées.

## 7. Validation réalisée et conditions restantes

Avant toute fusion applicative, la revue a confirmé :

1. exactement trois fichiers applicatifs modifiés ;
2. cinq cartes d’habilitations visibles ;
3. `ADMINISTRATION` disponible dans le filtre ;
4. portée globale correctement initialisée ;
5. catalogue serveur inchangé ;
6. cohérences Config toujours refusées fermées ;
7. `LOG_READ` indépendant ;
8. `ACCESS_MANAGE` inchangé ;
9. absence de route ou destination Inscriptions ajoutée ;
10. absence de mutation de production.

Après autorisation explicite, le commit applicatif `c2efda48a0d2cabbb735cd7c0245f7331435be94` a été synchronisé exclusivement avec le projet Apps Script de recette suffixé `eIRxs4`. La sauvegarde préalable contient 262 fichiers et son archive `prepush-20260827-112543.zip` porte l’empreinte SHA-256 `FEECD6FB70443D6CF728ACE8FDB38DBE9983641CCB09F023D2E327140DA78538`. Le push a porté sur 261 fichiers ; la relecture post-push en compte 261/261 sans différence avec la candidate. La suite ciblée `AKS_runAccess002AdminUiSuite` réussit à **15/15** et la suite cumulative `AKS_runValidationSuiteV11` à **665/665**, avec zéro échec. Après validation, la recette a été restaurée depuis la sauvegarde préalable puis relue à 261/261 fichiers sans différence. Le projet restauré compte sept déploiements et n’expose pas le suffixe de production `wgNc37`. Aucune donnée réelle, branche `main` ou production n’a été modifiée.

## 8. Publication et production

ACCESS-002-07 est intégré dans les deux branches `develop`. Sa formalisation
comme correctif V1.4.1 est préparée séparément, sans publication.

Restent non autorisés dans le présent cycle :

- la fusion d’une PR vers `main` ;
- la création ou le déplacement d’un tag ;
- un push Apps Script de production ;
- la création d’une version Apps Script ;
- la modification du déploiement `wgNc37` ;
- l’attribution réelle de `CONFIG_*` ou `LOG_READ` ;
- une écriture ACCESS ou AUDIT ;
- l’engagement de l’implémentation d’INSCRIPTIONS-011.

Toute attribution réelle devra suivre un protocole séparé : inventaire,
prévisualisation, autorisation explicite, écriture unique, relecture des droits,
validation fonctionnelle, vérification AUDIT et conclusion documentaire.

## 9. Références de réalisation

- branche applicative : `agent/access-002-07-administration-ui` ;
- branche Project Book : `docs/access-002-07-administration-ui` ;
- PR applicative : [AKS-Platform #135](https://github.com/karateseremange/AKS-Platform/pull/135), fusionnée dans `develop` au commit [`6d7815a`](https://github.com/karateseremange/AKS-Platform/commit/6d7815a2f3e20256de4c55c361670c7fd3fdaddb) ;
- PR Project Book : [AKS-Platform-ProjectBook #194](https://github.com/karateseremange/AKS-Platform-ProjectBook/pull/194), fusionnée dans `develop` au commit [`860d353`](https://github.com/karateseremange/AKS-Platform-ProjectBook/commit/860d3534c8ab16318b18576caff50c42efccf4f8).

## 10. Critères de clôture

ACCESS-002-07 est clôturé pour son intégration dans `develop` :

1. la réalisation applicative est intégrée au commit `6d7815a` ;
2. les validations **15/15** et **665/665** sont référencées ;
3. la restauration exacte de la recette est documentée ;
4. la documentation est intégrée au commit `860d353`.

La candidate finale V1.4.1 exacte `60cc727e` a réussi VERSION-001
**8/8**, ACCESS **15/15** et la campagne cumulative **665/665** après relecture
à 261/261 fichiers sans différence. La recette a ensuite été restaurée à
261/261 fichiers sans différence ; ses deux déploiements sont préservés et le
suffixe de production `wgNc37` est absent.

La PR applicative #136 a été fusionnée dans `develop` au commit `62c859a7`.
La PR documentaire #195 reste ouverte sans fusion. Toute publication vers
`main`, création de tag ou opération de production devra être explicitement
autorisée séparément.

## 11. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.3.2 | 2026-08-27 | Finalisation V1.4.1 fusionnée dans le `develop` applicatif par la PR #136 au commit `62c859a7`, contenu validé préservé ; PR documentaire #195 en revue, `main` et production inchangés |
| 0.3.1 | 2026-08-27 | Candidate finale V1.4.1 `60cc727e` relue à 261/261, validée à **8/8**, **15/15** et **665/665**, puis recette restaurée exactement ; PR de finalisation maintenues sans fusion, production inchangée |
| 0.3.0 | 2026-08-27 | PR Project Book #194 fusionnée dans `develop` au commit `860d353` ; ACCESS-002-07 intégré dans les deux `develop` et publication corrective V1.4.1 préparée sans `main`, tag, recette finale ni production |
| 0.2.0 | 2026-08-27 | PR applicative #135 fusionnée dans `develop` au commit `6d7815a` après validations **15/15** et **665/665** et restauration exacte de la recette ; PR Project Book #194 maintenue ouverte sans fusion, `main` et production inchangés |
| 0.1.1 | 2026-08-27 | Revue corrective et recette Apps Script isolée : portée globale `ADMINISTRATION` préservée à l’enregistrement, compatibilité de la suite cumulative maintenue, candidate `c2efda48` relue à 261/261 sans différence, validations **15/15** et **665/665** sans échec, puis restauration de recette relue à 261/261 sans différence ; PR toujours sans fusion et production inchangée |
| 0.1.0 | 2026-08-26 | Cadrage et réalisation autorisés sur deux branches dédiées : carte Administration, filtre, portée globale et tests structurels ; PR applicative #135 et Project Book #194 ouvertes vers `develop` sans fusion ni production ; cadrage en lecture seule d’INSCRIPTIONS-011 autorisé séparément, non élargi par cet incrément et sans implémentation engagée |
