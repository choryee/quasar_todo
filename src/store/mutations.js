// mutations.js
export default {
  // Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.

  SET_LOGIN_USER_INFO(state, data){
    state.loginUserInfo = data;
  },

  // <!-- LECTURER  -->
  SET_LECTURER_INFO(state, data) {
    state.lecturerInfo = data || {};
  },
  UPDATE_LECTURER_INFO(state, data){
    state.lecturerInfo = data;
  },
  SET_COUNT_BY_LECTURER_USER_ID(state, data){
    state.countByLecturerUserId = data;
  },
  SET_ALL_STUDENT_FOR_LECTURER(state, data){
    state.getAllStudentByLecturerId = data;
  },
  SET_GET_ALL_LECTURERS(state, data){
    state.getAllLecturers= data;
  },

  GET_ALL_JOB_INTERVIEW_TIMES(state, data){
    state.getAllJobInterviewTimes = data;
  },


  SET_DISCOUNT_INFO(state, discount){
    state.discountAllInfo = discount;
  },
  SET_COUNT_ENROLLMENT_MEMBER_ID(state, data){
    state.countEnrollmentByMemberId = data;
  },
  SET_STUDENT_FEE_INFO(state, data){
    state.studentFeeInfo = data;
  },
  SET_LECTURER_FEE_INFO(state, data){
    state.lecturerFeeInfo = data;
  },

  SET_NEW_ALL_ENROLLMENTS(state, data){
    state.getNewEnrollments = data;
  },



   // <!-- student  -->
  SET_ALL_LessonS_BY_MEMBER_ID(state, data){
    state.getAllLessonSchedulesByMemberId = data;
  },
  SET_STUDENTBY_MEMBER_USER_ID(state, data){
    state.getStudentById= data;
  },


};
