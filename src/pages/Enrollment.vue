<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="q-gutter-md">
        <!-- 과목명 선택 -->
        <q-select
          v-model="formData.subject_name"
          label="과목명"
          :options="[
            { label: '주니어과정', value: 'junior' },
            { label: '시니어과정', value: 'senior' },
            { label: '영어시험대비', value: 'forExam' },
            { label: '영어뉴스리딩', value: 'newsReading' },
            { label: '영어원서리딩', value: 'bookReading' },
            { label: '영어토론', value: 'debating' },
            { label: 'Phonics과정', value: 'phonics' }
          ]"
          :rules="[val => !!val || '과목명을 선택하세요']"
          dense
          emit-value
        />

        <!-- 낮시간할인선택 -->
<!--        <q-select-->
<!--          v-model="formData.day_discount"-->
<!--          label="낮시간할인선택"-->
<!--          :options="[-->
<!--            { label: '할인 안함', value: 'N' },-->
<!--            { label: '할인 있음', value: 'Y' }-->
<!--          ]"-->
<!--          :rules="[val => !!val || '할인 여부를 선택하세요']"-->
<!--          dense-->
<!--        />-->

        <!-- 발음지도 -->
        <div class="q-pa-none">
        <q-select
          v-model="formData.pronunciation_advice_yn"
          label="영어발음전문가의 1회 발음 조언 받으시겠습니까?"
          :options="[
            { label: '조언 안 받음', value: 'N' },
            { label: '조언 받음. 강사와의 일부 수업 녹음을 허락합니다. ', value: 'Y' }
          ]"
          :rules="[val => !!val || '발음 조언 여부를 선택하세요']"
          dense
          class="pronunciation_advice_yn"
          emit-value
        />
        <div >
          <span>(일정 기한후 녹음은 폐기되며,녹음파일은 회원에게 제공되지 않습니다.)</span>
        </div>
        </div>

        <!-- 수업 방법 -->
        <q-select
          v-model="formData.lesson_method"
          label="수업 방법"
          :options="[
            { label: 'Skype', value: 'Skype' },
            { label: 'Zoom', value: 'Zoom' },
            { label: 'Meet', value: 'Meet' }
          ]"
          :rules="[val => !!val || '수업 방법을 선택하세요']"
          dense
          emit-value
        />

        <!-- 수업기간 -->
        <q-select
          v-model="formData.lesson_period"
          label="수업 기간"
          :options="[
            { label: '1개월', value: 1 },
            { label: '3개월', value: 3 }
          ]"
          :rules="[val => !!val || '수업 기간을 선택하세요']"
          dense
          emit-value
        />

        <!-- 수업횟수 -->
        <q-select
          v-model="formData.lesson_frequency"
          label="수업 횟수"
          :options="[
            { label: '주 2회', value: 2 },
            { label: '주 3회', value: 3 },
            { label: '주 4회', value: 4 },
            { label: '주 5회', value: 5 },
            { label: '주 6회', value: 6 },
            { label: '주 7회', value: 7 },
            { label: '주말 수업', value: 99 }
          ]"
          :rules="[val => !!val || '수업 횟수를 선택하세요']"
          dense
          emit-value
        />

        <!-- 수업 시간 -->
        <q-select
          v-model="formData.lesson_duration"
          label="수업 시간"
          :options="[
            { label: '20분', value: 20 },
            { label: '30분', value: 30 },
            { label: '40분', value: 40 },
            { label: '50분', value: 50 },
            { label: '1시간', value: 60 }
          ]"
          :rules="[val => !!val || '수업 시간을 선택하세요']"
          dense
          emit-value
        />

        <!-- 수업 요일
         lesson_days에 선택된 요일의 배열이 val로 전달됩니다.
         matchLessonDaysAndLessonFrequency 함수를 :rules 속성에 맞게 작성하고 사용하려면, 이 함수는 반드시 값을 반환해야 합니다.
         :rules 내에서 사용되는 함수는 true(유효) 또는 오류 메시지(무효)를 반환해야 합니다.
         -->
        <q-select
          v-model="formData.lesson_days_arr"
          label="수업 요일"
          multiple
          :options="[
            { label: 'Mon', value: 'Mon' },
            { label: 'Tue', value: 'Tue' },
            { label: 'Wed', value: 'Wed' },
            { label: 'Thu', value: 'Thu' },
            { label: 'Fri', value: 'Fri' },
            { label: 'Sat', value: 'Sat' },
            { label: 'Sun', value: 'Sun' }
          ]"
          :rules="[val => val.length > 0 || '수업 요일을 선택하세요'],
                  matchLessonDaysAndLessonFrequency"
          dense
          emit-value
        />

        <!-- 시작일 -->
        <q-input
          v-model="formData.start_date"
          label="시작일"
          type="date"
          :rules="[val => !!val || '시작일을 선택하세요']"
          dense
        />


        <!-- 시작 시간 -->
        <q-select
          v-model="formData.start_time"
          label="시작 시간"
          :options="timeOptions"
          :rules="[val => !!val || '시작 시간을 선택하세요']"
          dense
          emit-value
        />

        <!-- Skype 아이디 -->
        <q-input v-model="formData.skype_id" label="Skype ID" dense />

        <!-- 특이 요청 사항 -->
        <q-input v-model="formData.special_requests" label="특이 요청 사항" type="textarea" dense />

        <!-- 제출 버튼 -->
        <q-btn label="Registration" color="primary"  @click="submitEnrollment" class="full-width" />
      </div>
      </div>
  </q-page>
