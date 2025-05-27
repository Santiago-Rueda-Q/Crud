# 📚 Documentación del Frontend - Gestión de Libros y Autores (Vue 3 + Axios)

Este documento detalla la implementación visual (frontend) del sistema de gestión de libros y autores. Está desarrollado usando Vue 3, Axios y Vue Router. Aquí encontrarás los componentes clave con su estructura, lógica y estilos, como referencia técnica para desarrolladores.

---

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

```vue
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

```js
// src/configApi/Axios.js
import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 🧩 Rutas del Frontend (Vue Router)

Configuración de rutas para navegar entre los componentes:

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import BooksList from '@/views/BooksList.vue';
import BooksCreate from '@/views/BooksCreate.vue';
import BooksEdit from '@/views/BooksEdit.vue';

const routes = [
  { path: '/books', name: 'BooksList', component: BooksList },
  { path: '/books/create', name: 'BooksCreate', component: BooksCreate },
  { path: '/books/edit/:id', name: 'BooksEdit', component: BooksEdit, props: true },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
```

---

## 🧠 Notas Finales

* Este frontend está acoplado a una API RESTful desarrollada en Laravel.
* Asegúrate de tener habilitado CORS en el backend.
* Se recomienda agregar validaciones adicionales tanto en frontend como backend.
* Todos los formularios usan `v-model` para enlace reactivo y `ref` para el estado.

---

