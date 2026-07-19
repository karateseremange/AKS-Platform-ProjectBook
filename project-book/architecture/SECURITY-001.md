| Propriété | Valeur |
|-----------|--------|
| **Document ID** | SECURITY-001 |
| **Titre** | Principes de sécurité d'AKS Platform |
| **Version** | 1.1.0 |
| **Statut** | Consolidé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-19 |

---

# 1. Objet

Le présent document définit les principes de sécurité applicables à AKS Platform.

Il constitue le cadre transversal de référence pour la conception, le développement, l'exploitation et l'évolution de la plateforme.

Il ne remplace pas les règles métier propres aux modules, mais impose les exigences minimales qu'ils doivent respecter.

---

# 2. Objectifs

La sécurité d'AKS Platform doit permettre de :

- protéger les données personnelles et administratives ;
- limiter l'accès aux seules personnes autorisées ;
- garantir l'intégrité des traitements et des échanges ;
- réduire les risques d'exposition de secrets techniques ;
- assurer la traçabilité des actions sensibles ;
- prévenir les usages abusifs ou non autorisés ;
- préserver la disponibilité des fonctions essentielles ;
- maintenir un niveau de sécurité proportionné aux usages réels du club.

---

# 3. Principes directeurs

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
- compatibilité avec l'architecture modulaire.

La sécurité doit rester compréhensible, maintenable et adaptée aux ressources réelles de l'association.

---

# 4. Périmètre

Les exigences de sécurité concernent notamment :

- les interfaces publiques ;
- les interfaces d'administration ;
- les appels API ;
- les traitements internes ;
- les documents générés ;
- les données stockées ;
- les paramètres de configuration ;
- les journaux techniques et fonctionnels ;
- les intégrations externes ;
- les notifications ;
- les modules métier présents et futurs.

---

# 5. Classification des accès

AKS Platform distingue au minimum les catégories suivantes :

## 5.1 Accès public

L'accès public est réservé aux fonctions explicitement publiées sans authentification.

Ces fonctions doivent :

- exposer uniquement les données nécessaires ;
- valider strictement les entrées ;
- limiter les opérations possibles ;
- ne jamais révéler de secret technique ;
- ne jamais donner accès aux fonctions d'administration ;
- protéger les traitements contre les appels falsifiés ou abusifs.

## 5.2 Accès authentifié

Les fonctions authentifiées sont réservées aux utilisateurs identifiés par un mécanisme reconnu par la plateforme.

L'identité seule ne suffit pas : chaque opération doit également être autorisée.

## 5.3 Accès administratif

Les fonctions administratives sont réservées aux personnes explicitement autorisées.

L'accès au tableau de bord défini dans `ADMIN-001` doit respecter :

- le principe du moindre privilège ;
- la séparation entre consultation et modification lorsque nécessaire ;
- la confirmation des opérations sensibles ;
- la journalisation des actions critiques ;
- le refus explicite des opérations non autorisées.

## 5.4 Accès technique

Les accès techniques utilisés par les services, scripts ou intégrations doivent être limités à leur finalité.

Ils ne doivent jamais reposer sur des secrets intégrés directement dans le code source.

---

# 6. Authentification

L'authentification doit reposer sur un mécanisme adapté au contexte d'usage.

Les principes suivants s'appliquent :

- ne pas développer un système d'identité complexe sans besoin métier réel ;
- privilégier les mécanismes d'authentification déjà maîtrisés ;
- ne jamais transmettre de secret dans une URL ;
- ne jamais stocker de mot de passe en clair ;
- limiter la durée et la portée des jetons ou sessions ;
- invalider les accès devenus inutiles ;
- protéger les interfaces d'administration contre l'accès anonyme.

La V1.1 peut utiliser une gestion simple des utilisateurs autorisés, tant qu'elle reste explicite, contrôlable et documentée.

---

# 7. Autorisation

Toute opération sensible doit vérifier l'autorisation au moment de son exécution.

Les contrôles d'interface ne suffisent pas.

Les règles suivantes s'appliquent :

- une fonction non autorisée doit être refusée côté serveur ;
- les droits doivent être associés à une responsabilité réelle ;
- les droits excessifs doivent être évités ;
- les modifications critiques doivent être réservées aux profils habilités ;
- les modules doivent exposer leurs besoins d'autorisation sans dupliquer le système central ;
- les décisions d'autorisation importantes doivent être traçables.

---

# 8. Protection des données

AKS Platform applique un principe de minimisation.

Les données collectées, traitées ou stockées doivent être :

