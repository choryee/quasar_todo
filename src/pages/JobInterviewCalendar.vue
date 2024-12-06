<template>
  <div>
    <q-page padding>
      <h5>Schedule Your Interview</h5>
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        @dateClick="onDateClick"
      />
      <q-card v-if="availableTimes.length > 0" class="q-mt-md">
        <q-card-section>
          <h3>Select a Time</h3>
          <q-list bordered>
            <q-item
              v-for="time in availableTimes"
              :key="time"
              clickable
              @click="selectTime(time)"
            >
              <q-item-section>{{ time }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"; // FullCalendar Core
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인
import axios from "axios";

export default {
  components: {
    FullCalendar,
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
      availableTimes: [], // 선택한 날짜의 가능한 시간들
      selectedDate: null, // 선택된 날짜
    };
  },
  methods: {
    onDateClick(info) {
      this.selectedDate = info.dateStr; // FullCalendar에서 제공하는 선택된 날짜
      this.fetchAvailableTimes(this.selectedDate);
    },
    getAllJobInterviewTimes(){
      axios.get('http://localhost:8080')
    },
    fetchAvailableTimes(date) {
      // API 호출하여 선택된 날짜의 가능한 시간을 가져오기
      axios
        .get(`/api/interview-times?date=${date}`)
        .then((response) => {
          this.availableTimes = response.data.times || [];
        })
        .catch((error) => {
          console.error("Error fetching times:", error);
          this.availableTimes = [];
        });
    },
    selectTime(time) {
      // 선택한 시간으로 인터뷰 예약
      axios
        .post("/api/schedule-interview", {
          date: this.selectedDate,
          time,
        })
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: `Interview scheduled for ${this.selectedDate} at ${time}`,
          });
          this.$router.push("/lecturer-main"); // 원래 페이지로 이동
        })
        .catch((error) => {
          console.error("Error scheduling interview:", error);
          this.$q.notify({
            type: "negative",
            message: "Failed to schedule interview. Please try again later.",
          });
        });
    },
  },
};
</script>
