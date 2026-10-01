# ADMIN-006 — D4-C LOG_READ Web App — préparation locale R4

Révision : `LOGREAD-webapp-browser-r4-preparation-1`.

## Périmètre terminé

Cette livraison réalise la préparation locale autorisée après validation de la conception. La préparation initiale n'a contacté ni GitHub en écriture ni Google. La publication GitHub suivante est autorisée séparément dans la branche de #226, sans fusion ; elle met à jour les trois documents directeurs. Aucune opération Google n'est autorisée.

Trois outils séparés : `Validate-LogRead-WebApp-Browser-R4.ps1`, `validate-logread-webapp-browser-r4.cjs`, `validate-logread-webapp-browser-r4.test.cjs`. Acorn 8.17.0 est inclus avec sa licence MIT ; aucune installation npm n'est nécessaire. Les tests utilisent les 279 fichiers réels de la candidate comme fixture, sous forme de JSON, sans les installer dans Apps Script.

La CLI accepte uniquement `LocalCheck`. Elle refuse `ReadOnly`, `Execute`, `Resume`, `Restore`, les cibles arbitraires, les paramètres d'autorisation et clasp. Aucun transport Google natif n'est fourni. Le moteur de séquencement/restauration reçoit des ports simulés dans les tests ; ses exports ne constituent pas une interface d'exécution distante. Le raccordement à Google, les permissions et la collecte actuelle seront préparés et revus dans un périmètre distinct.

## Références figées

| Référence | Valeur |
|---|---|
| Base de préparation Project Book #226 | `fe7a9a55c7f0fdb27ae85aec2c34208b568f0f82` |
| Application #146 | `6a7d86300d90c3f9a629e89a113dc7b0dd7e5f73` |
| Source candidate, 279 fichiers | `3931cc5b455b40fa7eb3dd76f8c7cb41d5acae3b5ad7674b5a67be7f286a465f` |
| Archive candidate opérateur | `19f0755b6a33aeff303f7c0c01e15e0ff1e7f467752e5a046e7288cb1d4a5594` |
| Manifeste candidat | `40ebf6b32fb6cba6f0b44ada9ce85fd023fee18f0599833b08e18f26336b0b38` |
| Source historique, 261 fichiers | `4ae80c6792c16f7efa006926ffafd4c202e3cb983b05b81ce63ea846c20110f3` |
| Manifeste historique | `f9a8681074723b58dca5d4e55a3c35e76165aa1675909f498d5e2c0e907f9ddf` |

La variante `...7674b5e67...` de l'empreinte candidate est une erreur de transcription. Les octets Git réels ont été relus localement et leur empreinte correspond à `...7674b5a67...`.

## Cause et stratégie

R1 supposait une visibilité immédiate de la version nouvellement créée ; R2 comparait aussi un digest incluant les suffixes locaux `.gs/.js` ; R3 conservait le HEAD historique tout en demandant dans l'éditeur des fonctions présentes seulement dans la candidate.

Le moteur R4 simulé distingue HEAD, version immuable et déploiement. Il relit 10 sans jamais créer de version, installe temporairement la candidate dans le HEAD, vérifie sa relecture et les cinq fonctions globales, exige leur présence dans l'éditeur avant AUDIT/ACCESS, puis bascule le seul déploiement existant après les prérequis. Il configure séparément les propriétés, active backend puis portail, puis réalise un parcours navigateur borné. Il ferme et restaure même en cas de réussite.

Le parseur vérifie les déclarations globales sans exécuter le source. Commentaires, chaînes, fonctions imbriquées, expressions de fonction, paramètres obligatoires et doublons sont refusés. Après installation, la relecture du HEAD et le constat opérateur dans l'éditeur seront tous deux nécessaires : le contrôle local ne prouve pas l'affichage dans Google.

## États et récupération

