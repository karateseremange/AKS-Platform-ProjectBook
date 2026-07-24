# ARCH-CONSOLIDATION-001 — M5.2

# Checklist d’exécution et de contrôle de la consolidation documentaire

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Fournir une checklist opérationnelle permettant de vérifier que la consolidation documentaire d’AKS Platform est réalisée de manière complète, cohérente et traçable avant la clôture du chantier `ARCH-CONSOLIDATION-001`.

Cette checklist s’applique à l’ensemble des documents concernés par le processus de consolidation.

---

# 1. Préparation

Avant toute modification documentaire, vérifier les points suivants :

- [ ] Le périmètre documentaire à consolider est identifié.
- [ ] Les documents sources ont été recensés.
- [ ] Les versions de référence ont été confirmées.
- [ ] Les documents obsolètes ou en doublon ont été signalés.
- [ ] Les dépendances avec les autres documents du Project Book ont été identifiées.
- [ ] La branche de travail utilisée est `develop`.
- [ ] Le répertoire cible respecte l’arborescence `project-book/`.

---

# 2. Contrôle de structure

Pour chaque document consolidé :

- [ ] Le document possède un identifiant unique.
- [ ] Le nom du fichier est explicite et conforme à la convention de nommage.
- [ ] Le document est rangé dans le bon répertoire.
- [ ] Le titre principal correspond au contenu réel.
- [ ] La structure des sections est cohérente.
- [ ] Les niveaux de titres Markdown sont correctement hiérarchisés.
- [ ] Les tableaux, listes et blocs de code sont correctement formatés.
- [ ] Aucun contenu temporaire ou commentaire de travail ne subsiste.

---

# 3. Contrôle du contenu

Pour chaque document :

- [ ] L’objectif est clairement formulé.
- [ ] Le périmètre est explicite.
- [ ] Les responsabilités sont identifiées lorsque nécessaire.
- [ ] Les décisions validées sont distinguées des propositions.
- [ ] Les informations correspondent à l’état réel d’AKS Platform.
- [ ] Les éléments obsolètes ont été retirés ou archivés.
- [ ] Les doublons ont été supprimés.
- [ ] Les termes métier et techniques sont utilisés de manière cohérente.
- [ ] Les références croisées sont exactes.
- [ ] Les liens internes et externes sont valides.

---

# 4. Contrôle de cohérence globale

Vérifier la cohérence entre les documents :

- [ ] Les documents de gouvernance ne contredisent pas la roadmap.
- [ ] Les documents d’architecture sont alignés avec les modules réellement prévus.
- [ ] Les User Stories respectent les règles fonctionnelles validées.
- [ ] Les documents d’exploitation correspondent aux choix techniques retenus.
- [ ] Les noms des branches Git sont homogènes.
- [ ] Les noms des dépôts sont corrects.
- [ ] Les chemins de fichiers mentionnés sont conformes à l’arborescence réelle.
- [ ] Les versions et statuts documentaires sont cohérents.
- [ ] Les références à la V1.0 et à la V1.1 sont correctement distinguées.

---

# 5. Contrôle Git

Avant publication sur `develop` :

- [ ] La branche active est `develop`.
- [ ] La branche locale est synchronisée avec `origin/develop`.
- [ ] Seuls les fichiers attendus sont modifiés.
- [ ] Le résultat de `git status` est compris et maîtrisé.
- [ ] Le message de commit respecte la convention du projet.
- [ ] Le commit ne contient pas de fichier temporaire.
- [ ] Le push vers `origin/develop` a réussi.
- [ ] Le fichier est visible dans le dépôt distant sur la branche `develop`.

Commande de contrôle recommandée :

```bash
git checkout develop
git pull origin develop
git status
```

Après ajout du document :

```bash
git add project-book/architecture/<nom-du-fichier>.md
git commit -m "docs(arch): add <description du livrable>"
git push origin develop
```

---

# 6. Validation documentaire

Un document peut être considéré comme validé lorsque :

- [ ] Son contenu a été relu.
- [ ] Sa cohérence avec les documents existants a été vérifiée.
- [ ] Son statut documentaire a été mis à jour.
- [ ] Il est publié sur `develop`.
- [ ] Sa présence dans GitHub a été contrôlée.
- [ ] Les éventuelles corrections ont été intégrées.
- [ ] Aucun point bloquant ne reste ouvert.

---

# 7. Préparation de la clôture du processus

Avant la fusion finale vers `main` :

- [ ] Tous les livrables du processus `ARCH-CONSOLIDATION-001` sont publiés sur `develop`.
- [ ] Tous les livrables sont validés.
- [ ] Une revue globale a été effectuée.
- [ ] Les documents sont cohérents entre eux.
- [ ] L’index documentaire a été mis à jour si nécessaire.
- [ ] Aucun document intermédiaire non validé ne doit être fusionné.
- [ ] La comparaison entre `main` et `develop` a été examinée.
- [ ] La fusion finale est explicitement approuvée.

---

# 8. Critères de réussite

La consolidation documentaire est considérée comme réussie lorsque :

- tous les documents du périmètre sont identifiés ;
- les doublons et incohérences sont supprimés ;
- l’arborescence documentaire est respectée ;
- les conventions de nommage sont appliquées ;
- les documents sont cohérents avec l’état réel de la plateforme ;
- l’ensemble des livrables est validé sur `develop` ;
- la fusion vers `main` intervient uniquement à la fin du processus.

---

# Résultat attendu

M5.2 fournit le référentiel de contrôle utilisé pour vérifier l’exécution complète de la consolidation documentaire et préparer la validation finale du chantier `ARCH-CONSOLIDATION-001`.
