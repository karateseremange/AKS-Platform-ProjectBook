| Propriété | Valeur |
|-----------|--------|
| **Document ID** | AUDIT-001-RECETTE |
| **Titre** | Procès-verbal de recette du socle persistant AUDIT-001 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3 |

---

# 1. Objet

Ce document consigne la recette réelle du premier incrément persistant commun défini par `AUDIT-001 1.2.1` et implémenté par la PR applicative AKS-Platform #90.

La recette vérifie la persistance Google Sheets sur une ressource isolée de recette, la corrélation des preuves, la restauration de la configuration temporaire et la non-régression cumulative.

# 2. Références applicatives

- dépôt : `karateseremange/AKS-Platform` ;
- branche : `agent/audit-001-core-persistence` ;
- PR : `#90` — `feat(audit): implémenter le socle persistant AUDIT-001` ;
- tête exécutée : `11e36134ba291e22c92378c4610cdaf3265a68c8` ;
- base : `develop` ;
- état au moment de la recette : PR ouverte, fusionnable et toujours en brouillon.

# 3. Préconditions et synchronisation Apps Script

Le code de la tête validée a été synchronisé dans le projet Apps Script par `clasp push`.

Résultat observé : **221 fichiers synchronisés**, sans erreur affichée.

La cible de recette est un classeur Google Sheets dédié nommé exactement `AKS Audit RECETTE`. Aucune ressource de production n'a été utilisée.

# 4. Préparation de la recette

Fonction exécutée depuis l'éditeur Apps Script :

`AKS_prepareAudit001Recipe`

Résultat :

- `ok: true` ;
- classeur exact reconnu ;
- onglet `AKS_Audit` créé ;
- **16 en-têtes** installés ;
- `existingAuditCount: 0` avant la campagne.

La préparation n'a créé aucune preuve fonctionnelle d'audit.

# 5. Exécution persistante

Fonction exécutée depuis l'éditeur Apps Script :

`AKS_runAudit001Recipe`

Résultat observé :

- `ok: true` ;
- acteur serveur : `karate.seremange@gmail.com` ;
- `correlationId` commun : `corr-audit001-recipe-b1b3b4cc-d88e-480f-ad94-43060b317db4` ;
- preuve d'intention : `aud-91169f19-a72a-48c2-a5c8-8166554da4f1` ;
- preuve de succès : `aud-6191aa85-ab82-4a10-be1b-be3668913c6d` ;
- `persistedProofCount: 2` ;
- `configurationRestored: true`.

Le contrôle visuel du classeur a confirmé **3 lignes présentes** : une ligne d'en-têtes et deux lignes de preuves persistantes.

# 6. Non-régression cumulative

Après la recette persistante, la suite `AKS_runValidationSuiteV11` a été exécutée dans Apps Script.

Résultat réel : **423/423 réussis, 0 échec**.

Les validations antérieures restent également consignées dans la PR applicative :

- AUDIT-001 ciblé : **43/43** ;
- CONFIG-001 : **29/29** ;
- syntaxe : **188/188 fichiers `.gs`** ;
- sonde concurrente supplémentaire : **3/3**.

# 7. Conclusion de recette

La recette isolée d'AUDIT-001 est **concluante**.

Elle apporte la preuve que le socle commun :

- écrit réellement dans le support Google Sheets isolé ;
- produit deux preuves distinctes et corrélées pour le cycle `INTENTION → REUSSI` ;
- relit et valide les preuves persistées ;
- restaure la configuration technique temporaire ;
- conserve la conformité de la suite cumulative après exécution réelle.

Cette validation ne vaut ni activation en production, ni raccordement d'`INSCRIPTIONS-010`, ni autorisation de fusion vers `main`.

# 8. Règle de recette Web App

À compter de cette validation, la règle de travail suivante est retenue pour les incréments applicatifs :

> Toute modification observable ou utilisable depuis le Web App doit faire l'objet d'une recette sur un déploiement de test avant sa validation finale et avant sa fusion dans `develop`.

Cette règle s'applique notamment aux pages et routes Web App, interfaces Admin, Inscriptions, Analytics, Présences, navigations, appels `google.script.run`, contrôles d'autorisation observables et parcours publics ou privés.

Un déploiement Web App de test n'est pas exigé lorsqu'un incrément est strictement interne et non exposé par une route ou une interface, à condition qu'une recette technique réelle adaptée couvre les intégrations externes concernées.

Pour AUDIT-001, les fonctions de recette sont volontairement réservées à l'éditeur Apps Script et aucune route Web App ne les expose. La recette Google Sheets réelle décrite dans ce procès-verbal constitue donc la validation fonctionnelle adaptée à cet incrément.

# 9. Suite autorisable après validation documentaire

Après validation de ce procès-verbal :

1. la PR applicative #90 pourra être passée en prête pour revue puis fusionnée dans `develop` après autorisation explicite du Product Owner ;
2. le raccordement d'`INSCRIPTIONS-010` au port commun pourra être repris dans son propre cycle ;
3. toute fonctionnalité Web App issue de ce raccordement devra respecter la règle de déploiement de test définie ci-dessus.
