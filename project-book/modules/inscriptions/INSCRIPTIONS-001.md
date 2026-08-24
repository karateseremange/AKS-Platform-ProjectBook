# INSCRIPTIONS-001

# Cadrage fonctionnel d’AKS Inscriptions

| Propriété | Valeur |
|---|---|
| Document ID | INSCRIPTIONS-001 |
| Titre | Cadrage fonctionnel d’AKS Inscriptions |
| Version | 1.0.2 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-08-02 |
| Version du produit | Post-V1.3.0 |

---

# 1. Objet

AKS Inscriptions doit remplacer progressivement les recopies et suivis répartis entre formulaires Google, classeurs Excel et documents de travail par un parcours administratif unique, cohérent et traçable.

Le module doit couvrir la préinscription, le contrôle des informations, la réservation d’une place, la constitution du dossier saisonnier, le suivi administratif et financier, la préparation de la saisie fédérale puis l’activation du licencié dans les outils opérationnels du club.

Le présent document cadre le besoin et les règles métier. Il n’autorise encore aucun développement applicatif et ne définit pas le modèle technique détaillé, les services, les interfaces finales, les contrats externes ni la stratégie complète de recette, qui relèveront des documents suivants conformément à `STD-001`.

# 2. Décision structurante

Un module unique **AKS Inscriptions** est retenu.

Il est alimenté par trois parcours publics distincts :

- Karaté classique ;
- Cours féminin ;
- Body Karaté.

Les trois parcours partagent un même référentiel des personnes et des dossiers saisonniers. Ils peuvent présenter des formulaires, pièces, tarifs et modalités adaptés à leur public sans créer trois systèmes de gestion indépendants.

# 3. Existant audité

## 3.1 Sources 2026–2027

L’audit en lecture seule a identifié :

- un formulaire de production et un formulaire de test pour le karaté classique ;
- un classeur de réponses associé au formulaire classique ;
- un formulaire de production et un formulaire de test pour le cours féminin ;
- un classeur de réponses associé au formulaire féminin ;
- des classeurs Excel de travail utilisés pour normaliser, corriger et compléter les réponses ;
- plusieurs anciens classeurs `AKS-Calc-Inscription` utilisés pour calculer les montants ;
- le formulaire officiel FFKDA de demande de licence 2026–2027 ;
- un export de la base SIKADA ;
- les cinq classeurs Analytics 2026–2027 : Baby, Enfant 1, Enfant 2, Ado-Adulte et Cours féminin ;
- le classeur `AKS Platform` et les ressources du Questionnaire santé mineur.

Le parcours Body Karaté vient d’être créé. Ses documents de référence sont en cours de préparation et n’ont pas encore été audités.

## 3.2 Fonctionnement actuel

Le parcours classique observé est le suivant :

1. réception d’une réponse au formulaire Google ;
2. copie dans un classeur Excel de travail ;
3. correction et normalisation manuelles des données ;
4. calcul du cours à partir de l’année de naissance ;
5. validation manuelle de la préinscription ;
6. envoi d’un courriel personnalisé confirmant la préinscription, rappelant les données à vérifier et précisant le cours et les modalités ;
7. finalisation physique de l’inscription au dojo ;
8. contrôle des pièces et du règlement ;
9. préparation puis saisie de la demande de licence dans SIKADA ;
10. récupération ultérieure du numéro de licence FFK.

Le cours féminin et le Body Karaté n’exigent pas de calcul de répartition : le formulaire utilisé identifie directement l’activité concernée.

## 3.3 Limites de l’existant

- les formulaires ne suivent pas l’état complet du dossier ;
- le classeur intermédiaire crée une recopie et une source parallèle ;
- le suivi des pièces n’est pas homogène entre les sections ;
- les calculs et modèles historiques ne sont pas tous à jour ;
- le numéro de licence FFK n’existe qu’après la saisie dans SIKADA ;
- les référentiels `Licenciés` d’Analytics attendent encore une alimentation officielle ;
- le Questionnaire santé utilise un identifiant de dossier distinct, sans lien technique avec la personne ou le dossier d’inscription ;
- aucune API SIKADA n’est connue à ce jour.

