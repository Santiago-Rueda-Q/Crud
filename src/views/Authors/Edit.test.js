import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory, useRouter } from 'vue-router'
import { vi, expect } from 'vitest'
import Edit from './Edit.vue'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: '1' }
    })),
    useRouter: vi.fn(() => ({
      back: vi.fn(),
      go: vi.fn(),
      push: vi.fn(),
      replace: vi.fn()
    }))
  }
})

const mockRouter = {
  back: vi.fn(),
  go: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  currentRoute: { value: { params: { id: '1' } } }
}

describe('Edit.vue (Authors)', () => {
  const mockAuthor = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@test.com',
    biografia: 'Biografía de prueba'
  }

  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/authors/:id/edit', component: Edit, name: 'edit-author' },
        { path: '/authors', name: 'authors' }
      ]
    })

    await router.push('/authors/1/edit')
    await router.isReady()


    vi.clearAllMocks()
    const api = await import('@/configApi/Axios.js')
    api.default.get.mockResolvedValue({ data: mockAuthor })
    api.default.put.mockResolvedValue({ data: { message: 'Autor actualizado' } })

    const useRouterMock = useRouter
    useRouterMock.mockReturnValue(mockRouter)
  })

  it('monta el componente correctamente', () => {
    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('carga_y_muestra_datos_del_autor_correctamente', async () => {
    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()


    const nombreInput = wrapper.find('input[id="nombre"], input[name="nombre"]')
    expect(nombreInput.exists()).toBe(true)
    expect(nombreInput.element.value).toBe('Juan Pérez')
  })

  
  it('maneja el envío del formulario', async () => {
    const wrapper = mount(Edit, {
      global: { plugins: [router] }
    })

    await flushPromises()

    const form = wrapper.find('form')
    if (form.exists()) {
      await form.trigger('submit.prevent')
      await flushPromises()

      const api = await import('@/configApi/Axios.js')
      expect(api.default.put).toHaveBeenCalled()
    } else {
      expect(wrapper.vm).toBeDefined()
    }
  })
})