| Incident | Comportement préparé et testé hors ligne |
|---|---|
| Échec avant installation | Arrêt sans réparation ni mutation |
| Version 10 visible tardivement | Jusqu'à cinq lectures, attentes bornées ; aucune création |
| Version 10 différente | Arrêt avant push |
| Push partiel connu | Relecture, restauration des fichiers historiques |
| Fonction absente après installation | Aucun AUDIT/ACCESS ni passage vers 10 ; restauration du HEAD |
| Connexion/application non confirmée | Inspection opérateur de l'état et des sauvegardes ; aucune application répétée automatiquement |
| Action appliquée, confirmation perdue | Nettoyage à partir de l'état constaté |
| Action déjà annulée, sauvegarde absente | Confirmation du retour initial ; aucun appel aveugle exigeant cette sauvegarde |
| Configuration privée partielle | Fermeture portail puis backend, fin des requêtes, restauration des seules propriétés touchées |
| Nettoyage ACCESS | Recette LOG_READ conservée dans le HEAD jusqu'à résolution ; révision initiale vérifiée |
| Sauvegarde incomplète/conflit | `MANUAL_RECOVERY_BLOCKED`, preuves et fonctions conservées ; récupération exceptionnelle distincte |
| Nettoyage AUDIT bloqué | Pas de retrait prématuré des fonctions du HEAD |
| Bascule ou retour vers 8 incertain | Observation du déploiement exact ; aucune création |
| Nettoyage manuel bloqué | Retour vers 8 tenté indépendamment ; HEAD candidat conservé |
| Restauration HEAD interrompue | Reprise indépendante liée au journal, après nettoyage et retour vers 8 |
| Modification concurrente inconnue | Aucun écrasement ; `RESTORE_REQUIRED` |
| Essai navigateur échoué mais nettoyage réussi | `RESTORED_BROWSER_NOT_PASSED` ; aucune validation navigateur déduite |

Le journal est ordonné, lié à la candidate, à la sauvegarde et à la baseline, écrit avec `fsync` et chaîné par SHA-256. Il sépare `INTENT`, `DONE`, `BASELINE`, `OBSERVED` et `FAILURE`. Une intention non confirmée impose une vérification, jamais une hypothèse automatique. Une nouvelle campagne refuse un journal déjà commencé. Une reprise refuse une candidate, une sauvegarde ou une liaison modifiée.

Les événements AUDIT et preuves anti-rejeu sont conservés. Les recettes n'effectuent aucun effacement global ni remise à zéro des supports. Aucun secret, registre brut, identité complète ou URL backend n'est ajouté au journal R4.

## Contrats opérateur préparés — aucune exécution demandée ici

Projet pour les cinq fonctions : portail RECETTE `1quyIoxSMlxe6xpADPlxRxGikRF3OCTEid0-xhOHeSRZH0sU0AOeIRxs4`.

| Fonction | Résultat exigé, branche normale | Jeton PowerShell |
|---|---|---|
| `AKS_connectAudit001Recipe` | `ok=true`, `CONNECTED`, support `AKS Audit RECETTE`, sauvegarde vérifiée, première connexion | `AUDIT-CONNECTE` |
| `AKS_preflightAccess002LogReadRecipe` | RECETTE, suffixe `eIRxs4`, profil LOG_READ, `PREFLIGHT`, bootstrap, 0 compte avant / 1 proposé, aucune écriture | `PREFLIGHT-OK` |
| `AKS_applyAccess002LogReadRecipe` | RECETTE, profil LOG_READ, `APPLIED`, gestionnaire accepté, tiers refusé, sauvegarde vérifiée | `ACCESS-APPLIQUE` |
| `AKS_restoreAccess002LogReadRecipe` | RECETTE, profil LOG_READ, `RESTORED`, révision initiale, `exactRestore=true`, `backupRemoved=true` | `ACCESS-RESTAURE` |
| `AKS_disconnectAudit001Recipe` | `DISCONNECTED`, `exactRestore=true`, `backupRemoved=true` | `AUDIT-DECONNECTE` |