- nécessaires à une finalité identifiée ;
- limitées au strict besoin ;
- conservées pendant une durée justifiée ;
- accessibles uniquement aux personnes autorisées ;
- protégées contre l'altération ou l'exposition non souhaitée ;
- supprimées ou anonymisées lorsqu'elles ne sont plus nécessaires.

Les réponses détaillées à un questionnaire de santé ne doivent jamais être stockées lorsque seule une décision administrative est nécessaire.

Les documents générés contenant des données personnelles doivent être protégés par des règles d'accès et de conservation adaptées.

---

# 9. Validation des entrées

Toutes les données reçues doivent être considérées comme non fiables.

Les interfaces et API doivent notamment :

- vérifier le type, le format et la longueur des valeurs ;
- refuser les champs inattendus lorsque cela est pertinent ;
- normaliser les valeurs avant traitement ;
- contrôler les dates, identifiants et adresses électroniques ;
- empêcher l'injection de contenu exécutable ;
- ne jamais utiliser directement une entrée utilisateur dans une commande ou une requête non sécurisée ;
- retourner des messages d'erreur compréhensibles sans révéler d'information interne sensible.

---

# 10. Sécurisation des API et échanges

Les échanges entre composants doivent garantir l'authenticité et l'intégrité des requêtes.

Selon le contexte, cela peut inclure :

- HTTPS obligatoire ;
- signature des requêtes ;
- contrôle de l'horodatage ;
- contrôle d'un identifiant de requête unique ;
- vérification de l'origine autorisée ;
- limitation de la portée des jetons ;
- protection contre le rejeu ;
- rejet des signatures invalides ou expirées.

Les clés et secrets utilisés pour ces mécanismes doivent être gérés dans la configuration sécurisée et non dans le code source.

---

# 11. Gestion des secrets

Les secrets comprennent notamment :

- clés API ;
- secrets de signature ;
- jetons d'accès ;
- identifiants techniques ;
- mots de passe ;
- clés d'intégration externe.

Les règles suivantes s'appliquent :

- aucun secret ne doit être versionné dans Git ;
- aucun secret ne doit apparaître dans les journaux ;
- aucun secret ne doit être affiché dans l'interface d'administration ;
- les secrets doivent être stockés dans un mécanisme adapté à l'environnement ;
- leur accès doit être limité ;
- leur rotation doit être possible ;
- leur révocation doit être documentée ;
- une valeur de test ne doit jamais être réutilisée en production.

`CONFIG-001` définit l'organisation du paramétrage, mais les secrets doivent rester distincts des paramètres fonctionnels ordinaires.

---

# 12. Journalisation et audit

Les événements de sécurité significatifs doivent être journalisés conformément à `LOG-001`.

Cela concerne notamment :

- les refus d'accès ;
- les erreurs d'authentification ;
- les modifications de paramètres sensibles ;
- les opérations administratives critiques ;
- les appels API rejetés ;
- les traitements échoués ;
- les anomalies d'intégration ;
- les suppressions ou exports de données sensibles.

Les journaux ne doivent pas contenir :

- de mot de passe ;
- de secret ;
- de jeton complet ;
- de réponse détaillée à un questionnaire de santé ;
- de donnée personnelle non nécessaire au diagnostic.

Les exigences d'audit détaillées sont précisées dans `AUDIT-001`.

---

# 13. Sécurité des interfaces d'administration

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
- limiter les détails techniques visibles en cas d'erreur.

---

# 14. Sécurité des documents et exports

Les documents générés doivent respecter les principes suivants :

- génération uniquement sur demande ou traitement autorisé ;
- contenu limité aux données nécessaires ;
- nommage évitant l'exposition excessive de données personnelles ;
- stockage dans un emplacement maîtrisé ;
- accès limité aux personnes autorisées ;
- suppression ou archivage selon les règles définies ;
- absence de secret technique dans les métadonnées ;
- contrôle du format avant transmission.

Les liens publics permanents vers des documents sensibles sont interdits sauf décision fonctionnelle explicitement documentée et sécurisée.

---

# 15. Intégrations externes

Toute intégration externe doit être évaluée selon :

- les données transmises ;
- le niveau de confiance du service ;
- les mécanismes d'authentification disponibles ;
- la gestion des erreurs ;
- la disponibilité ;
- la réversibilité ;
- la conservation des données ;
- la possibilité de révoquer l'accès.

Une indisponibilité d'un service externe ne doit pas provoquer une exposition de données ni contourner les contrôles de sécurité.

---

# 16. Gestion des erreurs

Les erreurs doivent être traitées de manière sécurisée.

La plateforme doit :