Les anciens fichiers restent des sources d’apprentissage métier. Leur remise à niveau exhaustive n’est pas un préalable à AKS Inscriptions.

## 3.4 Transition depuis Google Forms

Tant que les formulaires publics d’AKS Inscriptions ne sont pas développés, testés et mis en production, les Google Forms existants restent les outils officiels de préinscription.

Cette continuité concerne les trois parcours :

- Karaté classique ;
- Cours féminin ;
- Body Karaté.

Toutes les réponses recueillies pendant cette période transitoire doivent pouvoir être reprises dans AKS Inscriptions sans ressaisie manuelle. L’import doit :

- conserver la source, la date de réception et les informations utiles de chaque réponse ;
- normaliser les données sans écraser silencieusement la valeur reçue ;
- détecter les doublons et les correspondances ambiguës ;
- pouvoir être relancé sans recréer un dossier déjà importé ;
- rapprocher, après contrôle administratif, la préinscription d’un licencié existant ou créer un nouvel identifiant interne ;
- créer ou compléter le dossier saisonnier correspondant ;
- prendre en charge les réponses déjà présentes et celles reçues jusqu’à la bascule ;
- produire un rapport de contrôle avant toute activation opérationnelle.

La mise en service future des formulaires AKS Platform ne peut intervenir qu’après validation de la reprise complète des Google Forms. Aucun dossier recueilli pendant la transition ne doit être perdu, ignoré ou recréé en double.

# 4. Publics et parcours d’entrée

## 4.1 Karaté classique

Le formulaire concerne les pratiquants répartis entre quatre cours. Le demandeur ne choisit pas librement le cours : le système calcule une proposition à partir de l’année de naissance, puis l’administration la contrôle.

| Année de naissance | Cours 2026–2027 |
|---|---|
| 2021 à 2023 | Baby |
| 2017 à 2020 | Enfant 1 |
| 2013 à 2016 | Enfant 2 |
| 2012 et avant | Ado/Adultes |

Cette table est une règle saisonnière et doit être paramétrable ou versionnée pour éviter une formule implicite à reconduire chaque année.

## 4.2 Cours féminin

Le formulaire dédié affecte directement le dossier au cours féminin. Aucun calcul de répartition n’est nécessaire.

## 4.3 Body Karaté

Le formulaire dédié affecte directement le dossier au Body Karaté. Le code de discipline attendu pour la demande de licence FFK est `BODY`, contre `SHOT` pour le karaté Shotokan.

Les horaires, tarifs, capacités, pièces et modalités propres au Body Karaté restent à intégrer après validation des documents en cours de préparation.

# 5. Préinscription et disponibilité

La préinscription en ligne :

- reste ouverte pendant toute la saison ;
- constitue un passage obligatoire pour toute nouvelle inscription ;
- permet de demander la réservation d’une place ;
- ne vaut pas inscription définitive ;
- reste soumise aux capacités disponibles dans le cours concerné.

Avant la journée d’inscription du **29 août 2026**, le message public indique que la préinscription permet de réserver une place et que l’inscription définitive aura lieu à cette date.

Après le 29 août 2026, le formulaire reste accessible. Le message précise que la préinscription reste obligatoire et que la finalisation s’effectue pendant les horaires de cours, après validation et sous réserve des places disponibles.

Une période de priorité peut être accordée aux licenciés actuels avant l’ouverture générale. Pour 2026–2027, une priorité d’une semaine a été appliquée. Cette règle doit rester configurable par saison et ne constitue pas une priorité permanente implicite.

La capacité doit être suivie par cours afin de distinguer :

- place disponible ;
- place à confirmer ;
- liste d’attente ;
- cours complet.

# 6. Informations recueillies et contrôlées

