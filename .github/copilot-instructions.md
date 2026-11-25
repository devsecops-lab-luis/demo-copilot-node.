# Instrucciones para GitHub Copilot en este repositorio

- Responde siempre en español.
- El proyecto es una API REST en Node.js con Express y SQLite (paquete `sqlite3`).
- Usa siempre consultas parametrizadas (`?`) y nunca concatenes entrada del usuario en SQL.
- No uses `child_process.exec` con datos del usuario; si hace falta, usa `execFile` con argumentos separados y valida la entrada.
- Valida la entrada de cada endpoint y responde con códigos HTTP correctos (400, 404, 500).
- Las pruebas van en `tests/` y usan Jest + Supertest.
