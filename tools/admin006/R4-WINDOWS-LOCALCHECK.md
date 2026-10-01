# ADMIN-006 — LocalCheck Windows R4 conforme sur retour opérateur

## Source et portée de la preuve

Le 1er octobre 2026, l'opérateur a transmis dans la conversation le journal de clonage, le JSON final et `R4 LocalCheck completed. Remote execution remains unavailable.`. Le JSON est transcrit sans ajout de champs dans [R4-WINDOWS-LOCALCHECK-REPORT.json](R4-WINDOWS-LOCALCHECK-REPORT.json). Il ne s'agit pas d'une lecture indépendante des fichiers Windows ni de Google.

Commit exécuté : `8b2d3f568b6183e6c68fce0d8534aa2a36a49659`. Clone : `D:\AKS\ADMIN-006-LOGREAD-WEBAPP-R4-LOCAL\projectbook-0a5002b9bed94ce1af7a18c606cd1260`. La commande autorisée exigeait commit exact et arbre propre avant lancement. Le lanceur a atteint le statut final attendu.

| Contrôle | Résultat rapporté |
|---|---|
| Statut | `LOGREAD_WEBAPP_R4_LOCAL_CHECK_ONLY` |
| Candidate / historique | 279 / 261 fichiers |
| Fonctions opérateur | Les cinq fonctions exactes vérifiées localement |
| Preuves locales | `localEvidenceVerified=true` |
| PowerShell / Node | `5.1.26100.9444` / `v24.18.0` |
| Google actuel vérifié | `false` |
| Lecture / écriture Google | `false` / `false` |
| Autorisations distantes et mode distant | Toutes `false` |

## Empreintes transmises

| Preuve | SHA-256 |
|---|---|
| Source candidate | `3931cc5b455b40fa7eb3dd76f8c7cb41d5acae3b5ad7674b5a67be7f286a465f` |
| Rapport package | `5f79f2cb66c4d1a28f5e6ae98e2a4fd88c73dd5d37472b16664cecc52986f21e` |
| Résultat final R3 | `24982c3f4462bbc44274f433ff3c30b2b79dfcc3ad088f6f632234224a3ef38a` |
| Liaison R3 | `7dc11e90d32924b214e1556d73afb9f215e612828f0b9d66364040be5b7cfbae` |
| Transcript Windows | `3f6bee4414e3c68b0c2b07a81660ca83e6bfca3b1a0bdb5b7ea858d6979a89be` |

Rapports à conserver : `D:\AKS\ADMIN-006-LOGREAD-WEBAPP-R4-LOCALCHECK\r4-local-20261001-233930-8071b29a5f0b4c8e8e905bc6faad48dd`.

Le transcript Windows n'a pas été transmis ni relu indépendamment. La suite préparée comporte 71 tests ; la complétion du lanceur indique que sa commande de tests a réussi, mais le JSON fourni n'inclut pas le décompte détaillé. Le résultat local Linux 71/71 reste une preuve distincte. Aucun nouveau hash n'est présenté comme issu d'une lecture Windows effectuée par l'assistant.

## État et portes suivantes

L'échec initial `ARCHIVE_TYPE_INVALID` reste conservé dans l'historique ; le nouvel essai autorisé valide localement le lecteur corrigé sur les preuves protégées réelles du poste, selon le retour opérateur. Les fonctions sont présentes dans la candidate locale ; leur présence dans le HEAD Apps Script et dans l'éditeur n'est pas démontrée ici.

L'état Google de référence reste celui des rapports antérieurs : HEAD historique 261, `OMcZ9gl@8`, version 10 conservée et vérifiée à l'époque, AUDIT déconnecté, ACCESS inchangé, propriétés privées inactives, backend inchangé. Aucune relecture actuelle Google ne s'ajoute.

Cette consignation documentaire a reçu une autorisation distincte après le LocalCheck. Aucun outil, manifeste d'intégrité ou fixture n'est modifié. R1/R2/R3 restent interdites. Le raccordement natif distant et le lecteur de l'état actuel restent à préparer et à revoir dans un périmètre séparé ; aucune autorisation Google, fusion, production ou D5 ne découle de ce résultat.
