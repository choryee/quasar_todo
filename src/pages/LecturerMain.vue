<template>
  <div>

    <!-- 조건부 렌더링 -->
    <div v-if="currentView === 'lecturerInfo'">
      <!-- individual lecturer info -->
<!--      <h4>My page</h4>-->
      <br />
      <div>

        <!-- lecturer 정보를 보여주는 섹션 -->
        <q-card bordered>
          <q-card-section>
            <!-- mugshot -->
            <q-avatar v-if="rows && rows.length > 0 && rows[0] && rows[0].mugshotUrl" size="100px">
              <img :src="rows[0].mugshotUrl || 'https://via.placeholder.com/80'" alt="Instructor Mugshot" />
            </q-avatar>
            <span v-if="rows && rows.length > 0 && rows[0] && rows[0].name" class="text-h5 text-right" style="margin-left: 10px;">
              {{ rows[0].name || name }}
            </span>
            <span v-else class="text-muted">Name not available</span>
           <div class="text-h5 text-left"> </div>


            <br/>
            <q-table
              v-if="rows && rows.length > 0"
            :data="rows"
            :columns="columns"
            row-key="name"
            flat
            bordered
            :hide-bottom="rows.length > 0"
            >
              <template v-slot:body-cell-status="props">
                <q-td>
                  <span style="color: blue;">{{ props.row.status }}</span>
                </q-td>
              </template>
              <template v-slot:body-cell-career_description="props">
                <q-td style="white-space: normal; word-wrap: break-word;">
                  {{ props.row.career_description }}
                </q-td>
              </template>
            </q-table>
            <!-- 데이터가 없을 때 표시할 내용 -->
            <div v-else>
              <p>No data available</p>  <!-- 데이터를 불러오지 못한 경우 -->
            </div>
            <br/>
            <q-btn label="Edit My Info" color="primary" @click="editLecturer" />
            <q-btn label="Ask status changing" color="warning" @click="showDialog = true" />
          </q-card-section>
        </q-card>

          <!-- Q-Dialog -->
          <q-dialog v-model="showDialog" persistent>
            <q-card>
              <q-card-section>
                <div class="text-h6">Change Status</div>
              </q-card-section>
              <q-card-section>
                <p>Current Status: {{ status }}</p>
                <q-select
                  v-model="selectedStatus"
                  :options="filteredStatusOptions"
                  label="Select New Status"
                  filled
                  emit-value
                  map-options
                  @input="onStatusChange"
                />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="negative" @click="showDialog = false" />
                <q-btn flat label="Confirm" color="primary" @click="confirmStatusChange" />
              </q-card-actions>
            </q-card>
          </q-dialog>
      </div>

      <br />
      <div>
        <q-card  bordered>
        <q-card-section>
        <!-- 탭 섹션 -->
        <q-tabs
          v-model="currentTab"
          class="text-primary"
          align="justify"
          dense
          active-color="blue"
          indicator-color="green"
        >
          <q-tab name="notice" label="Notice" icon="today" />
          <q-tab name="qna" label="QnA" icon="date_range" />
        </q-tabs>

        <!-- 탭 내용 -->
        <q-tab-panels v-model="currentTab" animated>
          <q-tab-panel name="notice" class="tab-panel">
            <Notice/>
          </q-tab-panel>
          <q-tab-panel name="qna" class="tab-panel">
            <QuestionAndAnswer/>
          </q-tab-panel>
        </q-tab-panels>
        </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md">
        <q-btn dense color="primary" size="lg" style="max-width: 1200px; width: 100%;" @click="goCalendar" >
          go to my class Calendar
        </q-btn>
      </div>
      <div >
        <!-- Newly enrolled students -->
        <q-card bordered>
          <q-card-section>
            <NewStudentForLecturer />
          </q-card-section>
        </q-card>
      </div>
      <br />
      <div >
        <!-- All my students list -->
        <q-card  bordered>
          <q-card-section>
            <AllStudentForLecturer />
          </q-card-section>
        </q-card>
      </div>
      <br />
      <div class="q-pa-md">
        <q-btn dense color="primary" size="lg" style="max-width: 1200px; width: 100%;" @click="goCalendar" >
          go to my class Calendar
        </q-btn>
      </div>
    </div>
    <!-- currentView === 'lecturerInfo' end -->

      <!-- Lecturer Calendar 화면 갔을때. -->
    <div v-else-if="currentView === 'calendar'">
      <LecturerCalendar />
      <q-btn dense color="primary" size="lg" class="q-mt-md" style="max-width: 1200px; width: 100%;" @click="goBack">
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
import MonthlyFeedback from "pages/MonthlyFeedback.vue";
import DailyFeedback from "pages/DailyFeedback.vue";
import QuestionAndAnswer from "pages/QuestionAndAnswer.vue";
import Notice from "pages/Notice.vue";

