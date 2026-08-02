# INSCRIPTIONS-003 — Services, transitions et reprise Google Forms

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-003 |
| **Version** | 1.0.1 |
| **Statut** | Validé |
| **Nature** | Services métier et contrat de reprise transitoire |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-02 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit les services, commandes et transitions d’**AKS Inscriptions**, ainsi que le contrat de reprise des trois Google Forms utilisés pendant la période transitoire.

Il traduit le cadrage `INSCRIPTIONS-001` et le modèle métier `INSCRIPTIONS-002` en comportements contrôlables, sans définir encore l’interface utilisateur finale ni autoriser un développement applicatif.

Les Google Forms et leurs feuilles de réponses restent inchangés et opérationnels jusqu’à une bascule explicitement validée.

## 2. Sources auditées

L’analyse en lecture seule du 2 août 2026 porte sur les feuilles de réponses officielles de la saison 2026–2027.

| Source logique | Onglet | Champs utiles observés | Réponses observées | Section cible |
|---|---|---:|---:|---|
| `GF_CLASSIQUE_2026_2027` | `Réponses au formulaire 1` | 22 | 108 | `KARATE_CLASSIQUE` |
| `GF_FEMININ_2026_2027` | `Réponses au formulaire 1` | 15 | 13 | `FEMININ` |
| `GF_BODY_2026_2027` | `Réponses au formulaire 1` | 14 | 0 | `BODY_KARATE` |

Les trois classeurs utilisent actuellement le fuseau `Africa/Ceuta`. AKS Platform doit interpréter et enregistrer les dates métier selon le fuseau officiel `Europe/Paris`, tout en conservant la valeur source reçue.

Le nombre de réponses est un constat daté et non une constante du contrat.

## 3. Principes de reprise

1. Chaque source possède un adaptateur identifié et versionné.
2. La réponse brute reste consultable dans sa source Google ; elle n’est pas réécrite par l’import.
3. Une valeur absente parce qu’un formulaire ne contient pas la question n’est jamais transformée en `NON`, `FAUX` ou chaîne vide validée.
4. La normalisation conserve la valeur source et produit séparément une valeur canonique.
5. L’analyse ne modifie aucun licencié, dossier, place ou état opérationnel.
6. L’application exige une validation administrative explicite.
7. Une relance du même périmètre ne recrée ni licencié ni dossier.
8. Une correspondance ambiguë n’est jamais fusionnée automatiquement.
9. Une correction métier déjà validée n’est jamais écrasée silencieusement par une nouvelle lecture de la source.
10. Les journaux techniques ne reproduisent pas les données nominatives des réponses.

## 4. Enveloppe canonique d’une réponse

Chaque adaptateur produit un objet intermédiaire `PreinscriptionCanonique` avant toute recherche de licencié.

| Groupe | Attributs principaux |
|---|---|
| Provenance | `source_code`, `adapter_version`, `source_tab`, `source_row`, `source_received_at`, `external_key`, `source_fingerprint` |
| Parcours | `saison_id`, `section_code`, `type_parcours` |
| Identité | nom, prénom, date et lieu de naissance, sexe, nationalité |
| Coordonnées | adresse électronique, téléphone, adresse, code postal, ville |
| Responsables | père, mère ou responsables déclarés et leurs téléphones |
| Expérience | pratique antérieure, ceinture déclarée, ancienne inscription AKS |
| Communication | origine de découverte du club, autorisation d’image |
| Contrôle | champs manquants, anomalies, avertissements et version de normalisation |

`type_parcours` vaut `RENOUVELLEMENT`, `NOUVEAU` ou `A_DETERMINER`. Une source incomplète ne doit pas forcer arbitrairement cette valeur.

## 5. Clé externe et idempotence

Les feuilles auditées n’exposent pas de manière fiable un identifiant Google Forms stable dans leurs colonnes visibles. Le contrat utilise donc deux niveaux.

### 5.1 Clé préférée

