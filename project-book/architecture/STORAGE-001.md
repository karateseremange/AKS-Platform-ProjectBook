# STORAGE-001

# Stratégie de stockage d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | STORAGE-001 |
| **Titre** | Stratégie de stockage d'AKS Platform |
| **Version** | 1.2.1 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-24 |
| **Version du produit** | V1.1 |
| **Classification** | Architecture transverse |

---

# 1. Objet

Le présent document définit la stratégie de stockage transverse d'AKS Platform.

Il encadre le stockage des données métier, des paramètres, des journaux, des événements d'audit, des fichiers générés, des métadonnées documentaires, des caches et des sauvegardes.

Il constitue la référence normative applicable à tout composant qui crée, lit, modifie, conserve, archive, restaure, exporte ou supprime une ressource persistante.

---

# 2. Position dans le Project Book

`STORAGE-001` s'inscrit sous l'autorité de :

- `ADR-001` — Registre des décisions d'architecture ;
- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — Architecture d'AKS Core ;
- `SECURITY-001` — Principes de sécurité.

Il complète notamment :

- `CONFIG-001` — Paramétrage centralisé ;
- `LOG-001` — Journalisation ;
- `AUDIT-001` — Journal d'audit ;
- `DOCUMENT-001` — Gestion des documents générés ;
- `ERROR-001` — Gestion des erreurs ;
- `ADMIN-001` — Administration.

Les documents spécialisés définissent les règles propres à leur domaine sans réduire les exigences du présent document.

`STORAGE-001` ne définit pas les règles métier propres aux données. Celles-ci restent sous la responsabilité des modules concernés.

---

# 3. Objectifs

La stratégie de stockage doit permettre de :

- garantir l'intégrité et la disponibilité des données ;
- identifier une source de vérité pour chaque information ;
- séparer clairement les catégories de stockage ;
- éviter les dépendances directes des modules à une technologie ;
- appliquer des règles de conservation explicites ;
- protéger les données personnelles et les secrets ;
- faciliter les sauvegardes, restaurations et migrations ;
- limiter la duplication et la dette technique ;
- permettre l'évolution progressive de l'infrastructure ;
- garantir la portabilité et la réversibilité des données utiles.

---

# 4. Principes directeurs

Le stockage respecte les principes suivants :

- abstraction du support physique ;
- source de vérité identifiée pour chaque donnée ;
- distinction entre donnée de référence, copie technique, cache et sauvegarde ;
- séparation entre données, fichiers, journaux et cache ;
- minimisation des données ;
- chiffrement adapté à la sensibilité ;
- contrôle d'accès côté serveur ;
- traçabilité des opérations sensibles ;
- conservation limitée et documentée ;
- sauvegarde testée ;
- restauration contrôlée ;
- portabilité et réversibilité ;
- refus explicite des écritures partielles ou ambiguës.

Une copie technique, un export, un journal ou une sauvegarde ne devient jamais implicitement la source de vérité.

---

# 5. Catégories de stockage

## 5.1 Données métier

Les données métier structurées sont conservées dans un stockage adapté aux besoins transactionnels du module.

Elles comprennent notamment :

- les entités fonctionnelles ;
- les états des processus ;
- les relations entre objets ;
- les historiques métier nécessaires ;
- les références vers les documents et services externes.

Le module ne doit pas stocker directement de fichier binaire dans une structure métier, sauf justification technique explicite.

Chaque module doit documenter la source de vérité de ses principales entités.

## 5.2 Paramètres

Les paramètres sont stockés conformément à `CONFIG-001`.

Les secrets sont séparés des paramètres fonctionnels et ne doivent pas être exposés dans l'administration, les journaux ou le code source.

## 5.3 Journaux techniques

Les journaux sont stockés conformément à `LOG-001`.

Ils ne constituent ni une base métier secondaire, ni un mécanisme de sauvegarde.

## 5.4 Audit

Les événements d'audit sont conservés conformément à `AUDIT-001`, dans un support protégeant leur intégrité et limitant leur modification.

