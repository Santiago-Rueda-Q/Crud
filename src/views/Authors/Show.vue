<template>
  <div class="autores-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Autores</h2>
      <div>
        <button @click="fetchAuthors" class="btn btn-primary me-2" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
          <span v-if="isLoading">Cargando</span>
          <span v-else>Actualizar</span>
        </button>
        <router-link to="/authors/create" class="btn btn-success">
          <i class="fas fa-plus"></i> Nuevo Autor
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando</span>
      </div>
      <p class="mt-2">Cargando autores...</p>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Biografía</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="autores.length === 0 && !isLoading">
            <td colspan="4" class="text-center">
              <div class="alert alert-info m-0 border-0">
                No hay autores disponibles
              </div>
            </td>
          </tr>
          <tr v-for="autor in autores" :key="autor.id">
            <td>{{ autor.id }}</td>
            <td>{{ autor.nombre }}</td>
            <td class="biografia-container">{{ autor.biografia }}</td>
            <td>
              <div class="btn-group">
                <router-link :to="{ name: 'AuthorsEdit', params: { id: autor.id } }" class="btn btn-sm btn-warning me-2">
                  <i class="fas fa-edit"></i> Editar
                </router-link>
                <button @click="eliminarAutor(autor.id)" class="btn btn-sm btn-danger">
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
import api from '@/configApi/Axios';

const autores = ref([]);
const isLoading = ref(false);
const error = ref('');

const fetchAuthors = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await api.get('/authors');
    autores.value = response.data || [];
  } catch (err) {
    error.value = 'Error al cargar autores';
  } finally {
    isLoading.value = false;
  }
};

const eliminarAutor = async (id) => {
  if (confirm('¿Estás seguro de eliminar este autor?')) {
    try {
      await api.delete(`/authors/delete/${id}`);
      autores.value = autores.value.filter((a) => a.id !== id);
    } catch (err) {
      error.value = 'Error al eliminar el autor';
    }
  }
};

onMounted(fetchAuthors);
</script>

<style scoped>
.autores-container {
  padding: 20px;
}

.biografia-container {
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
