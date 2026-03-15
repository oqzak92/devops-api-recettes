# API Recettes

API REST de gestion de recettes de cuisine. Construite avec **Node.js + Express + Prisma + SQLite**.

## Prérequis

- Node.js >= 18
- npm

## Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd devops-api-recettes

# Installer les dépendances (génère aussi le client Prisma)
npm install

# Configurer l'environnement
cp .env.example .env

# Créer la base de données
npx prisma db push
```

## Lancer le serveur

```bash
npm start
# Serveur disponible sur http://localhost:3000
```

## Routes disponibles

| Méthode | Route            | Description                      | Code retour   |
|---------|------------------|----------------------------------|---------------|
| GET     | /health          | Health check                     | 200           |
| GET     | /recettes        | Lister toutes les recettes       | 200           |
| GET     | /recettes/:id    | Récupérer une recette par son ID | 200 ou 404    |
| POST    | /recettes        | Créer une nouvelle recette       | 201 ou 400    |
| PUT     | /recettes/:id    | Modifier une recette             | 200 ou 404    |
| DELETE  | /recettes/:id    | Supprimer une recette            | 200 ou 404    |

## Exemple d'utilisation

```bash
# Créer une recette
curl -X POST http://localhost:3000/recettes \
  -H "Content-Type: application/json" \
  -d '{"titre":"Tarte aux pommes","ingredients":"pommes, farine, beurre","temps_preparation":45,"difficulte":"facile"}'

# Lister les recettes
curl http://localhost:3000/recettes

# Récupérer une recette
curl http://localhost:3000/recettes/1

# Modifier une recette
curl -X PUT http://localhost:3000/recettes/1 \
  -H "Content-Type: application/json" \
  -d '{"titre":"Tarte tatin","ingredients":"pommes, farine, beurre, sucre","temps_preparation":60,"difficulte":"moyen"}'

# Supprimer une recette
curl -X DELETE http://localhost:3000/recettes/1
```

## Modèle de données

| Champ              | Type     | Obligatoire | Description                              |
|--------------------|----------|-------------|------------------------------------------|
| id                 | Int      | auto        | Identifiant unique                       |
| titre              | String   | oui         | Nom de la recette                        |
| description        | String   | non         | Description libre                        |
| ingredients        | String   | oui         | Liste des ingrédients                    |
| temps_preparation  | Int      | oui         | Durée en minutes                         |
| difficulte         | String   | oui         | "facile", "moyen" ou "difficile"         |
| createdAt          | DateTime | auto        | Date de création                         |
| updatedAt          | DateTime | auto        | Date de dernière modification            |

## Tests

```bash
npm test
```

Les tests couvrent les cas nominaux (création, lecture, modification, suppression) et les cas d'erreur (400 champ manquant, 404 ID inexistant).

## Linter

```bash
npm run lint
```

## Pipeline CI/CD

Le pipeline GitHub Actions se déclenche sur chaque push et Pull Request :

1. **Lint** — vérifie le code avec ESLint
2. **Tests** — exécute les tests (dépend du job Lint)

## Auteur
Projet réalisé dans le cadre du cours DevOps.