## 5.5 Documents et fichiers

Les documents générés sont stockés conformément à `DOCUMENT-001`.

Le stockage conserve les fichiers indépendamment de leurs métadonnées fonctionnelles. Les modules utilisent un identifiant logique et ne dépendent pas d'un chemin physique.

## 5.6 Cache

Le cache contient uniquement des données reconstructibles.

Sa perte ne doit jamais entraîner une perte fonctionnelle définitive. Il ne constitue pas une source de vérité.

La durée de vie, les règles d'invalidation et le comportement en cas d'indisponibilité doivent être documentés.

## 5.7 Sauvegardes

Les sauvegardes sont stockées séparément des données actives et protégées contre une suppression ou altération simultanée.

Une sauvegarde est une copie de reprise et non une source d'exploitation courante.

## 5.8 Exports et copies temporaires

Les exports, fichiers intermédiaires et copies temporaires doivent :

- avoir une finalité documentée ;
- disposer d'une durée de vie limitée ;
- respecter les mêmes règles de confidentialité que leur source ;
- être supprimés lorsqu'ils ne sont plus nécessaires ;
- ne pas devenir une source de vérité parallèle.

---

# 6. Abstraction du stockage

Les modules accèdent au stockage au moyen de services ou interfaces documentés.

Ils ne doivent pas :

- coder en dur des chemins physiques ;
- dépendre directement d'un fournisseur externe ;
- manipuler des identifiants propres à l'infrastructure hors de la couche d'intégration ;
- contourner les contrôles d'accès ;
- créer un stockage parallèle non documenté ;
- exposer le support physique dans leur contrat fonctionnel.

Cette abstraction doit permettre de changer de technologie sans modifier les règles métier.

AKS Core fournit ou orchestre les capacités communes lorsque plusieurs modules partagent le même besoin de stockage.

---

# 7. Identifiants et références

Chaque ressource stockée possède un identifiant logique stable.

Les références doivent :

- être non ambiguës ;
- ne contenir aucun secret ;
- éviter les données personnelles directement lisibles ;
- rester indépendantes de l'emplacement physique ;
- permettre la corrélation avec les journaux et l'audit ;
- rester stables pendant toute la durée de vie fonctionnelle de la ressource.

Un nom de fichier, une URL ou un chemin ne constitue jamais une autorisation.

---

# 8. Intégrité

L'intégrité est protégée par des contrôles adaptés :

- contraintes de structure ;
- validation avant écriture ;
- transactions lorsque nécessaire ;
- empreintes cryptographiques pour les fichiers finalisés ;
- contrôle des versions concurrentes ;
- journalisation des échecs ;
- vérifications périodiques lorsque justifiées ;
- détection des écritures partielles ;
- contrôle du résultat après migration ou restauration.

Une écriture partielle ne doit jamais être présentée comme réussie.

Lorsque plusieurs ressources doivent évoluer ensemble, le traitement doit garantir leur cohérence ou fournir un mécanisme de compensation documenté.

---

# 9. Confidentialité et sécurité

Le stockage respecte `SECURITY-001`.

Les mesures applicables comprennent notamment :

- contrôle d'accès selon le moindre privilège ;
- chiffrement des échanges ;
- chiffrement au repos lorsque nécessaire ;
- séparation des environnements ;
- masquage des secrets ;
- interdiction des liens publics permanents pour les données sensibles ;
- limitation des accès administratifs directs ;
- audit des opérations sensibles ;
- révocation des accès devenus inutiles ;
- absence de secret dans les identifiants, chemins ou métadonnées visibles.

Tout accès direct au support physique doit rester exceptionnel, autorisé et traçable.

---

# 10. Données personnelles

Les données personnelles sont stockées uniquement lorsqu'elles sont nécessaires à une finalité documentée.

Pour chaque catégorie, il convient de définir :

- la finalité ;
- la source ;
- les personnes autorisées ;
- la durée de conservation ;
- les conditions de rectification ;
- les conditions de suppression ou d'anonymisation ;
- les obligations de sauvegarde éventuelles ;
- le responsable fonctionnel.

