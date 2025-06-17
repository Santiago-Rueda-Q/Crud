# 📚 Documentación del Frontend - Gestión de Libros y Autores (Vue 3 + Axios)

Este documento detalla la implementación visual (frontend) del sistema de gestión de libros y autores. Está desarrollado usando Vue 3, Axios y Vue Router. Aquí encontrarás los componentes clave con su estructura, lógica y estilos, como referencia técnica para desarrolladores.

---

## 🚀 Ejecutar el Proyecto

### 📋 Prerequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** como gestor de paquetes
- **Git** para clonar el repositorio

### 🛠️ Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone [<url-del-repositorio>](https://github.com/Santiago-Rueda-Q/vue_frontend_libros_autores.git)
   cd proyecto-frontend-vue
   ```

2. **Instalar dependencias**
   ```bash
   # Usando npm
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_BACKEND=http://back.test/api
   ```

### ⚡ Comandos de Ejecución

#### Modo Desarrollo
```bash
# Iniciar servidor de desarrollo con hot-reload
npm run dev

# El proyecto estará disponible en: [http://localhost:5173](http://localhost:5173/)
```

#### Modo Producción
```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

#### Otros Comandos Útiles
```bash
# Limpiar caché y node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update
```

---

## 🧪 Ejecutar Tests

El proyecto incluye tests unitarios para los componentes principales usando **Vitest** y **Vue Test Utils**.

### 🔧 Configuración de Testing

Las pruebas están configuradas con:
- **Vitest**: Framework de testing rápido
- **@vue/test-utils**: Utilidades para testing de componentes Vue
- **jsdom**: Entorno DOM para Node.js

### 📝 Comandos de Testing

#### Ejecutar Todos los Tests
```bash
# Ejecutar tests una sola vez
npm run test

# Ejecutar tests en modo watch (se re-ejecutan automáticamente)
npm run test:watch
```

#### Tests con Cobertura
```bash
# Generar reporte de cobertura
npm run test:coverage

# El reporte se genera en: coverage/index.html
```

#### Tests Específicos
```bash
# Ejecutar tests de un archivo específico
npm run test Authors/Edit.test.js

# Ejecutar tests que coincidan con un patrón
npm run test -- --grep "Authors"
```

### 📊 Estructura de Tests

```
📁 tests/
└── 📁 views/
    └── 📁 Authors/
        └── Edit.test.js          # Tests para edición de autores
        └── Show.test.js          # Tests para visualización de autores
        └── Store.test.js         # Tests para creación de autores
    └── 📁 Books/
        └── Edit.test.js          # Tests para edición de libros
        └── Show.test.js          # Tests para visualización de libros
        └── Store.test.js         # Tests para creación de libros
    └── 📁 Login_Register/
        └── Login.test.js         # Tests para login
        └── Register.test.js      # Tests para registro
```

### 🎯 Ejemplo de Test

```
// Authors/Store.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Store from '@/views/Authors/Store.vue'
import api from '@/configApi/Axios.js'

// Mock de Axios
vi.mock('@/configApi/Axios.js')

describe('Authors Store Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Store)
  })

  it('renders form correctly', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[name="nombre"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="biografia"]').exists()).toBe(true)
  })

  it('submits form with valid data', async () => {
    // Mock successful API response
    api.post.mockResolvedValue({ data: { message: 'Autor creado exitosamente' } })

    // Fill form
    await wrapper.find('input[name="nombre"]').setValue('Gabriel García Márquez')
    await wrapper.find('textarea[name="biografia"]').setValue('Escritor colombiano...')

    // Submit form
    await wrapper.find('form').trigger('submit.prevent')

    // Verify API call
    expect(api.post).toHaveBeenCalledWith('/authors', {
      nombre: 'Gabriel García Márquez',
      biografia: 'Escritor colombiano...'
    })
  })

  it('shows error message on failed submission', async () => {
    // Mock API error
    api.post.mockRejectedValue({ response: { data: { message: 'Error al crear autor' } } })

    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-message').text()).toContain('Error al crear autor')
  })
})
```

### 📈 Debugging Tests

```
# Ejecutar tests en modo debug
npm run test:debug

# Ver output detallado
npm run test -- --reporter=verbose
```

---
# 📁 Estructura del Proyecto
```
📁 Estructura del Proyecto
└── 📁src
    └── 📁views
        └── 📁Authors
            └── Edit.test.js          # Tests para edición de autores
            └── Edit.vue              # Formulario de edición de autores
            └── Show.test.js          # Tests para visualización de autores
            └── Show.vue              # Lista/visualización de autores
            └── Store.test.js         # Tests para creación de autores
            └── Store.vue             # Formulario de creación de autores
        └── 📁Books
            └── Edit.test.js          # Tests para edición de libros
            └── Edit.vue              # Formulario de edición de libros
            └── Show.test.js          # Tests para visualización de libros
            └── Show.vue              # Lista/visualización de libros
            └── Store.test.js         # Tests para creación de libros
            └── Store.vue             # Formulario de creación de libros
        └── 📁Login_Register
            └── Login.vue             # Formulario de login
            └── Register.vue          # Formulario de registro
        └── Home.vue                  # Página principal
    └── 📁stores
        └── auth.js                   # Store de autenticación
        └── counter.js                # Store contador (ejemplo)
    └── 📁configApi
        └── Axios.js                  # Configuración de Axios
    └── 📁router
        └── index.js                  # Configuración de rutas
    └── 📁components
        └── 📁common
            └── Navbar.vue            # Barra de navegación
            └── Footer.vue            # Pie de página
            └── LoadingSpinner.vue    # Componente de carga
    └── 📁assets
        └── 📁css
            └── main.css              # Estilos globales
        └── 📁images
```

