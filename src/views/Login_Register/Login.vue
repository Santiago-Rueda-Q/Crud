<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0 text-center">
              <i class="fas fa-sign-in-alt me-2"></i>
              Iniciar Sesión
            </h4>
          </div>
          <div class="card-body p-4">
            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="fas fa-check-circle me-2"></i>
              {{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = ''"></button>
            </div>

            <div v-if="loginAttempts >= maxAttempts" class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Has superado el número máximo de intentos. Intenta más tarde.
            </div>

            <div>
              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="fas fa-envelope me-1"></i>
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  v-model="form.email"
                  placeholder="ejemplo@correo.com"
                  :disabled="loginAttempts >= maxAttempts"
                  @keyup.enter="handleLogin"
                >
                <div v-if="errors.email" class="invalid-feedback">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ errors.email[0] }}
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fas fa-lock me-1"></i>
                  Contraseña
                </label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="form.password"
                    placeholder="Tu contraseña"
                    :disabled="loginAttempts >= maxAttempts"
                    @keyup.enter="handleLogin"
                  >
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click.prevent="showPassword = !showPassword"
                    :disabled="loginAttempts >= maxAttempts"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback d-block">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ errors.password[0] }}
                </div>
              </div>

              <!-- Contador de intentos -->
              <div v-if="loginAttempts > 0 && loginAttempts < maxAttempts" class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Intentos fallidos: {{ loginAttempts }}/{{ maxAttempts }}
              </div>

              <!-- Mensaje de error general -->
              <div v-if="errorMessage" class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <!-- Botón de acción -->
              <button
                type="button"
                class="btn btn-primary w-100 py-2"
                :disabled="loading || loginAttempts >= maxAttempts"
                @click.prevent="handleLogin"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </div>

            <div class="text-center mt-4">
              <hr class="my-3">
              <p class="mb-0 text-muted">
                ¿No tienes cuenta?
                <RouterLink to="/register" class="text-primary text-decoration-none fw-bold">
                  <i class="fas fa-user-plus me-1"></i>
                  Regístrate aquí
                </RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const errors = ref({})
const showPassword = ref(false)

// Recuperar intentos del localStorage
const loginAttempts = ref(0)
const maxAttempts = 5
const STORAGE_KEY = 'login_attempts'
const STORAGE_TIMESTAMP_KEY = 'login_attempts_timestamp'
const RESET_TIME = 1 * 60 * 1000

const form = reactive({
  email: '',
  password: ''
})

// Función para cargar intentos del localStorage
const loadLoginAttempts = () => {
  try {
    const attempts = localStorage.getItem(STORAGE_KEY)
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY)

    if (attempts && timestamp) {
      const now = Date.now()
      const lastAttempt = parseInt(timestamp)

      if (now - lastAttempt > RESET_TIME) {
        resetLoginAttempts()
      } else {
        loginAttempts.value = parseInt(attempts)
      }
    }
  } catch (error) {
    console.error('Error al cargar intentos:', error)
  }
}

// Función para guardar intentos en localStorage
const saveLoginAttempts = () => {
  try {
    localStorage.setItem(STORAGE_KEY, loginAttempts.value.toString())
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error al guardar intentos:', error)
  }
}

// Función para resetear intentos
const resetLoginAttempts = () => {
  loginAttempts.value = 0
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY)
  } catch (error) {
    console.error('Error al resetear intentos:', error)
  }
}

const handleLogin = async (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // Verificar si se han excedido los intentos
  if (loginAttempts.value >= maxAttempts) {
    errorMessage.value = 'Has superado el número máximo de intentos. Intenta más tarde.'
    return false
  }

  // Verificar que los campos no estén vacíos
  if (!form.email.trim() || !form.password.trim()) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    return false
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  errors.value = {}

  try {
    const result = await authStore.login(form)

    if (result.success) {
      successMessage.value = result.message
      resetLoginAttempts()

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      loginAttempts.value++
      saveLoginAttempts()

      const remainingAttempts = maxAttempts - loginAttempts.value

      if (remainingAttempts > 0) {
        errorMessage.value = `Credenciales incorrectas. Te quedan ${remainingAttempts} intento(s).`
      } else {
        errorMessage.value = 'Has superado el número máximo de intentos. Intenta más tarde.'
      }

      errors.value = result.errors || {}
    }
  } catch (error) {
    console.error('Error inesperado:', error)
    errorMessage.value = 'Ocurrió un error inesperado. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }

  return false
}

// Cargar intentos al montar el componente
onMounted(() => {
  loadLoginAttempts()
})
</script>

<style scoped>
.card {
  border: none;
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  background: #0056b3;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #f8f9fa;
  opacity: 0.6;
}

.btn-primary {
  background: #0056b3;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  border-radius: 8px;
  border: none;
}

.input-group .btn {
  border-radius: 0 8px 8px 0;
}

.shadow-lg {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}
</style>
