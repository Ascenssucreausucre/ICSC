# 🌐 Projet Web Full Stack – React, Express, Sequelize & Stripe

## 👤 Réalisé par : [Ton nom ici]
Diplômé BUT MMI (3e année) | Développeur Full Stack Junior+

---

## 🚀 Description générale

Application web full stack développée **entièrement from scratch** :
- Frontend : **React.js**
- Backend : **Express.js + Sequelize**
- Base de données relationnelle : **26 tables** avec relations complexes
- Paiement : **Stripe** avec logique conditionnelle (pays, statut utilisateur, etc.)
- Temps réel : **Socket.io** (chat + mises à jour live)
- Déploiement **CI/CD avec Railway**

---

## 🧩 Fonctionnalités principales

### ✅ Frontend (React)
- UI/UX 100 % personnalisée (pas de framework CSS externe)
- Application **PWA** avec notifications
- **Chat Socket.io** en temps réel avec les admins
- Mise à jour dynamique des données (live sync)
- 6 pages principales + dashboard admin complet
- Affichage conditionnel selon le rôle / statut de l’utilisateur

### ✅ Backend (Express + Sequelize)
- Authentification sécurisée via **JWT + cookies**
- Middlewares pour contrôle d'accès (statut, rôle)
- **Architecture MVC**
- **Import automatisé via fichiers Excel**
- API REST structurée
- Logique métier avancée : gestion de transactions Stripe selon pays, statut, etc.
- **Double validation** des données : `express-validator` + règles Sequelize

### ✅ Base de données
- 26 tables relationnelles
- Relations complexes (1-N, N-N)
- Conception orientée métier
- Validations et contraintes en base

### ✅ Déploiement
- CI/CD complet via **Railway** :
  - Frontend
  - Backend
  - PostgreSQL DB
- Résolution d’erreurs en environnement distant malgré proxy d’entreprise

---

## 🧪 Améliorations à venir
| Tâche | État | Détail |
|-------|------|--------|
| 🔄 Intégration finale Stripe | ⏳ En cours | Paiement réel + webhooks |
| ✅ Tests E2E (Cypress) | 🧪 À faire | Login, paiement, chat |
| ✅ Tests backend (Jest/Supertest) | 🧪 À faire | Routes API |
| ✅ Sécurité avancée | 🔍 Partiel | Helmet, CSRF, validation upload |
| 🧾 Documentation API | 🧾 À faire | Markdown ou Swagger |

---

## 🧠 Compétences acquises

| Compétence | Niveau |
|------------|--------|
| React (Hooks, State, Routing) | ✅ Avancé |
| Express + Middleware + Auth JWT | ✅ Avancé |
| Sequelize ORM | ✅ Confirmé |
| Socket.io / WebSocket | ✅ Solide |
| Stripe (paiement conditionnel) | 🟡 En cours |
| UI/UX frontend from scratch | ✅ Solide |
| CI/CD avec Railway | ✅ En place |
| PWA + Notifications | ✅ OK |
| Debug en prod | ✅ Expérimenté |
| MVC / API REST | ✅ Structuré |
| Validations & messages API | ✅ Robuste |

---

## 📦 Idées d'intégration
- `README.md` GitHub
- Portfolio personnel (section “Projet Professionnel”)
- Support technique en entretien
- Article LinkedIn / Dev.to

---

## 🔗 Liens utiles (à personnaliser)
- 🌍 [Lien vers la démo live](https://...)
- 💻 [Dépôt GitHub frontend](https://github.com/...)
- 💻 [Dépôt GitHub backend](https://github.com/...)
