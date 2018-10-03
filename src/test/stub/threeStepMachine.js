const machine = {
  state: 'init',
  data: {},
  transitions: {
    ready: ['init'],
    init: ['loading'],
    loading: ['ready'],
  },
  handlers: {
    ready: (state, prev, next) => {},
    init: (state, prev, next) => {},
    loading: (state, prev, next) => {},
  }
}