export default {
  components: {DailyFeedback, MonthlyFeedback, AllStudentForLecturer,
    NewStudentForLecturer, LecturerCalendar, QuestionAndAnswer, Notice },
  data() {
    return {
      currentTab: 'daily', // 기본 탭 설정
      currentView: "lecturerInfo", // lecturerInfo란 이름으로 "현재 표시 중인 화면"명명함.
      lessonsData:[],
      showDialog: false, // Dialog 상태 관리
      name:'',
      status: "", // 현재 상태
      test: null,
      selectedStatus: null, // 선택된 새로운 상태
      statusOptions: [
        { label: "Teaching_Pending", value: "teaching_pending" },
        { label: "Waiting", value: "waiting" },
        { label: "Break", value: "break" },
        { label: "JobInterviewing", value: "jobInterviewing" },
        { label: "Others", value: "others" },
      ],
      adminEmail: "admin@example.com", // 관리자의 이메일 주소
      rows: [],
      columns:
      [
        { name: 'user_id', label: 'user_id', align: 'left', field: 'user_id' },
        { name: 'status', label: 'status', align: 'center', field: 'status' },
        { name: 'age', label: 'Age', align: 'center', field: 'age' },
        { name: 'gender', label: 'Gender', align: 'center', field: 'gender' },
        { name: 'email', label: 'Email', align: 'left', field: 'email' },
        { name: 'phone_number', label: 'Phone Number', align: 'center', field: 'phone_number' },
        { name: 'region', label: 'Region', align: 'center', field: 'region' },
        { name: 'country', label: 'Country', align: 'center', field: 'country' },
        { name: 'address', label: 'Address', align: 'left', field: 'address' },
        { name: 'skype_id', label: 'Skype ID', align: 'left', field: 'skype_id' },
        { name: 'kakao_id', label: 'Kakao ID', align: 'left', field: 'kakao_id' },
        { name: 'experience_years', label: 'Experience (Years)', align: 'center', field: 'experience_years' },
        { name: 'work_start_date', label: 'Work Start Date', align: 'center', field: 'work_start_date' },
        { name: 'teachable_subjects', label: 'Teachable Subjects', align: 'left', field: 'teachable_subjects' },
        { name: 'teachable_times', label: 'Teachable Times', align: 'left', field: 'teachable_times' },
        { name: 'teachable_days', label: 'Teachable Days', align: 'left', field: 'teachable_days' },
        { name: 'bank_name', label: 'Bank Name', align: 'left', field: 'bank_name' },
        { name: 'account_number', label: 'Account Number', align: 'center', field: 'account_number' },
        { name: 'level_test_yn', label: 'Level Test Available', align: 'center', field: 'level_test_yn' },
        { name: 'education', label: 'Education', align: 'left', field: 'education' },
        { name: 'career_description', label: 'Career Description', align: 'left', style: 'width: 300px;', field: 'career_description' },
        { name: 'job_interview_yn', label: 'job_interview', align: 'left', field: 'job_interview_yn' },
        { name: 'attachment_path', label: 'Attachment Path', align: 'left', field: 'attachment_path' },
      ],
      pagination: { page: 1, rowsPerPage: 0, rowsNumber: 0 },  // 페이지네이션을 비활성
    };
  },

  computed: {
    // 현재 상태를 제외한 옵션 필터링
    filteredStatusOptions() {
      return this.statusOptions.filter(option => option.value !== this.status);
    },
  },

    async created() {
    // this.getInfoByLecturerId(this.$store.state.loginUserInfo.lecturer_id);
     try {
      // const response =  await this.$store.state.lecturerInfo;
       const response =  localStorage.getItem('loginLecturerInfo');
       const responseObj = JSON.parse(response);
       if(response !== null){
         this.rows = [responseObj];
         this.status = this.rows[0].status;
         this.pagination.rowsNumber = 1;
        }
     }catch (err){
       console.log(' >>>', err);
     }
   },

  methods: {
    onStatusChange(newStatus) {
      console.log('newStatus >>>',newStatus );
      if (newStatus === "teaching_pending" && this.rows[0].job_interview_yn === "N") {

        this.$q.dialog({
          title: "Interview Required",
          message: "Would you like to schedule an interview now?",
          cancel: true,
          persistent: true,
        }).onOk(() => {
          // Yes 선택 시 인터뷰 캘린더 페이지로 이동
          this.showDialog = false; // 팝업 닫기
          this.$router.push("/jobInterviewCalendar");
        }).onCancel(() => {
          // No 선택 시 아무 작업도 하지 않음
          console.log("Interview scheduling cancelled.");
        });
        return;
      }
    },

    confirmStatusChange(lecturer_user_id, name) {
      if (this.selectedStatus) {
        this.status = this.selectedStatus; // 상태 업데이트
        console.log("New Status:", this.status); // 변경 확인
      }

      if (this.selectedStatus === "teaching_pending") {
          // Teaching 선택 시 요청 이메일 발송
          const param = {
            lecturer_user_id : this.rows[0].lecturer_user_id,
            name : this.rows[0].name
          };
          this.sendStatusRequestEmail(param);

      }
      this.showDialog = false; // 팝업 닫기
    },

    sendStatusRequestEmail(param){
      this.$store.dispatch('sendStatusRequestEmail', param);
    },

    goCalendar() {
      this.currentView = "calendar"; // 캘린더 화면으로 전환
    },

    goBack() {
      this.currentView = "lecturerInfo"; // 이전 화면으로 복귀
    },

    // 맨위 개별 정보
    async getInfoByLecturerId(lecturer_id){
      // const lecturer_id = 36; 이렇게 하면, 중복 변수 선언이라 에러남.

      // 아래 axios호출을 바로 밑처럼 store의 actions에서 처리하게 하는 게 좋다고 함. 화면은 받은 수식계산과 UI업데이트만 처리하게.
      console.log('getInfoByLecturerId에서 store >>>', this.$store.state.loginUserInfo);
      try {
        await this.$store.dispatch("fetchLecturerInfo", lecturer_id);

      }catch (err){

      }

      // axios.get('http://localhost:8080/lecturer/getLecturerInfo/'+ lecturer_id)
      //   .then(({data})=>{
      //     console.log('getLecturerInfo >>>', data);
      //     if (data) {
      //       this.rows = [data];  // 단일 객체 배열로 설정
      //       this.pagination.rowsNumber = 1;  // 총 항목 수를 1로 설정
      //     } else {
      //       this.rows = [];  // 데이터가 없으면 빈 배열로 설정
      //     }
      //   })
    },
    editLecturer(){
      // 라우팅을 통해 다른 화면으로 이동. 이 설정은 routes.js에 함.
      this.$router.push('/update-info-for-lecturer');
    }


  },
};
</script>
<style scoped>
.q-card {
  max-width: 1200px;
  margin: 16px;
}