---

# 🛣️ Configuración de Rutas
El sistema utiliza Vue Router para la navegación entre componentes con lazy loading para optimizar el rendimiento. Las rutas están organizadas por módulos funcionales:

# 🏠 Ruta Principal
```
{ 
  path: '/', 
  name: 'Home', 
  component: () => import('../views/Home.vue') 
}
```

# 👤 Rutas de Autores
```
// Listar todos los autores
{ 
  path: '/authors',
  name: 'AuthorsShow',
  component: () => import('../views/Authors/Show.vue')
},

// Crear nuevo autor
{
  path: '/authors/create',
  name: 'AuthorsStore',
  component: () => import('../views/Authors/Store.vue')
},

// Editar autor existente (requiere ID)
{ 
  path: '/authors/edit/:id',
  name: 'AuthorsEdit',
  component: () => import('../views/Authors/Edit.vue')
}
```

# 📚 Rutas de Libros
```
// Listar todos los libros
{
  path: '/books',
  name: 'BooksShow',
  component: () => import('../views/Books/Show.vue')
},

// Crear nuevo libro
{
  path: '/books/create',
  name: 'BooksStore',
  component: () => import('../views/Books/Store.vue')
},

// Editar libro existente (requiere ID)
{
  path: '/books/edit/:id',
  name: 'BooksEdit',
  component: () => import('@/views/Books/Edit.vue')
}
```

# 🔐 Rutas de Autenticación

```
# Guardar de navegación para rutas protegidas

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = ['AuthorsShow', 'AuthorsStore', 'AuthorsEdit', 'BooksShow', 'BooksStore', 'BooksEdit']
  
  if (requiresAuth.includes(to.name) && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
```

# 🔧 Configuración de Axios

Axios es una librería HTTP cliente basada en promesas que facilita las peticiones al backend.

# ⚙️ Configuración Base (configApi/Axios.js)
```
import axios from 'axios'

// Instancia personalizada de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND, // http://back.test/api
  withCredentials: true, // Permite cookies para CSRF
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Configuración para Laravel Sanctum
api.defaults.xsrfCookieName = 'XSRF-TOKEN'
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'

// Interceptor de peticiones - Añade token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuestas - Maneja errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

## 📄 `BooksList.vue` – Lista de Libros

Muestra todos los libros registrados en una tabla, permite actualizarlos o eliminarlos y acceder al formulario de creación de nuevos libros.

```vue
<template>
  ...
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/configApi/Axios.js';

  const libros = ref([]);
  const isLoading = ref(false);
  const error = ref('');

  const fetchLibros = async () => {
    ...
  };

  const eliminarLibro = async (id) => {
    ...
  };

  onMounted(() => {
    fetchLibros();
  });
</script>

<style scoped>
  ...
</style>
```

---

## 📝 `BooksCreate.vue` – Crear Libro

Formulario para registrar nuevos libros. Carga previamente la lista de autores para asociar uno al libro.

```vue
<template>
  ...
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/configApi/Axios.js';

  const form = ref({ titulo: '', sinopsis: '', autor_id: '' });
  const autores = ref([]);
  const mensaje = ref('');

  const obtenerAutores = async () => {
    ...
  };

  const crearLibro = async () => {
    ...
  };

  onMounted(() => {
    obtenerAutores();
  });
</script>
```

---

## 🛠️ `BooksEdit.vue` – Editar Libro

Formulario para editar los datos de un libro existente. Carga datos iniciales y lista de autores.

```
<template>
  ...
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import api from '@/configApi/Axios.js';

  const route = useRoute();
  const router = useRouter();
  const form = ref(null);
  const autores = ref([]);
  const mensaje = ref('');

  const obtenerLibro = async () => {
    ...
  };

  const obtenerAutores = async () => {
    ...
  };

  const editarLibro = async () => {
    ...
  };

  onMounted(() => {
    obtenerLibro();
    obtenerAutores();
  });
</script>
```

---

## 🔧 Configuración Axios

Archivo de configuración centralizado para realizar peticiones HTTP a la API Laravel:

```
//VITE_API_BACKEND=http://back.test/api

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  withCredentials: true,
});

api.defaults.xsrfCookieName = 'XSRF-TOKEN'
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api;

```

---

## 🧩 Rutas del Frontend (Vue Router)

Configuración de rutas para navegar entre los componentes:

```
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },

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
    {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login_Register/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Login_Register/Register.vue')
  },
  ],
});

export default router;
```

---

## 🧠 Notas Finales

* Este frontend está acoplado a una API RESTful desarrollada en Laravel.
* Asegúrate de tener habilitado CORS en el backend.
* Se recomienda agregar validaciones adicionales tanto en frontend como backend.
* Todos los formularios usan `v-model` para enlace reactivo y `ref` para el estado.

---
