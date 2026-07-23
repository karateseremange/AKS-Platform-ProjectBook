# SECURITY-001

# Principes de sécurité d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | SECURITY-001 |
| **Titre** | Principes de sécurité d'AKS Platform |
| **Version** | 1.2.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |

---

# 1. Objet

Le présent document définit les principes de sécurité applicables à AKS Platform.

Il constitue le cadre transversal de référence pour la conception, le développement, l'exploitation et l'évolution de la plateforme.

Il précise :

- les objectifs de sécurité ;
- les catégories d'accès ;
- les exigences d'authentification et d'autorisation ;
- les règles de protection des données et des secrets ;
- les contrôles applicables aux API, documents, interfaces et intégrations ;
- les principes de développement sécurisé ;
- les règles de gestion des incidents ;
- les critères permettant de vérifier la conformité d'une évolution.

Il ne remplace pas les règles métier propres aux modules, mais impose les exigences minimales qu'ils doivent respecter.

---

# 2. Position dans le Project Book

`SECURITY-001` constitue le document transversal de référence pour la sécurité d'AKS Platform.

Il s'inscrit dans le système documentaire défini par :

- `GOV-DOC-001` pour la gouvernance documentaire ;
- `DOC-001` pour l'organisation de la documentation ;
- `STD-001` pour la structure documentaire obligatoire des modules métier ;
- `INDEX-001` pour le référencement officiel des documents.

Il complète :

- `ADR-001`, qui fixe les décisions architecturales structurantes ;
- `ARCH-001`, qui définit l'architecture globale ;
- `CORE-001`, qui définit les services transverses ;
- `API-001`, qui définit les conventions applicables aux API.

Les documents spécialisés peuvent détailler les mécanismes applicables à leur domaine sans réduire les exigences définies ici.

En cas de divergence :

1. `ARCH-001` fait autorité sur l'architecture globale ;
2. `SECURITY-001` fait autorité sur les exigences de sécurité transverses ;
3. les documents spécialisés précisent leur mise en œuvre dans leur périmètre.

---

# 3. Objectifs

La sécurité d'AKS Platform doit permettre de :

- protéger les données personnelles, administratives et techniques ;
- limiter l'accès aux seules personnes ou composants autorisés ;
- garantir l'intégrité des traitements et des échanges ;
- réduire les risques d'exposition de secrets techniques ;
- assurer la traçabilité des actions sensibles ;
- prévenir les usages abusifs ou non autorisés ;
- préserver la disponibilité des fonctions essentielles ;
- limiter l'impact d'une erreur ou d'une compromission ;
- maintenir un niveau de sécurité proportionné aux usages réels du club.

---

# 4. Principes directeurs

AKS Platform applique les principes suivants :

- sécurité dès la conception ;
- moindre privilège ;
- défense en profondeur ;
- séparation des responsabilités ;
- minimisation des données ;
- absence de confiance implicite ;
- traçabilité des actions sensibles ;
- refus sécurisé par défaut ;
- limitation de la complexité inutile ;
- compatibilité avec l'architecture modulaire ;
- centralisation des mécanismes transverses ;
- proportionnalité des contrôles au niveau de risque.

La sécurité doit rester compréhensible, maintenable et adaptée aux ressources réelles de l'association.

Une mesure de sécurité ne doit pas être écartée uniquement parce qu'elle complique l'usage. Inversement, une complexité technique excessive ne doit pas être introduite sans risque identifié et besoin validé.

---

# 5. Périmètre

Les exigences de sécurité concernent notamment :

- les interfaces publiques ;
- les interfaces d'administration ;
- les appels API internes et externes ;
- les traitements automatisés ;
- les communications entre composants ;
- les documents générés ;
- les données stockées ;
- les paramètres de configuration ;
- les journaux techniques et fonctionnels ;
- les intégrations externes ;
- les notifications ;
- les modules métier présents et futurs ;
- les procédures d'exploitation et de reprise.

Chaque nouveau module doit identifier explicitement les exigences de sécurité applicables à son périmètre conformément à `STD-001`.

---

# 6. Classification des accès

AKS Platform distingue au minimum les catégories suivantes.

## 6.1 Accès public

