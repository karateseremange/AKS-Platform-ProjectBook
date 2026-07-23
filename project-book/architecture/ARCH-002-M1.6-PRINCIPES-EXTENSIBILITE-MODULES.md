# ARCH-002 — M1.6

# Principes d’extensibilité des modules

## Objectif
Définir les règles permettant d’intégrer de nouveaux modules dans AKS Platform tout en garantissant la cohérence de l’architecture, la stabilité des fonctionnalités existantes et la maintenabilité.

## Principes
- Chaque module est autonome.
- Les services communs sont fournis par AKS Core.
- Aucun module ne modifie directement les données d’un autre.
- Les échanges passent par des interfaces publiques.
- Un module peut être activé ou désactivé sans impacter les autres.

## Responsabilités d’AKS Core
AKS Core fournit : authentification, rôles, configuration, journalisation, notifications et services communs.

## Structure minimale d’un module
- Interface utilisateur
- Logique métier
- Accès aux données
- Paramétrage
- Journalisation
- Documentation

## Compatibilité
Tout nouveau module respecte les conventions de nommage, les services communs, la sécurité et l’intégration au tableau de bord d’administration.

## Conclusion
Cette architecture permet une évolution progressive de la plateforme sans remettre en cause les développements existants.