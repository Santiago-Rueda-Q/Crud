<template> 
  <div class="libros-container">
    <h2 class="mb-4">Crear Libro</h2>

    <form @submit.prevent="crearLibro" class="mb-4">
      <div class="mb-3">
        <label for="titulo" class="form-label">Título</label>
        <input v-model="form.titulo" type="text" id="titulo" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="sinopsis" class="form-label">Sinopsis</label>
        <textarea v-model="form.sinopsis" id="sinopsis" class="form-control" rows="3" required></textarea>
      </div>

      <div class="mb-3">
        <label for="autor" class="form-label">Autor</label>
        <select v-model="form.autor_id" id="autor" class="form-select" required>
          <option disabled value="">Seleccione un autor</option>
          <option v-for="autor in autores" :key="autor.id" :value="autor.id">
            {{ autor.nombre }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">
        <i class="fas fa-book"></i> Crear Libro
      </button>

      <button type="button" class="btn btn-secondary" @click="$router.go(-1)">
        <i class="fas fa-arrow-left"></i> Regresar
      </button>
    </form>

    <div v-if="mensaje" class="alert alert-info">
      {{ mensaje }}
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import api from '@/configApi/Axios.js';

const form = ref({
  titulo: '',
  sinopsis: '',
  autor_id: ''
});

const autores = ref([]);
const mensaje = ref('');

const obtenerAutores = async () => {
  try {
    const response = await api.get('/authors');
    autores.value = response.data;
  } catch (error) {
    console.error('Error al cargar autores:', error);
  }
};

const crearLibro = async () => {
  try {
    const resp = await api.post('/books/store', form.value);
    console.table(resp.data);
    mensaje.value = resp.data.message || 'Libro creado exitosamente';
    form.value = { titulo: '', sinopsis: '', autor_id: '' };
  } catch (error) {
    if (error.response) {
      mensaje.value = 'Error: ' + JSON.stringify(error.response.data.errors || error.response.data);
    } else {
      mensaje.value = 'Error al conectar con el servidor';
    }
  }
};

onMounted(() => {
  obtenerAutores();
});

</script>

<style scoped>
.libros-container {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
</style>
