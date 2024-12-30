<template>
  <q-page class="q-pa-md">
    <q-card>
      <div class="calendar-container">
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
          @eventClick="handleEventClick"
        />
      </div>
    </q-card>
      <br/>


      <div>
        <!-- LecturerScheduleDetail.vue  -->
        <LecturerScheduleDetail
          @update-event="updateEventData"
          :eventData="selectedEvent"
        />
      </div>


  </q-page>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"; // FullCalendar Core
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인
import LecturerScheduleDetail from "pages/LecturerScheduleDetail.vue";
import axios from "axios";

export default {
  components: {
    FullCalendar,
    LecturerScheduleDetail
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'en',
        events: [],  // 빈 배열로 초기화
        height: 500,
        expandRows: true,
        eventClick:this.handleEventClick
      },
      selectedEvent: null, // 선택된 이벤트 저장
      updatedData:[]
    };
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

    getAllLessons(){
    const getLocalStorageData = localStorage.getItem('loginLecturerInfo');
      const payload = {
        lecturer_id : JSON.parse(getLocalStorageData).lecturer_id
      };
      axios.post('http://localhost:8080/getAllLessonSchedulesByLecturerId', payload)
        .then(({data})=>{
          console.log('캘린더 res>>>', data);
          // 서버에서 받은 데이터를 FullCalendar 형식에 맞게 설정
          const events = data.map(event => ({
            title: event.name, // 이벤트 제목
            start: `${event.lesson_date}T${event.lesson_time}`,  // 시작 시간
            extendedProps: { // 여기 필드는 캘린더에 안 보임. 위 필드만 보임.
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
          }));
          this.calendarOptions.events = events;
          console.log('this.calendarOptions.events >>>', this.calendarOptions.events);
        })
    },
    handleEventClick(info) {
      console.log('Clicked on date:', info.dateStr); // 클릭한 날짜 확인

      // 클릭한 이벤트의 데이터 추출
      const eventData = {
        title: info.event.name,
        start: info.event.start.toISOString(),
        member_id: info.event.extendedProps.member_id,
        lecturer_id: info.event.extendedProps.lecturer_id,
        schedule_id:info.event.extendedProps.schedule_id,
        enroll_id:info.event.extendedProps.enroll_id,
        subject_name:info.event.extendedProps.subject_name,
        lesson_fee: info.event.extendedProps.lesson_fee,
        start_time: info.event.extendedProps.start_time,
        lesson_end_time: info.event.extendedProps.lesson_end_time,
        start_date: info.event.extendedProps.start_date,
        name: info.event.extendedProps.name,
        pronunciation: info.event.extendedProps.pronunciation,
        grammar:info.event.extendedProps.grammar,
        expression:info.event.extendedProps.expression,
        lecturer_evaluation:info.event.extendedProps.lecturer_evaluation,
        comments:info.event.extendedProps.comments,
        attend_yn:info.event.extendedProps.attend_yn,
        class_delay_yn:info.event.extendedProps.class_delay_yn,
        class_delay_lecturer_yn:info.event.extendedProps.class_delay_lecturer_yn,
        added_by_delay:info.event.extendedProps.added_by_delay,
        holiday_yn:info.event.extendedProps.holiday_yn,
        lecturer_cancel_yn:info.event.extendedProps.lecturer_cancel_yn,
        lecturer_sub_name:info.event.extendedProps.lecturer_sub_name,
        lecturer_sub_name_requested:info.event.extendedProps.lecturer_sub_name_requested,
        lecturer_sub_lecturer_id:info.event.extendedProps.lecturer_sub_lecturer_id,
        lecturer_sub_user_id:info.event.extendedProps.lecturer_sub_user_id,
        lecturer_cancel_reason:info.event.extendedProps.lecturer_cancel_reason,
        lecturer_cancel_status:info.event.extendedProps.lecturer_cancel_status,
        class_status:info.event.extendedProps.class_status,
        audioFileUrl:info.event.extendedProps.audioFileUrl,
        pronunciation_advice_yn:info.event.extendedProps.pronunciation_advice_yn
      };

      // 이벤트 추가 후 캘린더를 리프레시하여 새로 추가된 이벤트가 보이게 함
      //this.$refs.fullCalendar.getApi().addEvent(eventData);

      this.selectedEvent = eventData;
      console.log('this.selectedEvent >>>', this.selectedEvent);
    },

    updateEventData(updateData){ //자식에서 수정후 부모에서 emit받은 것.
      console.log('자식에서 수정후 부모에서 emit받은 것. >>>', updateData); // title:newReading
      // this.initialEvents = {...this.initialEvents, ...updateData};
      // console.log('pronunciationRating >>>', this.initialEvents[1].pronunciationRating);
      //자식에서 emit하고, 바로 위에서 업데한 것으로, 서버에 insert? update?

      console.log('updateData.schedule_id >>>', updateData.schedule_id);
      if (this.selectedEvent && this.selectedEvent.schedule_id === updateData.schedule_id) {
        this.selectedEvent = { ...this.selectedEvent, ...updateData };
      }
      // 바로 위처럼후에, FullCalendar에서 이벤트 업데이트
      //const calendarApi = this.$refs.fullCalendar.getApi(); // FullCalendar 인스턴스 가져오기

      // FullCalendar에서 이벤트 업데이트
      const calendarApi = this.$refs.fullCalendar.getApi(); // FullCalendar 인스턴스 가져오기

      // 캘린더에 있는 기존 이벤트들을 가져옴
      const currentEvents = calendarApi.getEvents();
      // 수정된 이벤트와 일치하는 이벤트를 찾고, 해당 이벤트를 수정
      const updatedEvent = currentEvents.find(event => event.extendedProps.schedule_id === this.selectedEvent.schedule_id);

      if (updatedEvent) {
        // 기존 원래 달력의 이벤트를 수정
        //updatedEvent.setProp('title', this.selectedEvent.title);
        updatedEvent.setProp('title', this.selectedEvent.name);
        updatedEvent.setExtendedProp('pronunciation', this.selectedEvent.pronunciation);
        updatedEvent.setExtendedProp('grammar', this.selectedEvent.grammar);
        updatedEvent.setExtendedProp('expression', this.selectedEvent.expression);
        updatedEvent.setExtendedProp('lecturer_evaluation', this.selectedEvent.lecturer_evaluation);
        updatedEvent.setExtendedProp('comments', this.selectedEvent.comments);
        updatedEvent.setExtendedProp('subject_name', this.selectedEvent.subject_name);
        updatedEvent.setStart(this.selectedEvent.start);
        updatedEvent.setExtendedProp('audioFileUrl', this.selectedEvent.audioFileUrl);

        this.updateSchedule();
      }
    },

    updateSchedule(){ // 업데이트된 이벤트를 db에 업데이트.
      const updatePayload = {
        schedule_id: this.selectedEvent.schedule_id, // 서버에서 이벤트를 식별하는 ID
        subject_name: this.selectedEvent.subject_name, // 수정된 제목
        //start: this.selectedEvent.start, // 수정된 시작 시간
        pronunciation: this.selectedEvent.pronunciation, // 발음 평가
        grammar: this.selectedEvent.grammar, // 문법 평가
        expression: this.selectedEvent.expression, // 표현력 평가
        lecturer_evaluation: this.selectedEvent.lecturer_evaluation, // 강사 평가
        comments: this.selectedEvent.comments,
        attend_yn:this.selectedEvent.attend_yn,
        // lecturer_cancel_yn:this.selectedEvent.lecturer_cancel_yn,
        // lecturer_sub_name:this.selectedEvent.lecturer_sub_name,
        // lecturer_sub_user_id:this.selectedEvent.lecturer_sub_user_id,
        // lecturer_cancel_status:this.selectedEvent.lecturer_cancel_status,
        audioFileUrl:this.selectedEvent.audioFileUrl
      };

      console.log('부모 emit받은후  audioFileUrl>>>', this.selectedEvent.audioFileUrl); // null
      axios.post('http://localhost:8080/updateSchedule', updatePayload)
        .then(res=>{
          console.log('updateSchedule res >>>', res);
        })
        .catch(error => {
          console.error('업데이트 실패:', error.response || error.message);
        });
    }
  },
};
</script>

<style>
.q-card {
  max-width: 1200px;
  margin: 16px;
}
.calendar-container {
  height: 500px; /* 캘린더 높이 고정 */
  width: 100%; /* 가로 폭 자동 조정 */
  max-width: 100%; /* 부모 요소를 넘어가지 않도록 제한 */
}
</style>