Le dossier doit recueillir uniquement les informations nécessaires au traitement de l’inscription, notamment :

- identité et coordonnées de la personne ;
- date et lieu de naissance, sexe, nationalité et adresse lorsque requis ;
- situation de renouvellement ou de nouvelle inscription ;
- responsables légaux et coordonnées utiles pour un mineur ;
- autorisation relative à l’image ;
- section et cours attribué ;
- informations administratives nécessaires à la demande de licence.

Pour un nouvel inscrit, le parcours demande en plus :

- s’il a déjà pratiqué le karaté ou une discipline apparentée ;
- la ceinture la plus élevée obtenue.

La ceinture déclarée reste indicative. Elle doit être contrôlée par l’encadrement et ne vaut ni reconnaissance automatique ni attribution de grade.

Les corrections effectuées après réception doivent être traçables. Les données corrigées et utilisées pour la confirmation deviennent la version de travail du dossier ; le fichier source reste une preuve d’import et non une seconde source de vérité active.

# 7. Référentiel fonctionnel

## 7.1 Licencié

Le licencié représente la personne de manière stable entre les saisons.

Il possède un identifiant interne non signifiant, proposé sous la forme `LIC-xxxxxx`. Cet identifiant est disponible dès la création du référentiel et reste indépendant de SIKADA.

Le numéro de licence FFK :

- n’est pas généré par AKS Platform ;
- peut être absent pour un nouveau licencié ;
- est enregistré après la création effective de la licence dans SIKADA ;
- ne remplace pas l’identifiant interne ;
- doit rester unique lorsqu’il est connu.

## 7.2 Dossier saisonnier

Un nouveau dossier d’inscription est créé pour chaque saison et chaque parcours concerné. Il porte notamment :

- la saison sportive ;
- la section et le cours ;
- le statut du dossier ;
- les pièces et formalités attendues ;
- les règlements, remises et aides ;
- les décisions de place ou de liste d’attente ;
- les notifications envoyées ;
- la situation fédérale ;
- les dates et acteurs des opérations importantes.

La séparation entre licencié et dossier saisonnier évite de recréer la personne chaque année et permet de conserver un historique cohérent.

## 7.3 Responsables légaux

Pour un mineur, le dossier référence au moins un responsable légal et permet d’en gérer plusieurs lorsque nécessaire. Les coordonnées du responsable utilisées pour les notifications doivent être distinguées de celles du pratiquant.

La modélisation détaillée, les règles de rapprochement familial et les droits éventuels d’un futur espace usager seront définis dans `INSCRIPTIONS-002` et `INSCRIPTIONS-004`.

# 8. Cycle de vie du dossier

Le cycle cible comprend au minimum les états suivants :

| Statut | Signification |
|---|---|
| `RECUE` | Préinscription enregistrée, sans contrôle administratif complet |
| `A_CONTROLER` | Dossier en attente de vérification ou de correction |
| `CORRIGEE` | Données contrôlées et normalisées |
| `PLACE_A_CONFIRMER` | Capacité ou affectation nécessitant une décision |
| `LISTE_ATTENTE` | Aucune place confirmée à ce stade |
| `CONFIRMEE` | Place et modalités confirmées par le club |
| `INSCRIPTION_EN_COURS` | Finalisation administrative engagée au dojo |
| `DOSSIER_COMPLET` | Pièces, formalités et règlement conformes aux règles applicables |
| `LICENCE_A_SAISIR` | Dossier prêt pour la saisie dans SIKADA |
| `LICENCIE_ACTIF` | Licence traitée et personne activée pour la saison |
| `ABANDONNEE` | Demande non poursuivie |
| `ANNULEE` | Inscription annulée après décision ou demande explicite |
| `REFUSEE` | Dossier refusé avec motif administratif traçable |

Le passage d’un état à l’autre doit être contrôlé et journalisé. Les libellés définitifs, transitions autorisées et règles de réouverture relèvent du modèle métier détaillé.

