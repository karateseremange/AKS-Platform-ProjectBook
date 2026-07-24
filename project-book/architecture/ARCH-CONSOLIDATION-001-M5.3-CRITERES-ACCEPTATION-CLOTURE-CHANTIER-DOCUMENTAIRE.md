# ARCH-CONSOLIDATION-001 — M5.3

# Critères d’acceptation et clôture du chantier documentaire

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Définir les critères permettant de déclarer le chantier `ARCH-CONSOLIDATION-001` achevé, de confirmer la conformité des livrables documentaires et de préparer leur publication officielle par fusion unique de `develop` vers `main`.

---

# 1. Périmètre de la clôture

La clôture porte sur l’ensemble des documents produits, révisés ou consolidés dans le cadre du processus `ARCH-CONSOLIDATION-001`.

Elle comprend :

- la vérification de la présence de tous les livrables attendus ;
- la validation de leur contenu ;
- la vérification de leur cohérence mutuelle ;
- le contrôle de leur publication sur `develop` ;
- la préparation de la fusion finale vers `main`.

---

# 2. Critères d’acceptation documentaires

Le chantier peut être accepté lorsque les conditions suivantes sont remplies :

- [ ] Tous les livrables prévus sont présents dans le dépôt documentaire.
- [ ] Chaque document possède un identifiant unique.
- [ ] Chaque fichier respecte les conventions de nommage du Project Book.
- [ ] Chaque document est rangé dans le répertoire approprié.
- [ ] Les objectifs, périmètres et responsabilités sont clairement définis.
- [ ] Les statuts documentaires sont explicites et cohérents.
- [ ] Les décisions validées sont distinguées des propositions ou pistes futures.
- [ ] Les informations obsolètes, contradictoires ou dupliquées ont été supprimées.
- [ ] Les références croisées et liens internes sont corrects.
- [ ] L’ensemble des documents reflète l’état réel d’AKS Platform.

---

# 3. Critères d’acceptation de cohérence

La cohérence globale est considérée comme validée lorsque :

- [ ] Les documents de gouvernance sont alignés avec la roadmap.
- [ ] Les documents d’architecture sont cohérents avec les modules prévus.
- [ ] Les règles fonctionnelles sont identiques dans tous les documents concernés.
- [ ] Les conventions Git sont homogènes.
- [ ] La branche `main` est décrite comme branche de production.
- [ ] La branche `develop` est décrite comme branche d’intégration et de validation.
- [ ] Les chemins documentaires utilisent l’arborescence `project-book/`.
- [ ] Les versions V1.0, V1.1 et futures sont clairement distinguées.
- [ ] Aucun élément issu d’un environnement personnel n’est présenté comme composant d’AKS Platform.

---

# 4. Critères d’acceptation Git

Avant la clôture :

- [ ] Tous les livrables du chantier sont publiés sur `develop`.
- [ ] Aucun livrable incomplet ou non validé ne doit être fusionné vers `main`.
- [ ] L’historique des commits est compréhensible et traçable.
- [ ] Les messages de commit respectent les conventions du projet.
- [ ] La comparaison `main...develop` a été examinée.
- [ ] Les fichiers ajoutés, modifiés ou supprimés sont tous justifiés.
- [ ] Aucun fichier temporaire ou parasite n’est présent.
- [ ] La branche `develop` est synchronisée avec le dépôt distant.

Commande de contrôle recommandée :

```bash
git checkout develop
git pull origin develop
git status
git diff main...develop -- project-book/
```

---

# 5. Revue finale

La revue finale doit confirmer :

- la complétude du périmètre ;
- la conformité des documents ;
- l’absence de contradiction majeure ;
- la cohérence de l’arborescence ;
- la validité des références ;
- l’absence de contenu obsolète ;
- la préparation correcte de la publication.

Toute anomalie détectée pendant cette revue doit être corrigée sur `develop` avant la fusion finale.

---

# 6. Décision de clôture

Le chantier `ARCH-CONSOLIDATION-001` est déclaré clôturable lorsque :

1. tous les livrables sont présents ;
2. tous les livrables sont validés ;
3. la checklist M5.2 est satisfaite ;
4. la revue globale est terminée ;
5. aucun point bloquant ne reste ouvert ;
6. la fusion unique vers `main` est explicitement approuvée.

La validation d’un document individuel ne déclenche pas de fusion vers `main`.

La fusion intervient uniquement à la fin du processus, lorsque l’ensemble documentaire constitue un tout cohérent.

---

# 7. Publication officielle

Après approbation finale, la publication officielle suit le processus suivant :

1. mise à jour locale de `develop` ;
2. vérification finale de l’écart avec `main` ;
3. création d’une Pull Request ou fusion contrôlée de `develop` vers `main` ;
4. vérification du résultat sur `main` ;
5. création éventuelle d’un tag documentaire si le versionnement le justifie ;
6. conservation de `develop` pour les évolutions suivantes.

---

# 8. Résultat attendu

La clôture du chantier doit produire une documentation :

- complète ;
- validée ;
- cohérente ;
- traçable ;
- maintenable ;
- prête à devenir la référence officielle du Project Book.

---

# Conclusion

M5.3 formalise les conditions de fin du processus `ARCH-CONSOLIDATION-001`.

Aucune fusion vers `main` ne doit être réalisée tant que l’ensemble de ces critères n’a pas été vérifié et approuvé.
