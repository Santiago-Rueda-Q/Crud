import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: () => import('../App.vue') },

    // Rutas de Autores
    { path: '/authors',
      name: 'AuthorsShow',
      component: () => import('../views/Authors/Show.vue') 
    },
    { path: '/authors/edit/:id',
      name: 'AuthorsEdit',
      component: () => import('../views/Authors/Edit.vue')
    },
    { 
      path: '/authors/create',
      name: 'AuthorsStore',
      component: () => import('../views/Authors/Store.vue')
    },

    // Rutas de Libros
    { 
      path: '/books',
      name: 'BooksShow',
      component: () => import('../views/Books/Show.vue') 
    },
    {
      path: '/books/edit/:id',
      name: 'BooksEdit',
      component: () => import('@/views/Books/Edit.vue')
    },
    { 
      path: '/books/create',
      name: 'BooksStore',
      component: () => import('../views/Books/Store.vue') 
    },
  ],
});

export default router;
