<template>
  <div class="autores-container">
    <h2 class="mb-4">Crear Autor</h2>

    <form @submit.prevent="crearAutor" class="mb-4">
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
      
      <button type="submit" class="btn btn-success">
        <i class="fas fa-user"></i> Crear Autor
      </button>

      <button type="menu" class="btn btn-secondary" @click="$router.go(-1)">
        <i class="fas fa-arrow-left"></i> Regresar
      </button>
    </form>
  </div>
  <div v-if="mensaje" class="alert alert-info">
    {{ mensaje }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/configApi/Axios.js';

const form = ref({
  nombre: '',
  email: '',
  biografia: ''
});

const mensaje = ref('');
const crearAutor = async () => {
  try {
    const resp = await api.post('/authors/store', form.value);
    console.table(resp.data);
    mensaje.value = resp.data.message || 'Autor creado exitosamente';
    form.value = { nombre: '', email: '', biografia: '' };
  } catch (error) {
    if (error.response) {
      mensaje.value = 'Error: ' + JSON.stringify(error.response.data.errors || error.response.data);
    } else {
      mensaje.value = 'Error al conectar con el servidor';
    }
  }
};
</script>

<style lang="scss" scoped>
.autores-container {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
</style>