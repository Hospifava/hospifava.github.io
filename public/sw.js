// =========================================================
// Service worker de Hospifava (la app central)
// Guarda una copia de la pantalla central para que abra sin conexión.
//
// IMPORTANTE: este service worker vive en la raíz del sitio (hospifava.github.io/),
// así que el navegador le pasaría también los pedidos de /cardiosegui/ y de las
// futuras apps. Por eso SOLO atiende sus propios archivos y deja pasar todo lo demás:
// cada app (CardioSegui, etc.) tiene su propio service worker.
//
// Cada vez que publiques cambios en esta pantalla, subí el número de VERSION.
// =========================================================

const VERSION = "hospifava-v3";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./logo-favaloro.png",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

// Rutas propias, como "/", "/index.html", "/icons/icon-192.png"
const RUTAS_PROPIAS = new Set(ARCHIVOS.map(a => new URL(a, self.registration.scope).pathname));

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      // Solo borra cachés viejas de Hospifava; no toca las de CardioSegui u otras apps
      .then(claves => Promise.all(claves
        .filter(c => c.startsWith("hospifava-") && c !== VERSION)
        .map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  const url = new URL(pedido.url);
  if (pedido.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (!RUTAS_PROPIAS.has(url.pathname)) return;   // /cardiosegui/ y otras apps: no se tocan

  if (pedido.mode === "navigate") {
    // Pantalla central: primero internet (última versión); sin conexión, la copia guardada
    evento.respondWith(
      fetch(pedido)
        .then(respuesta => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(VERSION).then(cache => cache.put("./index.html", copia));
          }
          return respuesta;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  evento.respondWith(caches.match(pedido).then(guardado => guardado || fetch(pedido)));
});
