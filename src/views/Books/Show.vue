<template>
  <div class="libros-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Libros</h2>
      <div>
        <button @click="fetchLibros" class="btn btn-primary me-2" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
          <span v-if="isLoading">Cargando</span>
          <span v-else>Actualizar</span>
        </button>
        <router-link to="/books/create" class="btn btn-success">
          <i class="fas fa-plus"></i> Nuevo Libro
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando</span>
      </div>
      <p class="mt-2">Cargando libros...</p>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Sinopsis</th>
            <th>Autor ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="libros.length === 0 && !isLoading">
            <td colspan="5" class="text-center">
              <div class="alert alert-info m-0 border-0">
                No hay libros disponibles
              </div>
            </td>
          </tr>
          <tr v-for="libro in libros" :key="libro.id">
            <td>{{ libro.id }}</td>
            <td>{{ libro.titulo }}</td>
            <td class="sinopsis-container">{{ libro.sinopsis }}</td>
            <td>{{ libro.autor_id }}</td>
            <td>
              <div class="btn-group">
                <router-link :to="{ name: 'BooksEdit', params: { id: libro.id } }" class="btn btn-sm btn-warning me-2">
                  <i class="fas fa-edit"></i> Editar
                </router-link>
                <button @click="eliminarLibro(libro.id)" class="btn btn-sm btn-danger">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/configApi/Axios.js';

const libros = ref([]);
const isLoading = ref(false);
const error = ref('');

const fetchLibros = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const resp = await api.get('/books');
    libros.value = resp.data || [];
  } catch (err) {
    error.value = 'Error al cargar libros';
  } finally {
    isLoading.value = false;
  }
};

const eliminarLibro = async (id) => {
  if (confirm('¿Estás seguro de eliminar este libro?')) {
    try {
      await api.delete(`/books/delete/${id}`);
      libros.value = libros.value.filter((l) => l.id !== id);
    } catch (err) {
      error.value = 'Error al eliminar el libro';
    }
  }
};

onMounted(() => {
  fetchLibros();
});
</script>

<style scoped>
.libros-container {
  padding: 20px;
}

.sinopsis-container {
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

th, td {
  vertical-align: middle;
}

.btn-group {
  white-space: nowrap;
}
</style>
