const request = require('supertest');
const { app, prisma } = require('../src/app');

beforeEach(async () => {
  await prisma.recette.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /health', () => {
  it('retourne 200 avec status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /recettes', () => {
  it('crée une recette et retourne 201', async () => {
    const res = await request(app).post('/recettes').send({
      titre: 'Tarte aux pommes',
      ingredients: 'pommes, farine, beurre, sucre',
      temps_preparation: 45,
      difficulte: 'facile',
    });
    expect(res.status).toBe(201);
    expect(res.body.titre).toBe('Tarte aux pommes');
    expect(res.body.id).toBeDefined();
  });

  it('retourne 400 si les champs obligatoires sont manquants', async () => {
    const res = await request(app).post('/recettes').send({
      titre: 'Recette incomplète',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /recettes', () => {
  it('retourne la liste de toutes les recettes', async () => {
    await prisma.recette.createMany({
      data: [
        { titre: 'Quiche lorraine', ingredients: 'oeufs, lardons, crème', temps_preparation: 30, difficulte: 'moyen' },
        { titre: 'Ratatouille', ingredients: 'courgettes, aubergines, tomates', temps_preparation: 60, difficulte: 'moyen' },
      ],
    });

    const res = await request(app).get('/recettes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});

describe('GET /recettes/:id', () => {
  it('retourne une recette par son ID', async () => {
    const recette = await prisma.recette.create({
      data: { titre: 'Soupe à l\'oignon', ingredients: 'oignons, bouillon, gruyère', temps_preparation: 40, difficulte: 'facile' },
    });

    const res = await request(app).get(`/recettes/${recette.id}`);
    expect(res.status).toBe(200);
    expect(res.body.titre).toBe('Soupe à l\'oignon');
  });

  it('retourne 404 pour un ID inexistant', async () => {
    const res = await request(app).get('/recettes/99999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('PUT /recettes/:id', () => {
  it('modifie une recette existante et retourne 200', async () => {
    const recette = await prisma.recette.create({
      data: { titre: 'Soupe', ingredients: 'légumes, eau', temps_preparation: 20, difficulte: 'facile' },
    });

    const res = await request(app).put(`/recettes/${recette.id}`).send({
      titre: 'Soupe de légumes',
      ingredients: 'légumes, eau, sel, poivre',
      temps_preparation: 25,
      difficulte: 'facile',
    });
    expect(res.status).toBe(200);
    expect(res.body.titre).toBe('Soupe de légumes');
  });

  it('retourne 404 pour un ID inexistant', async () => {
    const res = await request(app).put('/recettes/99999').send({
      titre: 'Test',
      ingredients: 'test',
      temps_preparation: 10,
      difficulte: 'facile',
    });
    expect(res.status).toBe(404);
  });

  it('retourne 400 si les champs obligatoires sont manquants', async () => {
    const recette = await prisma.recette.create({
      data: { titre: 'Pizza', ingredients: 'pâte, tomate, mozzarella', temps_preparation: 30, difficulte: 'facile' },
    });

    const res = await request(app).put(`/recettes/${recette.id}`).send({ titre: 'Pizza modifiée' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /recettes/:id', () => {
  it('supprime une recette et retourne 200', async () => {
    const recette = await prisma.recette.create({
      data: { titre: 'À supprimer', ingredients: 'test', temps_preparation: 5, difficulte: 'facile' },
    });

    const res = await request(app).delete(`/recettes/${recette.id}`);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/recettes/${recette.id}`);
    expect(check.status).toBe(404);
  });

  it('retourne 404 pour un ID inexistant', async () => {
    const res = await request(app).delete('/recettes/99999');
    expect(res.status).toBe(404);
  });
});
