// Copia las mini-apps (CardioSegui y MamaSegui) adentro de public/ para armar la app de Android.
// En la web cada una se publica desde su propio repositorio; la app de Android necesita todo junto.
// Las copias están en .gitignore: NO se suben a GitHub. Se ejecuta con:  npm run copiar-apps
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const apps = [
  { nombre: "cardiosegui", origen: path.join(raiz, "..", "public") },             // C:\practica-claude\public
  { nombre: "mamasegui",   origen: path.join(raiz, "..", "mamasegui", "public") } // C:\practica-claude\mamasegui\public
];

for (const app of apps) {
  const destino = path.join(raiz, "public", app.nombre);
  if (!fs.existsSync(path.join(app.origen, "index.html"))) {
    console.error(`✗ No encontré ${app.nombre} en ${app.origen}`);
    process.exitCode = 1;
    continue;
  }
  fs.rmSync(destino, { recursive: true, force: true });   // borra la copia vieja
  fs.cpSync(app.origen, destino, { recursive: true });
  console.log(`✓ ${app.nombre} copiada en public/${app.nombre}`);
}

// capacitor.js: permite que las páginas usen los plugins (notificaciones) dentro de la app.
// Solo se carga en Android; en la web no existe y no hace falta.
fs.copyFileSync(path.join(raiz, "node_modules", "@capacitor", "core", "dist", "capacitor.js"),
                path.join(raiz, "public", "capacitor.js"));
console.log("✓ capacitor.js copiado en public/");
