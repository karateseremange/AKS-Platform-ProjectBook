# ACCESS-002-PRODUCTION-P3 — Inventaire de production en lecture seule

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P3 |
| **Titre** | Inventaire technique préalable de la production |
| **Version** | 0.1.0 |
| **Statut** | Cadrage validé — inventaire réel non autorisé |
| **Nature** | Protocole d’exploitation sans mutation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-21 |

## 1. Objet

P3 définit l’inventaire nécessaire avant toute publication ou mutation de production. Il doit identifier et sauvegarder l’état Apps Script actuellement publié, permettre son rapprochement avec Git et préparer un retour arrière reproductible.

La validation du présent document n’autorise pas l’inventaire réel. Une autorisation explicite distincte reste obligatoire avant toute lecture du projet Apps Script, de ses déploiements, versions, URL ou paramètres de production.

## 2. Décisions I1 à I12 validées

### I1 — Finalité strictement bornée

L’inventaire identifie et sauvegarde :

- le projet Apps Script de production ;
- le code source actuellement présent ;
- le déploiement Web public ;
- la version Apps Script associée ;
- l’URL publique ;
- les paramètres non secrets du déploiement ;
- la référence Git pouvant correspondre à cet état ;
- les composants nécessaires au retour arrière.

Il ne teste pas fonctionnellement l’application et ne modifie aucune configuration.

### I2 — Autorisation distincte

L’autorisation d’inventaire couvrira uniquement les lectures expressément listées en I5 et une sauvegarde locale isolée. Elle n’autorisera aucun `clasp push`, `clasp deploy`, création de version, changement de propriété, changement d’identité ou permission, appel d’écriture, amorçage ACCESS, test AUDIT ou fusion vers `main`.

### I3 — Identification préalable

Avant toute commande distante, l’opérateur confirme la source fiable permettant d’identifier le projet de production : console Apps Script, URL d’édition connue ou métadonnée du déploiement existant.

Le projet de recette dont l’identifiant se termine par `eIRxs4` est exclu. Si le projet présumé de production correspond à ce projet, l’opération s’arrête immédiatement.

### I4 — Répertoire local isolé

L’inventaire s’exécute dans un nouveau répertoire temporaire hors du dépôt applicatif actif. Le `.clasp.json` de recette n’est ni remplacé ni réutilisé. La copie de production n’est jamais mélangée à la candidate et aucun identifiant sensible n’est ajouté à Git.

### I5 — Lectures autorisables

Après autorisation spécifique, le protocole pourra uniquement :

1. lire les métadonnées du projet Apps Script ;
2. lister ses déploiements ;
3. lister ses versions ;
4. récupérer une copie locale exacte du code actuellement présent ;
5. relever le déploiement Web actif et sa version ;
6. relever l’URL publique depuis les métadonnées sans l’appeler ;
7. relever les paramètres d’exécution et d’accès du déploiement ;
8. calculer localement les empreintes des fichiers récupérés ;
9. comparer la copie à `main`, aux tags publiés et à la candidate.

Les commandes finales seront présentées avant exécution et revues pour démontrer leur absence d’écriture.

### I6 — Sauvegarde formelle

La sauvegarde restreinte contient :

- la copie exacte des fichiers Apps Script et du manifeste ;
- les identifiants minimisés du projet et du déploiement ;
- le numéro de version ;
- l’URL publique dans une preuve protégée si elle est confidentielle ;
- les paramètres « exécuter en tant que » et « utilisateurs autorisés » ;
- la date et l’identité de l’opérateur ;
- l’empreinte SHA-256 de chaque fichier ;
- le résultat du rapprochement Git.

Elle n’est ni supprimée ni remplacée avant la confirmation finale de production.

### I7 — Rapprochement Git

| Référence | Contrôle attendu |
|---|---|
| `main` applicatif actuel | correspondance avec le code récupéré |
| tag `v1.2.0` | correspondance avec la dernière version applicative documentée |
| `develop` à `b13fc20` | écart complet avec la candidate `1.4.0-rc.1` |
| futur commit publié | référence exacte à déployer après autorisation |

`V1.4.0` ne devient pas définitive si l’état public réel reste indéterminé.

### I8 — Propriétés et ressources métier exclues

L’inventaire initial ne lit pas les valeurs des propriétés Script, le contenu des classeurs, le registre ACCESS, les preuves AUDIT, les comptes ou habilitations, ni les données Analytics, Présences, Inscriptions ou Drive liées.

Leur sauvegarde ou leur contrôle exigera une nouvelle autorisation ciblée.

### I9 — URL publique non exécutée

L’URL publique est relevée depuis les métadonnées du déploiement mais n’est pas ouverte. Le contrôle du Questionnaire santé public et des routes administratives relève d’une étape fonctionnelle ultérieure autorisée séparément.

### I10 — Conditions d’arrêt

L’inventaire s’arrête immédiatement si :

- le projet de production reste ambigu ou correspond à la recette ;
- plusieurs déploiements publics sont actifs sans référence claire ;
- la version déployée ne peut pas être déterminée ;
- une commande implique ou peut impliquer une écriture ;
- une donnée sensible apparaît dans une sortie destinée à Git ;
- la copie locale ne peut pas être vérifiée ;
- l’accès nécessite d’étendre le périmètre autorisé.

### I11 — Restitution minimisée

Le Project Book reçoit uniquement les suffixes minimisés des identifiants, le numéro de version, les empreintes, la référence Git rapprochée ou la mention « aucune correspondance exacte », les paramètres non secrets du déploiement, les composants nécessaires au retour arrière et les anomalies constatées.

Les identifiants complets, URL restreintes et valeurs sensibles restent dans la preuve d’exploitation protégée.

### I12 — Critères de sortie

P3 est concluant uniquement lorsque sont connus exactement :

- le code actuellement exécuté ;
- la méthode permettant de revenir à cet état ;
- l’URL à conserver ;
- la pertinence du numéro `V1.4.0` ;
- les éléments à sauvegarder avant publication ;
- les autorisations réelles encore nécessaires.

## 3. Séquencement

1. intégrer le présent cadrage dans `develop` du Project Book ;
2. demander une autorisation explicite d’inventaire en lecture seule ;
3. présenter et vérifier les commandes exactes ;
4. exécuter les seules lectures autorisées ;
5. appliquer toute condition d’arrêt sans contournement ;
6. produire la restitution minimisée ;
7. documenter les résultats dans une nouvelle PR ;
8. soumettre séparément la suite du Quality Gate.

## 4. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-21 | Décisions I1 à I12 validées : inventaire Apps Script borné en lecture seule, sauvegarde isolée, rapprochement Git, exclusion des propriétés et données métier, URL non exécutée et autorisation réelle différée |

