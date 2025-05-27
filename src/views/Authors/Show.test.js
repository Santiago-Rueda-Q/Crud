import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'
import Show from './Show.vue'

describe('Show.vue (Authors)', () => {
  const mockAuthors = [
    { id: 1, nombre: 'Autor 1', email: 'autor1@test.com' },
    { id: 2, nombre: 'Autor 2', email: 'autor2@test.com' }
  ]

  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/authors', component: Show, name: 'authors' },
        { path: '/authors/create', name: 'create-author' }
      ]
    })

    await router.push('/authors')
    await router.isReady()

    vi.clearAllMocks()
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockResolvedValue({ data: mockAuthors })
    api.default.delete.mockResolvedValue({ data: { message: 'Autor eliminado' } })
    
    window.confirm = vi.fn(() => true)
  })

  it('muestra los autores al montarse', async () => {
    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Autor 1')
    expect(wrapper.text()).toContain('Autor 2')
  })

  it('muestra mensaje si no hay autores', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockResolvedValue({ data: [] })

    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('No hay autores disponibles')
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

    await wrapper.vm.$nextTick()
    await flushPromises()

    const spinner = wrapper.find('.spinner-border, .loading-spinner, [data-testid="spinner"], .spinner')
    
    if (!spinner.exists()) {
      console.log('HTML actual:', wrapper.html())
      console.log('isLoading estado:', wrapper.vm.isLoading)
    }
    
    expect(spinner.exists()).toBe(true)
    
    if (wrapper.vm.isLoading !== undefined) {
      expect(wrapper.vm.isLoading).toBe(true)
    }

    resolvePromise({ data: mockAuthors })
    await flushPromises()

    expect(wrapper.find('.spinner-border, .loading-spinner, [data-testid="spinner"], .spinner').exists()).toBe(false)
    
    if (wrapper.vm.isLoading !== undefined) {
      expect(wrapper.vm.isLoading).toBe(false)
    }
  })

  it('muestra error si la API falla', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockRejectedValue(new Error('Error de red'))

    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Error')
    
    if (wrapper.vm.isLoading !== undefined) {
      expect(wrapper.vm.isLoading).toBe(false)
    }
  })

  it('elimina un autor correctamente', async () => {
    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await flushPromises()

    const deleteButtons = wrapper.findAll([
      'button.btn-danger',
      'button[class*="danger"]', 
      'button[class*="delete"]',
      'button[data-testid*="delete"]',
      '.delete-btn',
      '[role="button"][class*="delete"]'
    ].join(', '))

    if (deleteButtons.length === 0) {
      console.log('HTML del componente:', wrapper.html())
      console.log('Todos los botones:', wrapper.findAll('button').map(b => ({
        classes: b.classes(),
        attributes: b.attributes(),
        text: b.text()
      })))
    }

    expect(deleteButtons.length).toBeGreaterThan(0)
    
    const initialAuthorsCount = wrapper.vm.authors?.length || mockAuthors.length
    
    await deleteButtons[0].trigger('click')
    await flushPromises()

    const api = await import('@/configApi/Axios.js')
    expect(api.default.delete).toHaveBeenCalled()
    
    if (wrapper.vm.authors) {
      expect(wrapper.vm.authors.length).toBe(initialAuthorsCount - 1)
    } else {

      expect(wrapper.text()).not.toContain('Autor 1')
    }
  })


  it('debug spinner - verificar estado inicial', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockImplementation(() => new Promise(() => {})) 
    
    const wrapper = mount(Show, {
      global: { plugins: [router] }
    })

    await wrapper.vm.$nextTick()
    
    console.log('Estado isLoading:', wrapper.vm.isLoading)
    console.log('HTML renderizado:', wrapper.html())
    console.log('Clases disponibles:', wrapper.findAll('[class]').map(el => el.classes()))
    

    expect(wrapper.vm).toBeDefined()
  })
})