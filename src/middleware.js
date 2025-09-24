import { defineMiddleware } from 'astro/middleware';
import { URL } from 'url';

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Comprueba si la ruta contiene mayúsculas
  if (/[A-Z]/.test(pathname)) {
    // Convierte la ruta a minúsculas
    const lowercasePath = pathname.toLowerCase();

    // Redirige a la ruta en minúsculas, manteniendo la query string
    return redirect(`${lowercasePath}${url.search}`, 301);
  }

  // Continúa con la petición si no hay mayúsculas
  return next();
});

// export const redirectBlog = defineMiddleware(async (context, next) => {
//   if (context.url.pathname === '/blog' || context.url.pathname === '/blog/') {
//     return context.redirect('/blog/1', 301); // Redirección 301
//   }
//   return next();
// });