Si un identifiant de réponse stable devient disponible par une API ou une évolution contrôlée de la source, la clé est :

`source_code + form_id + response_id`

### 5.2 Clé transitoire

À défaut, l’adaptateur construit :

- une localisation `source_code + source_tab + source_row` ;
- une empreinte déterministe des valeurs brutes normalisées de la ligne ;
- l’horodateur source ;
- la version de l’adaptateur.

La localisation seule ne suffit pas, car une ligne peut être déplacée. L’empreinte seule ne suffit pas non plus, car deux envois réellement distincts peuvent être identiques. Toute modification d’une ligne déjà analysée produit un écart à contrôler, pas une nouvelle création automatique.

## 6. Adaptateur Karaté classique

### 6.1 Cartographie observée

| Champ Google Forms | Cible canonique | Règle |
|---|---|---|
| Horodateur | `source_received_at` | Interpréter dans le fuseau source puis convertir vers `Europe/Paris` |
| Adresse e-mail | `email_principal` | Normaliser sans modifier la valeur brute |
| Déjà inscrit saison 2025–2026 | `ancienne_inscription_aks` | Valeur source versionnée ; déduit le parcours seulement si non ambigu |
| Ceinture de la saison précédente | `ceinture_ancienne_aks` | Ne vaut pas ceinture déclarée d’un nouveau pratiquant |
| Comment avez-vous trouvé le club ? | `origine_contact` | Valeur informative |
| Nom, prénom | Identité | Normalisation typographique contrôlée |
| Sexe | `sexe` | Valeur administrative source |
| Date et lieu de naissance | Identité | Date contrôlée, lieu conservé en texte |
| Nationalité | `nationalite` | Valeur administrative source |
| Adresse, code postal, ville | Adresse | Contrôles de cohérence non bloquants avant validation |
| Téléphone de la personne inscrite | `telephone_principal` | Stocké comme texte |
| Nom, prénom et téléphone du père | Responsable déclaré | Créer ou rapprocher uniquement après contrôle |
| Nom, prénom et téléphone de la mère | Responsable déclaré | Créer ou rapprocher uniquement après contrôle |
| Autorisation d’image | `autorisation_image` | Conserver la formulation et la réponse source |

### 6.2 Lacune fonctionnelle

Le formulaire ne demande pas encore correctement aux **nouveaux inscrits** s’ils ont déjà pratiqué et quelle ceinture ils ont obtenue. La colonne de ceinture actuelle concerne la saison précédente à AKS.

Pour un nouveau dossier, l’adaptateur produit donc `pratique_anterieure = INCONNUE` et `ceinture_declaree = INCONNUE`, puis classe le dossier `A_CONTROLER` tant que ces informations n’ont pas été recueillies.

### 6.3 Affectation

L’adaptateur fixe `section_code = KARATE_CLASSIQUE`. Le service d’affectation calcule ensuite le cours proposé à partir de la table saisonnière définie dans `INSCRIPTIONS-002`; l’import ne déduit jamais directement le cours du libellé du formulaire.

## 7. Adaptateur Cours féminin

### 7.1 Cartographie observée

Le formulaire féminin reprend les champs suivants du parcours classique : horodateur, adresse électronique, renouvellement 2025–2026, ceinture précédente, origine de découverte, identité, naissance, nationalité, adresse, téléphone et autorisation d’image.

Il ne contient pas de champ explicite pour :

- le sexe ;
- les responsables légaux ;
- la pratique antérieure d’une nouvelle inscrite ;
- la ceinture obtenue hors renouvellement AKS.

### 7.2 Règles

- `section_code = FEMININ` et `cours_propose = FEMININ` ;
- l’absence de champ `sexe` reste une absence de donnée et n’est pas déduite du nom du parcours ;
- une personne mineure ou une situation nécessitant un responsable est classée `A_CONTROLER` ;
- pour une nouvelle inscrite, pratique antérieure et ceinture déclarée restent `INCONNUE` jusqu’au contrôle ;
- la ceinture de la saison précédente n’est utilisée que comme information de renouvellement AKS.

