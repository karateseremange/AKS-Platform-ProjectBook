# ACCESS-002-PRODUCTION-P2 — Candidate et Quality Gate

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P2 |
| **Titre** | Préparation de la candidate et du Quality Gate ACCESS |
| **Version** | 0.2.1 |
| **Statut** | Candidate validée en recette — clôture documentaire P2 en revue, production interdite |
| **Nature** | Spécification de release et plan de validation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-21 |
| **Candidate proposée** | `1.4.0-rc.1` |

---

## 1. Objet

P2 prépare une candidate cohérente depuis l’intégralité de `develop` et définit son Quality Gate. Il ne constitue aucune autorisation de fusion vers `main`, de création de tag, de déploiement Apps Script, de consultation de configuration sensible ou de mutation de production.

## 2. Références vérifiées au cadrage

| Dépôt | `main` | `develop` | Écart `main..develop` |
|---|---|---|---|
| AKS-Platform | `e8fb0fc` | `ab52dc6` | 209 commits, 82 fichiers, 13 601 ajouts et 270 suppressions |
| Project Book | `647ae45` | `276973e` | 339 commits, 27 fichiers, 6 914 ajouts et 83 suppressions |

Les deux branches `develop` sont en avance et sans retard. Une sélection de quelques commits ACCESS est exclue : ACCESS dépend d’AUDIT et des évolutions transverses cumulatives.

La référence Git de `main` ne démontre pas encore la version réellement exécutée par le déploiement Apps Script public.

## 3. Périmètre fonctionnel de la candidate

La candidate inclut notamment :

- ACCESS et l’administration explicite des habilitations ;
- la migration de Paramétrage, Journaux et Analytics vers ACCESS ;
- le Portail AKS, « Mes accès » et « Comptes et accès » ;
- AUDIT persistant multi-environnement ;
- les évolutions Présences intégrées après `v1.2.0` ;
- les fondations internes INSCRIPTIONS-007 à INSCRIPTIONS-010 ;
- les tests et recettes correspondants.

Les fondations Inscriptions restent sans route `doGet()` dédiée, non présentées comme fonctionnalité publiée et fermées par leurs contrôles de recette, d’accès et d’audit.

## 4. Décisions P2 validées

### P2.1 — Candidate provisoire

La version de travail est `1.4.0-rc.1`. `V1.4.0` ne devient définitive qu’après rapprochement de `main`, du projet Apps Script, du déploiement, de sa version et de son URL publics.

### P2.2 — Base unique

La branche applicative de candidate part du `develop` validé. Aucun cherry-pick ni retrait opportuniste n’est autorisé sans nouvelle analyse de dépendances.

### P2.3 — Métadonnées de version

La candidate aligne `AKS.Version`, l’éventuel marqueur historique `AKS.version`, le README et le changelog. Le build final n’est pas inventé : une valeur RC explicite et traçable est utilisée jusqu’au Quality Gate.

### P2.4 — Documentation de release

Une note `V1.4.0` est créée au statut « candidate — non publiée ». Elle distingue clairement le contenu intégré, le contenu activé et les opérations de production encore interdites.

### P2.5 — Périmètre complet

La note de candidate consigne l’écart complet de 82 fichiers et indique explicitement que les fondations Inscriptions restent internes et non exposées.

### P2.6 — Quality Gate transverse

Le Quality Gate couvre au minimum ACCESS, AUDIT, Questionnaire santé, Analytics, Présences, Paramétrage, Journaux et la fermeture d’Inscriptions.

### P2.7 — Validation en recette

Toutes les suites sont exécutées sur la tête exacte de candidate dans l’environnement Apps Script de recette. Les résultats préparatoires ne remplacent jamais cette campagne finale.

### P2.8 — Absence de publication

P2 ne crée aucune PR vers `main`, aucun tag, aucune version Apps Script et aucun déploiement.

### P2.9 — Production inchangée

Aucune ressource, propriété, identité, donnée, permission, URL ou configuration de production n’est consultée ou modifiée pendant la préparation de la candidate.

### P2.10 — Gel différé

Le numéro stable, le build final et le plan exact de retour arrière sont gelés uniquement après l’inventaire réel de production, soumis à une autorisation distincte.

