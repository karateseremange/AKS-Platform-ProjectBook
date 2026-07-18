# CORE-001
# AKS Core — Socle fonctionnel de la plateforme

Version : 1.0  
Statut : Validé  
Version du produit : V1.1

---

# 1. Objet

Le présent document définit le rôle, le périmètre et les responsabilités d'AKS Core.

AKS Core constitue le socle commun de la plateforme. Il fournit les capacités réutilisables nécessaires au fonctionnement des modules métier, sans contenir de logique métier spécifique.

---

# 2. Principes

AKS Core respecte les principes suivants :

- aucune logique métier propre à un module ;
- réutilisation maximale ;
- stabilité et compatibilité ascendante ;
- services mutualisés ;
- configuration centralisée ;
- sécurité par défaut ;
- extensibilité sans régression.

---

# 3. Responsabilités

AKS Core est responsable de :

- fournir les services communs ;
- garantir un comportement homogène entre les modules ;
- offrir des interfaces stables ;
- centraliser les mécanismes techniques réutilisables.

AKS Core n'est pas responsable :

- des règles métier ;
- des traitements spécifiques à un module ;
- des interfaces utilisateur propres aux modules.

---

# 4. Services communs

Les services communs fournis ou appelés à être fournis comprennent notamment :

## 4.1 Paramétrage

- saison active ;
- identité du club ;
- paramètres applicatifs ;
- configuration des intégrations.

Référence : CONFIG-001.

## 4.2 Journalisation

- événements fonctionnels ;
- erreurs ;
- suivi des traitements ;
- audit.

Référence : LOG-001.

## 4.3 Notifications

- courriels ;
- notifications applicatives futures.

## 4.4 Génération documentaire

- PDF ;
- exports.

## 4.5 API et intégrations

- interfaces communes avec les services externes ;
- gestion des échanges.

---

# 5. Relations avec les modules

Tous les modules métier utilisent AKS Core.

Les modules ne doivent pas implémenter eux-mêmes un service déjà disponible dans AKS Core.

Une fonctionnalité commune identifiée dans plusieurs modules doit être déplacée dans AKS Core.

---

# 6. Modules concernés

Les modules utilisant AKS Core comprennent notamment :

- Questionnaire Santé ;
- AKS Analytics ;
- AKS Calendar ;
- futurs modules métier.

---

# 7. Évolution

Toute évolution d'AKS Core doit :

- bénéficier à plusieurs modules ou répondre à un besoin transversal ;
- préserver la compatibilité ;
- être documentée avant publication ;
- être validée avant utilisation par un module.

---

# 8. Critères de conformité

Une évolution est conforme lorsque :

- elle ne contient pas de logique métier spécifique ;
- elle améliore un service commun ;
- elle ne crée pas de dépendance entre modules ;
- elle respecte ARCH-001.

---

# 9. Références

- ARCH-001 — Architecture fonctionnelle
- CONFIG-001 — Paramétrage (à produire)
- LOG-001 — Journalisation (à produire)
- ADMIN-001 — Administration (à produire)

---

# 10. Conclusion

AKS Core constitue le socle de la plateforme. Il garantit la cohérence, la mutualisation des services et la stabilité nécessaires au développement des modules métier actuels et futurs.
