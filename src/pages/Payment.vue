<template>
  <div>
    <q-page class="q-pa-md">
      <div class="calendar-container">
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { QBtn } from "quasar";

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        locale: "en",
        height: 500,
        expandRows: true,
        dayCellContent: this.renderDayCell, // 요일 셀 커스터마이징
      },
    };
  },
  methods: {
    /**
     * 날짜 셀에 버튼을 추가
     */
    renderDayCell(arg) {
      const button = document.createElement("div");

      // Quasar QBtn을 생성
      const qBtn = this.$createElement(QBtn, {
        props: {
          label: "Action",
          size: "sm",
          color: "primary",
          flat: true,
        },
        on: {
          click: () => this.handleDayButtonClick(arg.date),
        },
      });

      // Vue 컴포넌트의 DOM 노드를 추가
      this.$nextTick(() => {
        if (button && qBtn.$el) {
          button.appendChild(qBtn.$el);
        }
      });

      // 날짜 셀 내용에 버튼 삽입
      const content = arg.dayNumberText; // 날짜 숫자
      const container = document.createElement("div");
      container.innerHTML = content;
      container.appendChild(button);

      return { domNodes: [container] }; // FullCalendar에 반환
    },
    /**
     * 날짜 버튼 클릭 이벤트 처리
     */
    handleDayButtonClick(date) {
      this.$q.dialog({
        title: "Action Triggered",
        message: `You clicked the button for ${date.toDateString()}`,
        ok: { label: "OK", color: "primary" },
      });
    },
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
