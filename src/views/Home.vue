<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="jumbotron bg-primary text-white p-5 rounded">
          <h1 class="display-4">Bienvenido al CRUD con relación</h1>
          <p class="lead">
            Sistema de gestión de autores y libros con relaciones entre entidades.
          </p>
          <hr class="my-4 border-white">
          <p>
            Puedes gestionar autores y sus libros asociados de manera fácil e intuitiva.
          </p>
          <div v-if="authStore.isLoggedIn" class="mt-4">
            <router-link class="btn btn-light btn-lg me-3" to="/authors" role="button">
              Ver Autores
            </router-link>
            <router-link class="btn btn-outline-light btn-lg" to="/books" role="button">
              Ver Libros
            </router-link>
          </div>
          <div v-else class="mt-4">
            <router-link class="btn btn-light btn-lg me-3" to="/login" role="button">
              Iniciar Sesión
            </router-link>
            <router-link class="btn btn-outline-light btn-lg" to="/register" role="button">
              Registrarse
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.jumbotron {
  background: #0056b3;
}

.card {
  transition: all 0.3s ease;
  border: none;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>
