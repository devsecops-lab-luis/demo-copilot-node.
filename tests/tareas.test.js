const request = require('supertest');
const app = require('../src/app');

describe('GET /tareas', () => {
  test('regresa la lista de tareas', async () => {
    const res = await request(app).get('/tareas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// DEMO paso 2: pídele a Copilot Chat que genere aquí las pruebas de los endpoints nuevos
