import { createStore } from 'vuex';

export default createStore({
  state: {
    distancias: [],
  },
  getters: {
  },
  mutations: {
    adicionarDistancia(state, distancia) {
      state.distancias.push(distancia);
    },
  },
  actions: {
  },
  modules: {
  }
});
