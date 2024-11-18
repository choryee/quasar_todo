<template>
  <q-page class="q-pa-md">
    <div class="calendar-container">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        @dateClick="handleDateClick"
      />
    </div>
    <div>
      <LecturerTable />
    </div>

    <!-- calendarOptions.events를 화면에 출력 -->
    <div>
      <h3>Current Events:</h3>
      <!-- v-for을 사용해 events 배열 항목을 순회하며 출력 -->
      <ul>
        <li v-for="(event, index) in calendarOptions.events" :key="index">
          {{ event.title }} - {{ event.start }}
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"; // FullCalendar Core
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인
import LecturerTable from "pages/LecturerTable";

export default {
  components: {
    FullCalendar,
    LecturerTable
  },
  data() {
    return {
      // 초기 이벤트 데이터
      initialEvents: [
        {
          title: 'Math Class - John Doe',
          start: '2024-11-19T10:00:00',
          studentName: 'John Doe',
          classTitle: 'Math 101',
        },
        {
          title: 'History Class - Jane Smith',
          start: '2024-11-19T14:00:00',
          studentName: 'Jane Smith',
          classTitle: 'History 201',
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
      ],

      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'en',
        events: [],  // 빈 배열로 초기화
        height: 500,
        expandRows: true,
        dateClick:this.handleDateClick
      }
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
    handleDateClick(info) {
      console.log('Clicked on date:', info.dateStr); // 클릭한 날짜 확인

      // 이벤트를 events 배열에 추가
      const newEvent = {
        title: 'New Event',
        start: info.dateStr,
        end: info.dateStr, // 시작과 끝 날짜 동일하게 설정
      };

      // 이벤트 추가 후 캘린더를 리프레시하여 새로 추가된 이벤트가 보이게 함
      this.$refs.fullCalendar.getApi().addEvent(newEvent);
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
