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
    countByLecturerUserId: null,
    getAllJobInterviewTimes : null,
    discountAllInfo: [],
    countEnrollmentByMemberId: null,
    lecturerFeeInfo: [], // basic=200, mid=210.  2개가 배열로 있음.
    studentFeeInfo: [],
    getStudentById: null,
    getNewEnrollments : [],
    loginUserInfo : null,
    getAllStudentByLecturerId:null,
    getAllLecturers:[],
    getAllLessonSchedulesByMemberId: [],



  },
  getters:{
    getDiscountInfo:(state)=>state.discount,
    getAllLessonSchedulesByMemberId: state => state.getAllLessonSchedulesByMemberId || [],

  }
})

export default store;
