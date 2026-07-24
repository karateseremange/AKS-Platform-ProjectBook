| Propriété | Valeur |
|-----------|--------|
| **Document ID** | AUDIT-001 |
| **Titre** | Traçabilité et audit des actions sensibles |
| **Version** | 1.1.1 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-24 |

---

# 1. Objet

Le présent document définit les principes de traçabilité et d’audit applicables aux actions sensibles réalisées dans AKS Platform.

L’audit fonctionnel complète la journalisation technique décrite dans `LOG-001`.

Il vise à permettre de répondre de manière fiable aux questions suivantes :

- qui a réalisé une action ;
- quelle action a été réalisée ;
- sur quelle ressource ;
- à quel moment ;
- avec quel résultat ;
- dans quel contexte fonctionnel.

---

# 2. Objectifs

Le dispositif d’audit doit permettre de :

- garantir la traçabilité des opérations administratives importantes ;
- faciliter les contrôles internes ;
- contribuer au diagnostic d’un incident fonctionnel ou de sécurité ;
- identifier les modifications ayant affecté une donnée ou un paramètre ;
- soutenir les obligations de responsabilité et de protection des données ;
- fournir une preuve exploitable sans exposer inutilement de données sensibles.

---

# 3. Distinction entre journalisation et audit

La journalisation et l’audit répondent à des finalités différentes.

## 3.1 Journalisation technique

La journalisation définie dans `LOG-001` concerne notamment :

- les erreurs techniques ;
- les avertissements ;
- les traitements exécutés ;
- les diagnostics applicatifs ;
- l’état des intégrations et services.

## 3.2 Audit fonctionnel

L’audit concerne les actions utilisateur ou système ayant un impact fonctionnel, administratif ou réglementaire.

Exemples :

- modification d’un paramètre ;
- changement de campagne active ;
- décision administrative ;
- génération ou suppression d’un document ;
- modification d’un droit d’accès ;
- lancement manuel d’un traitement sensible ;
- export de données ;
- correction d’une donnée métier.

Une même opération peut produire à la fois un événement de journalisation technique et une entrée d’audit fonctionnel.

---

# 4. Périmètre des actions auditées

Doivent être auditées en priorité les actions suivantes :

- modifications des paramètres centralisés définis dans `CONFIG-001` ;
- actions administratives exécutées depuis le tableau de bord défini dans `ADMIN-001` ;
- opérations touchant aux droits, autorisations ou accès ;
- décisions administratives prises dans les modules métier ;
- génération, téléchargement, export ou suppression de documents sensibles ;
- lancement, annulation ou relance d’un traitement manuel ;
- modifications de données à caractère personnel ;
- opérations de purge ou d’archivage ;
- actions de sécurité significatives ;
- échecs répétés d’opérations sensibles.

Les opérations purement consultatives ne sont auditées que lorsqu’un besoin fonctionnel, de sécurité ou de conformité le justifie.

---

# 5. Structure minimale d’une entrée d’audit

Chaque entrée d’audit doit contenir, lorsque l’information est disponible :

- un identifiant unique ;
- la date et l’heure ;
- l’environnement concerné ;
- l’identité ou l’identifiant de l’acteur ;
- le type d’acteur : utilisateur, administrateur, service ou traitement automatique ;
- l’action réalisée ;
- le module ou service concerné ;
- le type et l’identifiant de la ressource concernée ;
- le résultat : succès, refus, échec ou annulation ;
- un motif ou un contexte lorsque nécessaire ;
- un identifiant de corrélation permettant de relier l’action aux journaux techniques ;
- les métadonnées strictement nécessaires au contrôle.

L’entrée d’audit ne doit pas contenir de secret, de mot de passe, de jeton, de clé privée ou de réponse détaillée à un questionnaire sensible.

---

# 6. Traçabilité des modifications

Pour les modifications importantes, l’audit doit permettre d’identifier :

- la valeur précédente lorsque sa conservation est autorisée ;
- la nouvelle valeur ;
- l’auteur de la modification ;
- la date de prise d’effet ;
- le motif lorsque celui-ci est requis.

Les anciennes et nouvelles valeurs doivent être masquées ou omises lorsqu’elles contiennent des données sensibles ou des secrets techniques.

---

# 7. Intégrité des données d’audit

Les données d’audit doivent être protégées contre :

- la modification non autorisée ;
- la suppression accidentelle ;
- l’altération par un module métier ;
- l’exposition à des utilisateurs non habilités.

Les modules doivent produire des événements d’audit via un service commun d’AKS Core lorsque ce service est disponible.

Ils ne doivent pas gérer chacun un mécanisme d’audit indépendant sans justification documentée.

