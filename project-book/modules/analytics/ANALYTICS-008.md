# ANALYTICS-008 — Bilan d’implémentation et procès-verbal de recette

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-008 |
| **Version** | 1.0.1 |
| **Statut** | Validé |
| **Nature** | Bilan d’implémentation et procès-verbal de recette |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | V1.2.0 |

---

## 1. Objet

Le présent document clôture l’incrément applicatif AKS Analytics et consigne les preuves de sa recette fonctionnelle.

Il complète le corpus normatif `ANALYTICS-001` à `ANALYTICS-007` sans modifier les règles de calcul qui y sont définies. Il décrit le périmètre effectivement implémenté et validé, les conditions de recette, les résultats observés, les corrections apportées et la décision finale du Product Owner.

---

## 2. Périmètre implémenté

L’incrément validé couvre :

- la lecture et le diagnostic des sources Analytics configurées ;
- la distinction entre source conforme, conforme mais vide, exploitable et en erreur ;
- le périmètre saisonnier de quatre cours pour 2025-2026 ;
- le périmètre saisonnier de cinq cours pour 2026-2027, avec réintégration du cours féminin ;
- la génération des rapports par cours ;
- la génération d’une synthèse globale ;
- la prévisualisation des rapports avant toute publication ;
- la publication contrôlée des rapports PDF dans Google Drive ;
- la traçabilité des opérations de préparation et de publication ;
- la restauration de la configuration officielle après recette.

Aucun score AKS n’est calculé ou affiché. Les indicateurs non validés restent non calculables conformément à `ANALYTICS-007`.

---

## 3. Périmètre saisonnier validé

| Saison | Cours pris en charge | Rapports de cours | Synthèse globale | Total attendu |
|---|---:|---:|---:|---:|
| 2025-2026 | Baby, Enfant 1, Enfant 2, Ado/Adulte | 4 | 1 | 5 |
| 2026-2027 | Baby, Enfant 1, Enfant 2, Ado/Adulte, Cours féminin | 5 | 1 | 6 |

Le cours féminin demeure totalement exclu des calculs 2025-2026. Il est pris en charge à partir de 2026-2027.

---

## 4. Diagnostic des sources

Le diagnostic classe chaque source dans un état explicite :

| État | Signification | Effet |
|---|---|---|
| Conforme et exploitable | Schéma valide et données suffisantes | Prévisualisation autorisée |
| Conforme mais vide | Schéma valide sans présence exploitable | Prévisualisation bloquée pour le périmètre concerné |
| En erreur | Contrat, accès ou données invalides | Source signalée et non exploitée |
| Hors périmètre | Source non autorisée pour la saison | Source exclue des calculs |

La recette sur données fictives 2026-2027 a produit :

- 5 sources conformes ;
- 5 sources exploitables ;
- 0 source vide ;
- 0 source en erreur ;
- un état global `PRÊT`.

Après restauration des identifiants officiels, le contrôle final a produit :

- 5 sources conformes ;
- 5 sources conformes mais vides ;
- 0 source exploitable ;
- 0 source en erreur ;
- un état global `BLOQUÉ`, attendu en l’absence de présences réelles.

---

## 5. Données de recette

La recette a été réalisée dans cinq copies Google Sheets isolées des classeurs officiels 2026-2027.

Chaque copie contenait :

- 6 licenciés fictifs explicitement marqués `RECETTE` ;
- 4 séances réalisées ;
- 24 lignes de présence ;
- 17 présences ;
- 5 absences ;
- 2 excusés ;
- un taux de présence attendu de 70,8 % ;
- aucun contrôle de complétude en erreur.

Les cinq classeurs officiels n’ont pas été modifiés. Une validation héritée incorrecte sur la colonne `Cours` de la copie du cours féminin a été corrigée uniquement dans la ressource de recette afin d’accepter `FEMININ`.

---

## 6. Prévisualisation des rapports

La prévisualisation validée pour 2026-2027 comprend :

1. Rapport Baby ;
2. Rapport Enfant 1 ;
3. Rapport Enfant 2 ;
4. Rapport Ado/Adulte ;
5. Rapport Cours féminin ;
6. Rapport global.

La recette a confirmé :

- la présence des six cartes ;
- la résolution correcte des six titres ;
- l’affichage effectif du contenu HTML dans chaque cadre ;
- la cohérence du rapport du cours féminin avec le périmètre 2026-2027 ;
- l’absence de cadre blanc et de libellé manquant ;
- l’interdiction de publier avant confirmation explicite.

---

## 7. Anomalie détectée et correction

La première prévisualisation réelle a révélé deux défauts non couverts par la suite automatisée initiale :

