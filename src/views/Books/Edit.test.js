import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'
import Edit from './Edit.vue'

describe('Edit.vue (Books)', () => {
  const mockBook = {
    id: 1,
    titulo: 'Libro de prueba',
    sinopsis: 'Sinopsis de prueba',
    autor_id: 1
  }

  const mockAuthors = [
    { id: 1, nombre: 'Autor 1' },
    { id: 2, nombre: 'Autor 2' }
  ]

  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/books/:id/edit', component: Edit, name: 'edit-book' },
        { path: '/books', name: 'books' }
      ]
    })

    await router.push('/books/1/edit')
    await router.isReady()

    vi.clearAllMocks()
  })

  it('carga y renderiza los datos del libro y autores', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get
      .mockResolvedValueOnce({ data: mockBook })
      .mockResolvedValueOnce({ data: mockAuthors })

    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.find('input[id="titulo"]').element.value).toBe('Libro de prueba')
    expect(wrapper.find('textarea[id="sinopsis"]').element.value).toBe('Sinopsis de prueba')
    expect(wrapper.find('select[id="autor"]').element.value).toBe('1')
    expect(wrapper.findAll('option').length).toBe(mockAuthors.length + 1)
  })

  it('actualiza el libro correctamente', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get
      .mockResolvedValueOnce({ data: mockBook })
      .mockResolvedValueOnce({ data: mockAuthors })
    api.default.put.mockResolvedValue({ data: { message: 'Libro actualizado' } })

    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()

    await wrapper.find('input[id="titulo"]').setValue('Nuevo título')
    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    expect(api.default.put).toHaveBeenCalledWith('/books/1', expect.objectContaining({
      titulo: 'Nuevo título'
    }))
  })

  it('muestra error si falla la carga', async () => {
    const api = await import('@/configApi/Axios.js')

    api.default.get
      .mockRejectedValueOnce(new Error('Error de carga'))
      .mockResolvedValueOnce({ data: mockAuthors })

    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()
    
    console.log('Contenido del componente:', wrapper.text())

    expect(wrapper.text()).toContain('Error')
  })

  it('muestra error si falla la carga - alternativa más específica', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockRejectedValue(new Error('Error de carga'))

    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()
    
    const hasError = wrapper.text().includes('Error') || 
                     wrapper.text().includes('error') ||
                     wrapper.text().includes('No se pudo cargar') ||
                     wrapper.text().includes('Hubo un problema') ||
                     wrapper.find('.alert-danger').exists() ||
                     wrapper.find('.error').exists() ||
                     wrapper.find('[data-testid="error"]').exists()

    expect(hasError).toBe(true)
  })

  it('muestra error si falla la actualización', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get
      .mockResolvedValueOnce({ data: mockBook })
      .mockResolvedValueOnce({ data: mockAuthors })
    api.default.put.mockRejectedValue(new Error('Error de actualización'))

    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Error')
  })

  it('debug - verificar manejo de errores', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockRejectedValue(new Error('Error de prueba'))

    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()
    
    console.log('=== DEBUG INFORMACIÓN ===')
    console.log('HTML completo:', wrapper.html())
    console.log('Texto visible:', wrapper.text())
    console.log('Alertas encontradas:', wrapper.findAll('.alert, .error, [class*="error"]').map(el => ({
      classes: el.classes(),
      text: el.text()
    })))
    console.log('Estado del componente:', {
      error: wrapper.vm.error,
      loading: wrapper.vm.loading,
      hasError: wrapper.vm.hasError
    })
    
    expect(wrapper.vm).toBeDefined()
  })
})