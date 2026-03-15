const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /recettes — lister toutes les recettes
app.get('/recettes', async (req, res) => {
  try {
    const recettes = await prisma.recette.findMany();
    res.status(200).json(recettes);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /recettes/:id — récupérer une recette par son ID
app.get('/recettes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const recette = await prisma.recette.findUnique({ where: { id } });
    if (!recette) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    res.status(200).json(recette);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /recettes — créer une nouvelle recette
app.post('/recettes', async (req, res) => {
  try {
    const { titre, description, ingredients, temps_preparation, difficulte } = req.body;

    if (!titre || !ingredients || !temps_preparation || !difficulte) {
      return res.status(400).json({
        error: 'Les champs titre, ingredients, temps_preparation et difficulte sont obligatoires',
      });
    }

    const recette = await prisma.recette.create({
      data: {
        titre,
        description: description || null,
        ingredients,
        temps_preparation: parseInt(temps_preparation),
        difficulte,
      },
    });
    res.status(201).json(recette);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /recettes/:id — modifier une recette
app.put('/recettes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titre, description, ingredients, temps_preparation, difficulte } = req.body;

    if (!titre || !ingredients || !temps_preparation || !difficulte) {
      return res.status(400).json({
        error: 'Les champs titre, ingredients, temps_preparation et difficulte sont obligatoires',
      });
    }

    const existing = await prisma.recette.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    const recette = await prisma.recette.update({
      where: { id },
      data: {
        titre,
        description: description || null,
        ingredients,
        temps_preparation: parseInt(temps_preparation),
        difficulte,
      },
    });
    res.status(200).json(recette);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /recettes/:id — supprimer une recette
app.delete('/recettes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.recette.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    await prisma.recette.delete({ where: { id } });
    res.status(200).json({ message: 'Recette supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = { app, prisma };
