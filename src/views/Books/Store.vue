<template>
  <div class="crear-libro-container">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">Crear Nuevo Libro</h2>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="guardarLibro">
          <div class="mb-3">
            <label for="titulo" class="form-label">Título</label>
            <input
              type="text"
              class="form-control"
              id="titulo"
              v-model="libro.titulo"
              required
              :class="{ 'is-invalid': errores.titulo }"
            >
            <div class="invalid-feedback" v-if="errores.titulo">
              {{ errores.titulo }}
            </div>
          </div>
          
          <div class="mb-3">
            <label for="sinopsis" class="form-label">Sinopsis</label>
            <textarea
              class="form-control"
              id="sinopsis"
              v-model="libro.sinopsis"
              rows="4"
              :class="{ 'is-invalid': errores.sinopsis }"
            ></textarea>
            <div class="invalid-feedback" v-if="errores.sinopsis">
              {{ errores.sinopsis }}
            </div>
          </div>
          

          <div class="mb-3">
            <label for="autor" class="form-label">Autor</label>
            <div v-if="cargandoAutores" class="d-flex align-items-center">
              <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Cargando.</span>
              </div>
              <span>Cargando autores.</span>
            </div>
            <select
              v-else
              class="form-select"
              id="autor"
              v-model="libro.autor_id"
              required
              :class="{ 'is-invalid': errores.autor_id }"
            >
              <option value="" disabled selected>Selecciona un autor</option>
              <option v-for="autor in autores" :key="autor.id" :value="autor.id">
                {{ autor.nombre }} {{ autor.apellido }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="errores.autor_id">
              {{ errores.autor_id }}
            </div>
            <div v-if="autores.length === 0 && !cargandoAutores" class="form-text text-danger">
              No hay autores disponibles debes crear un autor primero.
              <router-link to="/autores/crear">Crear autor</router-link>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button type="button" class="btn btn-secondary me-2" @click="cancelar">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ guardando ? 'Guardando...' : 'Guardar Libro' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div v-if="mensaje" class="alert mt-3" :class="{'alert-success': !esError, 'alert-danger': esError}">
      {{ mensaje }}
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'CrearLibro',
  data() {
    return {
      libro: {
        titulo: '',
        sinopsis: '',
        autor_id: ''
      },
      autores: [],
      cargandoAutores: false,
      guardando: false,
      mensaje: '',
      esError: false,
      errores: {
        titulo: '',
        sinopsis: '',
        autor_id: '',
      }
    }
  },
  mounted() {
    this.cargarAutores()
  },
  methods: {
    async cargarAutores() {
      this.cargandoAutores = true
      try {
        const response = await axios.get('/api/autores')
        this.autores = Array.isArray(response.data) ? response.data.filter(autor => autor && autor.id) : []
      } catch (error) {
        console.error('Error al cargar autores:', error)
        this.mensaje = 'No se pudieron cargar los autores por favor intenta de nuevo.'
        this.esError = true
      } finally {
        this.cargandoAutores = false
      }
    },
    
    validarFormulario() {
      let esValido = true
      this.limpiarErrores()
      
      if (!this.libro.titulo.trim()) {
        this.errores.titulo = 'El titulo es obligatorio'
        esValido = false
      }
      
      if (!this.libro.autor_id) {
        this.errores.autor_id = 'Debes seleccionar un autor'
        esValido = false
      }
      return esValido
    },
    
    limpiarErrores() {
      this.errores = {
        titulo: '',
        sinopsis: '',
        autor_id: ''
      }
    },
    
    async guardarLibro() {
      if (!this.validarFormulario()) {
        return
      }
      
      this.guardando = true
      this.mensaje = ''
      
      try {
        const libroData = Object.entries(this.libro)
          .filter(([_, value]) => value !== null && value !== '')
          .reduce((obj, [key, value]) => {
            obj[key] = value
            return obj
          }, {})
          
        await axios.post('/api/libros', libroData)
        
        this.mensaje = '¡Libro creado exitosamente!'
        this.esError = false
        
        this.libro = {
          titulo: '',
          sinopsis: '',
          autor_id: ''
        }
        
        setTimeout(() => {
          this.$router.push('/libros')
        }, 1500)
        
      } catch (error) {
        console.error('Error al guardar el libro:', error)
        this.mensaje = 'Error al crear el libro por favor intenta de nuevo.'
        this.esError = true
        
        if (error.response && error.response.data && error.response.data.errors) {
          const backendErrors = error.response.data.errors
          Object.keys(backendErrors).forEach(key => {
            if (this.errores.hasOwnProperty(key)) {
              this.errores[key] = backendErrors[key][0]
            }
          })
        }
      } finally {
        this.guardando = false
      }
    },
    
    cancelar() {
      this.$router.go(-1)
    }
  }
}
</script>



<style scoped>
.crear-libro-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
}

.form-label {
  font-weight: 500;
}

.form-label::after {
  content: " *";
  color: red;
}
</style>