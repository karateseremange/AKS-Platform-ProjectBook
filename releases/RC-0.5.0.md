# AKS Platform RC 0.5.0

## Statut

Validée le 13 juillet 2026.

## Base

RC 0.5.0 est cumulative et inclut l’intégralité du workflow validé dans RC 0.4.0.

## Nouveau périmètre

HQ-007 — Notifications par e-mail :

1. expédition depuis `contact@karate-seremange.fr` sous le nom `Association Karaté Serémange` ;
2. message formel adressé au représentant légal ;
3. attestation PDF FFKDA jointe uniquement lorsqu’aucun certificat médical n’est requis ;
4. consignes sans PDF lorsqu’un certificat médical est requis ;
5. récapitulatif éphémère de chaque question et de sa réponse envoyé uniquement au représentant légal ;
6. notification du club avec nom, prénom et date de naissance du licencié, référence et formalité attendue ;
7. horodatage indépendant des deux notifications ;
8. statut final `COMPLETED` après réussite des deux envois.

## Confidentialité

- les réponses détaillées ne sont jamais enregistrées dans Google Sheets, Drive, les journaux ou une `Submission` ;
- le récapitulatif détaillé existe uniquement en mémoire pendant la soumission et n’est envoyé qu’au représentant légal ;
- le club ne reçoit aucune réponse détaillée, aucun PDF et aucun lien Drive ;
- le PDF FFKDA et son QR code ne contiennent aucune réponse détaillée ;
- seuls le résultat administratif et les jalons nécessaires au suivi sont persistés.

## Validation

- 7/7 tests HQ-007 réussis ;
- 4/4 tests de non-régression HQ-006 réussis ;
- 7/7 tests de non-régression HQ-005.2 Sprint 4.3 réussis ;
- scénario réel sans certificat médical validé ;
- scénario réel avec certificat médical validé ;
- contenu des deux messages, pièces jointes, expéditeur et destinataires contrôlés ;
- absence de réponses détaillées côté club et dans les données persistées confirmée.

## Tag applicatif

`rc-0.5.0`
