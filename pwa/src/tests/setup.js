import '@testing-library/jest-dom'

// Silence "ResizeObserver not defined" in jsdom
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
