<template>
  <q-page padding>
    <q-table
      :data="adminData"
      :columns="columns"
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
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      columns: [
        { name: 'member_id', label: 'Member ID', field: 'member_id', sortable: true },
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
      pagination: {
        rowsPerPage: 5
      },
      filter: '',
      adminData:[],

    };
  },
  mounted() {
    this.getAllLessons();
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

    }
  }
}
</script>
<style>
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
