<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="b">
    <!-- Barra de navegación -->
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
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/Authors">Autores</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/Books">Libros</RouterLink>
            </li>
          </ul>
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
</style>