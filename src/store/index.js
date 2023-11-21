import { createStore } from 'vuex';

export default createStore({
  state: {
    distancias: [], // Agora é uma lista de objetos Distancia
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