L'accès public est réservé aux fonctions explicitement publiées sans authentification.

Ces fonctions doivent :

- exposer uniquement les données nécessaires ;
- valider strictement les entrées ;
- limiter les opérations possibles ;
- ne jamais révéler de secret technique ;
- ne jamais donner accès aux fonctions d'administration ;
- protéger les traitements contre les appels falsifiés ou abusifs ;
- appliquer une limitation de fréquence lorsque le risque le justifie ;
- produire des messages d'erreur ne révélant aucune information interne.

Une fonction n'est jamais considérée comme publique par défaut.

## 6.2 Accès authentifié

Les fonctions authentifiées sont réservées aux utilisateurs identifiés par un mécanisme reconnu par la plateforme.

L'identité seule ne suffit pas : chaque opération doit également être autorisée.

La durée, la portée et les conditions de révocation d'une session ou d'un jeton doivent être adaptées à la sensibilité du service.

## 6.3 Accès administratif

Les fonctions administratives sont réservées aux personnes explicitement autorisées.

L'accès au tableau de bord défini dans `ADMIN-001` doit respecter :

- le principe du moindre privilège ;
- la séparation entre consultation et modification lorsque nécessaire ;
- la confirmation des opérations sensibles ;
- la journalisation des actions critiques ;
- le refus explicite des opérations non autorisées ;
- l'absence d'accès anonyme ;
- la réévaluation des droits lorsque les responsabilités évoluent.

## 6.4 Accès technique

Les accès techniques utilisés par les services, scripts ou intégrations doivent être limités à leur finalité.

Ils ne doivent jamais reposer sur des secrets intégrés directement dans le code source.

Chaque identité technique doit avoir :

- un propriétaire identifié ;
- une finalité documentée ;
- des permissions minimales ;
- un mécanisme de révocation ;
- une durée de vie ou une procédure de révision lorsque cela est pertinent.

---

# 7. Authentification

L'authentification doit reposer sur un mécanisme adapté au contexte d'usage.

Les principes suivants s'appliquent :

- ne pas développer un système d'identité complexe sans besoin métier réel ;
- privilégier les mécanismes d'authentification déjà maîtrisés ;
- ne jamais transmettre de secret dans une URL ;
- ne jamais stocker de mot de passe en clair ;
- limiter la durée et la portée des jetons ou sessions ;
- invalider les accès devenus inutiles ;
- protéger les interfaces d'administration contre l'accès anonyme ;
- vérifier l'origine et la validité d'une identité avant toute autorisation ;
- ne pas considérer une adresse électronique reçue dans une requête comme une preuve d'identité.

La V1.1 peut utiliser une gestion simple des utilisateurs autorisés, tant qu'elle reste explicite, contrôlable et documentée.

L'authentification centralisée et les rôles futurs restent des responsabilités d'AKS Core conformément à `CORE-001`.

---

# 8. Autorisation

Toute opération sensible doit vérifier l'autorisation au moment de son exécution.

Les contrôles d'interface ne suffisent pas.

Les règles suivantes s'appliquent :

- une fonction non autorisée doit être refusée côté serveur ;
- les droits doivent être associés à une responsabilité réelle ;
- les droits excessifs doivent être évités ;
- les modifications critiques doivent être réservées aux profils habilités ;
- les modules doivent exprimer leurs besoins d'autorisation sans dupliquer le système central ;
- les décisions d'autorisation importantes doivent être traçables ;
- une absence d'information suffisante doit conduire au refus ;
- un changement de rôle doit entraîner la révision des droits associés.

Un module métier reste responsable de la définition de ses permissions fonctionnelles. AKS Core reste responsable des mécanismes communs d'évaluation et d'application lorsqu'ils existent.

---

# 9. Protection des données

AKS Platform applique un principe de minimisation.

Les données collectées, traitées ou stockées doivent être :

- nécessaires à une finalité identifiée ;
- limitées au strict besoin ;
- exactes ou rectifiables lorsque cela est nécessaire ;
- conservées pendant une durée justifiée ;
- accessibles uniquement aux personnes autorisées ;
- protégées contre l'altération ou l'exposition non souhaitée ;
- supprimées ou anonymisées lorsqu'elles ne sont plus nécessaires.

