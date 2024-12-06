// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

// Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

export default store;
