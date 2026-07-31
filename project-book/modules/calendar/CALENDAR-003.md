# CALENDAR-003

# Publication WordPress et guide utilisateur d’AKS Calendar

| Propriété | Valeur |
|---|---|
| Document ID | CALENDAR-003 |
| Titre | Publication WordPress et guide utilisateur d’AKS Calendar |
| Version | 1.0.0 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-31 |
| Version du produit | Post-V1.2.0 |

---

# 1. Objet

Ce document consigne la publication du calendrier `AKS - Public` sur le site WordPress de l’Association Karaté Serémange, la recette des parcours de consultation et d’abonnement, ainsi que le guide d’utilisation du socle AKS Calendar.

Google Calendar reste la source de vérité des événements. WordPress expose uniquement le calendrier public et ne reproduit aucune fonction d’administration.

# 2. Page publique

La page WordPress officielle est :

[Calendrier AKS](https://karate-seremange.fr/calendrier-aks/)

Elle contient :

- le calendrier `AKS - Public` intégré dans une iframe Google Calendar ;
- un texte expliquant la consultation et l’abonnement ;
- un bouton **Ajouter à Google Agenda** ;
- un bouton **Télécharger le calendrier (.ics)**.

L’entrée **Calendrier AKS** est disponible dans le sous-menu **Services en ligne** du site, avec ouverture dans le même onglet.

# 3. Configuration d’affichage

Le code d’intégration Google Calendar utilise une largeur de `100 %` et une hauteur de `650 px`.

La recette a confirmé :

- l’affichage correct sur ordinateur ;
- l’affichage des sept jours sur mobile ;
- l’absence de défilement horizontal de la page ;
- la consultation des événements ;
- une hauteur acceptable sur les deux formats.

La vue mensuelle reste naturellement compacte sur téléphone, mais elle est utilisable sans adaptation supplémentaire.

# 4. Recette des abonnements

| Parcours | Résultat |
|---|---|
| Ajouter à Google Agenda | Conforme — ouverture de Google Agenda et proposition d’ajout du calendrier |
| Télécharger le calendrier (.ics) | Conforme — téléchargement du fichier pour les applications compatibles |
| Accès public sans connexion WordPress | Conforme |
| Menu Services en ligne sur ordinateur | Conforme |
| Menu Services en ligne sur mobile | Conforme |
| Absence de contenu de test | Conforme |

Le téléchargement `.ics` constitue un instantané importable. L’ajout à Google Agenda est le parcours recommandé pour bénéficier des mises à jour automatiques.

# 5. Rôle des quatre calendriers

| Calendrier | Usage | Public autorisé |
|---|---|---|
| `AKS - Public` | Événements confirmés destinés aux licenciés, familles et visiteurs | Oui |
| `AKS - Encadrement` | Organisation des professeurs et assistants autorisés | Non |
| `AKS - Administration / Comité` | Réunions, échéances et événements internes | Non |
| `AKS - Propositions` | Préparation des événements avant validation | Non |

Le calendrier historique principal `AKS` reste inchangé et ne fait pas partie de ce circuit.

# 6. Guide de proposition et de publication

1. Le membre autorisé crée l’événement dans `AKS - Propositions`.
2. Le propriétaire ou Jean-Michel GAPENNE vérifie le contenu.
3. Après validation, l’événement est copié dans `AKS - Public`.
4. La présence de la copie publique est contrôlée.
5. L’original est supprimé de `AKS - Propositions` lorsque la publication est confirmée.
6. Toute correction ultérieure est effectuée directement dans `AKS - Public`.

Copier un événement crée deux événements indépendants. Une modification de la proposition après la copie ne met donc pas automatiquement à jour l’événement public.

# 7. Informations attendues dans un événement

Tout événement doit comporter :

- un titre clair ;
- une date et un horaire exacts ;
- un lieu précis lorsqu’il est utile ;
- une description courte contenant seulement les informations nécessaires ;
- aucun invité sauf besoin explicite.

Un événement public ne doit jamais contenir de donnée personnelle non nécessaire, de liste nominative, d’information médicale, de donnée concernant un mineur, de document interne ou de détail administratif confidentiel.

# 8. Droits et responsabilités

- le propriétaire gère les droits de partage des calendriers ;
- les deux membres autorisés peuvent modifier les événements dans `AKS - Encadrement` et `AKS - Propositions`, sans gérer les partages ;
- Jean-Michel GAPENNE peut modifier les événements de `AKS - Administration / Comité`, sans gérer les partages ;
- seul `AKS - Public` est rendu public ;
- aucune invitation ponctuelle ne vaut autorisation de partager un calendrier complet.

Les habilitations doivent être revues au début de chaque saison et lors de tout changement dans l’équipe.

# 9. Utilisation sur téléphone

Dans l’application Google Agenda :

1. se connecter avec le compte personnel autorisé ;
2. vérifier que les calendriers partagés apparaissent dans la liste des agendas ;
3. activer uniquement les calendriers utiles à l’affichage ;
4. sélectionner le bon calendrier avant de créer un événement ;
5. utiliser `AKS - Propositions` pour toute publication publique à valider.

Pour le public, la page [Calendrier AKS](https://karate-seremange.fr/calendrier-aks/) permet la consultation et propose l’abonnement Google Agenda ainsi que le téléchargement `.ics`.

# 10. Administration minimale

Pour ajouter ou retirer un accès :

1. ouvrir **Paramètres et partage** du calendrier concerné ;
2. vérifier l’identité de la personne ;
3. accorder le niveau minimal nécessaire ;
4. ne pas déléguer la gestion du partage ;
5. faire confirmer l’accès et la création/suppression d’un événement de test ;
6. retirer l’accès dès qu’il n’est plus justifié.

Aucun compte générique partagé ne doit être créé.

# 11. Bilan de recette

| Contrôle | Résultat |
|---|---|
| Page publique publiée | Conforme |
| Calendrier public intégré | Conforme |
| Affichage ordinateur et mobile | Conforme |
| Abonnement Google Agenda | Conforme |
| Téléchargement iCal | Conforme |
| Entrée du menu Services en ligne | Conforme |
| Guide des quatre calendriers | Conforme |
| Aucun calendrier interne exposé | Conforme |

La recette opérationnelle de `CALENDAR-003` est réussie.

# 12. Décision de clôture

Le socle AKS Calendar est opérationnel :

- les quatre calendriers sont configurés et testés ;
- les droits initiaux sont validés ;
- le circuit Propositions vers Public est validé ;
- le calendrier public est publié sur WordPress ;
- les parcours de consultation et d’abonnement sont validés ;
- le guide utilisateur est disponible dans le Project Book.

Aucun développement applicatif n’est nécessaire. Les automatisations ou intégrations supplémentaires restent différées jusqu’à l’apparition d’un besoin réel et validé.

# 13. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-31 | Publication WordPress, recette ordinateur et mobile, validation des abonnements, ajout au menu Services en ligne, guide utilisateur et clôture du socle AKS Calendar |
