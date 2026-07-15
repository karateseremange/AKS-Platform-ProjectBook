# Guide utilisateur du club

## 1. Objet

Ce guide est destiné aux personnes autorisées à administrer le questionnaire
santé des licenciés mineurs pour l’Association Karaté Serémange.

Il ne donne jamais accès aux réponses détaillées. Le club traite uniquement les
informations administratives nécessaires.

## 2. Accès

Utiliser le compte Google autorisé à ouvrir le classeur **AKS Platform**.
Ne pas partager ce compte. Chaque administrateur doit utiliser un accès
personnel protégé par une authentification à deux facteurs.

Le menu principal se trouve dans Google Sheets :

```text
AKS Platform
├── Ouvrir le questionnaire santé
├── Créer une campagne santé
├── Sélectionner la campagne active
└── Initialiser la plateforme
```

L’option d’initialisation est réservée à l’installation ou au dépannage.

## 3. Préparer une nouvelle saison

### 3.1 Contrôles préalables

- vérifier que le questionnaire public s’ouvre ;
- vérifier l’adresse d’expédition ;
- vérifier l’espace disponible dans Drive ;
- vérifier que la précédente campagne n’est plus présentée comme active ;
- effectuer une soumission de contrôle avant d’envoyer le lien aux familles.

### 3.2 Créer la campagne

1. choisir **AKS Platform → Créer une campagne santé** ;
2. saisir la saison, par exemple `2026-2027` ;
3. saisir un nom ou accepter le nom proposé ;
4. confirmer que la campagne est créée, ouverte et activée.

La deuxième année doit suivre immédiatement la première.

### 3.3 Sélectionner une campagne existante

1. choisir **Sélectionner la campagne active** ;
2. lire la liste et repérer la saison et le statut ;
3. saisir le numéro de la campagne ;
4. attendre la confirmation.

Ne jamais modifier directement la propriété de campagne active.

## 4. Transmettre le lien aux familles

Utiliser exclusivement :

```text
https://karate-seremange.fr/questionnaire-mineur/
```

Formulation recommandée :

> Le représentant légal doit compléter, avec le licencié mineur, le
> questionnaire de santé en ligne. À l’issue du questionnaire, un e-mail
> indiquera la formalité à accomplir. Pensez à vérifier les courriers
> indésirables.

Ne pas envoyer le lien Apps Script direct, sauf dépannage encadré.

## 5. Déroulement pour la famille

1. identité du mineur et du représentant légal ;
2. réponses au questionnaire avec le mineur ;
3. déclaration sur l’honneur ;
4. transmission ;
5. affichage de la référence ;
6. réception de l’e-mail récapitulatif.

La référence suit le format :

```text
QS-AAAA-NNNNNN
```

## 6. Résultats administratifs

### 6.1 Aucun certificat médical requis

Lorsque toutes les réponses sont « Non » :

- le représentant reçoit son récapitulatif confidentiel ;
- il reçoit l’attestation PDF ;
- il doit la dater, la signer et la transmettre au club ;
- le club reçoit uniquement l’identité, la référence et la formalité.

### 6.2 Certificat médical requis

Lorsqu’au moins une réponse est « Oui » :

- le représentant reçoit son récapitulatif confidentiel ;
- il reçoit les consignes relatives au certificat ;
- aucun PDF d’attestation n’est joint ;
- le club reçoit uniquement l’identité, la référence et la formalité.

Le club ne doit jamais demander quelle réponse a déclenché cette formalité.

## 7. Suivre les dossiers

La feuille `HQ_Submissions` est une feuille technique. Utiliser les colonnes
administratives sans modifier les en-têtes, les identifiants ou les statuts.

Informations utiles :

- `submissionId` : référence du dossier ;
- identité et date de naissance ;
- `result` : formalité déterminée ;
- `status` : état du traitement ;
- `submittedAt` : date de transmission ;
- `respondentEmailSentAt` : e-mail du représentant envoyé ;
- `clubEmailSentAt` : notification du club envoyée ;
- `attestationFileId` et `attestationFileUrl` : attestation lorsqu’elle existe.

Ne pas diffuser l’URL Drive et ne pas rendre le fichier public.

## 8. Comprendre les états

| État | Signification opérationnelle |
|---|---|
| `CREATED` | Soumission administrative créée, traitement en cours |
| `PDF_GENERATED` | Attestation générée pour le parcours sans certificat |
| `COMPLETED` | Notifications prévues envoyées et traitement terminé |

Si un dossier reste durablement dans un état intermédiaire, noter uniquement sa
référence et prévenir l’administrateur technique.

## 9. Contrôler les notifications

Pour chaque soumission, vérifier :

- la référence ;
- l’identité du mineur ;
- la date de naissance ;
- la formalité attendue ;
- l’absence de réponses détaillées dans le message du club ;
- l’absence de pièce jointe dans le message du club.

Le représentant doit vérifier son dossier Spam. Le club ne doit pas lui
demander de transférer son récapitulatif détaillé.

## 10. Incident d’e-mail

1. demander la référence, jamais les réponses ;
2. faire vérifier l’adresse utilisée et le Spam ;
3. vérifier les horodatages d’envoi dans `HQ_Submissions` ;
4. transmettre la référence à l’administrateur technique ;
5. éviter une seconde soumission tant que le diagnostic n’est pas établi.

Ne jamais recopier les réponses détaillées dans un message de support.

## 11. Incident de confidentialité

Sont considérés comme incidents :

- réponses détaillées reçues par le club ;
- fichier Drive devenu public ;
- secret du connecteur exposé ;
- accès non autorisé au classeur ;
- copie de réponses dans WordPress ou un outil tiers.

En cas d’incident :

1. arrêter temporairement la diffusion du formulaire ;
2. conserver uniquement les éléments techniques nécessaires ;
3. prévenir le président et l’administrateur ;
4. ne pas transférer les données concernées ;
5. documenter les mesures correctives.

## 12. Fin de campagne

À la fin de la période :

- ne pas supprimer les références nécessaires au suivi administratif ;
- vérifier les dossiers incomplets ;
- conserver les documents selon la politique du club ;
- préparer la campagne suivante avec le menu prévu ;
- ne jamais réutiliser une ancienne campagne pour une nouvelle saison.

La fermeture technique d’une campagne ou une modification massive doit être
réalisée par l’administrateur de la plateforme.

## 13. Assistance

Pour toute demande, transmettre :

- la référence `QS-...` ;
- la date et l’heure approximatives ;
- l’étape où l’erreur est apparue ;
- le navigateur et l’appareil ;
- le message d’erreur sans donnée médicale.

Contact du club : `contact@karate-seremange.fr`.