## 8. Adaptateur Body Karaté

### 8.1 Cartographie observée

| Champ Google Forms | Cible canonique | Particularité |
|---|---|---|
| Horodateur | `source_received_at` | Conversion de fuseau contrôlée |
| Adresse e-mail | `email_principal` | Texte normalisé |
| Comment avez-vous trouvé le club ? | `origine_contact` | Valeur informative |
| Nom, prénom | Identité | Contrôle standard |
| Date de naissance | `date_naissance` | Date contrôlée |
| Lieu de naissance | `lieu_naissance` | Texte source |
| Pays de naissance | `pays_naissance` | Champ propre au Body Karaté |
| Nationalité | `nationalite` | Valeur administrative source |
| Adresse, code postal, ville | Adresse | Contrôles standard |
| Téléphone | `telephone_principal` | Texte |
| Autorisation d’image | `autorisation_image` | Conserver la réponse source |

### 8.2 Données absentes

Le formulaire Body Karaté ne contient actuellement ni renouvellement, ni pratique antérieure, ni ceinture, ni sexe, ni responsable légal.

L’adaptateur fixe `section_code = BODY_KARATE` et `cours_propose = BODY_KARATE`, mais laisse ces autres informations à `INCONNUE` ou `NON_RENSEIGNEE`. Il ne peut pas décider seul si le dossier est nouveau ou renouvelé.

Comme aucune réponse réelle n’était présente lors de l’audit, cet adaptateur doit être validé avec des données de recette avant sa première application en production.

## 9. Normalisations communes

| Donnée | Normalisation canonique | Contrôle |
|---|---|---|
| Nom et prénom | espaces normalisés, comparaison insensible à la casse et aux accents | la graphie source reste conservée |
| Adresse électronique | espaces retirés, casse neutralisée pour comparaison | format signalé sans suppression de la source |
| Téléphone | texte, espaces et ponctuation normalisés pour comparaison | aucun type numérique |
| Date de naissance | date ISO interne après lecture stricte `jj/mm/aaaa` | date impossible bloquante |
| Code postal | texte | zéros initiaux préservés |
| Oui/Non | code canonique versionné | valeur inconnue distincte de `NON` |
| Ceinture | vocabulaire canonique contrôlé | valeur libre conservée si non reconnue |
| Horodateur | instant et fuseau source conservés | projection métier `Europe/Paris` |

## 10. Rapprochement des personnes et dossiers

Le service classe chaque réponse dans une seule catégorie.

| Résultat | Signification | Écriture automatique autorisée |
|---|---|---|
| `CERTAIN` | Une seule personne correspond avec des clés fortes concordantes | Non pendant l’analyse ; oui après validation du lot |
| `PROBABLE` | Correspondance vraisemblable nécessitant un contrôle | Non |
| `AMBIGU` | Plusieurs personnes ou données contradictoires | Non |
| `ABSENT` | Aucun licencié existant identifié | Création proposée, jamais appliquée sans validation |

Les clés fortes combinent prioritairement nom, prénom et date de naissance, puis le numéro FFKDA lorsqu’il existe. Le sexe, la ville, l’adresse électronique et le téléphone sont des éléments de confirmation, pas des identifiants autonomes.

Deux identités apparaissent plusieurs fois dans la source classique auditée. Elles doivent être signalées comme doublons potentiels et présentées au contrôle sans fusion automatique. Aucun doublon entre sections n’a été détecté à la date de l’audit ; une même personne inscrite dans plusieurs sections reste néanmoins un cas métier valide.

Après rapprochement du licencié, le service recherche le dossier par `licencie_id + saison_id + section_code`. Un nouvel envoi pour la même combinaison devient une correction proposée ou un doublon, pas un second dossier automatique.

## 11. Services et commandes

