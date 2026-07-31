# CALENDAR-002

# Configuration et recette du socle Google Calendar

| Propriété | Valeur |
|---|---|
| Document ID | CALENDAR-002 |
| Titre | Configuration et recette du socle Google Calendar |
| Version | 1.0.0 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-31 |
| Version du produit | Post-V1.2.0 |

---

# 1. Objet

Ce document décrit la configuration réellement mise en place dans Google Calendar et consigne la recette opérationnelle du socle défini par `CALENDAR-001`.

Google Calendar reste la source de vérité. Aucun code AKS Platform, déploiement Apps Script ou automatisme supplémentaire n’a été nécessaire.

# 2. Compte et périmètre contrôlés

La configuration a été réalisée dans le compte Google de l’association, identifié dans Google Calendar comme `karate.seremange@gmail.com` — SERRIDJ Anthony.

Le calendrier principal historique `AKS` est conservé sans renommage ni modification afin de ne pas perturber ses usages existants.

# 3. Calendriers officiels

| Calendrier | Origine | Visibilité | Usage validé |
|---|---|---|---|
| `AKS - Public` | Calendrier secondaire créé | Public, détails complets | Événements confirmés destinés aux licenciés, familles et visiteurs |
| `AKS - Encadrement` | Ancien `AKS - Professeurs` renommé | Privé | Organisation partagée de l’encadrement |
| `AKS - Administration / Comité` | Calendrier secondaire créé | Privé | Événements administratifs et du comité |
| `AKS - Propositions` | Calendrier secondaire créé | Privé | Préparation des événements avant publication |

Les quatre calendriers appartiennent au compte de l’association et utilisent le fuseau horaire `Europe/Paris`.

# 4. Droits configurés

| Calendrier | Propriétaire | Accès supplémentaires validés |
|---|---|---|
| `AKS - Public` | Compte AKS | Consultation publique avec tous les détails ; gestion réservée au propriétaire |
| `AKS - Encadrement` | Compte AKS | Deux membres existants peuvent modifier les événements sans gérer le partage |
| `AKS - Administration / Comité` | Compte AKS | Jean-Michel GAPENNE, administrateur suppléant, peut modifier les événements sans gérer le partage |
| `AKS - Propositions` | Compte AKS | Les deux mêmes membres que dans Encadrement peuvent modifier les événements sans gérer le partage |

La gestion des partages reste réservée au propriétaire. Cette règle constitue l’état opérationnel validé du socle initial et limite les risques de modification accidentelle des habilitations.

# 5. Recette des accès internes

Jean-Michel GAPENNE a confirmé qu’il voit les calendriers attendus et qu’il peut créer puis supprimer un événement de test.

Résultat : **conforme**.

# 6. Recette du circuit Propositions vers Public

Un événement temporaire a été créé dans `AKS - Propositions` :

- titre : `TEST - Proposition événement` ;
- date : 1er août 2026 ;
- horaire : 18 h 00 à 19 h 00 ;
- description : `Événement de recette CALENDAR-002` ;
- aucun invité.

L’événement a ensuite été copié dans `AKS - Public`. Le titre, la date, l’horaire, la description et l’absence d’invité ont été contrôlés dans les deux calendriers.

Résultat : **conforme**.

# 7. Nettoyage de la recette

L’événement temporaire a été supprimé séparément de `AKS - Propositions` et de `AKS - Public`.

Le contrôle final confirme qu’aucun événement `TEST - Proposition événement` ne subsiste dans ces calendriers.

Résultat : **conforme**.

# 8. Bilan de recette

| Contrôle | Résultat |
|---|---|
| Présence des quatre calendriers officiels | Conforme |
| Conservation du calendrier historique `AKS` | Conforme |
| Propriété par le compte de l’association | Conforme |
| Fuseau horaire `Europe/Paris` | Conforme |
| Visibilité publique limitée à `AKS - Public` | Conforme |
| Droits internes sans gestion du partage | Conforme |
| Accès opérationnel de l’administrateur suppléant | Conforme |
| Circuit Propositions vers Public | Conforme |
| Suppression des données temporaires | Conforme |

La recette opérationnelle de `CALENDAR-002` est réussie.

# 9. Limites de la validation

Le connecteur Google Calendar a permis de confirmer la présence, la propriété et les événements des calendriers. Il ne permet pas de relire directement tous les réglages de visibilité ni les listes individuelles de partage.

Ces éléments ont donc été contrôlés dans l’interface Google Calendar et validés par le Product Owner.

# 10. Décision de clôture

`CALENDAR-002` est validé et peut être clôturé.

Aucun développement applicatif n’est engagé à ce stade. La prochaine étape autorisée est `CALENDAR-003` :

- publier uniquement `AKS - Public` sur WordPress ;
- proposer un lien d’abonnement ;
- produire un guide utilisateur court ;
- vérifier l’affichage sur ordinateur et mobile.

# 11. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-31 | Configuration des quatre calendriers, partage initial, recette des accès et du circuit Propositions vers Public, nettoyage et clôture |