Les réponses détaillées à un questionnaire de santé ne doivent jamais être stockées lorsque seule une décision administrative est nécessaire.

Les documents générés contenant des données personnelles doivent être protégés par des règles d'accès et de conservation adaptées.

Les données ne doivent pas être copiées dans un service transverse uniquement pour simplifier un traitement. Le module propriétaire reste responsable de ses données métier conformément à `CORE-001` et `STORAGE-001`.

---

# 10. Validation des entrées

Toutes les données reçues doivent être considérées comme non fiables.

Les interfaces et API doivent notamment :

- vérifier le type, le format et la longueur des valeurs ;
- vérifier la présence des champs obligatoires ;
- refuser les champs inattendus lorsque cela est pertinent ;
- normaliser les valeurs avant traitement ;
- contrôler les dates, identifiants et adresses électroniques ;
- vérifier les valeurs autorisées ;
- empêcher l'injection de contenu exécutable ;
- ne jamais utiliser directement une entrée utilisateur dans une commande ou une requête non sécurisée ;
- retourner des messages d'erreur compréhensibles sans révéler d'information interne sensible.

La validation côté client améliore l'expérience utilisateur mais ne remplace jamais la validation côté serveur.

Les règles métier sont validées par le module propriétaire. Les contraintes techniques communes peuvent être centralisées dans AKS Core.

---

# 11. Sécurisation des API et échanges

Les échanges entre composants doivent garantir, selon le niveau de risque :

- la confidentialité ;
- l'authenticité ;
- l'intégrité ;
- la fraîcheur de la requête ;
- la possibilité de corréler le traitement.

Selon le contexte, cela peut inclure :

- HTTPS obligatoire ;
- signature des requêtes ;
- contrôle de l'horodatage ;
- contrôle d'un identifiant de requête unique ou nonce ;
- vérification de l'origine autorisée ;
- limitation de la portée des jetons ;
- protection contre le rejeu ;
- rejet des signatures invalides ou expirées ;
- limitation de fréquence ;
- mécanisme d'idempotence.

Les clés et secrets utilisés pour ces mécanismes doivent être gérés dans la configuration sécurisée et non dans le code source.

Les règles de contrat, de versionnement et de structure des réponses sont définies dans `API-001`.

Un connecteur ne doit jamais contourner un contrôle de sécurité sous prétexte qu'il est exploité par l'association.

---

# 12. Gestion des secrets

Les secrets comprennent notamment :

- clés API ;
- secrets de signature ;
- jetons d'accès ;
- identifiants techniques ;
- mots de passe ;
- clés d'intégration externe ;
- informations permettant d'usurper une identité technique.

Les règles suivantes s'appliquent :

- aucun secret ne doit être versionné dans Git ;
- aucun secret ne doit apparaître dans les journaux ;
- aucun secret ne doit être affiché dans l'interface d'administration ;
- aucun secret ne doit être transmis dans une URL ;
- les secrets doivent être stockés dans un mécanisme adapté à l'environnement ;
- leur accès doit être limité ;
- leur rotation doit être possible ;
- leur révocation doit être documentée ;
- une valeur de test ne doit jamais être réutilisée en production ;
- une exposition suspectée doit entraîner une rotation ou une révocation immédiate ;
- un secret ne doit pas être copié dans une documentation, une capture d'écran ou un ticket.

`CONFIG-001` définit l'organisation du paramétrage, mais les secrets doivent rester distincts des paramètres fonctionnels ordinaires.

---

# 13. Journalisation et audit

Les événements de sécurité significatifs doivent être journalisés conformément à `LOG-001`.

Cela concerne notamment :

- les refus d'accès ;
- les erreurs d'authentification ;
- les modifications de paramètres sensibles ;
- les opérations administratives critiques ;
- les appels API rejetés ;
- les échecs de validation de signature ;
- les tentatives de rejeu ;
- les traitements échoués ;
- les anomalies d'intégration ;
- les suppressions ou exports de données sensibles ;
- les révocations d'accès ou de secrets.

Les journaux ne doivent pas contenir :

- de mot de passe ;
- de secret ;
- de jeton complet ;
- de réponse détaillée à un questionnaire de santé ;
- de donnée personnelle non nécessaire au diagnostic ;
- de corps complet de requête ou de réponse par défaut.

