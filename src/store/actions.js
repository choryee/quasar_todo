// store/actions.js
import axios from "axios";

export default {
  // Vuex actions 호출 -> (mutations를 거쳐) --> state 변경함.
// this.$store.dispatch("setLecturerInfo", this.formData);
// this.$store.dispatch("fetchLecturerInfo", lecturer_id);
  // 아래는 그냥, getLecturerInfo호출해서 해당 결과 객체 가져오는 것임.
  async fetchLecturerInfo({ commit }, lecturerId) {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/lecturer/getLecturerInfo/${lecturerId}`
      ); // axios

      // store의 mutation 부분 호출
      console.log('store fetchLecturerInfo >>>', data);
      commit("SET_LECTURER_INFO", data);

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
};
