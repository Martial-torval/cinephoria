# Projet Next.js – Référence pour réécriture Angular

## 🎯 Objectif du dépôt

Ce dépôt contient un projet **Next.js** servant de **référence fonctionnelle et technique** afin d’être **reproduit en Angular**.

L’objectif n’est **pas** de réutiliser le code tel quel, mais de :

- Comprendre l’architecture globale
- Identifier les fonctionnalités
- Reproduire les écrans, la logique métier et les flux en Angular

---

## 🧠 Philosophie du projet

- Le projet est volontairement **lisible et structuré**
- La logique est privilégiée à l’optimisation extrême
- Chaque fonctionnalité doit pouvoir être **mappée facilement vers Angular**

---

## 🛠 Stack technique

### Frontend

- **Next.js** (React)
- **TypeScript**
- **CSS / SCSS / Tailwind** (selon le cas)

### Outils

- Node.js >= 18
- npm ou yarn

---

## 🚀 Installation & lancement

```bash
# Cloner le dépôt
git clone <URL_DU_REPO>

# Installer les dépendances
npm install

# Lancer le projet en local
npm run dev
```

Le projet sera accessible sur :

```
http://localhost:3000
```

---

## 🗂 Structure du projet

```
.
├── src/app/            # Routing et pages (Next.js App Router)
│   ├── layout.tsx        # Layout global (équivalent AppComponent Angular)
│   ├── page.tsx          # Page principale
│   └── components/*      # Componsants UI Réutilisables
│   └── utils/api         # Logique métier / appels API
│   └── lib/*             # librairies
├── prisma/*            # ORM + Schema model DB
├── public/             # Assets statiques
└── README.md
```

👉 **Équivalence Angular suggérée** :

| Next.js      | Angular               |
| ------------ | --------------------- |
| app/page.tsx | Composant + route     |
| layout.tsx   | AppComponent / Layout |
| components/  | Shared Components     |
| services/    | Services Angular      |
| hooks/       | Services + RxJS       |

---

## 🧭 Routing

- Next.js utilise un **routing par fichiers**
- Chaque dossier dans `src/app/` correspond à une route

Exemple :

```
app/dashboard/page.tsx → /dashboard
```

👉 En Angular :

- Reproduire via `app-routing.module.ts`
- 1 page Next.js = 1 composant Angular

---

## 🧩 Composants

Les composants sont **présentationnels autant que possible**.

Exemple :

- `Button.tsx`
- `Modal.tsx`
- `Navbar.tsx`

👉 En Angular :

- Créer des composants dans un `SharedModule`
- Inputs / Outputs = props React

---

## 🔄 Gestion de l’état

- Utilisation de `useState`, `useEffect`, `useContext`
- Pas de store global complexe (Redux, Zustand, etc.)

👉 En Angular :

- Services singleton
- Observables (RxJS)
- `BehaviorSubject` si nécessaire

---

## 🌐 Appels API

Les appels API sont regroupés dans :

```
/utils/api
```

Exemple :

```ts
export const getUsers = async () => {
  const res = await fetch("/api/users");
  return res.json();
};
```

👉 En Angular :

- `HttpClient`
- Services dédiés
- Gestion des erreurs avec interceptors

---

## 🔐 Authentification (si applicable)

- Auth gérée côté client
- Token stocké en mémoire ou localStorage

👉 En Angular :

- AuthService
- Guard de routes

---

## 🎨 Styles

- Styles globaux dans `globals.css`
- Styles locaux par composant en tailwind.

👉 En Angular :

- Styles par composant (`.component.scss`)
- Ou styles globaux dans `styles.scss`

---

## 🧪 Tests (optionnel)

Actuellement :

- Peu ou pas de tests

👉 En Angular :

- Jasmine / Karma ou Jest

---

## 📋 Checklist de réécriture Angular

- [ ] Recréer le routing
- [ ] Recréer les pages
- [ ] Recréer les composants UI
- [ ] Migrer la logique métier
- [ ] Rebrancher les API
- [ ] Tester les flux utilisateurs

---

## ❓ Questions / Notes importantes

- Le projet sert de **base fonctionnelle**, pas de référence Angular
- Certaines implémentations React ne sont pas 1:1 avec Angular
- Ne pas chercher à copier le code, mais **le comportement**

---

## 👤 Contact

Si quelque chose n’est pas clair :
👉 **Demande avant d’implémenter** 🙂

---

Bon courage pour la réécriture Angular 💪

---

# 📁 Arborescence détaillée du projet

Cette section explique **dossier par dossier** l’architecture du projet Next.js afin de faciliter sa compréhension et sa **réécriture en Angular**.

