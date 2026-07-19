# STORAGE-001

# Stratégie de stockage d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | STORAGE-001 |
| **Titre** | Stratégie de stockage d'AKS Platform |
| **Version** | 1.1.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-19 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Le présent document définit la stratégie de stockage transverse d'AKS Platform.

Il encadre le stockage des données métier, des paramètres, des journaux, des événements d'audit, des fichiers générés, des métadonnées documentaires, des caches et des sauvegardes.

---

# 2. Position dans le Project Book

STORAGE-001 complète notamment :

- ARCH-001 — Architecture fonctionnelle ;
- CORE-001 — Architecture d'AKS Core ;
- CONFIG-001 — Paramétrage centralisé ;
- LOG-001 — Journalisation ;
- AUDIT-001 — Journal d'audit ;
- SECURITY-001 — Sécurité ;
- DOCUMENT-001 — Gestion des documents générés ;
- ERROR-001 — Gestion des erreurs ;
- ADMIN-001 — Administration.

Il ne définit pas les règles métier propres aux données. Celles-ci restent sous la responsabilité des modules concernés.

---

# 3. Objectifs

La stratégie de stockage doit permettre de :

- garantir l'intégrité et la disponibilité des données ;
- séparer clairement les catégories de stockage ;
- éviter les dépendances directes des modules à une technologie ;
- appliquer des règles de conservation explicites ;
- protéger les données personnelles et les secrets ;
- faciliter les sauvegardes, restaurations et migrations ;
- limiter la duplication et la dette technique ;
- permettre l'évolution progressive de l'infrastructure.

---

# 4. Principes directeurs

Le stockage respecte les principes suivants :

- abstraction du support physique ;
- source de vérité identifiée pour chaque donnée ;
- séparation entre données, fichiers, journaux et cache ;
- minimisation des données ;
- chiffrement adapté à la sensibilité ;
- contrôle d'accès côté serveur ;
- traçabilité des opérations sensibles ;
- conservation limitée et documentée ;
- sauvegarde testée ;
- portabilité et réversibilité.

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

## 5.2 Paramètres

Les paramètres sont stockés conformément à CONFIG-001.

Les secrets sont séparés des paramètres fonctionnels et ne doivent pas être exposés dans l'administration, les journaux ou le code source.

## 5.3 Journaux techniques

Les journaux sont stockés conformément à LOG-001.

Ils ne constituent ni une base métier secondaire, ni un mécanisme de sauvegarde.

## 5.4 Audit

Les événements d'audit sont conservés conformément à AUDIT-001, dans un support protégeant leur intégrité et limitant leur modification.

## 5.5 Documents et fichiers

Les documents générés sont stockés conformément à DOCUMENT-001.

Le stockage conserve les fichiers indépendamment de leurs métadonnées fonctionnelles. Les modules utilisent un identifiant logique et ne dépendent pas d'un chemin physique.

## 5.6 Cache

Le cache contient uniquement des données reconstructibles.

Sa perte ne doit jamais entraîner une perte fonctionnelle définitive. Il ne constitue pas une source de vérité.

## 5.7 Sauvegardes

Les sauvegardes sont stockées séparément des données actives et protégées contre une suppression ou altération simultanée.

---

# 6. Abstraction du stockage

Les modules accèdent au stockage au moyen de services ou interfaces documentés.

Ils ne doivent pas :

- coder en dur des chemins physiques ;
- dépendre directement d'un fournisseur externe ;
- manipuler des identifiants propres à l'infrastructure hors de la couche d'intégration ;
- contourner les contrôles d'accès ;
- créer un stockage parallèle non documenté.

Cette abstraction doit permettre de changer de technologie sans modifier les règles métier.

---

# 7. Identifiants et références

Chaque ressource stockée possède un identifiant logique stable.

Les références doivent :

- être non ambiguës ;
- ne contenir aucun secret ;
- éviter les données personnelles directement lisibles ;
- rester indépendantes de l'emplacement physique ;
- permettre la corrélation avec les journaux et l'audit.

Un nom de fichier ou un chemin ne constitue jamais une autorisation.

---

# 8. Intégrité

L'intégrité est protégée par des contrôles adaptés :

- contraintes de structure ;
- validation avant écriture ;
- transactions lorsque nécessaire ;
- empreintes cryptographiques pour les fichiers finalisés ;
- contrôle des versions concurrentes ;
- journalisation des échecs ;
- vérifications périodiques lorsque justifiées.

Une écriture partielle ne doit jamais être présentée comme réussie.

---

# 9. Confidentialité et sécurité

Le stockage respecte SECURITY-001.

Les mesures applicables comprennent notamment :

