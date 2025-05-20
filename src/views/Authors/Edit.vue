<template>
  <div class="autores-container">
    <h2 class="mb-4">Editar Autor</h2>

    <form @submit.prevent="actualizarAutor" class="mb-4">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre</label>
        <input v-model="form.nombre" type="text" id="nombre" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="form.email" type="text" id="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="biografia" class="form-label">Biografía</label>
        <textarea v-model="form.biografia" id="biografia" class="form-control" rows="3" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        <i class="fas fa-save"></i> Actualizar Autor
      </button>

      <button type="menu" class="btn btn-secondary" @click="$router.go(-1)">
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
import { useRoute } from 'vue-router';
import api from '@/configApi/Axios.js';

const route = useRoute();
const id = route.params.id;

const form = ref({
  nombre: '',
  email: '',
  biografia: ''
});

const mensaje = ref('');

const cargarAutor = async () => {
  try {
    const resp = await api.get(`/authors/${id}`);
    form.value = {
      nombre: resp.data.nombre,
      email: resp.data.email,
      biografia: resp.data.biografia
    };
  } catch (error) {
    mensaje.value = 'Error al cargar autor';
  }
};

const actualizarAutor = async () => {
  try {
    const resp = await api.put(`/authors/update/${id}`, form.value);
    mensaje.value = resp.data.message || 'Autor actualizado correctamente';
  } catch (error) {
    if (error.response) {
      mensaje.value = 'Error: ' + JSON.stringify(error.response.data.errors || error.response.data);
    } else {
      mensaje.value = 'Error al conectar con el servidor';
    }
  }
};

onMounted(cargarAutor);
</script>

<style scoped>
.autores-container {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
</style>