La duplication de données personnelles entre modules doit être évitée.

Les réponses détaillées au questionnaire de santé ne doivent jamais être stockées lorsque seule la décision administrative est nécessaire.

---

# 11. Conservation

Chaque catégorie de données ou de fichier possède une règle de conservation explicite.

Cette règle précise :

- la durée d'utilisation courante ;
- la durée d'archivage ;
- les conditions d'expiration ;
- la méthode de suppression ;
- les éventuelles obligations administratives ou légales ;
- le responsable fonctionnel ;
- les conséquences sur les sauvegardes et copies secondaires.

Une donnée ne doit pas être conservée indéfiniment par défaut.

Toute exception à une durée de conservation doit être documentée, justifiée et approuvée par le Product Owner.

---

# 12. Suppression et anonymisation

La suppression doit être :

- autorisée ;
- contrôlée ;
- traçable ;
- appliquée à toutes les copies actives concernées ;
- répercutée sur les fichiers et métadonnées selon la politique applicable ;
- vérifiée lorsque l'opération présente un enjeu particulier.

Lorsque la suppression complète n'est pas immédiatement possible en raison des sauvegardes, la donnée ne doit pas être restaurée dans un usage actif après expiration de la période de rétention.

L'anonymisation doit être irréversible pour être considérée comme une suppression de donnée personnelle.

Une suppression logique ne remplace pas une suppression définitive lorsque cette dernière est requise.

---

# 13. Sauvegardes

La politique de sauvegarde doit définir :

- les données couvertes ;
- la fréquence ;
- la durée de rétention ;
- le lieu de conservation ;
- le chiffrement ;
- les responsabilités ;
- la procédure de restauration ;
- la fréquence des tests de restauration ;
- les modalités de contrôle des sauvegardes échouées ;
- les objectifs réalistes de perte de données et de remise en service lorsqu'ils sont nécessaires.

Une sauvegarde non testée ne peut pas être considérée comme une garantie de restauration.

Les sauvegardes doivent rester distinctes des environnements personnels sans lien avec AKS Platform.

---

# 14. Restauration

Toute restauration doit être préparée, autorisée et contrôlée.

La procédure doit notamment :

- identifier le périmètre ;
- vérifier la cohérence de la sauvegarde ;
- identifier le point de restauration retenu ;
- limiter l'écrasement de données plus récentes ;
- préserver les règles de sécurité ;
- produire une trace d'audit ;
- vérifier le résultat technique et fonctionnel ;
- documenter les éventuelles pertes de données ;
- prévoir un retour arrière lorsque cela est possible.

Une restauration ne doit pas réintroduire une donnée supprimée ou expirée dans l'usage actif sans contrôle spécifique.

---

# 15. Continuité et disponibilité

Le niveau de disponibilité attendu dépend de la criticité du service.

La conception doit prévoir :

- des erreurs explicites en cas d'indisponibilité ;
- des reprises idempotentes ;
- une limitation des écritures concurrentes ;
- une surveillance de la capacité ;
- des seuils d'alerte ;
- une procédure de remise en service ;
- l'identification des dépendances externes critiques.

Aucune promesse de haute disponibilité ne doit être formulée sans architecture et procédure correspondantes.

---

# 16. Capacité et quotas

La capacité doit être suivie pour les catégories susceptibles de croître :

- documents ;
- journaux ;
- événements d'audit ;
- sauvegardes ;
- exports ;
- caches.

Des seuils configurables peuvent produire des alertes avant saturation.

La saturation d'un stockage ne doit pas entraîner silencieusement une perte de données.

Les traitements doivent distinguer clairement une limite fonctionnelle d'un quota technique.

---

# 17. Environnements

Les environnements de développement, test et production utilisent des espaces de stockage séparés.

Il est interdit de :

