<template>
  <div class="libros-container">
    <h2>Editar Libro</h2>

    <form @submit.prevent="editarLibro" v-if="form">
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

      <div class="mb-3">
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> Guardar Cambios
        </button>
        <button @click="$router.go(-1)" class="btn btn-secondary ms-2">
          <i class="fas fa-arrow-left"></i> Cancelar
        </button>
      </div>
    </form>

    <div v-if="mensaje" class="alert alert-info">
      {{ mensaje }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/configApi/Axios.js';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const form = ref({
  titulo: '',
  sinopsis: '',
  autor_id: ''
});

const autores = ref([]);  // <-- Aquí el listado de autores

const mensaje = ref('');

// Carga libro y autores
onMounted(async () => {
  try {
    // Cargar libro
    const responseLibro = await api.get(`/books/${id}`);
    form.value = responseLibro.data;

    // Cargar autores
    const responseAutores = await api.get('/authors');  // Ajusta la ruta si es distinta
    autores.value = responseAutores.data;
  } catch (error) {
    mensaje.value = 'Error al cargar datos';
  }
});

const editarLibro = async () => {
  try {
    await api.put(`/books/${id}`, form.value);
    mensaje.value = 'Libro actualizado correctamente';
    router.push('/books');
  } catch (error) {
    mensaje.value = 'Error al actualizar el libro';
  }
};
</script>


<style scoped>
.libros-container {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
</style>
