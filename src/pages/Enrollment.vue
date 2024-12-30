<template>
  <q-page padding>
    <q-card>
    <div class="q-pa-md">
      <div class="q-gutter-md">
        <!-- 과목명 선택 -->
        <q-select
          v-model="formData.subject_name"
          label="과목명을 선택하세요"
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

        <!-- 수업 방법 -->
        <q-select
          v-model="formData.lesson_method"
          label="수업 방법을 선택하세요"
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
          label="수업 기간을 선택하세요"
          :options="[
            { label: '1개월', value: 1 },
            { label: '3개월', value: 3 },
            { label: '6개월', value: 6 }
          ]"
          :rules="[val => !!val || '수업 기간을 선택하세요']"
          dense
          emit-value
        />

        <!-- 발음지도 -->
        <div class="q-pa-none" v-if="formData.lesson_period === 3 ||formData.lesson_period === 6 ">
          <q-select
            v-model="formData.pronunciation_advice_yn"
            label="영어발음전문가의 1회 무료 발음 조언 받으시겠습니까?"
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

        <!-- 수업횟수 -->
        <q-select
          v-model="formData.lesson_frequency"
          label="수업 횟수을 선택하세요"
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
          label="수업 시간을 선택하세요"
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
         matchLessonDaysAndLessonFrequency 함수를 :rules 속성에 맞게 작성하고 사용하려면,
         이 함수는 반드시 값을 반환해야 합니다.
         :rules 내에서 사용되는 함수는 true(유효) 또는 오류 메시지(무효)를 반환해야 합니다.
         -->
        <q-select
          v-model="formData.lesson_days_arr"
          label="<중복 클릭 가능> 수업 요일을 선택하세요."
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
          :rules="[
                val => {
                  return val.length > 0 || '수업 요일을 선택하세요';
                },
                matchLessonDaysAndLessonFrequency
              ]"
          dense
          emit-value
        />

        <!-- 시작일 -->
        <q-input
          v-model="formData.start_date"
          label="시작일을 선택하세요"
          type="date"
          :rules="[val => !!val || '시작일을 선택하세요']"
          dense
        />


        <!-- 시작 시간 -->
        <q-select
          v-model="formData.start_time"
          label="시작 시간을 선택하세요"
          :options="timeOptions"
          :rules="[val => !!val || '시작 시간을 선택하세요']"
          dense
          emit-value
        />

        <!-- Skype 아이디 -->
        <q-input
          label="(선택) Skype ID(아이디)을 입력하세요"
          v-model="formData.skype_id"  dense />

        <!-- 특이 요청 사항 -->
        <q-input v-model="formData.special_requests" label="(선택) 특이 요청 사항" type="textarea" dense />


        <!-- 제출 버튼 -->
        <q-btn label="결제후 등록하기" color="primary"  @click="showPaymentModal" class="full-width" />
      </div>
      </div>
    </q-card>

    <!-- Payment Modal -->
    <q-dialog v-model="formData.isPaymentModalOpen" >
      <q-card style="min-width: 500px; max-height: 60vh; ">


        <q-card-section>
          <Payment :formData="formData" @close="formData.isPaymentModalOpen = false" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="닫기" color="negative" @click="formData.isPaymentModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {date} from "quasar";
import axios from "axios";
import Payment from "pages/Payment.vue";
import {calculateDiscountedFeeWithPeriod} from "src/services/discountService";