- le générateur renvoyait `course` sous forme de libellé tandis que le contrôleur le traitait comme un code, ce qui supprimait les cinq titres de cours ;
- le document HTML complet était interpolé dans un attribut `srcdoc`, dont les guillemets interrompaient le contenu et produisaient des cadres blancs.

La correction validée :

- résout les titres depuis `report_code` ;
- affecte le document HTML par la propriété DOM `iframe.srcdoc` après création de l’iframe ;
- ajoute un test reproduisant le contrat réel du générateur ;
- ne modifie ni les données ni les ressources Google Drive.

Cette correction a été intégrée par la PR applicative #39.

---

## 8. Publication Google Drive

Après validation de la prévisualisation, les six rapports de recette ont été publiés dans Google Drive.

La recette a confirmé :

- la création effective des six PDF ;
- l’accessibilité des fichiers publiés ;
- la cohérence entre prévisualisation et publication ;
- la conservation des ressources de recette à des fins de traçabilité ;
- l’absence de modification des classeurs officiels.

---

## 9. Validation automatisée

La suite cumulative d’AKS Platform utilisée pour valider la V1.2.0 a été exécutée
après correction. Son point d’entrée technique conserve le nom historique
`AKS_runValidationSuiteV11` :

```text
RÉSULTAT: 273/273 réussis, 0 échec(s).
```

Cette validation couvre la non-régression du socle existant et les cas automatisés Analytics intégrés au dépôt.

La recette réelle de l’interface a complété cette suite en couvrant le rendu des six rapports, leur publication Drive et la restauration finale de la configuration.

---

## 10. Traçabilité applicative

| Référence | Objet | Résultat |
|---|---|---|
| PR #38 | Alignement visuel de l’administration Analytics, périmètre saisonnier et diagnostic des sources | Fusionnée dans `develop` |
| PR #39 | Correction des titres et du rendu réel de la prévisualisation | Fusionnée dans `develop` |
| Commit de fusion PR #39 | `dba258b2` | Intégré dans `develop` |
| Suite cumulative | 273/273 | Réussie |
| Recette Drive | Six rapports 2026-2027 | Publiés et accessibles |

---

## 11. Restauration et contrôle final

À l’issue de la recette :

1. les cinq identifiants des classeurs officiels ont été restaurés ;
2. leur persistance a été vérifiée après rechargement ;
3. un nouveau diagnostic a été exécuté uniquement sur les sources officielles ;
4. aucune prévisualisation ni publication officielle n’a été lancée ;
5. l’état bloqué attendu a été confirmé, les sources étant conformes mais encore vides ;
6. la branche applicative `develop` a été synchronisée et contrôlée propre.

La configuration opérationnelle ne pointe donc plus vers les ressources de recette.

---

## 12. Écarts et limites connus

- Les barres de défilement dans les cadres de prévisualisation sont normales compte tenu de leur format compact.
- Les données officielles 2026-2027 étant encore vides au moment du contrôle final, aucune publication officielle n’est attendue.
- La recette valide le périmètre fonctionnel livré ; elle ne constitue pas encore une publication de version globale d’AKS Platform.
- Aucun tag applicatif ou documentaire supplémentaire n’est créé dans cet incrément.

---

## 13. Décision de recette

Le Product Owner prononce la recette concluante de l’incrément AKS Analytics décrit dans le présent document.

Sont validés :

- le périmètre saisonnier à quatre ou cinq cours ;
- le diagnostic des sources ;
- la prévisualisation des cinq rapports de cours et de la synthèse globale pour 2026-2027 ;
- la publication contrôlée des six PDF dans Google Drive ;
- la non-régression automatisée ;
- la correction du rendu réel ;
- la restauration de la configuration officielle.

Aucun défaut bloquant ou critique n’est ouvert sur le périmètre recensé.

---

## 14. Suites autorisées

La validation d’`ANALYTICS-008` autorise :

- la poursuite des évolutions Analytics par incréments dédiés ;
- la préparation ultérieure d’une décision de version ;
- l’exploitation officielle lorsque les sources réelles deviennent exploitables ;
- la conservation des preuves de recette sans les confondre avec les données officielles.

Elle n’autorise pas à elle seule la création d’un tag ou la publication d’une nouvelle version.

---

## 15. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-07-28 | Alignement de la version produit et de la désignation de la suite cumulative avec la publication V1.2.0 |
| 1.0.0 | 2026-07-28 | Création du bilan d’implémentation et procès-verbal de recette de l’incrément AKS Analytics |

---

## 16. Conclusion

AKS Analytics dispose désormais d’un incrément applicatif vérifié de bout en bout : sources diagnostiquées, rapports prévisualisés, publication Drive contrôlée, non-régression validée et configuration officielle restaurée. Le présent procès-verbal clôture documentairement cette recette sans anticiper une nouvelle version du produit.
