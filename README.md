# Demo: GitHub Copilot (plan Free) + seguridad con CodeQL y Autofix

API de tareas en Node.js/Express diseñada para mostrar, en unos 12 minutos, qué puede hacer GitHub Copilot con el plan **gratuito**, y cómo se conecta con GitHub Advanced Security.

> **Presupuesto del plan Free:** 2,000 completados y **50 mensajes de chat al mes**. Este guion usa unos **5 mensajes**, así que alcanza para ensayar 2 o 3 veces y hacer la demo real.

---

## 0. Preparación (un día antes)

1. Crea un repo **público** en la org `devsecops-lab-luis` (por ejemplo, `demo-copilot-node`) y sube este proyecto a `main`.
2. En **Settings → Code security**, activa *Code scanning (CodeQL)* y verifica que **Copilot Autofix** esté habilitado.
3. Espera a que corra el workflow `CodeQL` en `main`. Debe salir **sin alertas**, porque la carpeta `demo-vulnerable/` se ignora a propósito.
4. En VS Code:
   - Instala las extensiones **GitHub Copilot** y **GitHub Copilot Chat**, e inicia sesión con tu cuenta.
   - Clona el repo y corre `npm install` y `npm test`. Debe pasar 1 prueba.
5. **Ensayo de seguridad:** haz el paso 4 completo una vez para confirmar que CodeQL detecta las alertas y que aparece el botón de Autofix. Después cierra ese PR sin hacer merge.

---

## 1. Autocompletado (2 min, sin gastar chat)

**Qué mostrar:** Copilot escribe código a partir de comentarios en español.

1. Abre `src/app.js`.
2. Ve al comentario `// Obtener una tarea por id`, pon el cursor al final y presiona **Enter**.
3. Copilot sugiere en gris el endpoint `GET /tareas/:id`. Acéptalo con **Tab**.
4. Repite con `// DEMO paso 1: crear una tarea nueva...`, que genera `POST /tareas`.
5. Corre `npm start` y prueba:
   ```bash
   curl http://localhost:3000/tareas/1
   curl -X POST http://localhost:3000/tareas -H "Content-Type: application/json" -d '{"titulo":"Probar Copilot"}'
   ```

💬 **Mensaje clave:** "El desarrollador describe la intención y Copilot escribe el código."

---

## 2. Copilot Chat (3 min, 2 mensajes)

**Qué mostrar:** Copilot entiende el proyecto y genera pruebas.

1. Abre el archivo `.github/copilot-instructions.md` y explica que son **instrucciones del equipo**: idioma, reglas de seguridad y estilo. Copilot las sigue en todo el repo.
2. Abre Copilot Chat en modo **Ask**, con `src/app.js` abierto. Mensaje 1:
   > Explícame qué hace este archivo y qué le falta para estar listo para producción.
3. Abre `tests/tareas.test.js`. Mensaje 2:
   > Genera pruebas con Jest y Supertest para GET /tareas/:id y POST /tareas, incluyendo casos de error (id inexistente y título vacío).
4. Inserta el código sugerido y corre `npm test`.

💬 **Mensaje clave:** "Las pruebas que nadie quiere escribir, en segundos."

---

## 3. Modo agente (3 min, 1–2 mensajes)

**Qué mostrar:** Copilot trabaja solo en varios archivos y corre comandos.

1. En Copilot Chat cambia el modo a **Agent**. Mensaje 3:
   > Agrega un endpoint PATCH /tareas/:id para marcar una tarea como completada. Valida la entrada, maneja errores con los códigos HTTP correctos, agrega sus pruebas y corre npm test hasta que todo pase.
2. Muestra cómo:
   - Edita `src/app.js` y `tests/tareas.test.js`.
   - **Pide permiso** antes de ejecutar `npm test` (es un buen punto de control de seguridad para mencionar).
   - Si una prueba falla, la lee y se corrige solo.
3. Revisa los cambios con **Keep / Undo**. El humano siempre aprueba.

💬 **Mensaje clave:** "Ya no solo sugiere líneas: ejecuta tareas completas con supervisión."

---

## 4. Seguridad: CodeQL + Copilot Autofix (3 min, 0–1 mensajes)

**Qué mostrar:** el código inseguro se detecta antes del merge y la IA propone el arreglo. Esto conecta con la demo de GHAS.

1. Crea una rama y mete el código vulnerable:
   ```bash
   git checkout -b feature/buscar-usuarios
   cp demo-vulnerable/usuarios.js src/usuarios.js
   ```
2. En `src/app.js`, antes de `module.exports`, agrega:
   ```js
   app.use('/usuarios', require('./usuarios'));
   ```
3. Opcional, para mostrar el ataque en vivo con `npm start`:
   ```bash
   curl "http://localhost:3000/usuarios/buscar?nombre='%20OR%20'1'='1"
   ```
   Regresa **todos** los usuarios: es una inyección SQL.
4. Haz commit y push, y abre un **Pull Request** hacia `main`.
5. En el PR, el check de **CodeQL** reporta:
   - *Database query built from user-controlled sources* (inyección SQL)
   - *Uncontrolled command line* (inyección de comandos)
6. En la alerta, Copilot Autofix propone el parche. Muéstralo y haz **Commit suggestion**.
7. CodeQL vuelve a correr y las alertas se cierran.

**Plan B** (si Autofix no aparece): selecciona el código en `src/usuarios.js` y en Chat escribe el mensaje 4:
> /fix corrige las vulnerabilidades de inyección SQL y de comandos de este archivo

💬 **Mensaje clave:** "Copilot ayuda a escribir más rápido y GHAS + Autofix evita que lo inseguro llegue a producción."

---

## 5. Cierre (1 min): qué agregaría un plan de pago

| Función | Free | Pro / Business |
|---|---|---|
| Autocompletado | 2,000/mes | Ilimitado |
| Chat en el IDE | 50 mensajes/mes | Ilimitado con modelos incluidos |
| Modo agente en VS Code | ✅ | ✅ |
| **Coding agent** (asignar un issue y recibir un PR) | ❌ | ✅ |
| Elegir modelo | Solo automático | ✅ |
| Administración central y políticas (Business) | ❌ | ✅ |

> Desde junio de 2026, Copilot cobra por uso con *AI Credits*. Conviene estimar el costo antes de pedir licencias.

---

## Estructura del repo

```
├── .github/
│   ├── copilot-instructions.md   # Reglas del equipo para Copilot
│   └── workflows/codeql.yml      # Escaneo de seguridad en push y PR
├── demo-vulnerable/usuarios.js   # Código inseguro para el paso 4 (no se escanea aquí)
├── src/
│   ├── app.js                    # API con huecos para que Copilot los complete
│   ├── db.js                     # SQLite en memoria con datos de ejemplo
│   └── server.js
└── tests/tareas.test.js
```

⚠️ `demo-vulnerable/` contiene vulnerabilidades **a propósito**. No lo uses fuera de la demo.
