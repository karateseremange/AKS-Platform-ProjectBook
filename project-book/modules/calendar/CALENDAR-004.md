# CALENDAR-004

# Accès protégé aux calendriers internes depuis WordPress

| Propriété | Valeur |
|---|---|
| Document ID | CALENDAR-004 |
| Titre | Accès protégé aux calendriers internes depuis WordPress |
| Version | 1.0.0 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-08-01 |
| Version du produit | Post-V1.2.0 |

---

# 1. Objet

Ce document consigne la mise à disposition, depuis le site WordPress de l’Association Karaté Serémange, d’un point d’accès protégé vers les trois calendriers internes d’AKS Calendar.

`CALENDAR-003` reste la référence pour la publication du calendrier `AKS - Public`. Le présent incrément complète ce parcours avec les accès internes qui n’étaient pas couverts par cette publication publique.

# 2. Page interne

Une page WordPress intitulée **Calendriers internes AKS** a été créée, publiée et protégée par mot de passe.

Elle contient un texte rappelant que la consultation et la modification restent soumises aux autorisations accordées dans Google Agenda, ainsi que trois boutons :

- **Ouvrir AKS - Encadrement** ;
- **Ouvrir AKS - Administration / Comité** ;
- **Ouvrir AKS - Propositions**.

Chaque bouton ouvre Google Agenda dans un nouvel onglet à partir de l’identifiant du calendrier correspondant.

# 3. Modèle de sécurité

La protection WordPress constitue un premier filtre d’accès à la page. Elle ne remplace pas les autorisations Google Calendar.

La sécurité effective repose sur deux niveaux complémentaires :

1. le mot de passe WordPress protège l’affichage des boutons ;
2. Google impose une connexion et n’affiche le calendrier qu’aux comptes autorisés.

La connaissance du mot de passe WordPress ou du lien technique d’un calendrier ne confère donc aucun droit dans Google Calendar.

Les règles validées dans `CALENDAR-002` restent inchangées :

- seul le propriétaire gère les droits de partage ;
- chaque personne reçoit uniquement les accès nécessaires ;
- aucun calendrier interne n’est rendu public ;
- les droits Google Calendar font autorité.

# 4. Intégration au site

L’entrée **Calendriers internes AKS** est disponible dans le sous-menu **Services en ligne** du site WordPress.

Le parcours conserve l’ouverture de la page dans le même onglet. Les trois boutons ouvrent ensuite Google Agenda dans un nouvel onglet.

Le mot de passe de la page n’est pas consigné dans le Project Book ni dans le dépôt Git.

# 5. Recette fonctionnelle et de sécurité

| Contrôle | Résultat |
|---|---|
| Page publiée et protégée par mot de passe | Conforme |
| Contenu inaccessible avant saisie du mot de passe | Conforme |
| Texte et trois boutons visibles après déverrouillage | Conforme |
| Demande de connexion Google pour un utilisateur non connecté | Conforme |
| Ouverture du calendrier avec un compte autorisé | Conforme |
| Trois calendriers internes accessibles par leur bouton respectif | Conforme |
| Entrée Services en ligne sur ordinateur | Conforme |
| Entrée Services en ligne sur mobile | Conforme |
| Aucun calendrier interne rendu public | Conforme |

La recette opérationnelle de `CALENDAR-004` est réussie.

# 6. Limites et exploitation

- WordPress ne gère aucun droit Google Calendar ;
- la page ne contient ni iframe interne ni donnée issue des calendriers ;
- un utilisateur non autorisé par Google ne peut pas consulter un calendrier interne ;
- le mot de passe WordPress doit être renouvelé et communiqué hors du dépôt selon les besoins du club ;
- tout ajout ou retrait d’un membre reste effectué dans les paramètres de partage Google Calendar ;
- les liens doivent être recontrôlés si un calendrier est remplacé ou recréé.

# 7. Décision de clôture

Le périmètre initial d’AKS Calendar est désormais complet :

- quatre calendriers configurés et testés ;
- droits initiaux et circuit `Propositions → Public` validés ;
- calendrier public publié sur WordPress avec deux modes d’abonnement ;
- accès protégé aux trois calendriers internes depuis le site ;
- contrôle final des autorisations assuré par Google Calendar ;
- guides et recettes consignés dans le Project Book.

Le socle AKS Calendar est officiellement terminé avec `CALENDAR-004`. Aucun développement applicatif n’a été nécessaire.

# 8. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-01 | Publication de la page protégée, ajout des trois accès internes, recette de sécurité, intégration au menu Services en ligne et clôture complète du socle AKS Calendar |
