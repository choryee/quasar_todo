<template>
  <div>
    <div>
      <!-- 학생 정보를 보여주는 섹션 -->
      <StudentInfo :studentData="studentData"/>
    </div>
      <br />

    <div>
        <div class="calendar-container">
          <FullCalendar
            ref="fullCalendar"
            :options="calendarOptions"
          />
        </div>
        <br/>
    </div>

        <div>
          <!-- 탭 섹션 -->
          <q-tabs
            v-model="currentTab"
            class="text-primary"
            align="justify"
            dense
            active-color="blue"
            indicator-color="green"
          >
            <q-tab name="daily" label="Daily Feedback" icon="today" />
            <q-tab name="monthly" label="Monthly Feedback" icon="date_range" />
          </q-tabs>

          <!-- 탭 내용 -->
          <q-tab-panels v-model="currentTab" animated>
            <q-tab-panel name="daily">
              <DailyFeedback />
            </q-tab-panel>
            <q-tab-panel name="monthly">
              <MonthlyFeedback />
            </q-tab-panel>
          </q-tab-panels>
        </div>
  </div>

</template>

<script>
import FullCalendar from "@fullcalendar/vue"; // FullCalendar Core
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인
import LecturerScheduleDetail from "pages/LecturerScheduleDetail.vue";
import DailyFeedback from "pages/DailyFeedback.vue";
import MonthlyFeedback from "pages/MonthlyFeedback.vue";
import axios from "axios";
import {QBtn} from "quasar";
import StudentInfo from "pages/StudentInfo.vue";

