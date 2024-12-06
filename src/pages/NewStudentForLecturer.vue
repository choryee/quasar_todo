<template>
  <div className="q-pa-md">
    <q-table
      class="custom-table text-lg"
      flat
      bordered
      title="Newly enrolled students"
      :data="rows"
      :columns="columns"
      row-key="member_id"
      selection="single"
      :selected.sync="selected"
      @selection="handleSelection"
      style="font-size: 34px;"
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
          <q-btn flat label="Cancel" @click="dialogVisible = false" />
          <q-btn flat label="Confirm" @click="confirmAssociation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selected: [], // 선택된 데이터
      rows:[],
      columns: [
        { name: 'member_id', label: 'Member ID', field: 'member_id', align: 'center', sortable: true },
        { name: 'subject_name', label: 'Subject Name', field: 'subject_name', align: 'left', sortable: true },
        { name: 'day_discount', label: 'Daytime Discount', field: 'day_discount', align: 'center', sortable: true },
        { name: 'lesson_method', label: 'Lesson Method', field: 'lesson_method', align: 'center', sortable: true },
        { name: 'lesson_period', label: 'Lesson Period', field: 'lesson_period', align: 'right', sortable: true },
        { name: 'lesson_frequency', label: 'Lesson Frequency', field: 'lesson_frequency', align: 'right', sortable: true },
        { name: 'lesson_duration', label: 'Lesson Duration', field: 'lesson_duration', align: 'right', sortable: true },
        { name: 'lesson_days', label: 'Lesson Days', field: 'lesson_days', align: 'left', sortable: false },
        { name: 'start_date', label: 'Start Date', field: 'start_date', align: 'center', sortable: true, },
        { name: 'last_date', label: 'Last Date', field: 'last_date', align: 'center', sortable: true, },
        { name: 'start_time', label: 'Start Time', field: 'start_time', align: 'center', sortable: false },
        { name: 'skype_id', label: 'Skype ID', field: 'skype_id', align: 'left', sortable: false },
        { name: 'special_requests', label: 'Special Requests', field: 'special_requests', align: 'left', sortable: false },
        { name: 'pronunciation_advice_yn', label: 'Pronunciation Advice', field: 'pronunciation_advice_yn', align: 'center', sortable: true }
      ],
      dialogVisible: false, // 다이얼로그 상태 관리
    }
  },

  mounted() {
    this.getAllEnrollments();
  },

  methods:{
    handleSelection() {
      // @selection 이벤트 핸들러 내부에서 this.$nextTick을 사용하여 Vue가 this.selected를 업데이트한 후에 코드를 실행하도록 보장할 수 있습니다.
      this.$nextTick(() => {
        if (this.selected.length > 0) {
          console.log("Selected row:", this.selected[0]); // 디버깅 로그
          this.dialogVisible = true; // 다이얼로그를 띄운다
        } else {
          console.log("No selection made.");
        }
      });
    },

    confirmAssociation() {
      // 선택된 데이터와 강사 ID를 이용하여 연관시키는 함수 호출
      this.associateEnrollmentWithLecturer();
      this.dialogVisible = false; // 다이얼로그를 닫는다
    },

    getAllEnrollments(){
      axios.get('http://localhost:8080/getAllEnrollments')
        .then(({data})=>{
          console.log('getAllEnrollments res>>>', data);
          this.rows = data;
        })
    },

    // selected 됐을때,
    associateEnrollmentWithLecturer() {
        // 선택된 값이 없는 경우 처리하지 않음
        if (this.selected.length === 0) {
          alert("No student selected.");
          return;
        }

      const payload = {
       // lecturer_id: this.lecturer_id, // 현재 강사의 ID
        lecturer_id : 36, // 현재 강사의 ID
        enroll_id : this.selected[0].enroll_id, // 선택된 학생의 ID
      };

      axios.post('http://localhost:8080/associateEnrollmentWithLecturer', payload)
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