# 9. Contrôle administratif et pièces

Une feuille de contrôle numérique commune doit remplacer les suivis dispersés. Elle peut varier selon le parcours.

Pour le karaté classique, le suivi comprend notamment :

- demande de licence ;
- certificat médical selon la règle applicable ;
- photo ;
- cotisation ;
- mode de règlement ;
- remise familiale ;
- Pass’Sport ou autre aide ;
- t-shirt ;
- remarque administrative.

Le sac est explicitement exclu du suivi classique.

Les pièces et formalités propres au cours féminin et au Body Karaté seront définies à partir de leurs documents de référence à jour. Une pièce non applicable à un parcours ne doit pas y être imposée.

# 10. Règles médicales et Questionnaire santé

La décision du club pour 2026–2027 est de demander un certificat médical à tout nouveau licencié.

Le système doit distinguer :

- la règle fédérale minimale ;
- la règle plus exigeante décidée par AKS ;
- le parcours du Questionnaire santé mineur déjà livré ;
- la preuve administrative attendue et son état de réception.

AKS Inscriptions ne conserve jamais les réponses médicales détaillées. Il conserve uniquement les informations administratives nécessaires, par exemple : formalité applicable, certificat requis, document reçu, questionnaire ou attestation validé, date de contrôle et acteur du contrôle.

La règle exacte applicable aux renouvellements, selon l’âge et la discipline, reste à confirmer avant l’implémentation.

# 11. Confirmation et notifications

Après contrôle et décision sur la place, l’administration doit pouvoir envoyer un courriel de confirmation contenant :

- une référence de dossier ;
- les données enregistrées à vérifier ;
- la section et le cours attribué ;
- les horaires ;
- les modalités de finalisation ;
- la date du 29 août 2026 avant cette échéance, ou les modalités pendant les cours après cette date ;
- les pièces attendues ;
- le montant prévisionnel et les modalités connues ;
- une formulation prudente sur la disponibilité de la place.

L’envoi doit utiliser les principes de `NOTIF-001` : modèle versionné, prévention des doublons, état d’envoi, trace minimale et absence de donnée sensible inutile dans les journaux.

# 12. Règlements, remises et aides

Le module doit pouvoir suivre :

- le montant attendu ;
- le montant reçu ;
- le statut du règlement ;
- le mode de règlement ;
- les échéances éventuelles ;
- la remise familiale ;
- le Pass’Sport ou une autre aide ;
- une référence externe facultative.

Le paiement en ligne n’est pas inclus dans le périmètre initial. Des solutions externes telles que HelloAsso peuvent être utilisées séparément. Leur éventuelle intégration future nécessitera un besoin et un contrat externe validés.

AKS Platform ne doit jamais stocker de donnée bancaire ou de secret de paiement dans ce périmètre.

# 13. SIKADA et numéro de licence FFK

SIKADA reste la plateforme fédérale de référence pour la création des licences. Aucune interface ou API exploitable n’est connue à ce jour.

AKS Inscriptions doit donc prévoir un import manuel contrôlé :

1. export de la base SIKADA ;
2. dépôt du fichier dans l’administration ;
3. analyse sans modification immédiate des dossiers ;
4. nettoyage du format ;
5. rapprochement des personnes ;
6. rapport de correspondances certaines, ambiguës, absentes ou contradictoires ;
7. validation explicite de l’import ;
8. écriture des numéros FFK ;
9. journalisation de l’opération et de sa source.

L’export audité comporte 136 lignes et 12 colonnes. Le fichier portant l’extension `.xls` est en réalité un texte tabulé encodé en Windows-1252, avec certaines valeurs enveloppées sous la forme `="..."`. Toutes les lignes de cet échantillon concernent le style `SHOTOKAN` et le produit `LIC` ; le cas `BODY` n’est donc pas encore couvert par l’échantillon.

