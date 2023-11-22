import { createStore } from 'vuex';

export default createStore({
  state: {
    distancias: [],
    token: null,
    usuario: null
  },
  getters: {
  },
  mutations: {
    adicionarDistancia(state, distancia) {
      state.distancias.push(distancia);
    },
    setToken(state, data){
      state.token = data;
    },
    setUsuario(state, data){
      state.usuario = data;
    },
    logoutUser(state){
      state.token = null;
      state.distancias = [];
      state.usuario = null;
    }
  },
  actions: {
  },
  modules: {
  }
});
