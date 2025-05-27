import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'
import Store from './Store.vue'

describe('Store.vue (Books)', () => {
  const mockAuthors = [
    { id: 1, nombre: 'Autor 1' },
    { id: 2, nombre: 'Autor 2' }
  ]

  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/books/create', component: Store, name: 'create-book' },
        { path: '/books', name: 'books' }
      ]
    })

    await router.push('/books/create')
    await router.isReady()

    vi.clearAllMocks()
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockResolvedValue({ data: mockAuthors })
    api.default.post.mockResolvedValue({ data: { message: 'Libro creado', id: 1 } })
  })

  it('muestra los autores en el select', async () => {
    const wrapper = mount(Store, {
      global: { plugins: [router] }
    })

    await flushPromises()

    const options = wrapper.findAll('select[id="autor"] option')
    expect(options.length).toBe(mockAuthors.length + 1) // +1 for default option
    expect(options[1].text()).toBe('Autor 1')
    expect(options[2].text()).toBe('Autor 2')
  })

  it('envía el formulario correctamente', async () => {
    const wrapper = mount(Store, {
      global: { plugins: [router] }
    })

    await flushPromises()

    await wrapper.find('input[id="titulo"]').setValue('Nuevo libro')
    await wrapper.find('textarea[id="sinopsis"]').setValue('Sinopsis')
    await wrapper.find('select[id="autor"]').setValue('1')
    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    const api = await import('@/configApi/Axios.js')
    expect(api.default.post).toHaveBeenCalledWith('/books/store', {
      titulo: 'Nuevo libro',
      sinopsis: 'Sinopsis',
      autor_id: 1
    })
  })

  it('muestra error si falla el servidor', async () => {
    const api = await import('@/configApi/Axios.js')
    api.default.post.mockRejectedValue({
      response: {
        data: { errors: { titulo: ['El título es requerido'] } }
      }
    })

    const wrapper = mount(Store, {
      global: { plugins: [router] }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('El título es requerido')
  })
})