## 5. Checklist du Quality Gate

| Domaine | Résultat P2 | Preuve ou limite |
|---|---|---|
| Version | Validé en recette | VERSION-001 **8/8** ; marqueurs `1.4.0-rc.1` alignés ; note [V1.4.0](../../releases/V1.4.0.md) non publiée |
| Suite cumulative | Validé en recette | tête exacte `b13fc20` : **661/661**, 0 échec |
| ACCESS | Validé en recette | contrôles inclus dans la campagne cumulative ; aucun amorçage réel |
| AUDIT | Validé en recette | contrats RECETTE/PRODUCTION testés par injection ; aucune fonction de production appelée |
| Questionnaire santé | Validé en recette, contrôle public différé | tests cumulatifs conformes ; URL publique réelle non consultée |
| Analytics | Validé en recette, intégrations réelles différées | contrôles serveur inclus ; aucune publication Drive exécutée |
| Présences | Validé en recette | routes et contrôles inclus dans la campagne cumulative |
| Paramétrage | Validé en recette | lecture, écriture et reset séparés dans les tests ; aucune propriété réelle modifiée |
| Journaux | Validé en recette | `LOG_READ` et contrôles administratifs inclus ; aucune donnée de production consultée |
| Inscriptions | Validé en recette et statiquement | suites cumulatives conformes ; aucune route Web dédiée ni écriture réelle |
| Manifeste | Vérifié statiquement | fuseau `Europe/Paris` ; manifeste inchangé par la candidate P2 |
| Retour arrière | Partiel, à finaliser après inventaire | références Git connues ; version, déploiement, URL et support AUDIT réels encore interdits d’inventaire |

Les intégrations Google réelles susceptibles d’écrire, publier, envoyer ou modifier une ressource restent exclues tant qu’elles ne disposent pas de leur autorisation propre.

## 6. Livrables P2

1. branche applicative de candidate depuis `develop` ;
2. métadonnées RC cohérentes ;
3. README et changelog actualisés ;
4. note documentaire `V1.4.0` non publiée ;
5. checklist Quality Gate renseignée ;
6. validations ciblées et cumulative dans Apps Script de recette ;
7. revue finale de la candidate ;
8. clôture documentaire de P2 sur `develop`.

## 7. Critères de sortie

P2 est terminé lorsque la candidate est reproductible et validée en recette, sans défaut bloquant ou critique, avec documentation alignée et sans aucune opération de production.

La suite reste P3/P4 : inventaire autorisé de la production puis Quality Gate final rapproché. Aucune fusion vers `main` n’est implicite.

## 8. Réalisation et validation

La [PR applicative #126](https://github.com/karateseremange/AKS-Platform/pull/126) a intégré la candidate `1.4.0-rc.1` dans `develop` au commit [`b13fc20`](https://github.com/karateseremange/AKS-Platform/commit/b13fc202300af6f7ce0c99b65403fa83117ed34b).

Cette tête exacte a été synchronisée dans le projet Apps Script de recette. Les contrôles ont réussi à **8/8** pour VERSION-001 et **661/661** pour la campagne cumulative, avec **0 échec**.

La recette confirme la cohérence technique de la candidate. Elle ne constitue ni un inventaire du déploiement public, ni une validation du Quality Gate de production, ni une autorisation de fusion vers `main`, de tag ou de déploiement. Aucune ressource ni configuration de production n’a été consultée ou modifiée.

## 9. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.2.1 | 2026-08-21 | Note V1.4.0 candidate ajoutée, Quality Gate P2 renseigné domaine par domaine et statut borné à la clôture documentaire en revue |
| 0.2.0 | 2026-08-21 | PR applicative #126 fusionnée dans `develop` au commit `b13fc20` ; candidate exacte `1.4.0-rc.1` validée en recette à **8/8** VERSION-001 et **661/661** cumulés, sans opération de production |
| 0.1.0 | 2026-08-21 | Décisions P2.1 à P2.10 validées : candidate complète `1.4.0-rc.1`, synchronisation des versions, note non publiée, Quality Gate transverse, recette obligatoire et production inchangée |
