# AKS Platform RC 0.7.0

## Statut

Validée le 13 juillet 2026.

## Base

RC 0.7.0 est cumulative et inclut l’intégralité du workflow validé dans RC 0.6.0.

## Nouveau périmètre

HQ-009 — Intégration WordPress sécurisée :

1. ajout d’une API Apps Script serveur à serveur signée HMAC-SHA256 ;
2. contrôle de l’horodatage, de la taille des requêtes et protection anti-rejeu atomique ;
3. ajout de l’extension WordPress `AKS Platform Connector` 0.10.1 ;
4. configuration du secret uniquement dans `wp-config.php` et les propriétés Apps Script ;
5. ajout du shortcode `[aks_health_questionnaire]` ;
6. intégration du parcours complet sur le domaine du club ;
7. suppression de la dépendance à une session Google côté utilisateur ;
8. maintien de la saisie mobile de la date de naissance HQ-008 ;
9. validation progressive et messages précis par champ ;
10. limitation technique des appels sans conservation d’identité ou de réponse ;
11. maintien du caractère éphémère des réponses détaillées ;
12. maintien du PDF et des notifications conditionnelles HQ-006/HQ-007.

## Architecture

Le navigateur communique uniquement avec les routes REST du site WordPress. Le connecteur signe les requêtes côté serveur et les transmet à Apps Script. Le secret partagé n’est jamais exposé au navigateur.

WordPress ne crée aucune table métier et ne conserve aucune identité ni réponse au questionnaire. Seul un compteur technique temporaire, dérivé d’une empreinte non réversible, est utilisé pour limiter les appels.

## Validation

- 5/5 tests HQ-009.1 réussis ;
- 14/14 contrôles HQ-009.2 réussis ;
- non-régressions HQ-005.2, HQ-006, HQ-007 et HQ-008 réussies ;
- connecteur réel `context` et `prepare` validé ;
- parcours sans certificat validé avec PDF et notifications conformes ;
- parcours avec certificat validé sans PDF et notifications conformes ;
- tests réussis sur ordinateur et Android ;
- tests réussis en navigation privée, sans session WordPress ou Google ;
- page publique `https://karate-seremange.fr/questionnaire-mineur/` validée.

## Compatibilité

- WordPress 7.0.1 ;
- OceanWP 4.2.1 et Elementor 4.1.4 ;
- PHP 8.3.23 ;
- Google Apps Script V8 ;
- parcours Apps Script direct conservé comme solution de secours.

## Sécurité opérationnelle

Le secret du connecteur ne doit jamais être placé dans Git, une page WordPress, un e-mail ou un journal. Sa rotation nécessite une mise à jour coordonnée de `wp-config.php` et de la propriété `AKS_WORDPRESS_CONNECTOR_SECRET` dans Apps Script.

## Tag applicatif

`rc-0.7.0`
