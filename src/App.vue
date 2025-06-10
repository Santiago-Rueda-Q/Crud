<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})

const logout = async () => {
  await authStore.logout()
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-light border-bottom mb-4">
      <div class="container-fluid">
        <RouterLink class="navbar-brand d-flex align-items-center" to="/">
          <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
          <span class="ms-2">CRUD con relación</span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-if="authStore.isLoggedIn">
              <RouterLink class="nav-link" to="/Authors">Autores</RouterLink>
            </li>
            <li class="nav-item" v-if="authStore.isLoggedIn">
              <RouterLink class="nav-link" to="/Books">Libros</RouterLink>
            </li>
          </ul>

          <!-- Botones de autenticación dentro del collapse -->
          <div class="d-flex align-items-center">
            <template v-if="authStore.isLoggedIn">
              <span class="me-3">Bienvenido, {{ authStore.user.name }}</span>
              <button @click="logout" class="btn btn-outline-danger btn-sm">Salir</button>
            </template>
            <template v-else>
              <RouterLink to="/Login" class="btn btn-outline-primary btn-sm me-2">Login</RouterLink>
              <RouterLink to="/Register" class="btn btn-primary btn-sm">Registro</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.logo {
  display: inline-block;
}

.navbar-brand {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #1f2c6c;
}

@media (max-width: 991px) {
  .navbar-collapse .d-flex {
    margin-top: 1rem;
    justify-content: center;
  }
}

nav.navbar:nth-of-type(2) {
  display: none !important;
}
</style>