Le rapprochement principal repose sur le nom, le prénom et la date de naissance normalisés. Cette combinaison est unique dans l’échantillon audité. Le sexe et la ville peuvent renforcer le contrôle. Aucun rapprochement ambigu ne doit être validé automatiquement.

# 14. Interfaces cibles

## 14.1 Site public WordPress

Le menu `Services en ligne` doit à terme proposer des accès compréhensibles vers :

- Préinscription Karaté classique ;
- Préinscription Cours féminin ;
- Préinscription Body Karaté ;
- Questionnaire santé mineur ;
- Calendrier AKS.

Chaque page de préinscription présente le public, les horaires, les tarifs, les modalités, les pièces attendues, la règle de disponibilité et l’information relative aux données personnelles.

Le périmètre initial n’inclut ni compte personnel, ni espace licencié, ni paiement en ligne.

## 14.2 Centre de pilotage

Une future rubrique `Inscriptions` doit permettre, selon les droits :

- le tableau de bord par section, cours et statut ;
- la liste et la recherche des préinscriptions ;
- le contrôle et la correction d’un dossier ;
- l’affectation automatique ou directe au cours ;
- la détection des doublons ;
- la gestion des capacités et listes d’attente ;
- l’envoi et le suivi des confirmations ;
- la feuille de contrôle de l’inscription physique ;
- le suivi des pièces, règlements, remises et aides ;
- la préparation de la saisie SIKADA ;
- l’import contrôlé des numéros de licence ;
- l’activation du licencié dans les référentiels opérationnels ;
- les exports et l’archivage saisonnier.

# 15. Rôles et droits

Les premiers besoins fonctionnels sont :

| Rôle | Capacités envisagées |
|---|---|
| Administrateur Inscriptions | Contrôle complet, corrections, décisions de place, formalités, règlements, import SIKADA et activation |
| Agent d’inscription | Consultation et mise à jour des dossiers autorisés pendant les inscriptions |
| Encadrement | Consultation limitée des listes et informations strictement nécessaires aux cours concernés |
| Consultation | Lecture des états autorisés, sans modification |

Les intitulés et affectations définitifs restent à valider. Une personne peut cumuler plusieurs responsabilités.

Toutes les autorisations sont contrôlées côté serveur. Masquer une fonction dans l’interface ne constitue pas un contrôle de sécurité. Les corrections d’identité, décisions de place, changements de statut, validations financières et imports SIKADA doivent être audités.

# 16. Données personnelles et protection

Le module traite des données personnelles, y compris celles de mineurs et de leurs responsables légaux. Il doit respecter `SECURITY-001`, `STORAGE-001`, `LOG-001` et `AUDIT-001`.

Les règles minimales sont :

- minimisation des données ;
- finalité explicite ;
- information des personnes ;
- contrôle d’accès selon le moindre privilège ;
- séparation entre données métier, journaux et fichiers sources ;
- absence de données médicales détaillées ;
- absence de données bancaires ;
- conservation et archivage définis avant mise en production ;
- export et suppression contrôlés ;
- traçabilité des actions sensibles ;
- confidentialité équivalente pour les exports et fichiers temporaires.

Les durées de conservation précises, la procédure d’exercice des droits et le traitement des dossiers abandonnés restent à formaliser avant l’implémentation.

# 17. Dépendances

## 17.1 Questionnaire santé

AKS Inscriptions doit pouvoir relier une formalité administrative au dossier Questionnaire santé sans accéder aux réponses détaillées. La stratégie de rapprochement des identifiants sera définie dans le modèle métier et les contrats externes.

## 17.2 Analytics

AKS Inscriptions devient à terme le producteur du référentiel des licenciés actifs par saison et par cours. Analytics reste consommateur en lecture seule conformément à `ANALYTICS-001`.

L’activation ne doit avoir lieu qu’après atteinte du statut métier validé. Les exports existants et les cinq classeurs 2026–2027 restent la réalité opérationnelle tant que la bascule n’est pas développée et validée.

## 17.3 Saisie des présences

