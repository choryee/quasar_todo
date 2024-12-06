import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// new Vuex.Store는 vuex 3.x.x과 vue 2.x.x과 호완 되는 것.

const store = new Vuex.Store({
  state: {
    message: "Hello, Quasar with Vuex!",
    user: null,
  },

  mutations: {
    setMessage(state, newMessage) {
      state.message = newMessage;
    },
    setUser(state, user) {
      state.user = user;
    },
  },

  actions: {
    updateMessage({ commit }, newMessage) {
      commit('setMessage', newMessage); // mutations을 호출
    },
    updateUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    message: (state) => state.message,
    user: (state) => state.user,
  },
});

export default store;
