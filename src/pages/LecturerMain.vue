<template>
  <div>
    <q-btn dense color="primary" size="lg" @click="getAllLessons">
      See My Schedule
    </q-btn>
    <!-- 조건부 렌더링 -->
    <div v-if="currentView === 'lecturerInfo'">
      <!-- individual lecturer info -->
<!--      <h4>My page</h4>-->
      <br />
      <div>
        <!-- 강사 정보를 보여주는 섹션 -->
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-img
              class="col-5"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />

            <q-card-section>
              {{ lorem }}
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <br />
      <div >
        <!-- 신규 -->
        <NewStudentForLecturer />
      </div>
      <br />
      <div >
        <!-- All my students list -->
        <AllStudentForLecturer :lesson="lessonsData"/>
      </div>
      <br />
      <div class="q-pa-md">
        <q-btn dense color="primary" size="lg" @click="goCalendar">
          See My Schedule Calendar
        </q-btn>
      </div>
    </div>

    <div v-else-if="currentView === 'calendar'">
      <!-- Calendar 화면 -->
      <LecturerCalendar />
      <q-btn dense color="primary" size="lg" class="q-mt-md" @click="goBack">
        Back to Info
      </q-btn>
    </div>
  </div>
</template>

<script>
import NewStudentForLecturer from "pages/NewStudentForLecturer.vue";
import AllStudentForLecturer from "pages/AllStudentForLecturer.vue";
import LecturerCalendar from "pages/LecturerCalendar.vue";
import axios from "axios";

export default {
  components: { AllStudentForLecturer, NewStudentForLecturer, LecturerCalendar },
  data() {
    return {
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      currentView: "lecturerInfo", // lecturerInfo란 이름으로 "현재 표시 중인 화면"명명함.
      lessonsData:[]
    };
  },
  methods: {
    goCalendar() {
      this.currentView = "calendar"; // 캘린더 화면으로 전환
    },
    getAllLessons(){
      axios.get('http://localhost:8080/getAllLessons')
        .then(({data})=>{
          console.log(' res>>>', data);
          this.lessonsData = data;
        })
    },
    goBack() {
      this.currentView = "lecturerInfo"; // 이전 화면으로 복귀
    },
  },
};
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
