/* ==========================================================================
   Lumière Ciné — Datos del sitio
   Edita este archivo para actualizar la cartelera, los estrenos y precios.
   ========================================================================== */

window.LUMIERE = {
  // Precio de referencia por entrada (USD). Se usa en el modal de compra.
  precioEntrada: 7.5,

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
    },
    {
      id: 'dune-parte-tres',
      titulo: 'Dune: Parte Tres',
      generos: ['Ciencia ficción', 'Épica'],
      poster: 'assets/img/peliculas/dune-parte-tres.webp',
    },
  ],

  galeria: [
    { src: 'assets/img/galeria/galeria-1.webp', titulo: 'La Grande Scène', texto: 'Donde la luz cobra vida', alt: 'Fachada del cine Lumière Ciné', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-2.webp', titulo: 'Le Grand Théâtre', texto: 'Palcos dorados y la magia de lo clásico', alt: 'Gran sala clásica con palcos dorados', forma: 'wide' },
    { src: 'assets/img/galeria/galeria-3.webp', titulo: 'Immersion Totale', texto: 'Confort y arte', alt: 'Butaca VIP de terciopelo rojo', forma: 'square' },
    { src: 'assets/img/galeria/galeria-4.webp', titulo: 'Les Couloirs du Temps', texto: 'Un recorrido por la elegancia clásica', alt: 'Pasillo con cortinas rojas y alfombra art déco', forma: 'square' },
    { src: 'assets/img/galeria/galeria-5.webp', titulo: "Culte d'Hier et d'Aujourd'hui", texto: 'Un lugar donde las obras maestras nunca mueren', alt: 'Placa con próximas funciones clásicas', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-6.webp', titulo: "L'Âme du Cinéma", texto: 'El arte de proyectar sueños', alt: 'Proyector clásico', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-7.webp', titulo: 'Goût Élevé', texto: 'Un placer clásico y redefinido', alt: 'Copa de vino y palomitas Lumière', forma: 'tall' },
    { src: 'assets/img/galeria/galeria-8.webp', titulo: 'Le Bar de Nuit', texto: 'Un brindis antes y después de la función', alt: 'Barra del bar nocturno', forma: 'square' },
  ],
};