Chaque prompt affiche le projet complet, la fonction, les champs JSON attendus, le jeton et la conduite en cas d'absence/différence : ne pas confirmer, conserver le résultat et arrêter pour récupération. Aucune substitution historique n'est admise. La branche `alreadyRestored` est acceptée seulement avec révision initiale exacte et confirmation de l'absence de registre et de sauvegarde. Les prompts propriétés nomment projet, clé, état attendu et jeton ; l'URL backend doit être prise dans le rapport protégé D3-D3, jamais copiée dans le chat.

## Contrôle Windows à effectuer séparément

Prérequis : Windows PowerShell **5.1**, Node **20 ou ultérieur**, dossiers protégés package/R3 présents à leur emplacement initial. Aucun besoin de clasp, de réseau, de compte Google, d'Excel ou d'installation npm.

La livraison utilise un clone Git neuf de `docs/admin-006-d4c-preflight`, contrôlé contre le commit publié exact et un arbre propre. Le ZIP initial est écarté ; l'opérateur indique ne l'avoir ni téléchargé ni exécuté. La commande autonome sur une seule ligne est fournie après vérification du commit publié : elle crée un dossier neuf sous `D:\AKS\ADMIN-006-LOGREAD-WEBAPP-R4-LOCAL`, puis lance seulement `LocalCheck` avec les chemins protégés explicites. Elle ne dépend d'aucune variable d'une ancienne session.

Les règles `.gitattributes` imposent LF pour chaque fichier couvert par `r4-integrity.json`, y compris PowerShell, JSON, licence et transcript. Cela préserve les empreintes sous Windows avec `core.autocrlf=true`.

Ne pas modifier la politique d'exécution PowerShell pour contourner un refus. Conserver le message et le transmettre pour revue.

Le lanceur vérifie les empreintes des fichiers livrés avant les tests, exécute les tests hors ligne, puis relit le package et la session R3. Le lecteur Node n'écrit pas dans ces entrées. Le lanceur produit une nouvelle session de rapports locale sous `ReportRoot`, hors des dossiers protégés.

Résultat attendu : **59 tests, 59 réussites, 0 échec**, puis `LOGREAD_WEBAPP_R4_LOCAL_CHECK_ONLY`, 279/261 fichiers et les cinq fonctions listées. `currentGoogleStateVerified=false`, toutes les tentatives/autorisations Google à `false`, `remoteModeAvailable=false`. Le rapport porte aussi PowerShell, Node et le SHA-256 du transcript.

En cas d'échec, arrêter, conserver `tests.tap` et `localcheck.txt` s'ils existent, et transmettre le code d'erreur. Ne pas relancer R1/R2/R3, ne pas modifier les dossiers protégés, ne pas passer dans Apps Script.

## Limites de preuve et prochaines portes

Les 59 tests ont été exécutés sous Node 24.19.0 dans l'environnement local Linux. Le parcours complet utilise les vraies fonctions ACCESS/AUDIT et le vrai AccessService, avec ports Google simulés. La candidate est réelle ; le HEAD historique des tests et les rapports R3 des tests sont explicitement synthétiques. Les rapports opérateur protégés réels n'ont pas été disponibles ici.

Windows PowerShell 5.1 n'est pas disponible dans cet environnement : ni l'exécution Windows du lanceur ni le `LocalCheck` sur les dossiers `D:\AKS` ne sont revendiqués. Les empreintes et résultats Windows doivent être reçus et revus avant la phase suivante.

Le code applicatif et les outils R1/R2/R3 restent inchangés. La publication GitHub et la consignation documentaire constituent une étape distincte autorisée. Aucun merge, version, déploiement, propriété, ACCESS/AUDIT distant, navigateur, production ou D5 n'est autorisé. `R4-PREPARATION-REPORT.json` conserve les faits de la préparation initiale avant publication ; ses indicateurs GitHub décrivent cette étape historique uniquement.

Après le contrôle Windows : revoir le rapport, préparer séparément le lecteur actuel et le raccordement distant, puis définir les autorisations Google par opération et session. Une future autorisation devra aussi fixer le déploiement complet, les deux comptes, les scopes attendus, les appels maximaux, la fenêtre, l'opérateur de secours et toutes les restaurations. Aucun jeton Google n'est accordé ou réutilisé par cette livraison.
