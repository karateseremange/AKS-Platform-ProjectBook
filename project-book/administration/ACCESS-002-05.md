# ACCESS-002-05 — Portail privé et Mes accès

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-05 |
| **Titre** | Portail privé personnalisé et consultation de ses accès |
| **Version** | 0.3.1 |
| **Statut** | Lot 2 validé — lot 3 prêt à démarrer |
| **Nature** | Spécification d’incrément fonctionnel et technique |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-13 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-05` transforme le Centre de pilotage administratif historique en portail privé commun d’AKS Platform. Son contenu dépend des habilitations effectives de l’identité Google active et non d’un statut général d’administrateur.

L’incrément ajoute également « Mes accès », une consultation personnelle et minimisée des seuls droits actuellement effectifs. Il ne modifie aucune habilitation et ne remplace pas les contrôles d’autorisation propres à chaque route.

## 2. Point de départ

`ACCESS-002-04` est clôturé en version 1.0.0 au commit applicatif final `9d8e57f`. Le registre `access/1.1`, la fiche multi-rôle, les habilitations indépendantes, l’écriture atomique et l’historique AUDIT minimisé sont validés à **586/586 tests**. La recette a restauré exactement ACCESS et AUDIT.

Le Centre de pilotage `?app=admin` reste toutefois protégé globalement par `AKS.Admin.Access`. Sa navigation mélange encore destinations administratives historiques et modules. La migration définitive de ces routes et le retrait du mécanisme historique appartiennent à `ACCESS-002-06`.

## 3. Décisions validées

Le Product Owner a validé le 13 août 2026 les décisions suivantes :

1. `?app=admin` reste compatible mais devient le **Portail AKS** ;
2. le portail est accessible à tout compte actif possédant au moins une habilitation effective ;
3. Google authentifie et le registre ACCESS décide des destinations visibles ;
4. les rôles sont descriptifs et n’ouvrent aucun module ;
5. un module non habilité n’est ni affiché ni nommé ;
6. les destinations administratives historiques restent réservées aux administrateurs historiques jusqu’à `ACCESS-002-06` ;
7. « Mes accès » expose uniquement les habilitations actuellement effectives du compte connecté ;
8. un compte actif sans habilitation reçoit une page neutre sans détail technique ni catalogue privé ;
9. chaque route et chaque appel serveur réautorise l’identité ;
10. l’URL existante reste stable afin d’éviter un déploiement motivé uniquement par un changement de lien.

## 4. Accès au portail

L’accès au portail suit la séquence suivante :

1. résolution côté serveur de l’identité Google active ;
2. lecture du registre ACCESS ;
3. recherche exacte du compte normalisé ;
4. vérification du statut `ACTIVE` ;
5. calcul des habilitations effectives à la date serveur ;
6. construction d’une projection minimisée des seules destinations autorisées.

Un compte inconnu ou inactif est refusé fermé. Un compte actif sans habilitation n’obtient aucune destination mais reçoit une page fonctionnelle neutre.

Le mécanisme historique `AKS.Admin.Access` ne confère aucun module métier. Il sert uniquement, pendant la transition, à conserver l’accès aux destinations administratives qui ne possèdent pas encore leur capacité ACCESS définitive.

## 5. Navigation personnalisée

La navigation est construite côté serveur depuis une table déclarative fermée. Chaque destination déclare au minimum :

- un identifiant stable ;
- un libellé fonctionnel ;
- une route ;
- une famille d’affichage ;
- la ou les capacités nécessaires ;
- son état de disponibilité ;
- son éventuelle condition transitoire d’administration historique.

La projection ne retourne que les destinations effectivement autorisées. Le navigateur ne reçoit ni destination refusée, ni motif interne, ni catalogue complet des modules privés.

Exemples attendus :

| Profil effectif | Destinations possibles |
|---|---|
| Présences uniquement | Saisie des présences et Mes accès |
| Analytics lecture | Analytics autorisé et Mes accès |
| Inscriptions | Fonctions Inscriptions correspondant aux capacités et Mes accès |
| `ACCESS_MANAGE` | Comptes et accès et Mes accès |
| Administrateur historique | Destinations historiques encore compatibles et Mes accès selon son registre |
| Compte actif sans habilitation | Aucune destination privée ; page neutre |

Les exemples n’introduisent aucun héritage depuis les rôles.

## 6. Mes accès

« Mes accès » est une projection personnelle en lecture seule. Elle expose :

- l’adresse Google active ;
- les rôles descriptifs du compte ;
- les habilitations actuellement effectives ;
- pour chaque habilitation : module, capacités, saison, section, cours et période applicable ;
- un état vide fonctionnel lorsque le compte actif ne possède aucun accès effectif.

Elle n’expose jamais :

- le registre complet ;
- les autres comptes ;
- les habilitations futures ou expirées dans ce premier incrément ;
- les identifiants de corrélation et métadonnées AUDIT ;
- les mécanismes d’amorçage ou d’administration historique ;
- une commande de modification.

L’identité cible n’est pas fournie par le navigateur : le serveur utilise toujours l’identité Google active.

## 7. Refus et messages fonctionnels

Les messages utilisateur restent génériques :

- compte actif sans habilitation : « Aucun accès n’est actuellement attribué à votre compte. » ;
- compte inconnu, inactif ou accès direct refusé : message d’accès non autorisé sans détail technique ;
- indisponibilité technique : message temporaire générique.

Les codes internes, capacités absentes, routes cachées, comptes connus et détails du registre ne sont jamais révélés.

## 8. Sécurité

- toute projection est calculée côté serveur ;
- toute route réautorise indépendamment l’identité active ;
- la visibilité d’une carte ne constitue jamais une autorisation ;
- les appels directs vers une route non autorisée restent refusés ;
- aucune adresse fournie par le navigateur ne permet de consulter « Mes accès » d’un tiers ;
- les objets retournés sont minimisés, copiés défensivement et profondément immuables ;
- l’évaluation temporelle utilise la date serveur ;
- les versions de schéma inconnues sont refusées fermées ;
- aucune exception `SUPER_ADMIN` ou liée à une adresse n’est ajoutée.

## 9. Transition vers ACCESS-002-06

Pendant `ACCESS-002-05`, Paramétrage, Journaux, Audit, Maintenance et les autres routes administratives non encore migrées conservent leur autorisation historique existante. Elles peuvent apparaître dans le portail uniquement si cette autorisation historique est réellement satisfaite.

`ACCESS-002-06` attribuera leurs capacités explicites, migrera chaque contrôle serveur puis retirera de manière contrôlée `AKS.Admin.Access`. ACCESS-002-05 ne doit ni anticiper ce retrait ni transformer l’autorisation historique en capacité implicite.

## 10. Contrats serveur cibles

Le socle exposera au minimum :

1. `getPortalModel()` — identité minimisée, destinations autorisées et état fonctionnel ;
2. `getMyAccess()` — rôles et habilitations effectives de l’identité active ;
3. une fabrique de navigation recevant uniquement des décisions d’autorisation calculées côté serveur.

Aucun contrat ne reçoit un identifiant de compte cible pour « Mes accès ».

## 11. Scénarios minimaux

| ID | Scénario | Résultat attendu |
|---|---|---|
| A05-01 | Compte Présences | Seules les destinations Présences autorisées sont visibles |
| A05-02 | Compte Analytics lecture | Analytics autorisé sans Présences implicite |
| A05-03 | Compte Inscriptions | Seules les fonctions correspondant aux capacités effectives sont visibles |
| A05-04 | Gestionnaire ACCESS | « Comptes et accès » visible |
| A05-05 | Rôle sans habilitation | Aucun module ouvert implicitement |
| A05-06 | Compte actif sans habilitation | Page neutre sans catalogue privé |
| A05-07 | Compte inconnu ou inactif | Refus fermé |
| A05-08 | Route directe non autorisée | Refus serveur malgré URL connue |
| A05-09 | Mes accès | Identité active uniquement et projection minimisée |
| A05-10 | Identité tierce injectée | Ignorée ou refusée sans fuite |
| A05-11 | Habilitation future ou expirée | Absente de la projection effective |
| A05-12 | Administrateur historique | Destinations transitoires uniquement, sans module implicite |
| A05-13 | Immutabilité | Modèle profondément immuable |
| A05-14 | Suite cumulative | Non-régression complète |

## 12. Découpage de réalisation

La réalisation est découpée en quatre lots :

1. **projection personnelle et navigation autorisée — validé** — PR applicative #112 fusionnée au commit `6d1ab91`, 250 fichiers synchronisés et campagne cumulative **594/594** ;
2. **Mes accès — validé** — PR applicative #113 fusionnée au commit `2396bb0`, 255 fichiers synchronisés et campagne cumulative **602/602** ;
3. **Portail AKS** — transformation du Centre de pilotage, états vide/refus et compatibilité `?app=admin` ;
4. **recette multi-profils et clôture** — contrôles directs, campagne cumulative, recette réversible si une donnée temporaire est nécessaire et documentation finale.

Chaque lot est intégré, testé et documenté séparément. Aucune donnée réelle n’est modifiée pendant les trois premiers lots.

## 13. Hors périmètre

Sont exclus :

- modification des habilitations depuis « Mes accès » ;
- consultation des accès d’autrui hors `ACCESS_MANAGE` ;
- migration définitive des routes administratives ;
- retrait de `AKS.Admin.Access` ;
- ajout d’un rôle `SUPER_ADMIN` ;
- notifications e-mail ;
- exports et reporting ;
- duplication inter-saison ;
- modifications groupées ;
- modèles d’habilitations ;
- production, `main` et nouveau déploiement sans autorisation distincte.

## 14. Critères d’acceptation

`ACCESS-002-05` est terminé lorsque :

1. le portail n’est plus réservé globalement aux administrateurs historiques ;
2. chaque compte actif ne voit que ses destinations autorisées ;
3. aucun rôle n’ouvre implicitement un module ;
4. les routes directes restent protégées côté serveur ;
5. « Mes accès » utilise exclusivement l’identité active ;
6. seules les habilitations effectives sont exposées ;
7. un compte sans habilitation reçoit un état neutre sans fuite ;
8. les destinations administratives historiques restent bornées jusqu’à ACCESS-002-06 ;
9. la compatibilité de l’URL `?app=admin` est préservée ;
10. les modèles retournés sont minimisés et immuables ;
11. la suite cumulative et la recette multi-profils sont concluantes ;
12. le Project Book reflète le comportement livré.

## 15. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.3.1 | 2026-08-13 | Lot 2 validé : PR applicative #113 fusionnée au commit `2396bb0`, dépôt propre, 255 fichiers synchronisés et campagne cumulative **602/602**, sans donnée réelle modifiée || 0.3.0 | 2026-08-13 | Lot 2 publié dans la PR applicative brouillon #113 : page Mes accès personnelle, effective et en lecture seule, sans identité cible, avec états vide/refus génériques ; 8/8 tests ciblés et cible cumulative **602**, sans donnée réelle || 0.2.1 | 2026-08-13 | Lot 1 validé : PR applicative #112 fusionnée au commit `6d1ab91`, dépôt propre, 250 fichiers synchronisés et campagne cumulative **594/594**, sans interface ni donnée réelle || 0.2.0 | 2026-08-13 | Lot 1 publié dans la PR applicative brouillon #112 : projection personnelle effective, navigation fermée, cloisonnement Présences/Analytics/ACCESS, historique transitoire borné et état neutre ; 8/8 tests ciblés, cible cumulative **594**, sans interface ni donnée réelle || 0.1.0 | 2026-08-13 | Cadrage validé : portail personnalisé selon habilitations effectives, Mes accès personnel et minimisé, état neutre sans habilitation, sécurité serveur, compatibilité URL et transition bornée vers ACCESS-002-06 |
