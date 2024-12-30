<template>
  <q-page padding>

    <!-- TODO  -->
    <!-- 여기에 전체 스케줄 캘린더 추가하기 -->
    <!-- 여기에 전체 스케줄 캘린더 추가하기 -->

    <q-card>
      <q-table
        title="모든 lesson schedule"
        :data="adminData"
        :columns="AllScheduleColumns"
        row-key="id"
        :pagination="pagination"
        :filter="filter"
        class="custom-table"
      >
        <!-- audioFileUrl 컬럼 -->
        <template v-slot:body-cell-audioFileUrl="props">
          <q-td>
            <div class="q-pa-sm">
              <audio
                controls
                v-if="props.row.audioFileUrl"
                class="audio-player"
              >
                <source :src="props.row.audioFileUrl" type="audio/mpeg" />
                브라우저가 오디오 태그를 지원하지 않습니다.
              </audio>
            </div>
          </q-td>
        </template>

        <!-- pronunciation_advice 컬럼 -->
        <template v-slot:body-cell-pronunciation_advice="props">
          <q-td>
            <template v-if="props.row.audioFileUrl">
              <div class="q-pa-sm row no-wrap items-center">
                <q-input
                  v-model="props.row.pronunciation_advice"
                  outlined
                  :readonly="!props.row.isEditing"
                  class="pronunciation_advice"
                  type="textarea"
                />
                <!-- 수정 버튼 -->
                <q-btn
                  v-if="!props.row.isEditing"
                  label="수정"
                  color="primary"
                  dense
                  @click="editPronunciationAdvice(props.row)"
                />

                <!-- 저장 버튼 -->
                <q-btn
                  v-if="props.row.isEditing"
                  label="저장"
                  color="positive"
                  dense
                  @click="savePronunciationAdvice(props.row)"
                />
              </div>
            </template>
          </q-td>
        </template>
      </q-table>
    </q-card>

<!-- 모든 강사 정보 + 강사료 -->
    <div>
      <LecturerAllInfoForAdmin/>
    </div>

    <!-- 수업 개별 추가. -->
    <q-card>
      <q-card-section>
    <!--매개변수. Member_id(), Enroll_id(), lecturer_id(). 이것만 같은면, enroll_id가 다르므로, 자동추가됨. -->
        <div class="text-h6">수업 개별 추가. schedule를 마지막에 추가하기.(중간에 추가 불가.)</div>
      </q-card-section>

      <q-card-section>
          <q-select
            outlined
            v-model="selectMemberId"
            label="Member_id 선택"
            :options="selectMemberIdOptions"
            option-label="member_id"
            option-value="member_id"
            class="q-mb-md"
          />
          <q-select
            outlined
            v-model="selectEnrollId"
            label="enroll_id 선택"
            :options="selectEnrollIdOptions"
            option-label="enroll_id"
            option-value="enroll_id"
            class="q-mb-md"
          />
          <q-select
            outlined
            v-model="selectLecturerId"
            label="lecturer_id 선택"
            :options="selectLecturerIdOptions"
            option-label="lecturer_id"
            option-value="lecturer_id"
            class="q-mb-md"
          />
      </q-card-section>
      <q-card-section>
        name: {{selectMemberId.name}}, enroll_id:{{selectEnrollId. enroll_id}}, lecturer_id:{{selectLecturerId.lecturer_id}}
      </q-card-section>
          <q-btn label="schedule 추가하기" color="primary" @click="addNewSchedule" class="full-width" />

    </q-card>

    <!-- 강사 jobInterviewTime -->
    <div>
      <q-table
        title="jobInterviewTime"
        :data="jobInterviewTimeData"
        :columns="jobInterviewTimeColumns"
        row-key="interview_time_id"
      >
      </q-table>
    </div>

    <!-- 할인 테이블의 할인율 업데이트 -->
    <div>
      <DiscountInputForm/>
    </div>

  </q-page>
