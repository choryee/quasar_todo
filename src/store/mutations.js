// mutations.js
export default {
  // Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.

  SET_LECTURER_INFO(state, lecturerInfo) {
    state.lecturerInfo = lecturerInfo;
  },
  UPDATE_LECTURER_INFO(state, data){
    state.lecturerInfo = data;
  }
};