export default {
  components:{Payment},
  data() {
    return {
      formData: {
        member_id : null, // TODO 변경해야.
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
        last_date: null,
        lesson_amount: 0,
        isPaymentModalOpen: false, // 결제 모달 표시 상태
        lesson_amount_discount : 0,
        lesson_discount_rate : 0,
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

  async created() {  // 이렇게 해야, this.$store.state.discountAllInfo 했을때, undefined안 나온다. 241213
    const loginUserInfo = JSON.parse(localStorage.getItem('loginUserInfo'));
    const member_id = loginUserInfo.member_id;
    this.formData.member_id = member_id;
    try {
      await this.$store.dispatch("fetchAllDiscountInfo");
      await this.$store.dispatch("fetchFeeInfo");
      await this.$store.dispatch('fetchEnrollmentCountByMemberId', member_id);
    } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
    }
  },


  methods: {

    async showPaymentModal() {
      this.formData.isPaymentModalOpen = true;
      this.calculateDiscountThis();
      //this.submitEnrollment();
    }, // showPaymentModal

    calculateDiscountThis() {
      const registerCount = this.$store.state.countEnrollmentByMemberId;
      const monthsBetween = this.formData.lesson_period;
      let isSixMonth = false;
      if(monthsBetween === 6){
        isSixMonth = true;
      }
      let isFirstEnrollment = false;
      if(registerCount === 0){
        isSixMonth = true;
      }

      console.log('registerCount >>>', registerCount);
      console.log('monthsBetween >>>', monthsBetween);

      /*
      * 아래 모든 조건에서는 그냥 this.formData.xxx를 변경/구하기만 해서,
      * 등록버튼 누르면서, 저장하게 하는 것.241215
      * 업데해야 할것.
      *  lesson_amount_discount, lesson_discount_rate,
      * lesson_amount, last_date <--이 둘은 calculateLastDateAndLessonAmount()여기에 있음.
      * this.applyDiscountWithPeriod(); <-- 기간할인혜택은 그 기간에 "오늘"이 있으면 됨. 그 기간에 수업시작이 아니고.
      * */
      // 조건 1: 첫 등록 + 6개월 경과 등록 → 첫 등록 할인
      if (isFirstEnrollment && isSixMonth) {
        console.log('조건 1: >>>', );

        this.calculateLastDateAndLessonAmount();
        this.TenPercentDiscountFirstEnrollment();
        // 첫등록, 기간, 6개월중 비교해야. 가장 큰 것 적용하기.
        //기간할인혜택은 그 기간에 "오늘"이 있으면 됨. 그 기간에 수업시작이 아니고
        this.applyDiscountWithPeriod(isFirstEnrollment, isSixMonth);
      }
      // 조건 2: 2회 이상 등록 + 6개월 경과 등록 → 6개월 등록 할인
      else if (!isFirstEnrollment && isSixMonth) {
        console.log('조건 2: >>>', );

        this.calculateLastDateAndLessonAmount();
        this.TenPercentDiscountSixMonthModified();
        this.applyDiscountWithPeriod(isFirstEnrollment, isSixMonth);
      }
      // 조건 3: 첫 등록 + 6개월 미만 등록 → 첫 등록 할인
      else if (isFirstEnrollment && !isSixMonth) {
        console.log('조건 3: >>>', );

        this.calculateLastDateAndLessonAmount();
        this.TenPercentDiscountFirstEnrollment();
        this.applyDiscountWithPeriod(isFirstEnrollment, isSixMonth);
      }
      // 조건 4: 2회 이상 등록 + 6개월 미만 등록 → 할인 없음
      else if (!isFirstEnrollment&& !isSixMonth) {

        console.log('조건 4: >>>', );
        this.calculateLastDateAndLessonAmount();
        this.formData.lesson_discount_rate = 0.0;
        this.formData.lesson_amount_discount = 0;
        this.applyDiscountWithPeriod(isFirstEnrollment, isSixMonth);
      }

      this.submitEnrollment();
    },

    applyDiscountWithPeriod(isFirstEnrollment, isSixMonth){ // 리팩토링한 코드임.
      if(this.isTodayWithinPeriod) {
        const todayDiscount = this.isTodayWithinPeriod();

        let firstDiscount;
        if(isFirstEnrollment){
          firstDiscount = this.filteredDiscountInfo('first enrollment');
        }else {
          firstDiscount = null;
        }

        let sixDiscount;
        if(isSixMonth){
          isSixMonth = this.filteredDiscountInfo('six month');
        }else {
          isSixMonth = null;
        }

        const discount = this.maxDiscountValue(firstDiscount, sixDiscount, todayDiscount);
        const originalFee = this.calculateLastDateAndLessonAmount().result;
        if(discount){
          this.formData.lesson_amount_discount = originalFee * (1 - discount.discount_value / 100);
          this.formData.lesson_discount_rate = discount.discount_value;
        }else {
          this.formData.lesson_discount_rate = 0.0;
          this.formData.lesson_amount_discount = 0;
        }

        // TODO 밑 기간을 사용하고 싶으면, discount테이블의 날짜 변경하라.
        //this.isWithinDiscountPeriod(); // 기간 등록 할인 경우.
      }
    },

    maxDiscountValue(firstDiscount, sixDiscount, todayDiscount) {
      console.log('firstDiscount >>>', firstDiscount);
      console.log('sixDiscount >>>', sixDiscount);
      console.log('todayDiscount >>>', todayDiscount);
      const discounts = [
        { value: firstDiscount && firstDiscount.discount_value ? firstDiscount.discount_value : 0, object: firstDiscount },
        { value: sixDiscount && sixDiscount.discount_value ? sixDiscount.discount_value : 0,       object: sixDiscount },
        { value: todayDiscount && todayDiscount.discount_value ? todayDiscount.discount_value : 0, object: todayDiscount },
      ];
      const maxDiscount = discounts.reduce((max, current) => {
        return current.value > max.value ? current : max;
      }, { value: 0, object: null });
      console.log('maxDiscount.object >>>', maxDiscount.object );
      return maxDiscount.object;
    },

    filteredDiscountInfo(discount_name){ // discount_name으로 그 할인 객체 찾기.
        const discountAllInfo = this.$store.state.discountAllInfo;
        console.log('filteredDiscountInfo discountAllInfo>>>', discountAllInfo);
        const filteredDiscountInfo = discountAllInfo.filter(discount => discount.discount_name === discount_name );
        const [filteredDiscountObject] = filteredDiscountInfo;
      return filteredDiscountObject;
    },

    isTodayWithinPeriod(){
      const discountAllInfo = this.$store.state.discountAllInfo;
      const today = new Date();

      // UTC 시간을 로컬 시간으로 조정
      const offsetInMilliseconds = today.getTimezoneOffset() * 60 * 1000;
      const localTime = new Date(today.getTime() - offsetInMilliseconds);
      // ISO 형식으로 변환 (로컬 시간 기준)
      const formattedToday = localTime.toISOString().replace('T', ' ').slice(0, 19);;

      const filteredDiscountInfo = discountAllInfo.filter(discount => formattedToday >= discount.start_date && formattedToday <= discount.end_date);
      const [filteredDiscountObject] = filteredDiscountInfo;
      return  filteredDiscountObject; // 객체임.
    },

    // 기간내 등록시만 할인시, 할인 금액 구하기.
    // discountedFeeWithPeriod(discount){
    //   // const {start_date, end_date, discount_value} = this.$store.state.discountAllInfo;
    //   // calculatediscountedFeeWithPeriod함수는 discountServie.js에 있다.
    //   //const [discountInfo] = discount; // 배열 구조 분해 할당 한것.
    //   if(discount != null){
    //     this.formData.lesson_amount_discount
    //       = calculateDiscountedFeeWithPeriod(
    //       this.formData.lesson_amount,
    //       discount.start_date,
    //       discount.end_date,
    //       discount.discount_value
    //     );
    //     this.formData.lesson_discount_rate = discount.discount_value;
    //   }else {
    //     this.formData.lesson_amount_discount = 0.0;
    //     this.formData.lesson_discount_rate = 0.0;
    //   }
    // },

    // TenPercentDiscountSixMonth(){
    //   let lesson_period_value = this.formData.lesson_period;
    //   console.log('TenPercentDiscountSixMonth lesson_period_value >>>', lesson_period_value);
    //   const originalFee = this.formData.lesson_amount;
    //   const sixMonthDiscount = this.filteredDiscountInfo('six month'); // 10
    //   if(lesson_period_value === 6){
    //     this.formData.lesson_amount_discount =  originalFee * (1 - sixMonthDiscount.discount_value / 100);
    //     this.formData.lesson_discount_rate = sixMonthDiscount.discount_value;
    //   }
    // },

    TenPercentDiscountSixMonthModified(){
      const originalFee = this.formData.lesson_amount;
      const sixMonthDiscount = this.filteredDiscountInfo('six month'); // 10
      this.formData.lesson_amount_discount =  originalFee * (1 - sixMonthDiscount.discount_value / 100);
      this.formData.lesson_discount_rate = sixMonthDiscount.discount_value;
    },

    TenPercentDiscountFirstEnrollment(){
      const originalFee = this.formData.lesson_amount;
      const firstDiscount = this.filteredDiscountInfo('first enrollment'); // 10
      this.formData.lesson_amount_discount =  originalFee * (1 - firstDiscount.discount_value / 100);
      this.formData.lesson_discount_rate = firstDiscount.discount_value;
    },

    // async isFirstEnrollment(){ // 첫 등록자/6개월등록자.
    //   const member_id = this.formData.member_id;
    //   const originalFee = this.formData.lesson_amount;
    //   try {
    //     await this.$store.dispatch('fetchEnrollmentCountByMemberId', member_id);
    //     const {data} = this.$store.state.countEnrollmentByMemberId;
    //     console.log('isFirstEnrollment count >>>', data );
    //     // data=0이면, 첫 등록자.
    //     return data;
    //   }catch (err){
    //
    //   }
    // },

    calulateLessonAmount(lessonCount){
      // lesson_amount 구하기.
      this.formData.lesson_amount
        = lessonCount *
        this.formData.lesson_duration *  // 10분, 20분...
        this.$store.state.studentFeeInfo.find(fee=> fee.rate_level === 'basic').student_rate;// 225. 이건  lesson테이블에 있다.

      return this.formData.lesson_amount;
    },

    calculateLastDateAndLessonAmount() { // 실제로 select를 선택해야 에러가 안 난다.
      // 여기서는 formData.lesson_amount, formData.last_date 2개 구한다.

      const start_date = this.formData.start_date;
      const lessonDays = this.formData.lesson_days_arr.map(day => day);
      console.log('lessonDays >>>', lessonDays); // ['Mon'. 'Tue']

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let lessonPeriod;
      let lesson_period_value = this.formData.lesson_period;
      if(lesson_period_value === 1){
        lessonPeriod = 4;
      }else if(lesson_period_value === 3){// 3개월*4
        lessonPeriod = 12;
      }else if(lesson_period_value === 6){// 6개월*4
        lessonPeriod = 24;
      }
      const requiredLessons = lessonPeriod * lessonDays.length; // 총 필요한 수업 수

      // lesson_amount계산 함수. 위에 있다.
      const result = this.calulateLessonAmount(requiredLessons);
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

      return {
        lessonDays,
        result
      };
    },//updateLastDate

    submitEnrollment() {
      // 폼 제출 시 로직 처리
      // let lessonDays = [];
      // this.formData.lesson_days_arry.forEach(day=>{
      //   lessonDays.push(day.value);
      // })

      this.formData.lesson_days = this.formData.lesson_days_arr.map(day=>day).join(', ');
      console.log('서버 보내기전 this.formData>>>', this.formData);
      const formDataWithoLessonDaysArr= {...this.formData};
      delete formDataWithoLessonDaysArr.lesson_days_arr;
      delete formDataWithoLessonDaysArr.isPaymentModalOpen;

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


      matchLessonDaysAndLessonFrequency(val) {
        const lessonFrequency = this.formData.lesson_frequency; // 기대 수업 횟수
        const daysCount = val.length; // 선택된 요일 수

        if (lessonFrequency !== daysCount) {
          return `수업 횟수(${lessonFrequency})와 선택된 요일 수(${daysCount})가 일치하지 않습니다.`;
          //return false;
        }
        // 'Sat'와 'Sun'의 조합 유효성 검사
        const includesSat = val.includes('Sat');
        const includesSun = val.includes('Sun');

        if (includesSat && !includesSun) {
          return '토요일(Sat)을 선택한 경우 일요일(Sun)도 선택해야 합니다. 다른 평일 선택 불가.';
        }
        if (!includesSat && includesSun) {
          return '일요일(Sun)을 선택한 경우 토요일(Sat)도 선택해야 합니다. 다른 평일 선택 불가.';
        }

        return true; // 유효성 검사 통과
      },

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
