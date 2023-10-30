import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { cacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute, Route } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { Expirationplugin } from 'workbox-expiration' ;


const pageCache = new cacheFirst({
   cacheName: ' noticias ',
   plugins: [
      new CacheableResponsePlugin({
         statuses: [0, 200],
      }),
    new Expirationplugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
   ],
});


warmStrategyCache({
   urls: ['/index.html', '/',
    "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500&display=swap"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

registerRoute( 
    ({ request }) => ['style', 'script', 'worker']
  .includes(request.destination),
new StaleWhileRevalidate({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [O, 200],
      }),
    ],
  }),
);

offlineFallback({ 
 pageFallback: '/offline. html' ,
});

const imageRoute = new Route(({ request }) => {
  return request.destination === 'image';
}, new CacheFirst({
cacheName: 'images',
   plugins: [ 
     new Expirationplugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
     })
  ]
}));
registerRoute(imageRoute);