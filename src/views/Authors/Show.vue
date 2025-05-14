<template>
  <form @submit.prevent="crearAutor">
    <div>
      <label>Nombre:</label>
      <input v-model="form.nombre" type="text" required />
    </div>
    <div>
      <label>Email:</label>
      <input v-model="form.email" type="email" required />
    </div>
    <div>
      <label>Biografía:</label>
      <textarea v-model="form.biografia"></textarea>
    </div>
    <button type="submit">Crear Autor</button>
    <p v-if="mensaje">{{ mensaje }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../congigApi/Axios.js';

const form = ref({
  nombre: '',
  email: '',
  biografia: ''
});

const mensaje = ref('');

const crearAutor = async () => {
  try {
    console.log(this.api)
    await api.post('/authors/store', { email: "sasnt@sasd.com" });

    /*mensaje.value = res.data.message;
    form.value = { nombre: '', email: '', biografia: '' };*/
  } catch (error) {
    if (error.response) {
      mensaje.value = 'Error: ' + JSON.stringify(error.response.data.errors || error.response.data);
    } else {
      mensaje.value = 'Error al conectar con el servidor';
    }
  }
};
</script>

<style scoped>
.autores-container {
  padding: 20px;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
}

.table-responsive {
  overflow-x: auto;
}

th, td {
  vertical-align: middle;
}

.btn-group {
  white-space: nowrap;
}
</style>