Les événements doivent être corrélables par un identifiant technique lorsque cela est pertinent.

Les exigences d'audit détaillées sont précisées dans `AUDIT-001`.

---

# 14. Sécurité des interfaces d'administration

Le tableau de bord d'administration doit :

- être inaccessible au public ;
- masquer les fonctions non autorisées ;
- vérifier les droits côté serveur ;
- demander confirmation avant une action irréversible ;
- signaler clairement les actions sensibles ;
- éviter l'affichage de secrets ;
- présenter uniquement les informations utiles ;
- journaliser les actions critiques ;
- protéger les formulaires contre les soumissions falsifiées ;
- limiter les détails techniques visibles en cas d'erreur ;
- ne pas considérer le masquage visuel comme un contrôle d'accès ;
- empêcher une action critique lorsque le contexte d'autorisation est incomplet.

Les opérations destructives ou irréversibles doivent fournir un retour explicite sur leur résultat.

---

# 15. Sécurité des documents et exports

Les documents générés doivent respecter les principes suivants :

- génération uniquement sur demande ou traitement autorisé ;
- contenu limité aux données nécessaires ;
- nommage évitant l'exposition excessive de données personnelles ;
- stockage dans un emplacement maîtrisé ;
- accès limité aux personnes autorisées ;
- suppression ou archivage selon les règles définies ;
- absence de secret technique dans les métadonnées ;
- contrôle du format avant transmission ;
- traçabilité de la génération lorsque le document est sensible ;
- impossibilité de déduire une information confidentielle à partir d'un identifiant public prévisible.

Les liens publics permanents vers des documents sensibles sont interdits sauf décision fonctionnelle explicitement documentée et sécurisée.

Les règles communes de génération sont définies dans `DOCUMENT-001` et les règles de conservation dans `STORAGE-001`.

---

# 16. Intégrations externes

Toute intégration externe doit être évaluée selon :

- les données transmises ;
- le niveau de confiance du service ;
- les mécanismes d'authentification disponibles ;
- les permissions demandées ;
- la gestion des erreurs ;
- la disponibilité ;
- la réversibilité ;
- la conservation des données ;
- la possibilité de révoquer l'accès ;
- la dépendance créée pour la plateforme.

Une indisponibilité d'un service externe ne doit pas provoquer une exposition de données ni contourner les contrôles de sécurité.

Les intégrations doivent être encapsulées conformément à `CORE-001` et leurs contrats conformes à `API-001`.

Les autorisations accordées à un service externe doivent être limitées à la finalité réelle du connecteur.

---

# 17. Gestion des erreurs

Les erreurs doivent être traitées de manière sécurisée.

La plateforme doit :

- refuser l'opération en cas de doute ;
- éviter les états partiellement validés ;
- journaliser les informations utiles au diagnostic ;
- afficher un message adapté à l'utilisateur ;
- ne pas exposer la pile d'exécution, les secrets ou la configuration interne ;
- permettre la corrélation entre l'erreur affichée et le journal technique ;
- distinguer les erreurs fonctionnelles, techniques et de sécurité ;
- ne pas modifier le résultat d'autorisation à la suite d'une erreur technique ;
- conserver un état cohérent en cas d'échec partiel.

Les règles détaillées sont définies dans `ERROR-001`.

---

# 18. Disponibilité et continuité

La sécurité comprend également la disponibilité des services essentiels.

Les principes suivants s'appliquent :

- éviter les dépendances critiques non maîtrisées ;
- prévoir des contrôles avant les traitements destructifs ;
- conserver des mécanismes de reprise adaptés ;
- sauvegarder les données nécessaires ;
- documenter les procédures de restauration ;
- limiter les traitements pouvant saturer les ressources ;
- privilégier des opérations idempotentes lorsque cela est possible ;
- prévoir un comportement de repli lorsque le besoin le justifie ;
- vérifier les restaurations des données critiques lorsque cela est possible.

Les règles de stockage, de sauvegarde et de conservation sont détaillées dans `STORAGE-001`.

---

# 19. Développement sécurisé

Tout développement doit respecter les règles suivantes :