- refuser l'opération en cas de doute ;
- éviter les états partiellement validés ;
- journaliser les informations utiles au diagnostic ;
- afficher un message adapté à l'utilisateur ;
- ne pas exposer la pile d'exécution, les secrets ou la configuration interne ;
- permettre la corrélation entre l'erreur affichée et le journal technique ;
- distinguer les erreurs fonctionnelles, techniques et de sécurité.

Les règles détaillées sont définies dans `ERROR-001`.

---

# 17. Disponibilité et continuité

La sécurité comprend également la disponibilité des services essentiels.

Les principes suivants s'appliquent :

- éviter les dépendances critiques non maîtrisées ;
- prévoir des contrôles avant les traitements destructifs ;
- conserver des mécanismes de reprise adaptés ;
- sauvegarder les données nécessaires ;
- documenter les procédures de restauration ;
- limiter les traitements pouvant saturer les ressources ;
- privilégier des opérations idempotentes lorsque cela est possible.

Les règles de stockage et de conservation sont détaillées dans `STORAGE-001`.

---

# 18. Développement sécurisé

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
- corriger prioritairement les vulnérabilités affectant des données personnelles ou l'administration.

---

# 19. Gestion des incidents

Tout incident de sécurité suspecté doit conduire à :

1. limiter l'exposition ;
2. préserver les éléments utiles au diagnostic ;
3. révoquer les accès ou secrets concernés ;
4. identifier les données potentiellement affectées ;
5. corriger la cause ;
6. vérifier l'absence de régression ;
7. documenter l'incident et les actions prises ;
8. informer les personnes concernées lorsque cela est nécessaire.

La réponse doit rester proportionnée à la gravité réelle de l'incident.

---

# 20. Éléments exclus

Le présent document ne définit pas :

- une infrastructure de cybersécurité d'entreprise ;
- un centre opérationnel de sécurité ;
- un système complexe de gestion des identités ;
- une certification réglementaire ;
- une supervision d'environnements personnels sans lien avec AKS Platform ;
- des mécanismes disproportionnés par rapport aux besoins de l'association.

L'environnement Proxmox personnel du Product Owner ne fait pas partie de l'infrastructure AKS Platform.

---

# 21. Dépendances

`SECURITY-001` s'appuie sur :

- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — AKS Core ;
- `ADMIN-001` — Tableau de bord d'administration ;
- `CONFIG-001` — Paramétrage centralisé ;
- `LOG-001` — Journalisation ;
- `UX-001` — Principes d'expérience utilisateur ;
- `GOV-001` — Gouvernance produit.

Il est complété par :

- `AUDIT-001` — Traçabilité et audit ;
- `API-001` — Règles d'API ;
- `ERROR-001` — Gestion des erreurs ;
- `STORAGE-001` — Stockage et conservation ;
- `NOTIF-001` — Notifications.

---

# 22. Critères d'acceptation

Les principes de sécurité seront considérés comme appliqués lorsque :

- les accès publics et administratifs sont clairement séparés ;
- les droits sont vérifiés côté serveur ;
- aucun secret n'est présent dans le dépôt ou les journaux ;
- les entrées sont validées avant traitement ;
- les échanges sensibles sont authentifiés et protégés ;
- les données collectées sont limitées au besoin métier ;
- les actions sensibles sont journalisées ;
- les erreurs ne révèlent pas d'information interne ;
- les documents sensibles ne sont pas publiés sans contrôle ;
- les intégrations externes sont révocables ;
- les mécanismes de reprise nécessaires sont documentés ;
- les nouveaux modules respectent ces exigences sans dupliquer les contrôles communs.

---

# 23. Références

- `ROADMAP-001` — Feuille de route officielle d'AKS Platform v1.1
- `GOV-001` — Gouvernance produit
- `ARCH-001` — Architecture fonctionnelle
- `CORE-001` — AKS Core
- `ADMIN-001` — Tableau de bord d'administration
- `CONFIG-001` — Paramétrage centralisé
- `LOG-001` — Journalisation
- `UX-001` — Principes UX

---

# 24. Position dans le Project Book

`SECURITY-001` constitue le document transversal de référence pour la sécurité d'AKS Platform.

Toute fonctionnalité publique, administrative, technique ou métier doit respecter ses principes.

Les documents spécialisés peuvent détailler les mécanismes applicables à leur domaine, sans réduire les exigences définies ici.

---

# 25. Conclusion

La sécurité d'AKS Platform repose sur des mécanismes simples, explicites, centralisés et proportionnés aux usages de l'association.

Elle doit protéger les données, les accès et les traitements sans créer une complexité inutile ni compromettre l'évolutivité de la plateforme.