export default {
  components: {
    FullCalendar,
    LecturerScheduleDetail,
    DailyFeedback,
    MonthlyFeedback,
    QBtn, // Quasar 버튼 컴포넌트 등록
    StudentInfo,
  },

  data() {
    return {
      studentData:null,
      currentTab: 'daily', // 기본 탭 설정
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'en',
        events: [],  // 빈 배열로 초기화
        height: "auto",
        expandRows: true,
        eventClick:this.handleEventClick,
        eventDidMount: this.handleEventRendering,  // 이벤트 렌더링 시 버튼 추가
      },
      selectedEvent: null, // 선택된 이벤트 저장
      showPostponeButton: false, // 버튼 표시 여부
    };
  },
  async created(){
    try {
      const loginUserInfo = JSON.parse(localStorage.getItem('loginUserInfo'));
      const user_id = loginUserInfo.user_id;
      const member_id = loginUserInfo.member_id;
      await this.$store.dispatch('fetchStudentById', user_id);
      this.studentData = this.$store.state.getStudentById;
      //await this.$store.dispatch('fetchAllLessonSchedulesByMemberId', member_id)

    } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
    }

  },
  watch: {
    // calendarOptions.events 값이 변경될 때마다 갱신
    'calendarOptions.events': function() {
      console.log('Events updated:', this.calendarOptions.events);
    }
  },
  mounted() {
    // 초기 이벤트를 calendarOptions에 설정
    //this.calendarOptions.events = this.initialEvents;
    this.getAllLessons();
  },

  methods: {
    // handleEventClick(info) {
    //   this.selectedEvent = info.event; // 선택된 이벤트 저장
    //   this.showPostponeButton = true;  // 버튼 표시
    // },

    handleEventRendering(info) {
      // 수업 연기 버튼 추가
      this.addPostponeButton(info);
      // 시간에 중간 밑줄 추가
      this.addStrikeThroughToEvent(info);
    },

    addPostponeButton(info) {
      if (info.event.extendedProps.class_delay_yn === 'Y' ||
        info.event.extendedProps.added_by_delay === 'Y' ||
        //info.event.extendedProps.added_by_delay === 'Y admin' ||
        info.event.extendedProps.class_delay_lecturer_yn === 'Y'

      ) {
        return; // 연기된 수업은 버튼을 추가하지 않음
      }

      const postponeButton = document.createElement('button');
      postponeButton.textContent = '수업연기';
      postponeButton.className = 'postpone-btn';
      if(info.event.extendedProps.added_by_delay === 'Y admin' ){
        postponeButton.textContent = '추가수업';
        postponeButton.style.backgroundColor = 'red';
        // postponeButton.className = 'postpone-btn';
        // info.el.appendChild(postponeButton);
        // return;
      }
      if(info.event.extendedProps.added_by_delay !== 'Y admin'){
        postponeButton.addEventListener('click', (event) => {
          event.stopPropagation(); // 클릭 시 이벤트 전파를 막음
          this.postponeLesson(info, postponeButton);
        });
      }

      info.el.appendChild(postponeButton);

      // 브라우저의 너비 가져오기
      const screenWidth = window.innerWidth; // 또는 document.documentElement.clientWidth
      console.log('새로운 화면 크기 >>', screenWidth);

      // 화면 크기 변경 감지하기
      window.addEventListener('resize', function() {
        const newWidth = window.innerWidth; // 화면 크기 변화 감지
        console.log('새로운 화면 크기:', newWidth);
      });

    },


    addStrikeThroughToEvent(info) {
      if (info.event.start && info.event.extendedProps.class_delay_yn === 'Y' ||
        info.event.start && info.event.extendedProps.class_delay_lecturer_yn === 'Y'
      ) {
        const timeElement = info.el.querySelector('.fc-event-time');
        if (timeElement) {
          //timeElement.style.textDecoration = 'line-through';

          // 기존 스타일을 초기화하고 사용자 지정 스타일 추가
          timeElement.style.position = 'relative'; // 부모 요소를 기준으로 위치 설정
          timeElement.style.textDecoration = 'none'; // 기존 밑줄 제거

          // 두 줄 밑줄 효과 추가
          const underline = document.createElement('div');
          underline.style.position = 'absolute';
          underline.style.bottom = '50%'; // 텍스트 중간 기준
          underline.style.left = '0';
          underline.style.width = '100%';
          underline.style.borderBottom = '1.8px solid black'; // 첫 번째 줄
          underline.style.borderTop = '1.8px solid black'; // 두 번째 줄
          underline.style.height = '4px'; // 두 줄 간격을 조정
          timeElement.appendChild(underline);
        }
      }
    },

    postponeLesson(info, postponeButton) {
      // 수업 연기 횟수 조회.
      axios.get('http://localhost:8080/classDelayCount', {
        params:{
          enroll_id : info.event.extendedProps.enroll_id,
          member_id :info.event.extendedProps.member_id,
          schedule_id : info.event.extendedProps.schedule_id
        }
     })
     .then(({data})=>{
          console.log('classDelayCount data >>>', data);
          if(data === '수업연기횟수초과') {
            this.$q.dialog({
              title: 'NOTICE',
              message: '수강연기 횟수 초과로 수강연기가 불가합니다.',
              ok: {
                label: '확인',
                color: 'warning', // 확인 버튼 스타일
              },
            });
            return;
          }else if(data === '수강변경시간초과'){
            this.$q.dialog({
              title: 'NOTICE',
              message: '수강 연기 신청 시간이 초과 되었습니다. 연기 신청은 수업 시작 3시간 전까지 가능합니다.',
              ok: {
                label: '확인',
                color: 'warning', // 확인 버튼 스타일
              },
            });
            return;
          }else {
               // 학생이 수업 연기 요청 서버 호출
                axios.post('http://localhost:8080/postponeLesson', {
                  schedule_id: info.event.extendedProps.schedule_id,
                  member_id: info.event.extendedProps.member_id,
                  enroll_id:info.event.extendedProps.enroll_id,
                  lecturer_id:info.event.extendedProps.lecturer_id,
                  subject_name:info.event.extendedProps.subject_name,
                  lesson_fee : info.event.extendedProps.lesson_fee,
                  lesson_end_time: info.event.extendedProps.lesson_end_time,
                  // 아래.학생 첨 캘린더 뿌릴때,포함된것. 아래는, 대체수업을 다시 수업연기시, 새로운 행에 그냥 표시위해.
                  lecturer_sub_name : info.event.extendedProps.lecturer_sub_name,
                  lecturer_sub_name_requested : info.event.extendedProps.lecturer_sub_name_requested,
                  lecturer_sub_lecturer_id  : info.event.extendedProps.lecturer_sub_lecturer_id ,
                  lecturer_sub_user_id : info.event.extendedProps.lecturer_sub_user_id,
                  lecturer_cancel_reason : info.event.extendedProps.lecturer_cancel_reason,
                  lecturer_cancel_yn : info.event.extendedProps.lecturer_cancel_yn,

                })
                  .then(res => {
                    this.$q.dialog({
                      title: 'NOTICE',
                      message: '수업 연기가 완료되었습니다.',
                      ok: {
                        label: '확인',
                        color: 'warning', // 확인 버튼 스타일
                      },
                    });

                    // 서버에서 연기 완료 후 FullCalendar 이벤트 업데이트
                    const calendarApi = this.$refs.fullCalendar.getApi();
                    const event = calendarApi.getEventById(info.event.id);  // 해당 이벤트를 찾음
                    console.log('info.event.id >>>', info.event.id);
                    // 밑은 event은 변경된 이벤트임.
                    if (event) {
                      // 이벤트 제목에 "연기됨" 추가
                      event.setProp('title', `${event.title} [연기됨]`);

                      // 글자색을 빨간색으로 설정
                      event.setProp('textColor', 'red');

                      // 색상 변경 (수업 연기된 이벤트 구분)
                      event.setProp('backgroundColor', '#ffcc00');

                      // class_delay_yn 속성 설정 (UI에서 표시되지 않지만 데이터로 처리)
                      event.setExtendedProp('class_delay_yn', 'Y');

                      // 수업 연기 버튼 숨기기 (버튼을 숨김)
                      if (postponeButton) {
                        postponeButton.style.display = 'none';  // 버튼 숨기기
                      }

                      // 중간 밑줄 추가
                      this.addStrikeThroughToEvent({
                        event: info.event,
                        el: info.el,
                      });

                      // 강제로 캘린더 리렌더링. 수업연기된 날짜가 바로 캘린더에 보이게.
                      this.updateCalendarEvents();
                    }
                  }) // then()
                  .catch(error => {
                    console.error('수업 연기 실패:', error.response || error.message);
                  });
          }
          })// 밖
        .catch(err=>{
          console.log('er >>>', err);
        })
    },

    // 강제로 캘린더 이벤트 리렌더링
    updateCalendarEvents() {
      // 서버에서 새로운 데이터를 가져오거나 기존 이벤트 데이터를 갱신
      this.getAllLessons();

    },

    async getAllLessons() {
      const loginUserInfo = JSON.parse(localStorage.getItem('loginUserInfo'));
      const member_id = loginUserInfo.member_id;

      await axios.get(`http://localhost:8080/getAllLessonSchedulesByMemberId/${member_id}`)
        .then(({data})=>{
          console.log('캘린더 data>>>', data);

          // 서버에서 받은 데이터를 FullCalendar 형식에 맞게 설정
          const events = data.map(event => {
            let eventTitle;

            // class_delay_yn이 'Y'이면 '수업연기'로 설정
            if (event.class_delay_yn === 'Y' || event.class_delay_lecturer_yn === 'Y') {
              eventTitle = '[연기됨]';
            } else {
              eventTitle = event.name ? event.name : '기타';
            }

            console.log('Event title:', eventTitle); // 디버깅: 제목이 제대로 설정되는지 확인

            return {
              id: event.schedule_id, // 고유 id
              title: eventTitle,      // 수정된 제목
              start: `${event.lesson_date}T${event.lesson_time}`, // 시작 시간
              extendedProps: {
                schedule_id: event.schedule_id,
                lecturer_id: event.lecturer_id,
                enroll_id: event.enroll_id,
                member_id: event.member_id,
                subject_name: event.subject_name,
                lesson_fee:event.lesson_fee,
                start_time: event.lesson_time,
                lesson_end_time:event.lesson_end_time,
                start_date: event.lesson_date,
                name: event.name,
                pronunciation:event.pronunciation,
                grammar:event.grammar,
                expression:event.expression,
                lecturer_evaluation:event.lecturer_evaluation,
                comments:event.comments,
                attend_yn:event.attend_yn,
                class_delay_yn:event.class_delay_yn,
                class_delay_lecturer_yn:event.class_delay_lecturer_yn,
                added_by_delay: event.added_by_delay,
                holiday_yn:event.holiday_yn,
                lecturer_cancel_yn:event.lecturer_cancel_yn,
                lecturer_sub_name:event.lecturer_sub_name,
                lecturer_sub_name_requested:event.lecturer_sub_name_requested,
                lecturer_sub_lecturer_id:event.lecturer_sub_lecturer_id,
                lecturer_sub_user_id:event.lecturer_sub_user_id,
                lecturer_cancel_reason:event.lecturer_cancel_reason,
                lecturer_cancel_status:event.lecturer_cancel_status,
                class_status:event.class_status,
                audioFileUrl:event.audioFileUrl,
                pronunciation_advice_yn: event.pronunciation_advice_yn
              }
            };
          }); //map

          this.calendarOptions.events = events;
          console.log('this.calendarOptions.events >>>', this.calendarOptions.events);
        })

    }//getAllLessons

  },
};
</script>

