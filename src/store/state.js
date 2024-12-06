// export default {
//   lecturerInfo: {}, //
// };
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.

const store = new Vuex.Store({
  state: {
      lecturerInfo: null,
  },
})

export default store;