- ne jamais intégrer de secret dans le dépôt ;
- analyser les dépendances avant toute modification ;
- maintenir la compatibilité avec les fonctions existantes ;
- valider toutes les entrées ;
- contrôler les autorisations côté serveur ;
- éviter la duplication des mécanismes de sécurité ;
- centraliser les fonctions communes dans AKS Core ;
- tester les cas de refus et d'erreur ;
- documenter toute exception aux règles établies ;
- corriger prioritairement les vulnérabilités affectant des données personnelles ou l'administration ;
- limiter les privilèges des scripts, services et intégrations ;
- vérifier qu'une évolution ne rend pas publique une fonction auparavant protégée ;
- examiner les impacts de sécurité lors de toute modification de contrat API ou de stockage.

Une évolution ne peut être considérée comme terminée si ses contrôles de sécurité nécessaires ne sont pas testés.

---

# 20. Gestion des incidents

Tout incident de sécurité suspecté doit conduire à :

1. limiter l'exposition ;
2. préserver les éléments utiles au diagnostic ;
3. révoquer les accès ou secrets concernés ;
4. identifier les données et fonctions potentiellement affectées ;
5. corriger la cause ;
6. vérifier l'absence de régression ;
7. documenter l'incident et les actions prises ;
8. informer les personnes concernées lorsque cela est nécessaire ;
9. mettre à jour les procédures ou contrôles lorsque l'incident révèle une faiblesse structurelle.

La réponse doit rester proportionnée à la gravité réelle de l'incident.

La documentation d'un incident ne doit pas reproduire les secrets ou données sensibles exposés.

---

# 21. Éléments exclus

Le présent document ne définit pas :

- une infrastructure de cybersécurité d'entreprise ;
- un centre opérationnel de sécurité ;
- un système complexe de gestion des identités ;
- une certification réglementaire ;
- une supervision d'environnements personnels sans lien avec AKS Platform ;
- des mécanismes disproportionnés par rapport aux besoins de l'association.

L'environnement Proxmox personnel du Product Owner ne fait pas partie de l'infrastructure AKS Platform.

Cette exclusion n'autorise pas à ignorer un risque réel affectant directement AKS Platform.

---

# 22. Responsabilités

## 22.1 Product Owner

Le Product Owner :

- valide les exigences de sécurité structurantes ;
- arbitre les exceptions ;
- décide des priorités de correction ;
- s'assure que les responsabilités d'exploitation sont identifiées.

## 22.2 AKS Core

AKS Core fournit les mécanismes transverses communs, notamment :

- validation technique partagée ;
- journalisation et corrélation ;
- gestion sécurisée de la configuration ;
- contrôles communs des API ;
- mécanismes d'autorisation centralisés lorsqu'ils existent ;
- gestion homogène des erreurs ;
- adaptateurs d'intégration sécurisés.

## 22.3 Modules métier

Chaque module métier doit :

- définir la sensibilité de ses données ;
- définir ses permissions fonctionnelles ;
- appliquer les contrôles propres à son domaine ;
- utiliser les services communs sans les contourner ;
- documenter les risques ou exceptions spécifiques ;
- tester ses cas de refus et de protection des données.

## 22.4 Exploitation

L'exploitation doit :

- protéger les accès administratifs ;
- conserver les secrets hors du dépôt ;
- révoquer les accès devenus inutiles ;
- appliquer les procédures de sauvegarde et de restauration ;
- traiter les alertes et incidents documentés.

---

# 23. Dépendances documentaires

`SECURITY-001` s'appuie sur :

- `ADR-001` — Décisions architecturales ;
- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — AKS Core ;
- `API-001` — Principes et conventions des API ;
- `GOV-DOC-001` — Gouvernance documentaire ;
- `DOC-001` — Organisation documentaire ;
- `STD-001` — Structure documentaire des modules ;
- `INDEX-001` — Index officiel.

Il est complété par :

- `ADMIN-001` — Tableau de bord d'administration ;
- `CONFIG-001` — Paramétrage centralisé ;
- `LOG-001` — Journalisation ;
- `AUDIT-001` — Traçabilité et audit ;
- `ERROR-001` — Gestion des erreurs ;
- `STORAGE-001` — Stockage et conservation ;
- `DOCUMENT-001` — Génération documentaire ;
- `NOTIF-001` — Notifications ;
- `UX-001` — Principes d'expérience utilisateur.