<style>
/* 공통 스타일 */
.calendar-container {
  height: auto;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 30px; /* 기존에 있을 수 있는 패딩 제거 */
}

/* 반응형 학생 정보 섹션 */
.student-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px; /* 요소 간 간격 추가 */
}

.student-img {
  max-width: 150px;
  height: auto;
  border-radius: 8px;
}

/* 반응형 캘린더 섹션 */
.calendar-wrapper {
  padding: 16px;
}

/* 768px 미디어 쿼리로 반응형 스타일 정의 */
@media (max-width: 768px) {
  .student-info {
    flex-direction: column; /* 세로 배치 */
    text-align: center;    /* 텍스트 중앙 정렬 */
  }

  .student-img {
    max-width: 100px;
  }

  .calendar-container {
    height: 400px; /* 작은 화면에서 캘린더 높이 조정 */
  }

  .postpone-btn {
    font-size: 12px;
    padding: 2px 30px;
    bottom: -25px;
  }
}

/* 480px 미디어 쿼리로 반응형 스타일 정의 */
@media (max-width: 480px) {
  .calendar-container {
    height: 300px; /* 더 작은 화면에서 캘린더 높이 조정 */
  }
  .postpone-btn {
    font-size: 8px;
    padding: 2px 2px;
    bottom: -15px;
    position: relative; /* 위치 변경을 위한 상대 위치 설정 */
    left: -50px; /* 왼쪽으로 30px 이동 */
    width: 80px; /* 버튼 너비를 설정하여 크기 조정 */
    height: 20px; /* 버튼 높이도 설정하여 크기 조정 */
  }
}

/* 기본 버튼 스타일 */
.postpone-btn {
  display: inline-block;
 /* padding: 5px 10px; */
  font-size: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; /* 버튼 위치 */
  z-index: 10;
}
</style>
