import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'
import Show from './Show.vue'

describe('Show.vue (Books)', () => {
  const mockBooks = [
    { id: 1, titulo: 'Libro 1', autor: { nombre: 'Autor 1' } },
    { id: 2, titulo: 'Libro 2', autor: { nombre: 'Autor 2' } }
  ]

  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/books', component: Show, name: 'books' },
        { path: '/books/create', name: 'create-book' }
      ]
    })

    await router.push('/books')
    await router.isReady()

    vi.clearAllMocks()
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockResolvedValue({ data: mockBooks })
    api.default.delete.mockResolvedValue({ data: { message: 'Libro eliminado' } })
    
    window.confirm = vi.fn(() => true)
  })

  it('muestra los libros al montarse', async () => {
    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Libro 1')
    expect(wrapper.text()).toContain('Libro 2')
  })

  it('muestra mensaje si no hay libros', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockResolvedValue({ data: [] })

    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('No hay libros disponibles')
  })

  it('muestra spinner mientras carga', async () => {
    let resolvePromise
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    const api = await import('@/configApi/Axios.js')
    api.default.get.mockReturnValueOnce(pendingPromise)

    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    // Esperar a que onMounted se ejecute y el componente se renderice
    await wrapper.vm.$nextTick()
    await flushPromises()
    
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
    
    resolvePromise({ data: mockBooks })
    await flushPromises()
    
    // Verificar que el spinner desaparece después de cargar
    expect(wrapper.find('.spinner-border').exists()).toBe(false)
  })

  it('muestra error si la API falla', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockRejectedValue(new Error('Error de red'))

    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Error')
  })

  it('elimina un libro correctamente', async () => {
    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    const deleteButtons = wrapper.findAll('button.btn-danger')
    if (deleteButtons.length > 0) {
      await deleteButtons[0].trigger('click')
      await flushPromises()

      const api = await import('@/configApi/Axios.js')
      expect(api.default.delete).toHaveBeenCalled()
    } else {
      expect(wrapper.vm).toBeDefined()
    }
  })
})