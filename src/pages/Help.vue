<template>
  <q-page class="q-pa-md">
    <div class="calendar-container">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        @eventClick="handleEventClick"
      />
    </div>
    <br/>
    <div>
      <!-- 신규 -->
      <!-- -->
      <NewStudentForLecturer/>
    </div>
    <br/>
    <div>
      <!-- All my students list -->
      <AllStudentForLecturer/>
    </div>
    <br/>
    <div>
      <EnrolledStudentForLecturer @update-event="updateEventData" :eventData="selectedEvent"/>
    </div>
  </q-page>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"; // FullCalendar Core
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인
import EnrolledStudentForLecturer from "pages/EnrolledStudentForLecturer.vue";
import NewStudentForLecturer from "pages/NewStudentForLecturer.vue";
import AllStudentForLecturer from "pages/AllStudentForLecturer.vue";

export default {
  components: {
    FullCalendar,
    NewStudentForLecturer,
    EnrolledStudentForLecturer,
    AllStudentForLecturer
  },
  data() {
    return {
      selectedEvent: null, // 선택된 이벤트 저장
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'en',
        events: [],  // 빈 배열로 초기화
        height: 500,
        expandRows: true,
        eventClick:this.handleEventClick
      },
      // 초기 이벤트 데이터
      initialEvents: [
        {
          title: 'John Doe- Math',
          start: '2024-11-19T10:30:00',
          studentName: 'John Doe',
          classTitle: 'Math 101',
          pronunciationRating:0,
          comment:'aaa'
        },
        {
          title: 'History Class - Jane Smith',
          start: '2024-11-19T14:00:00',
          studentName: 'Jane Smith',
          classTitle: 'History 201',
          pronunciationRating:0,
          comment:'bbb'
        },
        {
          title: 'Science Class - Michael Lee',
          start: '2024-11-21T08:00:00',
          studentName: 'Michael Lee',
          classTitle: 'Science 301',
        },
        {
          title: 'English Class - Emily Davis',
          start: '2024-11-22T09:00:00',
          studentName: 'Emily Davis',
          classTitle: 'English 101',
        }
      ]
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
    this.calendarOptions.events = this.initialEvents;
  },
  methods: {
    handleEventClick(info) {
      console.log('Clicked on date:', info.dateStr); // 클릭한 날짜 확인

      // 클릭한 이벤트의 데이터 추출
      const eventData = {
        title: info.event.title,
        start: info.event.start.toISOString(),
        description: info.event.extendedProps.description || 'No description',
        studentName: info.event.extendedProps.studentName,
        classTitle: info.event.extendedProps.classTitle,
        pronunciationRating:info.event.extendedProps.pronunciationRating,
        comment:info.event.extendedProps.comment
      };

      // 이벤트 추가 후 캘린더를 리프레시하여 새로 추가된 이벤트가 보이게 함
      //this.$refs.fullCalendar.getApi().addEvent(eventData);

      this.selectedEvent = eventData;
      console.log('eventData >>>', eventData);
    },
    updateEventData(updateData){
      console.log('자식에서 수정후 부모에서 emit받은 것. >>>', updateData);
      // this.initialEvents = {...this.initialEvents, ...updateData};
      // console.log('pronunciationRating >>>', this.initialEvents[1].pronunciationRating);
      //자식에서 emit하고, 바로 위에서 업데한 것으로, 서버에 insert? update?

      console.log('updateData.studentName >>>', updateData.studentName);
      this.initialEvents = this.initialEvents.map(event =>
        event.studentName === updateData.studentName ? {...event, ...updateData} : event
      );
      // 바로 처럼후에, FullCalendar에서 이벤트 업데이트
      const calendarApi = this.$refs.fullCalendar.getApi(); // FullCalendar 인스턴스 가져오기
      calendarApi.removeAllEvents(); // 기존 이벤트 제거
      calendarApi.addEventSource(this.initialEvents); // 새 이벤트 추가

    }
  },
};
</script>

<style>
.calendar-container {
  height: 500px; /* 캘린더 높이 고정 */
  width: 100%; /* 가로 폭 자동 조정 */
  max-width: 100%; /* 부모 요소를 넘어가지 않도록 제한 */
}
</style>
