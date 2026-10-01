# R4 — correction locale du contrat d'archive

Base publiée : `aab570ae594995370dfde197b54b6a0d4c0c68a4`. Étape initiale : correction et vérification locales uniquement. Publication GitHub ensuite autorisée distinctement ; nouveau Windows et Google non inclus. Le rapport JSON conserve les faits de la correction locale avant publication.

L'échec opérateur `ARCHIVE_TYPE_INVALID` est reproduit avant correction par le test de lecture du package. Le lecteur acceptait deux formats mais exigeait le champ D4B `type` dans les deux ; les tests masquaient le défaut par deux archives D4B.

| Contrat relu | Producteur | Conclusion locale |
|---|---|---|
| Candidate | `prepare-logread-webapp.cjs` appelle `prepare-d4b.cjs:archive` | D4B avec type exact ; test appelle le producteur local |
| Historique | `check-d4c.cjs` ; copie exacte par `prepare-logread-webapp.cjs` | D4C, rôle portail, sans type ; fixture reproduit ce schéma |
| Rapport package | `prepare-logread-webapp.cjs` | Champs utilisés par loadLocal présents dans le producteur |
| Arbres matérialisés | `prepare-logread-webapp.cjs` | `candidate/src` et `historical-rollback/src` concordants |
| Liaison R3 | `validate-logread-webapp-browser.cjs:binding` | Révision, candidate, packageRun, hashes R2 concordants |
| Résultats et événements R3 | Producteur R3 : UUID, event/at et failure=null au statut restauré | Regex compatibles ; fixture UUID ; événements requis émis par le producteur |
| Empreintes et fins de ligne | `r4-integrity.json`, `.gitattributes` | Contrôles conservés, producteur D4B dépendant désormais épinglé |

Seule la fonction archive du préparateur D4B est appelée dans les tests pour écrire un fichier temporaire local. Aucun main de campagne R1/R2/R3 ni transport distant n'est exécuté. La revue du producteur R3 est statique.

La correction exige explicitement D4B pour candidate-bundle et D4C pour historical-c1-bundle. Le rôle D4C doit être portail. L'absence de type D4C est acceptée ; une déclaration incohérente est refusée. D4B exige toujours type. Contrôles de hash brut, contenu canonique base64/UTF-8, SHA de chaque fichier, noms/extensions, collisions, inventaire, source et manifeste maintenus.

Tests : 71/71 Node hors ligne. Régression exacte avant/après, douze nouveaux refus/acceptation de schéma, lecture complète sans modification des entrées temporaires. Candidate réelle 279 ; historique 261 et rapports R3 synthétiques. Les preuves protégées réelles et PowerShell 5.1 ne sont pas disponibles ici. Aucun nouveau résultat Windows conforme n'est revendiqué.

Le lanceur PowerShell n'est pas modifié. Avec ErrorActionPreference=Stop, son affichage NativeCommandError représente l'erreur Node ; il peut interrompre avant écriture de localcheck.txt. Le message opérateur reste une preuve d'échec, jamais une preuve de réussite. Ce comportement ne nécessite pas de contournement pour corriger le contrat d'archive.

Restaurations : abandon du delta local pour revenir à la base publiée ; aucun dossier Windows protégé touché, aucun Google touché. Le transcript et rapport initiaux restent historiques et séparés des nouveaux.
