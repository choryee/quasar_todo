<template>
<!--  <q-page class="q-pa-lg-lg">-->
<!--    <h5 class="q-mt-none">Help</h5>-->
<!--    <p>Lorem ipsum dolor sit amet</p>-->
<!--    <p>Lorem ipsum dolor sit amet</p>-->
<!--  </q-page>-->

  <q-page class="q-pa-md" >
<!--    <full-calendar-->
<!--      :plugins="[dayGridPlugin, interactionPlugin]"-->
<!--      :initial-view="'dayGridMonth'"-->
<!--      :events="calendarEvents"-->
<!--      @date-click="handleDateClick"-->
<!--    />-->
    <div class="container-fluid px-4"  >
      <FullCalendar
        :options="calendarOptions"
        :height="300"  />
    </div>
  </q-page>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'; // FullCalendar Vue 구성 요소
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'ko',
        events: []

      },

    }
  },
  methods: {
    // handleDateClick(info) {
    //   console.log('Clicked on date:', info.dateStr);
    //   this.calendarEvents.push({
    //     title: 'New Event',
    //     start: info.dateStr,
    //   });
    // },
  },
};
</script>


