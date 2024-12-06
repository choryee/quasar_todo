<template>
  <q-page padding class="custom-page">
    <div class="q-mb-md">
      <div class="text-h5 text-center">Q&A Section</div>
    </div>

    <!-- 질문 등록 -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <q-input
          v-model="newQuestion"
          outlined
          label="Ask a question"
          class="q-mb-sm"
        />
        <q-btn
          label="Submit Question"
          color="primary"
          @click="submitQuestion"
          :disable="!newQuestion.trim()"
        />
      </q-card-section>
    </q-card>

    <!-- 질문 리스트 -->
    <q-list bordered>
      <q-item v-for="(question, index) in paginatedQuestions" :key="question.id">
        <q-item-section>
          <!-- 질문 -->
          <div>
            <span class="text-weight-bold">{{ question.displayNumber }}:</span>
            <div v-if="question.isEditing">
              <q-input
                v-model="question.text"
                outlined
                label="Edit Question"
                class="q-mb-sm"
              />
              <q-btn
                label="Save"
                color="secondary"
                @click="saveQuestion(question)"
                class="q-mt-sm"
              />
            </div>
            <div v-else>
              {{ question.text }}
              <q-btn
                icon="edit"
                size="sm"
                class="q-ml-sm"
                @click="editQuestion(question)"
              />
            </div>
          </div>

          <!-- 답변 등록 -->
          <div v-for="(answer, i) in question.answers" :key="i" class="q-mt-sm">
            <div v-if="answer.isEditing">
              <q-input
                v-model="answer.text"
                outlined
                label="Edit Answer"
                class="q-mb-sm"
              />
              <q-btn
                label="Save"
                color="secondary"
                @click="saveAnswer(question, i)"
                class="q-mt-sm"
              />
            </div>
            <div v-else>
              <span class="text-weight-bold">Answer {{ i + 1 }}:</span> {{ answer.text }}
              <q-btn
                icon="edit"
                size="sm"
                class="q-ml-sm"
                @click="editAnswer(question, i)"
              />
            </div>
          </div>

          <!-- 답변 입력 필드 -->
          <q-input
            v-model="newAnswers[question.id]"
            outlined
            label="Add an answer"
            class="q-mt-sm"
          />
          <q-btn
            label="Submit Answer"
            color="secondary"
            class="q-mt-sm"
            @click="submitAnswer(question.id)"
            :disable="!newAnswers[question.id] || !newAnswers[question.id].trim()"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 페이징 -->
    <q-pagination
      v-model="currentPage"
      :max="maxPage"
      class="q-mt-lg text-center"
      color="primary"
    />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      newQuestion: "",
      newAnswers: {},
      currentPage: 1,
      rowsPerPage: 2,
      totalQuestions: 0, // 전체 질문 수 (넘버링을 위해 사용)
    };
  },
  computed: {
    maxPage() {
      return Math.ceil(this.questions.length / this.rowsPerPage);
    },
    paginatedQuestions() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;

      // 질문들을 내림차순으로 처리하고, 최신 질문이 첫 페이지 상단에 배치
      const paged = this.questions.slice(start, end);

      // 넘버링을 내림차순으로 처리, displayNumber로 숫자만 표시
      return paged.map((question, index) => ({
        ...question,
        displayNumber: this.totalQuestions - (start + index) // 내림차순으로 넘버링
      }));
    },
  },
  methods: {
    submitQuestion() {
      if (this.newQuestion.trim()) {
        // 새 질문을 배열의 맨 앞에 추가
        this.questions.unshift({
          id: Date.now(), // 고유한 ID를 추가
          text: this.newQuestion,
          answers: [],
          isEditing: false
        });
        this.totalQuestions = this.questions.length;  // 전체 질문 수 갱신
        this.newQuestion = "";  // 입력 필드 초기화
        this.currentPage = 1;  // 새 질문 추가 후 첫 페이지로 이동
      }
    },
    submitAnswer(questionId) {
      const answerText =
        this.newAnswers[questionId] && this.newAnswers[questionId].trim();
      if (answerText) {
        const question = this.questions.find((q) => q.id === questionId);
        if (question) {
          question.answers.push({ text: answerText, isEditing: false });
        }
        this.newAnswers[questionId] = ""; // 답변 입력 필드 초기화
      }
    },
    editQuestion(question) {
      question.isEditing = true;
    },
    saveQuestion(question) {
      question.isEditing = false;
    },
    editAnswer(question, index) {
      this.$set(question.answers, index, { ...question.answers[index], isEditing: true });
    },
    saveAnswer(question, index) {
      this.$set(question.answers, index, { ...question.answers[index], isEditing: false });
    },
  },
};
</script>

<style scoped>
.q-list {
  max-width: 800px;
  margin: 0 auto;
}
.q-pagination {
  margin-top: 16px;
}

.custom-page {
  min-height: 400px !important; /* 400px로 조정 */
}
</style>