.q-avatar {
  background-color: #1976D2;
}

.q-card-section {
  padding: 16px;
}

.row {
  display: flex;
  justify-content: flex-start; /* 기본 왼쪽 정렬 */
  align-items: center;
}

.q-ml-md {
  margin-left: 16px; /* 요소들 사이에 간격을 추가 */
}

.lecturer-main-container {
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  padding: 16px;
}

.q-table-wrapper {
  width: 80%; /* 테이블 너비를 화면의 80%로 설정 */
  max-width: 1200px; /* 최대 너비 제한 */
  min-width: 600px; /* 최소 너비 제한 */
}

.q-table-wrapper .q-table {
  width: 100%; /* 내부 테이블이 카드 너비에 맞게 조정 */
}

.rounded-avatar {
  border-radius: 50%; /* 완벽한 원형으로 만듦 */
  overflow: hidden;   /* 이미지가 테두리를 넘지 않도록 처리 */
  border: 2px solid #1976D2; /* 테두리 색상과 두께 */
}

/* 탭 패널 크기 조정 */
.tab-panels {
  max-height: 400px; /* 최대 높이를 설정 */
  overflow-y: auto;  /* 내용이 너무 많을 경우 스크롤 가능 */
}

/* 각 탭 패널에 대한 높이 조정 */
.tab-panel {
  height: auto;
  padding: 16px;
}

/* main 요소의 min-height를 덮어쓰는 스타일 */
.q-tab-panel main q-page{
  min-height: 500px !important; /* 기존 min-height보다 작은 값으로 설정 */
}
</style>