- mélanger les données de production et de test ;
- utiliser des données personnelles réelles sans procédure encadrée ;
- partager des secrets entre environnements ;
- permettre à un environnement non productif d'écrire dans le stockage de production ;
- restaurer automatiquement une sauvegarde de production dans un environnement non productif.

Lorsque des données de production sont exceptionnellement nécessaires pour un test, elles doivent être minimisées, anonymisées ou pseudonymisées selon le besoin.

---

# 18. Services externes

Lorsqu'un fournisseur externe est utilisé, son intégration doit documenter :

- les données transmises ;
- leur localisation lorsque pertinente ;
- les mécanismes d'authentification ;
- les durées de conservation ;
- les possibilités d'export ;
- les modalités de suppression ;
- la stratégie de migration ou de remplacement ;
- les limites et quotas ;
- les responsabilités respectives ;
- les conditions de révocation de l'accès.

Le fournisseur ne doit pas devenir une dépendance implicite du module métier.

---

# 19. Migration et réversibilité

Toute technologie de stockage doit permettre une extraction documentée des données utiles.

Une migration doit prévoir :

- l'inventaire des données ;
- l'identification des sources de vérité ;
- la correspondance des structures ;
- la vérification d'intégrité ;
- la conservation des identifiants utiles ;
- la reprise des droits ;
- la reprise des politiques de conservation ;
- la reprise des métadonnées nécessaires ;
- un plan de retour arrière ;
- une validation technique et fonctionnelle ;
- le traitement des copies devenues obsolètes.

Une migration n'est achevée qu'après validation du résultat et désignation explicite de la nouvelle source de vérité.

---

# 20. Journalisation et audit

Les opérations suivantes doivent être journalisées ou auditées selon leur nature :

- échec d'écriture ou de lecture ;
- saturation ou quota atteint ;
- suppression administrative ;
- restauration ;
- migration ;
- modification d'une règle de conservation ;
- accès sensible ;
- changement de configuration ;
- détection d'une anomalie d'intégrité ;
- opération directe sur le support physique.

Les journaux ne doivent pas reproduire le contenu complet des données stockées.

La journalisation suit `LOG-001` et les actions nécessitant une preuve renforcée suivent `AUDIT-001`.

---

# 21. Administration

Le tableau de bord peut présenter :

- l'état des supports ;
- la capacité utilisée ;
- les quotas ;
- les erreurs récentes ;
- les sauvegardes disponibles ;
- la date du dernier test de restauration ;
- les opérations de maintenance ;
- les politiques de conservation actives ;
- les alertes liées aux capacités ou aux sauvegardes.

Les opérations dangereuses nécessitent une confirmation et une autorisation renforcée.

L'administration ne doit jamais exposer un secret, un chemin sensible ou une donnée personnelle non nécessaire.

---

# 22. Erreurs

Les erreurs de stockage suivent `ERROR-001`.

Elles distinguent au minimum :

- ressource introuvable ;
- accès interdit ;
- capacité insuffisante ;
- quota dépassé ;
- écriture échouée ;
- lecture échouée ;
- intégrité invalide ;
- fournisseur indisponible ;
- restauration échouée ;
- conflit de version ;
- règle de conservation invalide.

Les erreurs temporaires peuvent être retentées uniquement lorsque l'opération est idempotente ou protégée contre la duplication.

---

# 23. Responsabilités

## 23.1 AKS Core

AKS Core est responsable :

- des interfaces communes de stockage ;
- des contrôles transverses ;
- de la cohérence des identifiants et références ;
- de l'intégration avec la journalisation et l'audit ;
- des fonctions communes de sauvegarde, restauration ou export lorsqu'elles sont mutualisées.

## 23.2 Modules métier

Chaque module est responsable :

- de l'identification de ses sources de vérité ;
- de la définition de ses données métier ;
- de la minimisation et de la conservation ;
- de l'utilisation des services communs ;
- de l'absence de stockage parallèle non documenté ;
- de la validation fonctionnelle après migration ou restauration.

## 23.3 Administration

Les administrateurs autorisés sont responsables :

