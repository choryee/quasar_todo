<template>
  <div className="q-pa-md">
    <q-table
      class="custom-table text-lg"
      flat
      bordered
      title="Newly enrolled students. Please click selectBox to add as your student if you want."
      :data="rows"
      :columns="columns"
      row-key="customKey"
      selection="single"
      :selected.sync="selected"
      @selection="handleSelection"

    />

    <div className="q-mt-md">
      Selected: {{ selected.length ? JSON.stringify(selected[0]) : 'None' }} <br/>

    </div>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          Are you sure you want to take this class?
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancel" @click="clickCancelBtn" />
          <q-btn flat label="Confirm" @click="confirmAssociation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import axios from "axios";
import EventBus from '../services/eventBus';


export default {
  data() {
    return {
      selected: [], // 선택된 데이터
      dialogVisible: false, // 다이얼로그 상태 관리
      rows:[],
      columns: [
        { name: 'name', label: 'name', field: 'name', sortable: true },
        { name: 'subject_name', label: 'Subject Name', field: 'subject_name', sortable: true },
        { name: 'lesson_method', label: 'Lesson Method', field: 'lesson_method', sortable: true },
        { name: 'lesson_period', label: 'Lesson Period', field: 'lesson_period', sortable: true },
        { name: 'lesson_frequency', label: 'Lesson Frequency', field: 'lesson_frequency', sortable: true },
        { name: 'lesson_duration', label: 'Lesson Duration', field: 'lesson_duration', sortable: true },
        { name: 'lesson_days', label: 'Lesson Days', field: 'lesson_days' },
        { name: 'start_date', label: 'Start Date', field: 'start_date', sortable: true },
        { name: 'last_date', label: 'last_date', field: 'last_date', sortable: true },
        { name: 'start_time', label: 'Start Time', field: 'start_time', sortable: true },
        { name: 'skype_id', label: 'Skype ID', field: 'skype_id' },
        { name: 'special_requests', label: 'special_requests', field: 'special_requests' }
      ],

    }
  },

  async created() {
    try {
      await this.$store.dispatch('getNewEnrollments');
      this.rows = this.$store.state.getNewEnrollments.map((item, index) => {
        return {
          ...item,
          customKey: `${item.member_id}-${index}` // member_id와 index를 결합하여 고유한 key 생성
        };
      });
    }catch (err){

    }
  },

  methods:{
    clickCancelBtn(){
      this.selected = [];
      this.dialogVisible = false;
    },

    handleSelection() {
      // @selection 이벤트 핸들러 내부에서 this.$nextTick을 사용하여, Vue가 this.selected를 업데이트한 후에
      // 코드를 실행하도록 보장할 수 있습니다.
      this.$nextTick(() => {
        if (this.selected.length > 0) {
          console.log("Selected row:", this.selected[0]); // 디버깅 로그
          //this.selected = [this.selected[this.selected.length - 1]]; // 마지막 선택 항목만 남기기
          this.selected = [this.selected[0]]; // 마지막 선택 항목만 남기기
          this.dialogVisible = true; // 다이얼로그를 띄운다
        } else {
          console.log("No selection made.");
        }
      });
    },

    confirmAssociation() {
      // 선택된 데이터와 강사 ID를 이용하여 연관시키는 함수 호출
      this.checkNestedTime()
        .then((data)=>{
          console.log('data 2 >>>', data);
          if(data == 'OverLap'){
            alert("Your selection is overlapped. This class can't be added.");
            this.selected = [];
            return;
          }
          return  this.associateEnrollmentWithLecturer()
        })// this.checkNestedTime()

            .then(() => { // 바로 위 this.associateEnrollmentWithLecturer()의 then()임.
              // 밑에 return이 없으면, 밑에 .then()이 먼저 실행될 수 있다. 순서 보장 안됨.
              return this.$store.dispatch('getNewEnrollments');
            })
            .then(() => { // 바로 위 this.$store.dispatch('getNewEnrollments');의 the()임.
              this.rows = this.$store.state.getNewEnrollments; // rows를 업데이트합니다.
              EventBus.$emit('update-all-students');
              this.dialogVisible = false; // 다이얼로그를 닫습니다.
            })
            .catch(error => {
              console.error("Error updating table:", error);
            });
    },// confirmAssociation

    checkNestedTime(){
      //TODO 중복 시간 검증 안 되는 듯.241222
      const getLocalStorageData = localStorage.getItem('loginLecturerInfo');
      const lecturer_id = getLocalStorageData.lecturer_id;
      const payload = {
        //lecturer_id : this.$store.state.loginUserInfo.lecturer_id, // 현재 강사의 ID
        lecturer_id : lecturer_id,
        enroll_id : this.selected[0].enroll_id, // 선택된 학생의 ID
      };
      return axios.post(`http://localhost:8080/checkNestedTime`, payload)
        .then(({data})=>{
          console.log('최초 data >>>', data);
          return data; //return axios... 의 return이 없으면, 왼쪽의 data는 다른데서 사용할 수 없다.
        })
    },

    // selected 됐을때, lecturer-enroll과 매칭 시킴.
    associateEnrollmentWithLecturer() {
        if (this.selected.length === 0) {// 선택된 값이 없는 경우 처리하지 않음
          alert("No student selected.");
          return;
        }

      const getLocalStorageData = localStorage.getItem('loginLecturerInfo');
      const payload = {

        lecturer_id : JSON.parse(getLocalStorageData).lecturer_id, // 현재 강사의 ID
        enroll_id : this.selected[0].enroll_id, // 선택된 학생의 ID
        member_id : this.selected[0].member_id
      };

      return  axios.post('http://localhost:8080/associateEnrollmentWithLecturer', payload)
        .then(response => {
          console.log("Association successful", response.data);
          console.log('associateEnrollmentWithLecturer >>>', response.data);
        })
        .catch(error => {
          console.error("Association failed", error);
        });

    },


  }
}
</script>

<style scoped>
.q-pa-md {
  padding: 16px;
}
.custom-table .q-td {
  font-size: 14px; /* 원하는 크기로 변경 */
}

.custom-table th {
  font-size: 40px; /* 헤더의 글자 크기 */
  font-weight: bold; /* 헤더를 강조 */
}
</style>
