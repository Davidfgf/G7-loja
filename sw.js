self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', function(event) {
  // Pode adicionar cache aqui futuramente se quiser funcionar offline
});