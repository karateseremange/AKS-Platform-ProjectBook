# AKS Platform RC 0.4.0

## Statut

Validée le 12 juillet 2026.

## Base

RC 0.4.0 est cumulative et inclut l’intégralité du workflow validé dans RC 0.3.0.

## Nouveau périmètre

HQ-006 — Génération de l’attestation PDF officielle FFKDA :

1. génération réservée au résultat `NO_MEDICAL_CERTIFICATE_REQUIRED` ;
2. préremplissage du représentant légal et du licencié mineur ;
3. maintien de la zone Date et signature ;
4. intégration du logo officiel FFKDA ;
5. ajout de la référence de soumission ;
6. QR code discret de vérification ;
7. conservation du PDF dans un dossier Google Drive privé ;
8. persistance du statut `PDF_GENERATED` et des références Drive.

## Confidentialité

- aucune réponse détaillée n’entre dans le générateur PDF ;
- aucune réponse ou donnée médicale n’est inscrite dans le PDF ;
- le QR code contient uniquement la référence opaque `AKS-QS|1|QS-AAAA-NNNNNN` ;
- le QR code ne contient aucune identité, adresse électronique ou donnée médicale.

## Validation

- 4 tests automatisés HQ-006 réussis ;
- génération réelle Apps Script validée ;
- rendu du document FFKDA validé sur une page ;
- logo officiel validé ;
- QR code visible et lisible ;
- stockage Drive et mise à jour de `HQ_Submissions` validés ;
- données de test supprimées après contrôle.

## Références officielles

- `references/ffkda/2-Attestation mineur.pdf` ;
- `references/ffkda/LOGO-FFKarate_H_RVB.png`.

## Tag applicatif

`rc-0.4.0`
