<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0 text-center">
              <i class="fas fa-user-plus me-2"></i>
              Registrarse
            </h4>
          </div>
          <div class="card-body p-4">
            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="fas fa-check-circle me-2"></i>
              {{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = ''"></button>
            </div>

            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">
                  <i class="fas fa-user me-1"></i>
                  Nombre
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  id="name"
                  v-model="form.name"
                  required
                  placeholder="Ingresa tu nombre completo"
                >
                <div v-if="errors.name" class="invalid-feedback">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ errors.name[0] }}
                </div>
              </div>

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
                  required
                  placeholder="ejemplo@correo.com"
                >
                <div v-if="errors.email" class="invalid-feedback">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ errors.email[0] }}
                </div>
              </div>

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
                    required
                    minlength="8"
                    placeholder="Mínimo 8 caracteres"
                  >
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback d-block">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ errors.password[0] }}
                </div>
                <div class="form-text">
                  <i class="fas fa-info-circle me-1"></i>
                  La contraseña debe tener al menos 8 caracteres.
                </div>
              </div>

              <div class="mb-3">
                <label for="password_confirmation" class="form-label">
                  <i class="fas fa-lock me-1"></i>
                  Confirmar Contraseña
                </label>
                <div class="input-group">
                  <input
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password_confirmation }"
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    required
                    placeholder="Confirma tu contraseña"
                  >
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPasswordConfirm = !showPasswordConfirm"
                  >
                    <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password_confirmation" class="invalid-feedback d-block">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  {{ errors.password_confirmation[0] }}
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="btn btn-success w-100 py-2"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-user-plus me-2"></i>
                {{ loading ? 'Registrando...' : 'Registrarse' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <hr class="my-3">
              <p class="mb-0 text-muted">
                ¿Ya tienes cuenta?
                <RouterLink to="/login" class="text-success text-decoration-none fw-bold">
                  <i class="fas fa-sign-in-alt me-1"></i>
                  Inicia sesión aquí
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const errors = ref({})
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  errors.value = {}

  try {
    const result = await authStore.register(form)

    if (result.success) {
      successMessage.value = result.message

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      errorMessage.value = result.message
      errors.value = result.errors || {}
    }
  } catch (error) {
    console.error('Error inesperado:', error)
    errorMessage.value = 'Ocurrió un error inesperado. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  background: #28a745;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-success {
  background: #28a745;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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
