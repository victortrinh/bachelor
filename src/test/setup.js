import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver; provide a no-op mock
// so any component that uses useFadeIn / SectionWrapper renders without crashing.
global.IntersectionObserver = class IntersectionObserver {
  constructor(cb) { this._cb = cb; }
  observe()    {}
  unobserve()  {}
  disconnect() {}
};
