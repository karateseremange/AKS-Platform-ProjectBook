# ARCH-001

# Architecture fonctionnelle d'AKS Platform

Version : 1.0
Statut : Validé
Version du produit : V1.1

---

# 1. Objet

Le présent document définit l'architecture fonctionnelle de référence d'AKS Platform.

Il décrit les principes de construction de la plateforme, les responsabilités de ses composants et les règles permettant son évolution.

Il constitue la référence d'architecture pour tous les développements futurs.

---

# 2. Principes d'ingénierie

Le développement d'AKS Platform repose sur les principes suivants.

## Documentation Before Code

Toute décision structurante est documentée avant son implémentation.

## Architecture Before Implementation

L'architecture est définie avant le développement des fonctionnalités.

## Generic by Design

Les composants sont conçus pour être réutilisables lorsqu'un bénéfice réel est identifié.

La généricité ne constitue pas un objectif en soi.

## YAGNI (You Aren't Gonna Need It)

Aucune fonctionnalité n'est développée sans besoin métier identifié et validé.

## Simplicité

La solution la plus simple répondant au besoin est toujours privilégiée.

## Maintenabilité

Chaque décision doit favoriser :

- la lisibilité ;
- la modularité ;
- les évolutions futures ;
- la facilité de maintenance.

# 3. Principes d'architecture

AKS Platform repose sur les principes suivants :

- architecture modulaire ;
- séparation des responsabilités ;
- faible couplage entre composants ;
- forte réutilisation des services communs ;
- configuration centralisée ;
- sécurité par défaut ;
- compatibilité ascendante ;
- absence de régression fonctionnelle ;
- documentation systématique avant publication.

Les choix d'implémentation ne doivent jamais remettre en cause ces principes.

---

# 4. Vue d'ensemble

L'architecture fonctionnelle est organisée autour de quatre couches.

```text
                           AKS Platform
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
      AKS Core             Services communs        Modules métier
                                │                        │
      ┌──────────────┬──────────┼─────────────┐          │
      │              │          │             │          │
 Configuration  Journalisation Notifications  API        │
                                                   ┌─────┴───────────────┐
                                                   │                     │
                                      Questionnaire Santé      AKS Analytics
                                                   │                     │
                                                   └─────────────┬───────┘
                                                                 │
                                                          AKS Calendar
```

---

# 5. Les composants de la plateforme

## 5.1 AKS Core

AKS Core constitue le socle de la plateforme.

Il fournit les mécanismes communs nécessaires au fonctionnement de tous les modules.

AKS Core ne contient aucune logique métier spécifique.

---

## 5.2 Services communs

Les services communs sont mutualisés entre tous les modules.

Ils comprennent notamment :

- paramétrage ;
- journalisation ;
- notifications ;
- génération documentaire ;
- API internes ;
- stockage ;
- services techniques.

Un service commun est développé une seule fois puis réutilisé.

---

## 5.3 Modules métier

Chaque module répond à un besoin métier clairement identifié.

Exemples :

- Questionnaire Santé ;
- Analytics ;
- Calendar ;
- Grades (futur).

Chaque module possède :

- son propre périmètre ;
- sa propre documentation ;
- son propre cycle d'évolution.

---

## 5.4 Intégrations externes

Les intégrations externes permettent à AKS Platform de communiquer avec des services tiers.

À la date de publication de ce document, les principales intégrations sont :

- Google Workspace ;
- Google Apps Script ;
- WordPress ;
- GitHub ;
- Google Calendar.

Ces intégrations restent découplées des modules métier.

---

# 6. Règles de dépendance

Les dépendances autorisées sont les suivantes :

Modules métier
↓
Services communs
↓
AKS Core

Les dépendances directes entre modules métier sont interdites.

Toute fonctionnalité partagée doit être extraite dans un service commun.

---

# 7. Cycle d'évolution

Toute évolution suit le cycle suivant :

1. expression du besoin ;
2. validation de la feuille de route ;
3. conception ;
4. développement ;
5. tests ;
6. documentation ;
7. publication.

Aucune fonctionnalité ne peut être publiée sans documentation associée.

---

# 8. Principes de développement

Le développement d'AKS Platform repose sur les règles suivantes :

- une responsabilité par module ;
- une responsabilité par document ;
- absence de duplication ;
- priorité à la réutilisation ;
- évolutions incrémentales ;
- compatibilité avec les versions précédentes.

Toute évolution doit préserver la stabilité globale de la plateforme.

---

# 9. Compatibilité

Les évolutions de la plateforme doivent :

- préserver les fonctionnalités existantes ;
- éviter toute régression ;
- respecter les interfaces existantes ;
- documenter les changements majeurs.

---

# 10. Évolutions futures

L'ajout d'un nouveau module suit les étapes suivantes :

- validation du besoin ;
- inscription dans la feuille de route ;
- conception fonctionnelle ;
- création de la documentation ;
- développement ;
- validation ;
- publication.

Chaque module doit pouvoir évoluer indépendamment des autres.

---

# 11. Conclusion

ARCH-001 constitue la référence officielle de l'architecture fonctionnelle d'AKS Platform.

Tout nouveau développement devra respecter les principes définis dans ce document.

Les détails d'implémentation sont volontairement exclus de ce document et sont décrits dans les documents spécialisés ou dans le code source.
