# Lumière Ciné

Sitio web estático de Lumière Ciné, un cine de autor en San Salvador.

## Tecnologías

- **HTML5** semántico y accesible (navegación con teclado, etiquetas ARIA, foco visible).
- **Tailwind CSS 3** para los estilos. El CSS ya compilado está en `assets/css/styles.css`, así que el sitio funciona sin instalar nada.
- **JavaScript** sin dependencias: cabecera y pie compartidos, telón de entrada, marquesina con el programa del día, cartelera con filtros, compra de entradas con selección de asientos y boleto final, ficha de cada película, avisos de estreno con cuenta regresiva, alta de membresía con tarjeta de miembro, galería con visor y formularios con validación.
- **Font Awesome 6** para los íconos y fuentes **DM Serif Display** e **Inter**, todo incluido en el proyecto (funciona sin conexión).

## Cómo verlo

Abre `index.html` en el navegador. También puedes publicarlo tal cual en GitHub Pages, Netlify o Vercel.

## Estructura

```
index.html  cartelera.html  galeria.html  nosotros.html
autores.html  membresia.html  contacto.html
assets/
  css/styles.css        CSS compilado (no editar a mano)
  js/data.js            Películas, estrenos, galería y precio de entrada
  js/main.js            Cabecera, pie, tarjetas, modal de compra, avisos
  js/cartelera.js       Filtros por género y búsqueda
  js/galeria.js         Galería y visor de imágenes
  js/contacto.js        Pestañas, paquetes y validación de formularios
  img/                  Imágenes optimizadas en WebP
  fonts/  vendor/       Fuentes e íconos locales
src/input.css           Fuente de los estilos (Tailwind)
tailwind.config.js      Paleta de colores y tipografías
```

## Editar contenido

- **Cartelera y estrenos:** edita `assets/js/data.js`. Cada película tiene título, géneros, póster y horarios.
- **Precios por sala, planes de membresía y redes sociales:** también en `assets/js/data.js`. Cambia los enlaces de redes por las cuentas reales del cine.
- **Textos de cada página:** edita el `.html` correspondiente.
- **Enlaces útiles:** `contacto.html?paquete=vip#reservar` abre la reserva con el paquete elegido y `cartelera.html#comprar-marty-supreme` abre directamente la compra de esa película.

## Cambiar estilos

Si cambias clases en el HTML o el archivo `src/input.css`, vuelve a compilar el CSS:

```bash
npm install
npm run build     # compila una vez
npm run dev       # recompila al guardar
```

## Paleta

| Uso        | Color     |
|------------|-----------|
| Fondo      | `#0A0A0B` |
| Superficie | `#111113` |
| Texto      | `#F2EBDD` |
| Carmín     | `#C8102E` |
| Dorado     | `#C99A3E` |