---

# 8. Consultation

La consultation des données d’audit doit être réservée aux personnes autorisées.

L’interface d’administration doit permettre, selon les besoins :

- la consultation chronologique ;
- le filtrage par période ;
- le filtrage par acteur ;
- le filtrage par module ;
- le filtrage par type d’action ;
- le filtrage par résultat ;
- la recherche par identifiant de ressource ou de corrélation.

L’affichage doit rester compréhensible et ne pas exposer les données techniques inutiles.

---

# 9. Conservation

La durée de conservation des données d’audit doit être :

- proportionnée au besoin opérationnel ;
- compatible avec les obligations réglementaires ;
- cohérente avec la sensibilité des actions tracées ;
- configurable lorsqu’un besoin concret le justifie.

La conservation illimitée par défaut est exclue.

Les règles de purge doivent être documentées, contrôlées et elles-mêmes auditées.

---

# 10. Protection des données personnelles

Le dispositif d’audit applique les principes suivants :

- minimisation des données ;
- limitation des finalités ;
- accès restreint ;
- durée de conservation maîtrisée ;
- masquage des données sensibles ;
- absence de stockage des contenus non nécessaires à la preuve de l’action.

L’audit ne doit jamais devenir une copie parallèle complète des données métier.

---

# 11. Responsabilités

## 11.1 AKS Core

AKS Core fournit le mécanisme commun de production, de stockage et de consultation des événements d’audit.

## 11.2 Modules métier

Chaque module :

- identifie ses actions sensibles ;
- transmet les événements nécessaires au service commun ;
- ne stocke pas de secrets dans les métadonnées ;
- documente les événements spécifiques qu’il produit.

## 11.3 Administration

Le tableau de bord d’administration fournit un accès contrôlé aux informations d’audit utiles à l’exploitation.

## 11.4 Gouvernance produit

Le Product Owner valide les catégories d’actions devant obligatoirement être auditées.

---

# 12. Gestion des échecs

L’échec de l’écriture d’une entrée d’audit doit être journalisé techniquement.

Pour une action critique, l’application doit déterminer explicitement si :

- l’action doit être refusée en l’absence de traçabilité ;
- l’action peut être exécutée avec une alerte ;
- une reprise différée de l’écriture d’audit est possible.

Ce comportement doit être défini selon le niveau de criticité de l’action.

---

# 13. Éléments exclus

Sont exclus du périmètre de `AUDIT-001` :

- la définition détaillée des formats de journaux techniques ;
- la supervision d’infrastructures externes ;
- l’enregistrement exhaustif de toutes les consultations ;
- le stockage de copies complètes des données métier ;
- la conservation de secrets ou de réponses sensibles ;
- la mise en place immédiate d’un système complexe de conformité.

---

# 14. Critères d’acceptation

Le dispositif d’audit est considéré comme conforme lorsque :

- les actions sensibles sont identifiées ;
- chaque événement contient les informations minimales nécessaires ;
- l’acteur, l’action, la ressource, la date et le résultat sont traçables ;
- les événements peuvent être corrélés aux journaux techniques ;
- l’accès aux données d’audit est restreint ;
- les secrets et données sensibles ne sont pas exposés ;
- les règles de conservation sont définies ;
- les modules utilisent un mécanisme commun ;
- les opérations de purge sont contrôlées et tracées ;
- les fonctions disponibles sont documentées.

---

# 15. Dépendances

`AUDIT-001` dépend de :

- `ARCH-001` — Architecture fonctionnelle ;
- `CORE-001` — Services communs d’AKS Core ;
- `ADMIN-001` — Tableau de bord d’administration ;
- `CONFIG-001` — Paramétrage centralisé ;
- `LOG-001` — Journalisation technique ;
- `SECURITY-001` — Principes de sécurité ;
- `GOV-001` — Gouvernance produit.

Les modules métier complètent ce document en identifiant leurs propres actions sensibles.

---

# 16. Références

- `ARCH-001` — Architecture fonctionnelle d’AKS Platform
- `CORE-001` — AKS Core
- `ADMIN-001` — Tableau de bord d’administration
- `CONFIG-001` — Paramétrage centralisé
- `LOG-001` — Journalisation
- `SECURITY-001` — Principes de sécurité
- `GOV-001` — Gouvernance produit

---

# 17. Conclusion

L’audit fournit une traçabilité fonctionnelle fiable des actions sensibles réalisées dans AKS Platform.

Il complète la journalisation technique sans la dupliquer, contribue à la sécurité et à la responsabilité des opérations, et doit rester centralisé, proportionné et respectueux des données personnelles.