| Commande | Effet attendu | Écriture métier |
|---|---|---|
| `ANALYSER_SOURCE_GOOGLE_FORMS` | Lit un périmètre borné, adapte, normalise et contrôle | Aucune |
| `GENERER_RAPPORT_IMPORT` | Produit les totaux et anomalies du lot | Rapport et journal technique minimisé |
| `VALIDER_CORRESPONDANCE` | Confirme le licencié ou autorise une création | Décision de contrôle uniquement |
| `REJETER_REPONSE` | Exclut une réponse avec motif | État du lot et audit |
| `APPLIQUER_LOT_IMPORT` | Crée ou complète les objets autorisés | Oui, après validation explicite |
| `REJOUER_ANALYSE` | Recalcule avec le même ou un nouvel adaptateur | Aucun écrasement automatique |
| `CORRIGER_DOSSIER` | Enregistre une donnée contrôlée | Oui, avec valeur précédente et auteur |
| `PROPOSER_AFFECTATION` | Calcule le cours à partir des règles saisonnières | Proposition seulement |
| `DECIDER_PLACE` | Confirme, met en attente ou refuse une place | Oui, décision auditée |
| `CONFIRMER_PREINSCRIPTION` | Fige les modalités communiquées | Oui, puis notification séparée |
| `FINALISER_INSCRIPTION` | Contrôle les conditions de complétude | Oui, transition conditionnelle |
| `ACTIVER_DOSSIER` | Rend le licencié éligible aux outils opérationnels | Oui, si invariants satisfaits |

Chaque commande sensible possède un identifiant de requête idempotent, un acteur autorisé, une date, un motif lorsque nécessaire et un résultat explicite. Une notification n’est jamais assimilée à la réussite de la commande métier qui la déclenche.

## 12. Transitions du lot d’import

| État initial | Commande | État final possible |
|---|---|---|
| — | `ANALYSER_SOURCE_GOOGLE_FORMS` | `RECU`, puis `ANALYSE` ou `REJETE` |
| `ANALYSE` | `GENERER_RAPPORT_IMPORT` | `A_VALIDER` |
| `A_VALIDER` | Validation de tous les cas requis | `VALIDE` |
| `A_VALIDER` | Rejet administratif | `REJETE` |
| `VALIDE` | `APPLIQUER_LOT_IMPORT` | `APPLIQUE` ou `PARTIEL` |
| `PARTIEL` | Correction puis reprise contrôlée | `APPLIQUE`, `PARTIEL` ou `ANNULE` |

Un lot `APPLIQUE` peut être réanalysé pour contrôle, mais ne revient pas silencieusement à un état permettant de réappliquer les mêmes créations.

## 13. Transitions du dossier

L’import initial crée ou complète un dossier en état administratif `RECUE`. Il passe à `A_CONTROLER` dès qu’une donnée obligatoire manque, qu’un rapprochement est probable ou ambigu, ou qu’une contradiction est détectée.

| Commande | Préconditions principales | Transition administrative |
|---|---|---|
| `CORRIGER_DOSSIER` | Droit administratif, écarts identifiés | `RECUE/A_CONTROLER → CORRIGEE` si tous les contrôles sont levés |
| `DECIDER_PLACE` | Cours proposé et capacité vérifiée | Modifie l’état de place sans forcer l’état administratif |
| `CONFIRMER_PREINSCRIPTION` | Données contrôlées et décision de place compatible | `CORRIGEE → CONFIRMEE` |
| `DEMARRER_INSCRIPTION` | Modalités communiquées | `CONFIRMEE → INSCRIPTION_EN_COURS` |
| `FINALISER_INSCRIPTION` | Formalités et règlement conformes aux règles de saison | `INSCRIPTION_EN_COURS → DOSSIER_COMPLET` |
| `ABANDONNER/ANNULER/REFUSER` | Motif obligatoire | État terminal correspondant |

Les axes place, fédéral et activation évoluent indépendamment selon `INSCRIPTIONS-002`. Une place confirmée ne rend pas le dossier complet ; un dossier complet ne prouve pas que la licence FFKDA est déjà importée.

