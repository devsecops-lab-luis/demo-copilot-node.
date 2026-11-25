// Base de datos SQLite en memoria con datos de ejemplo.
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    completada INTEGER NOT NULL DEFAULT 0
  )`);
  db.run(`CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL
  )`);

  const tareas = ['Configurar GHAS', 'Revisar alertas de Dependabot', 'Preparar demo de Copilot'];
  tareas.forEach((t) => db.run('INSERT INTO tareas (titulo) VALUES (?)', [t]));

  db.run("INSERT INTO usuarios (nombre, rol) VALUES ('luis', 'admin'), ('nestor', 'dev'), ('elliot', 'dev')");
});

module.exports = db;