## public/

### public/uploads

- Contient les fichiers uploadés (affiches de films, images diverses)
- Servi statiquement par Next.js

👉 Angular : dossier `assets/uploads/`

---

## src/app/

Dossier principal utilisant **Next.js App Router**. Chaque dossier correspond à une route.

### (auth)/

Groupe de routes d’authentification (non visible dans l’URL).

#### connexion/page.tsx

- Page de connexion (US 7)
- Formulaire login / mot de passe
- Redirection après connexion selon l’action initiale

#### inscription/page.tsx

- Création de compte utilisateur (US 6)
- Validation du mot de passe
- Envoi de mail de confirmation

👉 Angular : module `auth` avec composants `login` et `register`

---

### forgot-password/page.tsx

- Mot de passe oublié (US 11)
- Génération automatique et envoi par mail

### reset-password/page.tsx

- Modification obligatoire du mot de passe après reset

### verify-email/page.tsx

- Validation du compte après inscription via lien mail

---

### admin/page.tsx

- Espace Administrateur (US 8)
- Gestion films, séances, salles
- Création comptes employés
- Dashboard réservations (données NoSQL)

👉 Angular : `AdminModule` + guards de rôle

---

### intranet/page.tsx

- Espace Employé (US 9)
- Gestion films, séances, salles
- Validation / suppression des avis

👉 Angular : `EmployeeModule`

---

### mon-espace/page.tsx

- Espace Utilisateur (US 10)
- Consultation des commandes
- Dépôt d’avis après séance passée

👉 Angular : `UserModule`

---

### films/page.tsx

- Liste de tous les films (US 5)
- Affichage infos film + note
- Filtres : cinéma, genre, jour
- Accès aux séances d’un film

---

### reservations/

Dossier découpé en **plusieurs segments** représentant les étapes de réservation (US 4) :

- choix cinéma
- choix film
- choix séance
- choix sièges
- récapitulatif + paiement

👉 Angular : routing enfant avec `stepper`

---

### contact/page.tsx

- Formulaire de contact (US 12)
- Envoi d’email vers boîte générique Cinéphoria

---

## src/app/api/

Routes API Next.js (Backend intégré).

### api/auth

- Connexion, inscription
- Vérification email
- Reset mot de passe

### api/users

- Gestion utilisateurs
- Rôles (user, employé, admin)

### api/cinemas

- Gestion des cinémas (France / Belgique)

### api/movies

- CRUD films
- Labels, genres, âge minimum

### api/shows

- Séances (horaires, film, salle, qualité)

### api/room

- Gestion des salles
- Nombre de places
- Places PMR

### api/reservations

- Création et consultation des réservations
- Vérification des places disponibles

### api/reviews

- Avis utilisateurs
- Validation employé

### api/contact

- Réception et traitement des messages contact

### api/upload

- Upload fichiers (affiches)

👉 Angular : backend séparé (NestJS / Spring / autre)

---

## src/components/

- Tous les composants UI réutilisables
- Navbar, Footer, Cards films, Modals, Forms, etc.

👉 Angular : `SharedModule`

---

## src/lib/

### lib/db.ts / prisma.ts

- Connexion base de données
- ORM Prisma

### lib/auth.ts

- Logique d’authentification
- Vérification session / rôles

### lib/auth-client.ts

- Helpers côté client pour auth

### lib/auth.plugins.ts

- Extensions / middlewares auth

### lib/mail.ts

- Envoi des emails (confirmation, reset, contact)

### lib/schemas/

- Validation des données (Zod)

#### auth.ts

- Schémas login / register / password

#### movie.ts

- Schéma film

👉 Angular : Validators + DTOs

---

## src/types/

- Typage global TypeScript
- movie, cinema, booking, genre, review, show, etc.

👉 Angular : interfaces / models

---

## src/utils/

### api.ts

- Centralisation des appels API frontend

### enum.ts

- Enums globaux (rôles, statuts, qualités)

### genre.ts

- Helpers liés aux genres de films

### sendEmail.ts

- Utilitaire envoi mail

### uploadFile.ts

- Gestion upload fichiers

👉 Angular : services dédiés

---

## 🧩 Mapping global Next.js → Angular

| Next.js     | Angular            |
| ----------- | ------------------ |
| app/        | modules + routing  |
| page.tsx    | composant          |
| api/        | backend REST       |
| lib/        | core services      |
| components/ | shared components  |
| utils/      | services / helpers |

---

Ce README doit être utilisé comme **guide de lecture**, pas comme une recette à copier.
L’objectif est de comprendre le **fonctionnement métier** de Cinéphoria et de le reproduire fidèlement en Angular.

