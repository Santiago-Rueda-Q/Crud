<template>
  <div class="libros-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Libros</h2>
      <div>
        <button @click="obtenerLibros" class="btn btn-primary me-2" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{'fa-spin': isLoading}"></i>
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Actualizar</span>
        </button>
        <router-link to="/libros/crear" class="btn btn-success">
          <i class="fas fa-plus"></i> Nuevo Libro
        </router-link>
      </div>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
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
            <th>Autor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="libros.length === 0 && !isLoading">
            <td colspan="5" class="text-center">
              <div class="alert alert-info m-0 border-0">
                No hay libros disponibles. Crea un nuevo libro para comenzar.
              </div>
            </td>
          </tr>
          <tr v-for="libro in libros" :key="libro.id" v-else>
            <td>{{ libro.id }}</td>
            <td>{{ libro.titulo }}</td>
            <td>
              <div class="sinopsis-container">
                {{ truncarTexto(libro.sinopsis, 100) }}
              </div>
            </td>
            <td>{{ obtenerNombreAutor(libro.autor_id) }}</td>
            <td>
              <div class="btn-group">
                <button @click="editarLibro(libro.id)" class="btn btn-sm btn-warning me-2">
                  <i class="fas fa-edit"></i> Editar
                </button>
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

<script> //error lo tengo aqui
import axios from 'axios'

export default {
  name: 'MostrarLibros',
  data() {
    return {
      libros: [], 
      autores: [],
      isLoading: false,
      error: null
    }
  },
  mounted() {
    this.obtenerLibros()
    this.obtenerAutores()
  },
  methods: {
    async obtenerLibros() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/libros')
        this.libros = Array.isArray(response.data) ? response.data.filter(libro => libro && libro.id) : []
        console.log(`Cargados ${this.libros.length} libros de la base de datos`)
      } catch (error) {
        console.error('Error al obtener los libros:', error)
        this.error = 'No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.'
      } finally {
        this.isLoading = false
      }
    },

    async obtenerAutores() {
      try {
        const response = await axios.get('/api/Autores')
        this.autores = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error('Error al obtener los autores:', error)
      }
    },

    obtenerNombreAutor(autorId) {
      const autor = this.autores.find(a => a.id === autorId)
      return autor ? `${autor.nombre} ${autor.apellido}` : `ID: ${autorId}`
    },

    truncarTexto(texto, longitud) {
      if (!texto) return 'Sin sinopsis'
      return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto
    },

    editarLibro(id) {
      this.$router.push(`/libros/editar/${id}`)
    },

    async eliminarLibro(id) {
      if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        return
      }

      try {
        await axios.delete(`/api/libros/${id}`)
        this.obtenerLibros()
        alert('Libro eliminado correctamente')
      } catch (error) {
        console.error('Error al eliminar el libro:', error)
        alert('No se pudo eliminar el libro')
      }
    }
  }
}
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