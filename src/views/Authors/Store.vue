<template>
  <div class="create-author-container">
    <div class="card">
      <div class="card-header bg-success text-white">
        <h2 class="mb-0">Create New Author</h2>
      </div>

      <div class="card-body">
        <form @submit.prevent="createAuthor">
          <!-- Nombre -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="author.name"
              :class="{ 'is-invalid': errors.name }"
            />
            <div class="invalid-feedback" v-if="errors.name">
              {{ errors.name[0] }}
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="author.email"
              :class="{ 'is-invalid': errors.email }"
            />
            <div class="invalid-feedback" v-if="errors.email">
              {{ errors.email[0] }}
            </div>
          </div>

          <!-- Biografía -->
          <div class="mb-3">
            <label for="biography" class="form-label">Biography</label>
            <textarea
              class="form-control"
              id="biography"
              rows="4"
              v-model="author.biography"
              :class="{ 'is-invalid': errors.biography }"
            ></textarea>
            <div class="invalid-feedback" v-if="errors.biography">
              {{ errors.biography[0] }}
            </div>
          </div>

          <!-- Botones -->
          <div class="d-flex justify-content-end mt-4">
            <router-link to="/authors" class="btn btn-secondary me-2">Back</router-link>
            <button type="submit" class="btn btn-success" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ saving ? 'Saving...' : 'Create Author' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje -->
    <div v-if="message" class="alert mt-3" :class="{ 'alert-success': !isError, 'alert-danger': isError }">
      {{ message }}
    </div>
  </div>
</template>

<script>
import api from '../../configApi/Axios';

export default {
  name: 'CreateAuthor',
  data() {
    return {
      author: {
        name: '',
        email: '',
        biography: '',
      },
      errors: {},
      message: '',
      isError: false,
      saving: false,
    };
  },
  methods: {
    async createAuthor() {
      this.saving = true;
      this.message = '';
      this.errors = {};

      try {
        const response = await api.post('/authors', this.author);
        this.message = 'Author created successfully!';
        this.isError = false;

        // Reset fields
        this.author = { name: '', email: '', biography: '' };

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          this.$router.push({ name: 'AuthorsShow' });
        }, 1500);
      } catch (error) {
        console.error('Error creating author:', error);

        if (error.response && error.response.status === 422) {
          // Laravel validation error
          this.errors = error.response.data.errors;
        } else {
          this.message = 'Unexpected error. Try again later.';
        }

        this.isError = true;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.create-author-container {
  max-width: 700px;
  margin: 20px auto;
  padding: 0 15px;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
}

.form-label::after {
  content: " *";
  color: red;
}
</style>