Toute documentation de module doit référencer `SECURITY-001` dès lors que le module traite des données personnelles, expose une interface, utilise une API, produit un document ou réalise une opération administrative.

---

# 24. Critères d'acceptation

Une évolution est conforme à `SECURITY-001` lorsque tous les critères applicables suivants sont satisfaits :

- [ ] Les accès publics, authentifiés, administratifs et techniques sont clairement identifiés.
- [ ] Toute opération sensible vérifie les droits côté serveur.
- [ ] Aucun secret n'est présent dans le dépôt, les journaux, les interfaces ou les URL.
- [ ] Les entrées sont validées avant traitement côté serveur.
- [ ] Les échanges sensibles sont authentifiés et protégés contre l'altération et le rejeu lorsque nécessaire.
- [ ] Les données collectées et conservées sont limitées au besoin métier.
- [ ] Les durées de conservation et règles de suppression sont identifiées.
- [ ] Les actions sensibles sont journalisées et corrélables.
- [ ] Les journaux ne contiennent aucune donnée sensible inutile.
- [ ] Les erreurs ne révèlent aucune information interne exploitable.
- [ ] Les documents sensibles ne sont pas publiés sans contrôle d'accès adapté.
- [ ] Les intégrations externes sont encapsulées, limitées et révocables.
- [ ] Les identités techniques ont une finalité et des permissions documentées.
- [ ] Les mécanismes de reprise nécessaires sont documentés.
- [ ] Les cas de refus, d'erreur et d'indisponibilité sont testés.
- [ ] Les nouveaux modules réutilisent les contrôles communs sans les dupliquer.
- [ ] Toute exception est justifiée, validée, limitée et associée à une régularisation.
- [ ] La documentation du Project Book est à jour.

---

# 25. Gestion des exceptions

Toute exception à une exigence de sécurité doit être :

- motivée par un besoin identifié ;
- limitée dans son périmètre et sa durée ;
- analysée en termes de risque ;
- validée par le Product Owner ;
- documentée dans le document responsable ;
- accompagnée d'une mesure compensatoire lorsque cela est possible ;
- associée à une stratégie de régularisation.

Une exception ne devient jamais automatiquement une règle générale.

Une dérogation documentaire ne vaut pas dérogation de sécurité et inversement.

---

# 26. Références

| Document | Rôle |
|----------|------|
| `ADR-001` | Décisions architecturales structurantes |
| `ARCH-001` | Architecture globale et règles de dépendance |
| `CORE-001` | Services transverses et responsabilités d'AKS Core |
| `API-001` | Contrats, échanges et sécurité des API |
| `CONFIG-001` | Paramétrage et séparation des secrets |
| `LOG-001` | Journalisation technique et fonctionnelle |
| `AUDIT-001` | Traçabilité des opérations sensibles |
| `ERROR-001` | Gestion homogène et sécurisée des erreurs |
| `STORAGE-001` | Stockage, sauvegarde, conservation et suppression |
| `DOCUMENT-001` | Génération et protection des documents |
| `ADMIN-001` | Administration de la plateforme |
| `STD-001` | Structure documentaire obligatoire des modules |

---

# 27. Historique des versions

| Version | Date | Évolution |
|---------|------|-----------|
| 1.0.0 | 2026-07-18 | Création du cadre de sécurité transversal |
| 1.1.0 | 2026-07-19 | Consolidation des accès, secrets, API, documents et incidents |
| 1.2.0 | 2026-07-23 | Alignement avec le socle architectural et documentaire, clarification des responsabilités, des exceptions et des critères d'acceptation |

---

# 28. Conclusion

La sécurité d'AKS Platform repose sur des mécanismes simples, explicites, centralisés et proportionnés aux usages de l'association.

Elle doit protéger les données, les accès et les traitements sans créer une complexité inutile ni compromettre l'évolutivité de la plateforme.

Toute évolution d'AKS Platform doit intégrer les exigences de sécurité dès sa conception, réutiliser les mécanismes communs d'AKS Core et démontrer sa conformité par des contrôles documentés et testés.