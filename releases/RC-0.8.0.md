# AKS Platform RC 0.8.0

## Statut

Validée le 15 juillet 2026.

## Base

RC 0.8.0 est cumulative et inclut l’intégralité du workflow validé dans RC 0.7.0.

## Nouveau périmètre

HQ-010 — Intégration WordPress professionnelle :

1. ajout du shortcode `[aks_health_questionnaire_page]` ;
2. ajout d’une page d’entrée officielle identifiant le club et la démarche ;
3. présentation en trois étapes des informations à préparer et du résultat attendu ;
4. ajout d’un bouton d’accès direct au questionnaire ;
5. affichage visible des garanties de confidentialité ;
6. ajout de l’adresse d’assistance du club ;
7. adaptation responsive à l’ordinateur et au smartphone ;
8. maintien du shortcode `[aks_health_questionnaire]` comme solution de retour immédiat ;
9. mise à jour de l’extension AKS Platform Connector en version 0.11.0 ;
10. maintien intégral de l’API signée, du workflow médical et des notifications existantes.

## Confidentialité et architecture

HQ-010 ne crée aucun stockage supplémentaire dans WordPress et n’ajoute aucun
traceur ou service tiers. La page professionnelle réutilise le composant HQ-009 :
elle ne duplique ni le formulaire, ni le traitement des réponses.

Le club ne reçoit toujours aucune réponse détaillée. Seuls l’identité du licencié,
la référence du dossier et la formalité attendue lui sont communiquées.

## Validation

- 20/20 contrôles automatisés HQ-010 réussis ;
- intégration sans conflit dans `develop` ;
- validation visuelle de la page professionnelle ;
- validation du bouton d’accès au questionnaire ;
- parcours réel complet conforme ;
- chargement et fonctionnement du questionnaire conformes ;
- confidentialité et notifications existantes préservées ;
- arbre de travail propre et branche `develop` synchronisée.

## Compatibilité

- WordPress 7.0.1 ;
- OceanWP 4.2.1 et Elementor 4.1.4 ;
- PHP 8.3.23 ;
- AKS Platform Connector 0.11.0 ;
- Google Apps Script V8 ;
- shortcode HQ-009 conservé comme solution de retour arrière.

## Exploitation

La page du questionnaire et les routes `/wp-json/aks-platform/` doivent être
exclues du cache de page. La page WordPress utilise une mise en page pleine largeur,
sans barre latérale ni second titre principal.

## Tag applicatif

`rc-0.8.0`
