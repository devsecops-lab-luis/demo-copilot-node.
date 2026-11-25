// ⚠️ CÓDIGO VULNERABLE A PROPÓSITO — SOLO PARA LA DEMO ⚠️
// Copia este archivo a src/usuarios.js en una rama nueva y abre un PR.
// CodeQL debe detectar: inyección SQL y inyección de comandos.
const express = require('express');
const { exec } = require('child_process');
const db = require('./db');

const router = express.Router();

// Vulnerabilidad 1: inyección SQL (concatena la entrada del usuario en la consulta)
// Prueba: /usuarios/buscar?nombre=' OR '1'='1
router.get('/buscar', (req, res) => {
  const consulta = "SELECT * FROM usuarios WHERE nombre = '" + req.query.nombre + "'";
  db.all(consulta, [], (err, filas) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(filas);
  });
});

// Vulnerabilidad 2: inyección de comandos (pasa la entrada directo al shell)
// Prueba: /usuarios/ping?host=127.0.0.1;whoami
router.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, salida) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(salida);
  });
});

module.exports = router;