---

# 📦 Dépendances du projet

Cette section explique les **principales dépendances utilisées**, leur rôle dans le projet et leur **équivalent ou alternative côté Angular**.

## ⚛️ Framework & cœur applicatif

### next (v15)

- Framework React fullstack
- Gestion du routing, SSR, API routes

👉 Angular : Angular Framework + Router + éventuellement SSR (Angular Universal)

---

### react / react-dom (v19)

- Bibliothèque UI
- Rendu des composants et gestion du DOM

👉 Angular : moteur de rendu Angular

---

## 🔐 Authentification & sécurité

### next-auth

- Gestion de l’authentification (sessions, cookies)
- Protection des routes

👉 Angular : AuthService + Guards + JWT

---

### better-auth / validation-better-auth

- Logique d’authentification personnalisée
- Validation avancée des credentials

👉 Angular : services custom + validators

---

### bcrypt

- Hashage des mots de passe
- Sécurité des comptes utilisateurs

👉 Angular : côté backend uniquement

---

## 🗄 Base de données

### Architecture serverless

Le projet adopte une **architecture serverless** :

- Aucune infrastructure serveur dédiée
- Les API Next.js sont déployables en fonctions serverless
- La base de données est **hébergée à distance**

👉 Cela permet :

- Scalabilité automatique
- Réduction des coûts
- Simplicité de déploiement

---

### PostgreSQL – Neon.tech

- Base de données **PostgreSQL serverless** hébergée sur **Neon.tech**
- Connexion sécurisée via variables d’environnement
- Compatible avec Prisma

Neon fournit :

- Démarrage à froid rapide
- Branching de base (utile pour tests)
- Haute disponibilité

👉 Angular :

- Aucun accès direct à la base
- Communication via API backend (REST)

---

### prisma / @prisma/client

- ORM pour base PostgreSQL
- Gestion des modèles et migrations

👉 Angular : backend séparé (NestJS + Prisma ou TypeORM)

---

### pg

- Driver PostgreSQL

---

## ✉️ Emails

### nodemailer

- Envoi des emails :
  - confirmation de compte
  - reset mot de passe
  - formulaire de contact

👉 Angular : backend mail dédié

---

## 📅 Dates & planning

### dayjs

- Manipulation des dates
- Calcul des séances, jours, horaires

👉 Angular : DatePipe / dayjs / date-fns

---

### react-calender-horizontal

### @borase-healthcare-limited/react-native-horizontal-calender

### @meinefinsternis/react-horizontal-date-picker

- Sélecteurs de dates horizontaux
- Utilisés pour le choix des séances

👉 Angular : Angular Material Datepicker ou composant custom

---

## 🎟 Réservation & sièges

### @seatmap.pro/renderer

- Rendu interactif du plan de salle
- Sélection des sièges (PMR inclus)

👉 Angular : intégration directe de la lib ou alternative équivalente

---

## 🎨 UI / UX

### tailwindcss

- Framework CSS utilitaire

### tailwind-merge

- Fusion intelligente des classes Tailwind

### tailwindcss-animate

- Animations CSS

👉 Angular : Tailwind possible ou Angular Material

---

### class-variance-authority / clsx

- Gestion conditionnelle des classes CSS

👉 Angular : ngClass

---

### lucide-react

- Icônes SVG

👉 Angular : lucide-angular / material icons

---

### hamburger-react

- Bouton menu responsive

---

### swiper

- Sliders / carrousels
- Films en page d’accueil

👉 Angular : swiper/angular

---

### motion

- Animations (équivalent Framer Motion)

👉 Angular : Angular Animations

---

### react-hot-toast

- Notifications (succès, erreurs)

👉 Angular : Snackbar / Toast service

---

### usehooks-ts

- Hooks utilitaires (debounce, localStorage, etc.)

👉 Angular : services utilitaires

---

## 🧪 Validation & typage

### zod

- Validation des formulaires et données API

👉 Angular : Validators + DTO

---

### uuid

- Génération d’identifiants uniques

---

## 🛠 Outils de développement

### typescript

- Typage strict

### eslint / eslint-config-next

- Linting

### tailwindcss / postcss

- Build CSS

### tsx / ts-node

- Exécution scripts TypeScript (seed Prisma)

---

## 🌱 Scripts utiles

```bash
npm run dev        # Lancement en local
npm run build      # Build production
npm run start      # Serveur prod
npm run seed       # Seed base de données
```

---

Cette liste permet à un développeur Angular de **comprendre pourquoi chaque dépendance existe** et de savoir **quoi remplacer ou adapter** dans l’écosystème Angular.
