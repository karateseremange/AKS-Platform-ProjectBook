# CALENDAR-001

# Cadrage fonctionnel et architectural d’AKS Calendar

| Propriété | Valeur |
|---|---|
| Document ID | CALENDAR-001 |
| Titre | Cadrage fonctionnel et architectural d’AKS Calendar |
| Version | 1.0.1 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-30 |
| Version du produit | Post-V1.2.0 |

---

# 1. Objet

AKS Calendar doit fournir au club un calendrier partagé, simple à utiliser par les professeurs et responsables, sans développer un moteur de calendrier interne.

Le socle initial est Google Calendar. AKS Platform n’ajoute que les accès, règles métier et intégrations qui apportent une valeur concrète.

# 2. Principes directeurs

- le compte `karate-seremange@gmail.com` porte les calendriers officiels ;
- Google Calendar reste la source de vérité des événements ;
- le fonctionnement courant doit rester possible directement dans Google Calendar, sur ordinateur, téléphone et tablette ;
- seule une information destinée à être publique peut être publiée sur le site WordPress ;
- le principe du moindre privilège s’applique aux droits ;
- aucune dépendance directe avec Analytics ou Présences n’est créée ;
- les services transverses d’AKS Platform ne sont utilisés que lorsqu’une intégration est effectivement développée.

# 3. Périmètre initial

Le premier périmètre couvre :

- la création des calendriers Google nécessaires ;
- le partage avec l’équipe d’encadrement ;
- la consultation, la création et la modification d’événements selon les droits accordés ;
- la séparation des informations publiques, internes à l’encadrement et administratives ;
- un circuit simple de proposition puis de publication ;
- l’affichage du calendrier public sur WordPress et la mise à disposition d’un lien d’abonnement ;
- une procédure courte d’administration et de retrait des accès.

Les événements peuvent notamment concerner les cours et changements exceptionnels, stages, compétitions, passages de grades, réunions, manifestations, fermetures du dojo et échéances utiles au club.

# 4. Calendriers du socle

| Calendrier | Audience | Usage | Publication |
|---|---|---|---|
| Public | Licenciés, familles et visiteurs | Événements confirmés utiles au public | WordPress et lien d’abonnement autorisés |
| Encadrement | Professeurs et personnes autorisées | Organisation pédagogique et informations internes | Jamais public |
| Administration / Comité | Président et responsables explicitement autorisés | Réunions, échéances et informations administratives | Jamais public |
| Propositions | Professeurs ; assistants AFA en consultation | Préparation d’un événement destiné éventuellement au calendrier Public | Jamais public |

Cette séparation est préférée à la multiplication de calendriers spécialisés. Les catégories d’événements sont gérées dans les titres, descriptions ou couleurs de Google Calendar.

# 5. Rôles et droits utiles

| Rôle | Droits initiaux |
|---|---|
| Président | Administration complète et gestion du partage |
| Administrateur suppléant | Administration complète pour assurer la continuité |
| Administrateur explicitement habilité | Droits limités au besoin validé |
| Professeur | Consultation des calendriers autorisés, création et modification dans Encadrement, proposition dans Propositions |
| Assistant AFA | Consultation des calendriers autorisés ; pas de publication dans Public |
| Public | Consultation du seul calendrier Public |

Les comptes génériques partagés sont exclus. Les habilitations sont nominatives et sont revues au minimum au début de chaque saison ou lors d’un changement dans l’équipe.

# 6. Circuit de proposition et de publication

1. Un professeur prépare l’événement dans Propositions.
2. Un administrateur vérifie le titre, les dates, le lieu, la description et l’absence d’information confidentielle.
3. L’administrateur publie l’événement validé dans Public.
4. Les corrections publiques sont réalisées sur l’événement publié.
5. Un événement refusé ou devenu inutile est retiré de Propositions.

Propositions n’est jamais exposé dans WordPress. Les assistants AFA peuvent le consulter mais ne publient pas dans Public.

# 7. Confidentialité