Le parcours Présences doit afficher uniquement les licenciés actifs et affectés au cours. La définition exacte de l’état permettant cette exposition doit être commune à Inscriptions et Analytics.

## 17.4 Grades

Le futur module Grades doit référencer l’identifiant interne du licencié. La ceinture déclarée lors d’une nouvelle inscription ne constitue pas un grade validé et ne doit pas alimenter automatiquement un historique de grades.

## 17.5 Services transverses

Le module s’appuiera sur AKS Core, le Centre de pilotage, le paramétrage, les notifications, la journalisation, l’audit, la sécurité, le stockage et les contrats d’interface existants. Aucun service commun ne doit être dupliqué dans le module.

## 17.6 Frontières architecturales initiales

AKS Inscriptions est la future source de vérité des personnes gérées par le club et de leurs dossiers saisonniers.

Les responsabilités initiales sont séparées ainsi :

- les Google Forms restent les sources opérationnelles officielles d’entrée pendant la transition, puis les formulaires AKS Platform prendront le relais après reprise validée ;
- AKS Inscriptions contrôle, normalise et conserve la version métier du dossier ;
- SIKADA reste la source fédérale de création et d’état des licences ;
- AKS Inscriptions importe uniquement les données fédérales nécessaires après validation ;
- Analytics et Présences consomment les licenciés activés sans devenir propriétaires de leurs données ;
- Questionnaire santé reste propriétaire de son parcours et n’expose pas les réponses détaillées ;
- WordPress présente les accès et informations publiques sans devenir un stockage métier ;
- AKS Core fournit les services transverses et les contrôles communs.

Le support de stockage et les contrats techniques détaillés ne sont pas décidés dans `INSCRIPTIONS-001`. Ils devront préserver la source de vérité, la portabilité, la réversibilité et la séparation entre données métier, imports, journaux et documents.

# 18. Périmètre initial retenu

Le périmètre fonctionnel engagé couvre :

- le référentiel Licencié et les dossiers saisonniers ;
- la reprise contrôlée, complète et relançable des réponses Google Forms des trois parcours de préinscription ;
- le contrôle et la correction des données ;
- l’affectation et la capacité des cours ;
- les confirmations par courriel ;
- le suivi administratif, des pièces et des règlements ;
- la préparation de la licence FFK ;
- l’import SIKADA des numéros de licence ;
- l’activation vers Analytics et Présences ;
- la sécurité, la traçabilité, l’archivage et la réversibilité nécessaires.

# 19. Exclusions et reports

Sont explicitement exclus du périmètre initial :

- le paiement en ligne ;
- une intégration HelloAsso ;
- une synchronisation directe avec SIKADA ;
- un compte ou espace licencié ;
- la conservation des réponses médicales détaillées ;
- l’attribution automatique d’un grade à partir d’une ceinture déclarée ;
- la remise à niveau exhaustive des anciens classeurs destinés à être remplacés ;
- une refonte générale de WordPress sans lien direct avec les inscriptions.

# 20. Incréments prévisionnels

Le socle documentaire respecte `STD-001` :

1. `INSCRIPTIONS-001` — vision, cadrage fonctionnel et frontières architecturales.
2. `INSCRIPTIONS-002` — modèle Licencié, Dossier saisonnier, Saison, responsables légaux et statuts.
3. `INSCRIPTIONS-003` — services métier, orchestration et transitions.
4. `INSCRIPTIONS-004` — interfaces publiques et administratives.
5. `INSCRIPTIONS-005` — contrats externes : formulaires, Questionnaire santé, SIKADA, Analytics et Présences.
6. `INSCRIPTIONS-006` — stratégie de validation, jeux d’essai et recette cumulative.

Les besoins spécialisés pourront ensuite être documentés à partir de `INSCRIPTIONS-007`, sans remplacer le socle :

