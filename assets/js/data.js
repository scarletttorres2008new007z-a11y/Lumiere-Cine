/* ==========================================================================
   Lumière Ciné — Datos del sitio
   Edita este archivo para actualizar la cartelera, los estrenos y precios.
   ========================================================================== */

window.LUMIERE = {
  // Precio por entrada (USD) según la sala. Se usa en la compra de entradas.
  precios: { 'Sala 1': 7.5, 'Sala 2': 7.5, 'Sala VIP': 12 },

  // Redes sociales (cámbialas por las cuentas reales del cine)
  redes: {
    Facebook: 'https://www.facebook.com/',
    Instagram: 'https://www.instagram.com/',
    X: 'https://x.com/',
    YouTube: 'https://www.youtube.com/',
    TikTok: 'https://www.tiktok.com/',
  },

  // Planes de membresía (precio mensual en USD)
  planes: {
    clasica: { nombre: 'Clásica', precio: 9 },
    gold: { nombre: 'Gold', precio: 19 },
    vip: { nombre: 'VIP', precio: 39 },
  },

  cartelera: [
    {
      id: 'una-batalla-tras-otra',
      titulo: 'Una batalla tras otra',
      generos: ['Drama'],
      poster: 'assets/img/peliculas/una-batalla-tras-otra.webp',
      horarios: ['14:30', '17:00', '20:15'],
      sala: 'Sala 1',
    },
    {
      id: 'cumbres-borrascosas',
      titulo: 'Cumbres Borrascosas',
      generos: ['Ficción gótica', 'Tragedia'],
      poster: 'assets/img/peliculas/cumbres-borrascosas.webp',
      horarios: ['16:00', '18:30', '21:00'],
      sala: 'Sala 2',
    },
    {
      id: 'marty-supreme',
      titulo: 'Marty Supreme',
      generos: ['Biografía', 'Deportes'],
      poster: 'assets/img/peliculas/marty-supreme.webp',
      horarios: ['14:00', '17:30', '20:00'],
      sala: 'Sala VIP',
    },
  ],

  proximos: [
    {
      id: 'michael',
      titulo: 'Michael',
      generos: ['Drama', 'Biografía'],
      poster: 'assets/img/peliculas/michael.webp',
    },
    {
      id: 'avengers-doomsday',
      titulo: 'Avengers: Doomsday',
      generos: ['Acción', 'Superhéroes'],
      poster: 'assets/img/peliculas/avengers-doomsday.webp',
      estreno: '2026-12-18',
    },
    {
      id: 'dune-parte-tres',
      titulo: 'Dune: Parte Tres',
      generos: ['Ciencia ficción', 'Épica'],
      poster: 'assets/img/peliculas/dune-parte-tres.webp',
      estreno: '2026-12-18',
    },
  ],

  galeria: [
    { src: 'assets/img/galeria/galeria-1.webp', categoria: 'Arquitectura', titulo: 'La Grande Scène', texto: 'Donde la luz cobra vida', alt: 'Fachada del cine Lumière Ciné', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-2.webp', categoria: 'Salas', titulo: 'Le Grand Théâtre', texto: 'Palcos dorados y la magia de lo clásico', alt: 'Gran sala clásica con palcos dorados', forma: 'wide' },
    { src: 'assets/img/galeria/galeria-3.webp', categoria: 'Salas', titulo: 'Immersion Totale', texto: 'Confort y arte', alt: 'Butaca VIP de terciopelo rojo', forma: 'square' },
    { src: 'assets/img/galeria/galeria-4.webp', categoria: 'Arquitectura', titulo: 'Les Couloirs du Temps', texto: 'Un recorrido por la elegancia clásica', alt: 'Pasillo con cortinas rojas y alfombra art déco', forma: 'square' },
    { src: 'assets/img/galeria/galeria-5.webp', categoria: 'Detalles', titulo: "Culte d'Hier et d'Aujourd'hui", texto: 'Un lugar donde las obras maestras nunca mueren', alt: 'Placa con próximas funciones clásicas', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-6.webp', categoria: 'Detalles', titulo: "L'Âme du Cinéma", texto: 'El arte de proyectar sueños', alt: 'Proyector clásico', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-7.webp', categoria: 'Bar', titulo: 'Goût Élevé', texto: 'Un placer clásico y redefinido', alt: 'Copa de vino y palomitas Lumière', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-8.webp', categoria: 'Bar', titulo: 'Le Bar de Nuit', texto: 'Un brindis antes y después de la función', alt: 'Barra del bar nocturno', forma: 'square' },
  ],
};