- contrôle d'accès selon le moindre privilège ;
- chiffrement des échanges ;
- chiffrement au repos lorsque nécessaire ;
- séparation des environnements ;
- masquage des secrets ;
- interdiction des liens publics permanents pour les données sensibles ;
- limitation des accès administratifs directs ;
- audit des opérations sensibles.

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
- les obligations de sauvegarde éventuelles.

La duplication de données personnelles entre modules doit être évitée.

---

# 11. Conservation

Chaque catégorie de données ou de fichier possède une règle de conservation explicite.

Cette règle précise :

- la durée d'utilisation courante ;
- la durée d'archivage ;
- les conditions d'expiration ;
- la méthode de suppression ;
- les éventuelles obligations administratives ou légales ;
- le responsable fonctionnel.

Une donnée ne doit pas être conservée indéfiniment par défaut.

---

# 12. Suppression et anonymisation

La suppression doit être :

- autorisée ;
- contrôlée ;
- traçable ;
- appliquée à toutes les copies actives concernées ;
- répercutée sur les fichiers et métadonnées selon la politique applicable.

Lorsque la suppression complète n'est pas immédiatement possible en raison des sauvegardes, la donnée ne doit pas être restaurée dans un usage actif après expiration de la période de rétention.

L'anonymisation doit être irréversible pour être considérée comme une suppression de donnée personnelle.

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
- la fréquence des tests de restauration.

Une sauvegarde non testée ne peut pas être considérée comme une garantie de restauration.

---

# 14. Restauration

Toute restauration doit être préparée et contrôlée.

La procédure doit notamment :

- identifier le périmètre ;
- vérifier la cohérence de la sauvegarde ;
- limiter l'écrasement de données plus récentes ;
- préserver les règles de sécurité ;
- produire une trace d'audit ;
- vérifier le résultat fonctionnel ;
- documenter les éventuelles pertes de données.

---

# 15. Continuité et disponibilité

Le niveau de disponibilité attendu dépend de la criticité du service.

La conception doit prévoir :

- des erreurs explicites en cas d'indisponibilité ;
- des reprises idempotentes ;
- une limitation des écritures concurrentes ;
- une surveillance de la capacité ;
- des seuils d'alerte ;
- une procédure de remise en service.

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

---

# 17. Environnements

Les environnements de développement, test et production utilisent des espaces de stockage séparés.

Il est interdit de :

- mélanger les données de production et de test ;
- utiliser des données personnelles réelles sans procédure encadrée ;
- partager des secrets entre environnements ;
- permettre à un environnement non productif d'écrire dans le stockage de production.

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
- les limites et quotas.

Le fournisseur ne doit pas devenir une dépendance implicite du module métier.

---

# 19. Migration et réversibilité

Toute technologie de stockage doit permettre une extraction documentée des données utiles.

Une migration doit prévoir :

- l'inventaire des données ;
- la correspondance des structures ;
- la vérification d'intégrité ;
- la conservation des identifiants utiles ;
- la reprise des droits ;
- la reprise des politiques de conservation ;
- un plan de retour arrière ;
- une validation fonctionnelle.

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
- détection d'une anomalie d'intégrité.

Les journaux ne doivent pas reproduire le contenu complet des données stockées.

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
- les politiques de conservation actives.

Les opérations dangereuses nécessitent une confirmation et une autorisation renforcée.

---

# 22. Erreurs

Les erreurs de stockage suivent ERROR-001.

Elles distinguent au minimum :

- ressource introuvable ;
- accès interdit ;
- capacité insuffisante ;
- quota dépassé ;
- écriture échouée ;
- lecture échouée ;
- intégrité invalide ;
- fournisseur indisponible ;
- restauration échouée.

Les erreurs temporaires peuvent être retentées uniquement lorsque l'opération est idempotente.

---

# 23. Tests

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
- absence de fuite entre environnements.

---

# 24. Critères d'acceptation

Un stockage est conforme lorsque :

- sa catégorie et sa source de vérité sont identifiées ;
- son accès est abstrait et documenté ;
- les contrôles d'accès sont appliqués côté serveur ;
- les règles de conservation sont définies ;
- les données personnelles sont minimisées ;
- les sauvegardes et restaurations sont documentées et testées ;
- les erreurs sont explicites ;
- les opérations sensibles sont tracées ;
- une stratégie de migration et de réversibilité existe ;
- les modules ne dépendent pas du support physique.

---

# 25. Évolutions prévues

La stratégie pourra évoluer avec :

- l'ajout de nouveaux modules métier ;
- l'augmentation des volumes ;
- l'introduction d'un stockage objet ;
- l'amélioration des sauvegardes ;
- l'automatisation des politiques de conservation ;
- la supervision avancée de capacité ;
- la mise en place de plans de continuité plus complets.

Toute évolution doit rester compatible avec les principes d'abstraction, de sécurité, de traçabilité et de réversibilité définis dans ce document.