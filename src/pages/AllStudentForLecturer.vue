<template>
  <div className="q-pa-md">
    <q-table
      flat
      bordered
      title="All my students. click selectBox to cancle class. ONLY AVAILABLE BEFORE 2 DAYS OF START DATE."
      :data="rows"
      :columns="columns"
      row-key="customKey"
      virtual-scroll
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
          Are you sure you want to cancel this class?
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
  props:{
    // lessons: {
    //   type: Array,
    //   required: true
    // }
  },
  data() {
    // Data and variables

    return { // name,label,field순으로
      selected: [], // 선택된 데이터
      dialogVisible: false, // 다이얼로그 상태 관리
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
      rows: [],
      // pagination: {
      //   rowsPerPage: 0
      // }
    };
  },
  // watch
  watch: {
    lessons: {
      immediate: true,
      handler(newLessons) {

      }
    }
  },

  async created() {
    // 초기 데이터 호출
    //this.getAllStudentByLecturerId();
    try {
     const response = await this.$store.dispatch('getAllStudentByLecturerId');
     this.rows = await this.$store.state.getAllStudentByLecturerId.map((item,index)=>{
       return {
         ...item,
         customKey: `${item.member_id}-${index}`
       }
     })
    }catch (err) {
    }
    // 이벤트 리스너 등록
    EventBus.$on('update-all-students', this.getAllStudentByLecturerId);
  },
  beforeDestroy() {
    // 컴포넌트 소멸 시 이벤트 리스너 해제
    EventBus.$off('update-all-students', this.getAllStudentByLecturerId);
  },

  mounted() {
   // this.getAllStudentByLecturerId();
  },

  methods:{
    clickCancelBtn(){
      this.selected = [];
      this.dialogVisible = false;
    },

    handleSelection() {
      // @selection 이벤트 핸들러 내부에서 this.$nextTick을 사용하여, Vue가 this.selected를 업데이트를 완료 후에, 다음
      // 코드를 실행하도록 보장할 수 있습니다.
      this.$nextTick(() => {
        if (this.selected.length > 0) {
          console.log("Selected row:", this.selected[0]); // 디버깅 로그
          this.checkBeforeStartTime(48) //  TODO 48시간.
            .then((data)=>{
              if(data === 'Before48StartTime'){
                alert('수업시작 2일전에는 취소 불가합니다. ');
                this.selected = [];
                return;
              }else {
                this.dialogVisible = true; // 다이얼로그를 띄운다
              }
            })// checkBeforeStartTime

        } else {
          console.log("No selection made.");
        }
      });
    },

    confirmAssociation() {
      this.deleteAssociateEnrollmentWithLecturer()
        .then(data=>{
          if(data === 1){
            alert('deletion success..')
          }
        })
    },

   async getAllStudentByLecturerId(){
      //const lecturer_id = this.$store.state.loginUserInfo.lecturer_id;
      const getLocalStorageData = localStorage.getItem('loginLecturerInfo');
      const lecturer_id = JSON.parse(getLocalStorageData).lecturer_id;
       await axios.get('http://localhost:8080/getAllStudentByLecturerId', {
        params :{
          lecturer_id : lecturer_id
        }
      })
        .then(({data})=>{
          console.log('AllStudent.. getAllStudentByLecturerId >>>', data);
          this.rows = data.map((item, index)=>{
            return{
              ...item,
              customKey: `${item.member_id}-${index}`
            }
          })
        })

    },

   async checkBeforeStartTime(checkHour){
      const selectedData ={
        ...this.selected[0],
        amountHour : checkHour
      }
     // const sendData = JSON.stringify(this.selected[0]);
      return await axios.post('http://localhost:8080/checkBeforeStartTime', selectedData)
        .then(({data})=>{
          return data;
        })
    },

    async deleteAssociateEnrollmentWithLecturer(){
      const getLocalStorageData = localStorage.getItem('loginLecturerInfo');
      const lecturer_id = JSON.parse(getLocalStorageData).lecturer_id;
      const payload = {
        // lecturer_id: this.lecturer_id, // 현재 강사의 ID
        //lecturer_id : this.$store.state.loginUserInfo.lecturer_id, // 현재 강사의 ID
        lecturer_id : lecturer_id, // 현재 강사의 ID
        enroll_id : this.selected[0].enroll_id, // 선택된 학생의 ID
      };
      return await  axios.delete('http://localhost:8080/deleteAssociateEnrollmentWithLecturer', payload)
        .then(({data})=>{
          return data;
        })
    }
  }
};
</script>

<style scoped>
.q-pa-md {
  padding: 1px;
}
.q-table {
  border-spacing: 0 !important; /* 테이블 간격을 없앱니다 */
}
</style>
