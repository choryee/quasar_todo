<template>
  <div>
    <q-page padding class="custom-page">
      <div class="text-h5 text-center q-mb-md">Daily Expressions & Feedback</div>

      <!-- 날짜 필터 -->
      <q-input
        v-model="selectedDate"
        mask="####-##-##"
        label="Select a Date"
        outlined
        class="q-mb-md"
        type="date"
        @input="filterByDate"
      />

      <!-- 표현과 피드백 리스트 -->
      <q-list bordered>
        <q-item
          v-for="(entry, index) in filteredEntries"
          :key="index"
          clickable
          @click="toggleExpanded(index)"
        >
          <q-item-section>
            <div>
              <span class="text-weight-bold">Expression:</span> {{ entry.expression }}
            </div>
            <div v-if="expandedIndex === index" class="q-mt-sm">
              <div>
                <span class="text-weight-bold">Feedback:</span> {{ entry.feedback }}
              </div>
              <div>
                <span class="text-weight-bold">Instructor:</span> {{ entry.instructor }}
              </div>
              <div>
                <span class="text-weight-bold">Date:</span> {{ entry.date }}
              </div>
              <!-- 막대그래프 -->
              <div class="q-mt-md">
                <canvas :id="`barChart-${index}`"></canvas>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import Chart from 'chart.js';

export default {
  data() {
    return {
      feedbackEntries: [
        {
          date: "2024-11-20",
          expression: "How do you do?",
          feedback: "Good pronunciation! Try using this in different contexts.",
          instructor: "John Doe",
          scores: { pronunciation: 8, grammar: 7.5, expression: 1.5 },
        },
        {
          date: "2024-11-21",
          expression: "Could you help me with this?",
          feedback: "Great usage! Practice tone for polite requests.",
          instructor: "Jane Smith",
          scores: { pronunciation: 8.5, grammar: 8.0, expression: 3.0 },
        },
        {
          date: "2024-11-22",
          expression: "Let me think about it.",
          feedback: "Perfectly said. Emphasize 'think' to add more clarity.",
          instructor: "John Doe",
          scores: { pronunciation: 7.0, grammar: 8.5, expression: 2.0 },
        },
      ],
      selectedDate: "",
      filteredEntries: [],
      expandedIndex: null, // 확장된 아이템 인덱스
    };
  },
  methods: {
    filterByDate() {
      if (this.selectedDate) {
        this.filteredEntries = this.feedbackEntries.filter(
          (entry) => entry.date === this.selectedDate
        );
      } else {
        this.filteredEntries = this.feedbackEntries;
      }
    },
    toggleExpanded(index) {
      if (this.expandedIndex === index) {
        this.expandedIndex = null;
        return;
      }
      this.expandedIndex = index;
      nextTick(() => {
        this.renderBarChart(index);
      });
    },
    renderBarChart(index) {
      const entry = this.filteredEntries[index];
      const ctx = document.getElementById(`barChart-${index}`).getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Pronunciation", "Grammar", "Expression"],
          datasets: [
            {
              label: "Scores",
              data: [
                entry.scores.pronunciation,
                entry.scores.grammar,
                entry.scores.expression,
              ],
              backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
              borderColor: ["#1E88E5", "#43A047", "#FB8C00"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.filteredEntries = this.feedbackEntries;
  },
};
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: 0 auto;
}
.q-item {
  border-bottom: 1px solid #e0e0e0;
}

/* q-page의 기본 스타일을 덮어쓰기 */
.custom-page {
  min-height: 400px !important; /* 400px로 조정 */
}
</style>