</template>

<script>
import {date} from "quasar";
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        member_id : '1400',
        subject_name: '',
        day_discount: 'N',
        pronunciation_advice_yn:'N',
        lesson_method: 'Skype',
        lesson_period: 1, // 1-> 4 weeks
        lesson_frequency: 2,
        lesson_duration: 30,
        lesson_days: '',
        lesson_days_arr:[],
        start_date: new Date().toISOString().split('T')[0],
        start_time: '06:00',
        skype_id: '',
        special_requests: '',
        last_date: null,   // 계산된 마지막 날짜
      },
      dateOptions: this.getDateOptions(),
      timeOptions: Array.from({ length: (23 - 6) * 6 + 1 }, (_, i) => {
        const hours = Math.floor(i / 6) + 6; // 시작 시간을 6으로 설정
        const minutes = (i % 6) * 10;
        const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return { label: time, value: time };
      })

    };
  },
  // mounted() {
  //  this.updateLastDate(); // 초기 렌더링 시에도 날짜를 계산
  // },

  methods: {
    updateLastDate() { // 실제로 select를 선택해야 에러가 안 난다.
      const start_date = this.formData.start_date;
      console.log('this.formData.start_time >>>', this.formData.start_time);
      const lessonDays = this.formData.lesson_days_arr.map(day => day);
      console.log('lessonDays >>>', lessonDays);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      let lessonPeriod;
      if(this.formData.lesson_period === 1 ){
        lessonPeriod = 4;
      }else{
        lessonPeriod = 12; // 3개월*4
      }
      const requiredLessons = lessonPeriod * lessonDays.length; // 총 필요한 수업 수
      console.log('requiredLessons >>>', requiredLessons);
      let currentLessons = 0;
      let currentDate = new Date(start_date);
      let lastDate = null;

      for (let i = 0; i < 365 && currentLessons < requiredLessons; i++) { // 최대 1년 제한
        const currentDay = daysOfWeek[currentDate.getDay()];
        if (lessonDays.includes(currentDay)) {
          currentLessons++;
          if (currentLessons === requiredLessons) {
            lastDate = new Date(currentDate);
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (lastDate) {
        this.formData.last_date = lastDate.toISOString().split('T')[0];
        console.log('최종 종료일:', this.formData.last_date);
      } else {
        console.error('Failed to calculate last date');
      }
      return lessonDays;
    },//updateLastDate

    submitEnrollment() {
      // 폼 제출 시 로직 처리
      // let lessonDays = [];
      // this.formData.lesson_days_arry.forEach(day=>{
      //   lessonDays.push(day.value);
      // })

      this.formData.lesson_days = this.formData.lesson_days_arr.map(day=>day).join(', ');
      this.updateLastDate();
      console.log('서버 보내기전 this.formData>>>', this.formData);
      const formDataWithoLessonDaysArr= {...this.formData};
      delete formDataWithoLessonDaysArr.lesson_days_arr;
      axios.post('http://localhost:8080/insertEnrollment', formDataWithoLessonDaysArr)
        .then(({data})=>{
          console.log('insertEnrollment data >>>', data);
        })

      console.log('this.formData >>>', this.formData);
    },


    getDateOptions() {
      const today = new Date();
      const dateOptions = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        dateOptions.push({ label: dateString, value: dateString });
      }
      return dateOptions;
    },

    matchLessonDaysAndLessonFrequency(val){
      if(this.formData.lesson_frequency != val.length){
        alert('not match')
        return `수업 횟수(${lessonFrequency})와 선택된 요일 수(${daysCount})가 일치하지 않습니다`;
      }
      return true;
    }
  }
};
</script>

<style scoped>
.q-page {
  max-width: 600px;
  margin: 0 auto;
}

.q-form {
  max-width: 500px;
}

.full-width {
  width: 100%;
}
.pronunciation_advice_yn.q-field--with-bottom {
  padding-bottom: 0 !important;
}
</style>