</template>

<script>
import axios from "axios";
import DiscountInputForm from "pages/DiscountInputForm.vue";
import LecturerAllInfoForAdmin from "pages/LecturerAllInfoForAdmin.vue";

export default {
  components:{
    DiscountInputForm, LecturerAllInfoForAdmin
  },
  data() {
    return {
      AllScheduleColumns: [
        { name: 'member_id', label: 'Member ID', field: 'member_id', sortable: true },
        { name: 'enroll_id', label: 'Enroll ID', field: 'enroll_id', sortable: true },
        { name: 'lecturer_id', label: 'Lecturer ID', field: 'lecturer_id', sortable: true },
        { name: 'subject_name', label: 'Subject Name', field: 'subject_name', sortable: true },
        { name: 'lesson_method', label: 'Method', field: 'lesson_method', sortable: true },
        { name: 'lesson_period', label: 'Period', field: 'lesson_period', sortable: true },
        { name: 'lesson_duration', label: 'Duration', field: 'lesson_duration', sortable: true },
        { name: 'lesson_days', label: 'Days', field: 'lesson_days' },
        { name: 'lesson_day', label: 'day', field: 'lesson_day', sortable: true },
        { name: 'lesson_date', label: 'date', field: 'lesson_date', sortable: true },
        { name: 'lesson_time', label: 'time', field: 'lesson_time', sortable: true },
        { name: 'last_date', label: 'last_date', field: 'last_date', sortable: true },
        { name: 'lecturer_evaluation', label: 'lecturer_evaluation', field: 'lecturer_evaluation' },
        { name: 'comments', label: 'comments', field: 'comments' },
        { name: 'audioFileUrl', label: 'audioFileUrl', field: 'audioFileUrl' },
        { name: 'pronunciation_advice', label: 'pronunciation_advice', field: 'pronunciation_advice' },
      ],
      jobInterviewTimeColumns : [
        { name: 'lecturer_user_id', label: 'Lecturer User ID', align: 'left', field: 'lecturer_user_id', sortable: true },
        { name: 'lecturer_name', label: 'Lecturer Name', align: 'left', field: 'lecturer_name', sortable: true },
        { name: 'interview_date_time', label: 'Interview Date & Time', align: 'left', field: 'interview_date_time', format: val => new Date(val).toLocaleString('ko-KR'), sortable: true },
        { name: 'created_at', label: 'Created At', align: 'left', field: 'created_at', format: val => new Date(val).toLocaleString('ko-KR'), sortable: true },
        { name: 'updated_at', label: 'Updated At', align: 'left', field: 'updated_at', format: val => new Date(val).toLocaleString('ko-KR'), sortable: true },
        { name: 'job_interview_yn', label: 'Job Interview Y/N', align: 'center', field: 'job_interview_yn', sortable: true }
      ],
      pagination: {
        rowsPerPage: 5
      },
      filter: '',
      adminData:[],
      jobInterviewTimeData:[],

      selectMemberIdOptions:[],
      selectEnrollIdOptions:[],
      selectLecturerIdOptions:[],
      selectMemberId:'',
      selectEnrollId:'',
      selectLecturerId:'',


    };
  },
  mounted() {
    this.getAllLessons();
    this.getAllJobInterviewTimesAdmin();
  },

  methods: {
    getAllLessons() {
      axios.get('http://localhost:8080/getAllSchedulesForAdmin')
        .then(({data})=>{
          console.log('adminData >>>', data);
          this.adminData = data.map(row=>({
            ...row,
            isEditing:false
          }))
        })
        .then(()=>{
          this.selectMemberIdOptions = Array.from(
            new Map(this.adminData.map(item => [item.member_id, item])).values()
          ).map(item => ({
            member_id: item.member_id,
            name: item.name,
            subject_name:item.subject_name,
            lesson_fee:item.lesson_fee,
            lesson_end_time:item.lesson_end_time,
            lecturer_sub_name:item.lecturer_sub_name,
            lecturer_sub_lecturer_id:item.lecturer_sub_lecturer_id,
            lecturer_sub_user_id:item.lecturer_sub_user_id,
            lecturer_cancel_reason:item.lecturer_cancel_reason,
            lecturer_cancel_yn:item.lecturer_cancel_yn,
          }));
          this.selectEnrollIdOptions = Array.from(
            new Set(this.adminData.map(item => item.enroll_id))
          ).map(enroll_id => ({
            enroll_id
          }));
          this.selectLecturerIdOptions = Array.from(
            new Set(this.adminData.map(item => item.lecturer_id))
          ).map(lecturer_id => ({
            lecturer_id
          }));
        })
    },

    addNewSchedule(){
      axios.post('http://localhost:8080/postponeLesson', {
        //schedule_id: this.adminData.schedule_id,
        member_id: this.selectMemberId.member_id,
        enroll_id: this.selectEnrollId.enroll_id,
        lecturer_id: this.selectLecturerId.lecturer_id,
        subject_name: this.selectMemberId.subject_name,
        lesson_fee: this.selectMemberId.lesson_fee,
        lesson_end_time: this.selectMemberId.lesson_end_time,
        //아래는, 대체수업을 다시 수업연기시, 새로운 행에 그냥 표시위해.<-- 완전 첨 추가이므로, 없어도 될 듯.
        // lecturer_sub_name: this.selectMemberId.lecturer_sub_name,
        // lecturer_sub_lecturer_id: this.selectMemberId.lecturer_sub_lecturer_id,
        // lecturer_sub_user_id: this.selectMemberId.lecturer_sub_user_id,
        // lecturer_cancel_reason: this.selectMemberId.lecturer_cancel_reason,
        // lecturer_cancel_yn: this.selectMemberId.lecturer_cancel_yn,
        added_by_delay: 'Y admin',
      })
        .then(() => {
          this.$q.dialog({
            title: 'Confirm',
            message: '새로운 schedule insert 완료',
            cancel: true,
            persistent: true
          }).onOk(() => {

          })
        })
        .catch(err => {
          console.log('Error >>>', err);
        }); //axios
    },

    editPronunciationAdvice(row){
      row.isEditing = true;
    },
    savePronunciationAdvice(row){
      const params={
        member_id:row.member_id,
        enroll_id:row.enroll_id,
        schedule_id:row.schedule_id,
        pronunciation_advice:row.pronunciation_advice
      }
      //관리자가 발음 조언 입력
      axios.post('http://localhost:8080/updatePronunciationAdvice', params)
        .then(({data})=>{
          alert('수정완료됐습니다.')
          row.isEditing=false;
        })
    },

    // TODO 다른데도 getAllJobInterviewTimesAdmin 있음므로 아래처럼 그것도 수정해야.
    async getAllJobInterviewTimesAdmin(){
      const result = await this.$store.dispatch('getAllJobInterviewTimes');
      console.log('result >>>', result); // undefined
      console.log('this.$store.state.getAllJobInterviewTimes >>>', this.$store.state.getAllJobInterviewTimes);
      this.jobInterviewTimeColumns = result;
    }
  }, // methods
}
</script>
<style>
.q-card {
  max-width: 1200px;
  margin: 16px;
}

/* 테이블 셀 사이에 세로 선 추가 */
.custom-table .q-tr > .q-td {
  border-right: 1px solid black; /* 세로 선 색상 */
}

/* 마지막 열은 세로선 제거 */
.custom-table .q-tr > .q-td:last-child {
  border-right: none;
}
.audio-player {
  width: 200px; /* 원하는 너비로 설정 */
  height: 30px; /* 높이를 필요에 따라 설정 */
}
.pronunciation_advice{
  width: 400px;
  height: auto;
}

</style>