7. import idempotent, reprise et normalisation des réponses Google Forms des trois parcours ;
8. contrôle, doublons, capacités et affectation aux cours ;
9. confirmations et notifications ;
10. inscription physique, pièces et formalités ;
11. cotisations, règlements, remises et aides ;
12. préparation FFK et import SIKADA ;
13. activation Analytics et Présences ;
14. documentation d’exploitation et publication maîtrisée.

# 21. Informations restant à confirmer

Avant l’implémentation, il reste à fixer :

- les documents Body Karaté à jour ;
- les horaires, tarifs, capacités et pièces applicables à chaque parcours ;
- la règle médicale exacte des renouvellements ;
- les statuts et transitions définitifs ;
- les rôles nominatifs et les périmètres de cours ;
- les règles de conservation, archivage et suppression ;
- les règles précises de calcul des cotisations, remises, échéances et aides ;
- les modalités de gestion d’un renouvellement et de rapprochement avec un licencié existant ;
- les clés de rapprochement et le comportement détaillé en cas de doublon entre plusieurs formulaires ;
- le format d’un futur export SIKADA contenant le produit ou le style Body Karaté.

Ces points sont des entrées des incréments suivants. Ils n’invalident pas la décision de créer un module unique.

# 22. Critères d’acceptation d’INSCRIPTIONS-001

Le cadrage est validable lorsque :

- le module unique et les trois parcours sont confirmés ;
- le workflow actuel et ses limites sont documentés ;
- la préinscription ouverte toute la saison et obligatoire pour les nouvelles inscriptions est actée ;
- la règle d’affectation 2026–2027 est consignée ;
- la distinction Licencié / Dossier saisonnier / numéro FFK est définie ;
- les principes de suivi des places, pièces, règlements et formalités sont posés ;
- la décision médicale du club pour les nouveaux licenciés est consignée ;
- l’import SIKADA manuel contrôlé est cadré ;
- la transition depuis les trois Google Forms et la reprise sans perte ni doublon sont cadrées ;
- les rôles, protections des données et dépendances sont identifiés ;
- les exclusions et informations ouvertes sont explicites ;
- `INDEX-001`, `ROADMAP-001` et le `README.md` sont alignés ;
- aucun code applicatif ni aucune donnée réelle n’est modifié.

# 23. Décisions validées

1. AKS Inscriptions est un module unique alimenté par trois formulaires distincts.
2. Le référentiel sépare la personne stable de son dossier saisonnier.
3. La préinscription reste ouverte toute la saison et est obligatoire pour toute nouvelle inscription.
4. La place est recherchée dans la mesure des capacités disponibles et peut conduire à une liste d’attente.
5. Le cours classique est calculé selon la table 2026–2027 ; Féminin et Body sont déterminés par le formulaire.
6. L’expérience et la ceinture déclarée sont demandées aux nouveaux inscrits sans attribution automatique de grade.
7. Le club demande un certificat médical à tout nouveau licencié.
8. Le sac n’est pas suivi dans la feuille de contrôle classique.
9. SIKADA reste la source fédérale ; le numéro de licence est importé après création et ne devient pas l’identifiant interne.
10. Aucun paiement en ligne ni espace licencié n’est inclus dans le périmètre initial.
11. Analytics et Présences consommeront uniquement les licenciés activés selon un état métier validé.
12. Les trois Google Forms restent officiels jusqu’à la mise en production des formulaires AKS Platform ; toutes leurs réponses seront reprises par un import relançable, contrôlé et sans doublon.

# 24. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.2 | 2026-08-02 | Validation formelle du cadrage après fusion de la PR #89 dans `develop` et ouverture du modèle métier `INSCRIPTIONS-002` |
| 1.0.1 | 2026-08-02 | Ajout de la transition Google Forms : maintien opérationnel des trois sources et reprise complète, contrôlée, relançable et sans doublon dans AKS Inscriptions |
| 1.0.0 | 2026-08-02 | Cadrage initial issu de l’audit des formulaires, classeurs, documents FFKDA et export SIKADA, puis des décisions validées par le Product Owner |
