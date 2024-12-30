// store/actions.js
import axios from "axios";
// 이것 없이도, quasar.conf.js에  VUE_APP_API_URL: ctx.dev ? 'http://localhost:8080' : 'https://your-production-domain.com'
// 되는 듯.
import API from '../services/api';


export default {
  // Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.
// this.$store.dispatch("setLecturerInfo", this.formData);
// this.$store.dispatch("fetchLecturerInfo", lecturer_id);
  // 아래는 그냥, getLecturerInfo호출해서 해당 결과 객체 가져오는 것임.
  // LecturerMain.vue 맨위 강사 개별 정보
  async fetchLecturerInfo({ commit }, lecturerId) {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/lecturer/getLecturerInfo/${lecturerId}`
      ); // axios

      //const response = await API.get(`/getLecturerInfo/${lecturerId}`);

      // store의 mutation 부분 호출
      // null 나오면, getInfoByLecturerId가 있는 mapper를 보라.
      console.log('store fetchLecturerInfo lectuerMain 상단 강사 info >>>', data);
      commit("SET_LECTURER_INFO", data);
      // TODO 밑처럼 localStorage에 저장 방식을 피해야.
      localStorage.setItem('loginLecturerInfo', JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch lecturer info:", error);
    }
  },

  async updateLecturerInfo({commit}, formData){
    try {
      const {data} = await axios.post('http://localhost:8080/lecturer/updateLecturer', formData);
      commit("UPDATE_LECTURER_INFO", data);
    }catch (err){
      console.log(' >>>', err);
    }
  },

  setLecturerInfo({ commit }, lecturerInfo) {
    commit("SET_LECTURER_INFO", lecturerInfo);
  },

  async sendStatusRequestEmail(param) {
    try {
      const lecturerInfo = param.state.lecturerInfo;
      const response = await axios.post("http://localhost:8080/api/send-email", {
        to: 'choryee@naver.com',
        subject: `Request for Teaching Status Change from Id : ${lecturerInfo.lecturer_user_id} and Name : ${lecturerInfo.name}`,
        body: `
            Dear The Great Jon,
            A request has been made by Id : ${lecturerInfo.lecturer_user_id} of name : ${lecturerInfo.name} to change the status to "teaching".
            Please review and approve the request at your earliest convenience.

            Best regards,
            Your System
          `,
      });
      if (response.status === 200) {
        console.log(' send success.. >>>', );
       // this.$q.notify({ type: "positive", message: "Email sent successfully!" });
        // commit("UPDATE_LECTURER_INFO", data);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
     // this.$q.notify({ type: "negative", message: "Failed to send email." });
    }
  },

  // interview_date_time 갯수. 이미 인터뷰 잡혔는지 확인.
  async countByLecturerUserId({commit}, param){
    const queryString = new URLSearchParams(param).toString(); // 쿼리 문자열 생성
    console.log('queryString >>>', queryString);
    const response = await axios.get(`http://localhost:8080/countByLecturerUserId?${queryString}`);
    if (response && response.data !== undefined) {
      commit('SET_COUNT_BY_LECTURER_USER_ID', response.data);
      return response.data; // 명확히 데이터를 반환
    } else {
      console.error('Response data is undefined or null.');
      return null; // 데이터가 없으면 null 반환
    }
  },

  getAllJobInterviewTimes({ commit }){

    return axios.get('http://localhost:8080/getAllInterviewTime')
      .then(({data})=>{
        const events = data.map(event =>({
          title: event.lecturer_name && event.lecturer_user_id
            ? `${event.lecturer_name}(${event.lecturer_user_id})`
            : 'available',
          start: event.interview_date_time,
          extendedProps:{
            lecturer_user_id : event.lecturer_user_id,
            lecturer_name : event.lecturer_name,
            start_time : event.interview_date_time,
            job_interview_id:event.job_interview_id
          }
        }));
        console.log('GET_ALL_JOB_INTERVIEW_TIMES data >>>', data);
        commit('GET_ALL_JOB_INTERVIEW_TIMES', data);
        return events;
      })
      .catch(err=>console.log('err >>>', err))
  },

  // disount테이블의 discount_value가져오기.
  async fetchAllDiscountInfo({ commit }) {
    try {
      const response = await axios.get("http://localhost:8080/getAllDiscount");
      console.log('actions fetchAllDiscountInfo >>>', response); // 모두 가져옴.
      commit("SET_DISCOUNT_INFO", response.data); // discount 정보를 상태에 저장
    } catch (error) {
      console.error("Failed to fetch discount info:", error);
    }
  },

  async fetchEnrollmentCountByMemberId({commit}, member_id){
    try {
      const response = await axios.get(`http://localhost:8080/countByMemberId/${member_id}`)
      commit("SET_COUNT_ENROLLMENT_MEMBER_ID", response.data); // discount 정보를 상태에 저장
    } catch (error) {
      console.error("Failed to fetch count :", error);
    }
  },

  async fetchFeeInfo({ commit }) {
    try {
      const response = await axios.get("http://localhost:8080/getFeeInfo");
      console.log('fetchFeeInfo data >>>', response );
      // lesson테이블의 target에 따라, rate를 구분해서, state에 저장한다.
      const lecturer = response.data.filter(item=>item.target === 'lecturer');
      commit("SET_LECTURER_FEE_INFO", lecturer);
      const student = response.data.filter(item=>item.target === 'student');
      console.log('fetchFeeInfo student>>>', student);
      commit("SET_STUDENT_FEE_INFO", student);
    } catch (error) {
      console.error("Failed to fetch discount info:", error);
    }
  },

  //StudentMainCalendar.vue에서
  async fetchStudentById({commit}, user_id){
    try{
      const response = await API.get(`/getStudentById/${user_id}`)
      console.log('fetchStudentByID >>>', response);
      commit('SET_STUDENTBY_MEMBER_USER_ID', response.data);
    }catch (err) {

    }
  },

  //StudentMainCalendar.vue에서
  async fetchAllLessonSchedulesByMemberId({commit}, member_id){
    try{
      const response = await API.get(`/getAllLessonSchedulesByMemberId/${member_id}`)
      console.log('fetchAllLessonSchedulesByMemberId >>>', response.data);
      commit('SET_ALL_LessonS_BY_MEMBER_ID', response.data);
    }catch (err) {

    }
  },

  async getNewEnrollments({commit}){
    try {
      const response = await API.get('/getNewEnrollments');
      console.log('getNewEnrollments actions >>>', response.data);
      commit('SET_NEW_ALL_ENROLLMENTS', response.data);
    }catch (err){

    }
  },

  // 로그인
  // 로그인
  async loginMember({commit}, param){
    try {
      const response = await API.post('/login', param);
      console.log('/login response >>>', response);
      if(response.status === 200){
        //let jwtToken = response.headers.get('Authorization');
        let jwtToken = response.headers['authorization'];
        // TODO localStorage.setItem 수정해야.
        localStorage.setItem('loginUserInfo', JSON.stringify(response.data));
        localStorage.setItem('Authorization', jwtToken);
        commit('SET_LOGIN_USER_INFO', response.data);
      }
      return response;
    }catch (err){
      console.error('loginMember error >>>', err); // 에러 로그 추가
      throw err; // 에러를 호출한 쪽으로 전달
    }
  },

  async getAllStudentByLecturerId({commit}){
    const getLocalStorageData = localStorage.getItem('loginLecturerInfo');
    const lecturer_id = JSON.parse(getLocalStorageData).lecturer_id;
    try {
      await axios.get('http://localhost:8080/getAllStudentByLecturerId', {
        params :{
          lecturer_id : lecturer_id
        }
      })
        .then(({data})=>{
          console.log('AllStudent.. getAllStudentByLecturerId >>>', data);
          commit('SET_ALL_STUDENT_FOR_LECTURER', data)
        })
    }catch (err){

    }

  },

  async getAllLecturers({commit}){
    try {
      await axios.get('http://localhost:8080/getAllLecturers')
        .then(({data})=>{
          console.log('actions getAllLecturers..>>', data);
          commit('SET_GET_ALL_LECTURERS', data)
        })
    }catch (err){

    }

  },




}// export default
