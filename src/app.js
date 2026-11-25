// API de tareas — punto de partida para la demo de GitHub Copilot.
// Durante la demo, Copilot completa los endpoints marcados con "DEMO".
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// Listar todas las tareas
app.get('/tareas', (req, res) => {
  db.all('SELECT * FROM tareas', [], (err, filas) => {
    if (err) return res.status(500).json({ error: 'Error al consultar tareas' });
    res.json(filas);
  });
});

// DEMO paso 1: escribe el comentario de abajo y deja que Copilot complete el endpoint
// Obtener una tarea por id

// DEMO paso 1: crear una tarea nueva con el título que viene en el body

module.exports = app;