## 14. Rapport d’analyse obligatoire

Avant application, le rapport présente au minimum :

- source, version d’adaptateur, onglet et périmètre lu ;
- nombre de lignes lues, valides, incomplètes et rejetées ;
- réponses nouvelles, déjà connues et modifiées depuis une précédente analyse ;
- correspondances certaines, probables, ambiguës et absentes ;
- dossiers existants, créations proposées et corrections proposées ;
- doublons potentiels dans une source et entre sources ;
- champs manquants par parcours ;
- anomalies de date, format ou fuseau ;
- nombre d’actions appliquées, ignorées ou échouées après validation.

Le rapport ne doit pas être envoyé par courriel avec un export nominatif non protégé.

## 15. Sécurité, droits et audit

- la lecture des sources est réservée aux administrateurs autorisés ;
- l’analyse peut être confiée à un rôle distinct de l’application ;
- la création, la fusion de licenciés, la décision de place et l’activation exigent des droits explicites ;
- les données nominatives ne sont pas recopiées dans `LOG-001` ;
- les décisions sensibles sont consignées selon `AUDIT-001` ;
- les exports de contrôle suivent `STORAGE-001` et `SECURITY-001` ;
- les erreurs suivent `ERROR-001` sans exposer les contenus de lignes dans les messages publics.

## 16. Limites et dépendances

Le présent document ne :

- modifie pas les trois Google Forms ni leurs feuilles ;
- développe pas l’importeur ;
- fixe pas l’interface d’administration ;
- décide pas les tarifs, capacités et formalités Body Karaté ;
- définit pas encore le contrat SIKADA détaillé ;
- ajoute pas `BODY_KARATE` à Analytics ou Présences ;
- corrige pas encore le format du numéro FFKDA dans Analytics.

L’interface de contrôle relève d’`INSCRIPTIONS-004`. Les contrats externes détaillés, dont SIKADA, Questionnaire santé, Analytics et Présences, relèvent d’`INSCRIPTIONS-005`. La recette cumulative relève d’`INSCRIPTIONS-006`.

## 17. Critères d’acceptation

`INSCRIPTIONS-003` est validable lorsque :

- les trois sources réelles et leurs écarts sont documentés ;
- chaque colonne observée possède une cible ou une exclusion explicite ;
- l’absence d’une question est distincte d’une réponse négative ;
- les nouveaux inscrits sans pratique antérieure ni ceinture déclarée sont placés en contrôle ;
- le contrat d’idempotence ne dépend pas uniquement du numéro de ligne ;
- l’analyse est séparée de l’application ;
- les rapprochements probables et ambigus exigent une décision manuelle ;
- les commandes et transitions respectent les quatre axes d’état ;
- le Body Karaté exige une recette avant première application ;
- les dates sont normalisées vers `Europe/Paris` en conservant le fuseau source ;
- aucun code applicatif ni aucune ressource Google n’est modifié.

## 18. Décisions structurantes

1. Un adaptateur versionné est utilisé pour chaque parcours Google Forms.
2. La donnée absente reste inconnue et ne devient jamais implicitement négative.
3. Le formulaire classique et le formulaire féminin ne couvrent pas encore correctement la pratique antérieure et la ceinture des nouveaux inscrits.
4. Le formulaire Body Karaté ne permet pas de déterminer seul un renouvellement.
5. La clé d’idempotence transitoire combine provenance, localisation et empreinte ; un identifiant de réponse stable reste la cible préférée.
6. Toute ambiguïté de personne ou de dossier exige une validation manuelle.
7. L’application d’un lot est une commande distincte de son analyse.
8. Les Google Forms restent opérationnels et inchangés jusqu’à validation de la bascule.

## 19. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-08-02 | Validation du contrat et ouverture d’INSCRIPTIONS-004 consacré aux interfaces et aux accès privés transverses |
| 1.0.0 | 2026-08-02 | Création des services, commandes, transitions et contrats de reprise versionnés des trois Google Forms 2026–2027 |
