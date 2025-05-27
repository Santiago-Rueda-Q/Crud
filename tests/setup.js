import { vi } from 'vitest'
import { config } from '@vue/test-utils'


const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  getRoutes: vi.fn(() => []),
  resolve: vi.fn(),
  addRoute: vi.fn(),
  removeRoute: vi.fn(),
  hasRoute: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      params: {},
      query: {},
      name: ''
    }
  }
}

const mockRoute = {
  path: '/',
  params: {},
  query: {},
  name: ''
}


config.global.stubs = {
  RouterLink: {
    template: '<a><slot /></a>',
    props: ['to']
  },
  RouterView: {
    template: '<div><slot /></div>'
  }
}

config.global.mocks = {
  $router: mockRouter,
  $route: mockRoute
}


vi.mock('@/configApi/Axios.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

export { mockRouter, mockRoute }