Un événement Public ne contient aucune donnée personnelle non nécessaire, liste nominative, information médicale, donnée concernant un mineur, document interne ou détail administratif confidentiel.

Les calendriers Encadrement, Administration / Comité et Propositions ne doivent jamais être rendus publics. Une invitation externe ponctuelle ne vaut pas autorisation de partager le calendrier complet.

# 8. Administration minimale

Le président désigne l’administrateur suppléant pour une saison sportive. Les accès sont retirés lorsqu’une personne quitte sa fonction ou n’en a plus besoin.

Le registre initial des habilitations peut rester simple : personne, calendrier, niveau d’accès, statut, date d’attribution ou de retrait et validateur. Une feuille protégée ou un document administratif suffit tant qu’aucune interface dédiée n’est justifiée.

# 9. Sauvegarde proportionnée

Le socle prévoit :

- un export périodique raisonnable des calendriers actifs ;
- un export avant une suppression ou modification massive planifiée ;
- un relevé simple des droits de partage ;
- une conservation dans un dossier Drive protégé ;
- une procédure manuelle de restauration testée avant de devenir une automatisation critique.

La fréquence exacte et l’automatisation seront décidées après la première mise en exploitation, à partir du besoin réel.

# 10. Éléments explicitement différés

Ne sont pas des prérequis au lancement :

- un moteur de calendrier développé dans AKS Platform ;
- une interface AKS complète reproduisant Google Calendar ;
- un registre exhaustif avec historique avancé ;
- les suppléants de secours et procédures d’activation exceptionnelles ;
- les validations croisées systématiques ;
- l’automatisation complète des sauvegardes, relances et alertes ;
- les tests périodiques complexes de restauration ;
- les procédures détaillées de fonctionnement dégradé ;
- une journalisation événement par événement dans AKS Platform ;
- la synchronisation automatique avec Présences, Analytics ou d’autres modules.

Ces capacités seront réévaluées uniquement à partir d’un besoin constaté après usage.

# 11. Architecture et dépendances

```text
Utilisateurs et WordPress
          |
          v
     Google Calendar
          |
          v
AKS Platform, uniquement pour les intégrations utiles
```

Google Calendar gère les calendriers, événements, récurrences, invitations, rappels et partages. WordPress n’expose que Public. Toute future intégration AKS Platform respecte `ARCH-001`, `SECURITY-001`, `CONFIG-001`, `LOG-001`, `UI-001` et `UX-001`.

# 12. Incréments de réalisation

1. `CALENDAR-001` — cadrage et validation du socle.
2. `CALENDAR-002` — création des calendriers, partage initial et recette Google Calendar.
3. `CALENDAR-003` — publication du calendrier Public sur WordPress et guide utilisateur.
4. Évolutions AKS Platform uniquement si la recette met en évidence un besoin non couvert.

# 13. Critères d’acceptation de CALENDAR-001

Le cadrage est validable lorsque :

- les quatre calendriers et leurs audiences sont définis ;
- les droits initiaux sont compréhensibles et applicables dans Google Calendar ;
- le circuit Propositions vers Public est défini ;
- les calendriers internes sont explicitement exclus de toute publication ;
- le socle et les évolutions éventuelles sont clairement séparés ;
- aucun développement applicatif n’est requis pour commencer `CALENDAR-002` ;
- `INDEX-001` et `ROADMAP-001` sont alignés.

# 14. Décision de simplification

Le questionnaire de conception a été arrêté après 105 questions, car le niveau de détail devenait disproportionné au besoin d’un club.

Les décisions avancées restent des pistes possibles, mais ne bloquent ni la validation de ce document ni la mise en place du socle. La priorité est une solution utilisable, maintenable et réversible.

# 15. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-07-30 | Cadrage validé par le Product Owner ; socle autorisé à passer à CALENDAR-002 |
| 1.0.0 | 2026-07-30 | Cadrage initial simplifié après clôture du questionnaire métier ; séparation du socle et des évolutions éventuelles |