- de l'exécution contrôlée des opérations sensibles ;
- du suivi des erreurs, quotas et sauvegardes ;
- du respect des procédures de restauration ;
- de la confidentialité des informations consultées.

## 23.4 Product Owner

Le Product Owner valide :

- les politiques de conservation ;
- les exceptions ;
- les migrations importantes ;
- les choix ayant un impact sur la sécurité, la réversibilité ou les coûts ;
- l'acceptation finale d'une restauration ou migration majeure.

---

# 24. Tests

Les tests couvrent notamment :

- écriture et lecture ;
- contrôles d'accès ;
- concurrence ;
- intégrité ;
- expiration et suppression ;
- saturation ;
- indisponibilité d'un fournisseur ;
- sauvegarde et restauration ;
- migration ;
- absence de fuite entre environnements ;
- conservation des identifiants logiques ;
- non-réintroduction de données expirées après restauration ;
- comportement des caches et copies temporaires.

---

# 25. Critères d'acceptation

Un stockage est conforme lorsque :

- sa catégorie et sa source de vérité sont identifiées ;
- les copies techniques, caches et sauvegardes sont distingués de la source de vérité ;
- son accès est abstrait et documenté ;
- les contrôles d'accès sont appliqués côté serveur ;
- les règles de conservation sont définies ;
- les données personnelles sont minimisées ;
- les sauvegardes et restaurations sont documentées et testées ;
- les erreurs sont explicites ;
- les opérations sensibles sont tracées ;
- une stratégie de migration et de réversibilité existe ;
- les identifiants logiques sont préservés lorsque nécessaire ;
- les modules ne dépendent pas du support physique ;
- aucune donnée supprimée ou expirée n'est réintroduite sans contrôle ;
- les environnements restent séparés ;
- les exceptions sont documentées et approuvées.

---

# 26. Éléments exclus

Le présent document ne définit pas :

- une technologie unique de base de données ;
- une architecture de haute disponibilité non justifiée ;
- une infrastructure de stockage d'entreprise ;
- les règles métier détaillées des modules ;
- les valeurs réelles des secrets ;
- la gestion d'environnements personnels sans lien avec AKS Platform.

L'environnement Proxmox personnel du Product Owner est explicitement hors périmètre.

---

# 27. Évolutions prévues

La stratégie pourra évoluer avec :

- l'ajout de nouveaux modules métier ;
- l'augmentation des volumes ;
- l'introduction d'un stockage objet ;
- l'amélioration des sauvegardes ;
- l'automatisation des politiques de conservation ;
- la supervision avancée de capacité ;
- la mise en place de plans de continuité plus complets.

Toute évolution doit rester compatible avec les principes d'abstraction, de sécurité, de traçabilité et de réversibilité définis dans ce document.

---

# 28. Références

- `ADR-001` — Registre des décisions d'architecture ;
- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — Architecture d'AKS Core ;
- `SECURITY-001` — Principes de sécurité ;
- `CONFIG-001` — Paramétrage centralisé ;
- `LOG-001` — Journalisation ;
- `AUDIT-001` — Journal d'audit ;
- `DOCUMENT-001` — Gestion des documents générés ;
- `ERROR-001` — Gestion des erreurs ;
- `ADMIN-001` — Administration.

---

# 29. Historique des versions

| Version | Date | Évolution |
|---------|------|-----------|
| 1.2.1 | 2026-07-24 | Normalisation du statut documentaire vers le statut officiel Validé |
| 1.1.0 | 2026-07-19 | Première version validée pour AKS Platform V1.1 |
| 1.2.0 | 2026-07-23 | Consolidation normative, clarification des sources de vérité, rétention, restauration, responsabilités et réversibilité |

---

# 30. Conclusion

La stratégie de stockage d'AKS Platform repose sur des sources de vérité explicites, des accès abstraits, une conservation maîtrisée et des mécanismes de sauvegarde, restauration et migration vérifiables.

Elle doit protéger les données et préserver leur intégrité sans créer de dépendance inutile à une technologie ou à un fournisseur.
