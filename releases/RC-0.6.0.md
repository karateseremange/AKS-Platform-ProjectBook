# AKS Platform RC 0.6.0

## Statut

Validée le 13 juillet 2026.

## Base

RC 0.6.0 est cumulative et inclut l’intégralité du workflow validé dans RC 0.5.0.

## Nouveau périmètre

HQ-008 — Saisie mobile de la date de naissance :

1. suppression du calendrier natif inadapté aux dates de naissance ;
2. saisie du jour et de l’année avec clavier numérique ;
3. sélection du mois dans une liste en français ;
4. ordre de saisie français jour, mois, année ;
5. validation des dates impossibles, futures et majeures ;
6. maintien du calcul immédiat de l’âge ;
7. conservation du contrat serveur ISO `AAAA-MM-JJ` ;
8. ajout d’un rappel sur la page finale concernant l’e-mail récapitulatif et les courriers indésirables.

## Compatibilité

Le changement est limité à la couche Web. Le domaine, `Submission`, les repositories, Google Sheets, le PDF FFKDA et les notifications HQ-007 restent inchangés.

## Validation

- 3/3 tests HQ-008 réussis ;
- 5/5 tests de non-régression HQ-005.2 Sprint 2 réussis ;
- 7/7 tests de non-régression HQ-007 réussis ;
- parcours complet validé sur Android et ordinateur ;
- saisie, calcul de l’âge, transmission et confirmation validés ;
- compatibilité technique iOS assurée par les contrôles HTML natifs, à confirmer lors d’un prochain test sur appareil.

## Tag applicatif

`rc-0.6.0`
