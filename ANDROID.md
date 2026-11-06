# HospiFava para Android (Capacitor)

La app de Android usa las mismas páginas que la web: Hospifava (`public/`) + CardioSegui + MamaSegui.
Capacitor las "envuelve" en una app. La carpeta `android/` es el proyecto de Android Studio.

## Requisitos (una sola vez)
- Node.js y Android Studio instalados.
- Las 3 carpetas una al lado de la otra: `C:\practica-claude` (CardioSegui), `...\hospifava`, `...\mamasegui`.
- En esta carpeta: `npm install`

## Generar el APK
1. `npm run android`: copia CardioSegui y MamaSegui adentro de `public/` y pasa todo al proyecto Android.
   Hacelo **cada vez** que cambies algo en cualquiera de las apps.
2. `npm run abrir-android`: abre Android Studio. La primera vez esperá a que termine "Gradle sync" (abajo).
3. Menú **Build > Generate App Bundles or APKs > Generate APKs**.
4. Cuando termine, tocá **locate**: el archivo es `android/app/build/outputs/apk/debug/app-debug.apk`.
5. Pasalo al celular (cable, Drive, WhatsApp) y abrilo. Android pide permitir "instalar apps desconocidas".

Sin abrir Android Studio (desde la terminal, en la carpeta `android`), con el Java de Android Studio:
```
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew.bat assembleDebug
```

## Para publicar en Google Play
El APK "debug" sirve para probar. Para Play Store hace falta una versión firmada:
**Build > Generate Signed App Bundle or APK** (crea una "keystore": guardala bien, sin ella no se puede actualizar la app).

## Notas
- `public/cardiosegui/`, `public/mamasegui/` y `public/capacitor.js` son copias: no se suben a GitHub.
- Notificaciones: solo existen en la app. En la web CardioSegui funciona igual, sin avisos.
- Ícono de las notificaciones: `android/app/src/main/res/drawable/ic_notificacion.xml`.
